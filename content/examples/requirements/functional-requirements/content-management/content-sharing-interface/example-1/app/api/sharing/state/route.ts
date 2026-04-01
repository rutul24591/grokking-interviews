import { NextResponse } from "next/server";
import { sharingState } from "@/lib/store";
export async function GET() {
  return NextResponse.json(sharingState);
}
