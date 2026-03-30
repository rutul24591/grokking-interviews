"use client";

import { useEffect, useState } from "react";
import { registerPeriodicRefresh } from "../lib/periodic/registerPeriodicRefresh";

type FeedResponse = {
  generatedAt: string;
  policy: string;
  items: Array<{ id: string; title: string; freshnessHint: string }>;
};

type RegistrationState =
  | { status: "idle" }
  | { status: "registering" }
  | { status: "ready"; mode: "periodic-sync" | "visibility-fallback"; detail: string }
  | { status: "error"; message: string };

export function PeriodicSyncClient() {
  const [registrationState, setRegistrationState] = useState<RegistrationState>({ status: "idle" });
  const [feed, setFeed] = useState<FeedResponse | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  async function refreshFeed(reason: string) {
    const res = await fetch(`/api/feed?reason=${encodeURIComponent(reason)}`, { cache: "no-store" });
    const json = (await res.json()) as FeedResponse;
    setFeed(json);
    setLastRefresh(new Date().toLocaleTimeString());
  }

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      if (typeof window === "undefined") return;
      if (!("serviceWorker" in navigator)) {
        setRegistrationState({ status: "error", message: "service-worker-unsupported" });
        return;
      }

      setRegistrationState({ status: "registering" });

      try {
        const result = await registerPeriodicRefresh({
          swUrl: "/sw.js",
          tag: "refresh-feed",
          minIntervalMs: 6 * 60 * 60 * 1000,
          onVisible: () => void refreshFeed("visibility-change")
        });

        if (!cancelled) {
          setRegistrationState({
            status: "ready",
            mode: result.mode,
            detail: result.detail
          });
        }
      } catch (e) {
        if (!cancelled) {
          setRegistrationState({ status: "error", message: e instanceof Error ? e.message : String(e) });
        }
      }
    }

    void setup();
    void refreshFeed("initial-load");

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm">
          mode:{" "}
          <span className="font-semibold">
            {registrationState.status === "ready" ? registrationState.mode : registrationState.status}
          </span>
        </span>
        {lastRefresh ? (
          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm">
            last refresh: <span className="font-semibold">{lastRefresh}</span>
          </span>
        ) : null}
      </div>

      {registrationState.status === "ready" ? (
        <p className="text-sm text-white/70">{registrationState.detail}</p>
      ) : null}
      {registrationState.status === "error" ? (
        <p className="text-sm text-red-200">
          Registration error: <code>{registrationState.message}</code>
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          onClick={() => void refreshFeed("manual-refresh")}
        >
          Refresh now
        </button>
        <button
          type="button"
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          onClick={() => document.dispatchEvent(new Event("visibilitychange"))}
        >
          Trigger fallback check
        </button>
      </div>

      {feed ? (
        <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/80">
          <div>
            generatedAt: <span className="font-semibold">{feed.generatedAt}</span>
          </div>
          <div>
            policy: <span className="font-semibold">{feed.policy}</span>
          </div>
          <div className="mt-3 space-y-2">
            {feed.items.map((item) => (
              <div key={item.id} className="rounded-md border border-white/10 bg-white/5 p-3">
                <div className="font-semibold">{item.title}</div>
                <div className="text-white/60">{item.freshnessHint}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/70">
        <div className="font-semibold text-white/80">Why this matters</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Periodic sync is constrained by browser policy, engagement score, power state, and network conditions.</li>
          <li>Visibility-based refresh is a more portable fallback than blind polling.</li>
          <li>Correctness cannot depend on periodic sync actually firing.</li>
        </ul>
      </div>
    </div>
  );
}

