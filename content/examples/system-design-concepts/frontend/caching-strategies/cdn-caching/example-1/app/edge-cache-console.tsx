"use client";

import { useMemo, useState } from "react";

const entries = [
  {
    route: "/articles/system-design",
    browser: "public, max-age=60",
    edge: "public, s-maxage=600",
    surrogateKey: "articles",
    personalized: false,
  },
  {
    route: "/api/me",
    browser: "private, no-cache",
    edge: "bypass",
    surrogateKey: "user-profile",
    personalized: true,
  },
  {
    route: "/api/pricing",
    browser: "public, max-age=30",
    edge: "public, s-maxage=120",
    surrogateKey: "pricing",
    personalized: false,
  },
] as const;

export function EdgeCacheConsole() {
  const [selectedKey, setSelectedKey] = useState("articles");
  const [purgedKeys, setPurgedKeys] = useState<string[]>([]);
  const [environment, setEnvironment] = useState<"production" | "preview">("production");

  const visible = useMemo(
    () => entries.filter((entry) => !purgedKeys.includes(entry.surrogateKey)),
    [purgedKeys],
  );

  const selectedEntries = visible.filter((entry) => entry.surrogateKey === selectedKey);
  const purgeHistory = purgedKeys.length ? purgedKeys.join(", ") : "none";

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-violet-300">CDN caching</p>
            <h1 className="mt-2 text-3xl font-semibold">Edge cache operations console</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Review browser vs edge cache policy, identify personalized routes that must bypass shared caches, and
              simulate a surrogate-key purge.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3"
              value={selectedKey}
              onChange={(event) => setSelectedKey(event.target.value)}
            >
              <option value="articles">articles</option>
              <option value="pricing">pricing</option>
              <option value="user-profile">user-profile</option>
            </select>
            <button
              className="rounded-2xl bg-violet-400 px-4 py-3 font-medium text-slate-950"
              onClick={() => setPurgedKeys((keys) => (keys.includes(selectedKey) ? keys : [...keys, selectedKey]))}
            >
              Purge surrogate key
            </button>
            <select
              className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3"
              value={environment}
              onChange={(event) => setEnvironment(event.target.value as "production" | "preview")}
            >
              <option value="production">Production</option>
              <option value="preview">Preview</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            {visible.map((entry) => (
              <article key={entry.route} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <h2 className="text-lg font-medium">{entry.route}</h2>
                <p className="mt-2 text-sm text-slate-300">Browser: {entry.browser}</p>
                <p className="mt-1 text-sm text-slate-300">Edge: {entry.edge}</p>
                <p className="mt-1 text-sm text-slate-400">
                  Surrogate key: {entry.surrogateKey} · personalized: {String(entry.personalized)}
                </p>
              </article>
            ))}
          </div>

          <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-medium">Purge impact</h2>
            <p className="mt-3 text-sm text-slate-300">Environment: {environment}</p>
            <p className="mt-2 text-sm text-slate-300">Selected key: {selectedKey}</p>
            <p className="mt-2 text-sm text-slate-400">
              Matching routes: {selectedEntries.length ? selectedEntries.map((entry) => entry.route).join(", ") : "already purged"}
            </p>
            <p className="mt-2 text-sm text-slate-400">Purge history: {purgeHistory}</p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
              Never allow shared edge caching for personalized responses unless `Vary` and segmentation are explicit.
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
