// TimezoneSelector — Timezone dropdown with UTC offset display

"use client";

import { useState, useMemo } from "react";
import type { TimeZone } from "../lib/datetime-types";
import { convertTimezone, getUtcOffset } from "../lib/datetime-utils";

interface TimezoneSelectorProps {
  timezones: TimeZone[];
  selectedTimezone: TimeZone;
  onSelect: (tz: TimeZone) => void;
}

export function TimezoneSelector({
  timezones,
  selectedTimezone,
  onSelect,
}: TimezoneSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter timezones based on search
  const filteredTimezones = useMemo(() => {
    if (!searchQuery.trim()) return timezones;
    const query = searchQuery.toLowerCase();
    return timezones.filter(
      (tz) =>
        tz.label.toLowerCase().includes(query) ||
        tz.id.toLowerCase().includes(query) ||
        tz.utcOffset.toLowerCase().includes(query)
    );
  }, [timezones, searchQuery]);

  // Compute converted time for display
  const convertedTime = useMemo(() => {
    if (typeof window === "undefined") return "";
    const now = new Date();
    const converted = convertTimezone(now, selectedTimezone.id);
    return converted.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }, [selectedTimezone]);

  // Get current UTC offset for selected timezone
  const currentOffset = useMemo(() => {
    if (typeof window === "undefined") return selectedTimezone.utcOffset;
    return getUtcOffset(new Date(), selectedTimezone.id);
  }, [selectedTimezone]);

  return (
    <div className="space-y-2">
      {/* Selected timezone display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-500 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {selectedTimezone.label}
          </span>
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
            {currentOffset}
          </span>
          {selectedTimezone.isDST && (
            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              DST
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {convertedTime}
        </span>
      </div>

      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Change timezone"
      >
        <span>Change timezone</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={[
            "h-4 w-4 text-gray-500 transition-transform",
            isOpen ? "rotate-180" : "",
          ].join(" ")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
          {/* Search */}
          <div className="border-b border-gray-200 p-2 dark:border-gray-600">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search timezones..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
              aria-label="Search timezones"
            />
          </div>

          {/* Timezone list */}
          <div className="max-h-48 overflow-y-auto" role="listbox">
            {filteredTimezones.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No timezones found
              </div>
            ) : (
              filteredTimezones.map((tz) => (
                <button
                  key={tz.id}
                  type="button"
                  role="option"
                  aria-selected={tz.id === selectedTimezone.id}
                  onClick={() => {
                    onSelect(tz);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={[
                    "flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors",
                    tz.id === selectedTimezone.id
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                  ].join(" ")}
                >
                  <div>
                    <div className="font-medium">{tz.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {tz.id}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                      {tz.utcOffset}
                    </span>
                    {tz.isDST && (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        DST
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
