import { NextRequest, NextResponse } from "next/server";
import { indexingState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { mode: "incremental" | "full" };
  indexingState.mode = body.mode;
  indexingState.documents = indexingState.documents.map((document) => ({
    ...document,
    freshnessMinutes: body.mode === "full" ? 1 : Math.max(0, document.freshnessMinutes - 6),
    state: body.mode === "full" ? "indexed" : document.state === "pending" ? "indexed" : document.state
  }));
  indexingState.queueDepth = body.mode === "full" ? 0 : Math.max(0, indexingState.queueDepth - 1);
  indexingState.lastMessage = body.mode === "full"
    ? "Executed a full rebuild to clear stale shards and drain the indexing backlog."
    : "Ran an incremental refresh to publish pending and stale documents quickly.";
  return NextResponse.json(indexingState);
}
