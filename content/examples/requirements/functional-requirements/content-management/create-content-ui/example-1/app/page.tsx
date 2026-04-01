"use client";

import { useEffect, useState } from "react";

type CreateState = {
  title: string;
  category: string;
  audience: string;
  slug: string;
  checklist: { id: string; label: string; done: boolean }[];
  saveEnabled: boolean;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<CreateState | null>(null);

  async function refresh() {
    const response = await fetch("/api/create-content/state");
    setState((await response.json()) as CreateState);
  }

  async function update(field: string, value: string) {
    const response = await fetch("/api/create-content/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, value })
    });
    setState((await response.json()) as CreateState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Create Content Workflow</h1>
      <p className="mt-2 text-slate-300">Bootstrap a new content draft with title, slug, category, and audience checks before the first server-side save.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr,340px]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="block text-sm text-slate-300">Title</label>
          <input value={state?.title ?? ""} onChange={(event) => void update("title", event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <label className="mt-5 block text-sm text-slate-300">Slug</label>
          <input value={state?.slug ?? ""} onChange={(event) => void update("slug", event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <label className="mt-5 block text-sm text-slate-300">Category</label>
          <select value={state?.category ?? ""} onChange={(event) => void update("category", event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option value="">Select category</option>
            <option value="system-design">System design</option>
            <option value="requirements">Requirements</option>
            <option value="problem-set">Problem set</option>
          </select>
          <label className="mt-5 block text-sm text-slate-300">Audience</label>
          <select value={state?.audience ?? ""} onChange={(event) => void update("audience", event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option value="">Select audience</option>
            <option value="staff">Staff / principal engineers</option>
            <option value="interview">Interview prep readers</option>
            <option value="mixed">Mixed audience</option>
          </select>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-400">Draft readiness</div>
          <div className="mt-4 space-y-3">
            {state?.checklist.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
                <span className={item.done ? "text-emerald-300" : "text-amber-300"}>{item.done ? "Ready" : "Pending"}</span>
                <span className="ml-3">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 font-semibold text-slate-100">Save enabled: {String(state?.saveEnabled)}</div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
