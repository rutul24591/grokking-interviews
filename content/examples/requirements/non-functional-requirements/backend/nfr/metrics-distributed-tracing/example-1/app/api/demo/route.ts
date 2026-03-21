import { jsonOk } from "@/lib/http";
import { parseOrCreateTraceContext, withSpan } from "@/lib/tracing";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function GET(req: Request) {
  const ctx = parseOrCreateTraceContext(req.headers.get("traceparent"));

  const result = await withSpan({
    traceId: ctx.traceId,
    parentSpanId: ctx.parentSpanId,
    name: "GET /api/demo",
    fn: async (rootSpanId) => {
      await withSpan({
        traceId: ctx.traceId,
        parentSpanId: rootSpanId,
        name: "cache.get",
        fn: async () => {
          await sleep(15);
          return null;
        }
      });
      await withSpan({
        traceId: ctx.traceId,
        parentSpanId: rootSpanId,
        name: "db.query",
        fn: async () => {
          await sleep(35);
          return null;
        }
      });
      return { ok: true };
    }
  });

  return jsonOk(
    {
      ...result,
      traceId: ctx.traceId,
      traceparent: ctx.traceparent
    },
    { headers: { traceparent: ctx.traceparent } }
  );
}

