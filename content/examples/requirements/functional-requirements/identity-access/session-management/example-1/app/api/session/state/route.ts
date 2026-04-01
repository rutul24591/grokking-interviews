import { NextResponse } from "next/server";
import { sessionState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(sessionState);
}
