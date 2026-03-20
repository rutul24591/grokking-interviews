"use client";

import { useState } from "react";

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  return { status: res.status, body: await res.json() };
}

async function getJson(url: string, headers?: Record<string, string>) {
  const res = await fetch(url, { headers, cache: "no-store" });
  return { status: res.status, body: await res.json() };
}

export default function Page() {
  const [token, setToken] = useState<string>("");
  const [out, setOut] = useState<any>(null);

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Authentication infrastructure — tokens + introspection cache</h1>
        <p className="text-sm text-slate-300">
          Models an auth control plane: issue opaque access tokens, introspect them, cache decisions, and revoke.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium hover:bg-emerald-500"
            onClick={async () => {
              const r = await postJson("/api/auth/login", { username: "demo", password: "pw" });
              setOut(r);
              if (r.status === 200) setToken(r.body.accessToken);
            }}
          >
            Login (issue token)
          </button>
          <button
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500"
            onClick={async () => setOut(await getJson(`/api/auth/introspect?token=${encodeURIComponent(token)}`))}
            disabled={!token}
          >
            Introspect
          </button>
          <button
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500"
            onClick={async () =>
              setOut(await getJson("/api/resource", { authorization: `Bearer ${token}` }))
            }
            disabled={!token}
          >
            Call resource
          </button>
          <button
            className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium hover:bg-rose-500"
            onClick={async () => setOut(await postJson("/api/auth/revoke", { token }))}
            disabled={!token}
          >
            Revoke token
          </button>
          <button
            className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
            onClick={async () => setOut(await getJson("/api/auth/stats"))}
          >
            Stats
          </button>
        </div>

        <div className="text-xs text-slate-400 break-all">
          token: <span className="font-mono">{token || "—"}</span>
        </div>

        <pre className="rounded-lg bg-slate-950/40 p-3 text-xs overflow-auto">{JSON.stringify(out, null, 2)}</pre>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Why this pattern exists</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Opaque tokens support revocation and introspection (at the cost of an auth dependency).</li>
          <li>Caching auth decisions reduces load and tail latency during spikes.</li>
          <li>Revocation and TTL require careful cache invalidation to avoid stale allows.</li>
        </ul>
      </section>
    </main>
  );
}

