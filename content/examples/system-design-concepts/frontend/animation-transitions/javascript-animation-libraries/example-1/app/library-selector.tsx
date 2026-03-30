"use client";

import { useMemo, useState } from "react";

const libraries = {
  framer: {
    fit: "React component motion",
    cost: "medium",
    note: "Best when animation state is tightly coupled to React state.",
    strengths: ["layout-aware React transitions", "component variants", "gesture hooks"],
  },
  gsap: {
    fit: "Timeline orchestration",
    cost: "higher",
    note: "Strongest for complex sequences and non-React surfaces.",
    strengths: ["timeline composition", "sequencing and labels", "non-React DOM control"],
  },
  motionOne: {
    fit: "Lightweight imperative motion",
    cost: "lower",
    note: "Good when bundle size matters and WAAPI is acceptable.",
    strengths: ["small footprint", "WAAPI-friendly primitives", "simple imperative control"],
  },
} as const;

export function LibrarySelector() {
  const [priority, setPriority] = useState<keyof typeof libraries>("framer");
  const [surface, setSurface] = useState<"feed" | "editor" | "marketing">("editor");
  const [bundleBudget, setBundleBudget] = useState<"tight" | "moderate" | "flexible">("moderate");
  const decision = useMemo(() => libraries[priority], [priority]);
  const rolloutGuidance = useMemo(() => {
    if (priority === "gsap") {
      return surface === "marketing"
        ? "Use GSAP for high-control landing page sequences where motion itself is part of the product."
        : "Keep GSAP isolated to the surfaces that truly need timeline control.";
    }
    if (priority === "motionOne") {
      return bundleBudget === "tight"
        ? "Prefer Motion One when bundle budget is tight and you can rely on WAAPI-compatible browsers."
        : "Use Motion One for lighter imperative motion where React-specific abstraction is unnecessary.";
    }
    return "Use Framer-style declarative motion when UI state and animation state evolve together inside React.";
  }, [bundleBudget, priority, surface]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-sky-300">JavaScript animation libraries</p>
            <h1 className="mt-2 text-3xl font-semibold">Library decision console</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">Choose a motion strategy based on orchestration depth, React coupling, and bundle sensitivity instead of picking a library by habit.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" value={priority} onChange={(event) => setPriority(event.target.value as keyof typeof libraries)}>
              <option value="framer">React-heavy product surface</option>
              <option value="gsap">Complex timeline-heavy surface</option>
              <option value="motionOne">Bundle-sensitive surface</option>
            </select>
            <select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" value={surface} onChange={(event) => setSurface(event.target.value as "feed" | "editor" | "marketing")}>
              <option value="feed">Article feed</option>
              <option value="editor">Authoring editor</option>
              <option value="marketing">Marketing landing page</option>
            </select>
            <select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" value={bundleBudget} onChange={(event) => setBundleBudget(event.target.value as "tight" | "moderate" | "flexible")}>
              <option value="tight">Tight budget</option>
              <option value="moderate">Moderate budget</option>
              <option value="flexible">Flexible budget</option>
            </select>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            {Object.entries(libraries).map(([name, value]) => (
              <article key={name} className={`rounded-2xl border p-4 ${priority === name ? "border-sky-400 bg-sky-500/10" : "border-slate-800 bg-slate-900/60"}`}>
                <h2 className="text-lg font-medium uppercase">{name}</h2>
                <p className="mt-2 text-sm text-slate-300">fit={value.fit} · bundle cost={value.cost}</p>
                <p className="mt-2 text-sm text-slate-400">{value.note}</p>
                <ul className="mt-3 space-y-1 text-sm text-slate-300">
                  {value.strengths.map((strength) => (
                    <li key={strength}>- {strength}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <aside className="space-y-4">
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <h2 className="text-lg font-medium">Selected recommendation</h2>
              <p className="mt-3 text-sm text-slate-300">{decision.fit}</p>
              <p className="mt-2 text-sm text-slate-400">{decision.note}</p>
            </section>
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <h2 className="text-lg font-medium">Rollout guidance</h2>
              <p className="mt-3 text-sm text-slate-300">surface={surface} · bundle budget={bundleBudget}</p>
              <p className="mt-2 text-sm text-slate-400">{rolloutGuidance}</p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
