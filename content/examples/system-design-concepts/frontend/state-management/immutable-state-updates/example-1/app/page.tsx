"use client";

import { useMemo, useState } from "react";

type Section = { id: string; heading: string; bulletCount: number };
type Draft = { title: string; sections: Section[]; reviewers: { name: string; status: string }[] };

const initial: Draft = {
  title: "State management rollout",
  sections: [
    { id: "s1", heading: "Current issues", bulletCount: 3 },
    { id: "s2", heading: "Migration plan", bulletCount: 5 }
  ],
  reviewers: [
    { name: "Priya", status: "pending" },
    { name: "Noah", status: "approved" }
  ]
};

export default function Page() {
  const [draft, setDraft] = useState(initial);
  const [history, setHistory] = useState<Draft[]>([initial]);
  const totalBullets = useMemo(() => draft.sections.reduce((sum, section) => sum + section.bulletCount, 0), [draft.sections]);

  function updateSection(id: string, delta: number) {
    setDraft((current) => {
      const next = {
        ...current,
        sections: current.sections.map((section) => section.id === id ? { ...section, bulletCount: section.bulletCount + delta } : section)
      };
      setHistory((prev) => [next, ...prev].slice(0, 4));
      return next;
    });
  }

  function approveReviewer(name: string) {
    setDraft((current) => {
      const next = {
        ...current,
        reviewers: current.reviewers.map((reviewer) => reviewer.name === name ? { ...reviewer, status: "approved" } : reviewer)
      };
      setHistory((prev) => [next, ...prev].slice(0, 4));
      return next;
    });
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Immutable updates</p>
        <h1 className="mt-2 text-3xl font-semibold">Document draft editor</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="space-y-4">
            {draft.sections.map((section) => (
              <article key={section.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-medium">{section.heading}</h2>
                    <p className="mt-1 text-sm text-slate-400">{section.bulletCount} bullets in this section</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-xl border border-slate-700 px-3 py-2" onClick={() => updateSection(section.id, -1)}>-1</button>
                    <button className="rounded-xl bg-amber-400 px-3 py-2 font-medium text-slate-950" onClick={() => updateSection(section.id, 1)}>+1</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-medium">Snapshot integrity</h2>
            <p className="mt-2 text-sm text-slate-400">Total bullets: {totalBullets}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              {draft.reviewers.map((reviewer) => (
                <button key={reviewer.name} className="block w-full rounded-xl border border-slate-800 px-3 py-3 text-left" onClick={() => approveReviewer(reviewer.name)}>
                  {reviewer.name} · {reviewer.status}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              {history.map((snapshot, index) => (
                <div key={`${snapshot.title}-${index}`} className="rounded-xl border border-slate-800 px-3 py-3">
                  Snapshot {index + 1}: {snapshot.sections.map((section) => `${section.heading}=${section.bulletCount}`).join(', ')}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
