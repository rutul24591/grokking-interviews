import { NextResponse } from "next/server";
import { relatedState } from "@/lib/store";
export async function GET() {
  return NextResponse.json(relatedState);
}
