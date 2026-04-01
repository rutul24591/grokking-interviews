import { NextRequest, NextResponse } from "next/server";
import { relatedState, type ContentItem, type Strategy } from "@/lib/store";
function score(item: ContentItem, strategy: Strategy, currentSeries: string) {
  if (strategy === "tag-overlap") return item.sharedTags * 0.8 + item.recency * 0.2;
  if (strategy === "same-series") return (item.series === currentSeries ? 5 : 0) + item.recency;
  return item.sharedTags * 0.5 + (item.series === currentSeries ? 2 : 0) + item.recency * 0.4;
}
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { strategy: Strategy };
  relatedState.strategy = body.strategy;
  relatedState.relatedIds = [...relatedState.candidates]
    .sort((left, right) => score(right, body.strategy, relatedState.current.series) - score(left, body.strategy, relatedState.current.series))
    .map((item) => item.id)
    .slice(0, 3);
  relatedState.lastMessage = `Generated related content using ${body.strategy}.`;
  return NextResponse.json(relatedState);
}
