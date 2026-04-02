"use client";

import { useEffect, useRef, useState } from "react";
import { ThirdPartyMessageSchema, type ThirdPartyMessage } from "@/lib/messages";

export function SandboxWidget() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [msgs, setMsgs] = useState<ThirdPartyMessage[]>([]);

  async function ingest(msg: ThirdPartyMessage) {
    try {
      await fetch("/api/metrics/ingest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(msg),
      });
    } catch {
      // Best-effort: third-party signals should never break the UI.
    }
  }

  useEffect(() => {
    const onMessage = (ev: MessageEvent) => {
      // sandboxed iframes without allow-same-origin have origin "null".
      if (ev.origin !== "null") return;
      if (iframeRef.current?.contentWindow && ev.source !== iframeRef.current.contentWindow) return;
      const parsed = ThirdPartyMessageSchema.safeParse(ev.data);
      if (!parsed.success) return;
      setMsgs((prev) => [parsed.data, ...prev].slice(0, 50));
      void ingest(parsed.data);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
      <h2 className="font-medium">Third-party widget (sandboxed iframe)</h2>
      <p className="text-sm text-slate-300">
        The iframe is sandboxed with scripts allowed, but without same-origin access. Messages are
        validated via schema and only accepted from origin <code className="rounded bg-slate-800 px-1">null</code>.
      </p>

      <iframe
        ref={iframeRef}
        title="third-party-widget"
        src="/tp/widget"
        sandbox="allow-scripts"
        className="w-full rounded-xl border border-slate-800 bg-black"
        style={{ height: 220 }}
      />

      <div className="rounded-lg bg-slate-950/40 p-3 text-xs overflow-auto">
        <div className="text-slate-300 font-medium mb-2">Messages</div>
        <pre>{JSON.stringify(msgs, null, 2)}</pre>
      </div>
    </section>
  );
}
