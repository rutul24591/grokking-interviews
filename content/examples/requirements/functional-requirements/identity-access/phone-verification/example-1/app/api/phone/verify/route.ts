import { NextRequest, NextResponse } from "next/server";
import { phoneState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { code: string };
  phoneState.attempts += 1;
  if (body.code !== phoneState.code) {
    phoneState.lastMessage = "Verification code invalid.";
    return NextResponse.json(phoneState, { status: 400 });
  }
  phoneState.status = "verified";
  phoneState.lastMessage = "Phone number verified.";
  return NextResponse.json(phoneState);
}
