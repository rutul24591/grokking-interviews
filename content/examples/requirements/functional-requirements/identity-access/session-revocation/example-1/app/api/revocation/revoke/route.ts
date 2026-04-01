import { NextRequest, NextResponse } from "next/server";
import { revocationState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { sessionId: string; all?: boolean };
  if (body.all) {
    revocationState.activeSessions = revocationState.activeSessions.map((session) => ({ ...session, revoked: true }));
    revocationState.revokedCount = revocationState.activeSessions.length;
    revocationState.lastMessage = "Revoked all active sessions.";
    return NextResponse.json(revocationState);
  }
  revocationState.activeSessions = revocationState.activeSessions.map((session) =>
    session.sessionId === body.sessionId ? { ...session, revoked: true } : session
  );
  revocationState.revokedCount = revocationState.activeSessions.filter((session) => session.revoked).length;
  revocationState.lastMessage = `Revoked session ${body.sessionId}.`;
  return NextResponse.json(revocationState);
}
