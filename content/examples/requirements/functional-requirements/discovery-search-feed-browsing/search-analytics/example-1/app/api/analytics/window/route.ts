import { NextRequest, NextResponse } from "next/server";
import { analyticsState, type WindowKey } from "@/lib/store";
const multipliers: Record<WindowKey, number> = { '24h': 0.5, '7d': 1, '30d': 1.8 };
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { window: WindowKey };
  analyticsState.window = body.window;
  const factor = multipliers[body.window];
  analyticsState.queries = analyticsState.queries.map((query, index) => ({
    ...query,
    searches: Math.round(query.searches * factor),
    ctr: Number(Math.max(0.1, query.ctr - index * 0.01 + (body.window === '24h' ? 0.02 : 0)).toFixed(2)),
    zeroResultRate: Number(Math.min(0.4, query.zeroResultRate + (body.window === '30d' ? 0.02 : 0)).toFixed(2))
  }));
  analyticsState.lastMessage = `Switched analytics window to ${body.window}.`;
  return NextResponse.json(analyticsState);
}
