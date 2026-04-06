// DateInput — Text input with auto-formatting, parsing, validation

"use client";

import { useState, useCallback, useMemo } from "react";
import { useDatePickerStore } from "../lib/date-picker-store";
import { formatDate, parseDate } from "../lib/datetime-utils";

export function DateInput() {
  const { dateFormat, selectedDate, setIsOpen } = useDatePickerStore();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Placeholder based on format
  const placeholder = useMemo(() => {
    switch (dateFormat) {
      case "MM/DD/YYYY":
        return "MM/DD/YYYY";
      case "DD/MM/YYYY":
        return "DD/MM/YYYY";
      case "YYYY-MM-DD":
        return "YYYY-MM-DD";
    }
  }, [dateFormat]);

  // Format specifier for auto-formatting
  const formatSpecifier = useMemo(() => {
    switch (dateFormat) {
      case "MM/DD/YYYY":
        return "##/##/####";
      case "DD/MM/YYYY":
        return "##/##/####";
      case "YYYY-MM-DD":
        return "####-##-##";
    }
  }, [dateFormat]);

  // Handle input change with auto-formatting
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      // Strip non-numeric characters
      const numeric = raw.replace(/\D/g, "");

      let formatted = "";
      switch (dateFormat) {
        case "MM/DD/YYYY":
        case "DD/MM/YYYY":
          if (numeric.length <= 2) {
            formatted = numeric;
          } else if (numeric.length <= 4) {
            formatted = `${numeric.slice(0, 2)}/${numeric.slice(2)}`;
          } else {
            formatted = `${numeric.slice(0, 2)}/${numeric.slice(2, 4)}/${numeric.slice(4, 8)}`;
          }
          break;
        case "YYYY-MM-DD":
          if (numeric.length <= 4) {
            formatted = numeric;
          } else if (numeric.length <= 6) {
            formatted = `${numeric.slice(0, 4)}-${numeric.slice(4)}`;
          } else {
            formatted = `${numeric.slice(0, 4)}-${numeric.slice(4, 6)}-${numeric.slice(6, 8)}`;
          }
          break;
      }

      setInputValue(formatted);
      setError(null); // Clear error on typing
    },
    [dateFormat]
  );

  // Handle blur — parse and validate
  const handleBlur = useCallback(() => {
    setIsFocused(false);

    if (!inputValue.trim()) {
      setInputValue("");
      setError(null);
      return;
    }

    const parsed = parseDate(inputValue, dateFormat);

    if (!parsed) {
      setError("Invalid date format");
      return;
    }

    // Valid date — update store and format display
    setInputValue(formatDate(parsed, dateFormat));
    setError(null);
  }, [inputValue, dateFormat]);

  // Handle focus — clear for editing
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    // If there's a selected date, show raw input for editing
    if (selectedDate) {
      setInputValue(formatDate(selectedDate, dateFormat));
    }
  }, [selectedDate, dateFormat]);

  // Handle keyboard — Enter to submit, Escape to close
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleBlur();
        setIsOpen(false);
      } else if (e.key === "Escape") {
        setInputValue("");
        setError(null);
        setIsOpen(false);
      }
    },
    [handleBlur, setIsOpen]
  );

  return (
    <div className="space-y-1">
      <label
        htmlFor="date-input"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Date
      </label>
      <div className="relative">
        <input
          id="date-input"
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={[
            "w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500",
            error
              ? "border-red-500 focus:ring-red-500 dark:border-red-400"
              : "border-gray-300 focus:ring-blue-500 dark:border-gray-600",
          ].join(" ")}
          aria-invalid={!!error}
          aria-describedby={error ? "date-input-error" : undefined}
          aria-label="Enter date"
        />
        {/* Calendar icon */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Open calendar"
          tabIndex={-1}
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

      {/* Error message */}
      {error && (
        <p
          id="date-input-error"
          className="text-xs text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Format hint */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Format: {formatSpecifier}
      </p>
    </div>
  );
}
