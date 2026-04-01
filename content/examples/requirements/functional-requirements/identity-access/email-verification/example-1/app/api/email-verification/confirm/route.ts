import { NextRequest, NextResponse } from "next/server";
import { emailVerification } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { token: string };
  if (body.token !== emailVerification.token) {
    emailVerification.lastMessage = 'Verification token was invalid.';
    return NextResponse.json(emailVerification, { status: 400 });
  }
  emailVerification.verified = true;
  emailVerification.lastMessage = 'Email verified successfully.';
  return NextResponse.json(emailVerification);
}
