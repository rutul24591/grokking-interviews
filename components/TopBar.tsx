"use client";

import { APP_TITLE } from "@/lib/constants";
import { ThemeToggle } from "@/features/theme/ThemeToggle";
import { NetworkStatus } from "@/features/network-status/NetworkStatus";
import { useSidebarStore } from "@/features/sidebar/sidebar.store";
import { classNames } from "@/lib/classNames";

export function TopBar() {
  const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);

  return (
    <header className="topbar-h sticky top-0 z-30 border-b border-theme bg-theme-80 backdrop-blur">
      <div className="mx-auto flex h-full w-full max-w-[1400px] items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className={classNames(
              "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-theme",
              "text-theme transition hover:border-accent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden",
            )}
            aria-label="Open navigation"
          >
            <span className="text-lg" aria-hidden>
              ≡
            </span>
          </button>
          <div>
            <h1 className="text-lg font-semibold text-heading">{APP_TITLE}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NetworkStatus />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
