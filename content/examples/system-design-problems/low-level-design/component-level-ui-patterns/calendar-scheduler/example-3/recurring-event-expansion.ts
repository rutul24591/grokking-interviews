/**
 * Calendar — Staff-Level Recurring Event Expansion with Exception Handling.
 *
 * Staff differentiator: RRULE parsing with exception dates (EXDATE),
 * modified occurrences (RDATE), and efficient expansion within date ranges.
 */

export interface RecurringEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  rrule: string;
  exdates: Date[]; // Exception dates (skip these occurrences)
  rdates: Date[]; // Additional dates (add these occurrences)
  timezone: string;
}

/**
 * Parses a simplified RRULE string into a structured format.
 */
export function parseRRule(rrule: string): { freq: string; interval: number; count?: number; until?: Date } {
  const parts = rrule.split(';');
  const result: any = { interval: 1 };

  for (const part of parts) {
    const [key, value] = part.split('=');
    switch (key) {
      case 'FREQ': result.freq = value; break;
      case 'INTERVAL': result.interval = parseInt(value, 10); break;
      case 'COUNT': result.count = parseInt(value, 10); break;
      case 'UNTIL': result.until = new Date(value); break;
    }
  }

  return result;
}

/**
 * Expands a recurring event into individual occurrences within a date range,
 * handling exception dates and additional dates.
 */
export function expandRecurringEvent(
  event: RecurringEvent,
  rangeStart: Date,
  rangeEnd: Date,
  maxOccurrences: number = 365,
): { start: Date; end: Date; isException: boolean }[] {
  const rule = parseRRule(event.rrule);
  const occurrences: { start: Date; end: Date; isException: boolean }[] = [];

  let current = new Date(event.startDate);
  let count = 0;
  const duration = event.endDate.getTime() - event.startDate.getTime();

  while (count < maxOccurrences) {
    if (rule.until && current > rule.until) break;
    if (rule.count && count >= rule.count) break;
    if (current > rangeEnd) break;

    // Check if this occurrence is within the range
    const occurrenceEnd = new Date(current.getTime() + duration);
    if (occurrenceEnd >= rangeStart) {
      const isException = event.exdates.some(
        (ex) => ex.toDateString() === current.toDateString(),
      );

      if (!isException) {
        occurrences.push({ start: new Date(current), end: occurrenceEnd, isException: false });
      }
    }

    // Advance to next occurrence
    switch (rule.freq) {
      case 'DAILY': current.setDate(current.getDate() + rule.interval); break;
      case 'WEEKLY': current.setDate(current.getDate() + rule.interval * 7); break;
      case 'MONTHLY': current.setMonth(current.getMonth() + rule.interval); break;
      case 'YEARLY': current.setFullYear(current.getFullYear() + rule.interval); break;
      default: return occurrences;
    }

    count++;
  }

  // Add additional dates (RDATE)
  for (const rdate of event.rdates) {
    if (rdate >= rangeStart && rdate <= rangeEnd) {
      occurrences.push({ start: new Date(rdate), end: new Date(rdate.getTime() + duration), isException: false });
    }
  }

  // Sort by start date
  return occurrences.sort((a, b) => a.start.getTime() - b.start.getTime());
}
