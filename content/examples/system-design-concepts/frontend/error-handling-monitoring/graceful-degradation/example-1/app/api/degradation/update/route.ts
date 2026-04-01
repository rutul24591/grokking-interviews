import { NextRequest, NextResponse } from "next/server";
import { degradationState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { id: string; mode: "full" | "degraded" };
  degradationState.capabilities = degradationState.capabilities.map((cap) =>
    cap.id === body.id ? { ...cap, mode: body.mode } : cap
  );
  const degradedCritical = degradationState.capabilities.filter((cap) => cap.critical && cap.mode === "degraded").length;
  degradationState.degradedBanner = degradedCritical >= 2 ? "global" : degradedCritical === 1 ? "localized" : "none";
  degradationState.lastMessage = `Switched ${body.id} into ${body.mode} mode while preserving the fallback surface.`;
  return NextResponse.json(degradationState);
}
