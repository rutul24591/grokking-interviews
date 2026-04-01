import { NextResponse } from "next/server";
import { renderingState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(renderingState);
}
