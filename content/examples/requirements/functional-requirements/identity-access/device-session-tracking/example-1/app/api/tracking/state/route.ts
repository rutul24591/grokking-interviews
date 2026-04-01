import { NextResponse } from "next/server";
import { ledger } from "@/lib/store";

export async function GET() {
  return NextResponse.json(ledger);
}
