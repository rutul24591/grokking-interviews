"use client";
import { useEffect, useState } from "react";

type AssetRoute = {
  id: string;
  asset: string;
  cacheScope: "edge" | "regional" | "origin";
  ttlSeconds: number;
  status: "healthy" | "warmup" | "origin-fallback";
};

type DeliveryState = {
  servingRegion: string;
  failoverEnabled: boolean;
  routes: AssetRoute[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<DeliveryState | null>(null);

  async function refresh() {
    const response = await fetch("/api/cdn-delivery/state");
    setState((await response.json()) as DeliveryState);
  }

  async function updatePolicy(routeId: string, cacheScope: AssetRoute["cacheScope"]) {
    const response = await fetch("/api/cdn-delivery/policy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ routeId, cacheScope })
    });
    setState((await response.json()) as DeliveryState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">CDN Delivery</h1>
      <p className="mt-2 text-slate-300">Model how article pages and media assets should be routed between edge cache, regional cache, and origin fallback.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="rounded-lg border border-slate-800 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Serving region</div>
            <div className="mt-2 font-semibold text-slate-100">{state?.servingRegion}</div>
            <div className="mt-3 text-slate-400">Failover enabled: {String(state?.failoverEnabled)}</div>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.routes.map((route) => (
            <div key={route.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{route.asset}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">status: {route.status}</div>
                </div>
                <select value={route.cacheScope} onChange={(event) => void updatePolicy(route.id, event.target.value as AssetRoute["cacheScope"])} className="rounded border border-slate-700 bg-slate-950 px-3 py-2">
                  <option value="edge">edge</option>
                  <option value="regional">regional</option>
                  <option value="origin">origin</option>
                </select>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <div className="rounded border border-slate-800 px-3 py-2">TTL: {route.ttlSeconds}s</div>
                <div className="rounded border border-slate-800 px-3 py-2">Scope: {route.cacheScope}</div>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
