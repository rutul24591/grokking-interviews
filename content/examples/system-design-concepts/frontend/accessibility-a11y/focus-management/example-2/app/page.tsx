"use client";

import { useRef, useState } from "react";
import { useRestoreFocus } from "@/lib/useRestoreFocus";
import { useSafeAutoFocus } from "@/lib/useSafeAutoFocus";

export default function Page() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useRestoreFocus({ active: open, restoreTo: triggerRef });
  useSafeAutoFocus({ active: open, targetRef: overlayRef });

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Focus hooks</h1>
        <p className="mt-2 text-slate-300">Open the overlay, press Tab, then close and observe focus restoration.</p>
      </header>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-indigo-500/20 px-4 py-2 text-sm font-semibold hover:bg-indigo-500/30"
      >
        Open overlay
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <div
            ref={overlayRef}
            tabIndex={-1}
            className="w-full max-w-md rounded-xl border border-white/10 bg-black/90 p-6 outline-none"
          >
            <h2 className="text-xl font-semibold">Overlay</h2>
            <p className="mt-2 text-sm text-slate-300">This container receives focus when opened.</p>
            <div className="mt-6 flex gap-3">
              <button className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15">
                Secondary
              </button>
              <button
                className="rounded-md bg-indigo-500/20 px-3 py-2 text-sm font-semibold hover:bg-indigo-500/30"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <p className="mt-4 text-xs text-slate-400">Press Escape to close.</p>
          </div>
        </div>
      ) : null}
    </main>
  );
}

