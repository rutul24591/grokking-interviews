"use client";

import { useEffect, useMemo, useState } from "react";

type Section = { parent: string; child: string; label: string; ownership: string };
type State = { sections: Section[]; active: Section; logs: string[] };

export default function NestedRoutesLab() {
  const [state, setState] = useState<State | null>(null);
  const [parent, setParent] = useState("frontend");
  const [child, setChild] = useState("routing");

  async function refresh() {
    const response = await fetch("http://localhost:4546/state");
    const next = (await response.json()) as State;
    setState(next);
    setParent(next.active.parent);
    setChild(next.active.child);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const availableChildren = useMemo(() => state?.sections.filter((section) => section.parent === parent) ?? [], [parent, state]);

  async function activate() {
    await fetch("http://localhost:4546/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parent, child })
    });
    await refresh();
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Select parent and child segments</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm" value={parent} onChange={(event) => { setParent(event.target.value); setChild(""); }}>
            {[...new Set(state?.sections.map((section) => section.parent) ?? [])].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm" value={child} onChange={(event) => setChild(event.target.value)}>
            {availableChildren.map((section) => <option key={section.child} value={section.child}>{section.child}</option>)}
          </select>
        </div>
        <button className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white" onClick={() => void activate()}>Activate nested route</button>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Active boundary</h2>
        <p className="mt-4 text-sm text-slate-700">Label: <span className="font-semibold text-slate-950">{state?.active.label}</span></p>
        <p className="mt-2 text-sm text-slate-700">Ownership: <span className="font-semibold text-slate-950">{state?.active.ownership}</span></p>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">{state?.logs.map((entry) => <li key={entry}>• {entry}</li>)}</ul>
      </article>
    </section>
  );
}
