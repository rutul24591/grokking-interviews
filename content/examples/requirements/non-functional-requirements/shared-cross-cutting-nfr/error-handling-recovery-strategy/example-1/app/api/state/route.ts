import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export async function GET() {
  const s = getStore();
  return NextResponse.json({
    idempotencyKeys: s.idempotency.size,
    dependencyWrites: s.dependencyWrites,
    breaker: s.breaker.snapshot(),
  });
}

