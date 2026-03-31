"use client";

import { useEffect, useState } from "react";

export default function SocketBoard() {
  const [events, setEvents] = useState<string[]>([]);
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4460");
    socket.onopen = () => setStatus("connected");
    socket.onmessage = (event) => {
      setEvents((current) => [String(event.data), ...current].slice(0, 8));
    };
    socket.onclose = () => setStatus("closed");
    return () => socket.close();
  }, []);

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Socket events</h2>
        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">{status}</span>
      </div>
      <ul className="mt-4 space-y-3 text-sm text-slate-700">
        {events.map((event) => (
          <li key={event} className="rounded-2xl bg-slate-50 px-4 py-3">
            {event}
          </li>
        ))}
      </ul>
    </section>
  );
}
