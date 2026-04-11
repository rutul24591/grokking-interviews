"use client";

import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/features/theme/ThemeToggle";
import { NetworkStatus } from "@/features/network-status/NetworkStatus";
import { useSidebarStore } from "@/features/sidebar/sidebar.store";

export function TopBar() {
  const { isMobileOpen, setMobileOpen } = useSidebarStore();

  return (
    <header className="sticky top-0 z-50 border-b border-theme bg-theme-80 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left: Logo / Platform Name */}
        <div className="flex items-center gap-3">
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

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Network Status */}
          <NetworkStatus />
        </div>
      </div>
    </header>
  );
}
