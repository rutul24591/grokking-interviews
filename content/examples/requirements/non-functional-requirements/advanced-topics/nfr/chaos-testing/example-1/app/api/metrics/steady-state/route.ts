import { NextResponse } from "next/server";
import { getRollingMetrics } from "@/lib/telemetry";

export async function GET() {
  const snapshot = getRollingMetrics().snapshot();
  return NextResponse.json(snapshot, { headers: { "Cache-Control": "no-store" } });
}

