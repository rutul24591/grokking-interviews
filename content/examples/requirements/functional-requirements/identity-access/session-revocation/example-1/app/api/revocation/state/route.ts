import { NextResponse } from "next/server";
import { revocationState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(revocationState);
}
