import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export async function GET() {
  const store = getStore();
  const verification = store.ledger.verify();
  const bundle = {
    exportedAt: new Date().toISOString(),
    lastRun: store.lastRun,
    ledgerHeadHash: store.ledger.headHash(),
    verification,
    lineage: store.lineage.snapshot(),
    ledger: store.ledger.list(500),
  };
  return NextResponse.json(bundle);
}

