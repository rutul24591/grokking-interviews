export default function OfflinePage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">You&apos;re offline</h1>
      <p className="text-slate-300">
        This is the offline fallback page served from the service worker cache.
      </p>
      <p className="text-slate-300">
        When you reconnect, refresh to resume live data.
      </p>
    </main>
  );
}

