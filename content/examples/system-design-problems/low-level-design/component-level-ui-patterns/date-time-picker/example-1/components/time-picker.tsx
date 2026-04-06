// TimePicker — Time selector with hour/minute/second inputs, AM/PM toggle, format support

"use client";

import { useTimePicker } from "../../hooks/use-time-picker";

export function TimePicker() {
  const {
    displayHour,
    minute,
    second,
    isPM,
    format,
    formattedTime,
    handleHourChange,
    handleMinuteChange,
    handleSecondChange,
    handleScroll,
    handleFormatSwitch,
    toggleAmPm,
    timeOptions,
    isValid,
  } = useTimePicker();

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="space-y-3">
      {/* Format toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Time
        </span>
        <button
          type="button"
          onClick={handleFormatSwitch}
          className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          aria-label={`Switch to ${format === "12h" ? "24-hour" : "12-hour"} format`}
        >
          {format === "12h" ? "12H" : "24H"}
        </button>
      </div>

      {/* Time inputs */}
      <div className="flex items-center gap-2">
        {/* Hour */}
        <div className="flex flex-col items-center">
          <input
            type="text"
            inputMode="numeric"
            value={pad(displayHour)}
            onChange={(e) => handleHourChange(e.target.value)}
            className="w-12 rounded-md border border-gray-300 bg-white py-2 text-center text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            aria-label="Hour"
          />
          <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {format === "12h" ? "1-12" : "0-23"}
          </span>
        </div>

        <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">:</span>

        {/* Minute */}
        <div className="flex flex-col items-center">
          <input
            type="text"
            inputMode="numeric"
            value={pad(minute)}
            onChange={(e) => handleMinuteChange(e.target.value)}
            onWheel={handleScroll}
            className="w-12 rounded-md border border-gray-300 bg-white py-2 text-center text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            aria-label="Minute"
          />
          <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">0-59</span>
        </div>

        <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">:</span>

        {/* Second */}
        <div className="flex flex-col items-center">
          <input
            type="text"
            inputMode="numeric"
            value={pad(second)}
            onChange={(e) => handleSecondChange(e.target.value)}
            className="w-12 rounded-md border border-gray-300 bg-white py-2 text-center text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            aria-label="Second"
          />
          <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">0-59</span>
        </div>

        {/* AM/PM toggle (12h mode only) */}
        {format === "12h" && (
          <button
            type="button"
            onClick={toggleAmPm}
            className={[
              "ml-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
              isPM
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-amber-500 text-white hover:bg-amber-600",
            ].join(" ")}
            aria-label={isPM ? "Switch to AM" : "Switch to PM"}
          >
            {isPM ? "PM" : "AM"}
          </button>
        )}
      </div>

      {/* Validation error */}
      {!isValid && (
        <p className="text-xs text-red-600 dark:text-red-400" role="alert">
          Invalid time values
        </p>
      )}

      {/* Formatted preview */}
      <div className="rounded-lg bg-gray-50 px-3 py-2 text-center text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
        {formattedTime}
      </div>

      {/* Scrollable time list (30-min intervals) */}
      <div
        className="max-h-32 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-600"
        onWheel={handleScroll}
        role="listbox"
        aria-label="Time options"
      >
        {timeOptions.map((option, index) => {
          const isSelected =
            option.hour === (format === "12h" ? (isPM ? displayHour + 12 : displayHour) : displayHour) &&
            option.minute === minute;

          return (
            <button
              key={index}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => {
                handleHourChange(option.hour.toString());
                handleMinuteChange(option.minute.toString());
              }}
              className={[
                "w-full px-3 py-1.5 text-left text-xs transition-colors",
                isSelected
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
