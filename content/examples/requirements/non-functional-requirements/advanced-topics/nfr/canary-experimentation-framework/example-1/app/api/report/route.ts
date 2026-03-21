import { NextResponse } from "next/server";
import { getConfig } from "@/lib/store";
import { snapshotVariant } from "@/lib/telemetry";

export async function GET() {
  const config = await getConfig();
  const baseline = snapshotVariant("baseline");
  const canary = snapshotVariant("canary");

  const errorRateDelta = canary.errorRate - baseline.errorRate;
  const p95DeltaMs = canary.latencyMs.p95 - baseline.latencyMs.p95;

  const reasons: string[] = [];
  if (errorRateDelta > config.guardrails.maxErrorRateDelta) {
    reasons.push(
      `errorRateDelta ${errorRateDelta.toFixed(4)} > ${config.guardrails.maxErrorRateDelta}`,
    );
  }
  if (p95DeltaMs > config.guardrails.maxP95DeltaMs) {
    reasons.push(
      `p95DeltaMs ${p95DeltaMs.toFixed(0)} > ${config.guardrails.maxP95DeltaMs}`,
    );
  }

  const guardrailsOk = reasons.length === 0;

  return NextResponse.json(
    {
      now: new Date().toISOString(),
      config,
      variants: { baseline, canary },
      comparison: {
        errorRateDelta,
        p95DeltaMs,
        guardrails: { ok: guardrailsOk, reasons },
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

