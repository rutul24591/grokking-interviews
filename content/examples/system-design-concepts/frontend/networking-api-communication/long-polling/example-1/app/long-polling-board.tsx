"use client";

import { useEffect, useRef, useState } from "react";

type FeedEvent = {
  id: number;
  message: string;
  createdAt: string;
};

export default function LongPollingBoard() {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [draft, setDraft] = useState("New architecture article published");
  const [status, setStatus] = useState("connecting");
  const cursorRef = useRef(0);
  const stoppedRef = useRef(false);

  useEffect(() => {
    stoppedRef.current = false;

    const poll = async () => {
      setStatus("waiting");
      try {
        const response = await fetch(`http://localhost:4360/poll?cursor=${cursorRef.current}`);
        const payload = (await response.json()) as { items: FeedEvent[]; cursor: number; timeout: boolean };
        if (stoppedRef.current) {
          return;
        }
        if (payload.items.length > 0) {
          setEvents((current) => [...payload.items, ...current].slice(0, 8));
          cursorRef.current = payload.cursor;
          setStatus("received update");
        } else {
          setStatus(payload.timeout ? "timeout, repolling" : "idle");
        }
        void poll();
      } catch {
        if (!stoppedRef.current) {
          setStatus("origin unavailable");
        }
      }
    };

    void poll();

    return () => {
      stoppedRef.current = true;
    };
  }, []);

  async function publishEvent() {
    await fetch("http://localhost:4360/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: draft })
    });
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Publisher</h2>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="mt-4 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none ring-0"
        />
        <button
          onClick={() => void publishEvent()}
          className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Publish event
        </button>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Long poll feed</h2>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{status}</span>
        </div>
        <ul className="mt-4 space-y-3">
          {events.map((item) => (
            <li key={item.id} className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="font-medium text-slate-900">{item.message}</p>
              <p className="mt-1 text-xs text-slate-500">{item.createdAt}</p>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
