"use client";

import { useEffect, useState } from "react";

type VoteState = {
  score: number;
  selection: "upvote" | "downvote" | "none";
  mode: "list" | "detail";
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<VoteState | null>(null);

  async function refresh() {
    const response = await fetch("/api/upvote-downvote-ui/state");
    setState((await response.json()) as VoteState);
  }

  async function act(type: "upvote" | "downvote" | "switch-mode") {
    const response = await fetch("/api/upvote-downvote-ui/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setState((await response.json()) as VoteState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold">Upvote Downvote UI</h1>
      <p className="mt-2 text-slate-300">Vote content up or down, switch rendering mode, and keep score and current selection aligned across surfaces.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <button onClick={() => void act("upvote")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Upvote</button>
          <button onClick={() => void act("downvote")} className="ml-3 rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Downvote</button>
          <button onClick={() => void act("switch-mode")} className="ml-3 rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Switch mode</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-500">Mode</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.mode}</div>
          <div className="mt-3 rounded border border-slate-800 px-3 py-2">score: {state?.score}</div>
          <div className="mt-3 rounded border border-slate-800 px-3 py-2">selection: {state?.selection}</div>
        </article>
      </section>
    </main>
  );
}
