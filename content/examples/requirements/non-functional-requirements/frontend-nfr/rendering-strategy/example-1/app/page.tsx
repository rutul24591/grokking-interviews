import { ReviewNote } from "../components/ReviewNote";
import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Rendering strategy — SSR vs CSR vs ISR/Static</h1>
        <p className="text-sm text-slate-300">
          This demo shows the practical differences in what gets rendered on the server vs fetched on
          the client, and how caching changes the trade-offs.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
        <h2 className="font-medium">Try modes</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Mode href="/ssr" label="SSR (no-store)" />
          <Mode href="/csr" label="CSR (client fetch)" />
          <Mode href="/static" label="Static-like (cacheable)" />
          <Mode href="/isr" label="ISR-like (revalidate)" />
        </div>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Rule of thumb</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Use SSR for personalized or auth-gated content (can’t be shared via CDN cache).</li>
          <li>Use static/ISR when many users share content and freshness tolerates seconds/minutes.</li>
          <li>Use CSR for highly interactive views, but budget the hydration and avoid waterfalls.</li>
        </ul>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether rendering strategy is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For rendering strategy, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For rendering strategy, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For rendering strategy, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Rendering Strategy</div>
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

function Mode({ href, label }: { href: string; label: string }) {
  return (
    <Link className="rounded-lg bg-slate-700 px-3 py-2 font-medium hover:bg-slate-600" href={href}>
      {label}
    </Link>
  );
}

