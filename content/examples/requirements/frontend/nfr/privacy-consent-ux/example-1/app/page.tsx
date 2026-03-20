import { AnalyticsDemo } from "@/components/AnalyticsDemo";
import { ConsentBanner } from "@/components/ConsentBanner";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Privacy & consent UX — enforce consent in code</h1>
        <p className="text-sm text-slate-300">
          The UI collects user preferences, but the critical part is enforcement: analytics calls are
          blocked unless the request has analytics consent.
        </p>
      </header>

      <AnalyticsDemo />

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Design trade-offs</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Keep consent choices reversible and easy to find (settings).</li>
          <li>Make consent deterministic for caching and experiments (cookie + version).</li>
          <li>Honor browser signals (DNT/GPC) and regional requirements.</li>
        </ul>
      </section>

      <ConsentBanner />
    </main>
  );
}

