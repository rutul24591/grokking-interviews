import { NextRequest, NextResponse } from "next/server";
import { globalHandlerState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    channel: "window.onerror" | "unhandledrejection";
    message: string;
    severity?: "warning" | "error" | "fatal";
  };
  const existing = globalHandlerState.incidents.find(
    (incident) => incident.channel === body.channel && incident.message === body.message
  );

  if (existing) {
    existing.duplicateCount += 1;
    existing.severity = body.severity ?? existing.severity;
    globalHandlerState.lastMessage = `Suppressed duplicate ${body.channel} event and incremented the incident counter.`;
    return NextResponse.json(globalHandlerState);
  }

  globalHandlerState.incidents.unshift({
    id: `g${globalHandlerState.incidents.length + 1}`,
    acknowledged: false,
    severity: body.severity ?? "error",
    duplicateCount: 1,
    channel: body.channel,
    message: body.message
  });
  globalHandlerState.lastMessage = `Captured a ${body.channel} event and promoted it to the global handler queue.`;
  return NextResponse.json(globalHandlerState);
}
