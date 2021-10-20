import { TManifestOperation } from '@aidbox/node-server-sdk';
import { isSuccess, RemoteDataResult } from 'aidbox-react/lib/libs/remoteData';
import {
  getFHIRResource,
  getAllFHIRResources,
  makeReference,
  extractBundleResources,
  getFHIRResources,
} from 'aidbox-react/lib/services/fhir';
import {
  formatFHIRDateTime,
  parseFHIRDate,
  parseFHIRDateTime,
  extractFHIRDate,
  extractFHIRTime,
} from 'aidbox-react/lib/utils/date';

import {
  Appointment,
  Bundle,
  dateTime,
  HealthcareService,
  Period,
  PractitionerRole,
  Slot,
} from 'shared/src/contrib/aidbox';

import { generateSlots, generateSlotTemplate, getTimePeriods } from './utils/utils';

// Prepare for new aidbox-react
// It wraps current aidbox-react services and returns pure Promise
async function removeRD<S = any, F = any>(promise: Promise<RemoteDataResult<S, F>>) {
  const result = await promise;
  if (isSuccess(result)) {
    return result.data;
  }

  throw result.error;
}

export const appointmentBook: TManifestOperation<{ resource: Appointment }> = {
  method: 'POST',
  path: ['Appointment', '$book'],
  handlerFn: async ({ resource }, _) => {
    const appointment = resource!;

    return { resource: appointment };
  },
};

interface AppointmentFindParams {
  start: dateTime;
  end: dateTime;
  specialty?: string;
  'visit-type'?: string;
  practitioner?: string;
  organization?: string;
}

export const appointmentFind: TManifestOperation<{ params: AppointmentFindParams }> = {
  method: 'GET',
  path: ['Appointment', '$find'],
  handlerFn: async ({ params }, _) => {
    return { resource: { resourceType: 'Bundle' } };
  },
};

export async function doAppointmentFind(
  actorId: string,
  visitType: string,
  start: string,
  end: string,
): Promise<Bundle<Appointment>> {
  const practitionerRole = await removeRD(
    getFHIRResource<PractitionerRole>(makeReference('PractitionerRole', actorId)),
  );
  const existingAppointments = await removeRD(
    // TODO: re-write and re-think for date and for dateTime start/end
    getAllFHIRResources<Appointment>('Appointment', {
      date: [
        `ge${formatFHIRDateTime(parseFHIRDate(start).startOf('day'))}`,
        `le${formatFHIRDateTime(parseFHIRDate(end).endOf('day'))}`,
      ],
      actor: actorId,
      'service-type': visitType,
      'status:not': ['entered-in-error', 'cancelled', 'proposed', 'waitlist', 'pending'],
    }),
  )
    .then(extractBundleResources)
    .then((resourcesMap) => resourcesMap.Appointment);

  const slotDuration = 15;
  const allSlots = generateSlots(practitionerRole.availableTime || [], start, end, slotDuration);

  // TODO: fix calculation for multi days
  const existingSlots = existingAppointments.flatMap((appointment) => {
    return getTimePeriods(
      extractFHIRDate(appointment.start!),
      extractFHIRTime(appointment.start!),
      extractFHIRTime(appointment.end!),
      slotDuration,
    ).map((period) => generateSlotTemplate(period.start, period.end));
  });
  console.log(existingSlots);

  // TODO: optimize O(M*N) using hashmap in memory
  const slots = allSlots
    .filter(
      (slot) =>
        !existingSlots.filter(
          (neededSlot) => neededSlot.start === slot.start && neededSlot.end === slot.end,
        ).length,
    )
    .sort((a, b) => a.start.localeCompare(b.start));

  const serviceDuration = await removeRD(
    getFHIRResources<HealthcareService>('HealthcareService', {
      '_has:PractitionerRole:service:id': actorId,
      active: true,
      'service-type': visitType,
    }),
  )
    .then(extractBundleResources)
    .then((resourcesMap) => (resourcesMap.HealthcareService[0] as any)?.duration);

  if (!serviceDuration) {
    throw new Error(`Service duration is not specified for visit type ${visitType}`);
  }

  const longPeriods: Period[] = [];

  if (slots.length) {
    let currentStartTime = slots[0].start!;
    let currentEndTime = slots[0].end!;
    let prevSlot: Slot | null = null;
    slots.forEach((slot) => {
      if (
        parseFHIRDateTime(currentEndTime).diff(parseFHIRDateTime(currentStartTime), 'minutes') ===
        serviceDuration
      ) {
        longPeriods.push({ start: currentStartTime, end: currentEndTime });
        currentStartTime = slot.start!;
        currentEndTime = slot.end!;
      } else {
        if (
          prevSlot &&
          parseFHIRDateTime(slot.start!).diff(parseFHIRDateTime(prevSlot.start!), 'minutes') ===
            slotDuration
        ) {
          currentEndTime = slot.end!;
        } else {
          currentStartTime = slot.start!;
          currentEndTime = slot.end!;
        }
      }

      prevSlot = slot;
    });
  }

  const appointments = longPeriods.map((period) => ({
    resourceType: 'Appointment',
    start: period.start,
    end: period.end,
  }));

  return {
    resourceType: 'Bundle',
    type: 'searchSet',
    total: appointments.length,
    entry: appointments.map((appointment) => ({
      resource: appointment,
    })),
  } as Bundle<Appointment>;
}

// This operation returns Slot and any because free slots can't be real Slot resources
// TODO: discuss and decide how to handle it
type PrefetchedSlot = Slot;

export async function doSlotsPrefetch(
  actorId: string,
  start: string,
  end: string,
): Promise<Bundle<PrefetchedSlot>> {
  const practitionerRole = await removeRD(
    getFHIRResource<PractitionerRole>(makeReference('PractitionerRole', actorId)),
  );
  const existingSlots = await removeRD(
    getAllFHIRResources<Slot>('Slot', {
      start: [`ge${start}`, `lt${end}`],
      'schedule:Schedule.actor': actorId,
    }),
  )
    .then(extractBundleResources)
    .then((resourcesMap) => resourcesMap.Slot);

  const allSlots = generateSlots(practitionerRole.availableTime || [], start, end, 5);

  // TODO: optimize O(M*N) using hashmap in memory
  // TODO: decide what should we return. for now - only available slots, but here we don't check
  // TODO: slot status, FHIR server can return free slot as well
  const slots = allSlots
    .filter(
      (slot) =>
        !existingSlots.filter(
          (neededSlot) => neededSlot.start === slot.start && neededSlot.end === slot.end,
        ).length,
    )
    .sort((a, b) => a.start.localeCompare(b.start));

  return {
    resourceType: 'Bundle',
    type: 'searchSet',
    total: slots.length,
    entry: slots.map((slot) => ({
      resource: slot,
    })),
  } as Bundle<PrefetchedSlot>;
}
