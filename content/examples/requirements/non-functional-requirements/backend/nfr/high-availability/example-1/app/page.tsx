export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">High availability</h1>
      <p className="mt-2 text-sm text-gray-300">
        Two-node cluster with leader election. Fail the leader and elect a new one.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Endpoints</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-200">
          <li>
            <code>GET /api/cluster/state</code>
          </li>
          <li>
            <code>POST /api/cluster/fail</code> / <code>POST /api/cluster/elect</code>
          </li>
          <li>
            <code>POST /api/write</code> / <code>GET /api/read?key=...</code>
          </li>
        </ul>
      </div>
    </main>
  );
}

