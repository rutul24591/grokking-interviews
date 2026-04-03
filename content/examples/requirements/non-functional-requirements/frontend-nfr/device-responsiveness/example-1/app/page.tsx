"use client";

import { useEffect, useMemo, useState } from "react";

import { ReviewNote } from "../components/ReviewNote";

type Policy = {
  variant: "mobile" | "tablet" | "desktop";
  columns: number;
  touchTargetPx: number;
  imageQuality: number;
  reducedMotion: boolean;
};

async function json<T>(input: RequestInfo | URL): Promise<T> {
  const res = await fetch(input, { headers: { "Content-Type": "application/json" } });
  const text = await res.text();
  if (!res.ok) throw new Error(res.status + " " + res.statusText);
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export default function Page() {
  const [width, setWidth] = useState<number>(375);
  const [dpr, setDpr] = useState<number>(2);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [error, setError] = useState("");

  async function refresh(next?: { width?: number; dpr?: number; reducedMotion?: boolean }) {
    const w = next?.width ?? width;
    const dp = next?.dpr ?? dpr;
    const rm = next?.reducedMotion ?? reducedMotion;
    const r = await json<{ policy: Policy }>(`/api/policy?width=${w}&dpr=${dp}&reducedMotion=${rm}`);
    setPolicy(r.policy);
  }

  useEffect(() => {
    const w = window.innerWidth;
    setWidth(w);
    setDpr(window.devicePixelRatio || 1);
    const rm = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    setReducedMotion(rm);
    refresh({ width: w, dpr: window.devicePixelRatio || 1, reducedMotion: rm }).catch((e) =>
      setError(e instanceof Error ? e.message : String(e)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const previewStyle = useMemo(() => {
    const cols = policy?.columns ?? 1;
    return { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` } as const;
  }, [policy]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Responsive Policy Lab</h1>
        <p className="mt-2 text-slate-300">
          Device responsiveness works best when you define explicit policies (variants, columns, touch targets), not
          ad-hoc CSS tweaks.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</div>
        ) : null}
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="grid gap-1 text-sm">
            <span className="text-slate-300">Width (px)</span>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="rounded border border-slate-700 bg-black/30 px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-slate-300">DPR</span>
            <input
              type="number"
              step="0.25"
              value={dpr}
              onChange={(e) => setDpr(Number(e.target.value))}
              className="rounded border border-slate-700 bg-black/30 px-3 py-2"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
            />
            Reduced motion
          </label>
        </div>
        <button
          type="button"
          onClick={() => refresh()}
          className="mt-4 rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
        >
          Evaluate policy
        </button>
        <pre className="mt-4 overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">
          {JSON.stringify(policy, null, 2)}
        </pre>
      </section>

      <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <h2 className="text-lg font-semibold">Preview grid</h2>
        <div className="mt-4 grid gap-3" style={previewStyle}>
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="rounded border border-slate-800 bg-black/20 p-4">
              <div className="text-sm font-semibold">Card {i + 1}</div>
              <div className="mt-2 text-xs text-slate-400">
                Touch target ≥ {policy?.touchTargetPx ?? 44}px • img quality {policy?.imageQuality ?? 60}
              </div>
            </div>
          ))}
        </div>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether device responsiveness is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For device responsiveness, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For device responsiveness, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For device responsiveness, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Device Responsiveness</div>
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

