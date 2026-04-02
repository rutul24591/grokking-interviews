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
    </main>
  );
}

