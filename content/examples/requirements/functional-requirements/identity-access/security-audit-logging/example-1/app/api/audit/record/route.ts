import { NextRequest, NextResponse } from "next/server";
import { auditEvents } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    actor: string;
    action: string;
    severity: "low" | "medium" | "high";
    redacted: boolean;
  };
  auditEvents.unshift(body);
  return NextResponse.json({ events: auditEvents, count: auditEvents.length, lastMessage: `Recorded ${body.action}.` });
}
