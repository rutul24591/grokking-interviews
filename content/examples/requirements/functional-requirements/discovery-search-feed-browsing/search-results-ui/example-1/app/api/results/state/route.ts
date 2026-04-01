import { NextResponse } from "next/server";
import { searchResultsUiState } from "@/lib/store";
export async function GET() {
  return NextResponse.json(searchResultsUiState);
}
