import { StreamClient } from "@/components/StreamClient";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Realtime UI handling — SSE + reconnection + dedupe</h1>
        <p className="text-sm text-slate-300">
          Open two tabs. Publishing in one tab should show in the other. The client handles reconnects
          with backoff and dedupes by cursor.
        </p>
      </header>

      <StreamClient />

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Production edge cases</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Handle duplicates/out-of-order events (id/cursor; replay-safe).</li>
          <li>Apply backpressure: cap message lists and drop policies.</li>
          <li>Resume after reconnect (cursor / Last-Event-ID) without missing events.</li>
        </ul>
      </section>
    </main>
  );
}

