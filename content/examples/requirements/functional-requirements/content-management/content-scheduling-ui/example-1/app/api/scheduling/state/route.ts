import { NextResponse } from "next/server";
import { schedulingState } from "@/lib/store";
export async function GET() {
  return NextResponse.json(schedulingState);
}
