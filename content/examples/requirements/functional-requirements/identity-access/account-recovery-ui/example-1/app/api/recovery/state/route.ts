import { NextResponse } from "next/server";
import { state } from "@/lib/store";

export async function GET() {
  return NextResponse.json(state());
}
