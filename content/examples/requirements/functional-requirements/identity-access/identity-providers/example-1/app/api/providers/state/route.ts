import { NextResponse } from "next/server";
import { providers } from "@/lib/store";

export async function GET() {
  return NextResponse.json(providers);
}
