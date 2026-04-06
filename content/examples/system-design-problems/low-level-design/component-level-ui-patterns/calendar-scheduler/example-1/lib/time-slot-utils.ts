import type { TimeSlot } from '../lib/calendar-types';

/**
 * Generates time slot arrays for week/day views at configurable granularities.
 * Returns slots from 00:00 to 23:59 at the specified interval.
 */
export function generateTimeSlots(
  date: Date,
  granularity: 15 | 30 | 60 = 30
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);

  const totalSlots = (24 * 60) / granularity;

  for (let i = 0; i < totalSlots; i++) {
    const start = new Date(baseDate.getTime() + i * granularity * 60 * 1000);
    const end = new Date(start.getTime() + granularity * 60 * 1000);
    const label = formatHour(start, granularity);

    slots.push({ start, end, label });
  }

  return slots;
}

/**
 * Rounds a Date to the nearest grid boundary for drag positioning.
 * E.g., with 30-min granularity, 9:17 AM snaps to 9:00 AM, 9:40 AM snaps to 9:30 AM.
 */
export function snapToGrid(date: Date, granularity: 15 | 30 | 60 = 30): Date {
  const snapped = new Date(date);
  const minutes = snapped.getMinutes();
  const snappedMinutes = Math.round(minutes / granularity) * granularity;

  snapped.setMinutes(snappedMinutes, 0, 0);

  // Handle overflow past midnight
  if (snappedMinutes >= 60) {
    snapped.setHours(snapped.getHours() + 1);
    snapped.setMinutes(0);
  }

  return snapped;
}

/**
 * Calculates the duration in minutes between two Date objects.
 */
export function calculateDuration(start: Date, end: Date): number {
  const diffMs = end.getTime() - start.getTime();
  return Math.max(0, Math.round(diffMs / 60000));
}

/**
 * Formats an hour label for the time axis based on granularity.
 * Shows only the hour for 60-min slots, hour:minutes for finer granularities.
 */
export function formatHour(date: Date, granularity: 15 | 30 | 60 = 30): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (granularity === 60 && minutes === 0) {
    return formatHour12(hours, 0);
  }

  return formatHour12(hours, minutes);
}

function formatHour12(hours: number, minutes: number): string {
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : '';
  return `${displayHours}${displayMinutes} ${period}`;
}

/**
 * Gets the pixel offset of a time within the day, given the slot height.
 * Used for absolute positioning of events in week/day views.
 */
export function getTimeOffsetPx(
  date: Date,
  slotHeight: number,
  granularity: 15 | 30 | 60 = 30
): number {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  const slotsFromMidnight = totalMinutes / granularity;
  return slotsFromMidnight * slotHeight;
}

/**
 * Gets the pixel height of an event based on its duration.
 */
export function getEventHeightPx(
  start: Date,
  end: Date,
  slotHeight: number,
  granularity: 15 | 30 | 60 = 30
): number {
  const durationMinutes = calculateDuration(start, end);
  const slots = durationMinutes / granularity;
  return Math.max(slotHeight, slots * slotHeight - 2); // -2 for gap between events
}
