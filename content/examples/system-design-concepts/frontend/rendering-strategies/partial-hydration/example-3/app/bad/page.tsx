"use client";

import { useMemo, useState } from "react";
import { buildItems } from "@/lib/data";

export default function BadPage() {
  const [query, setQuery] = useState("");

  // Entire page is client-rendered/hydrated, including data + filtering logic.
  const items = useMemo(() => buildItems(250), []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = q ? items.filter((i) => i.title.toLowerCase().includes(q)) : items;

    // Artificial client-side CPU work to emphasize cost.
    let acc = 0;
    for (let i = 0; i < 120_000; i += 1) acc = (acc + i * 17) % 1_000_003;
    return { out, acc };
  }, [items, query]);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">/bad — Client Boundary Explosion</h1>
        <p className="mt-1 text-sm text-slate-300">
          The entire page is a client component. Filtering + rendering happen on the client.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter"
            className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-600"
          />
          <div className="mt-2 text-xs text-slate-500">
            CPU checksum: <span className="font-mono">{filtered.acc}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {filtered.out.slice(0, 30).map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="text-sm font-semibold text-slate-100">{item.title}</div>
              <div className="mt-1 text-xs text-slate-500">
                score: <span className="font-mono">{item.score}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-xs text-slate-500">
          In production this tends to increase bundle size and hydration work. Prefer server rendering + leaf islands.
        </div>
      </div>
    </main>
  );
}

