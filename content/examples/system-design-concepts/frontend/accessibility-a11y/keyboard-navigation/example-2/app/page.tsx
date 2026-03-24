"use client";

import { useRef, useState } from "react";
import { useRovingFocus } from "@/lib/useRovingFocus";

const ITEMS = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"];

export default function Page() {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const [selected, setSelected] = useState(0);

  const roving = useRovingFocus({
    size: ITEMS.length,
    getNode: (idx) => refs.current[idx] ?? null,
    onActivate: (idx) => setSelected(idx)
  });

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Reusable roving focus hook</h1>
        <p className="mt-2 text-slate-300">Use Arrow keys to move focus; Enter/Space activates the focused item.</p>
      </header>

      <div
        role="listbox"
        aria-label="Items"
        className="rounded-xl border border-white/10 bg-white/5 p-6"
        onKeyDown={roving.onKeyDown}
      >
        <ul className="flex flex-wrap gap-2">
          {ITEMS.map((name, idx) => {
            const isSelected = idx === selected;
            const isTabStop = idx === roving.focusedIndex;
            return (
              <li key={name}>
                <button
                  ref={(el) => {
                    refs.current[idx] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={isTabStop ? 0 : -1}
                  onFocus={() => roving.setFocusedIndex(idx)}
                  onClick={() => setSelected(idx)}
                  className={[
                    "rounded-md px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-400/40",
                    isSelected ? "bg-indigo-500/30 text-slate-100" : "bg-white/5 text-slate-300 hover:bg-white/10"
                  ].join(" ")}
                >
                  {name}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-sm text-slate-300">
          Selected: <span className="font-semibold text-slate-100">{ITEMS[selected]}</span>
        </p>
      </div>
    </main>
  );
}

