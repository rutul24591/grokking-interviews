import { NextRequest, NextResponse } from "next/server";
import { logoutState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { allDevices?: boolean };
  logoutState.sessionActive = false;
  logoutState.activeSessions = body.allDevices ? 0 : Math.max(0, logoutState.activeSessions - 1);
  logoutState.lastMessage = body.allDevices
    ? "All sessions terminated and user signed out everywhere."
    : "Current session terminated and user signed out.";
  return NextResponse.json(logoutState);
}
