import { BreakerClient } from "./breaker-client";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">“Online” but failing: circuit breaker</h1>
      <p className="mt-3 text-white/80">
        When a dependency is flaky, <code>navigator.onLine</code> stays true but requests fail. This example uses a
        client-side circuit breaker and queues requests while the breaker is open.
      </p>
      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
        <BreakerClient />
      </div>
    </main>
  );
}

