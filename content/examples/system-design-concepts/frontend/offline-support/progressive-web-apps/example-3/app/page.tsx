import { UpdateClient } from "./update-client";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">PWA updates (waiting → activate)</h1>
      <p className="mt-3 text-white/80">
        A controlled service worker update flow: detect a waiting SW, activate it, and reload on controller change.
      </p>
      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
        <UpdateClient />
      </div>
      <section className="mt-10 space-y-2">
        <h2 className="text-xl font-semibold">How to simulate an update</h2>
        <ol className="list-decimal space-y-2 pl-5 text-white/80">
          <li>Run <code>pnpm build</code> then <code>pnpm start</code>.</li>
          <li>Open DevTools → Application → Service Workers.</li>
          <li>Edit <code>public/sw.js</code> and change <code>VERSION</code> to a new value.</li>
          <li>Refresh once to download the new SW; it should enter <span className="font-semibold">waiting</span>.</li>
          <li>Click “Activate update” to call <code>skipWaiting</code>, then reload when prompted.</li>
        </ol>
      </section>
    </main>
  );
}

