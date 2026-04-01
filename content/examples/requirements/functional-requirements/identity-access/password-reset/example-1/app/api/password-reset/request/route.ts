import { NextRequest, NextResponse } from "next/server";
import { reset } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { identifier: string };
  reset.identifier = body.identifier;
  reset.requested = true;
  reset.complete = false;
  reset.tokenExpiresInMinutes = 15;
  reset.attemptCount = 0;
  reset.lastMessage = `Password reset challenge issued for ${body.identifier}.`;
  return NextResponse.json(reset);
}
