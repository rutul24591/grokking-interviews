"use client";

import { useState } from "react";

async function post(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  return { status: res.status, headers: Object.fromEntries(res.headers.entries()), body: json };
}

async function get(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  return { status: res.status, body: await res.json() };
}

export default function Page() {
  const [requestId, setRequestId] = useState<string>("");
  const [logs, setLogs] = useState<any>(null);
  const [out, setOut] = useState<any>(null);

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Centralized logging — structured logs + correlation id + redaction</h1>
        <p className="text-sm text-slate-300">
          Simulates an app that logs JSON records and lets you query by request id.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500"
            onClick={async () => {
              const r = await post("/api/order", {
                email: "alice@example.com",
                sku: "SKU-123",
                quantity: 1,
                token: "Bearer secret_token"
              });
              setOut(r);
              setRequestId(String(r.headers["x-request-id"] || ""));
            }}
          >
            Place order
          </button>
          <button
            className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
            onClick={async () => setLogs((await get(`/api/logs?requestId=${encodeURIComponent(requestId)}`)).body)}
            disabled={!requestId}
          >
            Fetch logs for requestId
          </button>
          <button
            className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
            onClick={async () => {
              await fetch("/api/logs", { method: "DELETE" });
              setLogs(null);
            }}
          >
            Clear logs
          </button>
        </div>

        <div className="text-xs text-slate-400 break-all">
          requestId: <span className="font-mono">{requestId || "—"}</span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <pre className="rounded-lg bg-slate-950/40 p-3 text-xs overflow-auto">{JSON.stringify(out, null, 2)}</pre>
          <pre className="rounded-lg bg-slate-950/40 p-3 text-xs overflow-auto">{JSON.stringify(logs, null, 2)}</pre>
        </div>
      </section>
    </main>
  );
}

