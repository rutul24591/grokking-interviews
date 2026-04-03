import { ReviewNote } from "../components/ReviewNote";
export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Data retention &amp; archival</h1>
      <p className="mt-2 text-sm text-gray-300">
        Ingest events, apply retention policy (archive/delete), and protect some with legal holds.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Endpoints</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-200">
          <li>
            <code>POST /api/events/ingest</code>
          </li>
          <li>
            <code>GET /api/events/query?store=active|archive&amp;userId=...</code>
          </li>
          <li>
            <code>POST /api/retention/run</code>
          </li>
          <li>
            <code>POST /api/retention/hold</code>
          </li>
          <li>
            <code>GET /api/retention/policy</code>
          </li>
        </ul>
      </div>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether data retention archival is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For data retention archival, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For data retention archival, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For data retention archival, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Data Retention Archival</div>
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

