"use client";

import { useState } from "react";
import { ThemeToggle } from "@/features/theme/ThemeToggle";
import { NetworkStatus } from "@/features/network-status/NetworkStatus";
import { SupportModal } from "@/components/SupportModal";
import { classNames } from "@/lib/classNames";

export function TopBar() {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-theme bg-theme-80 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Left: Logo / Platform Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent shadow-soft-theme">
              <span className="text-lg font-bold text-white">IP</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-heading sm:display-none">
                Interview Prep Studio
              </h1>
              {/* <p className="text-xs text-muted">
                Master System Design &amp; Technical Interviews
              </p> */}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Support Button */}
            <button
              type="button"
              onClick={() => setIsSupportModalOpen(true)}
              className={classNames(
                "inline-flex items-center gap-2 rounded-full border border-theme px-3 py-2 text-sm font-medium",
                "text-theme transition hover:border-accent hover:bg-panel-hover",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              )}
              aria-label="Support the project"
            >
              <span className="text-base">☕</span>
              <span className="hidden sm:inline">Buy Me a Coffee</span>
            </button>

            {/* Divider */}
            <div className="hidden h-6 w-px bg-border sm:block" />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Network Status */}
            <NetworkStatus />
          </div>
        </div>
      </header>

      {/* Support Modal */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </>
  );
}
