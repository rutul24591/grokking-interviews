import { NextRequest, NextResponse } from "next/server";
import { signupState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    email: string;
    password: string;
    invited: boolean;
  };
  signupState.submitted = true;
  signupState.email = body.email;
  signupState.invited = body.invited;
  signupState.pendingVerification = true;
  signupState.lastMessage = body.invited
    ? "Invited account accepted and waiting for verification."
    : `Created pending account for ${body.email}.`;
  return NextResponse.json(signupState);
}
