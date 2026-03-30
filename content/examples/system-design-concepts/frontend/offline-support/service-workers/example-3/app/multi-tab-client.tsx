"use client";

import { useEffect, useMemo, useState } from "react";
import { getOrCreateTabId, acquireActivationLease, releaseActivationLease } from "../lib/lease/tabLease";

type Status = "unsupported" | "registering" | "ready" | "waiting" | "error";

export function MultiTabClient() {
  const [tabId, setTabId] = useState<string>("(loading)");
  const [status, setStatus] = useState<Status>("registering");
  const [isLeader, setIsLeader] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const canActivate = useMemo(() => status === "waiting" && isLeader, [status, isLeader]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setTabId(getOrCreateTabId());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return;
    }

    const bc = new BroadcastChannel("sw-updates");
    bc.onmessage = (e) => {
      if (e.data?.type === "LEADER_CHANGED") setIsLeader(e.data.tabId === tabId);
      if (e.data?.type === "WAITING") setWaiting(true);
      if (e.data?.type === "ACTIVATED") setMessage("Update activated by another tab; reloading on controller change.");
    };

    let reg: ServiceWorkerRegistration | null = null;

    (async () => {
      try {
        setStatus("registering");
        reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        await navigator.serviceWorker.ready;

        const tryAcquire = () => {
          const leader = acquireActivationLease({ tabId, ttlMs: 15_000 });
          setIsLeader(leader);
          bc.postMessage({ type: "LEADER_CHANGED", tabId: leader ? tabId : null });
        };

        const leaseTimer = setInterval(tryAcquire, 5_000);
        tryAcquire();

        const onUpdateFound = () => {
          if (reg?.waiting || reg?.installing) {
            setWaiting(Boolean(reg.waiting));
          }
        };
        reg.addEventListener("updatefound", onUpdateFound);

        if (reg.waiting) {
          setWaiting(true);
          bc.postMessage({ type: "WAITING" });
        }

        navigator.serviceWorker.addEventListener("controllerchange", () => {
          setStatus("ready");
          window.location.reload();
        });

        setStatus(reg.waiting ? "waiting" : "ready");

        return () => {
          clearInterval(leaseTimer);
          reg?.removeEventListener("updatefound", onUpdateFound);
        };
      } catch {
        setStatus("error");
      }
    })();

    return () => {
      bc.close();
      releaseActivationLease({ tabId });
    };
  }, [tabId]);

  async function checkForUpdate() {
    const reg = await navigator.serviceWorker.ready;
    await reg.update();
    if (reg.waiting) {
      setWaiting(true);
      setStatus("waiting");
      const bc = new BroadcastChannel("sw-updates");
      bc.postMessage({ type: "WAITING" });
      bc.close();
    }
  }

  async function activate() {
    const reg = await navigator.serviceWorker.ready;
    if (!reg.waiting) return;
    reg.waiting.postMessage({ type: "SKIP_WAITING" });
    const bc = new BroadcastChannel("sw-updates");
    bc.postMessage({ type: "ACTIVATED" });
    bc.close();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/80">
        <div>
          tabId: <code>{tabId}</code>
        </div>
        <div>
          leader: <span className="font-semibold">{isLeader ? "yes" : "no"}</span>
        </div>
        <div>
          SW status: <span className="font-semibold">{status}</span>
        </div>
        <div>
          waiting: <span className="font-semibold">{waiting ? "yes" : "no"}</span>
        </div>
        {message ? <div className="mt-2">{message}</div> : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={status === "unsupported" || status === "error"}
          onClick={checkForUpdate}
        >
          Check for update
        </button>
        <button
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canActivate}
          onClick={activate}
        >
          Activate (leader only)
        </button>
      </div>

      <p className="text-sm text-white/70">
        Open this page in multiple tabs. Only the leader tab should click “Activate”.
      </p>
    </div>
  );
}

