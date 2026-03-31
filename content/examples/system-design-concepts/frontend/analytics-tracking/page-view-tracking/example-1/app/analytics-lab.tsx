"use client";

import { useEffect, useState } from "react";

type ViewEntry = { path: string; referrer: string | null; counted: boolean; reason: string };

const pages = ["/articles/rendering", "/articles/graphql", "/articles/web-vitals?tab=examples", "/articles/web-vitals#comments"];

export default function AnalyticsLab() {
  const [active, setActive] = useState(pages[0]);
  const [entries, setEntries] = useState<ViewEntry[]>([]);

  async function loadEntries() {
    const response = await fetch("http://localhost:4515/views");
    const result = (await response.json()) as { views: ViewEntry[] };
    setEntries(result.views);
  }

  useEffect(() => {
    void loadEntries();
  }, []);

  async function navigate(path: string) {
    const response = await fetch("http://localhost:4515/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, referrer: active })
    });
    const result = (await response.json()) as { activePath: string; views: ViewEntry[] };
    setActive(result.activePath);
    setEntries(result.views);
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Route transitions</h2>
        <div className="mt-4 grid gap-3">
          {pages.map((path) => (
            <button key={path} className="rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm text-slate-700" onClick={() => void navigate(path)}>
              {path}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600">Current path: {active}</p>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Tracked page views</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {entries.map((entry, index) => (
            <li key={`${entry.path}-${index}`} className="rounded-2xl bg-slate-50 px-4 py-3">
              <span className="font-semibold text-slate-950">{entry.path}</span> · {entry.counted ? "counted" : "suppressed"} · {entry.reason}
              <div className="mt-1 text-xs text-slate-500">referrer: {entry.referrer ?? "none"}</div>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
