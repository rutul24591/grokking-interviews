export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Data retention &amp; archival</h1>
      <p className="mt-2 text-sm text-gray-300">
        Ingest events, apply retention policy (archive/delete), and protect some with legal holds.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Endpoints</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-200">
          <li>
            <code>POST /api/events/ingest</code>
          </li>
          <li>
            <code>GET /api/events/query?store=active|archive&amp;userId=...</code>
          </li>
          <li>
            <code>POST /api/retention/run</code>
          </li>
          <li>
            <code>POST /api/retention/hold</code>
          </li>
          <li>
            <code>GET /api/retention/policy</code>
          </li>
        </ul>
      </div>
    </main>
  );
}

