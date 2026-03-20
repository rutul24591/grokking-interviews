import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export async function GET() {
  const s = getStore();
  const errorRate = s.metrics.exposures ? s.metrics.errors / s.metrics.exposures : 0;
  return NextResponse.json({ ...s.metrics, errorRate });
}

