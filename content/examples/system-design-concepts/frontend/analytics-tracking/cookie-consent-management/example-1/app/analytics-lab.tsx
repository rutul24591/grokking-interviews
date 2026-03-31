"use client";

import { useEffect, useState } from "react";

type ConsentState = { version: string; analytics: boolean; personalization: boolean; ads: boolean };
type CollectorEntry = { type: string; accepted: boolean; reason: string };

const defaultState: ConsentState = { version: "2026-03", analytics: true, personalization: false, ads: false };

export default function AnalyticsLab() {
  const [consent, setConsent] = useState<ConsentState>(defaultState);
  const [entries, setEntries] = useState<CollectorEntry[]>([]);
  const [message, setMessage] = useState("Loading consent state...");

  useEffect(() => {
    void (async () => {
      const response = await fetch("http://localhost:4512/consent");
      const result = (await response.json()) as { consent: ConsentState; collector: CollectorEntry[] };
      setConsent(result.consent);
      setEntries(result.collector);
      setMessage("Consent state loaded from the preference store.");
    })();
  }, []);

  async function saveConsent(next: ConsentState) {
    setConsent(next);
    const response = await fetch("http://localhost:4512/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next)
    });
    const result = (await response.json()) as { saved: boolean; collector: CollectorEntry[] };
    setEntries(result.collector);
    setMessage(result.saved ? "Consent saved and applied immediately." : "Consent save failed.");
  }

  async function emitAnalytics() {
    const response = await fetch("http://localhost:4512/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "page_view", category: "analytics" })
    });
    const result = (await response.json()) as { collector: CollectorEntry[] };
    setEntries(result.collector);
    setMessage("Issued a page_view event under the current consent profile.");
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Consent banner controls</h2>
        <div className="mt-4 grid gap-4">
          {(["analytics", "personalization", "ads"] as const).map((key) => (
            <label key={key} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <span className="font-medium capitalize">{key}</span>
              <input type="checkbox" checked={consent[key]} onChange={(event) => setConsent((current) => ({ ...current, [key]: event.target.checked }))} />
            </label>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white" onClick={() => void saveConsent(consent)}>Save consent</button>
          <button className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800" onClick={() => void emitAnalytics()}>Send analytics event</button>
        </div>
        <p className="mt-4 text-sm text-slate-600">Active version: {consent.version}</p>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Collector outcomes</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {entries.map((entry, index) => (
            <li key={`${entry.type}-${index}`} className="rounded-2xl bg-slate-50 px-4 py-3">
              <span className="font-semibold text-slate-950">{entry.type}</span> · {entry.accepted ? "accepted" : "blocked"} · {entry.reason}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
