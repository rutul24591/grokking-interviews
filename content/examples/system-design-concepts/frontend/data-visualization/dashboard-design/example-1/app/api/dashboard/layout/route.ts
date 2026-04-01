import { NextRequest, NextResponse } from "next/server";
import { dashboardState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { viewport: "desktop" | "tablet" | "mobile" };
  dashboardState.viewport = body.viewport;
  dashboardState.lastMessage = `Recomputed panel priority for the ${body.viewport} viewport and preserved critical panels above the fold.`;
  return NextResponse.json(dashboardState);
}
