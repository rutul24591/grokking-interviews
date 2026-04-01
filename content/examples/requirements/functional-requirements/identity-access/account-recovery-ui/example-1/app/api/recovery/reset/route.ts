import { NextRequest, NextResponse } from "next/server";
import { recovery, state } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { token: string; password: string };
  if (Date.now() > recovery.tokenExpiresAt) {
    recovery.lastMessage = "Recovery token expired. Request a new link.";
    return NextResponse.json(state(), { status: 400 });
  }
  if (body.token !== recovery.token) {
    recovery.lastMessage = "Recovery token is invalid.";
    return NextResponse.json(state(), { status: 400 });
  }
  recovery.passwordUpdated = true;
  recovery.lastMessage = `Password updated to ${body.password.length}-character secret.`;
  return NextResponse.json(state());
}
