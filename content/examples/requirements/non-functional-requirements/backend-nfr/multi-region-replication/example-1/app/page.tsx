export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Multi-region replication</h1>
      <p className="mt-2 text-sm text-gray-300">
        Write in one region, read in another. Use session consistency to avoid reading older data.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Try it</div>
        <pre className="mt-3 overflow-auto rounded-lg bg-black/40 p-4 text-xs">
{`curl -s -X POST http://localhost:3000/api/kv/put \\
  -H 'content-type: application/json' \\
  -d '{"region":"us-east","key":"k","value":"v1","sessionId":"s1"}' | jq

curl -s 'http://localhost:3000/api/kv/get?region=eu-west&key=k&consistency=session&sessionId=s1' | jq

curl -s -X POST http://localhost:3000/api/replication/tick | jq
curl -s 'http://localhost:3000/api/kv/get?region=eu-west&key=k&consistency=session&sessionId=s1' | jq`}
        </pre>
      </div>
    </main>
  );
}

