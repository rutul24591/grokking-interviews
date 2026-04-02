import { NextRequest, NextResponse } from "next/server";
import { mutate } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { cohort: "today" | "week" | "month" };
  return NextResponse.json(mutate(body.cohort));
}
