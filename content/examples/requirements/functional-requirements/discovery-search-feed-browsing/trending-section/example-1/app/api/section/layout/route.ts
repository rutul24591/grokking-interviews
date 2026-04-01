import { NextRequest, NextResponse } from "next/server";
import { trendingSectionState, type LayoutMode, type Region } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    layoutMode: LayoutMode;
    region: Region;
    showReasons: boolean;
  };

  trendingSectionState.layoutMode = body.layoutMode;
  trendingSectionState.region = body.region;
  trendingSectionState.showReasons = body.showReasons;

  const cardBudget = body.layoutMode === "top-3" ? 3 : 5;
  const seenGroups = new Set<string>();
  trendingSectionState.visibleIds = trendingSectionState.cards
    .filter((card) => {
      if (!card.duplicateGroup) return true;
      if (body.region === "explore") return true;
      if (seenGroups.has(card.duplicateGroup)) return false;
      seenGroups.add(card.duplicateGroup);
      return true;
    })
    .slice(0, cardBudget)
    .map((card) => card.id);

  trendingSectionState.lastMessage =
    body.region === "homepage"
      ? "Homepage mode suppresses duplicate narratives and keeps the section concise."
      : "Explore mode shows a broader trending set with more contextual explanations.";

  return NextResponse.json(trendingSectionState);
}
