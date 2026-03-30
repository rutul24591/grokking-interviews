"use client";

import { useEffect, useState } from "react";

const cachedArticle = { title: 'Cached article set', fetchedAt: '10:00:00' };

export function SwrClient() {
  const [view, setView] = useState(cachedArticle);
  const [status, setStatus] = useState('serving stale cache');

  useEffect(() => {
    let active = true;
    fetch('/api/article')
      .then((response) => response.json())
      .then((fresh) => {
        if (!active) return;
        setView(fresh);
        setStatus('background revalidation applied');
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-4xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Stale-while-revalidate</p>
        <h1 className="mt-2 text-3xl font-semibold">Cached article panel</h1>
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-lg font-medium">{view.title}</h2>
          <p className="mt-2 text-sm text-slate-400">Fetched at {view.fetchedAt}</p>
          <p className="mt-3 text-sm text-slate-300">{status}</p>
        </div>
      </section>
    </main>
  );
}
