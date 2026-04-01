import { NextResponse } from "next/server";
import { socialState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(socialState);
}
