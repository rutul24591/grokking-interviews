import { NextRequest, NextResponse } from "next/server";
import { taggingState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { id: string; tags: string[] };
  taggingState.entries = taggingState.entries.map((entry) =>
    entry.id === body.id ? { ...entry, tags: body.tags, quality: body.tags.length >= 2 ? "high" as const : "medium" as const } : entry
  );
  taggingState.lastMessage = `Updated tags for ${body.id} and recalculated tag quality.`;
  return NextResponse.json(taggingState);
}
