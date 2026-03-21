import { NextResponse } from "next/server";
import { status } from "@/lib/store";

export async function GET() {
  return NextResponse.json(status());
}

