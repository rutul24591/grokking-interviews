"use client";

import { useEffect, useMemo, useState } from "react";
import { startRum } from "@/lib/rum/client";

type Summary = {
  total: number;
  byType: Record<string, number>;
  p95?: Record<string, number>;
  topErrors: Array<{ name: string; count: number }>;
};

async function getSummary(): Promise<Summary> {
  const res = await fetch("/api/rum/summary", { cache: "no-store" });
  if (!res.ok) throw new Error(`summary failed: ${res.status}`);
  return (await res.json()) as Summary;
}

function fmtMs(v?: number) {
  if (v === undefined) return "—";
  return `${Math.round(v)}ms`;
}

export default function Page() {
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    byType: {},
    topErrors: [],
  });
  const sessionId = useMemo(() => {
    if (typeof window === "undefined") return "server";
    return window.localStorage.getItem("rum.sid") || "unknown";
  }, []);

  useEffect(() => {
    const stop = startRum({
      endpoint: "/api/rum/ingest",
      app: "rum-demo",
      version: "1.0.0",
      sampleRate: 1,
    });
    return () => stop();
  }, []);

  useEffect(() => {
    let mounted = true;
    const tick = async () => {
      try {
        const s = await getSummary();
        if (mounted) setSummary(s);
      } catch {
        // ignore
      }
    };
    void tick();
    const id = window.setInterval(() => void tick(), 1500);
    return () => {
      mounted = false;
      window.clearInterval(id);
    };
  }, []);

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Frontend Observability (RUM) — Minimal pipeline</h1>
        <p className="text-sm text-slate-300">
          Captures client errors + a few Web Performance signals, ships via{" "}
          <code className="rounded bg-slate-800 px-1">sendBeacon</code>, and aggregates in a server-side
          ring buffer for quick triage.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
          <h2 className="font-medium">Live summary</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-slate-950/40 p-3">
              <div className="text-slate-400">Total events</div>
              <div className="text-xl font-semibold">{summary.total}</div>
            </div>
            <div className="rounded-lg bg-slate-950/40 p-3">
              <div className="text-slate-400">Session</div>
              <div className="text-xs break-all">{sessionId}</div>
            </div>
            <div className="rounded-lg bg-slate-950/40 p-3">
              <div className="text-slate-400">p95 LCP</div>
              <div className="text-xl font-semibold">{fmtMs(summary.p95?.lcp)}</div>
            </div>
            <div className="rounded-lg bg-slate-950/40 p-3">
              <div className="text-slate-400">p95 INP (placeholder)</div>
              <div className="text-xl font-semibold">—</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-300">
            <div className="font-medium">By type</div>
            <pre className="mt-2 rounded-lg bg-slate-950/40 p-3 overflow-auto">
              {JSON.stringify(summary.byType, null, 2)}
            </pre>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
          <h2 className="font-medium">Generate signals</h2>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("rum:custom", { detail: { name: "cta_click", value: 1 } }),
                );
              }}
            >
              Emit custom event
            </button>
            <button
              className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium hover:bg-rose-500"
              onClick={() => {
                // eslint-disable-next-line no-throw-literal
                throw new Error("demo_frontend_error");
              }}
            >
              Throw error
            </button>
            <button
              className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
              onClick={async () => {
                await fetch("/api/rum/reset", { method: "POST" });
              }}
            >
              Reset server buffer
            </button>
          </div>

          <div className="text-sm text-slate-300">
            <div className="font-medium">Top errors</div>
            <ul className="mt-2 space-y-1">
              {summary.topErrors.length === 0 ? (
                <li className="text-slate-400">No errors captured yet.</li>
              ) : (
                summary.topErrors.map((e) => (
                  <li key={e.name} className="flex items-center justify-between">
                    <span className="font-mono text-xs">{e.name}</span>
                    <span className="text-slate-400">{e.count}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Why this matters (staff-level framing)</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>
            RUM is <strong>observability at the edge</strong>: it measures what users actually experience,
            including device and network variability.
          </li>
          <li>
            Pipeline design is an NFR problem: <strong>sampling</strong>,{" "}
            <strong>privacy scrubbing</strong>, and <strong>backpressure</strong> prevent telemetry from
            becoming an outage vector.
          </li>
          <li>
            Actionability wins: link errors to sessions + pages and compute a couple percentiles to
            prioritize.
          </li>
        </ul>
      </section>
    </main>
  );
}

