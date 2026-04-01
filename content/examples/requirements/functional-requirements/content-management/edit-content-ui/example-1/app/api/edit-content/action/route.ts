import { NextRequest, NextResponse } from "next/server";
import { updateField } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { field: "title" | "summary" | "status"; value: string };
  return NextResponse.json(updateField(body.field, body.value));
}
