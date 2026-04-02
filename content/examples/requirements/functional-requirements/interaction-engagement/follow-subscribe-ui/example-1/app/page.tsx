"use client";

import { useEffect, useState } from "react";

type FollowTarget = {
  id: string;
  name: string;
  type: "author" | "newsletter";
  following: boolean;
};

type FollowState = {
  mode: "all" | "authors" | "newsletters";
  targets: FollowTarget[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<FollowState | null>(null);

  async function refresh() {
    const response = await fetch("/api/follow-subscribe-ui/state");
    setState((await response.json()) as FollowState);
  }

  async function act(type: "switch-mode" | "toggle-follow", value?: string) {
    const response = await fetch("/api/follow-subscribe-ui/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value })
    });
    setState((await response.json()) as FollowState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Follow Subscribe UI</h1>
      <p className="mt-2 text-slate-300">Follow authors and subscribe to updates while keeping subscription state visible across engagement surfaces.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void act("switch-mode", "all")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">All</button>
            <button onClick={() => void act("switch-mode", "authors")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Authors</button>
            <button onClick={() => void act("switch-mode", "newsletters")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Newsletters</button>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.targets.map((target) => (
            <div key={target.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{target.name}</div>
                  <div className="mt-1 text-xs text-slate-500">type {target.type}</div>
                </div>
                <button onClick={() => void act("toggle-follow", target.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">
                  {target.following ? "Following" : "Follow"}
                </button>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
