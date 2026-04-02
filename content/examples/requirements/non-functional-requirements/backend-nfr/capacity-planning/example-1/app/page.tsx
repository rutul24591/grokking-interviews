"use client";

import { useState } from "react";

async function post(body: unknown) {
  const res = await fetch("/api/capacity", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  return { status: res.status, body: await res.json() };
}

export default function Page() {
  const [input, setInput] = useState({
    rps: 800,
    p95LatencyMs: 220,
    cpuMsPerReq: 8,
    coresPerInstance: 2,
    targetUtilization: 0.65,
    headroomPct: 30
  });
  const [out, setOut] = useState<any>(null);

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Capacity planning — Little’s Law + headroom</h1>
        <p className="text-sm text-slate-300">
          Compute rough capacity needs from RPS, p95 latency, CPU cost, utilization targets, and headroom.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-3 text-sm">
          {Object.entries(input).map(([k, v]) => (
            <label key={k} className="space-y-1">
              <div className="text-slate-300">{k}</div>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2"
                value={String(v)}
                onChange={(e) => setInput((p) => ({ ...p, [k]: Number(e.target.value) }))}
              />
            </label>
          ))}
        </div>
        <button
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500"
          onClick={async () => setOut(await post(input))}
        >
          Calculate
        </button>
        <pre className="rounded-lg bg-slate-950/40 p-3 text-xs overflow-auto">{JSON.stringify(out, null, 2)}</pre>
      </section>
    </main>
  );
}

