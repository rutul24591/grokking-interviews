"use client";

import { useEffect, useState } from "react";

export function SwRegister() {
  const [status, setStatus] = useState<"idle" | "registered" | "failed">("idle");

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!("serviceWorker" in navigator)) return;
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        if (mounted) setStatus("registered");
      } catch {
        if (mounted) setStatus("failed");
      }
    };
    void run();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 pt-4 text-xs text-slate-400 flex items-center justify-between">
      <div>
        PWA:{" "}
        <span className="font-mono">
          {status === "idle" ? "…" : status === "registered" ? "sw-registered" : "sw-failed"}
        </span>
      </div>
      <div>
        Network: <OnlineIndicator />
      </div>
    </div>
  );
}

function OnlineIndicator() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return (
    <span className={online ? "text-emerald-300 font-medium" : "text-rose-300 font-medium"}>
      {online ? "online" : "offline"}
    </span>
  );
}

