import { NextRequest, NextResponse } from "next/server";
import { verification, view } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { token: string };
  if (Date.now() > verification.expiresAt) {
    verification.lastMessage = "Verification link expired. Request a fresh link.";
    return NextResponse.json(view(), { status: 400 });
  }
  if (body.token !== verification.token) {
    verification.lastMessage = "Verification token is invalid.";
    return NextResponse.json(view(), { status: 400 });
  }
  verification.status = "verified";
  verification.lastMessage = "Account verified successfully.";
  return NextResponse.json(view());
}
