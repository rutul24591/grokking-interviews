// ThemeScoped — applies a local theme to a subtree via CSS variable scoping

"use client";

import { useEffect, useRef } from "react";
import { useThemeStore } from "../lib/theme-store";
import { applyThemeVariables } from "../lib/css-variable-manager";

interface ThemeScopedProps {
  /** The theme ID to apply within this scope */
  themeId: string;
  /** Children rendered within the scoped theme */
  children: React.ReactNode;
  /** Optional additional className for the wrapper */
  className?: string;
}

/**
 * Wraps children in a container that applies a local theme.
 * CSS variables are injected on the wrapper element (not <html>),
 * so they cascade only to descendants. This enables nested themes
 * within a page (e.g., a dark code block inside a light article).
 */
export function ThemeScoped({
  themeId,
  children,
  className = "",
}: ThemeScopedProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const getThemeConfig = useThemeStore((state) => state.getThemeConfig);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const themeConfig = getThemeConfig(themeId);
    if (themeConfig) {
      applyThemeVariables(el, themeConfig);
    }
  }, [themeId, getThemeConfig]);

  return (
    <div
      ref={wrapperRef}
      data-theme={themeId}
      className={`theme-scoped ${className}`}
    >
      {children}
    </div>
  );
}
