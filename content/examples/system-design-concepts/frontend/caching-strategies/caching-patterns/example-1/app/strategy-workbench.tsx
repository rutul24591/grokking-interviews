"use client";

import { useMemo, useState } from "react";

const rows = [
  { resource: "Fonts and icons", strategy: "cache-first", latencyMs: 20, freshness: "low risk" },
  { resource: "Product API", strategy: "network-first", latencyMs: 220, freshness: "high" },
  { resource: "Auth POST", strategy: "network-only", latencyMs: 180, freshness: "must be exact" },
  { resource: "JS bundle", strategy: "stale-while-revalidate", latencyMs: 30, freshness: "background refresh" },
] as const;

export function StrategyWorkbench() {
  const [offline, setOffline] = useState(false);
  const [selected, setSelected] = useState<(typeof rows)[number]["resource"]>("Product API");
  const [traffic, setTraffic] = useState<"steady" | "burst">("steady");

  const current = useMemo(() => rows.find((row) => row.resource === selected) ?? rows[0], [selected]);
  const outcome = useMemo(() => {
    if (!offline && traffic === "steady") return "Network available: selected strategy behaves normally.";
    if (!offline && traffic === "burst") return "Traffic burst: strategy must absorb repeated reads without hammering origin.";
    if (current.strategy === "network-only") return "Offline failure: this resource correctly avoids cached replay.";
    if (current.strategy === "network-first") return "Falls back to cache if a previous response exists.";
    return "Serves cached response immediately.";
  }, [current, offline, traffic]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Caching patterns</p>
            <h1 className="mt-2 text-3xl font-semibold">Strategy workbench</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Evaluate which caching strategy belongs to which resource class, then test the user-visible outcome
              under online and offline conditions.
            </p>
          </div>
          <button
            className={`rounded-2xl px-4 py-3 ${offline ? "bg-emerald-400 font-medium text-slate-950" : "border border-slate-700"}`}
            onClick={() => setOffline((value) => !value)}
          >
            {offline ? "Offline mode" : "Online mode"}
          </button>
          <select
            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3"
            value={traffic}
            onChange={(event) => setTraffic(event.target.value as "steady" | "burst")}
          >
            <option value="steady">Steady traffic</option>
            <option value="burst">Burst traffic</option>
          </select>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            {rows.map((row) => (
              <button
                key={row.resource}
                className={`block w-full rounded-2xl border p-4 text-left ${selected === row.resource ? "border-emerald-400 bg-emerald-500/10" : "border-slate-800 bg-slate-900/60"}`}
                onClick={() => setSelected(row.resource)}
              >
                <h2 className="text-lg font-medium">{row.resource}</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {row.strategy} · latency {row.latencyMs}ms · freshness {row.freshness}
                </p>
              </button>
            ))}
          </div>

          <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-medium">{current.resource}</h2>
            <p className="mt-2 text-sm text-slate-300">Selected strategy: {current.strategy}</p>
            <p className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">{outcome}</p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
              Recommended under {traffic} traffic:{" "}
              {current.strategy === "network-only"
                ? "protect writes and auth from stale replay"
                : current.strategy === "network-first"
                  ? "favor freshness with controlled fallback"
                  : current.strategy === "cache-first"
                    ? "minimize repeated latency for stable assets"
                    : "mix instant reads with background freshness"}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
