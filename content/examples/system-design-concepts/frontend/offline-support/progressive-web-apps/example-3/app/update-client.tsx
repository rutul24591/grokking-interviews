"use client";

import { useEffect, useMemo, useState } from "react";
import { registerForUpdates, type UpdateState } from "../lib/sw/registerForUpdates";

export function UpdateClient() {
  const [state, setState] = useState<UpdateState>({ status: "idle" });
  const [activeVersion, setActiveVersion] = useState<string | null>(null);
  const [waitingVersion, setWaitingVersion] = useState<string | null>(null);

  const canActivate = useMemo(() => state.status === "waiting", [state.status]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cleanup = () => {};
    (async () => {
      cleanup = await registerForUpdates({
        swUrl: "/sw.js",
        onState: setState,
        onVersions: ({ active, waiting }) => {
          setActiveVersion(active ?? null);
          setWaitingVersion(waiting ?? null);
        }
      });
    })();

    return () => cleanup();
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm">
        <div>
          SW status: <span className="font-semibold">{state.status}</span>
        </div>
        <div>
          Active version: <span className="font-semibold">{activeVersion ?? "unknown"}</span>
        </div>
        <div>
          Waiting version: <span className="font-semibold">{waitingVersion ?? "none"}</span>
        </div>
        {state.status === "error" ? (
          <div className="mt-2 text-red-200">
            Error: <code>{state.message}</code>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={state.status === "registering"}
          onClick={() => state.actions?.checkForUpdate?.()}
        >
          Check for update
        </button>
        <button
          type="button"
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canActivate}
          onClick={() => state.actions?.activateWaiting?.()}
        >
          Activate update
        </button>
      </div>

      {state.status === "reloading" ? (
        <p className="text-sm text-white/70">
          A new service worker took control. Reloading…
        </p>
      ) : null}
    </div>
  );
}

