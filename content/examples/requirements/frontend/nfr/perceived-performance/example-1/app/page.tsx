import { SearchPanel } from "@/components/SearchPanel";

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Perceived performance — keep the UI “alive”</h1>
        <p className="text-sm text-slate-300">
          This demo uses three practical patterns: abort stale requests, show skeletons only when latency
          crosses a threshold (avoid flicker), and optimistic actions with rollback.
        </p>
      </header>

      <SearchPanel />

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Staff-level framing</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Perceived performance is an NFR: it influences retention and trust.</li>
          <li>Focus on responsiveness (input) and progress (skeleton/progress) before raw speed.</li>
          <li>Always make async operations cancelable; otherwise you’ll render stale data.</li>
        </ul>
      </section>
    </main>
  );
}

