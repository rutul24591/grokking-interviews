// Core type definitions for the Date/Time Picker system

export type DateFormat = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";

export type TimeFormat = "12h" | "24h";

export type RecurrenceType =
  | "none"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export type DisabledDateFn = (date: Date) => boolean;

export interface TimeZone {
  id: string; // IANA timezone ID, e.g., "America/New_York"
  label: string; // Display label, e.g., "Eastern Time (US & Canada)"
  utcOffset: string; // UTC offset string, e.g., "UTC-5:00" or "UTC+5:30"
  isDST: boolean; // Whether DST is currently active for this timezone
}

export interface DatePickerState {
  currentMonth: number; // 0-11
  currentYear: number;
  selectedDate: Date | null;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  hoverDate: Date | null; // For range selection preview
  isOpen: boolean; // Calendar dropdown open/closed
  mode: "single" | "range";
  dateFormat: DateFormat;
  disabledDateFn?: DisabledDateFn;
  minDate?: Date;
  maxDate?: Date;
}

export interface TimePickerState {
  hour: number; // 0-23 (internal), 1-12 (display in 12h mode)
  minute: number; // 0-59
  second: number; // 0-59
  isPM: boolean;
  format: TimeFormat;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isHovered: boolean;
}

export interface DateTimeValue {
  date: Date | null;
  hour: number;
  minute: number;
  second: number;
  timezone: TimeZone;
}

export interface DatePickerStoreActions {
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
  navigateMonth: (delta: number) => void;
  selectDate: (date: Date) => void;
  setRangeStart: (date: Date) => void;
  setRangeEnd: (date: Date) => void;
  setHoverDate: (date: Date | null) => void;
  setIsOpen: (open: boolean) => void;
  setMode: (mode: "single" | "range") => void;
  setDateFormat: (format: DateFormat) => void;
  setDisabledDateFn: (fn: DisabledDateFn | undefined) => void;
  reset: () => void;
}

export interface TimePickerStoreActions {
  setHour: (hour: number) => void;
  setMinute: (minute: number) => void;
  setSecond: (second: number) => void;
  toggleAmPm: () => void;
  setFormat: (format: TimeFormat) => void;
  setTime: (hour: number, minute: number, second: number) => void;
  reset: () => void;
}
