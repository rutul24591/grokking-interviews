import { MigrationClient } from "./migration-client";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">IndexedDB schema migrations</h1>
      <p className="mt-3 text-white/80">
        Offline-first apps must handle client-side storage migrations safely. This example demonstrates an upgrade from
        v1 → v2 that backfills a new field.
      </p>
      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
        <MigrationClient />
      </div>
    </main>
  );
}

