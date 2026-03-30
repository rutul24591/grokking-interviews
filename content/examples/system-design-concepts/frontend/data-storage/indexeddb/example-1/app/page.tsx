import { IndexedDbClient } from "./storage-client";

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold">IndexedDB note catalog</h1>
      <p className="mt-3 text-white/80">Use IndexedDB for larger offline datasets and indexed queries.</p>
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <IndexedDbClient />
      </div>
    </main>
  );
}

