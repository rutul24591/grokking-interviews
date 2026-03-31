"use client";

import { useEffect, useState } from "react";

type JourneyState = { sessionId: string; steps: string[]; notes: string[] };

const actions = ["open-subcategory", "open-article-card", "read-article", "toggle-examples", "copy-example"];

export default function AnalyticsLab() {
  const [journey, setJourney] = useState<JourneyState | null>(null);

  async function refresh() {
    const response = await fetch("http://localhost:4517/journey");
    setJourney((await response.json()) as JourneyState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function record(step: string) {
    await fetch("http://localhost:4517/journey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step })
    });
    await refresh();
  }

  async function reset() {
    await fetch("http://localhost:4517/reset", { method: "POST" });
    await refresh();
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Journey actions</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {actions.map((step) => (
            <button key={step} className="rounded-full bg-slate-950 px-4 py-2 font-semibold text-white" onClick={() => void record(step)}>{step}</button>
          ))}
          <button className="rounded-full bg-rose-100 px-4 py-2 font-semibold text-rose-800" onClick={() => void reset()}>Reset session</button>
        </div>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Ordered journey</h2>
        <ol className="mt-4 space-y-3 text-sm text-slate-700">
          {journey?.steps.map((step, index) => (
            <li key={`${step}-${index}`} className="rounded-2xl bg-slate-50 px-4 py-3">{index + 1}. {step}</li>
          ))}
        </ol>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {journey?.notes.map((note) => <li key={note} className="rounded-2xl bg-indigo-50 px-4 py-3">{note}</li>)}
        </ul>
      </article>
    </section>
  );
}
