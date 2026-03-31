"use client";

import { useEffect, useState } from "react";

type View = { slug: string; tab: string; title: string };
type State = { views: View[]; active: View; logs: string[] };

export default function DeepLinkWorkbench() {
  const [state, setState] = useState<State | null>(null);
  const [selectedSlug, setSelectedSlug] = useState("caching-patterns");
  const [selectedTab, setSelectedTab] = useState("tradeoffs");

  async function refresh() {
    const response = await fetch("http://localhost:4542/state");
    const next = (await response.json()) as State;
    setState(next);
    setSelectedSlug(next.active.slug);
    setSelectedTab(next.active.tab);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function open() {
    await fetch("http://localhost:4542/open", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: selectedSlug, tab: selectedTab })
    });
    await refresh();
  }

  const link = `/articles/${selectedSlug}?tab=${selectedTab}`;

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Link builder</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm" value={selectedSlug} onChange={(event) => setSelectedSlug(event.target.value)}>
            {state?.views.map((view) => <option key={view.slug} value={view.slug}>{view.title}</option>)}
          </select>
          <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm" value={selectedTab} onChange={(event) => setSelectedTab(event.target.value)}>
            {['overview', 'architecture', 'tradeoffs', 'pitfalls'].map((tab) => <option key={tab} value={tab}>{tab}</option>)}
          </select>
        </div>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Generated deep link</p>
          <p className="mt-2 break-all">{link}</p>
        </div>
        <button className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white" onClick={() => void open()}>Resolve link</button>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Resolved state</h2>
        <p className="mt-4 text-sm text-slate-700">Article: <span className="font-semibold text-slate-950">{state?.active.title}</span></p>
        <p className="mt-2 text-sm text-slate-700">Tab: <span className="font-semibold text-slate-950">{state?.active.tab}</span></p>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">{state?.logs.map((entry) => <li key={entry}>• {entry}</li>)}</ul>
      </article>
    </section>
  );
}
