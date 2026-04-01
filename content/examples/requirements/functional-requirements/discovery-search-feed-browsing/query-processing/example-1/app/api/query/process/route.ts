import { NextRequest, NextResponse } from "next/server";
import { queryState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { rawQuery: string };
  const normalizedQuery = body.rawQuery.trim().toLowerCase().replace(/\s+/g, ' ');
  const parts = normalizedQuery.split(' ');
  queryState.rawQuery = body.rawQuery;
  queryState.normalizedQuery = normalizedQuery;
  queryState.tokens = parts.filter((part) => !part.includes(':'));
  queryState.filters = parts.filter((part) => part.includes(':'));
  queryState.lastMessage = 'Processed incoming query into free text and filter tokens.';
  return NextResponse.json(queryState);
}
