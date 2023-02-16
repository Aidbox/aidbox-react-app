import { TDispatchProps, TManifestOperation } from '@aidbox/node-server-sdk';
import { TDispatchOutput } from '@aidbox/node-server-sdk/build/src/dispatch';
import {
  TOperationRequest,
  TOperationRequestType,
} from '@aidbox/node-server-sdk/build/src/message';
import { isSuccess, RemoteDataResult } from 'aidbox-react/lib/libs/remoteData';
import {
  getFHIRResource,
  getAllFHIRResources,
  makeReference,
  extractBundleResources,
  getFHIRResources,
  getReference,
  saveFHIRResource,
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
  OperationOutcome,
  Patient,
  Period,
  PractitionerRole,
  Slot,
} from 'shared/src/contrib/aidbox';

import { camelizeParamsNames, generateSlots, generateSlotTemplate, getTimePeriods } from './utils';

// Prepare for new aidbox-react
// It wraps current aidbox-react services and returns pure Promise
async function removeRD<S = any, F = any>(promise: Promise<RemoteDataResult<S, F>>) {
  const result = await promise;
  if (isSuccess(result)) {
    return result.data;
  }

  throw result.error;
}

function operationOutcome(code: string, diagnostics: string) {
  return {
    resourceType: 'OperationOutcome',
    issue: [{ code: 'error', diagnostics: diagnostics }],
  } as OperationOutcome;
}

function safeHandlerFactory<T extends TOperationRequestType = any, U = any>(
  fn: (request: TOperationRequest<T>, props: TDispatchProps<U>) => Promise<TDispatchOutput>,
) {
  return async (request: TOperationRequest<T>, props: TDispatchProps<U>) => {
    try {
      return fn({ ...request, params: camelizeParamsNames(request.params) }, props);
    } catch (err) {
      return {
        resource: err,
      };
    }
  };
}

export const appointmentBook: TManifestOperation<{ resource: Bundle<Appointment | Patient> }> = {
  method: 'POST',
  path: ['Appointment', '$book'],
  handlerFn: safeHandlerFactory(async ({ resource }, _) => {
    if (!resource) {
      throw operationOutcome('badRequest', 'Appointment must be passed');
    }

    return doAppointmentSave(resource);
  }),
};

function doPatientSave(patient: Patient | undefined) {
  if (patient) {
    return removeRD(saveFHIRResource<Patient>(patient));
  }

  return undefined;
}

async function doAppointmentSave(resource: Bundle<Appointment | Patient>) {
  // TODO: validate?
  const appointment = extractBundleResources(resource).Appointment[0];
  // TODO: Save patient and appointment in transaction bundle
  const patient = await doPatientSave(extractBundleResources(resource).Patient?.[0]);

  const practitionerRoleRef = appointment.participant!.find(
    ({ actor }) => actor!.resourceType === 'PractitionerRole',
  )!.actor!;
  const visitType = appointment?.serviceType?.[0]?.coding?.[0]?.code;

  // TODO: use healthcare service from actors
  const healthcareService = await removeRD(
    getFHIRResources<HealthcareService>('HealthcareService', {
      active: true,
      'service-type': visitType,
      '_has:PractitionerRole:service:id': practitionerRoleRef.id,
    }),
  )
    .then(extractBundleResources)
    .then((resourcesMap) => resourcesMap.HealthcareService[0]);

  if (!healthcareService) {
    throw operationOutcome(
      'missingHealthcareService',
      `Service must be set for visit type ${visitType}`,
    );
  }
  if (!healthcareService.duration) {
    throw operationOutcome(
      'missingHealthcareServiceDuration',
      `Service duration is not specified for visit type ${visitType}`,
    );
  }

  const updatedAppointment: Appointment = {
    ...appointment,
    status: 'booked',
    serviceCategory: healthcareService.category,
    serviceType: healthcareService.type,
    specialty: healthcareService.specialty,
    end: formatFHIRDateTime(
      parseFHIRDateTime(appointment.start!).add(healthcareService.duration!, 'minutes'),
    ),
    participant: [
      ...appointment.participant!,
      ...(patient
        ? [
            {
              actor: getReference(patient),
              status: 'accepted',
            },
          ]
        : []),
      { actor: getReference(healthcareService), status: 'accepted' },
    ],
  };
  const savedAppointment = await removeRD(saveFHIRResource<Appointment>(updatedAppointment));

  return { resource: savedAppointment };
}

type TManifestOperationParams = Partial<Record<string, string>>;

interface AppointmentFindParams extends TManifestOperationParams {
  start: dateTime;
  end: dateTime;
  specialty?: string;
  visitType?: string;
  practitioner?: string;
  organization?: string;
  locationReference?: string;
}

export const appointmentFind: TManifestOperation<{ params: AppointmentFindParams }> = {
  method: 'GET',
  path: ['Appointment', '$find'],
  handlerFn: safeHandlerFactory(async ({ params }, _) => {
    return {
      resource: await doAppointmentFind(params),
    };
  }),
};

export async function doAppointmentFind({
  start,
  end,
  practitioner,
  visitType,
  specialty,
  locationReference,
}: AppointmentFindParams): Promise<Bundle<Appointment>> {
  const practitionerRoles = await removeRD(
    getAllFHIRResources<PractitionerRole>('PractitionerRole', {
      practitioner,
      specialty,
      locationReference,
    }),
  )
    .then(extractBundleResources)
    .then((resourcesMap) => resourcesMap.PractitionerRole);

  if (practitionerRoles.length === 0) {
    throw operationOutcome(
      'practitionerRoleNotFound',
      'PractitionerRole with specified specialty and location is not found',
    );
  }

  // TODO: adjust the code to accept multiple practitioner roles, locations and specialty and merge resulting availability times
  if (practitionerRoles.length > 1) {
    throw operationOutcome(
      'multiplePractitionerRoles',
      'Multiple PractitionerRole resources found, please specify either location or specialty',
    );
  }

  const practitionerRole = practitionerRoles[0]!;

  const existingAppointments = await removeRD(
    // TODO: re-write and re-think for date and for dateTime start/end
    getAllFHIRResources<Appointment>('Appointment', {
      date: [
        `ge${formatFHIRDateTime(parseFHIRDate(start).startOf('day'))}`,
        `le${formatFHIRDateTime(parseFHIRDate(end).endOf('day'))}`,
      ],
      actor: practitionerRole.id,
      specialty,
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
      '_has:PractitionerRole:service:id': practitionerRole.id,
      active: true,
      'service-type': visitType,
    }),
  )
    .then(extractBundleResources)
    .then((resourcesMap) => (resourcesMap.HealthcareService[0] as any)?.duration);

  if (!serviceDuration) {
    throw operationOutcome(
      'missingHealthcareServiceDuration',
      `Service duration is not specified for visit type ${visitType}`,
    );
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
    specialty,
    participant: [
      { actor: getReference(practitionerRole) },
      // TODO: add location if passed
    ],
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
