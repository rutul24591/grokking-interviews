import { MultiTabClient } from "./multi-tab-client";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Multi-tab SW update coordination</h1>
      <p className="mt-3 text-white/80">
        Only one tab should activate a waiting service worker (skipWaiting) to avoid inconsistent multi-tab UX.
      </p>
      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
        <MultiTabClient />
      </div>
    </main>
  );
}

