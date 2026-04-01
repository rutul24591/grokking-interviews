import { NextRequest, NextResponse } from "next/server";
import { boundaryState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { widgetId: string };
  boundaryState.widgets = boundaryState.widgets.map((widget) =>
    widget.id === body.widgetId ? { ...widget, status: "healthy" as const } : widget
  );
  boundaryState.selectedWidget = body.widgetId;
  boundaryState.fallbackVisible = false;
  boundaryState.lastMessage = `Reset the failing widget ${body.widgetId} without reloading the page shell.`;
  return NextResponse.json(boundaryState);
}
