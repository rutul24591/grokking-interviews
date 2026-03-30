export default function OfflinePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold">You are offline</h1>
      <p className="mt-3 text-white/80">
        This route is cached by the service worker and used as a navigation fallback when the network is unavailable.
      </p>
    </main>
  );
}

