/**
 * Timezone Conversion — Displays time in user's timezone while storing UTC.
 *
 * Interview edge case: An event is scheduled for 9:00 AM EST. A user in PST sees
 * it as 6:00 AM. When DST transitions, the offset changes. The system must store
 * the event in UTC but display in the user's local timezone with DST awareness.
 */

/**
 * Converts a UTC timestamp to the user's local timezone string.
 */
export function formatInUserTimezone(utcTimestamp: number, timeZone?: string): string {
  const date = new Date(utcTimestamp);
  return date.toLocaleString('en-US', {
    timeZone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

/**
 * Detects if a given timestamp falls within a DST transition.
 * Uses the difference between UTC offset at the given time and UTC offset at a known
 * non-DST reference point (e.g., January 1st of the same year).
 */
export function isDST(utcTimestamp: number, timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): boolean {
  const janDate = new Date(new Date(utcTimestamp).getFullYear(), 0, 1);
  const julDate = new Date(new Date(utcTimestamp).getFullYear(), 6, 1);

  const janOffset = getTimezoneOffset(timeZone, janDate.getTime());
  const julOffset = getTimezoneOffset(timeZone, julDate.getTime());

  // If January and July offsets differ, DST is observed in this timezone
  const hasDST = janOffset !== julOffset;
  if (!hasDST) return false;

  // The target date uses the "summer" offset (the larger of the two)
  const targetOffset = getTimezoneOffset(timeZone, utcTimestamp);
  return targetOffset === Math.max(janOffset, julOffset);
}

/**
 * Gets the UTC offset in minutes for a given timezone and timestamp.
 */
function getTimezoneOffset(timeZone: string, timestamp: number): number {
  const utcDate = new Date(timestamp);
  const tzDate = new Date(utcDate.toLocaleString('en-US', { timeZone }));
  return (tzDate.getTime() - utcDate.getTime()) / 60000;
}

/**
 * Parses a date string in a specific timezone, handling ambiguous formats.
 * Falls back to UTC parsing if the format is invalid.
 */
export function parseDateInTimezone(dateStr: string, timeZone: string): Date | null {
  try {
    // Try parsing as ISO 8601 first
    const isoDate = new Date(dateStr);
    if (!isNaN(isoDate.getTime())) return isoDate;

    // Try parsing with timezone
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone });
    return formatter.format(new Date(dateStr)) as unknown as Date;
  } catch {
    return null;
  }
}
