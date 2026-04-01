"use client";
import { useEffect, useState } from "react";

type DocumentState = "indexed" | "stale" | "pending";
type SearchDocument = { id: string; title: string; topic: string; freshnessMinutes: number; state: DocumentState };
type IndexingState = { queueDepth: number; mode: "incremental" | "full"; documents: SearchDocument[]; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<IndexingState | null>(null);
  const [mode, setMode] = useState<"incremental" | "full">("incremental");

  async function refresh() {
    const response = await fetch("/api/indexing/state");
    const data = (await response.json()) as IndexingState;
    setState(data);
    setMode(data.mode);
  }

  async function rebuild() {
    const response = await fetch("/api/indexing/rebuild", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode })
    });
    setState((await response.json()) as IndexingState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Search Indexing</h1>
      <p className="mt-2 text-slate-300">Manage indexing freshness, backlog depth, and rebuild strategy for searchable content.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Backlog</div>
          <div className="mt-2 text-2xl font-semibold text-slate-100">{state?.queueDepth ?? 0}</div>
          <label className="mt-5 block font-semibold text-slate-100">Indexing mode</label>
          <select value={mode} onChange={(event) => setMode(event.target.value as "incremental" | "full")} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option value="incremental">Incremental refresh</option>
            <option value="full">Full rebuild</option>
          </select>
          <button onClick={rebuild} className="mt-4 rounded bg-sky-600 px-4 py-2 font-semibold hover:bg-sky-500">Run indexing job</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <ul className="space-y-3 text-sm text-slate-300">
            {state?.documents.map((document) => (
              <li key={document.id} className="rounded border border-slate-800 px-3 py-3">
                <div className="font-semibold text-slate-100">{document.title}</div>
                <div className="mt-1 text-slate-400">topic {document.topic}</div>
                <div className="mt-2 text-xs">state {document.state} · freshness {document.freshnessMinutes} min</div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
