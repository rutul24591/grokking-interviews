// Zustand store for date picker state (calendar view, selection, range)

import { create } from "zustand";
import type { DatePickerState, DatePickerStoreActions, DateFormat } from "../lib/datetime-types";

// Default values for SSR safety — real values set via useEffect on client
const DEFAULT_MONTH = 0; // January
const DEFAULT_YEAR = 2026;

interface DatePickerStore extends DatePickerState, DatePickerStoreActions {}

export const useDatePickerStore = create<DatePickerStore>((set, get) => ({
  // State
  currentMonth: DEFAULT_MONTH,
  currentYear: DEFAULT_YEAR,
  selectedDate: null,
  rangeStart: null,
  rangeEnd: null,
  hoverDate: null,
  isOpen: false,
  mode: "single",
  dateFormat: "MM/DD/YYYY",
  disabledDateFn: undefined,
  minDate: undefined,
  maxDate: undefined,

  // Actions
  setCurrentMonth: (month: number) => set({ currentMonth: month }),
  setCurrentYear: (year: number) => set({ currentYear: year }),

  navigateMonth: (delta: number) =>
    set((state) => {
      let newMonth = state.currentMonth + delta;
      let newYear = state.currentYear;

      // Handle year boundary wrapping
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }

      return { currentMonth: newMonth, currentYear: newYear };
    }),

  selectDate: (date: Date) =>
    set((state) => {
      if (state.mode === "single") {
        return { selectedDate: date, isOpen: false, rangeStart: null, rangeEnd: null };
      }

      // Range mode: first click sets start, second click sets end
      if (!state.rangeStart || (state.rangeStart && state.rangeEnd)) {
        // Start a new range
        return { rangeStart: date, rangeEnd: null, selectedDate: null };
      }

      // Complete the range
      return { rangeEnd: date, isOpen: false };
    }),

  setRangeStart: (date: Date) => set({ rangeStart: date }),
  setRangeEnd: (date: Date) => set({ rangeEnd: date }),

  setHoverDate: (date: Date | null) => set({ hoverDate: date }),

  setIsOpen: (open: boolean) => set({ isOpen: open }),

  setMode: (mode: "single" | "range") =>
    set({ mode, rangeStart: null, rangeEnd: null, selectedDate: null }),

  setDateFormat: (format: DateFormat) => set({ dateFormat: format }),

  setDisabledDateFn: (fn: typeof get().disabledDateFn) => set({ disabledDateFn: fn }),

  reset: () =>
    set({
      selectedDate: null,
      rangeStart: null,
      rangeEnd: null,
      hoverDate: null,
      isOpen: false,
    }),
}));

// Helper to initialize with client-side date (call from useEffect)
export function initializeDatePicker() {
  if (typeof window === "undefined") return;
  const now = new Date();
  useDatePickerStore.setState({
    currentMonth: now.getMonth(),
    currentYear: now.getFullYear(),
  });
}
