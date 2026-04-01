import { NextRequest, NextResponse } from "next/server";
import { reportingState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { surface: string; severity: "warning" | "error"; fingerprint: string };
  const existing = reportingState.events.find((event) => event.fingerprint === body.fingerprint);
  if (existing) existing.count += 1;
  else reportingState.events.unshift({ id: `e${reportingState.events.length + 1}`, count: 1, ...body });
  reportingState.lastMessage = `Captured ${body.severity} from ${body.surface} with fingerprint ${body.fingerprint}.`;
  return NextResponse.json(reportingState);
}
