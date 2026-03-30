"use client";

import { useEffect, useState } from "react";

export function SwCacheClient() {
  const [status, setStatus] = useState('Service worker not registered');

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setStatus('Service workers unsupported');
      return;
    }
    navigator.serviceWorker.register('/sw.js').then(() => setStatus('Service worker registered'));
  }, []);

  async function callTime() {
    const response = await fetch('/api/time');
    setStatus(`${response.headers.get('x-cache-source') ?? 'network'} · ${await response.text()}`);
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Service worker caching</p>
        <h1 className="mt-2 text-3xl font-semibold">Runtime cache controller</h1>
        <button className="mt-6 rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950" onClick={() => void callTime()}>Fetch /api/time</button>
        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">{status}</div>
      </section>
    </main>
  );
}
