import { NextResponse } from "next/server";
import { auth } from "@/lib/store";

export async function GET() {
  return NextResponse.json(auth);
}
