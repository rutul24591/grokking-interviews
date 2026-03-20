"use client";

import { useMemo, useState } from "react";

function expensiveCompute(seed: number) {
  let acc = seed;
  for (let i = 0; i < 350_000; i += 1) acc = (acc * 1103515245 + 12345) % 1_000_003;
  return acc;
}

export default function HeavyWidget({ label }: { label: string }) {
  const [value, setValue] = useState(1);
  const result = useMemo(() => expensiveCompute(value), [value]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">{label}</div>
      <div className="mt-3 text-sm text-slate-100">
        Heavy widget mounted. CPU checksum: <span className="font-mono">{result}</span>
      </div>
      <button
        type="button"
        onClick={() => setValue((v) => v + 1)}
        className="mt-3 rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-sm text-slate-200 hover:border-slate-600"
      >
        Recompute
      </button>
    </div>
  );
}

