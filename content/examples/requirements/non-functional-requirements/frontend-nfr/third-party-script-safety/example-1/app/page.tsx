import { ReviewNote } from "../components/ReviewNote";
import { SandboxWidget } from "@/components/SandboxWidget";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Third-party script safety — sandbox + validation</h1>
        <p className="text-sm text-slate-300">
          Third-party code is a supply-chain risk and a reliability risk. Prefer isolation (sandboxed
          iframe) and validate any messages crossing the boundary.
        </p>
      </header>

      <SandboxWidget />

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Production checklist</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Use CSP to restrict where scripts can load from.</li>
          <li>Prefer sandboxed iframes for untrusted widgets.</li>
          <li>Validate `postMessage` payloads and treat the boundary as untrusted input.</li>
        </ul>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether third party script safety is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For third party script safety, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For third party script safety, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For third party script safety, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Third Party Script Safety</div>
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

