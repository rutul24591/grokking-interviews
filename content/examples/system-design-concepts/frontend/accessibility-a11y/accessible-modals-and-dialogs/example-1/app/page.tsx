"use client";

import { useEffect, useId, useRef } from "react";

export default function Page() {
  const id = useId();
  const titleId = `${id}-title`;
  const descId = `${id}-desc`;
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => triggerRef.current?.focus();
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Accessible modal with native &lt;dialog&gt;</h1>
        <p className="mt-2 text-slate-300">
          Native dialogs handle focus trapping and Escape by default. You still must provide accessible labels.
        </p>
      </header>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-md bg-indigo-500/20 px-4 py-2 text-sm font-semibold hover:bg-indigo-500/30"
      >
        Open dialog
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="w-full max-w-lg rounded-xl border border-white/10 bg-black/95 p-0 text-slate-100"
      >
        <form method="dialog" className="p-6">
          <h2 id={titleId} className="text-xl font-semibold">
            Update settings
          </h2>
          <p id={descId} className="mt-2 text-sm text-slate-300">
            Use Tab to move within the modal. Press Escape to close.
          </p>

          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4" /> Enable notifications
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4" /> Weekly digest
            </label>
          </div>

          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <button className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15" value="cancel">
              Cancel
            </button>
            <button className="rounded-md bg-indigo-500/20 px-3 py-2 text-sm font-semibold hover:bg-indigo-500/30" value="save">
              Save
            </button>
          </div>
        </form>
      </dialog>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
        <h2 className="text-base font-semibold text-slate-100">Production notes</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            Prefer <code>&lt;dialog&gt;</code> when possible. It avoids z-index/backdrop/focus-trap DIY failures.
          </li>
          <li>
            Always restore focus to the trigger on close; otherwise keyboard users “lose” their place.
          </li>
        </ul>
      </section>
    </main>
  );
}

