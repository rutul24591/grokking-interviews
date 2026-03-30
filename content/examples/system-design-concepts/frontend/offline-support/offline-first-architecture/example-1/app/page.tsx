import { OfflineFirstClient } from "./ui-client";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Offline-first notes (IndexedDB + outbox)</h1>
      <p className="mt-3 max-w-3xl text-white/80">
        Writes are stored locally first and queued in an outbox. Sync uses idempotency keys and detects version conflicts.
        Turn on DevTools offline to see the queue grow; turn it back on to drain it.
      </p>
      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
        <OfflineFirstClient />
      </div>
    </main>
  );
}

