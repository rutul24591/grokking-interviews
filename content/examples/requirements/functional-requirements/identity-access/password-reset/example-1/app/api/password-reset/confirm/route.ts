import { NextRequest, NextResponse } from "next/server";
import { reset } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { token: string; password: string };
  reset.attemptCount += 1;

  if (body.token !== reset.token) {
    reset.lastMessage = "Password reset token invalid.";
    return NextResponse.json(reset, { status: 400 });
  }

  if (body.password.length < 12) {
    reset.lastMessage = "Password reset blocked because the replacement password is too weak.";
    return NextResponse.json(reset, { status: 400 });
  }

  reset.complete = true;
  reset.lastMessage = `Password reset completed for ${reset.identifier} after ${reset.attemptCount} confirmation attempts.`;
  return NextResponse.json(reset);
}
