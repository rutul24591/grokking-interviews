"use client";

import { useMemo, useState } from "react";

type Article = {
  id: string;
  title: string;
  readingTime: string;
};

const choices = ["queueing", "websocket", "cdn", "graphql"];

export default function BatchBoard() {
  const [selected, setSelected] = useState<string[]>(["queueing", "websocket"]);
  const [result, setResult] = useState<Article[]>([]);
  const [requestedAt, setRequestedAt] = useState<string>("");

  const requestCount = useMemo(() => selected.length, [selected]);

  async function runBatch() {
    const response = await fetch("http://localhost:4380/articles/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected })
    });
    const payload = (await response.json()) as { items: Article[]; requestedAt: string };
    setResult(payload.items);
    setRequestedAt(payload.requestedAt);
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Client intent</h2>
        <p className="mt-2 text-sm text-slate-600">Without batching this interaction would create {requestCount} separate HTTP requests.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {choices.map((choice) => {
            const enabled = selected.includes(choice);
            return (
              <button
                key={choice}
                onClick={() => setSelected((current) => enabled ? current.filter((item) => item !== choice) : [...current, choice])}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${enabled ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                {choice}
              </button>
            );
          })}
        </div>
        <button onClick={() => void runBatch()} className="mt-6 rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950">
          Fetch in one batch
        </button>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Batch response</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{requestedAt || "No request yet"}</span>
        </div>
        <ul className="mt-4 space-y-3">
          {result.map((item) => (
            <li key={item.id} className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="font-medium text-slate-900">{item.title}</p>
              <p className="mt-1 text-sm text-slate-600">{item.readingTime}</p>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
