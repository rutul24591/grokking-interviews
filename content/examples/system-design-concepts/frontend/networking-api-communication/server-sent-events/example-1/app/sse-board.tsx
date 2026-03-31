"use client";

import { useEffect, useState } from "react";

export default function SseBoard() {
  const [events, setEvents] = useState<string[]>([]);
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    const stream = new EventSource("http://localhost:4430/events");
    stream.onopen = () => setStatus("connected");
    stream.onmessage = (event) => {
      setEvents((current) => [event.data, ...current].slice(0, 8));
    };
    stream.onerror = () => setStatus("reconnecting");
    return () => stream.close();
  }, []);

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Streamed updates</h2>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">{status}</span>
      </div>
      <ul className="mt-4 space-y-3 text-sm text-slate-700">
        {events.map((item) => (
          <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
