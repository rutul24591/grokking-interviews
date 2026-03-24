"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ShellToMfeSchema, type ShellToMfe, type MfeToShell } from "@/lib/contracts";
import { MfeToShellSchema } from "@/lib/contracts";

export function RemoteFrame({ src, theme }: { src: string; theme: "dark" | "light" }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [height, setHeight] = useState(220);
  const [log, setLog] = useState<string[]>([]);

  const origin = useMemo(() => new URL(src).origin, [src]);
  const allowedOrigins = useMemo(() => new Set([origin]), [origin]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!allowedOrigins.has(e.origin)) return;
      const parsed = MfeToShellSchema.safeParse(e.data);
      if (!parsed.success) return;

      const msg: MfeToShell = parsed.data;
      if (msg.type === "mfe:ready") {
        setLog((l) => [`ready: ${msg.payload.name} v${msg.payload.contractVersion}`, ...l].slice(0, 10));
      } else if (msg.type === "mfe:height") {
        setHeight(Math.max(120, Math.min(900, msg.payload.height)));
      } else if (msg.type === "mfe:event") {
        setLog((l) => [`event: ${msg.payload.name}`, ...l].slice(0, 10));
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [allowedOrigins]);

  useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    const msg: ShellToMfe = { v: 1, type: "shell:setTheme", payload: { theme } };
    ShellToMfeSchema.parse(msg);
    win.postMessage(msg, origin);
  }, [origin, theme]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-lg border border-white/10 bg-black/30">
        <iframe
          ref={iframeRef}
          title="profile micro-frontend"
          src={src}
          style={{ width: "100%", height }}
          className="rounded-lg"
        />
      </div>
      <aside className="space-y-4">
        <section className="rounded-lg border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
          <h3 className="text-base font-semibold text-slate-100">Shell log</h3>
          <ul className="mt-3 space-y-2">
            {log.length === 0 ? <li className="text-slate-400">No messages yet.</li> : null}
            {log.map((l) => (
              <li key={l} className="rounded-md border border-white/10 bg-white/5 px-3 py-2">
                {l}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
          <h3 className="text-base font-semibold text-slate-100">Security note</h3>
          <p className="mt-2">
            Always validate <code>origin</code> and validate message schemas. Never accept raw objects from unknown
            origins.
          </p>
        </section>
      </aside>
    </div>
  );
}

