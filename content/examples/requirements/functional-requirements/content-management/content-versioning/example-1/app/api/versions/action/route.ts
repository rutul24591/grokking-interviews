import { NextRequest, NextResponse } from "next/server";
import { applyAction } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { type: "restore" | "publish"; versionId: string };
  return NextResponse.json(applyAction(body.type, body.versionId));
}
