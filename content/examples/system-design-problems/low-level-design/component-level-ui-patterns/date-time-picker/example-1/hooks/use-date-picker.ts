// Custom hook for date picker logic — calendar grid generation, navigation, selection

import { useMemo, useCallback } from "react";
import { useDatePickerStore } from "../lib/date-picker-store";
import {
  generateCalendarGrid,
  isSameDay,
  isDateDisabled,
} from "../lib/datetime-utils";
import type { CalendarDay } from "../lib/datetime-types";

export function useDatePicker() {
  const {
    currentMonth,
    currentYear,
    selectedDate,
    rangeStart,
    rangeEnd,
    hoverDate,
    mode,
    disabledDateFn,
    minDate,
    maxDate,
    navigateMonth,
    selectDate,
    setHoverDate,
    setCurrentMonth,
    setCurrentYear,
    setIsOpen,
  } = useDatePickerStore();

  // Memoized calendar grid generation
  const grid = useMemo<CalendarDay[][]>(() => {
    const today = typeof window !== "undefined" ? new Date() : new Date(2026, 0, 1);
    return generateCalendarGrid(
      currentYear,
      currentMonth,
      today,
      selectedDate,
      rangeStart,
      rangeEnd,
      hoverDate,
      disabledDateFn,
      minDate,
      maxDate
    );
  }, [currentYear, currentMonth, selectedDate, rangeStart, rangeEnd, hoverDate, disabledDateFn, minDate, maxDate]);

  // Navigate to previous month
  const goToPrevMonth = useCallback(() => {
    navigateMonth(-1);
  }, [navigateMonth]);

  // Navigate to next month
  const goToNextMonth = useCallback(() => {
    navigateMonth(1);
  }, [navigateMonth]);

  // Jump to a specific month/year
  const jumpTo = useCallback(
    (month: number, year: number) => {
      setCurrentMonth(month);
      setCurrentYear(year);
    },
    [setCurrentMonth, setCurrentYear]
  );

  // Handle date cell click
  const handleDateClick = useCallback(
    (date: Date) => {
      // Don't select disabled dates
      if (isDateDisabled(date, disabledDateFn, minDate, maxDate)) return;
      selectDate(date);
    },
    [selectDate, disabledDateFn, minDate, maxDate]
  );

  // Handle hover for range preview
  const handleDateHover = useCallback(
    (date: Date) => {
      if (mode === "range" && rangeStart && !rangeEnd) {
        setHoverDate(date);
      }
    },
    [mode, rangeStart, rangeEnd, setHoverDate]
  );

  // Check if a date is disabled
  const isDisabled = useCallback(
    (date: Date) => {
      return isDateDisabled(date, disabledDateFn, minDate, maxDate);
    },
    [disabledDateFn, minDate, maxDate]
  );

  // Check if a date is the selected date (for single mode)
  const isSelected = useCallback(
    (date: Date) => {
      if (mode === "single" && selectedDate) {
        return isSameDay(date, selectedDate);
      }
      return false;
    },
    [mode, selectedDate]
  );

  // Check if a date is within the selected range
  const isInRange = useCallback(
    (date: Date) => {
      if (!rangeStart || !rangeEnd) return false;
      const start = rangeStart < rangeEnd ? rangeStart : rangeEnd;
      const end = rangeStart < rangeEnd ? rangeEnd : rangeStart;
      return date > start && date < end;
    },
    [rangeStart, rangeEnd]
  );

  // Get display text for selected date(s)
  const getDisplayText = useCallback(() => {
    if (mode === "single" && selectedDate) {
      return selectedDate.toLocaleDateString();
    }
    if (mode === "range" && rangeStart && rangeEnd) {
      return `${rangeStart.toLocaleDateString()} – ${rangeEnd.toLocaleDateString()}`;
    }
    if (mode === "range" && rangeStart) {
      return `${rangeStart.toLocaleDateString()} – Select end date`;
    }
    return "Select date";
  }, [mode, selectedDate, rangeStart, rangeEnd]);

  return {
    grid,
    currentMonth,
    currentYear,
    goToPrevMonth,
    goToNextMonth,
    jumpTo,
    handleDateClick,
    handleDateHover,
    isDisabled,
    isSelected,
    isInRange,
    getDisplayText,
    setIsOpen,
    mode,
    rangeStart,
    rangeEnd,
    selectedDate,
  };
}
