import { NextRequest, NextResponse } from "next/server";
import { mutate } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { activePanel: "overview" | "queues" | "alerts" };
  return NextResponse.json(mutate(body.activePanel));
}
