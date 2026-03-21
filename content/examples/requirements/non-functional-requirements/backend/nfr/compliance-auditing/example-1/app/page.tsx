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
    </main>
  );
}

