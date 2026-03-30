"use client";

import { useEffect, useMemo, useState } from "react";
import { registerServiceWorker } from "../lib/sw/registerServiceWorker";
import { useInstallPrompt } from "../lib/pwa/useInstallPrompt";

type SwState =
  | { status: "unsupported" }
  | { status: "idle" }
  | { status: "registering" }
  | { status: "ready"; scope: string }
  | { status: "error"; message: string };

export function PwaClient() {
  const [swState, setSwState] = useState<SwState>({ status: "idle" });
  const [displayMode, setDisplayMode] = useState<"browser" | "standalone">("browser");
  const { canInstall, promptInstall, lastOutcome } = useInstallPrompt();

  const isStandalone = useMemo(() => displayMode === "standalone", [displayMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(display-mode: standalone)");
    const onChange = () => setDisplayMode(mq.matches ? "standalone" : "browser");
    onChange();
    mq.addEventListener("change", onChange);

    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (typeof window === "undefined") return;
      if (!("serviceWorker" in navigator)) {
        setSwState({ status: "unsupported" });
        return;
      }
      setSwState({ status: "registering" });
      try {
        const reg = await registerServiceWorker("/sw.js");
        if (cancelled) return;
        setSwState({ status: "ready", scope: reg.scope });
      } catch (err) {
        if (cancelled) return;
        setSwState({ status: "error", message: err instanceof Error ? err.message : String(err) });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm">
          Display mode: <span className="font-semibold">{displayMode}</span>
        </span>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm">
          Service worker:{" "}
          <span className="font-semibold">
            {swState.status === "ready" ? "ready" : swState.status}
          </span>
        </span>
      </div>

      {swState.status === "ready" ? (
        <p className="text-sm text-white/70">
          Registered with scope: <code>{swState.scope}</code>
        </p>
      ) : null}

      {swState.status === "error" ? (
        <p className="text-sm text-red-200">
          Registration failed: <code>{swState.message}</code>
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canInstall || isStandalone}
          onClick={promptInstall}
        >
          Install app
        </button>
        <a
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          href="/offline"
        >
          Open /offline
        </a>
      </div>

      <div className="text-sm text-white/70">
        <div>Install available: <span className="font-semibold">{canInstall ? "yes" : "no"}</span></div>
        <div>Installed: <span className="font-semibold">{isStandalone ? "yes" : "no"}</span></div>
        {lastOutcome ? (
          <div>
            Last outcome: <span className="font-semibold">{lastOutcome}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

