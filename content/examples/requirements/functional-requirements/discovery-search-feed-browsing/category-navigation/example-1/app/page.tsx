"use client";

import { useEffect, useState } from "react";

type Category = { id: string; label: string; children: string[]; contentCount: number };
type NavigationState = { categories: Category[]; selectedCategory: string; selectedChild: string; breadcrumb: string[]; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<NavigationState | null>(null);

  async function refresh() {
    const response = await fetch("/api/navigation/state");
    setState((await response.json()) as NavigationState);
  }

  async function select(category: string, child: string) {
    const response = await fetch("/api/navigation/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, child })
    });
    setState((await response.json()) as NavigationState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Category Navigation</h1>
      <p className="mt-2 text-slate-300">Browse top-level categories, drill into child topics, and keep the navigation path synchronized with the content surface.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <ul className="space-y-3 text-sm text-slate-300">
            {state?.categories.map((category) => (
              <li key={category.id} className="rounded-lg border border-slate-800 p-4">
                <div className="font-semibold text-slate-100">{category.label}</div>
                <div className="mt-1 text-xs text-slate-400">{category.contentCount} articles</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {category.children.map((child) => (
                    <button key={child} onClick={() => select(category.id, child)} className="rounded bg-slate-800 px-3 py-2 text-xs hover:bg-slate-700">
                      {child}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-400">Breadcrumb</div>
          <div className="mt-2 font-semibold text-slate-100">{state?.breadcrumb.join(" → ")}</div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-800 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">Selected category</div>
              <div className="mt-2 text-lg font-semibold text-slate-100">{state?.selectedCategory}</div>
            </div>
            <div className="rounded-lg border border-slate-800 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">Selected child</div>
              <div className="mt-2 text-lg font-semibold text-slate-100">{state?.selectedChild}</div>
            </div>
          </div>
          <p className="mt-5">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
