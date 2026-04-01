"use client";

import { useEffect, useMemo, useState } from "react";

type FeedCard = {
  id: string;
  title: string;
  lane: "for-you" | "trending" | "continue-reading";
  score: number;
};

type InfiniteState = {
  cursor: number;
  pageSize: number;
  visibleIds: string[];
  bufferedIds: string[];
  hasMore: boolean;
  prefetchReady: boolean;
  lastEvent: "initial-load" | "prefetch" | "append" | "end-of-feed";
  lastMessage: string;
  items: FeedCard[];
  bufferedItems: FeedCard[];
};

export default function Page() {
  const [state, setState] = useState<InfiniteState | null>(null);

  async function refresh() {
    const response = await fetch("/api/infinite/state");
    setState((await response.json()) as InfiniteState);
  }

  async function loadNext(prefetch = false) {
    const response = await fetch("/api/infinite/next", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prefetch })
    });
    setState((await response.json()) as InfiniteState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const laneSummary = useMemo(() => {
    const summary = new Map<string, number>();
    for (const item of state?.items ?? []) {
      summary.set(item.lane, (summary.get(item.lane) ?? 0) + 1);
    }
    return Array.from(summary.entries());
  }, [state]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Infinite Scrolling</h1>
      <p className="mt-2 text-slate-300">
        Append feed slices, keep a prefetched buffer warm, and surface end-of-feed state without duplicate cards.
      </p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="grid gap-3 rounded-lg border border-slate-800 p-4">
            <div className="flex items-center justify-between">
              <span>Visible cards</span>
              <span className="font-semibold text-slate-100">{state?.items.length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Buffered cards</span>
              <span className="font-semibold text-slate-100">{state?.bufferedItems.length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last event</span>
              <span className="font-semibold text-slate-100">{state?.lastEvent ?? "loading"}</span>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => void loadNext(false)}
              disabled={!state?.hasMore}
              className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              Append next slice
            </button>
            <button
              onClick={() => void loadNext(true)}
              disabled={!state?.hasMore}
              className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 disabled:cursor-not-allowed disabled:text-slate-500"
            >
              Warm prefetch
            </button>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="grid gap-6 md:grid-cols-[1fr,220px]">
            <div>
              <div className="text-sm font-semibold text-slate-100">Visible feed</div>
              <ul className="mt-3 space-y-3 text-sm text-slate-300">
                {state?.items.map((item) => (
                  <li key={item.id} className="rounded-lg border border-slate-800 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-slate-100">{item.title}</span>
                      <span className="text-xs uppercase tracking-wide text-slate-400">{item.lane}</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">score {item.score}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">Lane mix</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {laneSummary.map(([lane, count]) => (
                  <li key={lane} className="rounded border border-slate-800 px-3 py-2">
                    {lane}: {count}
                  </li>
                ))}
              </ul>
              <div className="mt-5 text-sm font-semibold text-slate-100">Prefetch buffer</div>
              <ul className="mt-3 space-y-2 text-xs text-slate-400">
                {state?.bufferedItems.map((item) => (
                  <li key={item.id} className="rounded border border-slate-800 px-3 py-2">
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
