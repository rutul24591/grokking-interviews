"use client";

import { create } from "zustand";
import { STORAGE_KEYS } from "@/lib/constants";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeState = {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "system",
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => {
    const current = get().theme;
    if (current === "dark") {
      set({ theme: "light" });
      return;
    }
    set({ theme: "dark" });
  },
}));

export function loadStoredTheme(): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }
  const stored = window.localStorage.getItem(STORAGE_KEYS.theme) as ThemePreference | null;
  return stored ?? "system";
}
