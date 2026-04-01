import { NextRequest, NextResponse } from "next/server";
import { sessionState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { device: string; risk: "low" | "medium" | "high" };
  sessionState.active.unshift({
    sessionId: `sess-${Date.now()}`,
    device: body.device,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    risk: body.risk
  });
  sessionState.lastMessage = `Created session for ${body.device}.`;
  return NextResponse.json(sessionState);
}
