"use client";

import { useState } from "react";
import { layoutSchema, renderWidget, type Layout } from "../lib/widgets";

export default function Page() {
  const [layout, setLayout] = useState<Layout | null>(null);
  const [raw, setRaw] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    setLayout(null);
    const res = await fetch("/api/layout", { cache: "no-store" });
    const json = (await res.json()) as unknown;
    setRaw(json);
    const parsed = layoutSchema.safeParse(json);
    if (!parsed.success) {
      setError(parsed.error.message);
      return;
    }
    setLayout(parsed.data);
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Factory Pattern: widget type → component</h1>
        <p className="text-sm text-white/70">A single factory is the extensibility/safety point for server-driven UI.</p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <button
          onClick={load}
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
        >
          Load layout
        </button>

        {error ? <div className="mt-3 rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-sm">{error}</div> : null}

        {layout ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {layout.widgets.map((w, idx) => (
              <div key={`${w.type}-${idx}`}>{renderWidget(w)}</div>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-sm text-white/60">No layout yet.</div>
        )}
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold">Raw response</h2>
        <pre className="mt-3 max-h-72 overflow-auto rounded bg-black/20 p-3 text-xs">
{raw ? JSON.stringify(raw, null, 2) : "—"}
        </pre>
      </section>
    </main>
  );
}

