import Link from "next/link";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">Edge-safe Sessions</h1>
        <p className="mt-2 text-sm text-slate-300">
          Signed cookie session implemented with <span className="font-mono">crypto.subtle</span> (Web Crypto).
        </p>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
            Try it
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <a
              className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-slate-200 hover:border-slate-600"
              href="/api/login?user=alice"
            >
              Login as alice
            </a>
            <a
              className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-slate-200 hover:border-slate-600"
              href="/api/login?user=bob"
            >
              Login as bob
            </a>
            <Link
              className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-slate-200 hover:border-slate-600"
              href="/api/me"
            >
              GET /api/me
            </Link>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Production notes: add rotation, key ids, expiry checks, and CSRF protections for state-changing routes.
          </div>
        </div>
      </div>
    </main>
  );
}

