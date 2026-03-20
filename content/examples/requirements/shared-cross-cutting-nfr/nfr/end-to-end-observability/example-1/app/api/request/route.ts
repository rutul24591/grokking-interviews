import { NextResponse } from "next/server";
import { traceId, spanId } from "@/lib/ids";
import { formatTraceparent } from "@/lib/trace";
import { endSpan, startSpan } from "@/lib/store";

export async function POST(req: Request) {
  const t = traceId();
  const root = spanId();
  const startedAt = Date.now();

  startSpan({
    traceId: t,
    spanId: root,
    parentSpanId: null,
    name: "http.request",
    service: "edge",
    startedAt,
    attributes: { path: "/api/request" },
  });

  const url = new URL("/api/hops/a", req.url);
  const res = await fetch(url, {
    headers: {
      traceparent: formatTraceparent({ traceId: t, spanId: root, sampled: true }),
    },
  });
  const hopA = await res.json().catch(() => ({}));

  endSpan({ traceId: t, spanId: root, endedAt: Date.now() });

  return NextResponse.json({
    ok: true,
    traceId: t,
    rootSpanId: root,
    hopA,
  });
}

