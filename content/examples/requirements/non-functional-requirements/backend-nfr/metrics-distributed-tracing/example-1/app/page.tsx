export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Metrics &amp; distributed tracing</h1>
      <p className="mt-2 text-sm text-gray-300">
        Call <code>/api/demo</code> and then query spans via <code>/api/traces</code>.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Try it</div>
        <pre className="mt-3 overflow-auto rounded-lg bg-black/40 p-4 text-xs">
{`curl -i -s http://localhost:3000/api/demo | sed -n '1,25p'
# Copy traceId from the JSON body, then:
curl -s 'http://localhost:3000/api/traces?traceId=...' | jq`}
        </pre>
      </div>
    </main>
  );
}

