import { NextResponse } from "next/server";
import { attempts } from "@/lib/store";

export async function GET() {
  return NextResponse.json(attempts);
}
