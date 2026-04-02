export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Schema governance</h1>
      <p className="mt-2 text-sm text-gray-300">
        Register schemas with backward compatibility rules and validate payloads.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-gray-300">Endpoints</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-200">
          <li>
            <code>POST /api/schema/register</code>
          </li>
          <li>
            <code>POST /api/schema/validate</code>
          </li>
          <li>
            <code>GET /api/schema/subject?subject=...</code>
          </li>
        </ul>
      </div>
    </main>
  );
}

