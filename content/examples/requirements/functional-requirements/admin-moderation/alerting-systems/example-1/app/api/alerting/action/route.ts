import { NextRequest, NextResponse } from "next/server";
import { mutate } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { type: "ack" | "tighten-noise"; id?: string };
  return NextResponse.json(mutate(body.type, body.id));
}
