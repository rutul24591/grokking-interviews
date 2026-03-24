"use client";

import { useMemo, useRef, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Page() {
  const rows = 3;
  const cols = 4;
  const total = rows * cols;
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const [index, setIndex] = useState(0);

  const cells = useMemo(
    () => Array.from({ length: total }, (_, i) => ({ id: `cell-${i}`, label: `Cell ${i + 1}` })),
    [total]
  );

  function focus(next: number) {
    setIndex(next);
    refs.current[next]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const r = Math.floor(index / cols);
    const c = index % cols;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      focus(clamp(index + 1, 0, total - 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focus(clamp(index - 1, 0, total - 1));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      focus(clamp(index + cols, 0, total - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focus(clamp(index - cols, 0, total - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      focus(r * cols);
    } else if (e.key === "End") {
      e.preventDefault();
      focus(r * cols + (cols - 1));
    }
  }

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Keyboard navigation: 2D grid</h1>
        <p className="mt-2 text-slate-300">A common advanced pattern (calendars, icon pickers, spreadsheets).</p>
      </header>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Grid</h2>
        <div
          role="grid"
          aria-label="Demo grid"
          className="mt-4 grid grid-cols-4 gap-2"
          onKeyDown={onKeyDown}
        >
          {cells.map((cell, idx) => {
            const isTabStop = idx === index;
            return (
              <button
                key={cell.id}
                ref={(el) => {
                  refs.current[idx] = el;
                }}
                type="button"
                role="gridcell"
                tabIndex={isTabStop ? 0 : -1}
                onFocus={() => setIndex(idx)}
                className={[
                  "rounded-md border border-white/10 px-3 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-400/40",
                  isTabStop ? "bg-indigo-500/20 text-slate-100" : "bg-black/30 text-slate-300 hover:bg-black/40"
                ].join(" ")}
              >
                {cell.label}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-slate-300">
          Focused: <span className="font-semibold text-slate-100">{cells[index]!.label}</span>
        </p>
      </div>
    </main>
  );
}

