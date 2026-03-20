"use client";

import { useEffect, useState } from "react";

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<{ status: number; body: T }> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const text = await res.text();
  const body = text ? (JSON.parse(text) as T) : (undefined as T);
  return { status: res.status, body };
}

export default function Page() {
  const [configText, setConfigText] = useState(
    JSON.stringify(
      { env: "dev", publicBaseUrl: "http://localhost:3000", apiKey: "dev_only_change_me_12345", rumSampleRate: 0.1 },
      null,
      2,
    ),
  );
  const [out, setOut] = useState<any>(null);
  const [error, setError] = useState("");

  async function run() {
    setError("");
    try {
      const cfg = JSON.parse(configText) as Record<string, unknown>;
      const r = await json("/api/validate", { method: "POST", body: JSON.stringify({ config: cfg }) });
      setOut(r.body);
      if (r.status !== 200) setError("Config invalid (see output).");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  useEffect(() => {
    run().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Config Doctor</h1>
        <p className="mt-2 text-slate-300">
          DX improvement: validate runtime config, return actionable errors, and redact secrets before logs/UI.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-amber-500/30 bg-amber-500/10 p-3 text-sm">{error}</div>
        ) : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Input config</h2>
          <textarea
            value={configText}
            onChange={(e) => setConfigText(e.target.value)}
            rows={14}
            className="mt-4 w-full rounded border border-slate-700 bg-black/30 px-3 py-2 font-mono text-xs"
          />
          <button
            type="button"
            onClick={run}
            className="mt-4 rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
          >
            Validate
          </button>
          <p className="mt-3 text-xs text-slate-400">
            Try breaking it (e.g., delete <span className="font-mono">apiKey</span>, or set{" "}
            <span className="font-mono">publicBaseUrl</span> to a non-URL).
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Output</h2>
          <pre className="mt-4 overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">
            {JSON.stringify(out, null, 2)}
          </pre>
        </div>
      </section>
    </main>
  );
}

