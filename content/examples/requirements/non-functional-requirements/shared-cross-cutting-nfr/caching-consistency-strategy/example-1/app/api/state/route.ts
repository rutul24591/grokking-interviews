import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export async function GET() {
  const s = getStore();
  return NextResponse.json({
    db: [...s.db.values()],
    cache: [...s.cache.values()].map((c) => ({ ...c, ageMs: Date.now() - c.cachedAt, fresh: Date.now() - c.cachedAt <= c.ttlMs })),
    config: { strategy: s.strategy, ttlMs: s.ttlMs },
  });
}

