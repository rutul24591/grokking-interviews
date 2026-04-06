"use client";

import React from 'react';
import type { CalendarEvent } from '../lib/calendar-types';
import type { DateRange } from '../hooks/use-calendar-navigation';
import CalendarEvent from './calendar-event';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

interface CalendarMonthViewProps {
  occurrences: (CalendarEvent & { columnIndex: number; totalColumns: number })[];
  dateRange: DateRange;
}

const MAX_VISIBLE_EVENTS = 3;

export default function CalendarMonthView({ occurrences, dateRange }: CalendarMonthViewProps) {
  const days = React.useMemo(() => {
    const days: Date[] = [];
    const current = new Date(dateRange.start);
    while (current <= dateRange.end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [dateRange]);

  // Group events by date
  const eventsByDate = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of occurrences) {
      const key = event.start.toDateString();
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(event);
    }
    return map;
  }, [occurrences]);

  // Build week rows (7 days per row)
  const weeks = React.useMemo(() => {
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    for (const day of days) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    return weeks;
  }, [days]);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isInCurrentMonth = (date: Date) => {
    return date.getMonth() === dateRange.start.getMonth();
  };

  const getMultiDaySpan = (event: CalendarEvent, day: Date) => {
    const startKey = event.start.toDateString();
    const dayKey = day.toDateString();

    if (startKey === dayKey) {
      // First day: check how many more days it spans
      let span = 1;
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      while (nextDay < event.end && span < 7) {
        span++;
        nextDay.setDate(nextDay.getDate() + 1);
      }
      return span;
    }

    if (day > event.start && day <= event.end) {
      // Continuation day
      return -1;
    }

    return 0;
  };

  return (
    <div className="h-full">
      {/* Day-of-week header */}
      <div className="grid grid-cols-7 border-b border-theme">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="px-2 py-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-7 flex-1" role="grid" aria-label="Month calendar view">
        {weeks.map((week, weekIdx) =>
          week.map((day) => {
            const dateKey = day.toDateString();
            const dayEvents = eventsByDate.get(dateKey) ?? [];
            const today = isToday(day);
            const currentMonth = isInCurrentMonth(day);

            return (
              <div
                key={dateKey}
                role="gridcell"
                aria-label={`${day.toDateString()}`}
                tabIndex={0}
                className={`relative min-h-24 border-b border-r border-theme p-1 transition-colors ${
                  !currentMonth ? 'bg-panel-soft text-muted-foreground' : ''
                } ${today ? 'bg-accent/5' : ''}`}
              >
                {/* Day number */}
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                      today
                        ? 'bg-accent font-semibold text-accent-foreground'
                        : ''
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  {day.getMonth() !== dateRange.start.getMonth() && (
                    <span className="text-xs text-muted-foreground">
                      {MONTH_LABELS[day.getMonth()]}
                    </span>
                  )}
                </div>

                {/* Events */}
                <div className="space-y-0.5">
                  {dayEvents.slice(0, MAX_VISIBLE_EVENTS).map((event) => {
                    const span = getMultiDaySpan(event, day);
                    return (
                      <CalendarEvent
                        key={event.id}
                        event={event}
                        variant="month"
                        multiDaySpan={span}
                      />
                    );
                  })}
                  {dayEvents.length > MAX_VISIBLE_EVENTS && (
                    <button
                      className="text-xs font-medium text-muted-foreground hover:text-foreground"
                      aria-label={`${dayEvents.length - MAX_VISIBLE_EVENTS} more events`}
                    >
                      +{dayEvents.length - MAX_VISIBLE_EVENTS} more
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
