import { NextResponse } from "next/server";
import { emailVerification } from "@/lib/store";

export async function POST() {
  emailVerification.sent = true;
  emailVerification.lastMessage = 'Verification email sent with a one-time token.';
  return NextResponse.json(emailVerification);
}
