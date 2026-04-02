import { NextResponse } from "next/server";
import { resetTelemetry } from "@/lib/telemetry";

export async function POST() {
  resetTelemetry();
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

