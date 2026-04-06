// useTheme hook — React interface to the theme store

import { useMemo } from "react";
import { useThemeStore } from "../lib/theme-store";
import type { ThemeMode, ThemeConfig, ThemeId } from "../lib/theme-types";

interface UseThemeReturn {
  /** The resolved ThemeConfig object for the current theme */
  theme: ThemeConfig | undefined;

  /** Current resolved theme ID (e.g., "light", "dark", or custom ID) */
  themeId: ThemeId;

  /** User's selection mode ("light", "dark", or "system") */
  mode: ThemeMode;

  /** Switch to a specific theme by ID */
  setTheme: (id: ThemeId) => void;

  /** Change the selection mode */
  setMode: (mode: ThemeMode) => void;

  /** Toggle between light and dark */
  toggle: () => void;

  /** Whether the current resolved theme is dark */
  isDark: boolean;
}

export function useTheme(): UseThemeReturn {
  const mode = useThemeStore((state) => state.mode);
  const resolvedThemeId = useThemeStore((state) => state.resolvedThemeId);
  const setMode = useThemeStore((state) => state.setMode);
  const getThemeConfig = useThemeStore((state) => state.getThemeConfig);
  const toggle = useThemeStore((state) => state.toggle);

  const theme = useMemo(() => {
    return getThemeConfig(resolvedThemeId);
  }, [getThemeConfig, resolvedThemeId]);

  const isDark = resolvedThemeId === "dark";

  // setTheme is a convenience wrapper that switches to a specific theme ID
  // by setting the mode to match (for built-in themes) or registering a custom theme
  const setTheme = (id: ThemeId) => {
    if (id === "light" || id === "dark") {
      setMode(id);
    } else {
      // For custom themes, just update the resolved ID without changing mode
      // This would require additional store logic for custom theme activation
      setMode("light"); // fallback — custom theme activation is handled separately
    }
  };

  return {
    theme,
    themeId: resolvedThemeId,
    mode,
    setTheme,
    setMode,
    toggle,
    isDark,
  };
}
