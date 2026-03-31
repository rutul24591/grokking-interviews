"use client";

import { useEffect, useState } from "react";

type Entity = { type: string; slug: string; title: string; cacheKey: string };
type State = { entities: Entity[]; active: Entity; logs: string[] };

export default function DynamicRoutesLab() {
  const [state, setState] = useState<State | null>(null);

  async function refresh() {
    const response = await fetch("http://localhost:4543/state");
    setState((await response.json()) as State);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function resolve(slug: string) {
    await fetch("http://localhost:4543/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug })
    });
    await refresh();
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Available dynamic entries</h2>
        <div className="mt-4 grid gap-3">
          {state?.entities.map((entity) => (
            <button key={entity.slug} className={`rounded-2xl border px-4 py-3 text-left ${state.active.slug === entity.slug ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-slate-50 text-slate-900"}`} onClick={() => void resolve(entity.slug)}>
              <p className="font-semibold">/{entity.type}s/{entity.slug}</p>
              <p className={`mt-1 text-sm ${state.active.slug === entity.slug ? "text-slate-200" : "text-slate-600"}`}>{entity.cacheKey}</p>
            </button>
          ))}
        </div>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Resolution details</h2>
        <p className="mt-4 text-sm text-slate-700">Active type: <span className="font-semibold text-slate-950">{state?.active.type}</span></p>
        <p className="mt-2 text-sm text-slate-700">Cache key: <span className="font-semibold text-slate-950">{state?.active.cacheKey}</span></p>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">{state?.logs.map((entry) => <li key={entry}>• {entry}</li>)}</ul>
      </article>
    </section>
  );
}
