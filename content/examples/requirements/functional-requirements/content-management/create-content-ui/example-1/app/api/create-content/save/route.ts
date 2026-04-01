import { NextRequest, NextResponse } from "next/server";
import { createContentState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { id: string; completeness: "complete" | "partial" | "empty" };
  createContentState.templates = createContentState.templates.map((template) =>
    template.id === body.id ? { ...template, completeness: body.completeness } : template
  );
  createContentState.lastMessage = `Updated draft completeness for ${body.id}.`;
  return NextResponse.json(createContentState);
}
