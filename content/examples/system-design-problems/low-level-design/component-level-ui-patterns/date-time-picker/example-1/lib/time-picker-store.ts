// Zustand store for time picker state (hour, minute, second, format)

import { create } from "zustand";
import type { TimePickerState, TimePickerStoreActions, TimeFormat } from "../lib/datetime-types";

// Default values for SSR safety — real values set via useEffect on client
const DEFAULT_HOUR = 0;
const DEFAULT_MINUTE = 0;
const DEFAULT_SECOND = 0;

interface TimePickerStore extends TimePickerState, TimePickerStoreActions {}

export const useTimePickerStore = create<TimePickerStore>((set, get) => ({
  // State
  hour: DEFAULT_HOUR,
  minute: DEFAULT_MINUTE,
  second: DEFAULT_SECOND,
  isPM: false,
  format: "24h",

  // Actions
  setHour: (hour: number) => {
    const maxHour = get().format === "12h" ? 12 : 23;
    const minHour = get().format === "12h" ? 1 : 0;
    const clamped = Math.max(minHour, Math.min(maxHour, hour));
    set({ hour: clamped });
  },

  setMinute: (minute: number) => {
    const clamped = Math.max(0, Math.min(59, minute));
    set({ minute: clamped });
  },

  setSecond: (second: number) => {
    const clamped = Math.max(0, Math.min(59, second));
    set({ second: clamped });
  },

  toggleAmPm: () =>
    set((state) => {
      const newIsPM = !state.isPM;
      // Convert hour when toggling AM/PM
      let newHour = state.hour;
      if (state.format === "12h") {
        if (newIsPM && state.hour < 12) {
          newHour = state.hour + 12;
        } else if (!newIsPM && state.hour >= 12) {
          newHour = state.hour - 12;
        }
      }
      return { isPM: newIsPM, hour: newHour };
    }),

  setFormat: (format: TimeFormat) =>
    set((state) => {
      if (format === state.format) return {};

      let newHour = state.hour;
      let newIsPM = state.isPM;

      if (format === "12h") {
        // Converting from 24h to 12h
        newIsPM = state.hour >= 12;
        newHour = state.hour % 12 || 12;
      } else {
        // Converting from 12h to 24h
        if (state.isPM && state.hour < 12) {
          newHour = state.hour + 12;
        } else if (!state.isPM && state.hour === 12) {
          newHour = 0;
        }
      }

      return { format, hour: newHour, isPM: newIsPM };
    }),

  setTime: (hour: number, minute: number, second: number) => {
    const format = get().format;
    const maxHour = format === "12h" ? 12 : 23;
    const minHour = format === "12h" ? 1 : 0;

    set({
      hour: Math.max(minHour, Math.min(maxHour, hour)),
      minute: Math.max(0, Math.min(59, minute)),
      second: Math.max(0, Math.min(59, second)),
      isPM: format === "12h" ? hour >= 12 : hour >= 12,
    });
  },

  reset: () =>
    set({
      hour: DEFAULT_HOUR,
      minute: DEFAULT_MINUTE,
      second: DEFAULT_SECOND,
      isPM: false,
    }),
}));

// Helper to initialize with client-side time (call from useEffect)
export function initializeTimePicker() {
  if (typeof window === "undefined") return;
  const now = new Date();
  const hour = now.getHours();
  useTimePickerStore.setState({
    hour,
    minute: now.getMinutes(),
    second: now.getSeconds(),
    isPM: hour >= 12,
  });
}
