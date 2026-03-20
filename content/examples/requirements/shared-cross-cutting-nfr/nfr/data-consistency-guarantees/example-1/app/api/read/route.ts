import { NextResponse } from "next/server";
import { z } from "zod";
import { read } from "@/lib/store";

const QuerySchema = z.object({
  consistency: z.enum(["eventual", "read-your-writes"]).default("eventual"),
  sessionId: z.string().min(1).default("s1"),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = QuerySchema.parse(Object.fromEntries(url.searchParams.entries()));
  return NextResponse.json(read({ consistency: q.consistency, sessionId: q.sessionId }));
}

