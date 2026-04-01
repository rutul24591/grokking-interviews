import { NextRequest, NextResponse } from "next/server";
import { feedBuilderState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { diversityGuard: boolean };
  feedBuilderState.diversityGuard = body.diversityGuard;
  const sorted = [...feedBuilderState.candidatePool].sort((a, b) => b.score - a.score);
  feedBuilderState.generated = body.diversityGuard
    ? sorted.filter((item, index, items) => items.findIndex((candidate) => candidate.source === item.source) === index).slice(0, 3).map((item) => item.id)
    : sorted.slice(0, 3).map((item) => item.id);
  feedBuilderState.lastMessage = body.diversityGuard ? "Generated feed with source diversity constraints." : "Generated feed using pure score ordering.";
  return NextResponse.json(feedBuilderState);
}
