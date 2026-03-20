"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type FeedPayload = { version: number; items: Array<{ id: string; title: string; updatedAt: string }>; generatedAt: string };
type Report = {
  ts: string;
  longtasks: { count: number; p50: number; p95: number; max: number };
  polling: {
    totalRequests: number;
    ok: number;
    notModified: number;
    bytesTotal: number;
    bytesByMode: { naive: number; optimized: number };
  };
};

function fmtBytes(n: number) {
  const u = ["B", "KB", "MB", "GB"];
  let x = n;
  let i = 0;
  while (x >= 1024 && i < u.length - 1) {
    x /= 1024;
    i++;
  }
  return `${x.toFixed(i === 0 ? 0 : 1)} ${u[i]}`;
}

async function postTelemetry(body: unknown) {
  await fetch("/api/telemetry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
}

export default function Page() {
  const [mode, setMode] = useState<"naive" | "optimized">("naive");
  const [items, setItems] = useState<FeedPayload["items"]>([]);
  const [etag, setEtag] = useState<string>("");
  const [pollMs, setPollMs] = useState(1000);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const etagRef = useRef<string>("");

  useEffect(() => {
    etagRef.current = etag;
  }, [etag]);

  useEffect(() => {
    // Long Task observer (best-effort; not supported everywhere).
    const po =
      "PerformanceObserver" in window
        ? new PerformanceObserver((list) => {
            for (const e of list.getEntries()) {
              const dur = Math.round(e.duration);
              if (dur > 50) void postTelemetry({ type: "longtask", durationMs: dur });
            }
          })
        : null;
    try {
      po?.observe({ entryTypes: ["longtask"] as any });
    } catch {
      // ignore
    }
    return () => po?.disconnect();
  }, []);

  useEffect(() => {
    // Adaptive polling: when tab is hidden, back off (battery + CPU).
    const onVis = () => setPollMs(document.visibilityState === "hidden" ? 5000 : 1000);
    document.addEventListener("visibilitychange", onVis);
    onVis();
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  async function pollOnce() {
    const started = performance.now();
    const res = await fetch("/api/feed?limit=25", {
      headers: etagRef.current ? { "If-None-Match": etagRef.current } : {},
    });

    const bytesHeader = res.headers.get("content-length");
    let bytes = bytesHeader ? Number(bytesHeader) : 0;
    let status = res.status;

    if (res.status === 200) {
      const text = await res.text();
      bytes = bytes || text.length;
      const json = JSON.parse(text) as FeedPayload;
      setItems(json.items);
      setEtag(res.headers.get("etag") ?? "");
    }

    const latencyMs = Math.round((performance.now() - started) * 10) / 10;
    void postTelemetry({ type: "poll", status, bytes, mode });
    return { latencyMs, status, bytes };
  }

  useEffect(() => {
    let cancelled = false;
    let t: any;

    async function loop() {
      try {
        await pollOnce();
        const r = await fetch("/api/report").then((x) => x.json() as Promise<Report>);
        if (!cancelled) setReport(r);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
      if (!cancelled) t = setTimeout(loop, pollMs);
    }

    loop();
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollMs, mode]);

  const filtered = useMemo(() => {
    if (mode === "naive") {
      // Intentional inefficiency: O(n*m) scanning each render.
      let waste = 0;
      for (let i = 0; i < 20000; i++) waste += i % 7;
      void waste;
      return items.filter((x) => x.title.toLowerCase().includes(query.toLowerCase()));
    }
    // “Optimized”: avoid waste and use memoization.
    const q = query.toLowerCase();
    return items.filter((x) => x.title.toLowerCase().includes(q));
  }, [items, query, mode]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Efficiency Lab</h1>
        <p className="mt-2 text-slate-300">
          Battery/CPU efficiency via conditional requests, adaptive polling, and long-task telemetry.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">
            {error}
          </div>
        ) : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-1">
          <h2 className="text-lg font-semibold">Controls</h2>
          <div className="mt-4 flex gap-2">
            {(["naive", "optimized"] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={
                  "rounded px-3 py-2 text-sm font-semibold " +
                  (mode === m ? "bg-emerald-600 hover:bg-emerald-500" : "bg-slate-800 hover:bg-slate-700")
                }
                onClick={() => setMode(m)}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Search</span>
              <input
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Item 2"
              />
            </label>
          </div>
          <div className="mt-4 rounded border border-slate-800 bg-black/30 p-4 text-sm text-slate-200">
            <div className="font-semibold">Polling</div>
            <div className="mt-2 text-xs text-slate-300">
              Adaptive cadence: <span className="font-mono">{pollMs}ms</span> (slower when tab hidden)
            </div>
            <div className="mt-2 text-xs text-slate-300">
              Current ETag: <span className="break-all font-mono">{etag || "—"}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Feed</h2>
            <div className="text-xs text-slate-300">{filtered.length} items</div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {filtered.map((it) => (
              <div key={it.id} className="rounded border border-slate-800 bg-black/30 p-4">
                <div className="font-semibold text-slate-100">{it.title}</div>
                <div className="mt-1 font-mono text-xs text-slate-300">
                  {new Date(it.updatedAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <h2 className="text-lg font-semibold">Telemetry</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-slate-800 bg-black/30 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-300">Long tasks</div>
            <div className="mt-1 text-2xl font-bold">{report?.longtasks.count ?? 0}</div>
          </div>
          <div className="rounded border border-slate-800 bg-black/30 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-300">Bytes total</div>
            <div className="mt-1 text-2xl font-bold">{fmtBytes(report?.polling.bytesTotal ?? 0)}</div>
          </div>
          <div className="rounded border border-slate-800 bg-black/30 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-300">304s</div>
            <div className="mt-1 text-2xl font-bold">{report?.polling.notModified ?? 0}</div>
          </div>
        </div>
        <pre className="mt-6 overflow-auto rounded border border-slate-800 bg-black/40 p-4 text-xs text-slate-100">
{JSON.stringify(report, null, 2)}
        </pre>
      </section>
    </main>
  );
}

