"use client";

import { useMemo, useState } from "react";

const features = [
  { name: "optional chaining", solveWith: "transpile", weight: 0 },
  { name: "Promise.any", solveWith: "polyfill", weight: 6 },
  { name: "fetch", solveWith: "polyfill-or-fallback", weight: 4 },
  { name: "Intl.Segmenter", solveWith: "polyfill-or-omit", weight: 8 },
] as const;

export function CompatibilityPlanner() {
  const [target, setTarget] = useState<"modern" | "broad">("broad");
  const [surface, setSurface] = useState<"reader" | "editor" | "analytics">("editor");

  const plan = useMemo(() => {
    const selected = features.filter((feature) => target === "broad" || feature.solveWith === "transpile");
    return {
      transpileCount: selected.filter((feature) => feature.solveWith === "transpile").length,
      polyfillCount: selected.filter((feature) => feature.solveWith !== "transpile").length,
      bundleCost: selected.reduce((sum, feature) => sum + feature.weight, 0),
      selected,
    };
  }, [target]);

  const routeImpact = useMemo(() => {
    if (surface === "reader") return "Favor smaller bundles and omit expensive optional polyfills.";
    if (surface === "editor") return "Keep authoring APIs consistent even if broader support needs targeted polyfills.";
    return "Load only analytics polyfills on demand to avoid penalizing critical rendering.";
  }, [surface]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Polyfills and transpilation</p>
            <h1 className="mt-2 text-3xl font-semibold">Compatibility build planner</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Separate syntax compatibility from runtime API compatibility, then estimate what broader browser
              support costs in polyfills and bundle weight.
            </p>
          </div>
          <select
            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3"
            value={target}
            onChange={(event) => setTarget(event.target.value as "modern" | "broad")}
          >
            <option value="modern">Modern baseline</option>
            <option value="broad">Broad support baseline</option>
          </select>
          <select
            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3"
            value={surface}
            onChange={(event) => setSurface(event.target.value as "reader" | "editor" | "analytics")}
          >
            <option value="reader">Reader route</option>
            <option value="editor">Editor route</option>
            <option value="analytics">Analytics route</option>
          </select>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-400">Transpile steps</p>
            <p className="mt-2 text-2xl font-semibold">{plan.transpileCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-400">Polyfill decisions</p>
            <p className="mt-2 text-2xl font-semibold">{plan.polyfillCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-400">Estimated bundle cost</p>
            <p className="mt-2 text-2xl font-semibold">+{plan.bundleCost} kb</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {plan.selected.map((feature) => (
            <article key={feature.name} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <h2 className="text-lg font-medium">{feature.name}</h2>
              <p className="mt-1 text-sm text-slate-400">Handled via: {feature.solveWith}</p>
            </article>
          ))}
        </div>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-medium">Route-level decision</h2>
            <p className="mt-3 text-sm text-slate-400">{routeImpact}</p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-medium">Build policy</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>Use transpilation for syntax, polyfills for runtime APIs.</li>
              <li>Prefer route-scoped loading when only a subset of surfaces need compatibility help.</li>
              <li>Re-measure bundle cost whenever support baselines expand.</li>
            </ul>
          </article>
        </section>
      </section>
    </main>
  );
}
