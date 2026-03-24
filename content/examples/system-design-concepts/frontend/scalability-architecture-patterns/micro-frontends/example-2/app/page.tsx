"use client";

import { useMemo, useState } from "react";
import { HostToRemoteSchema, RemoteToHostSchema, type HostToRemote, type RemoteToHost } from "@/lib/contracts";

function wire() {
  const ch = new MessageChannel();

  const host = ch.port1;
  const remote = ch.port2;

  return { host, remote };
}

export default function Page() {
  const { host, remote } = useMemo(() => wire(), []);
  const [log, setLog] = useState<string[]>([]);

  useMemo(() => {
    host.onmessage = (e) => {
      const parsed = RemoteToHostSchema.safeParse(e.data);
      if (!parsed.success) return;
      const msg: RemoteToHost = parsed.data;
      setLog((l) => [`remote → host: ${msg.type}`, ...l].slice(0, 10));
    };

    remote.onmessage = (e) => {
      const parsed = HostToRemoteSchema.safeParse(e.data);
      if (!parsed.success) return;
      const msg: HostToRemote = parsed.data;
      setLog((l) => [`host → remote: ${msg.type}`, ...l].slice(0, 10));
      if (msg.type === "host:handshake") {
        remote.postMessage({ v: 1, type: "remote:handshakeAck", payload: { accepted: true } });
      }
    };
  }, [host, remote]);

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Schema-validated messaging</h1>
        <p className="mt-2 text-slate-300">
          Treat cross-team messages as untrusted input. Validate at runtime and version schemas.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <button
          type="button"
          className="rounded-md bg-indigo-500/20 px-4 py-2 text-sm font-semibold hover:bg-indigo-500/30"
          onClick={() => {
            const msg: HostToRemote = { v: 1, type: "host:handshake", payload: { supported: [1] } };
            HostToRemoteSchema.parse(msg);
            host.postMessage(msg);
          }}
        >
          Send handshake
        </button>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Log</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          {log.length === 0 ? <li className="text-slate-400">No messages yet.</li> : null}
          {log.map((l) => (
            <li key={l} className="rounded-md border border-white/10 bg-black/30 px-3 py-2">
              {l}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

