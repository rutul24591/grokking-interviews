// Root DatePicker component — composes input, calendar dropdown, timezone display, and time picker

"use client";

import { useEffect, useRef, useState } from "react";
import { useDatePickerStore, initializeDatePicker } from "../lib/date-picker-store";
import { initializeTimePicker } from "../lib/time-picker-store";
import { useDatePicker } from "../../hooks/use-date-picker";
import { useTimePicker } from "../../hooks/use-time-picker";
import { CalendarGrid } from "./calendar-grid";
import { CalendarHeader } from "./calendar-header";
import { TimePicker } from "./time-picker";
import { TimezoneSelector } from "./timezone-selector";
import { DateInput } from "./date-input";
import type { TimeZone } from "../lib/datetime-types";
import { COMMON_TIMEZONES, populateDSTStatus } from "../lib/datetime-utils";

export function DatePicker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState<TimeZone>(COMMON_TIMEZONES[0]);
  const [timezones, setTimezones] = useState(COMMON_TIMEZONES);

  const { isOpen, setIsOpen, dateFormat, selectedDate, mode, rangeStart, rangeEnd } =
    useDatePickerStore();
  const { getDisplayText } = useDatePicker();
  const { formattedTime } = useTimePicker();

  // SSR-safe initialization
  useEffect(() => {
    setIsMounted(true);
    initializeDatePicker();
    initializeTimePicker();
  }, []);

  // Populate DST status for timezones
  useEffect(() => {
    if (!isMounted) return;
    const now = new Date();
    setTimezones(populateDSTStatus(COMMON_TIMEZONES, now));
  }, [isMounted]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard handler — Escape closes
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Combined display text
  const fullDisplayText = (() => {
    const dateText = getDisplayText();
    return `${dateText} ${formattedTime}`;
  })();

  return (
    <div ref={containerRef} className="relative inline-block w-full max-w-md">
      {/* Input + Trigger */}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={isMounted ? fullDisplayText : ""}
          readOnly
          onClick={() => setIsOpen(true)}
          placeholder="Select date and time"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label="Date and time picker input"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label={isOpen ? "Close calendar" : "Open calendar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && isMounted && (
        <div
          className="absolute z-50 mt-2 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800"
          role="dialog"
          aria-label="Date picker"
        >
          <CalendarHeader />
          <CalendarGrid />

          {/* Time Picker */}
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <TimePicker />
          </div>

          {/* Timezone Display */}
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <TimezoneSelector
              timezones={timezones}
              selectedTimezone={selectedTimezone}
              onSelect={setSelectedTimezone}
            />
          </div>

          {/* Mode indicator */}
          {mode === "range" && (
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              {rangeStart && !rangeEnd
                ? "Select end date"
                : rangeStart && rangeEnd
                ? `Range: ${rangeStart.toLocaleDateString()} – ${rangeEnd.toLocaleDateString()}`
                : "Select start date"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
