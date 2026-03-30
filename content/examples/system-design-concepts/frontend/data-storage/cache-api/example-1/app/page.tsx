import { CacheClient } from "./cache-client";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Cache API inspector</h1>
      <p className="mt-3 text-white/80">Store and inspect request/response pairs directly in the browser Cache API.</p>
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <CacheClient />
      </div>
    </main>
  );
}

