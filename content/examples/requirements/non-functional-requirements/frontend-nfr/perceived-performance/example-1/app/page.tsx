import { ReviewNote } from "../components/ReviewNote";
import { SearchPanel } from "@/components/SearchPanel";

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Perceived performance — keep the UI “alive”</h1>
        <p className="text-sm text-slate-300">
          This demo uses three practical patterns: abort stale requests, show skeletons only when latency
          crosses a threshold (avoid flicker), and optimistic actions with rollback.
        </p>
      </header>

      <SearchPanel />

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Staff-level framing</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Perceived performance is an NFR: it influences retention and trust.</li>
          <li>Focus on responsiveness (input) and progress (skeleton/progress) before raw speed.</li>
          <li>Always make async operations cancelable; otherwise you’ll render stale data.</li>
        </ul>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether perceived performance is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For perceived performance, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For perceived performance, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For perceived performance, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Perceived Performance</div>
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

