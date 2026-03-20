"use client";

import { useEffect, useMemo, useState } from "react";

type Incident = {
  id: string;
  fingerprint: string;
  severity: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  alerts: any[];
  events: any[];
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
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [fingerprint, setFingerprint] = useState("api-500");
  const [severity, setSeverity] = useState("critical");
  const [summary, setSummary] = useState("API error rate elevated");
  const [error, setError] = useState("");

  async function refresh() {
    try {
      const r = await json<{ incidents: Incident[] }>("/api/incidents");
      setIncidents(r.incidents);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 1500);
    return () => clearInterval(t);
  }, []);

  async function sendAlert() {
    await json("/api/alerts", {
      method: "POST",
      body: JSON.stringify({ fingerprint, severity, summary, source: "ui" }),
    });
    await refresh();
  }

  async function storm() {
    const fps = ["api-500", "db-latency", "cache-miss"];
    for (let i = 0; i < 30; i++) {
      await json("/api/alerts", {
        method: "POST",
        body: JSON.stringify({
          fingerprint: fps[i % 3],
          severity: i % 10 === 0 ? "critical" : "high",
          summary: `Synthetic alert ${i}`,
          source: "storm",
        }),
      });
    }
    await refresh();
  }

  async function ack(id: string) {
    await json(`/api/incidents/${id}/ack`, { method: "POST", body: "{}" });
    await refresh();
  }

  async function resolve(id: string) {
    await json(`/api/incidents/${id}/resolve`, { method: "POST", body: "{}" });
    await refresh();
  }

  async function reset() {
    await json("/api/reset", { method: "POST", body: "{}" });
    await refresh();
  }

  const openCount = useMemo(() => incidents.filter((i) => i.status !== "resolved").length, [incidents]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Incident Console</h1>
        <p className="mt-2 text-slate-300">
          Alerts are deduped into incidents, with ack/resolve and a basic escalation rule.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">
            {error}
          </div>
        ) : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-1">
          <h2 className="text-lg font-semibold">Send alert</h2>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Fingerprint</span>
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={fingerprint} onChange={(e) => setFingerprint(e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Severity</span>
              <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                {["low", "medium", "high", "critical"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Summary</span>
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={summary} onChange={(e) => setSummary(e.target.value)} />
            </label>
            <div className="flex flex-wrap gap-2">
              <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={sendAlert}>
                Send
              </button>
              <button className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500" onClick={storm}>
                Storm x30
              </button>
              <button className="ml-auto rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700" onClick={reset}>
                Reset
              </button>
            </div>
          </div>
          <div className="mt-6 rounded border border-slate-800 bg-black/30 p-4 text-sm text-slate-200">
            <div className="font-semibold">Open incidents</div>
            <div className="mt-1 text-2xl font-bold">{openCount}</div>
            <div className="mt-2 text-xs text-slate-300">
              Critical incidents not acked in 30s will auto-escalate.
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold">Incidents</h2>
          <div className="mt-4 space-y-4">
            {incidents.map((inc) => (
              <div key={inc.id} className="rounded border border-slate-800 bg-black/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{inc.fingerprint}</div>
                    <div className="mt-1 text-xs text-slate-300">
                      {inc.severity} · {inc.status} · alerts: {inc.alerts.length}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded bg-slate-800 px-3 py-1.5 text-xs font-semibold hover:bg-slate-700" onClick={() => ack(inc.id)}>
                      Ack
                    </button>
                    <button className="rounded bg-emerald-700 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-600" onClick={() => resolve(inc.id)}>
                      Resolve
                    </button>
                  </div>
                </div>
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-slate-300">Timeline</summary>
                  <div className="mt-2 space-y-2">
                    {inc.events.slice().reverse().map((e, idx) => (
                      <div key={idx} className="rounded border border-slate-800 bg-black/40 p-2 text-xs">
                        <span className="font-mono text-slate-300">{e.ts}</span>{" "}
                        <span className="ml-2 rounded bg-slate-800 px-2 py-0.5 font-semibold text-slate-200">
                          {e.type}
                        </span>
                        <div className="mt-1 text-slate-200">{e.message}</div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ))}
            {!incidents.length ? (
              <div className="rounded border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
                No incidents yet.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

