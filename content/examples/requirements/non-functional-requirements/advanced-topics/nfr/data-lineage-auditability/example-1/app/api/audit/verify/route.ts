import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export async function GET() {
  const store = getStore();
  const verification = store.ledger.verify();
  return NextResponse.json({
    verification,
    headHash: store.ledger.headHash(),
  });
}

