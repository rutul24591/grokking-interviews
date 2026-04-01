"use client";
import { useEffect, useMemo, useState } from "react";

type Mode = "content-based" | "collaborative" | "hybrid";
type Candidate = { id: string; title: string; cluster: string; topicMatch: number; collaborativeScore: number; recency: number };
type RecommendationState = {
  mode: Mode;
  userContext: { segment: string; activeTopic: string };
  candidates: Candidate[];
  rankedIds: string[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<RecommendationState | null>(null);
  const [mode, setMode] = useState<Mode>("hybrid");

  async function refresh() {
    const response = await fetch("/api/recommendations/state");
    const data = (await response.json()) as RecommendationState;
    setState(data);
    setMode(data.mode);
  }

  async function rerank() {
    const response = await fetch("/api/recommendations/mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode })
    });
    setState((await response.json()) as RecommendationState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const rankedItems = useMemo(
    () => state?.rankedIds.map((id) => state.candidates.find((candidate) => candidate.id === id)).filter(Boolean) as Candidate[] ?? [],
    [state]
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Recommendation Algorithms</h1>
      <p className="mt-2 text-slate-300">
        Compare content-based, collaborative, and hybrid ranking strategies for a discovery surface.
      </p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-[0.3em] text-slate-500">User context</div>
          <div className="mt-2 rounded-lg border border-slate-800 px-3 py-2">
            {state?.userContext.segment} · {state?.userContext.activeTopic}
          </div>
          <label className="mt-5 block font-semibold text-slate-100">Recommendation strategy</label>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as Mode)}
            className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
          >
            <option value="content-based">Content-based</option>
            <option value="collaborative">Collaborative</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <button onClick={rerank} className="mt-4 rounded bg-sky-600 px-4 py-2 font-semibold hover:bg-sky-500">
            Re-rank recommendations
          </button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <ul className="space-y-3">
            {rankedItems.map((item, index) => (
              <li key={item.id} className="rounded-lg border border-slate-800 p-4 text-sm text-slate-300">
                <div className="font-semibold text-slate-100">#{index + 1} {item.title}</div>
                <div className="mt-1 text-slate-400">cluster {item.cluster}</div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  <span>Topic match {item.topicMatch}</span>
                  <span>Collaborative {item.collaborativeScore}</span>
                  <span>Recency {item.recency}</span>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
