import { NextRequest, NextResponse } from "next/server";
import { realtimeState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { paused: boolean };
  realtimeState.paused = body.paused;
  realtimeState.staleBanner = body.paused;
  realtimeState.lastMessage = body.paused
    ? "Paused live ingestion so the analyst can inspect the current frame without moving targets."
    : "Resumed live ingestion and bounded the metric history to preserve frame readability.";
  return NextResponse.json(realtimeState);
}
