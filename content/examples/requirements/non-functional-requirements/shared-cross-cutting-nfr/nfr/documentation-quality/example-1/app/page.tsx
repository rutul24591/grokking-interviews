"use client";

import { useEffect, useState } from "react";

async function json<T>(input: RequestInfo | URL): Promise<T> {
  const res = await fetch(input);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export default function Page() {
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState("");

  async function refresh() {
    try {
      setReport(await json("/api/lint"));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Docs Quality Gate</h1>
        <p className="mt-2 text-slate-300">A simple docs linter surfaced as an API + UI.</p>
        {error ? <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</div> : null}
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <h2 className="text-lg font-semibold">Report</h2>
        <pre className="mt-4 overflow-auto rounded border border-slate-800 bg-black/40 p-4 text-xs text-slate-100">
{JSON.stringify(report, null, 2)}
        </pre>
      </section>
    </main>
  );
}

