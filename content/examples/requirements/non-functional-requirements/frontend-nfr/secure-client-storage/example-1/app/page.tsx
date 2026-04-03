import { ReviewNote } from "../components/ReviewNote";
import { AttackPanel } from "@/components/AttackPanel";
import { StorageDemo } from "@/components/StorageDemo";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Secure client storage — choose a safe boundary</h1>
        <p className="text-sm text-slate-300">
          This demo contrasts two approaches: an <strong>HttpOnly cookie session</strong> vs a{" "}
          <strong>JS-readable bearer token</strong> stored in localStorage.
        </p>
      </header>

      <StorageDemo />
      <AttackPanel />

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Production guidance</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Never store long-lived auth tokens in localStorage; assume XSS can read it.</li>
          <li>Use HttpOnly cookies for session auth; pair with CSRF protections (SameSite + tokens).</li>
          <li>Store only non-sensitive UX prefs client-side (theme, layout), not secrets.</li>
        </ul>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether secure client storage is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For secure client storage, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For secure client storage, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For secure client storage, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Secure Client Storage</div>
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

