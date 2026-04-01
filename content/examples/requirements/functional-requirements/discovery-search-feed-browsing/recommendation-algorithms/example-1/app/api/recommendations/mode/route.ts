import { NextRequest, NextResponse } from "next/server";
import { recommendationState, type Candidate, type Mode } from "@/lib/store";
function score(candidate: Candidate, mode: Mode) {
  if (mode === "content-based") return candidate.topicMatch * 0.7 + candidate.recency * 0.3;
  if (mode === "collaborative") return candidate.collaborativeScore * 0.8 + candidate.recency * 0.2;
  return candidate.topicMatch * 0.45 + candidate.collaborativeScore * 0.4 + candidate.recency * 0.15;
}
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { mode: Mode };
  recommendationState.mode = body.mode;
  recommendationState.rankedIds = [...recommendationState.candidates]
    .sort((left, right) => score(right, body.mode) - score(left, body.mode))
    .map((candidate) => candidate.id);
  recommendationState.lastMessage = `Re-ranked recommendations using ${body.mode} strategy.`;
  return NextResponse.json(recommendationState);
}
