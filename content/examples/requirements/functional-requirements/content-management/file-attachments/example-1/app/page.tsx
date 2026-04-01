"use client";

import { useEffect, useState } from "react";

type Attachment = {
  id: string;
  name: string;
  sizeMb: number;
  status: "uploaded" | "pending" | "rejected" | "scanning";
  scanResult: "clean" | "pending" | "failed";
};

type AttachmentState = {
  attachments: Attachment[];
  maxSizeMb: number;
  acceptedTypes: string[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<AttachmentState | null>(null);

  async function refresh() {
    const response = await fetch("/api/attachments/state");
    setState((await response.json()) as AttachmentState);
  }

  async function act(type: "queue" | "reject") {
    const response = await fetch("/api/attachments/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setState((await response.json()) as AttachmentState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Attachment Review Workflow</h1>
      <p className="mt-2 text-slate-300">Validate file type, size, and scan status before attachments become part of editorial content.</p>
      <section className="mt-8 grid gap-4">
        <div className="flex gap-3">
          <button onClick={() => void act("queue")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Queue attachment</button>
          <button onClick={() => void act("reject")} className="rounded border border-rose-700 px-4 py-2 text-sm font-semibold text-rose-300">Simulate rejection</button>
        </div>
        {state?.attachments.map((attachment) => (
          <article key={attachment.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-100">{attachment.name}</div>
                <div className="mt-1 text-xs text-slate-400">{attachment.sizeMb} MB · {attachment.status} · scan {attachment.scanResult}</div>
              </div>
            </div>
          </article>
        ))}
        <p className="text-sm text-slate-400">Accepted types: {state?.acceptedTypes.join(", ")} · max size: {state?.maxSizeMb} MB · {state?.lastMessage}</p>
      </section>
    </main>
  );
}
