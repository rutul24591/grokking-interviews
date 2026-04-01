"use client";

import { useEffect, useState } from "react";

type ViewState = {
  title: string;
  status: "published" | "stale";
  assets: string[];
  missingAssets: string[];
  lastViewedBy: string;
  currentVersion: number;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<ViewState | null>(null);

  async function refresh() {
    const response = await fetch("/api/view-pages/state");
    setState((await response.json()) as ViewState);
  }

  async function act(type: "mark-stale" | "refresh-view") {
    const response = await fetch("/api/view-pages/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setState((await response.json()) as ViewState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Reader Content Page State</h1>
      <p className="mt-2 text-slate-300">Inspect publication status, asset availability, and stale page signaling on reader-facing content pages.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr,320px]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="font-semibold text-slate-100">{state?.title}</div>
          <div className="mt-2">Status: {state?.status}</div>
          <div className="mt-2">Version: {state?.currentVersion}</div>
          <div className="mt-4 space-y-2">
            {state?.assets.map((asset) => (
              <div key={asset} className="rounded border border-slate-800 bg-slate-950/60 px-3 py-2">{asset}</div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={() => void act("mark-stale")} className="rounded border border-amber-700 px-4 py-2 text-sm font-semibold text-amber-300">Mark stale</button>
            <button onClick={() => void act("refresh-view")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Refresh view</button>
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div>Last viewed by: {state?.lastViewedBy}</div>
          <div className="mt-3">Missing assets: {state?.missingAssets.join(", ") || "none"}</div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
