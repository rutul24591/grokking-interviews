"use client";

import { useEffect, useState } from "react";

type IndexRecord = {
  id: string;
  title: string;
  state: "queued" | "indexed" | "stale";
  changedFields: string[];
  freshnessLagMinutes: number;
};

type IndexState = {
  documents: IndexRecord[];
  lastRunAt: string;
  backlogSize: number;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<IndexState | null>(null);

  async function refresh() {
    const response = await fetch("/api/search-indexing/state");
    setState((await response.json()) as IndexState);
  }

  async function act(type: "run" | "mark-stale") {
    const response = await fetch("/api/search-indexing/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setState((await response.json()) as IndexState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Search Indexing Pipeline</h1>
      <p className="mt-2 text-slate-300">Track indexing freshness, changed fields, and backlog pressure so editors know when content becomes discoverable.</p>
      <section className="mt-8 grid gap-4">
        <div className="flex gap-3">
          <button onClick={() => void act("run")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Run indexing</button>
          <button onClick={() => void act("mark-stale")} className="rounded border border-amber-700 px-4 py-2 text-sm font-semibold text-amber-300">Mark stale</button>
        </div>
        {state?.documents.map((document) => (
          <article key={document.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            <div className="font-semibold text-slate-100">{document.title}</div>
            <div className="mt-1 text-xs text-slate-400">{document.id} · {document.state} · lag {document.freshnessLagMinutes}m</div>
            <div className="mt-2 text-xs text-slate-400">changed fields: {document.changedFields.join(", ")}</div>
          </article>
        ))}
        <p className="text-sm text-slate-400">Backlog: {state?.backlogSize} · last run: {state?.lastRunAt} · {state?.lastMessage}</p>
      </section>
    </main>
  );
}
