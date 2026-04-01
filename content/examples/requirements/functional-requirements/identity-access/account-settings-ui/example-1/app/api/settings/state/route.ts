import { NextResponse } from "next/server";
import { settings } from "@/lib/store";

export async function GET() {
  return NextResponse.json(settings);
}
