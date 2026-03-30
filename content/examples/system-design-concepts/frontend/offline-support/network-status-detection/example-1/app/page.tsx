import { OracleClient } from "./oracle-client";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Network status detection</h1>
      <p className="mt-3 text-white/80">
        <span className="font-semibold">Don’t trust</span> <code>navigator.onLine</code> alone.
        Validate “actually online” via a lightweight heartbeat and treat slow/failing heartbeats as <span className="font-semibold">degraded</span>.
      </p>
      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
        <OracleClient />
      </div>
    </main>
  );
}

