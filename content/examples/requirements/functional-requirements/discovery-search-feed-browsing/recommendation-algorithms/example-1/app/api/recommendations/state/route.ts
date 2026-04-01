import { NextResponse } from "next/server";
import { recommendationState } from "@/lib/store";
export async function GET() {
  return NextResponse.json(recommendationState);
}
