import { NextRequest, NextResponse } from "next/server";
import { rankingState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { relevance: number; freshness: number; engagement: number };
  rankingState.weights = body;
  const ranked = [...rankingState.candidates].sort((a, b) => {
    const scoreA = a.relevance * body.relevance + a.freshness * body.freshness + a.engagement * body.engagement;
    const scoreB = b.relevance * body.relevance + b.freshness * body.freshness + b.engagement * body.engagement;
    return scoreB - scoreA;
  });
  rankingState.rankedIds = ranked.map((item) => item.id);
  rankingState.lastMessage = 'Re-ranked candidates with the updated optimization weights.';
  return NextResponse.json(rankingState);
}
