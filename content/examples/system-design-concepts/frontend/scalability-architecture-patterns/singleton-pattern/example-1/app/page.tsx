"use client";

import { useState } from "react";

type PingResponse = {
  singletonId: string;
  startedAt: number;
  requests: number;
  note: string;
};

export default function Page() {
  const [data, setData] = useState<PingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function ping() {
    setError(null);
    try {
      const res = await fetch("/api/ping", { cache: "no-store" });
      if (!res.ok) throw new Error("bad response");
      setData((await res.json()) as PingResponse);
    } catch {
      setError("Ping failed");
    }
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Singleton Pattern: process-wide instance</h1>
        <p className="text-sm text-white/70">
          Click “Ping”. The singleton id stays stable while this server process is alive.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <button
          onClick={ping}
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
        >
          Ping
        </button>

        {error ? <div className="mt-3 rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-sm">{error}</div> : null}

        {data ? (
          <div className="mt-4 grid gap-2 text-sm">
            <div>
              <span className="text-white/60">singletonId:</span> <code>{data.singletonId}</code>
            </div>
            <div>
              <span className="text-white/60">startedAt:</span> <code>{new Date(data.startedAt).toISOString()}</code>
            </div>
            <div>
              <span className="text-white/60">requests:</span> <code>{data.requests}</code>
            </div>
            <div className="text-white/60">{data.note}</div>
          </div>
        ) : (
          <div className="mt-4 text-sm text-white/60">No data yet.</div>
        )}
      </section>
    </main>
  );
}

