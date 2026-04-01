import { NextResponse } from "next/server";
import { mfa } from "@/lib/store";

export async function POST() {
  mfa.setupStarted = true;
  mfa.enrollmentStage = "qr-issued";
  mfa.attemptsRemaining = 3;
  mfa.lastMessage = "MFA setup started. Scan the secret, verify the code, and store backup codes.";
  return NextResponse.json(mfa);
}
