"use client";

import React from 'react';
import type { CalendarEvent } from '../lib/calendar-types';
import type { DateRange } from '../hooks/use-calendar-navigation';
import { generateTimeSlots, getTimeOffsetPx, getEventHeightPx } from '../lib/time-slot-utils';
import CalendarEvent from './calendar-event';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SLOT_HEIGHT_PX = 48;
const GRANULARITY = 30;

interface CalendarWeekViewProps {
  occurrences: (CalendarEvent & { columnIndex: number; totalColumns: number })[];
  dateRange: DateRange;
}

export default function CalendarWeekView({ occurrences, dateRange }: CalendarWeekViewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const timeSlots = React.useMemo(() => generateTimeSlots(new Date(), GRANULARITY), []);

  // Get the 7 days of the visible week
  const weekDays = React.useMemo(() => {
    const days: Date[] = [];
    const current = new Date(dateRange.start);
    for (let i = 0; i < 7; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [dateRange]);

  // Group events by day
  const eventsByDay = React.useMemo(() => {
    const map = new Map<string, (CalendarEvent & { columnIndex: number; totalColumns: number })[]>();
    for (const event of occurrences) {
      const key = event.start.toDateString();
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(event);
    }
    return map;
  }, [occurrences]);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Current time indicator position
  const nowPositionPx = React.useMemo(() => {
    const now = new Date();
    return getTimeOffsetPx(now, SLOT_HEIGHT_PX, GRANULARITY);
  }, []);

  return (
    <div className="flex h-full overflow-hidden" ref={containerRef}>
      {/* Time axis */}
      <div className="w-16 flex-shrink-0 border-r border-theme">
        {timeSlots.map((slot, idx) => (
          <div
            key={idx}
            className="relative text-right pr-2"
            style={{ height: SLOT_HEIGHT_PX }}
          >
            <span className="-translate-y-1/2 text-xs text-muted-foreground" style={{ position: 'absolute', top: 0 }}>
              {slot.label}
            </span>
          </div>
        ))}
      </div>

      {/* Day columns */}
      <div className="flex flex-1 overflow-auto">
        {weekDays.map((day) => {
          const dayKey = day.toDateString();
          const dayEvents = eventsByDay.get(dayKey) ?? [];
          const today = isToday(day);

          return (
            <div
              key={dayKey}
              className={`relative min-w-0 flex-1 border-r border-theme ${
                today ? 'bg-accent/5' : ''
              }`}
            >
              {/* Day header */}
              <div className="sticky top-0 z-10 border-b border-theme bg-background px-2 py-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {DAY_LABELS[day.getDay()]}
                  </span>
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      today
                        ? 'bg-accent font-semibold text-accent-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    {day.getDate()}
                  </span>
                </div>
              </div>

              {/* Time grid lines */}
              {timeSlots.map((_, idx) => (
                <div
                  key={idx}
                  className={`border-b ${
                    idx % 2 === 0 ? 'border-theme' : 'border-dashed border-theme/50'
                  }`}
                  style={{ height: SLOT_HEIGHT_PX }}
                />
              ))}

              {/* Current time indicator */}
              {today && (
                <div
                  className="absolute left-0 right-0 z-10 border-t-2 border-red-500"
                  style={{ top: nowPositionPx }}
                >
                  <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
                </div>
              )}

              {/* Events */}
              {dayEvents.map((event) => {
                const topPx = getTimeOffsetPx(event.start, SLOT_HEIGHT_PX, GRANULARITY);
                const heightPx = getEventHeightPx(event.start, event.end, SLOT_HEIGHT_PX, GRANULARITY);
                const colWidth = 100 / event.totalColumns;
                const leftPct = colWidth * event.columnIndex;

                return (
                  <div
                    key={event.id}
                    className="absolute px-0.5"
                    style={{
                      top: topPx,
                      height: heightPx,
                      left: `${leftPct}%`,
                      width: `${colWidth}%`,
                    }}
                  >
                    <CalendarEvent
                      event={event}
                      variant="week"
                      containerRef={containerRef}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
