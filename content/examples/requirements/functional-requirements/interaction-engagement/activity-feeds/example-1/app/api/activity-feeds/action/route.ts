import { NextRequest, NextResponse } from "next/server";
import { mutate } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { filter: "all" | "following" | "saved" };
  return NextResponse.json(mutate(body.filter));
}
