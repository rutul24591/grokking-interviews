import { NextResponse } from "next/server";
import { dashboardState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(dashboardState);
}
