import { NextRequest, NextResponse } from "next/server";
import { providers } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { providerId: string };
  providers.selected = body.providerId;
  providers.lastMessage = `Identity flow switched to ${body.providerId}.`;
  return NextResponse.json(providers);
}
