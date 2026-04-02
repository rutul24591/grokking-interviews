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
    </main>
  );
}

