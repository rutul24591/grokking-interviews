import { NextResponse } from "next/server";
import { allItems, feedState } from "@/lib/store";

export async function POST() {
  const nextCursor = feedState.cursor + feedState.pageSize;
  feedState.cursor = nextCursor;
  feedState.items = allItems.slice(0, Math.min(allItems.length, nextCursor + feedState.pageSize));
  feedState.remaining = Math.max(0, allItems.length - feedState.items.length);
  feedState.lastMessage = feedState.remaining ? "Loaded another feed slice." : "Feed fully loaded.";
  return NextResponse.json(feedState);
}
