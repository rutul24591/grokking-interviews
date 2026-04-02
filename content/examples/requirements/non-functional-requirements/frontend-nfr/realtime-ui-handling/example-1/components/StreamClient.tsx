"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Message = { cursor: number; id: string; ts: number; text: string };

const CURSOR_KEY = "rt.cursor";

function readCursor() {
  const raw = window.localStorage.getItem(CURSOR_KEY);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function writeCursor(n: number) {
  window.localStorage.setItem(CURSOR_KEY, String(n));
}

function backoffMs(attempt: number) {
  const base = Math.min(8000, 250 * 2 ** Math.min(attempt, 6));
  const jitter = Math.floor(base * 0.2 * Math.random());
  return base + jitter;
}

export function StreamClient() {
  const tabId = useMemo(() => crypto.randomUUID().slice(0, 8), []);
  const [status, setStatus] = useState<"connecting" | "open" | "closed">("connecting");
  const [messages, setMessages] = useState<Message[]>([]);
  const attemptRef = useRef(0);
  const esRef = useRef<EventSource | null>(null);

  const connect = () => {
    const cursor = readCursor();
    const es = new EventSource(`/api/realtime/stream?cursor=${cursor}`);
    esRef.current = es;
    setStatus("connecting");

    es.onopen = () => {
      attemptRef.current = 0;
      setStatus("open");
    };

    es.onmessage = (ev) => {
      try {
        const m = JSON.parse(ev.data) as Message;
        writeCursor(Math.max(readCursor(), m.cursor));
        setMessages((prev) => {
          const seen = new Set(prev.map((x) => x.cursor));
          if (seen.has(m.cursor)) return prev;
          return [m, ...prev].slice(0, 50);
        });
      } catch {
        // ignore
      }
    };

    es.onerror = () => {
      es.close();
      setStatus("closed");
      const attempt = ++attemptRef.current;
      const wait = backoffMs(attempt);
      window.setTimeout(() => connect(), wait);
    };
  };

  useEffect(() => {
    connect();
    return () => esRef.current?.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Realtime stream (SSE)</h2>
        <div className="text-xs text-slate-400">
          tab <span className="font-mono">{tabId}</span> •{" "}
          <span className={status === "open" ? "text-emerald-300" : "text-slate-300"}>{status}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500"
          onClick={async () => {
            await fetch("/api/realtime/publish", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ text: `hello from ${tabId}` })
            });
          }}
        >
          Publish
        </button>
        <button
          className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
          onClick={async () => {
            await fetch("/api/realtime/reset", { method: "POST" });
            writeCursor(0);
            setMessages([]);
          }}
        >
          Reset
        </button>
      </div>

      <ul className="space-y-2 text-sm">
        {messages.length === 0 ? (
          <li className="text-slate-400">No messages yet.</li>
        ) : (
          messages.map((m) => (
            <li key={m.cursor} className="rounded-lg border border-slate-800 bg-slate-950/30 p-3">
              <div className="text-slate-200">{m.text}</div>
              <div className="mt-1 text-xs text-slate-400">
                cursor {m.cursor} • {new Date(m.ts).toISOString()}
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

