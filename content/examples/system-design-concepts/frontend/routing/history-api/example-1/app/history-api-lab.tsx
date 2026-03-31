"use client";

import { useEffect, useState } from "react";

type Entry = { path: string; mode: string };
type State = { historyStack: Entry[]; pointer: number; active: Entry; logs: string[] };

export default function HistoryApiLab() {
  const [state, setState] = useState<State | null>(null);
  const [path, setPath] = useState("/search?query=router");

  async function refresh() {
    const response = await fetch("http://localhost:4545/state");
    setState((await response.json()) as State);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function run(actionId: string) {
    await fetch("http://localhost:4545/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionId, path })
    });
    await refresh();
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Mutate history</h2>
        <input className="mt-4 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm" value={path} onChange={(event) => setPath(event.target.value)} />
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <button className="rounded-full bg-slate-950 px-4 py-2 font-semibold text-white" onClick={() => void run("push")}>pushState</button>
          <button className="rounded-full bg-indigo-100 px-4 py-2 font-semibold text-indigo-800" onClick={() => void run("replace")}>replaceState</button>
          <button className="rounded-full bg-slate-100 px-4 py-2 font-semibold text-slate-800" onClick={() => void run("back")}>Back</button>
        </div>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Stack</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          {state?.historyStack.map((entry, index) => <li key={`${entry.path}-${index}`}>{index === state.pointer ? "→" : "•"} {entry.path} ({entry.mode})</li>)}
        </ul>
        <ul className="mt-6 space-y-2 text-sm text-slate-700">{state?.logs.map((entry) => <li key={entry}>• {entry}</li>)}</ul>
      </article>
    </section>
  );
}
