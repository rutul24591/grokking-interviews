export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Fault tolerance &amp; resilience</h1>
      <p className="mt-2 text-sm text-gray-300">
        Configure a dependency to fail deterministically; observe retries, breaker, and fallback.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Endpoints</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-200">
          <li>
            <code>POST /api/dependency/config</code> — set failure mode
          </li>
          <li>
            <code>GET /api/service</code> — calls dependency through resilience layer
          </li>
        </ul>
      </div>
    </main>
  );
}

