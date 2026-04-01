import { NextRequest, NextResponse } from "next/server";
import { allCards, infiniteState } from "@/lib/store";

function uniqueIds(ids: string[]) {
  return ids.filter((id, index) => ids.indexOf(id) === index);
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({ prefetch: false }))) as { prefetch?: boolean };
  const nextCursor = Math.min(allCards.length, infiniteState.cursor + infiniteState.pageSize);
  const nextWindow = allCards.slice(nextCursor, Math.min(allCards.length, nextCursor + infiniteState.pageSize + 2));

  infiniteState.cursor = nextCursor;
  infiniteState.visibleIds = uniqueIds([...infiniteState.visibleIds, ...allCards.slice(0, nextCursor).map((item) => item.id)]);
  infiniteState.bufferedIds = uniqueIds([...infiniteState.visibleIds, ...nextWindow.map((item) => item.id)]);
  infiniteState.hasMore = infiniteState.visibleIds.length < allCards.length;
  infiniteState.prefetchReady = nextWindow.length > 0;
  infiniteState.lastEvent = infiniteState.hasMore ? (body.prefetch ? "prefetch" : "append") : "end-of-feed";
  infiniteState.lastMessage = !infiniteState.hasMore
    ? "Reached the end of the discovery feed and stopped issuing more fetches."
    : body.prefetch
      ? "Prepared the next slice in the background to avoid a visible loading gap."
      : "Appended the next result slice and refreshed the prefetch buffer.";

  return NextResponse.json({
    ...infiniteState,
    items: allCards.filter((item) => infiniteState.visibleIds.includes(item.id)),
    bufferedItems: allCards.filter((item) => infiniteState.bufferedIds.includes(item.id))
  });
}
