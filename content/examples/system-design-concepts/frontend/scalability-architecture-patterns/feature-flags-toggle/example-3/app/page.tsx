"use client";

import { useEffect, useMemo, useState } from "react";

type Flag = { key: string; enabled: boolean };

const userId = "user_123";

export default function Page() {
  const flags: Flag[] = useMemo(
    () => [
      { key: "search.newRanking", enabled: true },
      { key: "checkout.newFlow", enabled: false }
    ],
    []
  );

  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    // Exposure logging should happen when the user *sees* the experience, not when flags are fetched.
    const enabled = flags.filter((f) => f.enabled);
    if (enabled.length === 0) return;

    void (async () => {
      for (const f of enabled) {
        const res = await fetch("/api/exposure", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ userId, flagKey: f.key })
        });
        const json = (await res.json()) as { ok: boolean; deduped: boolean };
        setLog((l) => [`${f.key}: ${json.deduped ? "deduped" : "logged"}`, ...l]);
      }
    })();
  }, [flags]);

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Exposure logging (deduped)</h1>
        <p className="mt-2 text-slate-300">
          Exposures power metrics (impact analysis). They must be idempotent or you’ll overcount.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Flags for {userId}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          {flags.map((f) => (
            <li key={f.key}>
              <span className="font-semibold text-slate-100">{f.key}</span> ={" "}
              <span className={f.enabled ? "text-emerald-200" : "text-slate-400"}>{String(f.enabled)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Exposure log</h2>
        <p className="mt-2 text-sm text-slate-300">Refresh the page: exposures should dedupe server-side.</p>
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          {log.length === 0 ? <li className="text-slate-400">No events yet.</li> : null}
          {log.map((l) => (
            <li key={l} className="rounded-md border border-white/10 bg-black/30 px-3 py-2">
              {l}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

