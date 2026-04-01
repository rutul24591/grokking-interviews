import { NextRequest, NextResponse } from "next/server";
import { draftSavingState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { id: string; saveState: "saved" | "saving" | "conflict" };
  draftSavingState.drafts = draftSavingState.drafts.map((draft) =>
    draft.id === body.id ? { ...draft, saveState: body.saveState } : draft
  );
  draftSavingState.lastMessage = `Updated draft save state for ${body.id} to ${body.saveState}.`;
  return NextResponse.json(draftSavingState);
}
