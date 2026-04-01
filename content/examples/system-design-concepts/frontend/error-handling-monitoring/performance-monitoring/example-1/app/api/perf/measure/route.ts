import { NextRequest, NextResponse } from "next/server";
import { perfState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { id: string; value: number };
  perfState.metrics = perfState.metrics.map((metric) =>
    metric.id === body.id
      ? {
          ...metric,
          trend: body.value > metric.value ? "up" : body.value < metric.value ? "down" : "flat",
          value: body.value
        }
      : metric
  );
  const failingMetrics = perfState.metrics.filter((metric) => metric.value > metric.budget);
  perfState.lastMessage =
    failingMetrics.length > 0
      ? `Budget alert for ${failingMetrics.map((metric) => metric.name).join(", ")}. Owners should investigate regressions before the next release.`
      : `Updated ${body.id} measurement and re-evaluated the budget state.`;
  return NextResponse.json(perfState);
}
