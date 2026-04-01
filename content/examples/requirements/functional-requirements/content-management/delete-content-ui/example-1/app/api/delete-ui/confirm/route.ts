import { NextRequest, NextResponse } from "next/server";
import { deleteUiState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { id: string; confirmation: "pending" | "confirmed" };
  deleteUiState.candidates = deleteUiState.candidates.map((candidate) =>
    candidate.id === body.id ? { ...candidate, confirmation: body.confirmation } : candidate
  );
  deleteUiState.lastMessage = `Updated deletion confirmation state for ${body.id}.`;
  return NextResponse.json(deleteUiState);
}
