import { NextRequest, NextResponse } from "next/server";
import { searchRankingState, type RankedResult, type RankingMode } from "@/lib/store";

function score(result: RankedResult, mode: RankingMode, pinnedOn: boolean) {
  const base =
    mode === "relevance"
      ? result.bm25 * 0.75 + result.quality * 0.2 + result.editorialScore * 0.05
      : mode === "freshness"
        ? result.freshness * 0.7 + result.quality * 0.2 + result.editorialScore * 0.1
        : result.bm25 * 0.45 + result.freshness * 0.2 + result.quality * 0.25 + result.editorialScore * 0.1;
  return base + (pinnedOn && result.pinned ? 0.4 : 0);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { mode: RankingMode; pinnedOn: boolean };
  searchRankingState.mode = body.mode;
  searchRankingState.pinnedOn = body.pinnedOn;
  searchRankingState.rankedIds = [...searchRankingState.results].sort((left, right) => score(right, body.mode, body.pinnedOn) - score(left, body.mode, body.pinnedOn)).map((item) => item.id);
  searchRankingState.metrics = {
    mrr: Number((0.62 + (body.mode === "relevance" ? 0.1 : body.mode === "balanced" ? 0.07 : 0.03)).toFixed(2)),
    ndcg: Number((0.74 + (body.pinnedOn ? 0.06 : 0.02) + (body.mode === "balanced" ? 0.04 : 0)).toFixed(2))
  };
  searchRankingState.lastMessage = `Updated ranking to ${body.mode} mode with ${body.pinnedOn ? "pinning enabled" : "pinning disabled"}.`;
  return NextResponse.json(searchRankingState);
}
