import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { runPipeline } from "@/lib/pipeline";

const BodySchema = z.object({
  jobName: z.string().min(1).default("daily-aggregate"),
});

export async function POST(req: Request) {
  const body = BodySchema.parse(await req.json().catch(() => ({})));
  const store = getStore();
  const result = runPipeline({ jobName: body.jobName, ledger: store.ledger, lineage: store.lineage });
  store.lastRun = { jobRunId: result.jobRunId, jobName: body.jobName, ts: new Date().toISOString() };
  return NextResponse.json({ ok: true, result });
}

