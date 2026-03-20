"use client";

import { useRef, useState } from "react";

export default function InteractionIsland() {
  const [clicks, setClicks] = useState(0);
  const [moves, setMoves] = useState(0);
  const lastMoveRef = useRef(0);

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
      onMouseMove={() => {
        // Light throttle so we don’t flood renders.
        const now = performance.now();
        if (now - lastMoveRef.current < 80) return;
        lastMoveRef.current = now;
        setMoves((m) => m + 1);
      }}
    >
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
        Suspended island (try hover + click before hydration)
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-100">
        <button
          type="button"
          onClick={() => setClicks((c) => c + 1)}
          className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-sm text-slate-200 hover:border-slate-600"
        >
          Click me
        </button>
        <div>
          clicks: <span className="font-mono">{clicks}</span>
        </div>
        <div>
          mouse moves: <span className="font-mono">{moves}</span>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-500">
        In many setups, click events can be replayed after hydration; continuous events like mousemove are not reliably replayed.
      </div>
    </div>
  );
}

