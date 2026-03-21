export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Traffic management &amp; load shedding</h1>
      <p className="mt-2 text-sm text-gray-300">
        Saturate the service with low priority work and see shedding; high priority work still completes.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Endpoint</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-200">
          <li>
            <code>GET /api/work?priority=low|high&amp;durationMs=...</code>
          </li>
        </ul>
      </div>
    </main>
  );
}

