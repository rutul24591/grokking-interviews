"use client";

import { useMemo, useState } from "react";
import { autosaveSnapshot } from "@/lib/store";

type FieldState = Record<string, string>;

export default function Page() {
  const initialValues = Object.fromEntries(autosaveSnapshot.fields.map((field) => [field.id, field.value])) as FieldState;
  const [values, setValues] = useState<FieldState>(initialValues);
  const [network, setNetwork] = useState(autosaveSnapshot.network);
  const [savePolicy, setSavePolicy] = useState<"idle" | "manual-review" | "queue-only">("idle");
  const [lastEvent, setLastEvent] = useState(autosaveSnapshot.restoreSuggestion);
  const [reviewRequired, setReviewRequired] = useState(false);

  const dirtyFields = autosaveSnapshot.fields.filter((field) => values[field.id] !== field.value).map((field) => field.label);
  const canAutosave = network === "healthy" && savePolicy === "idle" && !reviewRequired && dirtyFields.length > 0;
  const nextAction = useMemo(() => {
    if (network === "offline") return "Queue local draft changes until the connection is restored.";
    if (reviewRequired) return "Pause autosave and surface a merge review before persisting.";
    if (savePolicy === "queue-only") return "Keep recording diffs locally and wait for manual publish.";
    if (dirtyFields.length === 0) return "No dirty fields remain. Autosave can stay idle.";
    return `Autosave will persist ${dirtyFields.length} edited field(s) on the next idle window.`;
  }, [dirtyFields.length, network, reviewRequired, savePolicy]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Forms validation</p>
        <h1 className="mt-2 text-3xl font-semibold">Draft autosave control room</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Review how a long-form editor handles dirty state, save cadence, network instability, and remote revision conflicts.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              {autosaveSnapshot.fields.map((field) => (
                <label key={field.id} className="block text-sm text-slate-200">
                  <span className="font-medium">{field.label}</span>
                  <textarea
                    className="mt-2 min-h-28 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                    value={values[field.id]}
                    onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.value }))}
                  />
                </label>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <button onClick={() => setNetwork((current) => current === "healthy" ? "offline" : "healthy")} className="rounded-2xl bg-cyan-400 px-4 py-2 font-medium text-slate-950">
                Network: {network}
              </button>
              <button onClick={() => setReviewRequired((current) => !current)} className="rounded-2xl border border-slate-700 px-4 py-2">
                {reviewRequired ? "Clear merge review" : "Flag merge review"}
              </button>
              <select value={savePolicy} onChange={(event) => setSavePolicy(event.target.value as typeof savePolicy)} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2">
                <option value="idle">Idle autosave</option>
                <option value="manual-review">Manual review gate</option>
                <option value="queue-only">Queue-only mode</option>
              </select>
              <button
                onClick={() => setLastEvent(canAutosave ? `Saved ${dirtyFields.join(", ") || "no fields"} at the next idle window.` : nextAction)}
                className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-emerald-100"
              >
                Evaluate autosave
              </button>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Current policy</div>
              <div className="mt-2 text-lg font-semibold text-slate-100">{autosaveSnapshot.cadence}</div>
              <p className="mt-2">Pending jobs: {autosaveSnapshot.pendingJobs} · Last saved: {autosaveSnapshot.lastSavedAt}</p>
              <p className="mt-2">Local revision {autosaveSnapshot.localRevision} vs remote {autosaveSnapshot.remoteRevision}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Dirty state</div>
              <p className="mt-2 text-slate-200">{dirtyFields.length === 0 ? "No edited fields" : dirtyFields.join(", ")}</p>
              <p className="mt-2">{nextAction}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Latest decision</div>
              <p className="mt-2 text-slate-200">{lastEvent}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
