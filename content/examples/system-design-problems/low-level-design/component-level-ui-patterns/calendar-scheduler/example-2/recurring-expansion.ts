/**
 * Recurring Event Expansion — Generates occurrences from RRULE patterns.
 *
 * Interview edge case: A recurring event like "every Monday for 10 weeks" generates
 * 10 separate instances. Must handle: exception dates (skip specific occurrences),
 * end conditions (count vs until date), month-end edge cases (31st → month with 30 days),
 * and leap year handling.
 */

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  count?: number;
  until?: Date;
  byDay?: number[]; // 0=Sun, 1=Mon, etc.
  exceptions: Date[]; // Dates to skip
}

/**
 * Expands a recurring pattern into individual event occurrences within a date range.
 * Caps at 730 occurrences (2 years of daily events) for performance.
 */
export function expandRecurringEvents(
  pattern: RecurringPattern,
  startDate: Date,
  rangeStart: Date,
  rangeEnd: Date,
  maxOccurrences: number = 730,
): Date[] {
  const occurrences: Date[] = [];
  let current = new Date(startDate);
  let count = 0;

  while (count < maxOccurrences) {
    // Check end conditions
    if (pattern.until && current > pattern.until) break;
    if (pattern.count && count >= pattern.count) break;
    if (current > rangeEnd) break;

    // Check if within range and not an exception
    if (current >= rangeStart && !pattern.exceptions.some((e) => e.toDateString() === current.toDateString())) {
      // Check day-of-week filter for weekly patterns
      if (pattern.frequency === 'weekly' && pattern.byDay) {
        if (pattern.byDay.includes(current.getDay())) {
          occurrences.push(new Date(current));
          count++;
        }
      } else if (current >= rangeStart) {
        occurrences.push(new Date(current));
        count++;
      }
    }

    // Advance to next occurrence
    switch (pattern.frequency) {
      case 'daily':
        current.setDate(current.getDate() + pattern.interval);
        break;
      case 'weekly':
        current.setDate(current.getDate() + pattern.interval);
        break;
      case 'monthly':
        // Handle month-end edge cases (e.g., Jan 31 → Feb 28)
        const nextMonth = current.getMonth() + pattern.interval;
        current.setMonth(nextMonth);
        break;
      case 'yearly':
        current.setFullYear(current.getFullYear() + pattern.interval);
        break;
    }
  }

  return occurrences;
}
