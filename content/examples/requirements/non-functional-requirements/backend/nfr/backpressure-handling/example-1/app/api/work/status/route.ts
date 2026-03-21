import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { getJob } from "@/lib/workQueue";

const QuerySchema = z.object({ jobId: z.string().min(1) });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) return jsonError(400, "invalid_query", { issues: parsed.error.issues });
  const job = getJob(parsed.data.jobId);
  if (!job) return jsonError(404, "job_not_found");
  return jsonOk({ ok: true, job });
}

