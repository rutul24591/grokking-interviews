import { NextResponse } from "next/server";
import { realtimeState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(realtimeState);
}
