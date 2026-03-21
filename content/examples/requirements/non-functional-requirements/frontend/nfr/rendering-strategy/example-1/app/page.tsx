import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Rendering strategy — SSR vs CSR vs ISR/Static</h1>
        <p className="text-sm text-slate-300">
          This demo shows the practical differences in what gets rendered on the server vs fetched on
          the client, and how caching changes the trade-offs.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
        <h2 className="font-medium">Try modes</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Mode href="/ssr" label="SSR (no-store)" />
          <Mode href="/csr" label="CSR (client fetch)" />
          <Mode href="/static" label="Static-like (cacheable)" />
          <Mode href="/isr" label="ISR-like (revalidate)" />
        </div>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Rule of thumb</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Use SSR for personalized or auth-gated content (can’t be shared via CDN cache).</li>
          <li>Use static/ISR when many users share content and freshness tolerates seconds/minutes.</li>
          <li>Use CSR for highly interactive views, but budget the hydration and avoid waterfalls.</li>
        </ul>
      </section>
    </main>
  );
}

function Mode({ href, label }: { href: string; label: string }) {
  return (
    <Link className="rounded-lg bg-slate-700 px-3 py-2 font-medium hover:bg-slate-600" href={href}>
      {label}
    </Link>
  );
}

