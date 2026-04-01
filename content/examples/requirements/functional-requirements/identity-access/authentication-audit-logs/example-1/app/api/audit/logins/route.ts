import { NextRequest, NextResponse } from "next/server";
import { events } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { action: string; result: "success" | "failure"; actor: string; sourceIp: string };
  events.unshift({
    id: `evt-${events.length + 1}`,
    actor: body.actor,
    action: body.action,
    sourceIp: body.sourceIp,
    result: body.result,
    timestamp: new Date().toISOString(),
  });
  return NextResponse.json(events[0]);
}
