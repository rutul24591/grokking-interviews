export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Disaster recovery strategy</h1>
      <p className="mt-2 text-sm text-gray-300">
        Simulate snapshots, outages, and restores to understand RPO/RTO trade-offs.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Endpoints</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-200">
          <li>
            <code>POST /api/orders</code> / <code>GET /api/orders?id=...</code>
          </li>
          <li>
            <code>POST /api/dr/snapshot</code>
          </li>
          <li>
            <code>POST /api/dr/outage</code>
          </li>
          <li>
            <code>POST /api/dr/restore</code>
          </li>
          <li>
            <code>GET /api/dr/status</code>
          </li>
        </ul>
      </div>
    </main>
  );
}

