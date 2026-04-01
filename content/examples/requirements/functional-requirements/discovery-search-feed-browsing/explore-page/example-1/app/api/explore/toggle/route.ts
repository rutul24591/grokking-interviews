import { NextRequest, NextResponse } from "next/server";
import { exploreState, type ExploreModuleKey } from "@/lib/store";

function fallbackCards(module: ExploreModuleKey) {
  return [{ id: `${module}-fallback`, title: `Fallback ${module} card`, source: "fallback", score: 0.4 }];
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    module: ExploreModuleKey;
    enabled: boolean;
    region: "homepage" | "explore";
    order: ExploreModuleKey[];
  };

  exploreState.enabled[body.module] = body.enabled;
  exploreState.region = body.region;
  exploreState.order = body.order;

  if (!body.enabled && body.region === "homepage") {
    exploreState.modules[body.module] = fallbackCards(body.module);
  }

  exploreState.lastMessage = `${body.module} ${body.enabled ? "enabled" : "degraded"} for the ${body.region} surface with updated module ordering.`;
  return NextResponse.json(exploreState);
}
