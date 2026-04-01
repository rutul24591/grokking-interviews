"use client";

import { useEffect, useState } from "react";

type Upload = {
  id: string;
  name: string;
  progress: number;
  status: "queued" | "uploading" | "uploaded" | "failed";
  partCount: number;
};

type UploadState = {
  uploads: Upload[];
  concurrency: number;
  resumableEnabled: boolean;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<UploadState | null>(null);

  async function refresh() {
    const response = await fetch("/api/media-upload/state");
    setState((await response.json()) as UploadState);
  }

  async function act(type: "start" | "retry") {
    const response = await fetch("/api/media-upload/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setState((await response.json()) as UploadState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Media Upload Ingest</h1>
      <p className="mt-2 text-slate-300">Manage upload progress, concurrency, resumable transfer, and retry handling for editorial media ingestion.</p>
      <section className="mt-8 grid gap-4">
        <div className="flex gap-3">
          <button onClick={() => void act("start")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Advance uploads</button>
          <button onClick={() => void act("retry")} className="rounded border border-amber-700 px-4 py-2 text-sm font-semibold text-amber-300">Retry failed</button>
        </div>
        {state?.uploads.map((upload) => (
          <article key={upload.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            <div className="font-semibold text-slate-100">{upload.name}</div>
            <div className="mt-1 text-xs text-slate-400">{upload.progress}% · {upload.status} · parts {upload.partCount}</div>
          </article>
        ))}
        <p className="text-sm text-slate-400">Concurrency: {state?.concurrency} · resumable: {String(state?.resumableEnabled)} · {state?.lastMessage}</p>
      </section>
    </main>
  );
}
