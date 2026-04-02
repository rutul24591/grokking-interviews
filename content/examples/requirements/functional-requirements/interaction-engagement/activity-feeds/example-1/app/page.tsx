"use client";

import { useEffect, useState } from "react";

type FeedItem = {
  id: string;
  actor: string;
  action: string;
  target: string;
  freshness: "new" | "warm" | "old";
};

type FeedState = {
  filter: "all" | "following" | "saved";
  items: FeedItem[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<FeedState | null>(null);

  async function refresh() {
    const response = await fetch("/api/activity-feeds/state");
    setState((await response.json()) as FeedState);
  }

  async function act(filter: FeedState["filter"]) {
    const response = await fetch("/api/activity-feeds/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filter })
    });
    setState((await response.json()) as FeedState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Activity Feeds</h1>
      <p className="mt-2 text-slate-300">Render a personalized engagement feed, switch ranking filters, and keep recency visible so users can find the right follow-up action quickly.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void act("all")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">All</button>
            <button onClick={() => void act("following")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Following</button>
            <button onClick={() => void act("saved")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Saved</button>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="font-semibold text-slate-100">{item.actor}</div>
              <div className="mt-1 text-xs text-slate-500">{item.action} · {item.target}</div>
              <div className="mt-3 rounded border border-slate-800 px-3 py-2">freshness: {item.freshness}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
