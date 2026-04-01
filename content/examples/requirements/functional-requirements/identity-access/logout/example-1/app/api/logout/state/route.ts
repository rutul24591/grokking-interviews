import { NextResponse } from "next/server";
import { logoutState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(logoutState);
}
