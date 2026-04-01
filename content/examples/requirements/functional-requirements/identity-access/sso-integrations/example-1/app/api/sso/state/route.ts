import { NextResponse } from "next/server";
import { ssoState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(ssoState);
}
