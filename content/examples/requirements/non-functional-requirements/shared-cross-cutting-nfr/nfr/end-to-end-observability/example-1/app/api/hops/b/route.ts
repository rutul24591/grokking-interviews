import { NextResponse } from "next/server";
import { parseTraceparent } from "@/lib/trace";
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
    name: "db.query",
    service: "hop-b",
    startedAt,
    attributes: { rows: 3 },
  });

  await sleep(40 + Math.floor(Math.random() * 90));

  endSpan({ traceId: ctx.traceId, spanId: child, endedAt: Date.now() });
  return NextResponse.json({ ok: true, hop: "b", traceId: ctx.traceId, spanId: child });
}

