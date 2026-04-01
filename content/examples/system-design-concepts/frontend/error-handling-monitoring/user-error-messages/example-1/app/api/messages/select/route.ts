import { NextRequest, NextResponse } from "next/server";
import { messageState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { id: string };
  messageState.selectedId = body.id;
  messageState.lastMessage = `Selected ${body.id} to review user-facing copy and recovery CTA.`;
  return NextResponse.json(messageState);
}
