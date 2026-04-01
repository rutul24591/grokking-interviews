import { NextRequest, NextResponse } from "next/server";
import { socialState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { provider: string };
  socialState.selectedProvider = body.provider;
  socialState.lastMessage = `Prepared ${body.provider} as the delegated login option.`;
  return NextResponse.json(socialState);
}
