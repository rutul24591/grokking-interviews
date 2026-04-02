"use client";

import { useEffect, useMemo, useState } from "react";

type Span = {
  traceId: string;
  spanId: string;
  parentSpanId: string | null;
  name: string;
  service: string;
  startedAt: number;
  endedAt?: number;
  durationMs: number | null;
};

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export default function Page() {
  const [traceId, setTraceId] = useState("");
  const [spans, setSpans] = useState<Span[]>([]);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);

  async function runOnce() {
    setRunning(true);
    setError("");
    try {
      const r = await json<{ traceId: string }>("/api/request", { method: "POST", body: "{}" });
      setTraceId(r.traceId);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  }

  async function refresh() {
    if (!traceId) return;
    const r = await json<{ spans: Span[] }>(`/api/spans?traceId=${traceId}`);
    setSpans(r.spans);
  }

  async function reset() {
    await json("/api/reset", { method: "POST", body: "{}" });
    setTraceId("");
    setSpans([]);
  }

  useEffect(() => {
    refresh().catch(() => {});
    const t = setInterval(() => refresh().catch(() => {}), 800);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traceId]);

  const base = useMemo(() => {
    if (!spans.length) return null;
    return Math.min(...spans.map((s) => s.startedAt));
  }, [spans]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Trace Lab</h1>
        <p className="mt-2 text-slate-300">
          Multi-hop traceparent propagation with spans you can query by trace ID.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">
            {error}
          </div>
        ) : null}
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={runOnce}
            disabled={running}
            className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50"
          >
            {running ? "Running..." : "Run traced request"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700"
          >
            Reset
          </button>
          <div className="text-sm text-slate-300">
            traceId: <span className="font-mono text-slate-100">{traceId || "—"}</span>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <h2 className="text-lg font-semibold">Spans</h2>
        <div className="mt-4 overflow-auto rounded border border-slate-800">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-black/40 text-xs uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-3 py-2">Service</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Span</th>
                <th className="px-3 py-2">Parent</th>
                <th className="px-3 py-2">Start+ms</th>
                <th className="px-3 py-2">Duration</th>
              </tr>
            </thead>
            <tbody className="text-slate-100">
              {spans.map((s) => (
                <tr key={s.spanId} className="border-t border-slate-800">
                  <td className="px-3 py-2">{s.service}</td>
                  <td className="px-3 py-2 font-mono text-xs">{s.name}</td>
                  <td className="px-3 py-2 font-mono text-xs">{s.spanId}</td>
                  <td className="px-3 py-2 font-mono text-xs">{s.parentSpanId ?? "—"}</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {base ? s.startedAt - base : 0}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {s.durationMs == null ? "—" : `${s.durationMs}ms`}
                  </td>
                </tr>
              ))}
              {!spans.length ? (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-slate-300">
                    Run a traced request to see spans.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

