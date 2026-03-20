"use client";

import { useState } from "react";

export default function LeafCounter() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-sm text-slate-200 hover:border-slate-600"
      >
        Increment
      </button>
      <div className="text-sm text-slate-100">
        Leaf island state: <span className="font-mono">{count}</span>
      </div>
    </div>
  );
}

