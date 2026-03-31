"use client";

import { useState } from "react";

type BootPayload = {
  provider: string;
  sdkUrl: string;
  articleContext: string;
};

function simulateScriptLoad(url: string, shouldFail: boolean) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error(`failed to load ${url}`));
        return;
      }
      resolve();
    }, 250);
  });
}

export default function ChatWidgetShell() {
  const [logs, setLogs] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle");

  async function bootWidget(mode: "healthy" | "down") {
    setStatus("fetching provider config");
    try {
      const response = await fetch(`http://localhost:4472/bootstrap?mode=${mode}`);
      if (!response.ok) {
        throw new Error(`provider unavailable (${response.status})`);
      }

      const payload = (await response.json()) as BootPayload;
      setLogs((current) => [`received widget config for ${payload.provider}`, ...current].slice(0, 8));
      setStatus("loading widget script");
      await simulateScriptLoad(payload.sdkUrl, mode === "down");

      setStatus("initializing widget");
      setOpen(true);
      setLogs((current) => [`booted ${payload.provider} for ${payload.articleContext}`, ...current].slice(0, 8));
      setStatus("widget ready");
    } catch (error) {
      setOpen(false);
      setStatus("fallback mode");
      setLogs((current) => [`fallback to contact form: ${(error as Error).message}`, ...current].slice(0, 8));
    }
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Chat launcher</h2>
        <div className="mt-4 flex gap-3">
          <button onClick={() => void bootWidget("healthy")} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Open chat</button>
          <button onClick={() => void bootWidget("down")} className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">Simulate outage</button>
        </div>
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          <p>Status: {status}</p>
          <p className="mt-2">{open ? "Chat widget mounted with article context." : "Widget not mounted."}</p>
        </div>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Integration log</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {logs.map((log) => <li key={log} className="rounded-2xl bg-slate-50 px-4 py-3">{log}</li>)}
        </ul>
      </article>
    </section>
  );
}
