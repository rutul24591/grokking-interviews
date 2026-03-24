import type { Metadata } from "next";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AccountPage() {
  const cookieStore = await cookies();
  const user = cookieStore.get("user")?.value ?? "anonymous";

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Account (SSR, not indexable)</h1>
        <p className="mt-2 text-slate-300">
          This page depends on cookies, so it is rendered on each request and marked <code>noindex</code>.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6 text-slate-300">
        <h2 className="text-xl font-semibold text-slate-100">Session</h2>
        <p className="mt-2">
          Cookie <code>user</code>: <span className="font-semibold text-slate-100">{user}</span>
        </p>
        <p className="mt-2 text-sm text-slate-400">
          In real apps: set <code>Cache-Control: private, no-store</code> at the edge for personalized responses.
        </p>
      </section>
    </main>
  );
}

