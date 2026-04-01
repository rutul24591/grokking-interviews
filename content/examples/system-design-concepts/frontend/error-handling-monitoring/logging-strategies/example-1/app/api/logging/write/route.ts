import { NextRequest, NextResponse } from "next/server";
import { loggingState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { level: 'info' | 'warn' | 'error'; category: string; message: string };
  loggingState.events.unshift({ id: `l${loggingState.events.length + 1}`, ...body });
  loggingState.lastMessage = `Logged ${body.level} event for ${body.category}.`;
  return NextResponse.json(loggingState);
}
