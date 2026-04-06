// ============================================================
// components/token-provider.tsx
// CSS variable injection container with theme switching
// ============================================================

"use client";

import {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { ThemeDefinition, ThemeOverride } from "../lib/library-types";
import { buildTheme, lightTheme } from "../lib/theme-builder";
import { setTokenContext } from "../hooks/use-token-resolution";

// ── Props ───────────────────────────────────────────────────

interface TokenProviderProps {
  /** Theme to apply. Defaults to light theme. */
  theme?: ThemeDefinition;
  /** Partial overrides to apply on top of the theme */
  overrides?: ThemeOverride;
  /** Child components */
  children: ReactNode;
  /** CSS selector for the container element */
  selector?: string;
  /** Whether to inject styles as a style tag (default) or inline style */
  injectionMode?: "style-tag" | "inline";
}

// ── Component ───────────────────────────────────────────────

/**
 * TokenProvider is the root of the theming system.
 *
 * It receives a theme definition, converts all token values
 * to CSS custom properties, and injects them into the DOM.
 * Child components consume these CSS variables through their
 * styles (e.g., color: var(--color-primary)), so theme
 * switches happen at the CSS level without React re-renders.
 *
 * The provider also sets up the token resolution context
 * so that the useTokenResolution and useThemeTokens hooks
 * can access the current theme values.
 */
export function TokenProvider({
  theme = lightTheme,
  overrides,
  children,
  selector = "[data-theme]",
  injectionMode = "style-tag",
}: TokenProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const styleTagId = "component-library-tokens";

  // Build or merge the theme
  const activeTheme = useMemo(() => {
    if (!overrides || Object.keys(overrides).length === 0) {
      return theme;
    }
    // Rebuild theme with overrides
    return buildTheme(theme.id, theme.name, {
      overrides,
      validateContrast: process.env.NODE_ENV === "development",
    });
  }, [theme, overrides]);

  // Generate CSS variable declarations
  const cssVariables = useMemo(() => {
    return Object.entries(activeTheme.tokens)
      .map(([name, value]) => `--${name}: ${value}`)
      .join(";");
  }, [activeTheme.tokens]);

  // Inject CSS variables into the DOM
  const injectTokens = useCallback(() => {
    if (injectionMode === "style-tag") {
      // Inject as a <style> tag in document.head
      let styleTag = document.getElementById(styleTagId) as HTMLStyleElement;

      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleTagId;
        document.head.appendChild(styleTag);
      }

      styleTag.textContent = `${selector} { ${cssVariables}; }`;
    }
    // For inline mode, the CSS variables are applied
    // via the style attribute on the container div below.
  }, [cssVariables, injectionMode, selector, styleTagId]);

  useEffect(() => {
    injectTokens();
  }, [injectTokens]);

  // Set the token resolution context for hooks
  useEffect(() => {
    setTokenContext({
      containerRef: containerRef as React.RefObject<HTMLElement>,
      resolvedTokens: new Map(Object.entries(activeTheme.tokens)),
    });

    return () => {
      // Clean up is not needed — the context is replaced
      // by the next TokenProvider render.
    };
  }, [activeTheme.tokens]);

  // Log warnings in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && activeTheme.warnings.length > 0) {
      console.group(
        `[ComponentLibrary] Theme "${activeTheme.name}" warnings`
      );
      for (const warning of activeTheme.warnings) {
        console.warn(`[${warning.severity}] ${warning.message}`);
      }
      console.groupEnd();
    }
  }, [activeTheme]);

  if (injectionMode === "inline") {
    return (
      <div
        ref={containerRef}
        data-theme={activeTheme.id}
        style={{ cssText: cssVariables } as React.CSSProperties}
      >
        {children}
      </div>
    );
  }

  return (
    <div ref={containerRef} data-theme={activeTheme.id}>
      {children}
    </div>
  );
}

// ── Theme Switcher Hook ─────────────────────────────────────

/**
 * Hook to access and switch themes at the application level.
 * Uses Zustand or localStorage to persist the user selection.
 */
export function useThemeSwitcher() {
  const switchTheme = useCallback((themeId: string) => {
    // In production, this dispatches to a Zustand store
    // which updates the TokenProvider theme prop.
    // The TokenProvider then rebuilds the theme and
    // reinjects CSS variables.
    if (typeof window !== "undefined") {
      localStorage.setItem("selected-theme", themeId);
    }
  }, []);

  const getStoredTheme = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("selected-theme");
  }, []);

  return { switchTheme, getStoredTheme };
}
