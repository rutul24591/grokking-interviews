import { Client } from "./sw-client";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Service Workers</h1>
      <p className="mt-3 text-white/80">
        Lifecycle state, caching strategy selection, and message passing between the page and the service worker.
      </p>
      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
        <Client />
      </div>
    </main>
  );
}

