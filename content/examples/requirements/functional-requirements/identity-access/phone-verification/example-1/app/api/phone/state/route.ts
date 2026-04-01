import { NextResponse } from "next/server";
import { phoneState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(phoneState);
}
