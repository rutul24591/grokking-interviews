export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Event replayability</h1>
      <p className="mt-2 text-sm text-gray-300">
        Append events, read by offset, commit checkpoints, and reset to replay.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Endpoints</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-200">
          <li>
            <code>POST /api/events/append</code>
          </li>
          <li>
            <code>GET /api/events/read?from=0&amp;limit=10</code>
          </li>
          <li>
            <code>POST /api/consumer/commit</code> / <code>POST /api/consumer/reset</code>
          </li>
        </ul>
      </div>
    </main>
  );
}

