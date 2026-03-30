"use client";

import { useMemo, useState } from "react";

const profiles = {
  modern: {
    browser: "Modern evergreen",
    features: ["ES modules", "fetch", "IntersectionObserver"],
    support: "full",
    fallback: "No fallback path required.",
  },
  enterprise: {
    browser: "Older enterprise browser",
    features: ["fetch"],
    support: "reduced",
    fallback: "Disable live previews, use server pagination, and drop enhanced animation.",
  },
  obsolete: {
    browser: "Obsolete browser",
    features: [],
    support: "unsupported",
    fallback: "Show upgrade notice and block access to the authoring flow.",
  },
} as const;

export function LegacySupportConsole() {
  const [profile, setProfile] = useState<keyof typeof profiles>("enterprise");
  const [surface, setSurface] = useState<"reader" | "editor" | "checkout">("editor");

  const recommendation = useMemo(() => {
    const current = profiles[profile];
    if (current.support === "full") return "Ship the full experience.";
    if (current.support === "reduced") return "Serve a reduced mode with fewer enhanced features.";
    return "Show an unsupported-browser message and link to upgrade guidance.";
  }, [profile]);

  const current = profiles[profile];
  const impact = useMemo(() => {
    if (surface === "reader") return current.support === "unsupported" ? "critical" : "moderate";
    if (surface === "editor") return current.support === "full" ? "moderate" : "high";
    return current.support === "unsupported" ? "critical" : "high";
  }, [current.support, surface]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-rose-300">Legacy browser support</p>
            <h1 className="mt-2 text-3xl font-semibold">Support policy console</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Decide whether a browser gets full support, reduced support, or a hard block based on missing
              capabilities and the cost of keeping fallback paths alive.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3"
              value={profile}
              onChange={(event) => setProfile(event.target.value as keyof typeof profiles)}
            >
              <option value="modern">Modern evergreen</option>
              <option value="enterprise">Older enterprise browser</option>
              <option value="obsolete">Obsolete browser</option>
            </select>
            <select
              className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3"
              value={surface}
              onChange={(event) => setSurface(event.target.value as "reader" | "editor" | "checkout")}
            >
              <option value="reader">Reader journey</option>
              <option value="editor">Editor journey</option>
              <option value="checkout">Checkout journey</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-medium">{current.browser}</h2>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">Detected capabilities</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {current.features.length ? current.features.map((feature) => <li key={feature}>{feature}</li>) : <li>Missing critical APIs</li>}
            </ul>
          </aside>

          <div className="space-y-4">
            <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Assigned tier</p>
              <p className="mt-2 text-2xl font-semibold capitalize">{current.support}</p>
              <p className="mt-3 text-sm text-slate-400">{recommendation}</p>
            </article>
            <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Surface impact</p>
              <p className="mt-2 text-2xl font-semibold capitalize">{impact}</p>
              <p className="mt-3 text-sm text-slate-400">{current.fallback}</p>
            </article>
            <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              Keep this decision explicit in product policy. “Reduced support” should mean concrete fallback
              behavior, not accidental breakage.
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
