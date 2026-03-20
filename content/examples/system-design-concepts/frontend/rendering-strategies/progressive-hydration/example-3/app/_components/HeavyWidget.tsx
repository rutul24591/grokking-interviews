"use client";

import { useMemo } from "react";

function expensiveCompute(seed: number) {
  let acc = seed;
  for (let i = 0; i < 320_000; i += 1) acc = (acc * 22695477 + 1) % 1_000_003;
  return acc;
}

export default function HeavyWidget({ label, seed }: { label: string; seed: number }) {
  const checksum = useMemo(() => expensiveCompute(seed), [seed]);
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">{label}</div>
      <div className="mt-3 text-sm text-slate-100">
        Mounted · checksum: <span className="font-mono">{checksum}</span>
      </div>
    </div>
  );
}

