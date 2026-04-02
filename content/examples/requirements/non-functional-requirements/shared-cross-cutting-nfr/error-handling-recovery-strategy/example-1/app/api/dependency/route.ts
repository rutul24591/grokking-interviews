import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function POST() {
  // Flaky behavior: random 503 + random latency spike.
  const p = Math.random();
  if (p < 0.2) return NextResponse.json({ error: "dependency unavailable" }, { status: 503 });
  if (p < 0.35) await sleep(600);
  else await sleep(40 + Math.floor(Math.random() * 80));

  const s = getStore();
  s.dependencyWrites += 1;
  return NextResponse.json({ ok: true, writeId: `w-${s.dependencyWrites}` });
}

