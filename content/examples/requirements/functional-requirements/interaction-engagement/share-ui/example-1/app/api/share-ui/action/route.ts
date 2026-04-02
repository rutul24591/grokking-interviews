import { NextRequest, NextResponse } from "next/server";
import { mutate } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { type: "switch-mode" | "copy-link" };
  return NextResponse.json(mutate(body.type));
}
