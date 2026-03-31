"use client";

import { useMemo, useState } from "react";

function expensiveChartSimulation(points: number[]) {
  let total = 0;
  for (const value of points) {
    for (let i = 0; i < 4500; i += 1) {
      total = (total + value * (i + 3)) % 10000019;
    }
  }
  return total;
}

export default function AnalysisWidget() {
  const [scale, setScale] = useState(1);
  const points = useMemo(() => Array.from({ length: 24 }, (_, i) => (i + 1) * scale), [scale]);
  const checksum = useMemo(() => expensiveChartSimulation(points), [points]);

  return (
    <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Heavy analysis chunk</div>
      <div className="mt-3 text-sm text-slate-700">
        This widget simulates an expensive charting module that should not live in the initial bundle.
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setScale((value) => value + 1)}
          className="rounded-full bg-slate-950 px-4 py-2 text-sm text-white"
        >
          Recompute
        </button>
        <span className="text-xs font-mono text-slate-500">{checksum}</span>
      </div>
    </div>
  );
}

