import { NextResponse } from "next/server";
import { storageState } from "@/lib/store";
export async function GET() {
  return NextResponse.json(storageState);
}
