// Date/Time utility functions — pure, side-effect-free
// Uses native Intl API for formatting, timezone conversion, and DST detection

import type { DateFormat, TimeFormat, TimeZone, CalendarDay } from "./datetime-types";
import type { DisabledDateFn } from "./datetime-types";

// ─── Formatter Cache ─────────────────────────────────────────────────────────
// Reuse Intl.DateTimeFormat instances to avoid expensive re-creation

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(
  locale: string,
  timeZone: string | undefined,
  options: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat {
  const key = JSON.stringify({ locale, timeZone, options });
  if (!formatterCache.has(key)) {
    formatterCache.set(key, new Intl.DateTimeFormat(locale, { ...options, timeZone }));
  }
  return formatterCache.get(key)!;
}

// ─── Date Formatting ─────────────────────────────────────────────────────────

export function formatDate(
  date: Date,
  format: DateFormat,
  locale: string = "en-US"
): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const pad = (n: number) => n.toString().padStart(2, "0");

  switch (format) {
    case "MM/DD/YYYY":
      return `${pad(month)}/${pad(day)}/${year}`;
    case "DD/MM/YYYY":
      return `${pad(day)}/${pad(month)}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${pad(month)}-${pad(day)}`;
    default:
      return `${pad(month)}/${pad(day)}/${year}`;
  }
}

export function formatTime(
  hour: number,
  minute: number,
  second: number,
  format: TimeFormat
): string {
  const pad = (n: number) => n.toString().padStart(2, "0");

  if (format === "24h") {
    return `${pad(hour)}:${pad(minute)}:${pad(second)}`;
  }

  const isPM = hour >= 12;
  const displayHour = hour % 12 || 12;
  const period = isPM ? "PM" : "AM";
  return `${displayHour}:${pad(minute)}:${pad(second)} ${period}`;
}

export function formatMonthYear(
  date: Date,
  locale: string = "en-US"
): string {
  const formatter = getFormatter(locale, undefined, {
    month: "long",
    year: "numeric",
  });
  return formatter.format(date);
}

export function formatWeekday(date: Date, locale: string = "en-US"): string {
  const formatter = getFormatter(locale, undefined, { weekday: "short" });
  return formatter.format(date);
}

export function formatFullDateForScreenReader(
  date: Date,
  locale: string = "en-US"
): string {
  const formatter = getFormatter(locale, undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return formatter.format(date);
}

// ─── Date Parsing ────────────────────────────────────────────────────────────

export function parseDate(
  input: string,
  format: DateFormat
): Date | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let month: number, day: number, year: number;

  try {
    switch (format) {
      case "MM/DD/YYYY": {
        const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (!match) return null;
        month = parseInt(match[1], 10) - 1;
        day = parseInt(match[2], 10);
        year = parseInt(match[3], 10);
        break;
      }
      case "DD/MM/YYYY": {
        const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (!match) return null;
        day = parseInt(match[1], 10);
        month = parseInt(match[2], 10) - 1;
        year = parseInt(match[3], 10);
        break;
      }
      case "YYYY-MM-DD": {
        const match = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (!match) return null;
        year = parseInt(match[1], 10);
        month = parseInt(match[2], 10) - 1;
        day = parseInt(match[3], 10);
        break;
      }
      default:
        return null;
    }

    // Validate ranges
    if (month < 0 || month > 11 || day < 1 || day > 31 || year < 1900 || year > 2100) {
      return null;
    }

    const result = new Date(year, month, day);

    // Check if the date is valid (e.g., Feb 30 would roll over)
    if (
      result.getFullYear() !== year ||
      result.getMonth() !== month ||
      result.getDate() !== day
    ) {
      return null;
    }

    return result;
  } catch {
    return null;
  }
}

// ─── Calendar Math ───────────────────────────────────────────────────────────

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay(); // 0 = Sunday
}

export function generateCalendarGrid(
  year: number,
  month: number,
  today: Date,
  selectedDate: Date | null,
  rangeStart: Date | null,
  rangeEnd: Date | null,
  hoverDate: Date | null,
  disabledDateFn?: DisabledDateFn,
  minDate?: Date,
  maxDate?: Date,
  weekStartsOn: 0 | 1 = 0 // 0 = Sunday, 1 = Monday
): CalendarDay[][] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Adjust for week start day
  const offset = ((firstDay - weekStartsOn) + 7) % 7;

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;

  const isSameDay = (a: Date, b: Date): boolean =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isDateInRange = (date: Date): boolean => {
    if (!rangeStart || !rangeEnd) return false;
    const start = rangeStart < rangeEnd ? rangeStart : rangeEnd;
    const end = rangeStart < rangeEnd ? rangeEnd : rangeStart;
    return date > start && date < end;
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
    if (maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true;
    if (disabledDateFn) return disabledDateFn(date);
    return false;
  };

  const grid: CalendarDay[][] = [];
  let dayCounter = 1;
  let nextMonthDay = 1;

  for (let row = 0; row < 6; row++) {
    const week: CalendarDay[] = [];

    for (let col = 0; col < 7; col++) {
      let date: Date;
      let isCurrentMonth = true;

      const cellIndex = row * 7 + col;

      if (cellIndex < offset) {
        // Previous month's trailing days
        const prevDay = daysInPrevMonth - offset + cellIndex + 1;
        date = new Date(prevMonthYear, prevMonth, prevDay);
        isCurrentMonth = false;
      } else if (dayCounter <= daysInMonth) {
        // Current month's days
        date = new Date(year, month, dayCounter);
        dayCounter++;
      } else {
        // Next month's leading days
        date = new Date(nextMonthYear, nextMonth, nextMonthDay);
        nextMonthDay++;
        isCurrentMonth = false;
      }

      week.push({
        date,
        isCurrentMonth,
        isToday: isSameDay(date, today),
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
        isDisabled: isDateDisabled(date),
        isRangeStart: rangeStart ? isSameDay(date, rangeStart) : false,
        isRangeEnd: rangeEnd ? isSameDay(date, rangeEnd) : false,
        isInRange: isDateInRange(date),
        isHovered: hoverDate ? isSameDay(date, hoverDate) : false,
      });
    }

    grid.push(week);

    // Stop if we've filled all 6 rows and no more next-month days needed
    if (dayCounter > daysInMonth && grid.length >= 6) break;
  }

  // Ensure exactly 6 rows (some months need only 5, but we always render 6 for consistency)
  while (grid.length < 6) {
    const lastRow: CalendarDay[] = [];
    const lastDate = grid[grid.length - 1]?.[6]?.date || new Date(year, month, daysInMonth);
    for (let col = 0; col < 7; col++) {
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + col + 1);
      lastRow.push({
        date: nextDate,
        isCurrentMonth: false,
        isToday: isSameDay(nextDate, today),
        isSelected: selectedDate ? isSameDay(nextDate, selectedDate) : false,
        isDisabled: isDateDisabled(nextDate),
        isRangeStart: rangeStart ? isSameDay(nextDate, rangeStart) : false,
        isRangeEnd: rangeEnd ? isSameDay(nextDate, rangeEnd) : false,
        isInRange: isDateInRange(nextDate),
        isHovered: hoverDate ? isSameDay(nextDate, hoverDate) : false,
      });
    }
    grid.push(lastRow);
  }

  return grid;
}

// ─── Timezone Conversion ─────────────────────────────────────────────────────

export function convertTimezone(
  date: Date,
  targetTimezone: string
): Date {
  // Get the components in the target timezone
  const formatter = getFormatter("en-US", targetTimezone, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: string): string =>
    parts.find((p) => p.type === type)?.value || "0";

  return new Date(
    parseInt(getPart("year"), 10),
    parseInt(getPart("month"), 10) - 1,
    parseInt(getPart("day"), 10),
    parseInt(getPart("hour"), 10),
    parseInt(getPart("minute"), 10),
    parseInt(getPart("second"), 10)
  );
}

export function getUtcOffset(
  date: Date,
  timezone: string
): string {
  const formatter = getFormatter("en-US", timezone, {
    timeZoneName: "longOffset",
  });

  const parts = formatter.formatToParts(date);
  const timeZoneName = parts.find((p) => p.type === "timeZoneName");

  if (timeZoneName) {
    // Extract UTC offset from the timeZoneName part (e.g., "GMT-5:00" or "GMT+5:30")
    const match = timeZoneName.value.match(/GMT([+-]\d{2}:\d{2})/);
    if (match) {
      return `UTC${match[1]}`;
    }
  }

  // Fallback: compute offset manually
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
  const offsetMs = tzDate.getTime() - utcDate.getTime();
  const offsetHours = Math.floor(offsetMs / (1000 * 60 * 60));
  const offsetMinutes = Math.abs((offsetMs % (1000 * 60 * 60)) / (1000 * 60));
  const sign = offsetMs >= 0 ? "+" : "-";
  return `UTC${sign}${Math.abs(offsetHours).toString().padStart(2, "0")}:${offsetMinutes.toString().padStart(2, "0")}`;
}

// ─── DST Detection ───────────────────────────────────────────────────────────

export function isDST(date: Date, timezone: string): boolean {
  // Compare UTC offset in January vs July — if they differ, timezone observes DST
  const january = new Date(date.getFullYear(), 0, 1);
  const july = new Date(date.getFullYear(), 6, 1);

  const janOffset = getOffsetMinutes(january, timezone);
  const julOffset = getOffsetMinutes(july, timezone);

  // If offsets differ, timezone observes DST. Check which offset the target date has.
  const targetOffset = getOffsetMinutes(date, timezone);
  return targetOffset === Math.max(janOffset, julOffset);
}

function getOffsetMinutes(date: Date, timezone: string): number {
  const utcStr = date.toLocaleString("en-US", { timeZone: "UTC" });
  const tzStr = date.toLocaleString("en-US", { timeZone: timezone });
  const utcDate = new Date(utcStr);
  const tzDate = new Date(tzStr);
  return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
}

// ─── Timezone List ───────────────────────────────────────────────────────────

export const COMMON_TIMEZONES: TimeZone[] = [
  { id: "America/New_York", label: "Eastern Time (US & Canada)", utcOffset: "UTC-5:00", isDST: false },
  { id: "America/Chicago", label: "Central Time (US & Canada)", utcOffset: "UTC-6:00", isDST: false },
  { id: "America/Denver", label: "Mountain Time (US & Canada)", utcOffset: "UTC-7:00", isDST: false },
  { id: "America/Los_Angeles", label: "Pacific Time (US & Canada)", utcOffset: "UTC-8:00", isDST: false },
  { id: "America/Anchorage", label: "Alaska", utcOffset: "UTC-9:00", isDST: false },
  { id: "Pacific/Honolulu", label: "Hawaii", utcOffset: "UTC-10:00", isDST: false },
  { id: "America/Sao_Paulo", label: "Brasilia", utcOffset: "UTC-3:00", isDST: false },
  { id: "Europe/London", label: "London", utcOffset: "UTC+0:00", isDST: false },
  { id: "Europe/Paris", label: "Central European Time", utcOffset: "UTC+1:00", isDST: false },
  { id: "Europe/Moscow", label: "Moscow", utcOffset: "UTC+3:00", isDST: false },
  { id: "Asia/Dubai", label: "Gulf Standard Time", utcOffset: "UTC+4:00", isDST: false },
  { id: "Asia/Kolkata", label: "India Standard Time", utcOffset: "UTC+5:30", isDST: false },
  { id: "Asia/Shanghai", label: "China Standard Time", utcOffset: "UTC+8:00", isDST: false },
  { id: "Asia/Tokyo", label: "Japan Standard Time", utcOffset: "UTC+9:00", isDST: false },
  { id: "Asia/Seoul", label: "Korea Standard Time", utcOffset: "UTC+9:00", isDST: false },
  { id: "Australia/Sydney", label: "Australian Eastern Time", utcOffset: "UTC+10:00", isDST: false },
  { id: "Pacific/Auckland", label: "New Zealand Standard Time", utcOffset: "UTC+12:00", isDST: false },
];

export function populateDSTStatus(timezones: TimeZone[], date: Date): TimeZone[] {
  return timezones.map((tz) => ({
    ...tz,
    isDST: isDST(date, tz.id),
    utcOffset: getUtcOffset(date, tz.id),
  }));
}

// ─── Utility Helpers ─────────────────────────────────────────────────────────

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function clampDate(date: Date, minDate?: Date, maxDate?: Date): Date {
  if (minDate && date < minDate) return new Date(minDate);
  if (maxDate && date > maxDate) return new Date(maxDate);
  return new Date(date);
}

export function isDateDisabled(
  date: Date,
  disabledDateFn?: DisabledDateFn,
  minDate?: Date,
  maxDate?: Date
): boolean {
  const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (minDate) {
    const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    if (normalized < min) return true;
  }
  if (maxDate) {
    const max = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
    if (normalized > max) return true;
  }
  if (disabledDateFn) return disabledDateFn(normalized);
  return false;
}

export function getMonthNames(locale: string = "en-US"): string[] {
  const formatter = getFormatter(locale, undefined, { month: "long" });
  return Array.from({ length: 12 }, (_, i) =>
    formatter.format(new Date(2026, i, 1))
  );
}

export function getWeekdayNames(locale: string = "en-US", weekStartsOn: 0 | 1 = 0): string[] {
  const formatter = getFormatter(locale, undefined, { weekday: "short" });
  const days = Array.from({ length: 7 }, (_, i) => {
    // Jan 4, 2026 is a Sunday (day 0)
    const date = new Date(2026, 0, 4 + i);
    return formatter.format(date);
  });

  if (weekStartsOn === 1) {
    // Rotate: Monday first
    return [...days.slice(1), days[0]];
  }
  return days;
}
