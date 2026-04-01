import { NextResponse } from "next/server";
import { verification, view } from "@/lib/store";

export async function POST() {
  const now = Date.now();
  if (verification.resendAvailableAt > now) {
    verification.lastMessage = "Resend is cooling down. Wait before requesting again.";
    return NextResponse.json(view(), { status: 429 });
  }
  verification.token = `VERIFY-${Math.floor(1000 + Math.random() * 9000)}`;
  verification.expiresAt = now + 15 * 60 * 1000;
  verification.resendAvailableAt = now + 30 * 1000;
  verification.lastMessage = "A fresh verification link was issued.";
  return NextResponse.json(view());
}
