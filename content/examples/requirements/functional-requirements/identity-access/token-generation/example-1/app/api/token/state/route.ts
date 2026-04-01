import { NextResponse } from "next/server";
import { tokenState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(tokenState);
}
