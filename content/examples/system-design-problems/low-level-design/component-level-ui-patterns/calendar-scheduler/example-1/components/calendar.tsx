"use client";

import React from 'react';
import { useCalendarStore, selectCurrentView, selectModalState } from '../lib/calendar-store';
import { useCalendarNavigation } from '../hooks/use-calendar-navigation';
import { useCalendarEvents } from '../hooks/use-calendar-events';
import CalendarMonthView from './calendar-month-view';
import CalendarWeekView from './calendar-week-view';
import EventCreationModal from './event-creation-modal';
import MiniCalendar from './mini-calendar';
import type { CalendarView } from '../lib/calendar-types';

const VIEWS: { key: CalendarView; label: string }[] = [
  { key: 'month', label: 'Month' },
  { key: 'week', label: 'Week' },
  { key: 'day', label: 'Day' },
  { key: 'agenda', label: 'Agenda' },
];

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function Calendar() {
  const currentView = useCalendarStore(selectCurrentView);
  const setView = useCalendarStore((state) => state.setView);
  const modalState = useCalendarStore(selectModalState);
  const { dateRange, goPrev, goNext, goToday, activeDate } = useCalendarNavigation();
  const occurrences = useCalendarEvents(dateRange);

  const periodLabel = React.useMemo(() => {
    const start = dateRange.start;
    const end = dateRange.end;

    if (currentView === 'day') {
      return `${DAY_LABELS[start.getDay()]}, ${MONTH_LABELS[start.getMonth()]} ${start.getDate()}, ${start.getFullYear()}`;
    }

    if (currentView === 'month') {
      return `${MONTH_LABELS[activeDate.getMonth()]} ${activeDate.getFullYear()}`;
    }

    if (currentView === 'week') {
      const startLabel = `${MONTH_LABELS[start.getMonth()].slice(0, 3)} ${start.getDate()}`;
      const endLabel = `${MONTH_LABELS[end.getMonth()].slice(0, 3)} ${end.getDate()}, ${end.getFullYear()}`;
      return `${startLabel} - ${endLabel}`;
    }

    // Agenda
    const startLabel = `${MONTH_LABELS[start.getMonth()].slice(0, 3)} ${start.getDate()}`;
    const endLabel = `${MONTH_LABELS[end.getMonth()].slice(0, 3)} ${end.getDate()}, ${end.getFullYear()}`;
    return `${startLabel} - ${endLabel}`;
  }, [dateRange, currentView, activeDate]);

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-theme px-4 py-3">
        {/* View switcher */}
        <div className="flex gap-1">
          {VIEWS.map((view) => (
            <button
              key={view.key}
              onClick={() => setView(view.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                currentView === view.key
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-panel text-muted-foreground hover:bg-panel-hover'
              }`}
              aria-pressed={currentView === view.key}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-panel-hover"
            aria-label="Previous period"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={goToday}
            className="rounded-md px-3 py-1.5 text-sm font-medium bg-panel text-muted-foreground hover:bg-panel-hover"
          >
            Today
          </button>
          <button
            onClick={goNext}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-panel-hover"
            aria-label="Next period"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2 className="ml-2 text-lg font-semibold">{periodLabel}</h2>
        </div>

        {/* Spacer for alignment */}
        <div className="w-24" />
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar grid */}
        <main className="flex-1 overflow-auto">
          {currentView === 'month' && (
            <CalendarMonthView occurrences={occurrences} dateRange={dateRange} />
          )}
          {currentView === 'week' && (
            <CalendarWeekView occurrences={occurrences} dateRange={dateRange} />
          )}
          {(currentView === 'day' || currentView === 'agenda') && (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <p>{currentView === 'day' ? 'Day view' : 'Agenda view'} — same structure as week view, adapted for single day / list layout.</p>
            </div>
          )}
        </main>

        {/* Sidebar with mini calendar */}
        <aside className="hidden w-64 border-l border-theme p-4 lg:block">
          <MiniCalendar />
        </aside>
      </div>

      {/* Event creation modal */}
      {modalState.isOpen && <EventCreationModal />}
    </div>
  );
}
