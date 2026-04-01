import { NextResponse } from "next/server";
import { interactiveState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(interactiveState);
}
