// Zustand store for theme state management

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeId, ThemeMode, ThemeConfig } from "./theme-types";
import { builtInThemes } from "./design-tokens";
import { applyThemeVariables } from "./css-variable-manager";

interface ThemeState {
  /** User's selection mode: "light", "dark", or "system" */
  mode: ThemeMode;

  /** Currently resolved theme ID (after system preference resolution) */
  resolvedThemeId: ThemeId;

  /** Registry of custom themes added at runtime */
  customThemes: Record<string, ThemeConfig>;

  /** Set the selection mode and persist */
  setMode: (mode: ThemeMode) => void;

  /** Register a custom theme at runtime */
  registerCustomTheme: (theme: ThemeConfig) => void;

  /** Toggle between light and dark (ignores system mode) */
  toggle: () => void;

  /** Get the full ThemeConfig for a given theme ID */
  getThemeConfig: (id: ThemeId) => ThemeConfig | undefined;
}

/** Safe localStorage read with fallback for private browsing */
function getStoredMode(): ThemeMode | null {
  try {
    const stored = localStorage.getItem("theme-mode");
    if (
      stored === "light" ||
      stored === "dark" ||
      stored === "system"
    ) {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
}

/** Detect system preference via matchMedia */
function getSystemPreference(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  return prefersDark ? "dark" : "light";
}

/** Resolve the actual theme ID from a mode */
function resolveTheme(mode: ThemeMode): ThemeId {
  if (mode === "system") {
    return getSystemPreference();
  }
  return mode;
}

/** Create the Zustand theme store */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => {
      const initialMode = getStoredMode() || "system";
      const initialResolved = resolveTheme(initialMode);

      // Apply theme on initialization (client-side only)
      if (typeof window !== "undefined") {
        const themeConfig = builtInThemes[initialResolved];
        if (themeConfig) {
          applyThemeVariables(document.documentElement, themeConfig);
        }
      }

      // Listen for system preference changes
      if (typeof window !== "undefined") {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        mediaQuery.addEventListener("change", (e) => {
          const { mode } = get();
          if (mode === "system") {
            const newResolved = e.matches ? "dark" : "light";
            const themeConfig = get().getThemeConfig(newResolved);
            if (themeConfig) {
              applyThemeVariables(document.documentElement, themeConfig);
            }
            set({ resolvedThemeId: newResolved });
          }
        });
      }

      return {
        mode: initialMode,
        resolvedThemeId: initialResolved,
        customThemes: {},

        setMode: (mode: ThemeMode) => {
          const resolved = resolveTheme(mode);
          const themeConfig = get().getThemeConfig(resolved);
          if (themeConfig && typeof window !== "undefined") {
            applyThemeVariables(document.documentElement, themeConfig);
          }

          // Persist mode to localStorage
          try {
            localStorage.setItem("theme-mode", mode);
          } catch {
            // Private browsing — ignore
          }

          set({ mode, resolvedThemeId: resolved });
        },

        registerCustomTheme: (theme: ThemeConfig) => {
          set((state) => ({
            customThemes: {
              ...state.customThemes,
              [theme.id]: theme,
            },
          }));
        },

        toggle: () => {
          const { mode } = get();
          const newMode: ThemeMode = mode === "dark" ? "light" : "dark";
          get().setMode(newMode);
        },

        getThemeConfig: (id: ThemeId) => {
          // Check built-in themes first
          if (builtInThemes[id]) {
            return builtInThemes[id];
          }
          // Check custom themes
          const { customThemes } = get();
          if (customThemes[id]) {
            return customThemes[id];
          }
          return undefined;
        },
      };
    },
    {
      name: "theme-mode-storage",
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);
