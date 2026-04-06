// Design token definitions for light and dark themes

import type { ThemeConfig } from "./theme-types";

export const lightTheme: ThemeConfig = {
  id: "light",
  name: "Light",
  palette: {
    "bg-primary": "#ffffff",
    "bg-surface": "#f8f9fa",
    "bg-surface-elevated": "#ffffff",
    "text-primary": "#1a1a2e",
    "text-secondary": "#4a4a68",
    "text-muted": "#6b7280",
    "text-on-primary": "#ffffff",
    "border-default": "#e5e7eb",
    "border-strong": "#d1d5db",
    "color-primary": "#3b82f6",
    "color-primary-hover": "#2563eb",
    "color-primary-active": "#1d4ed8",
    "color-success": "#22c55e",
    "color-warning": "#f59e0b",
    "color-error": "#ef4444",
    "color-info": "#3b82f6",
  },
  typography: {
    body: {
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: "1rem",
      lineHeight: "1.6",
      fontWeight: 400,
    },
    bodySmall: {
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: "0.875rem",
      lineHeight: "1.5",
      fontWeight: 400,
    },
    heading1: {
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: "2.25rem",
      lineHeight: "1.2",
      fontWeight: 700,
    },
    heading2: {
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: "1.875rem",
      lineHeight: "1.25",
      fontWeight: 700,
    },
    heading3: {
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: "1.5rem",
      lineHeight: "1.3",
      fontWeight: 600,
    },
    code: {
      fontFamily:
        '"Fira Code", "JetBrains Mono", "SF Mono", "Cascadia Code", monospace',
      fontSize: "0.875rem",
      lineHeight: "1.6",
      fontWeight: 400,
    },
  },
  spacing: {
    xxs: "0.25rem",
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "2.5rem",
    "3xl": "3rem",
    "4xl": "4rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  },
  radii: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },
};

export const darkTheme: ThemeConfig = {
  id: "dark",
  name: "Dark",
  palette: {
    "bg-primary": "#0f0f14",
    "bg-surface": "#1a1a24",
    "bg-surface-elevated": "#24243a",
    "text-primary": "#e8e8f0",
    "text-secondary": "#b0b0c8",
    "text-muted": "#7a7a96",
    "text-on-primary": "#ffffff",
    "border-default": "#2a2a3e",
    "border-strong": "#3a3a54",
    "color-primary": "#60a5fa",
    "color-primary-hover": "#93bbfd",
    "color-primary-active": "#3b82f6",
    "color-success": "#4ade80",
    "color-warning": "#fbbf24",
    "color-error": "#f87171",
    "color-info": "#60a5fa",
  },
  typography: {
    body: {
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: "1rem",
      lineHeight: "1.6",
      fontWeight: 400,
    },
    bodySmall: {
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: "0.875rem",
      lineHeight: "1.5",
      fontWeight: 400,
    },
    heading1: {
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: "2.25rem",
      lineHeight: "1.2",
      fontWeight: 700,
    },
    heading2: {
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: "1.875rem",
      lineHeight: "1.25",
      fontWeight: 700,
    },
    heading3: {
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: "1.5rem",
      lineHeight: "1.3",
      fontWeight: 600,
    },
    code: {
      fontFamily:
        '"Fira Code", "JetBrains Mono", "SF Mono", "Cascadia Code", monospace',
      fontSize: "0.875rem",
      lineHeight: "1.6",
      fontWeight: 400,
    },
  },
  spacing: {
    xxs: "0.25rem",
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "2.5rem",
    "3xl": "3rem",
    "4xl": "4rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)",
  },
  radii: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },
};

/** Registry of built-in themes */
export const builtInThemes: Record<string, ThemeConfig> = {
  light: lightTheme,
  dark: darkTheme,
};
