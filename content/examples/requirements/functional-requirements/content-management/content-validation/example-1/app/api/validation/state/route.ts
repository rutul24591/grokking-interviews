import { NextResponse } from "next/server";
import { validationState } from "@/lib/store";
export async function GET() {
  return NextResponse.json(validationState);
}
