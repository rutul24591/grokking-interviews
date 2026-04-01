import { NextRequest, NextResponse } from "next/server";
import { mfa } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { code: string; trustDevice?: boolean };

  if (body.code !== mfa.challengeCode) {
    mfa.attemptsRemaining = Math.max(0, mfa.attemptsRemaining - 1);
    mfa.lastMessage =
      mfa.attemptsRemaining === 0
        ? "Too many invalid MFA attempts. Restart setup."
        : `Invalid MFA code. ${mfa.attemptsRemaining} attempts remaining.`;
    return NextResponse.json(mfa, { status: 400 });
  }

  mfa.enrolled = true;
  mfa.setupStarted = true;
  mfa.enrollmentStage = "verified";
  mfa.trustedDeviceEnabled = Boolean(body.trustDevice);
  mfa.lastMessage = body.trustDevice
    ? "MFA enrolled successfully. Current device marked as trusted."
    : "MFA enrolled successfully.";
  return NextResponse.json(mfa);
}
