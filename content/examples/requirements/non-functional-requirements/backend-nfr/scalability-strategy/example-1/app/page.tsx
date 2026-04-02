export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Scalability strategy</h1>
      <p className="mt-2 text-sm text-gray-300">
        Resize a shard set and see how many keys move under rendezvous hashing.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Endpoints</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-200">
          <li>
            <code>POST /api/cluster/resize</code> — set shard count
          </li>
          <li>
            <code>POST /api/cluster/assign</code> — assign keys, report movement
          </li>
          <li>
            <code>GET /api/cluster/state</code>
          </li>
        </ul>
      </div>
    </main>
  );
}

