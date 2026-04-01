import { NextRequest, NextResponse } from "next/server";
import { ssoState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { assertionId: string };
  ssoState.lastAssertionId = body.assertionId;
  ssoState.completed = true;
  ssoState.lastMessage = `Accepted assertion ${body.assertionId} for tenant ${ssoState.tenant}.`;
  return NextResponse.json(ssoState);
}
