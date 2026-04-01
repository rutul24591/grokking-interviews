"use client";

import { useEffect, useState } from "react";

type TagState = {
  category: string;
  tags: string[];
  suggestions: string[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<TagState | null>(null);

  async function refresh() {
    const response = await fetch("/api/tagging/state");
    setState((await response.json()) as TagState);
  }

  async function act(type: "add-tag" | "switch-category") {
    const response = await fetch("/api/tagging/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setState((await response.json()) as TagState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Tagging Categorization Management</h1>
      <p className="mt-2 text-slate-300">Manage content taxonomy with category ownership, tag normalization, and suggestion feedback.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr,320px]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="font-semibold text-slate-100">Category: {state?.category}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {state?.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-slate-700 px-3 py-1 text-xs">{tag}</span>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={() => void act("add-tag")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Add suggested tag</button>
            <button onClick={() => void act("switch-category")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Switch category</button>
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-400">Suggestions</div>
          <div className="mt-4 space-y-2">
            {state?.suggestions.map((item) => (
              <div key={item} className="rounded border border-slate-800 bg-slate-950/60 px-3 py-2">{item}</div>
            ))}
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
