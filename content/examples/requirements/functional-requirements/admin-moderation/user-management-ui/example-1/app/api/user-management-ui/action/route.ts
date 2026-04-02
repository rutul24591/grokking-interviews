import { NextRequest, NextResponse } from "next/server";
import { mutate } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { type: "rotate-operator" | "suspend-user"; id?: string };
  return NextResponse.json(mutate(body.type, body.id));
}
