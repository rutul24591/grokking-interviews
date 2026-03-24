"use client";

import { useEffect, useMemo, useState } from "react";
import { createBroadcastPubSub, type PubSubMessage } from "../lib/pubsub";

type LogItem = {
  direction: "sent" | "received";
  msg: PubSubMessage;
};

export default function Page() {
  const pubsub = useMemo(() => createBroadcastPubSub("sd.pubsub.demo"), []);
  const [topic, setTopic] = useState("toast");
  const [payload, setPayload] = useState("{\"text\":\"Hello from another tab\"}");
  const [log, setLog] = useState<LogItem[]>([]);
  const [subscribedTopics, setSubscribedTopics] = useState<string[]>(["toast"]);

  useEffect(() => {
    const unsubs = subscribedTopics.map((t) =>
      pubsub.subscribe(t, (msg) => setLog((l) => [{ direction: "received", msg }, ...l].slice(0, 40)))
    );
    const unsubAll = pubsub.subscribeAll((msg) => {
      if (subscribedTopics.includes("*")) setLog((l) => [{ direction: "received", msg }, ...l].slice(0, 40));
    });
    return () => {
      unsubs.forEach((u) => u());
      unsubAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribedTopics.join("|")]);

  useEffect(() => {
    return () => pubsub.close();
  }, [pubsub]);

  function toggleTopic(t: string) {
    setSubscribedTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function publishNow() {
    let parsed: unknown = payload;
    try {
      parsed = JSON.parse(payload);
    } catch {
      // keep as string
    }
    const msg = pubsub.publish(topic, parsed);
    setLog((l) => [{ direction: "sent", msg }, ...l].slice(0, 40));
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Publish-Subscribe: BroadcastChannel topics</h1>
        <p className="text-sm text-white/70">
          Open two tabs and publish messages. Subscribers receive by topic. Origin: <code>{pubsub.origin}</code>
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-sm font-semibold">Publish</h2>
          <div className="mt-3 grid gap-2">
            <label className="text-xs text-white/60">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
              placeholder="toast"
            />
            <label className="mt-2 text-xs text-white/60">Payload (JSON or plain text)</label>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="h-28 resize-none rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
            />
            <button
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
              onClick={publishNow}
            >
              Publish
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-sm font-semibold">Subscriptions</h2>
          <p className="mt-2 text-sm text-white/60">
            Toggle topics to simulate independent modules subscribing to specific message streams.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["toast", "auth", "telemetry", "*"].map((t) => {
              const active = subscribedTopics.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTopic(t)}
                  className={[
                    "rounded-md px-3 py-2 text-sm",
                    active ? "bg-emerald-500 text-white" : "border border-white/15 bg-white/5 hover:bg-white/10"
                  ].join(" ")}
                >
                  {active ? "Subscribed" : "Subscribe"} {t}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold">Message log</h2>
        <div className="mt-3 grid gap-2">
          {log.length === 0 ? (
            <div className="text-sm text-white/60">No messages yet.</div>
          ) : (
            log.map((i) => (
              <div
                key={i.msg.id}
                className={[
                  "rounded-md px-3 py-2",
                  i.direction === "sent" ? "bg-indigo-500/10" : "bg-emerald-500/10"
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium">
                    {i.direction.toUpperCase()} <span className="text-white/60">topic</span> <code>{i.msg.topic}</code>
                  </div>
                  <div className="text-xs text-white/50 tabular-nums">{new Date(i.msg.ts).toLocaleTimeString()}</div>
                </div>
                <pre className="mt-2 overflow-auto rounded bg-black/20 p-2 text-xs">
{JSON.stringify(i.msg.payload, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
