import { NextRequest, NextResponse } from "next/server";
import { oauth } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { code: string; stateToken?: string };

  if (body.stateToken && body.stateToken !== oauth.stateToken) {
    oauth.lastMessage = "OAuth callback rejected because the state token did not match.";
    return NextResponse.json(oauth, { status: 400 });
  }

  if (body.code !== oauth.code) {
    oauth.lastMessage = "OAuth callback code was invalid.";
    return NextResponse.json(oauth, { status: 400 });
  }

  oauth.completed = true;
  oauth.lastMessage = `OAuth sign-in completed with ${oauth.provider} and a local session was established.`;
  return NextResponse.json(oauth);
}
