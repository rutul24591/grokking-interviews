"use client";

import { useState } from "react";

export default function Comments() {
  const [count, setCount] = useState(0);
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">Comments (slow)</div>
      <p className="mt-2 text-sm text-slate-300">This island hydrates after a simulated delay.</p>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="mt-3 rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-sm text-slate-200 hover:border-slate-600"
      >
        Increment
      </button>
      <div className="mt-2 text-sm text-slate-100">
        Count: <span className="font-mono">{count}</span>
      </div>
    </div>
  );
}

