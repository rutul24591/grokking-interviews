"use client";

import { useState } from "react";

type Feed = { ok: boolean; items: Array<{ id: string; title: string; heroHref: string }> };

export default function Page() {
  const [linkHeader, setLinkHeader] = useState<string | null>(null);
  const [feed, setFeed] = useState<Feed | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setBusy(true);
    try {
      const res = await fetch("/api/feed", { cache: "no-store" });
      setLinkHeader(res.headers.get("link"));
      setFeed((await res.json()) as Feed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Server-driven hints — debug the Link header</h1>
        <p className="text-sm text-slate-300">
          Some platforms emit preload/prefetch hints at the edge using HTTP <code>Link</code> headers. This page fetches a
          feed endpoint and prints the emitted header so you can validate it.
        </p>
      </header>

      <button
        type="button"
        onClick={load}
        className="rounded-xl border border-slate-700 bg-slate-950/30 px-4 py-3 text-sm hover:border-slate-500"
      >
        {busy ? "Loading…" : "Load feed"}
      </button>

      <section className="rounded-xl border border-slate-800 bg-slate-950/30 p-4 space-y-2">
        <div className="text-sm font-medium text-slate-200">Link header</div>
        <pre className="text-xs text-slate-200 whitespace-pre-wrap">{linkHeader ?? "(not loaded)"}</pre>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-950/30 p-4 space-y-3">
        <div className="text-sm font-medium text-slate-200">Feed items</div>
        {feed?.items?.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {feed.items.map((it) => (
              <div key={it.id} className="rounded-lg border border-slate-800 bg-black/20 p-3 space-y-2">
                <div className="text-sm text-slate-100">{it.title}</div>
                <img className="w-full rounded border border-slate-800" alt={it.title} src={it.heroHref} />
                <div className="text-xs text-slate-400">
                  Hint target: <code>{it.heroHref}</code>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400">(load the feed)</div>
        )}
      </section>
    </main>
  );
}

