"use client";

import { useEffect, useMemo, useState } from "react";

type Version = {
  id: string;
  label: string;
  status: "draft" | "published" | "archived";
  editor: string;
  summary: string;
};

type VersionState = {
  activeId: string;
  versions: Version[];
  releaseWindow: string;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<VersionState | null>(null);

  async function refresh() {
    const response = await fetch("/api/versions/state");
    setState((await response.json()) as VersionState);
  }

  async function act(type: "restore" | "publish", versionId: string) {
    const response = await fetch("/api/versions/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, versionId })
    });
    setState((await response.json()) as VersionState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const active = useMemo(() => state?.versions.find((item) => item.id === state.activeId), [state]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Content Versioning Workbench</h1>
      <p className="mt-2 text-slate-300">
        Review revision lineage, promote a safe version, or restore a previous draft without losing editorial context.
      </p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-xs uppercase tracking-wide text-slate-400">Revision timeline</div>
          <div className="mt-4 space-y-3">
            {state?.versions.map((version) => (
              <div key={version.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-100">{version.label}</div>
                    <div className="mt-1 text-xs text-slate-400">{version.status} · owner {version.editor}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => void act("restore", version.id)} className="rounded border border-slate-700 px-3 py-1.5 text-xs font-semibold">
                      Restore
                    </button>
                    <button onClick={() => void act("publish", version.id)} className="rounded bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white">
                      Publish
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-slate-400">{version.summary}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-400">Active version</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{active?.label}</div>
          <div className="mt-2">Release window: {state?.releaseWindow}</div>
          <p className="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4">{active?.summary}</p>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
