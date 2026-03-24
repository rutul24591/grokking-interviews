"use client";

import { useEffect, useId, useRef, useState } from "react";

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onOutside: () => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (ref.current && !ref.current.contains(target)) onOutside();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [enabled, onOutside, ref]);
}

export default function Page() {
  const id = useId();
  const panelId = `${id}-panel`;
  const menuId = `${id}-menu`;

  const [openPanel, setOpenPanel] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const menuWrapRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useClickOutside(menuWrapRef, () => setOpenMenu(false), openMenu);

  useEffect(() => {
    if (!openMenu) triggerRef.current?.focus();
  }, [openMenu]);

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">ARIA: expanded + controls</h1>
        <p className="mt-2 text-slate-300">
          Buttons that show/hide UI should expose state with <code>aria-expanded</code> and reference controlled content
          with <code>aria-controls</code>.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Disclosure</h2>
        <button
          type="button"
          aria-expanded={openPanel}
          aria-controls={panelId}
          onClick={() => setOpenPanel((v) => !v)}
          className="mt-4 rounded-md bg-indigo-500/20 px-4 py-2 text-sm font-semibold hover:bg-indigo-500/30"
        >
          {openPanel ? "Hide" : "Show"} details
        </button>
        <div
          id={panelId}
          hidden={!openPanel}
          className="mt-4 rounded-lg border border-white/10 bg-black/30 p-4 text-sm text-slate-300"
        >
          <p>
            This region is controlled by the disclosure button. The state is reflected in <code>aria-expanded</code>.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Menu button</h2>
        <div className="relative mt-4 inline-block" ref={menuWrapRef}>
          <button
            ref={triggerRef}
            type="button"
            aria-haspopup="menu"
            aria-expanded={openMenu}
            aria-controls={menuId}
            onClick={() => setOpenMenu((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpenMenu(false);
              if (e.key === "ArrowDown") setOpenMenu(true);
            }}
            className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"
          >
            Actions
          </button>

          {openMenu ? (
            <ul
              id={menuId}
              role="menu"
              aria-label="Actions"
              className="absolute left-0 mt-2 w-56 rounded-lg border border-white/10 bg-black/90 p-2 text-sm"
            >
              <li role="none">
                <button role="menuitem" className="w-full rounded-md px-3 py-2 text-left hover:bg-white/10">
                  Duplicate
                </button>
              </li>
              <li role="none">
                <button role="menuitem" className="w-full rounded-md px-3 py-2 text-left hover:bg-white/10">
                  Move to…
                </button>
              </li>
              <li role="none">
                <button
                  role="menuitem"
                  className="w-full rounded-md px-3 py-2 text-left text-rose-200 hover:bg-rose-500/15"
                  onClick={() => setOpenMenu(false)}
                >
                  Delete
                </button>
              </li>
            </ul>
          ) : null}
        </div>

        <p className="mt-4 text-sm text-slate-300">
          When the menu closes we return focus to the trigger. Escape also closes the menu.
        </p>
      </section>
    </main>
  );
}

