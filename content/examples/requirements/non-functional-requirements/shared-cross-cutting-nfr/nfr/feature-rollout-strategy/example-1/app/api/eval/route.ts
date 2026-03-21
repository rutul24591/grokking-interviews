import { NextResponse } from "next/server";
import { z } from "zod";
import { inRollout } from "@/lib/bucket";
import { getStore } from "@/lib/store";

const QuerySchema = z.object({
  userId: z.string().min(1),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = QuerySchema.parse(Object.fromEntries(url.searchParams.entries()));
  const s = getStore();
  const eligible =
    s.flag.enabled &&
    !s.flag.killSwitch &&
    inRollout(query.userId, s.flag.salt, s.flag.rolloutPct);
  return NextResponse.json({ userId: query.userId, eligible, config: s.flag });
}

