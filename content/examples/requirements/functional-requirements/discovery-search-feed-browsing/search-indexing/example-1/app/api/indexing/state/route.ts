import { NextResponse } from "next/server";
import { indexingState } from "@/lib/store";
export async function GET() {
  return NextResponse.json(indexingState);
}
