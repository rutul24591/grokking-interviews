import { NextResponse } from "next/server";
import { analyticsState } from "@/lib/store";
export async function GET() {
  return NextResponse.json(analyticsState);
}
