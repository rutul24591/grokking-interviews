import { ReviewNote } from "../components/ReviewNote";
import { Explorer } from "@/components/Explorer";

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">State management strategy — local vs URL vs global vs server</h1>
        <p className="text-sm text-slate-300">
          Demonstrates a practical partition: URL state for filters, global persisted UI preferences, and
          server state fetched from an API.
        </p>
      </header>
      <Explorer />
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether state management strategy is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For state management strategy, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For state management strategy, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For state management strategy, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for State Management Strategy</div>
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
            Use this rubric to judge whether state management strategy is ready for production review. The point is not simply to see a
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
            detail="For state management strategy, verify that the UI exposes the one or two signals an operator would trust first when deciding whether the system is healthy."
          />
          <ReviewNote
            title="Safe fallback"
            detail="For state management strategy, validate that the fallback path is explicit, bounded, and consistent with the business priority rather than an accidental side effect."
          />
          <ReviewNote
            title="Review evidence"
            detail="For state management strategy, confirm that the output is detailed enough for another engineer to audit the behavior without re-running the scenario from scratch."
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
            <div className="font-semibold text-white">Why this matters for State Management Strategy</div>
            <p className="mt-3">
              These checks push the example beyond a static demo. They turn it into a review artifact that teaches the
              production contract, the recovery posture, and the evidence needed to defend the design under scrutiny.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white">State partition checklist</h2>
        <p className="text-sm text-slate-400">
          Review the partition line before every new feature. Route state belongs in the URL when it must survive
          refresh or sharing, UI chrome belongs in local preference stores, and server state belongs in fetch caches
          with explicit invalidation rules.
        </p>
        <p className="text-sm text-slate-400">
          This separation is what keeps a frontend from turning into one opaque global store that is impossible to
          debug, reason about, or migrate safely as the application grows.
        </p>
        <p className="text-sm text-slate-400">
          It also gives teams a stable migration path when requirements change: move one slice of state at a time
          instead of rewriting every component that accidentally depended on a monolithic store.
        </p>
        <p className="text-sm text-slate-400">
          The test for a good strategy is simple: a new piece of state should have one obvious home, one obvious owner,
          and one obvious invalidation path.
        </p>
        <p className="text-sm text-slate-400">That clarity is what keeps debugging and ownership tractable at scale.</p>
      </section>

</main>
  );
}
