import { NextResponse } from "next/server";
import { tokenState } from "@/lib/store";

export async function POST() {
  tokenState.accessToken = `access-${Date.now()}`;
  tokenState.refreshCount += 1;
  tokenState.lastMessage = `Refreshed access token (${tokenState.refreshCount}).`;
  return NextResponse.json(tokenState);
}
