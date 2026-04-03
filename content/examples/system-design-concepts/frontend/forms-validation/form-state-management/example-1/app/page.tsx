"use client";

import { useMemo, useState } from "react";
import { stateDefaults, statePanels, stateRisks } from "@/lib/store";

export default function Page() {
  const [workspaceName, setWorkspaceName] = useState(stateDefaults.workspaceName);
  const [incidentChannel, setIncidentChannel] = useState(stateDefaults.incidentChannel);
  const [enableAutoApprove, setEnableAutoApprove] = useState(stateDefaults.enableAutoApprove);
  const [runbookVersion, setRunbookVersion] = useState(stateDefaults.runbookVersion);
  const [reviewers, setReviewers] = useState(stateDefaults.reviewers.join(", "));
  const [escalationPolicy, setEscalationPolicy] = useState(stateDefaults.escalationPolicy);
  const [saveMode, setSaveMode] = useState<"full" | "partial">("full");
  const [savedCheckpoint, setSavedCheckpoint] = useState<string[]>([]);
  const [status, setStatus] = useState("No save action taken yet.");

  const dirtyKeys = [
    workspaceName !== stateDefaults.workspaceName ? "workspaceName" : null,
    incidentChannel !== stateDefaults.incidentChannel ? "incidentChannel" : null,
    enableAutoApprove !== stateDefaults.enableAutoApprove ? "enableAutoApprove" : null,
    runbookVersion !== stateDefaults.runbookVersion ? "runbookVersion" : null,
    reviewers !== stateDefaults.reviewers.join(", ") ? "reviewers" : null,
    escalationPolicy !== stateDefaults.escalationPolicy ? "escalationPolicy" : null
  ].filter(Boolean) as string[];

  const reviewerCount = reviewers.split(",").map((item) => item.trim()).filter(Boolean).length;
  const readiness = useMemo(() => {
    if (!workspaceName.trim() || !incidentChannel.trim()) return "Configuration is incomplete.";
    if (reviewerCount < 2) return "Add at least two reviewers before save.";
    if (enableAutoApprove && runbookVersion === "v1") return "Block save until the runbook version is upgraded.";
    return `Ready for ${saveMode} save with ${dirtyKeys.length} dirty field(s).`;
  }, [workspaceName, incidentChannel, reviewerCount, enableAutoApprove, runbookVersion, saveMode, dirtyKeys.length]);

  const checkpointWarnings = useMemo(() => {
    const warnings: string[] = [];
    if (savedCheckpoint.includes("workspaceName") && dirtyKeys.includes("reviewers")) warnings.push("Reviewer coverage changed after the last checkpoint.");
    if (saveMode === "partial" && dirtyKeys.includes("runbookVersion") && enableAutoApprove) warnings.push("Auto-approve cannot use a stale runbook version in partial mode.");
    return warnings;
  }, [dirtyKeys, enableAutoApprove, saveMode, savedCheckpoint]);

  function discard() {
    setWorkspaceName(stateDefaults.workspaceName);
    setIncidentChannel(stateDefaults.incidentChannel);
    setEnableAutoApprove(stateDefaults.enableAutoApprove);
    setRunbookVersion(stateDefaults.runbookVersion);
    setReviewers(stateDefaults.reviewers.join(", "));
    setEscalationPolicy(stateDefaults.escalationPolicy);
    setSavedCheckpoint([]);
    setStatus("Discarded local edits and rebuilt derived readiness state.");
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-fuchsia-300">Forms validation</p>
        <h1 className="mt-2 text-3xl font-semibold">Form state management workbench</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Track dirty state, partial checkpoints, derived reviewer readiness, and rollback-safe discards for a high-stakes settings form.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="grid gap-4 md:grid-cols-2">
              <input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
              <input value={incidentChannel} onChange={(event) => setIncidentChannel(event.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <select value={runbookVersion} onChange={(event) => setRunbookVersion(event.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                <option value="v1">v1</option>
                <option value="v5">v5</option>
                <option value="v6">v6</option>
              </select>
              <select value={escalationPolicy} onChange={(event) => setEscalationPolicy(event.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                <option value="tier-1">tier-1</option>
                <option value="tier-2">tier-2</option>
              </select>
            </div>
            <textarea value={reviewers} onChange={(event) => setReviewers(event.target.value)} className="min-h-24 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
            <label className="flex items-center gap-3"><input type="checkbox" checked={enableAutoApprove} onChange={(event) => setEnableAutoApprove(event.target.checked)} /> Enable auto approve</label>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => { setSaveMode("full"); setSavedCheckpoint(dirtyKeys); setStatus(readiness); }} className="rounded-2xl bg-fuchsia-400 px-4 py-2 font-medium text-slate-950">Run full save</button>
              <button onClick={() => { const partial = dirtyKeys.slice(0, 2); setSaveMode("partial"); setSavedCheckpoint(partial); setStatus(`Saved ${partial.join(", ") || "no fields"} as a partial checkpoint.`); }} className="rounded-2xl border border-slate-700 px-4 py-2">Run partial save</button>
              <button onClick={discard} className="rounded-2xl border border-slate-700 px-4 py-2">Discard</button>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Derived readiness</div>
              <p className="mt-2">{readiness}</p>
              <p className="mt-2">Dirty keys: {dirtyKeys.length === 0 ? "none" : dirtyKeys.join(", ")}</p>
              <p className="mt-2">Saved checkpoint: {savedCheckpoint.length === 0 ? "none" : savedCheckpoint.join(", ")}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Warnings</div>
              {checkpointWarnings.length === 0 ? <p className="mt-2 text-emerald-200">No partial-save conflicts detected.</p> : <ul className="mt-2 space-y-2 text-amber-200">{checkpointWarnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>}
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Panels and risks</div>
              <ul className="mt-2 space-y-2">{statePanels.concat(stateRisks).map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Latest action</div>
              <p className="mt-2">{status}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
