export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Cost optimization</h1>
      <p className="mt-2 text-sm text-gray-300">
        A small cost model that highlights common levers: cache hit rate, payload size, and reserved discounts.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Endpoint</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-200">
          <li>
            <code>POST /api/cost/estimate</code> — returns a breakdown + guardrail status
          </li>
        </ul>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Try it</div>
        <pre className="mt-3 overflow-auto rounded-lg bg-black/40 p-4 text-xs">
{`curl -s -X POST http://localhost:3000/api/cost/estimate \\
  -H 'content-type: application/json' \\
  -d '{
    "monthlyRequests": 20000000,
    "avgResponseKb": 18,
    "cacheHitRate": 0.65,
    "originComputeUsdPerMillion": 0.35,
    "reservedDiscount": 0.20,
    "cdnEgressUsdPerGb": 0.08,
    "storageGb": 500,
    "storageUsdPerGbMonth": 0.023,
    "budgetUsd": 4000
  }' | jq`}
        </pre>
      </div>
    </main>
  );
}

