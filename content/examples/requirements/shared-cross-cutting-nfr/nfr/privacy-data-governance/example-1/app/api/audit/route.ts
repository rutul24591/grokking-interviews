import { NextResponse } from "next/server";
import { auditLog } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ audit: auditLog() });
}

