import { NextResponse } from "next/server";
import { currentState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(currentState());
}
