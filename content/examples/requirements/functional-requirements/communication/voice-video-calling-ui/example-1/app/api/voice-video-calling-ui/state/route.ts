import { NextResponse } from "next/server";
import { getSnapshot } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getSnapshot());
}
