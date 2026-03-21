import { NextResponse } from "next/server";
import { z } from "zod";
import { listSpans } from "@/lib/store";

const QuerySchema = z.object({
  traceId: z.string().min(32).max(32),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!query.success) return NextResponse.json({ error: "Invalid traceId" }, { status: 400 });

  const spans = listSpans(query.data.traceId).map((s) => ({
    ...s,
    durationMs: s.endedAt ? Math.max(0, s.endedAt - s.startedAt) : null,
  }));

  return NextResponse.json({ traceId: query.data.traceId, spans });
}

