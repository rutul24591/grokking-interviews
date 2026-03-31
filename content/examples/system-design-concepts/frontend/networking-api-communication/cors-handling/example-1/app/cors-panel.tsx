"use client";

import { useState } from "react";

type SuccessPayload = {
  message: string;
  preflightRequired: boolean;
  credentialMode: string;
};

export default function CorsPanel() {
  const origin = process.env.NEXT_PUBLIC_ORIGIN_API?.trim() || "http://localhost:4330";
  const [logs, setLogs] = useState<string[]>([]);

  async function callAllowedEndpoint() {
    try {
      const response = await fetch(`${origin}/allowed`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer frontend-token"
        },
        body: JSON.stringify({ topic: "cors" })
      });
      const payload = (await response.json()) as SuccessPayload;
      setLogs((current) => [
        `allowed endpoint -> success, preflight:${payload.preflightRequired}, credentials:${payload.credentialMode}`,
        ...current
      ].slice(0, 6));
    } catch (error) {
      setLogs((current) => [`allowed endpoint -> unexpected failure ${(error as Error).message}`, ...current].slice(0, 6));
    }
  }

  async function callBlockedEndpoint() {
    try {
      await fetch(`${origin}/blocked`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer frontend-token"
        },
        body: JSON.stringify({ topic: "cors" })
      });
      setLogs((current) => ["blocked endpoint -> unexpected success", ...current].slice(0, 6));
    } catch {
      setLogs((current) => ["blocked endpoint -> browser blocked cross-origin response", ...current].slice(0, 6));
    }
  }

  return (
    <section className="mt-10 rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(30,41,59,0.08)]">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => void callAllowedEndpoint()} className="rounded-full bg-slate-950 px-4 py-3 text-sm text-white">
          Credentialed allowed request
        </button>
        <button type="button" onClick={() => void callBlockedEndpoint()} className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">
          Blocked request
        </button>
      </div>
      <div className="mt-6 space-y-3">
        {logs.map((log) => (
          <div key={log} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
            {log}
          </div>
        ))}
      </div>
    </section>
  );
}
