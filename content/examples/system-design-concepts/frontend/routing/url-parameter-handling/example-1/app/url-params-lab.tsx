"use client";

import { useEffect, useState } from "react";

type Params = { query: string; sort: string; page: string; tags: string[] };
type State = { params: Params; logs: string[] };

export default function UrlParamsLab() {
  const [state, setState] = useState<State | null>(null);
  const [form, setForm] = useState<Params>({ query: "router", sort: "relevance", page: "1", tags: ["frontend", "navigation"] });

  async function refresh() {
    const response = await fetch("http://localhost:4549/state");
    const next = (await response.json()) as State;
    setState(next);
    setForm(next.params);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function apply() {
    await fetch("http://localhost:4549/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    await refresh();
  }

  const preview = `?query=${form.query}&sort=${form.sort}&page=${form.page}&tags=${form.tags.join(",")}`;

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Search state</h2>
        <div className="mt-4 grid gap-3">
          <input className="rounded-2xl border border-slate-200 px-3 py-2 text-sm" value={form.query} onChange={(event) => setForm({ ...form, query: event.target.value })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <select className="rounded-2xl border border-slate-200 px-3 py-2 text-sm" value={form.sort} onChange={(event) => setForm({ ...form, sort: event.target.value })}>
              {['relevance', 'date', 'difficulty'].map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
            <input className="rounded-2xl border border-slate-200 px-3 py-2 text-sm" value={form.page} onChange={(event) => setForm({ ...form, page: event.target.value })} />
          </div>
          <input className="rounded-2xl border border-slate-200 px-3 py-2 text-sm" value={form.tags.join(",")} onChange={(event) => setForm({ ...form, tags: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} />
        </div>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{preview}</div>
        <button className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white" onClick={() => void apply()}>Apply params</button>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Canonicalized output</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">{state?.logs.map((entry) => <li key={entry}>• {entry}</li>)}</ul>
      </article>
    </section>
  );
}
