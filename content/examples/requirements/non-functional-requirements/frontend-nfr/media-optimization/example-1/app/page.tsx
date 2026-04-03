"use client";

import { useEffect, useMemo, useState } from "react";

import { ReviewNote } from "../components/ReviewNote";

function dpr() {
  if (typeof window === "undefined") return 1;
  return Math.min(3, Math.max(1, window.devicePixelRatio || 1));
}

export default function Page() {
  const [containerW, setContainerW] = useState(768);
  const pixelRatio = useMemo(() => dpr(), []);

  useEffect(() => {
    const onResize = () => {
      const w = Math.min(1024, Math.max(320, window.innerWidth - 72));
      setContainerW(w);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const url = `/api/media/hero?w=${containerW}&dpr=${pixelRatio}`;

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Media Optimization — variant picking + caching</h1>
        <p className="text-sm text-slate-300">
          Demonstrates three levers that matter in production:{" "}
          <strong>responsive variants</strong>, <strong>client DPR</strong>, and{" "}
          <strong>immutable caching with ETag</strong>.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
        <div className="text-sm text-slate-300">
          Container width: <span className="font-mono">{containerW}px</span> • DPR:{" "}
          <span className="font-mono">{pixelRatio}x</span>
        </div>
        <img
          src={url}
          width={containerW}
          height={Math.round(containerW * 0.6)}
          loading="lazy"
          decoding="async"
          className="rounded-xl border border-slate-700 bg-slate-950/40"
          alt="Optimized hero variant"
        />
        <div className="text-xs text-slate-400 break-all">
          Served by <code className="rounded bg-slate-800 px-1">/api/media/hero</code>: {url}
        </div>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Production checklist</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>
            Generate width buckets (320/480/768/1024/1200) and include DPR for crispness without waste.
          </li>
          <li>
            Use CDN cacheability: <code className="rounded bg-slate-800 px-1">immutable</code> + stable
            asset keys (content hash).
          </li>
          <li>
            Prefer modern formats (AVIF/WebP) and only fall back when needed; keep a strict image budget.
          </li>
        </ul>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether media optimization is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For media optimization, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For media optimization, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For media optimization, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Media Optimization</div>
          <p className="mt-2">
            Strong non-functional examples must go beyond toggles and raw JSON. They need a review layer that makes the
            operational contract visible: what is being protected, what degrades first, and what evidence an operator
            or reviewer should use before changing policy.
          </p>
        </div>
      </section>


      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Decision rubric</h2>
          <p className="mt-1 text-sm text-slate-400">
            Use this rubric to judge whether media optimization is ready for production review. The point is not simply to see a
            successful response, but to confirm the example explains the operational tradeoffs that senior engineers
            would debate during design review, rollout approval, or incident response.
          </p>
          <p className="mt-3 text-sm text-slate-400">
            A strong non-functional example should make the protection boundary, the degraded path, and the operator's
            next safe action obvious. If those three things are hidden, the workflow is still too shallow.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Primary signal"
            detail="For media optimization, verify that the UI exposes the one or two signals an operator would trust first when deciding whether the system is healthy."
          />
          <ReviewNote
            title="Safe fallback"
            detail="For media optimization, validate that the fallback path is explicit, bounded, and consistent with the business priority rather than an accidental side effect."
          />
          <ReviewNote
            title="Review evidence"
            detail="For media optimization, confirm that the output is detailed enough for another engineer to audit the behavior without re-running the scenario from scratch."
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
            <div className="font-semibold text-white">Questions to ask in review</div>
            <ul className="mt-3 space-y-2 text-slate-400">
              <li>• What fails first when demand, latency, or invalid input spikes?</li>
              <li>• Which state transitions are safe to retry and which require human intervention?</li>
              <li>• How does the operator know the fallback reduced risk instead of hiding it?</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
            <div className="font-semibold text-white">Why this matters for Media Optimization</div>
            <p className="mt-3">
              These checks push the example beyond a static demo. They turn it into a review artifact that teaches the
              production contract, the recovery posture, and the evidence needed to defend the design under scrutiny.
            </p>
          </div>
        </div>
      </section>

</main>
  );
}

