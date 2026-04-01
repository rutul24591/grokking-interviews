import { NextResponse } from "next/server";
import { searchState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(searchState);
}
