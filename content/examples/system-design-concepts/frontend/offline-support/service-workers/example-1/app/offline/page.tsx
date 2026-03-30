export default function OfflinePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Offline fallback</h1>
      <p className="mt-3 text-white/80">
        This page is precached and returned for navigation requests when the network fails.
      </p>
    </main>
  );
}

