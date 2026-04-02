import { NextResponse } from "next/server";
import { applyAction, getSnapshot } from "@/lib/store";

export async function POST(request: Request) {
  const body = (await request.json()) as { action?: string; itemId?: string };
  applyAction(body.action ?? "reset", body.itemId);
  return NextResponse.json(getSnapshot());
}
