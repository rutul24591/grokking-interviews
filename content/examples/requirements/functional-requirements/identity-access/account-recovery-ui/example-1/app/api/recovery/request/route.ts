import { NextRequest, NextResponse } from "next/server";
import { recovery, state } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email: string };
  recovery.requestAccepted = true;
  recovery.lastMessage = body.email === recovery.email ? "Recovery email sent with a reset token." : "If the account exists, recovery instructions were sent.";
  return NextResponse.json(state());
}
