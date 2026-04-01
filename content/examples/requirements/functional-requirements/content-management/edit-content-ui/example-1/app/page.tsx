"use client";

import { useEffect, useState } from "react";

type EditState = {
  title: string;
  summary: string;
  status: "draft" | "review";
  dirty: boolean;
  revision: number;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<EditState | null>(null);

  async function refresh() {
    const response = await fetch("/api/edit-content/state");
    setState((await response.json()) as EditState);
  }

  async function update(field: "title" | "summary" | "status", value: string) {
    const response = await fetch("/api/edit-content/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, value })
    });
    setState((await response.json()) as EditState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Edit Content UI</h1>
      <p className="mt-2 text-slate-300">Adjust content fields, move review state, and watch revision metadata update as authors edit an existing document.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr,320px]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="block text-sm text-slate-300">Title</label>
          <input value={state?.title ?? ""} onChange={(event) => void update("title", event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <label className="mt-5 block text-sm text-slate-300">Summary</label>
          <textarea value={state?.summary ?? ""} onChange={(event) => void update("summary", event.target.value)} className="mt-2 h-40 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <label className="mt-5 block text-sm text-slate-300">Workflow state</label>
          <select value={state?.status ?? "draft"} onChange={(event) => void update("status", event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option value="draft">Draft</option>
            <option value="review">Ready for review</option>
          </select>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-400">Edit state</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">Revision {state?.revision}</div>
          <div className="mt-3">Unsaved changes: {state?.dirty ? "yes" : "no"}</div>
          <div className="mt-2">Workflow: {state?.status}</div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
