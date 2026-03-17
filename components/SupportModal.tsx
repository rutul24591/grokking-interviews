"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { classNames } from "@/lib/classNames";

type SupportModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md rounded-2xl border border-theme bg-panel-soft p-6 shadow-strong-theme">
              {/* Header */}
              <div className="mb-6 text-center">
                <div className="mb-3 flex justify-center">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-3xl shadow-soft-theme"
                  >
                    ☕
                  </motion.span>
                </div>
                <h2
                  id="modal-title"
                  className="text-2xl font-bold text-heading"
                >
                  Support the Project
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Help keep this resource free and growing. Your support means
                  the world!
                </p>
              </div>

              {/* Support Options */}
              <div className="space-y-3">
                {/* Buy Me a Coffee Button */}
                <a
                  href="https://www.buymeacoffee.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classNames(
                    "flex items-center justify-center gap-3 rounded-xl border border-theme bg-panel px-4 py-4",
                    "transition hover:border-accent hover:bg-panel-hover",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  )}
                >
                  <span className="text-2xl">☕</span>
                  <div className="text-left">
                    <div className="font-semibold text-heading">
                      Buy Me a Coffee
                    </div>
                    <div className="text-xs text-muted">
                      One-time donation via Buy Me a Coffee
                    </div>
                  </div>
                  <span className="ml-auto text-muted">↗</span>
                </a>

                {/* GitHub Sponsors (Future) */}
                <div
                  className={classNames(
                    "flex items-center justify-center gap-3 rounded-xl border border-theme bg-panel px-4 py-4 opacity-50",
                    "cursor-not-allowed"
                  )}
                  aria-disabled="true"
                >
                  <span className="text-2xl">🐙</span>
                  <div className="text-left">
                    <div className="font-semibold text-heading">
                      GitHub Sponsors
                    </div>
                    <div className="text-xs text-muted">Coming soon</div>
                  </div>
                </div>

                {/* Patreon (Future) */}
                <div
                  className={classNames(
                    "flex items-center justify-center gap-3 rounded-xl border border-theme bg-panel px-4 py-4 opacity-50",
                    "cursor-not-allowed"
                  )}
                  aria-disabled="true"
                >
                  <span className="text-2xl">💎</span>
                  <div className="text-left">
                    <div className="font-semibold text-heading">Patreon</div>
                    <div className="text-xs text-muted">Coming soon</div>
                  </div>
                </div>
              </div>

              {/* Thank You Message */}
              <div className="mt-6 rounded-xl bg-panel p-4 text-center">
                <p className="text-sm text-muted">
                  💜 Every contribution helps maintain and improve this platform
                  for thousands of engineers preparing for interviews.
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className={classNames(
                  "mt-4 w-full rounded-xl border border-theme bg-panel px-4 py-3 font-medium",
                  "transition hover:bg-panel-hover",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                )}
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
