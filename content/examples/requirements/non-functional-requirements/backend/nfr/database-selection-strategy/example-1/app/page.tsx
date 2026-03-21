export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Database selection strategy</h1>
      <p className="mt-2 text-sm text-gray-300">
        Post a workload profile; get a scored recommendation with reasons and trade-offs.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Endpoint</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-200">
          <li>
            <code>POST /api/recommend</code>
          </li>
        </ul>
      </div>
    </main>
  );
}

