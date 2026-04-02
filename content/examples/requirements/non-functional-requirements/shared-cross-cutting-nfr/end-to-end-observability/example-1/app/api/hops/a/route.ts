import { NextResponse } from "next/server";
import { parseTraceparent, formatTraceparent } from "@/lib/trace";
import { spanId } from "@/lib/ids";
import { endSpan, startSpan } from "@/lib/store";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function GET(req: Request) {
  const ctx = parseTraceparent(req.headers.get("traceparent"));
  if (!ctx) return NextResponse.json({ error: "missing trace context" }, { status: 400 });

  const child = spanId();
  const startedAt = Date.now();
  startSpan({
    traceId: ctx.traceId,
    spanId: child,
    parentSpanId: ctx.parentSpanId,
    name: "service.call",
    service: "hop-a",
    startedAt,
  });

  await sleep(20 + Math.floor(Math.random() * 40));

  const url = new URL("/api/hops/b", req.url);
  const res = await fetch(url, {
    headers: {
      traceparent: formatTraceparent({
        traceId: ctx.traceId,
        spanId: child,
        sampled: ctx.sampled,
      }),
    },
  });
  const hopB = await res.json().catch(() => ({}));

  endSpan({ traceId: ctx.traceId, spanId: child, endedAt: Date.now() });
  return NextResponse.json({ ok: true, hop: "a", hopB });
}

