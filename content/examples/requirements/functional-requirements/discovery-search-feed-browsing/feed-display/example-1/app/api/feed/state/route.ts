import { NextResponse } from "next/server";
import { feedState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(feedState);
}
