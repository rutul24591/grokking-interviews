"use client";

import { useState } from "react";
import { fetchFlags } from "../lib/api";

export default function Page() {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchFlags>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      setData(await fetchFlags());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Monorepo contracts: one schema for API + web</h1>
        <p className="text-sm text-white/70">
          The API and the UI both depend on <code>@acme/contracts</code>. This reduces payload drift.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <button
          onClick={load}
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
        >
          Load flags
        </button>

        {error ? <div className="mt-3 rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-sm">{error}</div> : null}

        {data ? (
          <div className="mt-4 grid gap-2">
            {data.flags.map((f) => (
              <div key={f.key} className="flex items-center justify-between rounded-md bg-black/20 px-3 py-2">
                <div className="text-sm">
                  <code>{f.key}</code> {f.variant ? <span className="text-white/60">({f.variant})</span> : null}
                </div>
                <div className={["text-sm font-medium", f.enabled ? "text-emerald-300" : "text-white/50"].join(" ")}>
                  {f.enabled ? "enabled" : "disabled"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-sm text-white/60">No data yet. Start the API and click “Load flags”.</div>
        )}
      </section>
    </main>
  );
}

