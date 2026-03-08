"use client";

import { useThemeStore } from "@/features/theme/theme.store";
import { useThemeEffect } from "@/features/theme/useThemeEffect";
import { classNames } from "@/lib/classNames";
import { useHasMounted } from "@/lib/useHasMounted";

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const resolvedTheme = useThemeEffect();
  const mounted = useHasMounted();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={classNames(
        "inline-flex cursor-pointer items-center gap-2 rounded-full border border-theme px-3 py-1.5 text-xs font-medium",
        "text-theme transition hover:border-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
      )}
      aria-label="Toggle theme"
    >
      <span
        className="h-2 w-2 rounded-full bg-accent"
        aria-hidden
      />
      <span>
        {mounted ? (resolvedTheme === "dark" ? "Dark" : "Light") : "Theme"}
      </span>
      <span className="text-muted">
        {mounted ? (theme === "system" ? "Auto" : "Manual") : "System"}
      </span>
    </button>
  );
}
