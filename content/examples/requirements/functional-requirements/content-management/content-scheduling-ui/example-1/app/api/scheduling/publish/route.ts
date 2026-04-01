import { NextRequest, NextResponse } from "next/server";
import { schedulingState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { id: string; readiness: "ready" | "blocked" | "warning" };
  schedulingState.entries = schedulingState.entries.map((entry) =>
    entry.id === body.id ? { ...entry, readiness: body.readiness } : entry
  );
  schedulingState.lastMessage = `Updated release readiness for ${body.id} so the schedule reflects current editorial blockers.`;
  return NextResponse.json(schedulingState);
}
