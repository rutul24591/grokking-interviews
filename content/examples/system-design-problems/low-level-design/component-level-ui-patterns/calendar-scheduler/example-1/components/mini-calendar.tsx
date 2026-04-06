"use client";

import React from 'react';
import { useCalendarStore, selectActiveDate } from '../lib/calendar-store';
import { useMiniCalendarDays } from '../hooks/use-calendar-navigation';

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function MiniCalendar() {
  const activeDate = useCalendarStore(selectActiveDate);
  const selectDate = useCalendarStore((state) => state.selectDate);
  const setView = useCalendarStore((state) => state.setView);

  const [viewMonth, setViewMonth] = React.useState(new Date(activeDate));
  const days = useMiniCalendarDays(viewMonth);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isActiveDate = (date: Date) => {
    return (
      date.getDate() === activeDate.getDate() &&
      date.getMonth() === activeDate.getMonth() &&
      date.getFullYear() === activeDate.getFullYear()
    );
  };

  const isInCurrentMonth = (date: Date) => {
    return date.getMonth() === viewMonth.getMonth();
  };

  const handlePrevMonth = () => {
    const prev = new Date(viewMonth);
    prev.setMonth(prev.getMonth() - 1);
    setViewMonth(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(viewMonth);
    next.setMonth(next.getMonth() + 1);
    setViewMonth(next);
  };

  const handleDayClick = (date: Date) => {
    selectDate(date);
    setView('day');
  };

  return (
    <div className="w-full">
      {/* Month header */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="rounded-md p-1 text-muted-foreground hover:bg-panel-hover"
          aria-label="Previous month"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-sm font-semibold">
          {MONTH_LABELS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
        </span>
        <button
          onClick={handleNextMonth}
          className="rounded-md p-1 text-muted-foreground hover:bg-panel-hover"
          aria-label="Next month"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Day-of-week header */}
      <div className="mb-1 grid grid-cols-7">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-1 text-center text-xs font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7" role="grid" aria-label="Mini calendar for quick navigation">
        {days.map((day) => {
          const today = isToday(day);
          const active = isActiveDate(day);
          const currentMonth = isInCurrentMonth(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors mx-auto ${
                active
                  ? 'bg-accent font-semibold text-accent-foreground'
                  : today
                    ? 'ring-1 ring-accent font-semibold'
                    : currentMonth
                      ? 'hover:bg-panel-hover'
                      : 'text-muted-foreground/50'
              }`}
              aria-label={day.toDateString()}
              tabIndex={0}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
