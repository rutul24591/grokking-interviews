"use client";

import React, { useState } from 'react';
import { useCalendarStore, selectModalState } from '../lib/calendar-store';
import type { CalendarEvent, RecurrenceFrequency } from '../lib/calendar-types';

const COLORS = [
  '#3b82f6', // blue
  '#22c55e', // green
  '#ef4444', // red
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

export default function EventCreationModal() {
  const modalState = useCalendarStore(selectModalState);
  const closeModal = useCalendarStore((state) => state.closeModal);
  const addEvent = useCalendarStore((state) => state.addEvent);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(
    modalState.prefillStart ? formatDateInput(modalState.prefillStart) : formatDateInput(new Date())
  );
  const [startTime, setStartTime] = useState(
    modalState.prefillStart ? formatTimeInput(modalState.prefillStart) : '09:00'
  );
  const [endTime, setEndTime] = useState(
    modalState.prefillEnd ? formatTimeInput(modalState.prefillEnd) : '10:00'
  );
  const [allDay, setAllDay] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceFrequency | 'none'>('none');
  const [recurrenceEnd, setRecurrenceEnd] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const startDateTime = new Date(`${date}T${allDay ? '00:00' : startTime}`);
    const endDateTime = allDay
      ? new Date(`${date}T23:59`)
      : new Date(`${date}T${endTime}`);

    if (endDateTime <= startDateTime) {
      setError('End time must be after start time');
      return;
    }

    const event: CalendarEvent = {
      id: crypto.randomUUID(),
      title: title.trim(),
      start: startDateTime,
      end: endDateTime,
      color,
      description: description.trim() || undefined,
      allDay,
      recurring:
        recurrence !== 'none'
          ? {
              frequency: recurrence,
              interval: 1,
              exceptionDates: [],
              endDate: recurrenceEnd ? new Date(recurrenceEnd) : undefined,
            }
          : undefined,
    };

    addEvent(event);
    closeModal();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Handle Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="event-modal-title" className="text-lg font-semibold">
            New Event
          </h2>
          <button
            onClick={closeModal}
            className="rounded-md p-1 text-muted-foreground hover:bg-panel-hover"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="event-title" className="mb-1 block text-sm font-medium">
              Title
            </label>
            <input
              id="event-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-theme bg-panel-soft px-3 py-2 text-sm"
              placeholder="Event title"
              autoFocus
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="event-date" className="mb-1 block text-sm font-medium">
              Date
            </label>
            <input
              id="event-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-theme bg-panel-soft px-3 py-2 text-sm"
            />
          </div>

          {/* Time row */}
          {!allDay && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="event-start" className="mb-1 block text-sm font-medium">
                  Start Time
                </label>
                <input
                  id="event-start"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-md border border-theme bg-panel-soft px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="event-end" className="mb-1 block text-sm font-medium">
                  End Time
                </label>
                <input
                  id="event-end"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-md border border-theme bg-panel-soft px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          {/* All-day toggle */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="h-4 w-4 rounded border-theme"
            />
            <span className="text-sm">All-day event</span>
          </label>

          {/* Recurrence */}
          <div>
            <label htmlFor="event-recurrence" className="mb-1 block text-sm font-medium">
              Recurrence
            </label>
            <select
              id="event-recurrence"
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value as RecurrenceFrequency | 'none')}
              className="w-full rounded-md border border-theme bg-panel-soft px-3 py-2 text-sm"
            >
              <option value="none">Does not repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Recurrence end date */}
          {recurrence !== 'none' && (
            <div>
              <label htmlFor="event-recurrence-end" className="mb-1 block text-sm font-medium">
                End Date (optional)
              </label>
              <input
                id="event-recurrence-end"
                type="date"
                value={recurrenceEnd}
                onChange={(e) => setRecurrenceEnd(e.target.value)}
                className="w-full rounded-md border border-theme bg-panel-soft px-3 py-2 text-sm"
              />
            </div>
          )}

          {/* Color picker */}
          <div>
            <label className="mb-2 block text-sm font-medium">Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-6 w-6 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-foreground' : ''
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="event-description" className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-theme bg-panel-soft px-3 py-2 text-sm"
              placeholder="Add notes..."
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-md px-4 py-2 text-sm font-medium bg-panel text-muted-foreground hover:bg-panel-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTimeInput(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
