import { NextResponse } from "next/server";
import { getConfig } from "@/lib/store";
import { stableUniform01 } from "@/lib/random";
import { recordEvent } from "@/lib/telemetry";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function GET(req: Request) {
  const started = Date.now();
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();
  const config = await getConfig();

  const u = (tag: string) => stableUniform01(`${requestId}:${tag}`);
  const isError = u("err") < config.behavior.errorRate;
  const isTail = u("tail") < config.behavior.tailPct;
  const jitter = Math.floor(u("j") * config.behavior.jitterMs);
  const tail = isTail ? Math.floor(u("t") * config.behavior.tailLatencyMs) : 0;
  const simulatedLatencyMs = config.behavior.baseLatencyMs + jitter + tail;

  await sleep(simulatedLatencyMs);
  const status = isError ? config.behavior.errorStatus : 200;
  const latencyMs = Date.now() - started;

  const good =
    status < config.slo.badStatusFrom &&
    latencyMs <= config.slo.latencyThresholdMs;

  recordEvent({ tsMs: Date.now(), good, latencyMs });

  return NextResponse.json(
    {
      requestId,
      status,
      latencyMs,
      good,
      config: { slo: config.slo, behavior: config.behavior },
      ts: new Date().toISOString(),
    },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

