"use client";

import { useEffect, useMemo, useState } from "react";
import { buildOutline, type OutlineSnapshot } from "@/lib/inspector";

export default function Page() {
  const [snapshot, setSnapshot] = useState<OutlineSnapshot | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setSnapshot(buildOutline(document));
  }, [tick]);

  const hasSnapshot = useMemo(() => Boolean(snapshot), [snapshot]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <main>
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Semantic outline inspector</h1>
          <p className="mt-2 text-slate-300">
            This page intentionally uses semantic elements. The inspector reads the DOM and builds an outline without
            className heuristics.
          </p>
        </header>

        <nav aria-label="Breadcrumb" className="text-sm text-slate-300">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a className="hover:underline" href="#content">
                Home
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-slate-100">
              Inspector
            </li>
          </ol>
        </nav>

        <article id="content" className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6">
          <header>
            <h2 className="text-xl font-semibold">Article container</h2>
            <p className="mt-2 text-slate-300">
              The inspector should detect <code>&lt;article&gt;</code>, headings, and nav landmarks.
            </p>
          </header>

          <section aria-labelledby="s1" className="mt-8">
            <h3 id="s1" className="text-lg font-semibold">
              Section 1
            </h3>
            <p className="mt-2 text-slate-200">A real section with a real heading.</p>
          </section>

          <aside className="mt-8 rounded-lg border border-white/10 bg-black/30 p-4">
            <h3 className="text-lg font-semibold">Aside</h3>
            <p className="mt-2 text-slate-300">Supporting content lives in an aside.</p>
          </aside>
        </article>

        <footer className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          <p>
            Tip: refactors that remove semantics won’t always break visuals, but they break navigation for assistive
            tech. Add semantic inspections in Storybook/Playwright to catch regressions.
          </p>
        </footer>
      </main>

      <aside className="space-y-4">
        <section className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-base font-semibold">Inspector</h2>
          <p className="mt-2 text-sm text-slate-300">
            Click refresh after editing the markup to see how semantics change the extracted outline.
          </p>
          <button
            type="button"
            onClick={() => setTick((t) => t + 1)}
            className="mt-4 w-full rounded-md bg-indigo-500/20 px-3 py-2 text-sm font-semibold hover:bg-indigo-500/30"
          >
            Refresh snapshot
          </button>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Headings</h2>
          {!hasSnapshot ? (
            <p className="mt-2">Loading…</p>
          ) : (
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              {snapshot!.headings.map((h) => (
                <li key={h.selector}>
                  <span className="text-slate-100">{h.tag.toUpperCase()}</span> — {h.text}
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Landmarks</h2>
          {!hasSnapshot ? (
            <p className="mt-2">Loading…</p>
          ) : (
            <ul className="mt-3 list-disc space-y-2 pl-5">
              {snapshot!.landmarks.map((l) => (
                <li key={l.selector}>
                  <span className="text-slate-100">{l.tag}</span>
                  {l.label ? ` (${l.label})` : ""} — {l.selector}
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
    </div>
  );
}

