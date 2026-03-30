"use client";

import { useMemo, useState } from "react";

const browsers = {
  modern: ["Chrome 123", "Safari 17", "Firefox 124"],
  broad: ["Chrome 109", "Safari 15.6", "Firefox 115 ESR"],
} as const;

const cssRows = [
  {
    declaration: "line-clamp: 2;",
    prefix: "-webkit-line-clamp: 2;",
    reason: "Still required for multi-line clamp support in WebKit-based browsers.",
  },
  {
    declaration: "display: grid;",
    prefix: "none",
    reason: "Current support baseline does not require vendor prefixes.",
  },
  {
    declaration: "backdrop-filter: blur(10px);",
    prefix: "-webkit-backdrop-filter: blur(10px);",
    reason: "WebKit-derived browsers still expect the prefixed variant in some support ranges.",
  },
] as const;

export function PrefixPlanner() {
  const [target, setTarget] = useState<keyof typeof browsers>("broad");
  const [showOnlyPrefixed, setShowOnlyPrefixed] = useState(false);
  const [buildMode, setBuildMode] = useState<"autoprefixer" | "manual">("autoprefixer");

  const visibleRows = useMemo(
    () => cssRows.filter((row) => !showOnlyPrefixed || row.prefix !== "none"),
    [showOnlyPrefixed],
  );

  const riskCount = visibleRows.filter((row) => row.prefix !== "none" && buildMode === "manual").length;

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-violet-300">CSS vendor prefixes</p>
            <h1 className="mt-2 text-3xl font-semibold">Prefix planning workstation</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Choose a browser support target and review which declarations still need prefixed output, plus
              why those prefixes should come from tooling instead of manual CSS drift.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3"
              value={target}
              onChange={(event) => setTarget(event.target.value as keyof typeof browsers)}
            >
              <option value="modern">Modern baseline</option>
              <option value="broad">Broader compatibility</option>
            </select>
            <button
              className={`rounded-2xl px-4 py-3 ${showOnlyPrefixed ? "bg-violet-400 font-medium text-slate-950" : "border border-slate-700"}`}
              onClick={() => setShowOnlyPrefixed((value) => !value)}
            >
              {showOnlyPrefixed ? "Only prefixed" : "Show all rules"}
            </button>
            <select
              className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3"
              value={buildMode}
              onChange={(event) => setBuildMode(event.target.value as "autoprefixer" | "manual")}
            >
              <option value="autoprefixer">Autoprefixer build</option>
              <option value="manual">Manual prefixes</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            Target browsers: {browsers[target].join(", ")}
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            Build mode: {buildMode === "autoprefixer" ? "tool-managed prefixes" : "manual CSS maintenance"} ·
            prefix risk count: {riskCount}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {visibleRows.map((row) => (
            <article key={row.declaration} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Authoring intent</p>
                  <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-200">{row.declaration}</pre>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Build output</p>
                  <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-200">
                    {row.prefix === "none" ? row.declaration : `${row.prefix}\n${row.declaration}`}
                  </pre>
                  <p className="mt-3 text-sm text-slate-400">{row.reason}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-medium">Release checklist</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>Keep the support baseline in one browserslist target.</li>
              <li>Do not hand-write prefixes that the build tool should own.</li>
              <li>Re-test visual regressions whenever target coverage changes.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-medium">Build warning</h2>
            <p className="mt-3 text-sm text-slate-400">
              Manual prefixing creates drift between authored CSS and generated output. Use tooling for consistency,
              and reserve explicit overrides for verified engine-specific bugs.
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}
