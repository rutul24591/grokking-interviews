"use client";

import { useEffect, useState } from "react";

type LikeState = {
  inlineCount: number;
  detailCount: number;
  liked: boolean;
  mode: "inline" | "detail";
  pendingWrite: boolean;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<LikeState | null>(null);

  async function refresh() {
    const response = await fetch("/api/like-button/state");
    setState((await response.json()) as LikeState);
  }

  async function act(type: "toggle-like" | "switch-mode") {
    const response = await fetch("/api/like-button/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setState((await response.json()) as LikeState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold">Like Button</h1>
      <p className="mt-2 text-slate-300">Toggle like state, switch rendering mode, and keep count and user state aligned across list and detail surfaces.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <button onClick={() => void act("toggle-like")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">{state?.liked ? "Unlike" : "Like"}</button>
          <button onClick={() => void act("switch-mode")} className="ml-3 rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Switch mode</button>
          <div className="mt-4 rounded border border-slate-800 px-3 py-2 text-xs text-slate-400">pending write: {String(state?.pendingWrite)}</div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-500">Mode</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.mode}</div>
          <div className="mt-4 rounded border border-slate-800 px-3 py-2">liked: {String(state?.liked)}</div>
          <div className="mt-3 rounded border border-slate-800 px-3 py-2">inline count: {state?.inlineCount}</div>
          <div className="mt-3 rounded border border-slate-800 px-3 py-2">detail count: {state?.detailCount}</div>
        </article>
      </section>
    </main>
  );
}
