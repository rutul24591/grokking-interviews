import { ReviewNote } from "../components/ReviewNote";
export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Consistency model</h1>
      <p className="mt-2 text-sm text-gray-300">
        Simulated leader/follower replication with delayed follower reads, plus session “read-your-writes”.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Endpoints</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-200">
          <li>
            <code>POST /api/kv/put</code> — write to leader (enqueues replication)
          </li>
          <li>
            <code>GET /api/kv/get?key=...&amp;read=follower</code> — read from follower (may be stale)
          </li>
          <li>
            <code>POST /api/kv/tick</code> — deliver pending replication (simulation)
          </li>
        </ul>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Try it</div>
        <pre className="mt-3 overflow-auto rounded-lg bg-black/40 p-4 text-xs">
{`curl -s -X POST http://localhost:3000/api/kv/put \\
  -H 'content-type: application/json' \\
  -d '{"key":"k","value":"v1","sessionId":"s1"}' | jq

curl -s 'http://localhost:3000/api/kv/get?key=k&read=follower&sessionId=s1&consistency=ryow' | jq

curl -s -X POST http://localhost:3000/api/kv/tick | jq
curl -s 'http://localhost:3000/api/kv/get?key=k&read=follower&sessionId=s1&consistency=ryow' | jq`}
        </pre>
      </div>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether consistency model is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For consistency model, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For consistency model, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For consistency model, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Consistency Model</div>
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

