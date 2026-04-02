export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Server-side caching strategy</h1>
      <p className="mt-2 text-sm text-gray-300">
        Cache-aside with TTL and singleflight to prevent cache stampedes.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Try it</div>
        <pre className="mt-3 overflow-auto rounded-lg bg-black/40 p-4 text-xs">
{`curl -s 'http://localhost:3000/api/profile?userId=u1' | jq
curl -s 'http://localhost:3000/api/profile?userId=u1' | jq
curl -s -X POST http://localhost:3000/api/cache/flush | jq`}
        </pre>
      </div>
    </main>
  );
}

