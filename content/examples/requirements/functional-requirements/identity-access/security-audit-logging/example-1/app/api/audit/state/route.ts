import { NextResponse } from "next/server";
import { auditEvents } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ events: auditEvents, count: auditEvents.length });
}
