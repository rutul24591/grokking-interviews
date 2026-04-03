"use client";

import { useState } from "react";

import { ReviewNote } from "../components/ReviewNote";

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
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether authentication infrastructure is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For authentication infrastructure, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For authentication infrastructure, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For authentication infrastructure, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Authentication Infrastructure</div>
          <p className="mt-2">
            Strong non-functional examples must go beyond toggles and raw JSON. They need a review layer that makes the
            operational contract visible: what is being protected, what degrades first, and what evidence an operator
            or reviewer should use before changing policy.
          </p>
        </div>
      </section>

</main>
  );
}

