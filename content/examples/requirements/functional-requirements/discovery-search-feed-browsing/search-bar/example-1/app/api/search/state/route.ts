import { NextResponse } from "next/server";
import { searchBarState } from "@/lib/store";
export async function GET() {
  return NextResponse.json(searchBarState);
}
