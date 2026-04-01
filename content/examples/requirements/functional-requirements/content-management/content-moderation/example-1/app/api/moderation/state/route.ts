import { NextResponse } from "next/server";
import { moderationState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(moderationState);
}
