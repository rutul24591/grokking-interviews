import { NextResponse } from "next/server";
import { versioningState } from "@/lib/store";
export async function GET() {
  return NextResponse.json(versioningState);
}
