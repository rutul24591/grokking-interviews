import { NextRequest, NextResponse } from "next/server";
import { interactiveState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { selectedId: string };
  interactiveState.selectedId = body.selectedId;
  interactiveState.lastMessage = `Selected ${body.selectedId} and updated the details panel without resetting the active brush.`;
  return NextResponse.json(interactiveState);
}
