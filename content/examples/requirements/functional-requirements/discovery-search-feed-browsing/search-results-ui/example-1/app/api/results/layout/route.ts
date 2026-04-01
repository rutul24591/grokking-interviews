import { NextRequest, NextResponse } from "next/server";
import { searchResultsUiState, type ViewMode } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { viewMode: ViewMode };
  searchResultsUiState.viewMode = body.viewMode;
  searchResultsUiState.lastMessage = body.viewMode === "compact"
    ? "Compact mode prioritizes density for scanning many results quickly."
    : "Detailed mode prioritizes decision quality with richer snippets and labels.";
  return NextResponse.json(searchResultsUiState);
}
