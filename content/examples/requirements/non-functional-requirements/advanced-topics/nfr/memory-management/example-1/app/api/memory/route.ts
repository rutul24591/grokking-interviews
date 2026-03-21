import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export async function GET() {
  const m = process.memoryUsage();
  const store = getStore();
  return NextResponse.json({
    ts: new Date().toISOString(),
    memory: {
      rss: m.rss,
      heapTotal: m.heapTotal,
      heapUsed: m.heapUsed,
      external: m.external,
      arrayBuffers: m.arrayBuffers,
    },
    store: {
      mode: store.mode,
      requests: store.requests,
      bytesAllocatedTotal: store.bytesAllocated,
      leakEntries: store.leak.size,
      lruEntries: store.lru.size,
      lruBytes: store.lru.bytes,
    },
  });
}

