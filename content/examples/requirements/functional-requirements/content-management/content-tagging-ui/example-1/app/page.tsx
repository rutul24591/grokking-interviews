"use client";
import { useEffect, useState } from "react";

type TagEntry = {
  id: string;
  title: string;
  tags: string[];
  quality: "high" | "medium" | "low";
};
type TaggingState = {
  suggestedTags: string[];
  entries: TagEntry[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<TaggingState | null>(null);
  async function refresh() {
    const response = await fetch("/api/tagging/state");
    setState((await response.json()) as TaggingState);
  }
  async function improveTags(id: string, tags: string[]) {
    const response = await fetch("/api/tagging/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, tags })
    });
    setState((await response.json()) as TaggingState);
  }
  useEffect(() => { void refresh(); }, []);
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Content Tagging UI</h1>
      <p className="mt-2 text-slate-300">Review content tags, improve weak tagging quality, and keep search labels consistent across the catalog.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-500">Suggested tags</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {state?.suggestedTags.map((tag) => <span key={tag} className="rounded border border-slate-700 px-2 py-1">{tag}</span>)}
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.entries.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{entry.title}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">quality: {entry.quality}</div>
                </div>
                <button onClick={() => void improveTags(entry.id, [...entry.tags, "system-design"])} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Add review tag</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.tags.map((tag) => <span key={tag} className="rounded border border-slate-700 px-2 py-1">{tag}</span>)}
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
