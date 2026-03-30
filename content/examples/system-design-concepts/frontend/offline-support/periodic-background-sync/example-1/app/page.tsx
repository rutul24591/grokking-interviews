import { PeriodicSyncClient } from "./periodic-sync-client";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Periodic Background Sync</h1>
      <p className="mt-3 text-white/80">
        Browsers may deny or ignore periodic sync. Treat it as an optimization, not a correctness dependency.
      </p>
      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
        <PeriodicSyncClient />
      </div>
    </main>
  );
}

