import { NextResponse } from "next/server";
import { chooseVariant } from "@/lib/bucketing";
import { getConfig } from "@/lib/store";
import { stableUniform01 } from "@/lib/random";
import { recordEvent } from "@/lib/telemetry";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function GET(req: Request) {
  const started = Date.now();
  const userId = req.headers.get("x-user-id") ?? `anon-${crypto.randomUUID()}`;
  const config = await getConfig();

  const variant = chooseVariant({
    userId,
    canaryPct: config.routing.canaryPct,
    salt: config.routing.salt,
  });

  const behavior = config.behavior[variant];
  const u = (tag: string) => stableUniform01(`${config.routing.salt}:${userId}:${tag}`);
  const isError = u("err") < behavior.errorRate;
  const isTail = u("tail") < behavior.tailPct;
  const jitter = Math.floor(u("j") * behavior.jitterMs);
  const tail = isTail ? Math.floor(u("t") * behavior.tailLatencyMs) : 0;
  const simulatedLatencyMs = behavior.baseLatencyMs + jitter + tail;

  await sleep(simulatedLatencyMs);
  const status = isError ? behavior.errorStatus : 200;
  const latencyMs = Date.now() - started;
  const ok = status < 400;

  recordEvent({ variant, ok, latencyMs });

  return NextResponse.json(
    {
      userId,
      variant,
      ok,
      status,
      latencyMs,
      routing: config.routing,
      ts: new Date().toISOString(),
    },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

