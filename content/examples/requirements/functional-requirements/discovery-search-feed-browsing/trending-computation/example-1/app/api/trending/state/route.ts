import { NextResponse } from "next/server";
import { trendingComputationState } from "@/lib/store";
export async function GET() {
  return NextResponse.json(trendingComputationState);
}
