import { NextResponse } from "next/server";
import { lifecycleState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(lifecycleState);
}
