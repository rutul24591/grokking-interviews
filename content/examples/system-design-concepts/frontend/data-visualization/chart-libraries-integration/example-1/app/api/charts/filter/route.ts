import { NextRequest, NextResponse } from "next/server";
import { chartState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { filter: "daily" | "weekly" | "monthly" };
  chartState.filter = body.filter;
  chartState.lastMessage = `Applied the ${body.filter} view and re-bound normalized series into the chart adapter.`;
  return NextResponse.json(chartState);
}
