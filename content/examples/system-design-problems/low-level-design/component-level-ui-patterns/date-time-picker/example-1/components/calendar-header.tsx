// CalendarHeader — Month/year navigation with dropdowns

"use client";

import { useCallback, useMemo, useState } from "react";
import { useDatePickerStore } from "../lib/date-picker-store";
import { useDatePicker } from "../../hooks/use-date-picker";
import { getMonthNames, formatMonthYear } from "../lib/datetime-utils";

export function CalendarHeader() {
  const { currentMonth, currentYear, goToPrevMonth, goToNextMonth, jumpTo } =
    useDatePicker();
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const monthNames = useMemo(() => getMonthNames(), []);

  // Generate year options (current year +/- 5 years)
  const yearOptions = useMemo(() => {
    const currentYearNum = new Date().getFullYear();
    const years: number[] = [];
    for (let i = currentYearNum - 5; i <= currentYearNum + 5; i++) {
      years.push(i);
    }
    return years;
  }, []);

  const handleMonthSelect = useCallback(
    (month: number) => {
      jumpTo(month, currentYear);
      setShowMonthDropdown(false);
    },
    [jumpTo, currentYear]
  );

  const handleYearSelect = useCallback(
    (year: number) => {
      jumpTo(currentMonth, year);
      setShowYearDropdown(false);
    },
    [jumpTo, currentMonth]
  );

  // Display text for current month/year
  const displayText = useMemo(() => {
    const date = new Date(currentYear, currentMonth, 1);
    return formatMonthYear(date);
  }, [currentYear, currentMonth]);

  return (
    <div className="flex items-center justify-between">
      {/* Prev month */}
      <button
        type="button"
        onClick={goToPrevMonth}
        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-label="Previous month"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Month/Year display with dropdowns */}
      <div className="flex items-center gap-1">
        {/* Month dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            className="rounded-md px-2 py-1 text-sm font-semibold text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            aria-label="Select month"
            aria-expanded={showMonthDropdown}
          >
            {monthNames[currentMonth]}
          </button>
          {showMonthDropdown && (
            <div className="absolute z-10 mt-1 grid w-40 grid-cols-3 gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-600 dark:bg-gray-800">
              {monthNames.map((name, index) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleMonthSelect(index)}
                  className={[
                    "rounded px-2 py-1.5 text-xs transition-colors",
                    index === currentMonth
                      ? "bg-blue-600 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                  ].join(" ")}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Year dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="rounded-md px-2 py-1 text-sm font-semibold text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            aria-label="Select year"
            aria-expanded={showYearDropdown}
          >
            {currentYear}
          </button>
          {showYearDropdown && (
            <div className="absolute z-10 mt-1 grid w-24 grid-cols-2 gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-600 dark:bg-gray-800">
              {yearOptions.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => handleYearSelect(year)}
                  className={[
                    "rounded px-2 py-1.5 text-xs transition-colors",
                    year === currentYear
                      ? "bg-blue-600 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                  ].join(" ")}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Next month */}
      <button
        type="button"
        onClick={goToNextMonth}
        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-label="Next month"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
