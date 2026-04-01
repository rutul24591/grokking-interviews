import { NextResponse } from "next/server";
import { chartState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(chartState);
}
