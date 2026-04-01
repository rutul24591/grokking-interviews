import { NextResponse } from "next/server";
import { allCards, infiniteState } from "@/lib/store";

export async function GET() {
  return NextResponse.json({
    ...infiniteState,
    items: allCards.filter((item) => infiniteState.visibleIds.includes(item.id)),
    bufferedItems: allCards.filter((item) => infiniteState.bufferedIds.includes(item.id))
  });
}
