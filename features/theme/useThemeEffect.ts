"use client";

import { useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { loadStoredTheme, ResolvedTheme, useThemeStore } from "@/features/theme/theme.store";

export function useThemeEffect() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  const mediaQuery = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return window.matchMedia("(prefers-color-scheme: dark)");
  }, []);

  useEffect(() => {
    const stored = loadStoredTheme();
    setTheme(stored);
  }, [setTheme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const resolve = (): ResolvedTheme => {
      if (theme === "system") {
        return mediaQuery?.matches ? "dark" : "light";
      }
      return theme;
    };

    const apply = () => {
      const nextTheme = resolve();
      setResolvedTheme(nextTheme);
      document.documentElement.dataset.theme = nextTheme;
    };

    apply();

    const handleChange = () => {
      if (theme === "system") {
        apply();
      }
    };

    mediaQuery?.addEventListener("change", handleChange);
    return () => mediaQuery?.removeEventListener("change", handleChange);
  }, [mediaQuery, theme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  return resolvedTheme;
}
