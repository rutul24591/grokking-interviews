// ThemeProvider — wraps the application and applies the active theme

"use client";

import { useEffect, useCallback } from "react";
import { useThemeStore } from "../lib/theme-store";
import { applyThemeVariables } from "../lib/css-variable-manager";
import type { ThemeConfig } from "../lib/theme-types";

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Optional custom themes to register on mount */
  customThemes?: ThemeConfig[];
}

export function ThemeProvider({ children, customThemes }: ThemeProviderProps) {
  const resolvedThemeId = useThemeStore((state) => state.resolvedThemeId);
  const getThemeConfig = useThemeStore((state) => state.getThemeConfig);
  const registerCustomTheme = useThemeStore(
    (state) => state.registerCustomTheme
  );

  // Register custom themes on mount
  useEffect(() => {
    if (customThemes) {
      for (const theme of customThemes) {
        registerCustomTheme(theme);
      }
    }
  }, [customThemes, registerCustomTheme]);

  // Apply theme variables whenever the resolved theme changes
  const applyTheme = useCallback(() => {
    const themeConfig = getThemeConfig(resolvedThemeId);
    if (themeConfig && typeof document !== "undefined") {
      applyThemeVariables(document.documentElement, themeConfig);
    }
  }, [resolvedThemeId, getThemeConfig]);

  useEffect(() => {
    applyTheme();

    // Enable CSS transitions after the initial theme is applied.
    // This prevents animated color changes on first paint.
    const rafId = requestAnimationFrame(() => {
      document.documentElement.classList.remove("no-transitions");
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [applyTheme]);

  return <>{children}</>;
}
