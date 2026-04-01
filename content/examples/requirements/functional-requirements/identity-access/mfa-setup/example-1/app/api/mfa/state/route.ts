import { NextResponse } from "next/server";
import { mfa } from "@/lib/store";

export async function GET() {
  return NextResponse.json(mfa);
}
