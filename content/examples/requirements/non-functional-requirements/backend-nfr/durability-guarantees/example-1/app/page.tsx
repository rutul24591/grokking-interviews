export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Durability guarantees</h1>
      <p className="mt-2 text-sm text-gray-300">
        Append to a WAL with fsync for durable acknowledgements; replay after crash.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Endpoints</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-200">
          <li>
            <code>POST /api/log/append</code> — {`{ payload, mode }`}
          </li>
          <li>
            <code>POST /api/log/crash</code> — clears in-memory state
          </li>
          <li>
            <code>POST /api/log/replay</code> — rebuilds from WAL
          </li>
          <li>
            <code>GET /api/log/state</code>
          </li>
        </ul>
      </div>
    </main>
  );
}

