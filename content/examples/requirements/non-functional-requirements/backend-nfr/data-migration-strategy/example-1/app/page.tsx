import { ReviewNote } from "../components/ReviewNote";
export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Data migration strategy</h1>
      <p className="mt-2 text-sm text-gray-300">
        Online schema migration with phased rollout and an idempotent backfill.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Endpoints</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-200">
          <li>
            <code>GET /api/migration/state</code> / <code>POST /api/migration/state</code>
          </li>
          <li>
            <code>POST /api/migration/backfill</code>
          </li>
          <li>
            <code>POST /api/users</code> / <code>GET /api/users?id=...</code>
          </li>
        </ul>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Try it</div>
        <pre className="mt-3 overflow-auto rounded-lg bg-black/40 p-4 text-xs">
{`curl -s http://localhost:3000/api/migration/state | jq

curl -s -X POST http://localhost:3000/api/users \\
  -H 'content-type: application/json' \\
  -d '{"email":"alice@example.com","fullName":"Alice Johnson"}' | jq

curl -s -X POST http://localhost:3000/api/migration/backfill \\
  -H 'content-type: application/json' \\
  -d '{"batchSize":50}' | jq`}
        </pre>
      </div>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether data migration strategy is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For data migration strategy, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For data migration strategy, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For data migration strategy, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Data Migration Strategy</div>
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

