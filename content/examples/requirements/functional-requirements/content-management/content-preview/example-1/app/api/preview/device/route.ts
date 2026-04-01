import { NextRequest, NextResponse } from "next/server";
import { previewState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { activeSurface: "web" | "mobile" | "social" };
  previewState.activeSurface = body.activeSurface;
  previewState.lastMessage = `Switched preview surface to ${body.activeSurface} so the author can validate channel-specific rendering before publish.`;
  return NextResponse.json(previewState);
}
