import { NextRequest, NextResponse } from "next/server";
import { sharingState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { id: string; status: "ready" | "rate-limited" | "warning" };
  sharingState.channels = sharingState.channels.map((channel) =>
    channel.id === body.id ? { ...channel, status: body.status } : channel
  );
  sharingState.lastMessage = `Updated channel state for ${body.id} to ${body.status}.`;
  return NextResponse.json(sharingState);
}
