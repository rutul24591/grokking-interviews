"use client";

import { Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "@/features/theme/ThemeToggle";
import { NetworkStatus } from "@/features/network-status/NetworkStatus";
import { useSidebarStore } from "@/features/sidebar/sidebar.store";

export function TopBar() {
  const { isMobileOpen, setMobileOpen } = useSidebarStore();

  return (
    <header className="sticky top-0 z-50 border-b border-theme bg-theme-80 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left: Logo / Platform Name */}
        <div className="flex shrink-0 items-center gap-3">
          {/* Mobile sidebar toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!isMobileOpen)}
            className="flex items-center justify-center rounded-lg p-1.5 text-muted transition hover:bg-panel-hover hover:text-heading lg:hidden cursor-pointer"
            aria-label={
              isMobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent shadow-soft-theme">
            <span className="text-lg font-bold text-white">IP</span>
          </div>
          <div>
            <h1 className="hidden text-lg font-bold text-heading sm:block">
              Interview Prep Studio
            </h1>
          </div>
        </div>

        <form
          action="/search"
          method="GET"
          role="search"
          className="mx-3 flex min-w-0 flex-1 justify-center sm:mx-6"
        >
          <label htmlFor="global-article-search" className="sr-only">
            Search article topics
          </label>
          <div className="relative w-full max-w-xl">
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              id="global-article-search"
              name="q"
              type="search"
              maxLength={120}
              placeholder="Search articles..."
              className="h-10 w-full rounded-xl border border-theme bg-panel py-2 pl-10 pr-3 text-sm text-heading shadow-soft-theme transition placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </form>

        {/* Right: Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Network Status */}
          <NetworkStatus />
        </div>
      </div>
    </header>
  );
}
