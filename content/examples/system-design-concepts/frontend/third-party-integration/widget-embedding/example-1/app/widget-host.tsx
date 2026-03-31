"use client";

import { useEffect, useState } from "react";

export default function WidgetHost() {
  const [height, setHeight] = useState(220);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== "http://localhost:4477") {
        setLogs((current) => ["ignored message from untrusted origin", ...current].slice(0, 8));
        return;
      }
      if (event.data?.type === "resize") {
        setHeight(event.data.height);
        setLogs((current) => [`widget resized to ${event.data.height}px`, ...current].slice(0, 8));
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Embedded widget</h2>
        <iframe src="http://localhost:4477/widget.html" title="third-party widget" className="mt-4 w-full rounded-2xl border border-slate-200" style={{ height }} />
      </article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Host isolation log</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {logs.map((log) => <li key={log} className="rounded-2xl bg-slate-50 px-4 py-3">{log}</li>)}
        </ul>
      </article>
    </section>
  );
}
