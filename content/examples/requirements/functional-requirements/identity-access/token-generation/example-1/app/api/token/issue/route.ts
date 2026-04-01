import { NextRequest, NextResponse } from "next/server";
import { tokenState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { subject: string; scopes: string[] };
  tokenState.subject = body.subject;
  tokenState.scopes = body.scopes;
  tokenState.accessToken = `access-${Date.now()}`;
  tokenState.refreshToken = `refresh-${Date.now()}`;
  tokenState.lastMessage = `Issued access and refresh tokens for ${body.subject}.`;
  return NextResponse.json(tokenState);
}
