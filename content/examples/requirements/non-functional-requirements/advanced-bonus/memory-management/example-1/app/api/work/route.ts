import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";

const QuerySchema = z.object({
  key: z.string().min(1).default("k"),
  kb: z.coerce.number().int().min(1).max(512).default(64),
});

export async function POST(req: Request) {
  const url = new URL(req.url);
  const query = QuerySchema.parse(Object.fromEntries(url.searchParams.entries()));
  const store = getStore();
  const bytes = query.kb * 1024;

  const started = performance.now();
  const buf = Buffer.alloc(bytes, 7);

  if (store.mode === "leaky") {
    store.leak.set(`${query.key}-${store.requests}`, buf);
  } else if (store.mode === "lru") {
    store.lru.getOrSet(query.key, () => ({ value: buf, sizeBytes: bytes }));
  }

  store.requests += 1;
  store.bytesAllocated += bytes;
  const latencyMs = Math.round((performance.now() - started) * 100) / 100;

  return NextResponse.json({
    ok: true,
    mode: store.mode,
    latencyMs,
    bytesAllocatedTotal: store.bytesAllocated,
    leakEntries: store.leak.size,
    lruEntries: store.lru.size,
    lruBytes: store.lru.bytes,
  });
}

