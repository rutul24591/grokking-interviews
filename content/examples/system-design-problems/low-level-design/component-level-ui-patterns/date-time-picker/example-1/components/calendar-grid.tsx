// CalendarGrid — Month view grid with weekday headers, day cells, range highlighting

"use client";

import { useDatePicker } from "../../hooks/use-date-picker";
import { formatFullDateForScreenReader, getWeekdayNames } from "../lib/datetime-utils";

export function CalendarGrid() {
  const {
    grid,
    currentMonth,
    currentYear,
    handleDateClick,
    handleDateHover,
    isDisabled,
    isSelected,
    isInRange,
  } = useDatePicker();

  const weekdayNames = getWeekdayNames();

  return (
    <div
      className="mt-2 select-none"
      role="grid"
      aria-label="Calendar"
      aria-multiselectable="false"
    >
      {/* Weekday headers */}
      <div className="mb-1 grid grid-cols-7" role="row">
        {weekdayNames.map((day) => (
          <div
            key={day}
            role="columnheader"
            className="py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
            aria-label={day}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      {grid.map((week, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-7" role="row">
          {week.map((day) => {
            const ariaLabel = formatFullDateForScreenReader(day.date);
            const disabled = isDisabled(day.date);
            const selected = isSelected(day.date);
            const inRange = isInRange(day.date);

            return (
              <button
                key={day.date.toISOString()}
                type="button"
                role="gridcell"
                tabIndex={day.isCurrentMonth && !disabled ? 0 : -1}
                aria-label={ariaLabel}
                aria-selected={selected}
                aria-disabled={disabled}
                disabled={disabled}
                onClick={() => handleDateClick(day.date)}
                onMouseEnter={() => handleDateHover(day.date)}
                className={[
                  "relative flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                  // Current month vs adjacent month
                  day.isCurrentMonth
                    ? "text-gray-900 dark:text-gray-100"
                    : "text-gray-300 dark:text-gray-600",
                  // Today
                  day.isToday && !selected
                    ? "ring-1 ring-blue-500 dark:ring-blue-400"
                    : "",
                  // Selected
                  selected
                    ? "bg-blue-600 text-white font-semibold hover:bg-blue-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700",
                  // Disabled
                  disabled
                    ? "cursor-not-allowed opacity-40 text-gray-300 dark:text-gray-600"
                    : "cursor-pointer",
                  // Range start/end
                  day.isRangeStart || day.isRangeEnd
                    ? "bg-blue-600 text-white font-semibold"
                    : "",
                  // In range
                  inRange && !day.isRangeStart && !day.isRangeEnd
                    ? "bg-blue-100 text-gray-900 dark:bg-blue-900/40 dark:text-gray-100 rounded-none"
                    : "",
                  // Hover preview for range
                  day.isHovered && !selected
                    ? "ring-2 ring-blue-400"
                    : "",
                ].join(" ")}
              >
                {day.date.getDate()}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
