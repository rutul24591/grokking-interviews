import { NextRequest, NextResponse } from "next/server";
import { mutate } from "@/lib/store";

export async function POST(_request: NextRequest) {
  return NextResponse.json(mutate("switch-window"));
}
