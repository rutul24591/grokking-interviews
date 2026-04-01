import { NextResponse } from "next/server";
import { deleteUiState } from "@/lib/store";
export async function GET() {
  return NextResponse.json(deleteUiState);
}
