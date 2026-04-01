import { NextRequest, NextResponse } from "next/server";
import { categorizationState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { id: string; primaryCategory: string; secondaryCategory: string };
  categorizationState.assignments = categorizationState.assignments.map((assignment) =>
    assignment.id === body.id ? { ...assignment, primaryCategory: body.primaryCategory, secondaryCategory: body.secondaryCategory, confidence: "high" as const } : assignment
  );
  categorizationState.lastMessage = `Saved category assignment for ${body.id} and promoted it to the reviewed taxonomy state.`;
  return NextResponse.json(categorizationState);
}
