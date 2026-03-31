"use client";

import { useEffect, useState } from "react";

type StatusPayload = {
  revision: number;
  status: string;
};

export default function ShortPollingBoard() {
  const [items, setItems] = useState<StatusPayload[]>([]);

  useEffect(() => {
    let stopped = false;
    const interval = setInterval(() => {
      fetch("http://localhost:4440/status")
        .then((response) => response.json())
        .then((payload: StatusPayload) => {
          if (!stopped) {
            setItems((current) => [payload, ...current].slice(0, 6));
          }
        });
    }, 1000);
    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Poll history</h2>
      <ul className="mt-4 space-y-3 text-sm text-slate-700">
        {items.map((item) => (
          <li key={`${item.revision}-${item.status}`} className="rounded-2xl bg-slate-50 px-4 py-3">
            revision {item.revision} · {item.status}
          </li>
        ))}
      </ul>
    </section>
  );
}
