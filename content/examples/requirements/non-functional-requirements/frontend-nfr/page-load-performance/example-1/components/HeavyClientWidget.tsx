"use client";

import { useMemo, useState } from "react";

function expensiveCompute(n: number) {
  let x = 1;
  for (let i = 1; i < n; i++) x = (x * 48271) % 2147483647;
  return x;
}

export function HeavyClientWidget() {
  const [n, setN] = useState(350_000);
  const value = useMemo(() => expensiveCompute(n), [n]);
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-2">
      <h3 className="font-medium">Heavy client widget (lazy loaded)</h3>
      <p className="text-sm text-slate-300">
        This simulates a heavy client-only dependency. Lazy-loading keeps the initial page lighter.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
          onClick={() => setN((x) => x + 100_000)}
        >
          Increase work
        </button>
        <div className="text-sm text-slate-300">
          n=<span className="font-mono">{n}</span> • value=<span className="font-mono">{value}</span>
        </div>
      </div>
    </section>
  );
}

