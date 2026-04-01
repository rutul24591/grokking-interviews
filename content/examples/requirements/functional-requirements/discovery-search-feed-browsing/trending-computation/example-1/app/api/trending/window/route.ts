import { NextRequest, NextResponse } from "next/server";
import { trendingComputationState, type TrendingItem, type TrendingWindow } from "@/lib/store";
function score(item: TrendingItem, window: TrendingWindow) {
  const recencyWeight = window === "1h" ? 0.6 : window === "6h" ? 0.45 : 0.3;
  return item.views * 0.2 + item.saves * 0.8 + item.acceleration * 100 * recencyWeight;
}
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { window: TrendingWindow };
  trendingComputationState.window = body.window;
  trendingComputationState.rankedIds = [...trendingComputationState.items].sort((left, right) => score(right, body.window) - score(left, body.window)).map((item) => item.id);
  trendingComputationState.lastMessage = `Recomputed trending scores for the ${body.window} window.`;
  return NextResponse.json(trendingComputationState);
}
