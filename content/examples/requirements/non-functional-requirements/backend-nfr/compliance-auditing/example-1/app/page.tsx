import { ReviewNote } from "../components/ReviewNote";
export default async function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Compliance auditing</h1>
      <p className="mt-2 text-sm text-gray-300">
        This example exposes an append-only audit log with a hash chain for tamper evidence.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Endpoints</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-200">
          <li>
            <code>POST /api/admin/users</code> — create a user (writes audit event)
          </li>
          <li>
            <code>POST /api/admin/roles</code> — change role (writes audit event)
          </li>
          <li>
            <code>GET /api/audit</code> — list audit events
          </li>
          <li>
            <code>GET /api/audit/verify</code> — verify chain integrity
          </li>
        </ul>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Try it</div>
        <pre className="mt-3 overflow-auto rounded-lg bg-black/40 p-4 text-xs">
{`curl -s -X POST http://localhost:3000/api/admin/users \\
  -H 'content-type: application/json' \\
  -H 'x-actor-id: admin-1' \\
  -d '{"email":"alice@example.com","role":"viewer"}' | jq

curl -s http://localhost:3000/api/audit/verify | jq`}
        </pre>
      </div>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether compliance auditing is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For compliance auditing, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For compliance auditing, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For compliance auditing, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Compliance Auditing</div>
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

