import { OutboxClient } from "./outbox-client";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Background Sync</h1>
      <p className="mt-3 text-white/80">
        Queue mutations locally (outbox), then replay them when the network is available.
        If Background Sync is unsupported, the manual drain path still works.
      </p>
      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
        <OutboxClient />
      </div>
    </main>
  );
}

