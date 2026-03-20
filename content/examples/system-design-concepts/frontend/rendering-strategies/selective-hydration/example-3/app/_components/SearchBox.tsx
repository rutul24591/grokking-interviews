"use client";

import { useMemo, useState } from "react";

export default function SearchBox() {
  const [q, setQ] = useState("");
  const normalized = useMemo(() => q.trim().toLowerCase(), [q]);
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">Search (fast)</div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Type to prove hydration"
        className="mt-3 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-600"
      />
      <div className="mt-2 text-xs text-slate-500">
        normalized: <span className="font-mono">{normalized || "—"}</span>
      </div>
    </div>
  );
}

