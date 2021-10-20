import {
  formatFHIRDate,
  formatFHIRDateTime,
  parseFHIRDate,
  parseFHIRTime,
} from 'aidbox-react/lib/utils/date';

import { Period, PractitionerRoleAvailableTime, Slot } from 'shared/src/contrib/aidbox';

export type ScheduleBreak = Period & { removed?: boolean };
export type DaySchedule = Period & { breaks: ScheduleBreak[] };
export type DaySchedules = {
  [day: string]: DaySchedule;
};
export const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
export const daysMapping: { [x: string]: string } = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

export function fromAvailableTime(availableTimes: PractitionerRoleAvailableTime[]): DaySchedules {
  const availableTimesByDay = availableTimes.reduce(
    (acc, availableTime) =>
      (availableTime.daysOfWeek || []).reduce(
        (dayAcc, day) => ({
          ...dayAcc,
          [day]: [
            ...(dayAcc[day] || []),
            {
              start: availableTime.availableStartTime,
              end: availableTime.availableEndTime,
            },
          ],
        }),
        acc,
      ),
    {} as { [day: string]: Period[] },
  );

  return Object.keys(availableTimesByDay).reduce((acc, day) => {
    const sortedDayAvailableTimes = availableTimesByDay[day].sort((a, b) =>
      a.start!.localeCompare(b.start!),
    );

    let breaks: ScheduleBreak[] = [];
    if (sortedDayAvailableTimes.length > 1) {
      for (let i = 0; i < sortedDayAvailableTimes.length - 1; i++) {
        breaks.push({
          start: sortedDayAvailableTimes[i].end,
          end: sortedDayAvailableTimes[i + 1].start,
        });
      }
    }

    const startPeriod = sortedDayAvailableTimes[0];
    const endPeriod = sortedDayAvailableTimes[sortedDayAvailableTimes.length - 1];

    return {
      ...acc,
      [day]: { start: startPeriod.start, end: endPeriod.end, breaks },
    };
  }, {} as DaySchedules);
}

export function toAvailableTime(schedulesByDay: DaySchedules): PractitionerRoleAvailableTime[] {
  return Object.keys(schedulesByDay).reduce((acc, day) => {
    const schedule = schedulesByDay[day];

    const sortedBreaks = (schedule.breaks || [])
      .filter(({ removed }) => !removed)
      .sort((a, b) => a.start!.localeCompare(b.start!));

    let start = schedule.start;
    let end;

    for (let i = 0; i < sortedBreaks.length; i++) {
      const currentBreak = sortedBreaks[i];
      end = currentBreak.start;

      acc.push({
        daysOfWeek: [day],
        availableStartTime: start,
        availableEndTime: end,
      });

      start = currentBreak.end;
    }

    end = schedule.end;

    acc.push({
      daysOfWeek: [day],
      availableStartTime: start,
      availableEndTime: end,
    });

    return acc;
  }, [] as PractitionerRoleAvailableTime[]);
}

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
