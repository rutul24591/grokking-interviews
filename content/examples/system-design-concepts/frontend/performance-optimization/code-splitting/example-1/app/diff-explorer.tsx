"use client";

import { useMemo, useState } from "react";

function computeDiffCost(rows: string[]) {
  let total = 0;
  for (const row of rows) {
    for (let i = 0; i < 5000; i += 1) {
      total = (total + row.length * (i + 5)) % 999983;
    }
  }
  return total;
}

export default function DiffExplorer() {
  const [versionA, setVersionA] = useState("hydration");
  const [versionB, setVersionB] = useState("streaming");
  const rows = useMemo(() => [versionA, versionB, `${versionA}:${versionB}`], [versionA, versionB]);
  const checksum = useMemo(() => computeDiffCost(rows), [rows]);

  return (
    <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Heavy comparison chunk</div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <input
          value={versionA}
          onChange={(event) => setVersionA(event.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          value={versionB}
          onChange={(event) => setVersionB(event.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </div>
      <div className="mt-4 text-sm text-slate-600">
        Diff checksum: <span className="font-mono text-slate-900">{checksum}</span>
      </div>
    </div>
  );
}

