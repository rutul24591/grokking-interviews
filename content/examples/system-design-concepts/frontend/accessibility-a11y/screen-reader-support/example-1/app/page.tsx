"use client";

import { useState } from "react";
import { useAnnouncer } from "@/lib/useAnnouncer";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function Page() {
  const announce = useAnnouncer();
  const [events, setEvents] = useState<string[]>([]);

  async function runBackgroundSync() {
    setEvents((e) => ["Background sync started", ...e]);
    announce.status("Background sync started.");
    await sleep(350);
    setEvents((e) => ["Background sync completed", ...e]);
    announce.status("Background sync completed.");
  }

  function triggerError() {
    setEvents((e) => ["Payment failed", ...e]);
    announce.alert("Payment failed. Check your card details.");
  }

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Screen reader support: live regions</h1>
        <p className="mt-2 text-slate-300">
          Don’t rely on visual toasts alone. Announce important changes in a way that doesn’t steal focus.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void runBackgroundSync()}
            className="rounded-md bg-indigo-500/20 px-4 py-2 text-sm font-semibold hover:bg-indigo-500/30"
          >
            Background sync completed (polite)
          </button>
          <button
            type="button"
            onClick={triggerError}
            className="rounded-md bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/20"
          >
            Payment failed (alert)
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-300">
          Polite updates use <code>role=&quot;status&quot;</code>. Errors use <code>role=&quot;alert&quot;</code>.
        </p>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Event log (visual)</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          {events.length === 0 ? <li className="text-slate-400">No events yet.</li> : null}
          {events.map((e, idx) => (
            <li key={`${e}-${idx}`} className="rounded-md border border-white/10 bg-black/30 px-3 py-2">
              {e}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

