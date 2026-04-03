import { ReviewNote } from "../components/ReviewNote";
import { AnalyticsDemo } from "@/components/AnalyticsDemo";
import { ConsentBanner } from "@/components/ConsentBanner";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Privacy & consent UX — enforce consent in code</h1>
        <p className="text-sm text-slate-300">
          The UI collects user preferences, but the critical part is enforcement: analytics calls are
          blocked unless the request has analytics consent.
        </p>
      </header>

      <AnalyticsDemo />

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Design trade-offs</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Keep consent choices reversible and easy to find (settings).</li>
          <li>Make consent deterministic for caching and experiments (cookie + version).</li>
          <li>Honor browser signals (DNT/GPC) and regional requirements.</li>
        </ul>
      </section>

      <ConsentBanner />
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether privacy consent ux is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For privacy consent ux, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For privacy consent ux, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For privacy consent ux, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Privacy Consent Ux</div>
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

