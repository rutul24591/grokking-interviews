import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export async function GET() {
  const store = getStore();
  return NextResponse.json({
    lastRun: store.lastRun,
    lineage: store.lineage.snapshot(),
    ledger: store.ledger.list(120),
    headHash: store.ledger.headHash(),
  });
}

