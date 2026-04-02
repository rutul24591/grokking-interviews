import { TimeBuckets } from "@/lib/buckets";
import { RecentLatencies } from "@/lib/recent";

type TelemetryState = {
  buckets: TimeBuckets;
  recent: RecentLatencies;
};

declare global {
  // eslint-disable-next-line no-var
  var __sloLabTelemetry: TelemetryState | undefined;
}

function createState() {
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  return {
    buckets: new TimeBuckets({ bucketSizeMs: 60_000, maxRetentionMs: thirtyDaysMs }),
    recent: new RecentLatencies(4000),
  };
}

function getState(): TelemetryState {
  if (!globalThis.__sloLabTelemetry) globalThis.__sloLabTelemetry = createState();
  return globalThis.__sloLabTelemetry;
}

export function recordEvent(params: { tsMs: number; good: boolean; latencyMs: number }) {
  const state = getState();
  state.buckets.ingest(params.tsMs, { good: params.good });
  state.recent.push(params.latencyMs);
}

export function snapshotWindow(nowMs: number, windowMs: number) {
  return getState().buckets.snapshot({ nowMs, windowMs });
}

export function snapshotRecent() {
  return getState().recent.snapshot();
}

export function resetTelemetry() {
  const state = getState();
  state.buckets.reset();
  state.recent.reset();
}

