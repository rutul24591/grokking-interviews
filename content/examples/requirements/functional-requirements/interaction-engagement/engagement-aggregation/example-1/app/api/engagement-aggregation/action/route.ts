import { NextRequest, NextResponse } from "next/server";
import { mutate } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { window: "hour" | "day" | "week" };
  return NextResponse.json(mutate(body.window));
}
