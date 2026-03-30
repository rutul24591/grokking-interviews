"use client";

import { useRef, useState } from "react";

export function MemoryCacheClient() {
  const cache = useRef(new Map<string, { value: string; expiresAt: number }>());
  const [status, setStatus] = useState('No lookups yet');
  const [stats, setStats] = useState({ hits: 0, misses: 0 });

  function lookup(topic: string) {
    const hit = cache.current.get(topic);
    if (hit && hit.expiresAt > Date.now()) {
      setStats((current) => ({ ...current, hits: current.hits + 1 }));
      setStatus(`cache-hit for ${topic}: ${hit.value}`);
      return;
    }
    const fresh = `computed-${topic}-${Date.now()}`;
    cache.current.set(topic, { value: fresh, expiresAt: Date.now() + 10_000 });
    setStats((current) => ({ ...current, misses: current.misses + 1 }));
    setStatus(`cache-miss for ${topic}: ${fresh}`);
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Memory caching</p>
        <h1 className="mt-2 text-3xl font-semibold">Short-lived local cache</h1>
        <div className="mt-6 flex gap-3">
          <button className="rounded-2xl bg-amber-400 px-4 py-3 font-medium text-slate-950" onClick={() => lookup('feed')}>Lookup feed</button>
          <button className="rounded-2xl border border-slate-700 px-4 py-3" onClick={() => lookup('feed')}>Lookup feed again</button>
          <button className="rounded-2xl border border-slate-700 px-4 py-3" onClick={() => cache.current.clear()}>Clear cache</button>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2"><div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">{status}</div><div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">hits={stats.hits} · misses={stats.misses} · entries={cache.current.size}</div></div>
      </section>
    </main>
  );
}
