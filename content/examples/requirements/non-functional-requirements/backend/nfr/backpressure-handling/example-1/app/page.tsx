"use client";

import { useEffect, useState } from "react";

async function post(url: string, body?: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {})
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, headers: Object.fromEntries(res.headers.entries()), body: json };
}

async function get(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  return { status: res.status, body: await res.json() };
}

export default function Page() {
  const [stats, setStats] = useState<any>(null);
  const [out, setOut] = useState<any>(null);

  const refresh = async () => setStats((await get("/api/work/stats")).body);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), 800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Backpressure handling — bounded queue + 429</h1>
        <p className="text-sm text-slate-300">
          Submitting too many jobs triggers backpressure (HTTP 429 + Retry-After). This prevents unbounded memory growth.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500"
            onClick={async () => {
              // stampede: 40 submissions
              const results = await Promise.all(
                Array.from({ length: 40 }, () => post("/api/work", { ms: 900 })),
              );
              setOut(results.slice(0, 8));
              await refresh();
            }}
          >
            Stampede submit (40)
          </button>
          <button
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium hover:bg-emerald-500"
            onClick={async () => {
              setOut(await post("/api/work", { ms: 900 }));
              await refresh();
            }}
          >
            Submit one
          </button>
          <button
            className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
            onClick={async () => {
              await post("/api/work/reset");
              await refresh();
              setOut(null);
            }}
          >
            Reset
          </button>
        </div>

        <pre className="rounded-lg bg-slate-950/40 p-3 text-xs overflow-auto">{JSON.stringify(stats, null, 2)}</pre>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
        <h2 className="font-medium text-slate-200">Latest output (sample)</h2>
        <pre className="mt-3 rounded-lg bg-slate-950/40 p-3 text-xs overflow-auto">{JSON.stringify(out, null, 2)}</pre>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Production notes</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Use bounded queues; fail fast with Retry-After rather than OOMing.</li>
          <li>Apply load shedding per tenant/priority class.</li>
          <li>Client retries must be budgeted; otherwise you create retry storms.</li>
        </ul>
      </section>
    </main>
  );
}

