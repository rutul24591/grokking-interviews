import { NextResponse } from "next/server";
import { trendingSectionState } from "@/lib/store";
export async function GET() {
  return NextResponse.json(trendingSectionState);
}
