import { NextResponse } from "next/server";
import { taggingState } from "@/lib/store";
export async function GET() {
  return NextResponse.json(taggingState);
}
