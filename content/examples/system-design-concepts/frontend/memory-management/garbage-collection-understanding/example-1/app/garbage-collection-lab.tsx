"use client";

import { useEffect, useState } from "react";

type NodeState = { id: string; retained: boolean; reason: string };
type HeapState = { nodes: NodeState[]; notes: string[] };

export default function GarbageCollectionLab() {
  const [state, setState] = useState<HeapState | null>(null);

  async function refresh() {
    const response = await fetch("http://localhost:4533/state");
    setState((await response.json()) as HeapState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function run(actionId: string) {
    await fetch("http://localhost:4533/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionId })
    });
    await refresh();
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-2 text-sm">
          <button className="rounded-full bg-slate-950 px-4 py-2 font-semibold text-white" onClick={() => void run("drop-root")}>Drop root</button>
          <button className="rounded-full bg-indigo-100 px-4 py-2 font-semibold text-indigo-800" onClick={() => void run("break-closure")}>Break closure</button>
          <button className="rounded-full bg-emerald-100 px-4 py-2 font-semibold text-emerald-800" onClick={() => void run("reset")}>Reset graph</button>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">{state?.notes.map((note) => <li key={note}>• {note}</li>)}</ul>
      </article>
      <article className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {state?.nodes.map((node) => (
          <div key={node.id} className={`rounded-2xl border p-4 ${node.retained ? "border-indigo-200 bg-indigo-50" : "border-slate-200 bg-slate-50"}`}>
            <p className="text-sm font-semibold text-slate-950">{node.id}</p>
            <p className="mt-2 text-sm text-slate-700">{node.retained ? "retained" : "collectible"}</p>
            <p className="mt-2 text-xs text-slate-500">{node.reason}</p>
          </div>
        ))}
      </article>
    </section>
  );
}
