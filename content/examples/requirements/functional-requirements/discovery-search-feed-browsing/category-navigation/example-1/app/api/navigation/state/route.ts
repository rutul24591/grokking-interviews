import { NextResponse } from "next/server";
import { navigationState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(navigationState);
}
