"use client";

import { useState } from "react";
import { fetchTlsHealth } from "../lib/health";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function probe() {
    setError(null);
    setData(null);
    try {
      setData(await fetchTlsHealth());
    } catch (e) {
      setError(
        e instanceof Error
          ? `${e.message} (tip: open https://localhost:8443/health in the browser and accept the cert warning)`
          : "probe failed"
      );
    }
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">HTTPS/TLS: probe the server</h1>
        <p className="text-sm text-white/70">
          This UI calls <code>https://localhost:8443/health</code> and displays TLS protocol/cipher as seen by the server.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={probe}
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
          >
            Probe /health
          </button>
          <a
            href="https://localhost:8443/health"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            Open /health (accept cert)
          </a>
          <a
            href="http://localhost:8080"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            Open HTTP redirect (308)
          </a>
        </div>

        {error ? <div className="mt-3 rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-sm">{error}</div> : null}
        {data ? <pre className="mt-3 overflow-auto rounded bg-black/20 p-3 text-xs">{JSON.stringify(data, null, 2)}</pre> : null}
      </section>
    </main>
  );
}

