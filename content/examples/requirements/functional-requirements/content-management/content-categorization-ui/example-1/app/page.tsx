"use client";
import { useEffect, useState } from "react";

type CategoryAssignment = {
  id: string;
  title: string;
  primaryCategory: string;
  secondaryCategory: string;
  confidence: "high" | "medium" | "low";
};

type CategorizationState = {
  availableCategories: string[];
  assignments: CategoryAssignment[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<CategorizationState | null>(null);

  async function refresh() {
    const response = await fetch("/api/categorization/state");
    setState((await response.json()) as CategorizationState);
  }

  async function save(id: string, primaryCategory: string, secondaryCategory: string) {
    const response = await fetch("/api/categorization/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, primaryCategory, secondaryCategory })
    });
    setState((await response.json()) as CategorizationState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Content Categorization UI</h1>
      <p className="mt-2 text-slate-300">Let editors review and correct article taxonomy without losing confidence and secondary classification context.</p>
      <section className="mt-8 space-y-4">
        {state?.assignments.map((assignment) => (
          <div key={assignment.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-100">{assignment.title}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">confidence: {assignment.confidence}</div>
              </div>
              <button onClick={() => void save(assignment.id, assignment.primaryCategory, assignment.secondaryCategory)} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Confirm assignment</button>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded border border-slate-800 px-3 py-3">Primary: {assignment.primaryCategory}</div>
              <div className="rounded border border-slate-800 px-3 py-3">Secondary: {assignment.secondaryCategory}</div>
            </div>
          </div>
        ))}
        <p className="text-sm text-slate-400">{state?.lastMessage}</p>
      </section>
    </main>
  );
}
