import { NextRequest, NextResponse } from "next/server";
import { storageState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { id: string; tier: "hot" | "warm" | "cold" };
  storageState.classes = storageState.classes.map((entry) =>
    entry.id === body.id ? { ...entry, tier: body.tier } : entry
  );
  storageState.lastMessage = `Updated storage tier for ${body.id} to ${body.tier}.`;
  return NextResponse.json(storageState);
}
