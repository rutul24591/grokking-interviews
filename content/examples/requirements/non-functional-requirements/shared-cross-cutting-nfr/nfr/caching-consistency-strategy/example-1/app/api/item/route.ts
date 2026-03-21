import { NextResponse } from "next/server";
import { z } from "zod";
import { cacheKey, getStore, isFresh, loadFromDbSingleflight } from "@/lib/store";

const QuerySchema = z.object({
  id: z.string().min(1).default("item-1"),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = QuerySchema.parse(Object.fromEntries(url.searchParams.entries()));
  const s = getStore();

  const db = s.db.get(query.id);
  if (!db) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const key = cacheKey(query.id, s.strategy === "versioned" ? db.version : null, s.strategy);
  const cached = s.cache.get(key);
  if (cached && isFresh(cached)) {
    return NextResponse.json({ source: "cache", record: db, cache: cached });
  }

  const loaded = await loadFromDbSingleflight(query.id);
  const nextKey = cacheKey(query.id, s.strategy === "versioned" ? loaded.version : null, s.strategy);
  s.cache.set(nextKey, { key: nextKey, value: loaded.value, version: loaded.version, cachedAt: Date.now(), ttlMs: s.ttlMs });

  return NextResponse.json({ source: cached ? "cache_stale" : "db", record: loaded, cacheKey: nextKey });
}

const PutSchema = z.object({
  id: z.string().min(1).default("item-1"),
  value: z.string().min(1).max(200),
});

export async function PUT(req: Request) {
  const body = PutSchema.parse(await req.json());
  const s = getStore();
  const existing = s.db.get(body.id);
  const next = {
    id: body.id,
    value: body.value,
    version: (existing?.version ?? 0) + 1,
    updatedAt: new Date().toISOString(),
  };
  s.db.set(body.id, next);

  if (s.strategy === "invalidation") {
    s.cache.delete(body.id);
  }

  return NextResponse.json({ ok: true, record: next });
}

