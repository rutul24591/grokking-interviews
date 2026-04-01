"use client";

import { useEffect, useState } from "react";

type FeedItem = { id: string; type: string; title: string; author: string };
type FeedState = { cursor: number; pageSize: number; items: FeedItem[]; remaining: number; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<FeedState | null>(null);

  async function refresh() {
    const response = await fetch("/api/feed/state");
    setState((await response.json()) as FeedState);
  }

  async function loadMore() {
    const response = await fetch("/api/feed/next", { method: "POST" });
    setState((await response.json()) as FeedState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Feed Display</h1>
      <p className="mt-2 text-slate-300">Render a mixed-content feed, preserve pagination state, and append additional feed slices without losing the current view.</p>
      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="mb-5 flex items-center justify-between text-sm text-slate-300">
          <div>Loaded items: <span className="font-semibold text-slate-100">{state?.items.length ?? 0}</span></div>
          <div>Remaining: <span className="font-semibold text-slate-100">{state?.remaining ?? 0}</span></div>
        </div>
        <ul className="space-y-3 text-sm text-slate-300">
          {state?.items.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-800 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="font-semibold text-slate-100">{item.title}</div>
                <div className="text-xs uppercase tracking-wide text-slate-400">{item.type}</div>
              </div>
              <div className="mt-2 text-slate-400">by {item.author}</div>
            </li>
          ))}
        </ul>
        <button onClick={loadMore} className="mt-5 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Load more</button>
        <p className="mt-4 text-sm text-slate-300">{state?.lastMessage}</p>
      </section>
    </main>
  );
}
