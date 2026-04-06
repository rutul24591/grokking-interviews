import type { CalendarEvent } from '../lib/calendar-types';

const MAX_OCCURRENCES = 730; // 2 years cap

/**
 * Generates individual occurrence objects from a recurring event definition
 * within a date range.
 *
 * Supports RRULE frequencies: daily, weekly, monthly, yearly with interval
 * multipliers. Handles exception dates by filtering out matching occurrences.
 * Caps infinite recurrences to MAX_OCCURRENCES to prevent runaway computation.
 */
export function expandRecurringEvent(
  event: CalendarEvent,
  rangeStart: Date,
  rangeEnd: Date
): CalendarEvent[] {
  if (!event.recurring) {
    // Single event: check if it overlaps with the range
    if (event.end >= rangeStart && event.start <= rangeEnd) {
      return [event];
    }
    return [];
  }

  const occurrences: CalendarEvent[] = [];
  const duration = event.end.getTime() - event.start.getTime();
  const exceptionSet = new Set(event.recurring.exceptionDates);

  let current = new Date(event.start);
  let count = 0;

  // Determine step function based on frequency
  const stepFn = getStepFunction(
    event.recurring.frequency,
    event.recurring.interval
  );

  while (count < MAX_OCCURRENCES) {
    // Check if we've passed the range end
    if (current > rangeEnd) break;

    // Check explicit end date
    if (event.recurring.endDate && current > event.recurring.endDate) break;

    // Check occurrence count limit
    if (event.recurring.count && count >= event.recurring.count) break;

    const occurrenceEnd = new Date(current.getTime() + duration);

    // Check if occurrence overlaps with the visible range
    if (occurrenceEnd >= rangeStart && current <= rangeEnd) {
      const dateKey = current.toISOString().split('T')[0];

      // Skip exception dates
      if (!exceptionSet.has(dateKey)) {
        occurrences.push({
          ...event,
          id: `${event.id}-${dateKey}`, // Unique ID for this occurrence
          start: new Date(current),
          end: occurrenceEnd,
        });
      }
    }

    current = stepFn(current);
    count++;
  }

  return occurrences;
}

function getStepFunction(
  frequency: string,
  interval: number
): (date: Date) => Date {
  switch (frequency) {
    case 'daily':
      return (date: Date) => {
        const next = new Date(date);
        next.setDate(next.getDate() + interval);
        return next;
      };
    case 'weekly':
      return (date: Date) => {
        const next = new Date(date);
        next.setDate(next.getDate() + interval * 7);
        return next;
      };
    case 'monthly':
      return (date: Date) => {
        const next = new Date(date);
        next.setMonth(next.getMonth() + interval);
        // Handle month-end edge cases (e.g., 31st in a 30-day month)
        const expectedMonth = (date.getMonth() + interval) % 12;
        if (next.getMonth() !== expectedMonth) {
          // We rolled over to the next month, clamp to last day of intended month
          next.setDate(0);
        }
        return next;
      };
    case 'yearly':
      return (date: Date) => {
        const next = new Date(date);
        next.setFullYear(next.getFullYear() + interval);
        // Handle leap year edge cases (Feb 29 in non-leap year)
        if (next.getMonth() !== date.getMonth()) {
          next.setDate(0); // Last day of previous month
        }
        return next;
      };
    default:
      return (date: Date) => {
        const next = new Date(date);
        next.setDate(next.getDate() + 1);
        return next;
      };
  }
}

/**
 * Expands all recurring events in the input array and merges with single events.
 * Returns a sorted array of occurrences within the date range.
 */
export function expandAllRecurringEvents(
  events: CalendarEvent[],
  rangeStart: Date,
  rangeEnd: Date
): CalendarEvent[] {
  const occurrences: CalendarEvent[] = [];

  for (const event of events) {
    if (event.recurring) {
      const expanded = expandRecurringEvent(event, rangeStart, rangeEnd);
      occurrences.push(...expanded);
    } else {
      // Single event: include if it overlaps with the range
      if (event.end >= rangeStart && event.start <= rangeEnd) {
        occurrences.push(event);
      }
    }
  }

  // Sort by start time
  occurrences.sort((a, b) => a.start.getTime() - b.start.getTime());

  return occurrences;
}
