import {
  formatFHIRDate,
  formatFHIRDateTime,
  parseFHIRDate,
  parseFHIRTime,
} from 'aidbox-react/lib/utils/date';

import { Period, PractitionerRoleAvailableTime, Slot } from 'shared/src/contrib/aidbox';

export function generateSlots(
  availableTimes: PractitionerRoleAvailableTime[],
  start: string,
  end: string,
  slotDurationMinutes = 30,
) {
  // TODO: must be Slot here, but don't know how to be with schedule attr
  let slots: any[] = [];

  const daysRange = getDaysRange(start, end);
  daysRange.forEach((dayDate) => {
    const parsedDayDate = parseFHIRDate(dayDate);
    const dayOfWeek = parsedDayDate.locale('en').format('ddd').toLowerCase();
    availableTimes.forEach((availableTime) => {
      availableTime.daysOfWeek?.forEach((availableTimeDayOfWeek) => {
        if (dayOfWeek === availableTimeDayOfWeek) {
          const timePeriods = getTimePeriods(
            dayDate,
            availableTime.availableStartTime!,
            availableTime.availableEndTime!,
            slotDurationMinutes,
          );
          timePeriods.forEach((timePeriod) => {
            slots.push(generateSlotTemplate(timePeriod.start, timePeriod.end));
          });
        }
      });
    });
  });

  return slots;
}

export function generateSlotTemplate(
  start: string,
  end: string,
  props?: Partial<Slot>,
): Partial<Slot> {
  return {
    resourceType: 'Slot',
    start,
    end,
    status: 'free',
    ...(props || {}),
  };
}

function getDaysRange(startDate: string, endDate: string): string[] {
  const parsedStartDate = parseFHIRDate(startDate);
  const parsedEndDate = parseFHIRDate(endDate);
  let currentDate = parsedStartDate.clone();
  let daysRange = [];
  while (currentDate <= parsedEndDate) {
    daysRange.push(formatFHIRDate(currentDate));
    currentDate = currentDate.clone().add(1, 'day');
  }

  return daysRange;
}

// TODO: add an ability to pass only start datetime and end datetime
export function getTimePeriods(
  dayDate: string,
  startTime: string,
  endTime: string,
  slotDurationMinutes: number,
) {
  const parsedDayDate = parseFHIRDate(dayDate);
  const parsedStartTime = parseFHIRTime(startTime);
  const parsedEndTime = parseFHIRTime(endTime);
  const dayStartDateTime = parsedDayDate
    .clone()
    .add(parsedStartTime.hours(), 'hours')
    .add(parsedStartTime.minutes(), 'minutes');
  const dayEndDateTime = parsedDayDate
    .clone()
    .add(parsedEndTime.hours(), 'hours')
    .add(parsedEndTime.minutes(), 'minutes');
  let dayCurrentDateTime = dayStartDateTime.clone();
  let timePeriods: Array<Required<Pick<Period, 'start' | 'end'>>> = [];

  while (dayCurrentDateTime < dayEndDateTime) {
    const dayNextDateTime = dayCurrentDateTime.clone().add(slotDurationMinutes, 'minutes');
    timePeriods.push({
      start: formatFHIRDateTime(dayCurrentDateTime),
      end: formatFHIRDateTime(dayNextDateTime),
    });
    dayCurrentDateTime = dayNextDateTime;
  }

  return timePeriods;
}
