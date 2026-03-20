"use client";

import { useEffect, useMemo, useState } from "react";
import type { Notification } from "@/lib/notifications";
import { openChannel, type Message } from "@/lib/multitab/channel";
import { isLeader, renewLease, tryAcquireLease } from "@/lib/multitab/lease";

type ServerSnapshot = { version: number; notifications: Notification[] };

async function getSnapshot(): Promise<ServerSnapshot> {
  const res = await fetch("/api/notifications", { cache: "no-store" });
  if (!res.ok) throw new Error(`snapshot failed: ${res.status}`);
  return (await res.json()) as ServerSnapshot;
}

async function publish(text: string) {
  const res = await fetch("/api/notifications/publish", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`publish failed: ${res.status}`);
  return (await res.json()) as unknown;
}

export default function Page() {
  const tabId = useMemo(() => `tab_${crypto.randomUUID().slice(0, 8)}`, []);
  const [role, setRole] = useState<"leader" | "follower">("follower");
  const [snapshot, setSnapshot] = useState<ServerSnapshot>({ version: 0, notifications: [] });
  const [lastHeartbeatAt, setLastHeartbeatAt] = useState<number>(0);

  useEffect(() => {
    const TTL = 6000;
    const channel = openChannel("mt.notifications", (m: Message) => {
      if (m.type === "heartbeat") setLastHeartbeatAt(Date.now());
      if (m.type === "update") {
        setLastHeartbeatAt(Date.now());
        setSnapshot({ version: m.version, notifications: m.notifications });
      }
    });

    let stopped = false;

    const tick = async () => {
      if (stopped) return;

      const leaderNow = isLeader(tabId);
      setRole(leaderNow ? "leader" : "follower");

      if (leaderNow) {
        // leader: renew lease + poll server + broadcast updates
        renewLease(tabId, TTL);
        const s = await getSnapshot();
        setSnapshot(s);
        channel.send({ type: "heartbeat", tabId, version: s.version });
        channel.send({ type: "update", tabId, version: s.version, notifications: s.notifications });
      } else {
        // followers: if we haven't heard from a leader recently, attempt takeover
        const stale = Date.now() - lastHeartbeatAt > TTL;
        if (stale) tryAcquireLease(tabId, TTL);
      }
    };

    // bootstrap: attempt to acquire, then begin loop
    tryAcquireLease(tabId, TTL);
    void tick();
    const id = window.setInterval(() => void tick(), 2000);
    return () => {
      stopped = true;
      window.clearInterval(id);
      channel.close();
    };
  }, [tabId, lastHeartbeatAt]);

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Multi-tab synchronization — leader polling + broadcast</h1>
        <p className="text-sm text-slate-300">
          Open this page in 2–3 tabs. Only the leader polls the server; followers receive updates via{" "}
          <code className="rounded bg-slate-800 px-1">BroadcastChannel</code>.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
        <div className="text-sm text-slate-300">
          Tab: <span className="font-mono">{tabId}</span> • Role:{" "}
          <span className={role === "leader" ? "text-emerald-300 font-semibold" : "text-slate-200"}>
            {role}
          </span>{" "}
          • Version: <span className="font-mono">{snapshot.version}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500"
            onClick={async () => {
              await publish(`hello from ${tabId}`);
            }}
          >
            Publish notification
          </button>
          <button
            className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
            onClick={async () => {
              await fetch("/api/notifications/reset", { method: "POST" });
              setSnapshot({ version: 0, notifications: [] });
            }}
          >
            Reset server state
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
        <h2 className="font-medium">Notifications</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {snapshot.notifications.length === 0 ? (
            <li className="text-slate-400">No notifications yet.</li>
          ) : (
            snapshot.notifications.map((n) => (
              <li key={n.id} className="rounded-lg border border-slate-800 bg-slate-950/30 p-3">
                <div className="text-slate-200">{n.text}</div>
                <div className="mt-1 text-xs text-slate-400">
                  {n.id} • {new Date(n.ts).toISOString()}
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Why this pattern exists</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Reduce redundant polling across tabs (battery/network efficiency).</li>
          <li>Keep multi-tab UX consistent (e.g., unread counts, session state).</li>
          <li>Survive tab crashes via a lease/heartbeat takeover mechanism.</li>
        </ul>
      </section>
    </main>
  );
}

