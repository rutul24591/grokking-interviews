export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Idempotency guarantees</h1>
      <p className="mt-2 text-sm text-gray-300">
        POST <code>/api/payments/charge</code> with the same Idempotency-Key should not double-charge.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Try it</div>
        <pre className="mt-3 overflow-auto rounded-lg bg-black/40 p-4 text-xs">
{`curl -s -X POST http://localhost:3000/api/payments/charge \\
  -H 'content-type: application/json' \\
  -H 'idempotency-key: idem-123' \\
  -d '{"customerId":"c1","amountUsd":12.5,"currency":"USD"}' | jq

curl -s -X POST http://localhost:3000/api/payments/charge \\
  -H 'content-type: application/json' \\
  -H 'idempotency-key: idem-123' \\
  -d '{"customerId":"c1","amountUsd":12.5,"currency":"USD"}' | jq`}
        </pre>
      </div>
    </main>
  );
}

