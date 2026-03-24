"use client";

import { useState } from "react";

type Dashboard = {
  data: {
    profile: { userId: string; name: string } | null;
    feed: { items: Array<{ id: string; title: string }> } | null;
    billing: { plan: string; renewalDate: string } | null;
  };
  partial: boolean;
  errors: Array<{ service: string; error: string }>;
  policy: { timeoutMs: number };
};

export default function Page() {
  const [dash, setDash] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      if (!res.ok) throw new Error("bad response");
      setDash((await res.json()) as Dashboard);
    } catch {
      setError("Failed to load dashboard");
    }
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Facade Pattern: dashboard BFF</h1>
        <p className="text-sm text-white/70">
          UI calls one endpoint; facade aggregates multiple upstreams with shared resilience policies.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <button
          onClick={load}
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
        >
          Load dashboard
        </button>
        {error ? <div className="mt-3 rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-sm">{error}</div> : null}

        {dash ? (
          <div className="mt-4 space-y-4">
            {dash.partial ? (
              <div className="rounded-md border border-amber-400/30 bg-amber-500/10 p-3 text-sm">
                Partial response (timeout policy: <code>{dash.policy.timeoutMs}ms</code>).
              </div>
            ) : null}

            {dash.errors.length > 0 ? (
              <div className="rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-sm">
                {dash.errors.map((e) => (
                  <div key={e.service}>
                    <code>{e.service}</code>: {e.error}
                  </div>
                ))}
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-white/60">Profile</div>
                <div className="mt-2 text-sm">{dash.data.profile ? dash.data.profile.name : "—"}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 md:col-span-2">
                <div className="text-xs text-white/60">Feed</div>
                <div className="mt-2 grid gap-2">
                  {dash.data.feed ? (
                    dash.data.feed.items.map((i) => (
                      <div key={i.id} className="rounded bg-white/5 px-3 py-2 text-sm">
                        {i.title}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-white/60">—</div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-white/60">Billing</div>
              <div className="mt-2 text-sm">
                {dash.data.billing ? (
                  <>
                    Plan <code>{dash.data.billing.plan}</code>, renews <code>{dash.data.billing.renewalDate}</code>
                  </>
                ) : (
                  "—"
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm text-white/60">No data yet.</div>
        )}
      </section>
    </main>
  );
}

