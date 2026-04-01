import { NextResponse } from "next/server";
import { previewState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(previewState);
}
