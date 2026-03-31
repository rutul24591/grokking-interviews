"use client";

import { useEffect, useState } from "react";

type Bucket = { label: string; retainedMb: number };
type Snapshot = { id: string; label: string; retainedMb: number; buckets: Bucket[] };
type ProfileState = { snapshots: Snapshot[]; latestDiff: { label: string; deltaMb: number }[]; notes: string[] };

export default function MemoryProfilingLab() {
  const [state, setState] = useState<ProfileState | null>(null);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState("baseline");

  async function refresh() {
    const response = await fetch("http://localhost:4535/state");
    const next = (await response.json()) as ProfileState;
    setState(next);
    setSelectedSnapshotId((current) => current || next.snapshots[0]?.id || "baseline");
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function run(actionId: string) {
    await fetch("http://localhost:4535/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionId })
    });
    await refresh();
  }

  const selectedSnapshot = state?.snapshots.find((snapshot) => snapshot.id === selectedSnapshotId) ?? state?.snapshots[0];

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Snapshot workflow</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          <button className="rounded-full bg-rose-100 px-4 py-2 font-semibold text-rose-800" onClick={() => void run("capture-leaky")}>Capture leaky snapshot</button>
          <button className="rounded-full bg-slate-950 px-4 py-2 font-semibold text-white" onClick={() => void run("capture-clean")}>Capture cleanup snapshot</button>
          <button className="rounded-full bg-emerald-100 px-4 py-2 font-semibold text-emerald-800" onClick={() => void run("reset")}>Reset profile</button>
        </div>
        <select className="mt-4 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm" value={selectedSnapshotId} onChange={(event) => setSelectedSnapshotId(event.target.value)}>
          {state?.snapshots.map((snapshot) => <option key={snapshot.id} value={snapshot.id}>{snapshot.label}</option>)}
        </select>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">{state?.notes.map((note) => <li key={note}>• {note}</li>)}</ul>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Selected snapshot: {selectedSnapshot?.label ?? "Baseline"}</p>
          <div className="mt-3 grid gap-2">
            {selectedSnapshot?.buckets.map((bucket) => (
              <div key={bucket.label} className="flex items-center justify-between">
                <span>{bucket.label}</span>
                <span className="font-semibold text-slate-950">{bucket.retainedMb} MB</span>
              </div>
            ))}
          </div>
        </div>
      </article>
      <article className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {state?.snapshots.map((snapshot) => (
            <div key={snapshot.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">{snapshot.label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{snapshot.retainedMb} MB</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Diff from baseline</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {state?.latestDiff.map((bucket) => (
              <div key={bucket.label} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">{bucket.label}</p>
                <p className={`mt-2 text-lg font-semibold ${bucket.deltaMb > 0 ? "text-rose-700" : "text-emerald-700"}`}>{bucket.deltaMb >= 0 ? "+" : ""}{bucket.deltaMb} MB</p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
