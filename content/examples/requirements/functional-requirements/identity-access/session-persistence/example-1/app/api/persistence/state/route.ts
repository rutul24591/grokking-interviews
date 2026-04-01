import { NextResponse } from "next/server";
import { persistenceState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(persistenceState);
}
