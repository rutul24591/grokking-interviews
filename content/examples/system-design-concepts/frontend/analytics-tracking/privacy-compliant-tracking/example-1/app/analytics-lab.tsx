"use client";

import { useState } from "react";

type CollectorResponse = { received: Record<string, string>; sanitized: Record<string, string> };

export default function AnalyticsLab() {
  const [form, setForm] = useState({ article: "oauth-integration", email: "reader@example.com", sessionId: "session-2026-03-31", country: "de" });
  const [result, setResult] = useState<CollectorResponse | null>(null);

  async function submit() {
    const response = await fetch("http://localhost:4516/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setResult((await response.json()) as CollectorResponse);
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Raw input</h2>
        <div className="mt-4 grid gap-3">
          {Object.entries(form).map(([key, value]) => (
            <label key={key} className="grid gap-1 text-sm text-slate-700">
              <span className="font-medium capitalize">{key}</span>
              <input className="rounded-2xl border border-slate-200 px-3 py-2" value={value} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} />
            </label>
          ))}
        </div>
        <button className="mt-5 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white" onClick={() => void submit()}>Sanitize and send</button>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Collector payload</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm text-slate-700">
          <pre className="overflow-x-auto rounded-2xl bg-slate-50 p-4">{JSON.stringify(result?.received ?? {}, null, 2)}</pre>
          <pre className="overflow-x-auto rounded-2xl bg-emerald-50 p-4">{JSON.stringify(result?.sanitized ?? {}, null, 2)}</pre>
        </div>
      </article>
    </section>
  );
}
