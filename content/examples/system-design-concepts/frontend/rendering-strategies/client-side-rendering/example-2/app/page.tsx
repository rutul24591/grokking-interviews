"use client";

import { memo, useDeferredValue, useMemo, useState } from "react";
import { FixedSizeList } from "react-window";

type Row = { id: number; title: string; body: string };

function buildRows(count: number): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < count; i++) {
    rows.push({
      id: i,
      title: `Row #${i}`,
      body: `This is a long-ish body for row ${i}. Filtering this list simulates expensive work in the render path.`,
    });
  }
  return rows;
}

const NaiveRow = memo(function NaiveRow({ row }: { row: Row }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
      <div className="text-sm font-semibold text-slate-100">{row.title}</div>
      <div className="mt-1 text-xs text-slate-400">{row.body}</div>
    </div>
  );
});

export default function Page() {
  const [mode, setMode] = useState<"naive" | "virtualized">("naive");
  const [filter, setFilter] = useState("");
  const deferredFilter = useDeferredValue(filter);

  const rows = useMemo(() => buildRows(10_000), []);
  const filtered = useMemo(() => {
    const q = deferredFilter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.title.toLowerCase().includes(q) || r.body.toLowerCase().includes(q));
  }, [rows, deferredFilter]);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold tracking-tight">CSR Performance Demo</h1>
        <p className="mt-1 text-sm text-slate-300">
          Toggle naive vs virtualized rendering and type quickly in the filter.
        </p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:w-[24rem]">
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-300">Filter</label>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Try: 1, 99, row #12..."
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-indigo-400"
            />
            <div className="mt-2 text-xs text-slate-500">
              `useDeferredValue` reduces input jank by deferring expensive filtering/renders.
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("naive")}
              className={[
                "rounded-xl border px-4 py-3 text-sm transition",
                mode === "naive"
                  ? "border-indigo-400 bg-indigo-500/10 text-slate-50"
                  : "border-slate-800 bg-slate-950/30 text-slate-300 hover:border-slate-600",
              ].join(" ")}
            >
              Naive
            </button>
            <button
              type="button"
              onClick={() => setMode("virtualized")}
              className={[
                "rounded-xl border px-4 py-3 text-sm transition",
                mode === "virtualized"
                  ? "border-indigo-400 bg-indigo-500/10 text-slate-50"
                  : "border-slate-800 bg-slate-950/30 text-slate-300 hover:border-slate-600",
              ].join(" ")}
            >
              Virtualized
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-200">
              Results: {filtered.length.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">Mode: {mode}</div>
          </div>

          <div className="mt-4">
            {mode === "naive" ? (
              <div className="space-y-3">
                {filtered.slice(0, 400).map((row) => (
                  <NaiveRow key={row.id} row={row} />
                ))}
                <div className="text-xs text-slate-500">
                  Naive mode renders up to 400 DOM nodes to keep the demo usable.
                  Virtualization is what makes 10k+ lists practical in CSR.
                </div>
              </div>
            ) : (
              <FixedSizeList
                height={560}
                itemCount={filtered.length}
                itemSize={84}
                width="100%"
                itemData={filtered}
              >
                {({ index, style, data }) => {
                  const row: Row = data[index];
                  return (
                    <div style={style} className="pr-2">
                      <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
                        <div className="text-sm font-semibold text-slate-100">{row.title}</div>
                        <div className="mt-1 text-xs text-slate-400">{row.body}</div>
                      </div>
                    </div>
                  );
                }}
              </FixedSizeList>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

