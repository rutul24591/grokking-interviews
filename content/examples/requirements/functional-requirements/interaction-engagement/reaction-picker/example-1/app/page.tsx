"use client";

import { useEffect, useState } from "react";

type Reaction = {
  id: string;
  emoji: string;
  count: number;
  selected: boolean;
};

type ReactionState = {
  palette: "compact" | "full";
  reactions: Reaction[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<ReactionState | null>(null);

  async function refresh() {
    const response = await fetch("/api/reaction-picker/state");
    setState((await response.json()) as ReactionState);
  }

  async function act(type: "switch-palette" | "select-reaction", value?: string) {
    const response = await fetch("/api/reaction-picker/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value })
    });
    setState((await response.json()) as ReactionState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Reaction Picker</h1>
      <p className="mt-2 text-slate-300">Switch reaction palette size, select a reaction, and keep counts synchronized with the current user selection.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <button onClick={() => void act("switch-palette")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Switch palette</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
          <div className="mt-3 rounded border border-slate-800 px-3 py-2">palette: {state?.palette}</div>
        </article>
        <article className="grid gap-4 md:grid-cols-2">
          {state?.reactions.map((reaction) => (
            <button key={reaction.id} onClick={() => void act("select-reaction", reaction.id)} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-left text-sm text-slate-300">
              <div className="text-2xl">{reaction.emoji}</div>
              <div className="mt-2 text-xs text-slate-500">count {reaction.count} · selected {String(reaction.selected)}</div>
            </button>
          ))}
        </article>
      </section>
    </main>
  );
}
