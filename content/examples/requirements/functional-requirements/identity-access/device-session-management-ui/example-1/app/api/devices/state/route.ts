import { NextResponse } from "next/server";
import { sessions } from "@/lib/store";

export async function GET() {
  return NextResponse.json(sessions);
}
