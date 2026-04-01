import { NextRequest, NextResponse } from "next/server";
import { events } from "@/lib/store";

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get("action");
  const result = request.nextUrl.searchParams.get("result");
  const filtered = events.filter((event) => (!action || event.action === action) && (!result || event.result === result));
  return NextResponse.json(filtered);
}
