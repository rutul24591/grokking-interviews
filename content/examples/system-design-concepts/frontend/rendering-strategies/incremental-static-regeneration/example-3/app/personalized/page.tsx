import Link from "next/link";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function PersonalizedPage() {
  const uid = cookies().get("uid")?.value ?? "guest";
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">Personalized (Dynamic)</h1>
        <p className="mt-1 text-sm text-slate-300">
          This page reads cookies, so it should not be shared-cached as ISR HTML.
        </p>
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="text-sm text-slate-100">
            Hello <span className="font-mono">{uid}</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            If you accidentally cache this at the CDN without varying by session, you can leak one user’s HTML to another.
          </div>
        </div>
        <div className="mt-6 flex gap-3 text-sm">
          <Link className="text-slate-200 hover:underline" href="/public">
            Go to /public
          </Link>
          <a className="text-slate-200 hover:underline" href="/api/session?uid=bob">
            Set uid=bob
          </a>
        </div>
      </div>
    </main>
  );
}

