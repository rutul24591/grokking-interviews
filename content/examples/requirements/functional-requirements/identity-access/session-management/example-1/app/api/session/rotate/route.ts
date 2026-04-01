import { NextRequest, NextResponse } from "next/server";
import { sessionState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { sessionId: string };
  const target = sessionState.active.find((entry) => entry.sessionId === body.sessionId);
  if (!target) {
    sessionState.lastMessage = "Session not found.";
    return NextResponse.json(sessionState, { status: 404 });
  }
  target.sessionId = `sess-rotated-${Date.now()}`;
  target.expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
  sessionState.rotationCount += 1;
  sessionState.lastMessage = `Rotated credentials for ${target.device}.`;
  return NextResponse.json(sessionState);
}
