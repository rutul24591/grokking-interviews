"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { getFocusable, trapTabKey } from "@/lib/focusTrap";

function setInert(target: HTMLElement, inert: boolean) {
  // inert is now broadly supported; keep aria-hidden fallback for older ATs.
  // @ts-expect-error: inert not yet in TS lib dom by default.
  target.inert = inert;
  target.setAttribute("aria-hidden", inert ? "true" : "false");
}

export default function Page() {
  const id = useId();
  const titleId = `${id}-title`;
  const descId = `${id}-desc`;

  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const focusables = useMemo(() => (open && overlayRef.current ? getFocusable(overlayRef.current) : []), [open]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    setInert(content, open);
    return () => setInert(content, false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    // Focus first focusable element inside the overlay.
    const first = getFocusable(overlayRef.current).at(0);
    first?.focus();
  }, [open]);

  useEffect(() => {
    if (open) return;
    triggerRef.current?.focus();
  }, [open]);

  return (
    <div className="min-h-dvh">
      <div ref={contentRef} className="mx-auto w-full max-w-4xl px-4 py-10">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">Custom dialog (non-&lt;dialog&gt;)</h1>
          <p className="mt-2 text-slate-300">
            When you can’t use native <code>&lt;dialog&gt;</code>, you must implement focus trap + background inerting.
          </p>
        </header>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="mt-6 rounded-md bg-indigo-500/20 px-4 py-2 text-sm font-semibold hover:bg-indigo-500/30"
        >
          Open custom dialog
        </button>

        <section className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Background content</h2>
          <p className="mt-2">When the dialog opens, this area becomes inert (non-interactive) and hidden from AT.</p>
          <a className="mt-3 inline-block hover:underline" href="#noop">
            Background link
          </a>
        </section>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
            if (e.key === "Tab") trapTabKey(e, focusables);
          }}
        >
          <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            className="w-full max-w-lg rounded-xl border border-white/10 bg-black/95 p-6 outline-none"
          >
            <h2 id={titleId} className="text-xl font-semibold">
              Custom dialog
            </h2>
            <p id={descId} className="mt-2 text-sm text-slate-300">
              Tab is trapped in this overlay. Click outside or press Escape to close.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" /> Enable experimental feature
              </label>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
              <button className="rounded-md bg-indigo-500/20 px-3 py-2 text-sm font-semibold hover:bg-indigo-500/30">
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

