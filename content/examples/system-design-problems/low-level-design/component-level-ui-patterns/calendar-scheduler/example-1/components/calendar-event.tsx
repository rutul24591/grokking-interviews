"use client";

import React from 'react';
import type { CalendarEvent } from '../lib/calendar-types';
import { useEventDrag } from '../hooks/use-event-drag';

interface CalendarEventProps {
  event: CalendarEvent & { columnIndex?: number; totalColumns?: number };
  variant: 'month' | 'week';
  multiDaySpan?: number;
  containerRef?: React.RefObject<HTMLElement | null>;
}

export default function CalendarEventBlock({
  event,
  variant,
  multiDaySpan,
  containerRef,
}: CalendarEventProps) {
  const {
    isDragging,
    onMoveMouseDown,
    onResizeMouseDown,
  } = useEventDrag(event, containerRef ?? React.createRef());

  const isMultiDayContinuation = multiDaySpan === -1;
  const isMultiDayStart = multiDaySpan !== undefined && multiDaySpan > 1;

  if (isMultiDayContinuation) {
    return (
      <div
        className="overflow-hidden rounded-sm text-xs"
        style={{
          backgroundColor: `${event.color}33`,
          borderLeft: `3px solid ${event.color}`,
        }}
        role="listitem"
        aria-label={`${event.title} (continuation)`}
      >
        <div className="truncate px-1 py-0.5" />
      </div>
    );
  }

  if (variant === 'month') {
    return (
      <div
        className={`overflow-hidden rounded-sm text-xs transition-opacity ${
          isDragging ? 'opacity-50' : ''
        }`}
        style={{
          backgroundColor: `${event.color}33`,
          borderLeft: `3px solid ${event.color}`,
          gridColumn: isMultiDayStart ? `span ${multiDaySpan}` : undefined,
        }}
        role="listitem"
        aria-label={`${event.title}`}
        tabIndex={0}
      >
        <div className="truncate px-1 py-0.5 font-medium" style={{ color: event.color }}>
          {event.title}
        </div>
      </div>
    );
  }

  // Week view
  const durationMinutes = (event.end.getTime() - event.start.getTime()) / 60000;
  const startTime = event.start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const endTime = event.end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <div
      className={`group relative overflow-hidden rounded-md text-xs shadow-sm transition-opacity ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{
        backgroundColor: `${event.color}22`,
        borderLeft: `3px solid ${event.color}`,
      }}
      role="listitem"
      aria-label={`${event.title}, ${startTime} to ${endTime}`}
      tabIndex={0}
    >
      {/* Drag handle */}
      <div
        className="absolute inset-x-0 top-0 z-10 flex h-3 cursor-grab items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
        onMouseDown={onMoveMouseDown}
        role="button"
        aria-label="Drag to move event"
        tabIndex={0}
      >
        <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
          <circle cx="2" cy="3" r="1" fill="currentColor" className="text-muted-foreground" />
          <circle cx="6" cy="3" r="1" fill="currentColor" className="text-muted-foreground" />
          <circle cx="10" cy="3" r="1" fill="currentColor" className="text-muted-foreground" />
        </svg>
      </div>

      {/* Event content */}
      <div className="px-2 pt-3 pb-1">
        <div className="truncate font-semibold" style={{ color: event.color }}>
          {event.title}
        </div>
        {durationMinutes >= 30 && (
          <div className="truncate text-muted-foreground">
            {startTime} - {endTime}
          </div>
        )}
      </div>

      {/* Resize handle */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 flex h-2 cursor-ns-resize items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
        onMouseDown={onResizeMouseDown}
        role="button"
        aria-label="Drag to resize event"
        tabIndex={0}
      >
        <div className="h-0.5 w-6 rounded-full bg-muted-foreground/50" />
      </div>
    </div>
  );
}
