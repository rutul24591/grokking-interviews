"use client";

import { useMemo, useState } from "react";

export function QueueConsole() {
  const [policy, setPolicy] = useState<"append" | "replace" | "drop">("append");
  const [queue, setQueue] = useState(["card-enter"]);
  const [active, setActive] = useState("card-enter");

  function enqueue(name: string) {
    setQueue((current) => {
      if (policy === "replace") {
        setActive(name);
        return [name];
      }
      if (policy === "drop" && current.length >= 2) return current;
      return [...current, name];
    });
  }

  function completeNext() {
    setQueue((current) => {
      if (current.length === 0) return current;
      const [, ...rest] = current;
      setActive(rest[0] ?? "idle");
      return rest;
    });
  }

  const policyNote = useMemo(() => {
    if (policy === "append") return "Queue all requests and play them in order.";
    if (policy === "replace") return "Replace the current motion when a newer request matters more.";
    return "Drop lower-priority requests when the surface is already busy.";
  }, [policy]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="flex flex-wrap gap-3">
          <select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" value={policy} onChange={(event) => setPolicy(event.target.value as "append" | "replace" | "drop")}>
            <option value="append">Append</option>
            <option value="replace">Replace</option>
            <option value="drop">Drop when busy</option>
          </select>
          <button className="rounded-2xl bg-sky-400 px-4 py-3 font-medium text-slate-950" onClick={() => enqueue("toast-enter")}>Queue toast</button>
          <button className="rounded-2xl border border-slate-700 px-4 py-3" onClick={() => enqueue("route-transition")}>Queue route transition</button>
          <button className="rounded-2xl border border-slate-700 px-4 py-3" onClick={() => enqueue("hover-highlight")}>Queue hover</button>
          <button className="rounded-2xl border border-slate-700 px-4 py-3" onClick={completeNext}>Mark active complete</button>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            {queue.map((item, index) => (
              <div key={`${item}-${index}`} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
                {index === 0 ? `active -> ${item}` : `queued -> ${item}`}
              </div>
            ))}
          </div>
          <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-medium">Queue policy</h2>
            <p className="mt-3 text-sm text-slate-300">active={active}</p>
            <p className="mt-2 text-sm text-slate-400">{policyNote}</p>
            <p className="mt-3 text-sm text-slate-400">Use queueing when route transitions, toasts, and hover effects compete for the same visual surface.</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
