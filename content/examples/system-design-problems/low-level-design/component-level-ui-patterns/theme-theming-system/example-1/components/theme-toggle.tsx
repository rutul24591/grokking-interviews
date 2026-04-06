// ThemeToggle — three-state switch (light / dark / system) with icons

"use client";

import { useTheme } from "../../hooks/use-theme";
import type { ThemeMode } from "../lib/theme-types";

/** Sun icon for light mode */
function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

/** Moon icon for dark mode */
function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/** Monitor icon for system preference */
function MonitorIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

const MODE_ORDER: ThemeMode[] = ["light", "dark", "system"];

const MODE_LABELS: Record<ThemeMode, string> = {
  light: "Light mode",
  dark: "Dark mode",
  system: "System preference",
};

export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  function handleClick() {
    const currentIndex = MODE_ORDER.indexOf(mode);
    const nextIndex = (currentIndex + 1) % MODE_ORDER.length;
    setMode(MODE_ORDER[nextIndex]);
  }

  function getIcon() {
    switch (mode) {
      case "light":
        return <SunIcon />;
      case "dark":
        return <MoonIcon />;
      case "system":
        return <MonitorIcon />;
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={mode !== "system"}
      aria-label={MODE_LABELS[mode]}
      title={MODE_LABELS[mode]}
      className="inline-flex items-center gap-2 rounded-lg border border-[var(--theme-border-default)] bg-[var(--theme-bg-surface)] px-3 py-2 text-sm font-medium text-[var(--theme-text-primary)] shadow-sm transition-colors duration-200 hover:border-[var(--theme-border-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-color-primary)] focus:ring-offset-2"
    >
      {getIcon()}
      <span className="sr-only">{MODE_LABELS[mode]}</span>
    </button>
  );
}
