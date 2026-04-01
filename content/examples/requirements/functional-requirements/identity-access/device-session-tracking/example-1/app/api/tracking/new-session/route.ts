import { NextRequest, NextResponse } from "next/server";
import { ledger } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { fingerprint: string; platform: string; trusted: boolean };
  ledger.unshift({ id: `sess-${ledger.length + 1}`, fingerprint: body.fingerprint, platform: body.platform, trusted: body.trusted, createdAt: new Date().toISOString() });
  return NextResponse.json(ledger);
}
