import { NextRequest, NextResponse } from "next/server";
import { phoneState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { phone: string };
  phoneState.phone = body.phone;
  phoneState.status = "code-sent";
  phoneState.code = "482911";
  phoneState.resendAvailableIn = 30;
  phoneState.lastMessage = `Verification code sent to ${body.phone}.`;
  return NextResponse.json(phoneState);
}
