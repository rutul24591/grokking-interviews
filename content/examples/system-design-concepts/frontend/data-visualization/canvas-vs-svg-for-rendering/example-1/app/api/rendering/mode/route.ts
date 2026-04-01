import { NextRequest, NextResponse } from "next/server";
import { renderingState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { mode: "svg" | "canvas" };
  renderingState.mode = body.mode;
  renderingState.hitTesting = body.mode === "svg" ? "per-node" : "math-based-overlay";
  renderingState.lastMessage =
    body.mode === "svg"
      ? "Switched to SVG for accessible labels, DOM-level hit targets, and simpler annotation support."
      : "Switched to Canvas for denser scenes where DOM node count would overwhelm layout and paint budgets.";
  return NextResponse.json(renderingState);
}
