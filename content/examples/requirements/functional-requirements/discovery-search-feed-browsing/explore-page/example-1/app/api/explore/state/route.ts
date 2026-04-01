import { NextResponse } from "next/server";
import { exploreState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(exploreState);
}
