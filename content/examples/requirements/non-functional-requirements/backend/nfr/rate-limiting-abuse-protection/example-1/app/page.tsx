export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Rate limiting &amp; abuse protection</h1>
      <p className="mt-2 text-sm text-gray-300">
        Call <code>/api/protected</code> repeatedly to see token bucket rate limiting and 429 behavior.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Try it</div>
        <pre className="mt-3 overflow-auto rounded-lg bg-black/40 p-4 text-xs">
{`for i in $(seq 1 25); do
  curl -s -o /dev/null -w "%{http_code}\\n" \\
    -H "x-api-key: demo" \\
    http://localhost:3000/api/protected;
done`}
        </pre>
      </div>
    </main>
  );
}

