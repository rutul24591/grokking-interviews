import { NextRequest, NextResponse } from "next/server";
import { persistenceState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    rememberMe: boolean;
    cookieMode: string;
    deviceBound: boolean;
  };
  persistenceState.rememberMe = body.rememberMe;
  persistenceState.cookieMode = body.cookieMode;
  persistenceState.deviceBound = body.deviceBound;
  persistenceState.restoredAt = new Date().toISOString();
  persistenceState.lastMessage = body.rememberMe
    ? "Session persisted for future visits."
    : "Session downgraded to non-persistent mode.";
  return NextResponse.json(persistenceState);
}
