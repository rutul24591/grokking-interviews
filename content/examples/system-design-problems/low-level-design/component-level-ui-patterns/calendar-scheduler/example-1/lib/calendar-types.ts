export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurringPattern {
  frequency: RecurrenceFrequency;
  interval: number; // e.g., every 2 weeks = 2
  endDate?: Date;
  count?: number;
  exceptionDates: string[]; // ISO date strings to exclude
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  description?: string;
  allDay: boolean;
  recurring?: RecurringPattern;
  calendarId?: string; // for multi-calendar support
}

export interface TimeSlot {
  start: Date;
  end: Date;
  label: string;
}

export interface CollisionGroup {
  events: CalendarEvent[];
  columnAssignments: Map<string, number>; // eventId -> columnIndex
  totalColumns: number;
}

export interface DragState {
  eventId: string | null;
  mode: 'move' | 'resize' | null;
  previewStart: Date | null;
  previewEnd: Date | null;
  originalStart: Date | null;
  originalEnd: Date | null;
}

export interface ModalState {
  isOpen: boolean;
  prefillStart: Date | null;
  prefillEnd: Date | null;
}
