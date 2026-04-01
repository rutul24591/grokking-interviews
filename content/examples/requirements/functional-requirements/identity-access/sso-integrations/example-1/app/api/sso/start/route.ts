import { NextRequest, NextResponse } from "next/server";
import { ssoState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { tenant: string; protocol: string };
  ssoState.tenant = body.tenant;
  ssoState.protocol = body.protocol;
  ssoState.started = true;
  ssoState.completed = false;
  ssoState.lastMessage = `Redirected ${body.tenant} user to ${body.protocol} identity provider.`;
  return NextResponse.json(ssoState);
}
