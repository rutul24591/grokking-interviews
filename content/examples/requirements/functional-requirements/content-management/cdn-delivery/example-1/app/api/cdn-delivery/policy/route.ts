import { NextRequest, NextResponse } from "next/server";
import { cdnDeliveryState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { routeId: string; cacheScope: "edge" | "regional" | "origin" };
  cdnDeliveryState.routes = cdnDeliveryState.routes.map((route) =>
    route.id === body.routeId ? { ...route, cacheScope: body.cacheScope } : route
  );
  cdnDeliveryState.lastMessage = `Updated ${body.routeId} to ${body.cacheScope} caching to reflect content volatility and origin cost.`;
  return NextResponse.json(cdnDeliveryState);
}
