import { PwaClient } from "./pwa-client";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Progressive Web App (PWA)</h1>
      <p className="mt-3 text-white/80">
        Install prompt, app manifest, and a minimal service worker that provides an offline navigation fallback.
      </p>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
        <PwaClient />
      </div>

      <section className="mt-10 space-y-2">
        <h2 className="text-xl font-semibold">Try this</h2>
        <ol className="list-decimal space-y-2 pl-5 text-white/80">
          <li>Run with <code>pnpm build</code> then <code>pnpm start</code> for more stable SW behavior.</li>
          <li>Open DevTools → Application → Service Workers to see registration + lifecycle.</li>
          <li>Toggle DevTools → Network → Offline, then reload to see the <code>/offline</code> fallback.</li>
        </ol>
      </section>
    </main>
  );
}

