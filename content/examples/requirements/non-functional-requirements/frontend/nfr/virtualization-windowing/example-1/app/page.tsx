"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { VirtualList } from "@/components/VirtualList";

function ItemRow({ i }: { i: number }) {
  return (
    <div className="h-9 flex items-center justify-between px-3 border-b border-slate-800 text-sm">
      <span className="text-slate-200">Row #{i + 1}</span>
      <span className="font-mono text-xs text-slate-400">{(i * 2654435761) >>> 0}</span>
    </div>
  );
}

type ApiRow = { index: number; label: string; hash: number };

function RemoteItemRow({ i, row }: { i: number; row: ApiRow | null }) {
  return (
    <div className="h-9 flex items-center justify-between px-3 border-b border-slate-800 text-sm">
      <span className="text-slate-200">{row ? row.label : `Row #${i + 1}`}</span>
      <span className="font-mono text-xs text-slate-400">{row ? row.hash : "…"}</span>
    </div>
  );
}

export default function Page() {
  const [mode, setMode] = useState<"virtual" | "all" | "remote">("virtual");
  const count = 10_000;
  const rows = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  const [remoteRows, setRemoteRows] = useState<Record<number, ApiRow>>({});
  const inflightPages = useRef<Set<number>>(new Set());
  const loadedPages = useRef<Set<number>>(new Set());
  const PAGE_SIZE = 120;

  const fetchPage = useCallback(async (page: number) => {
    if (loadedPages.current.has(page) || inflightPages.current.has(page)) return;
    inflightPages.current.add(page);
    const offset = page * PAGE_SIZE;
    try {
      const res = await fetch(`/api/rows?offset=${offset}&limit=${PAGE_SIZE}`);
      if (!res.ok) throw new Error(`rows fetch failed: ${res.status}`);
      const data = (await res.json()) as { ok: boolean; rows?: ApiRow[] };
      const items = Array.isArray(data.rows) ? data.rows : [];
      setRemoteRows((prev) => {
        const next = { ...prev };
        for (const r of items) next[r.index] = r;
        return next;
      });
      loadedPages.current.add(page);
    } finally {
      inflightPages.current.delete(page);
    }
  }, []);

  const onRangeChange = useCallback(
    (range: { start: number; end: number }) => {
      if (mode !== "remote") return;
      const startPage = Math.floor(range.start / PAGE_SIZE);
      const endPage = Math.floor(Math.max(0, range.end - 1) / PAGE_SIZE);
      for (let p = startPage; p <= endPage; p++) void fetchPage(p);
    },
    [fetchPage, mode]
  );

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Virtualization/windowing — keep DOM small</h1>
        <p className="text-sm text-slate-300">
          Rendering thousands of DOM nodes can destroy scroll perf. Windowing renders only what&apos;s
          visible (plus overscan).
        </p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            className={`rounded-lg px-3 py-2 text-sm font-medium ${mode === "virtual" ? "bg-indigo-600 hover:bg-indigo-500" : "bg-slate-700 hover:bg-slate-600"}`}
            onClick={() => setMode("virtual")}
          >
            Virtualized
          </button>
          <button
            className={`rounded-lg px-3 py-2 text-sm font-medium ${mode === "remote" ? "bg-indigo-600 hover:bg-indigo-500" : "bg-slate-700 hover:bg-slate-600"}`}
            onClick={() => setMode("remote")}
          >
            Virtualized (remote)
          </button>
          <button
            className={`rounded-lg px-3 py-2 text-sm font-medium ${mode === "all" ? "bg-indigo-600 hover:bg-indigo-500" : "bg-slate-700 hover:bg-slate-600"}`}
            onClick={() => setMode("all")}
          >
            Render all ({count})
          </button>
        </div>

        <div className="text-xs text-slate-400">
          Mode: <span className="font-mono">{mode}</span> • Target: {count.toLocaleString()} rows
        </div>
        {mode === "remote" ? (
          <div className="text-xs text-slate-400">
            Loaded from API: <span className="font-mono">{Object.keys(remoteRows).length}</span> rows • Pages:{" "}
            <span className="font-mono">{loadedPages.current.size}</span>
          </div>
        ) : null}
      </section>

      {mode === "virtual" ? (
        <VirtualList
          count={count}
          rowHeight={36}
          height={520}
          overscan={6}
          renderRow={(i) => <ItemRow i={i} />}
        />
      ) : mode === "remote" ? (
        <VirtualList
          count={count}
          rowHeight={36}
          height={520}
          overscan={6}
          onRangeChange={onRangeChange}
          renderRow={(i) => <RemoteItemRow i={i} row={remoteRows[i] ?? null} />}
        />
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-950/30 overflow-auto" style={{ height: 520 }}>
          {rows.map((i) => (
            <ItemRow key={i} i={i} />
          ))}
        </div>
      )}

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Trade-offs</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Fixed row height is simplest; variable-height lists need measurement and more complexity.</li>
          <li>Overscan reduces “blanking” during fast scroll but increases work.</li>
          <li>Windowing is also valuable for grids, chat logs, and tables.</li>
          <li>Remote data adds complexity: prefetch by visible range, cache pages, and handle failures without jank.</li>
        </ul>
      </section>
    </main>
  );
}
