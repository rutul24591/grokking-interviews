import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export async function POST() {
  const store = getStore();
  store.leak.clear();
  store.lru.clear();
  store.requests = 0;
  store.bytesAllocated = 0;
  return NextResponse.json({ ok: true });
}

