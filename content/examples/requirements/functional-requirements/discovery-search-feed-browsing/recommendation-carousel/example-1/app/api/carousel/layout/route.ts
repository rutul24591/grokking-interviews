import { NextRequest, NextResponse } from "next/server";
import { carouselState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { slot: "hero" | "sidebar" | "footer" };
  carouselState.slot = body.slot;
  const eligible = carouselState.modules
    .filter((module) => module.slot === body.slot && module.inventory > 0)
    .sort((left, right) => right.priority - left.priority)
    .slice(0, body.slot === "hero" ? 2 : 1);
  carouselState.renderedIds = eligible.map((module) => module.id);
  carouselState.lastMessage = `Rendered ${eligible.length} module(s) for the ${body.slot} slot.`;
  return NextResponse.json(carouselState);
}
