"use client";

import { useEffect, useId, useRef, useState } from "react";

export default function Page() {
  const id = useId();
  const titleId = `${id}-title`;
  const descId = `${id}-desc`;

  const [open, setOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => cancelRef.current?.focus(), 0);
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Destructive confirmation (alertdialog)</h1>
        <p className="mt-2 text-slate-300">
          <code>role=&quot;alertdialog&quot;</code> is for interruptions requiring immediate attention. Default focus
          should be on the safe action.
        </p>
      </header>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/20"
      >
        Delete project…
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            className="w-full max-w-lg rounded-xl border border-white/10 bg-black/95 p-6"
          >
            <h2 id={titleId} className="text-xl font-semibold">
              Delete project?
            </h2>
            <p id={descId} className="mt-2 text-sm text-slate-300">
              This action cannot be undone. If this were a real app, you’d also verify ownership and require
              re-authentication.
            </p>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <button
                ref={cancelRef}
                type="button"
                className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-rose-500/15 px-3 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/20"
                onClick={() => setOpen(false)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
        <h2 className="text-base font-semibold text-slate-100">Edge-case guidance</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Don’t stack modals. Prefer replacing content or using a single dialog with steps.</li>
          <li>For confirm dialogs, default focus on Cancel reduces accidental destructive actions.</li>
        </ul>
      </section>
    </main>
  );
}

