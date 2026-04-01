"use client";
import { useEffect, useState } from "react";

type ShareChannel = {
  id: string;
  channel: "link" | "email" | "social" | "embed";
  audience: string;
  status: "ready" | "rate-limited" | "warning";
};
type SharingState = {
  primaryAudience: string;
  channels: ShareChannel[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<SharingState | null>(null);
  async function refresh() {
    const response = await fetch("/api/sharing/state");
    setState((await response.json()) as SharingState);
  }
  async function updateStatus(id: string, status: ShareChannel["status"]) {
    const response = await fetch("/api/sharing/channel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    setState((await response.json()) as SharingState);
  }
  useEffect(() => { void refresh(); }, []);
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Content Sharing Interface</h1>
      <p className="mt-2 text-slate-300">Manage share channels, audience targets, and channel health before content is distributed outward.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="rounded-lg border border-slate-800 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Primary audience</div>
            <div className="mt-2 font-semibold text-slate-100">{state?.primaryAudience}</div>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.channels.map((channel) => (
            <div key={channel.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{channel.channel}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">audience: {channel.audience}</div>
                </div>
                <select value={channel.status} onChange={(event) => void updateStatus(channel.id, event.target.value as ShareChannel["status"])} className="rounded border border-slate-700 bg-slate-950 px-3 py-2">
                  <option value="ready">ready</option>
                  <option value="warning">warning</option>
                  <option value="rate-limited">rate-limited</option>
                </select>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
