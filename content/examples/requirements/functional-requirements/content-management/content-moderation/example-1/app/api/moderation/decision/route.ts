import { NextRequest, NextResponse } from "next/server";
import { moderationState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { id: string; decision: "pending" | "approve" | "reject" | "escalate" };
  moderationState.cases = moderationState.cases.map((entry) =>
    entry.id === body.id ? { ...entry, decision: body.decision } : entry
  );
  moderationState.lastMessage = `Applied the ${body.decision} moderation decision to ${body.id}.`;
  return NextResponse.json(moderationState);
}
