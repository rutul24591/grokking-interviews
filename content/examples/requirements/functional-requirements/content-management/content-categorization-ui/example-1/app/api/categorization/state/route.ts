import { NextResponse } from "next/server";
import { categorizationState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(categorizationState);
}
