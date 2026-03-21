import { NextResponse } from "next/server";
import { inBlastRadius, sleep } from "@/lib/chaos";
import { getActiveExperiment } from "@/lib/store";
import { recordTargetEvent } from "@/lib/telemetry";

export async function GET(req: Request) {
  const startedAt = Date.now();
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();

  const exp = await getActiveExperiment();
  const impacted = exp
    ? inBlastRadius({ experimentId: exp.id, requestId, blastPct: exp.blastPct })
    : false;

  let status = 200;
  let faultInjected: string | null = null;

  try {
    if (exp && impacted) {
      if (exp.fault.type === "latency") {
        faultInjected = `latency:${exp.fault.latencyMs}`;
        await sleep(exp.fault.latencyMs);
      } else if (exp.fault.type === "error") {
        faultInjected = `error:${exp.fault.errorStatus}`;
        status = exp.fault.errorStatus;
      } else if (exp.fault.type === "timeout") {
        faultInjected = `timeout:${exp.fault.timeoutMs}`;
        await sleep(exp.fault.timeoutMs);
      }
    }
  } finally {
    const latencyMs = Date.now() - startedAt;
    recordTargetEvent({
      ts: Date.now(),
      ok: status < 400,
      status,
      latencyMs,
    });
  }

  return NextResponse.json(
    {
      ok: status < 400,
      requestId,
      impacted,
      faultInjected,
      activeExperiment: exp
        ? {
            id: exp.id,
            name: exp.name,
            blastPct: exp.blastPct,
            fault: exp.fault,
          }
        : null,
      ts: new Date().toISOString(),
    },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

