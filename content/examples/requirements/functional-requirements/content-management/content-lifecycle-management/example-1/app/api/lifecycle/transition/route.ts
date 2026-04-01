import { NextRequest, NextResponse } from "next/server";
import { lifecycleState } from "@/lib/store";

const nextActionForStage = {
  draft: "submit-for-review",
  review: "approve-or-reject",
  published: "observe-metrics",
  archived: "restore-or-delete"
} as const;

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { id: string; stage: keyof typeof nextActionForStage };
  lifecycleState.entries = lifecycleState.entries.map((entry) =>
    entry.id === body.id ? { ...entry, stage: body.stage, nextAction: nextActionForStage[body.stage] } : entry
  );
  lifecycleState.lastMessage = `Transitioned ${body.id} to ${body.stage} and updated the allowed next action.`;
  return NextResponse.json(lifecycleState);
}
