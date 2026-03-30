import { LocalStorageClient } from "./storage-client";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">LocalStorage draft persistence</h1>
      <p className="mt-3 text-white/80">
        Persist user preferences and an editor draft locally without breaking SSR or hydration.
      </p>
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <LocalStorageClient />
      </div>
    </main>
  );
}

