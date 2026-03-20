import { jsonError, jsonOk } from "@/lib/http";
import { Semaphore } from "@/lib/semaphore";
import { z } from "zod";

const sem = new Semaphore(3, 10);

const QuerySchema = z.object({
  priority: z.enum(["low", "high"]).default("low"),
  durationMs: z.coerce.number().int().positive().max(2000).default(250)
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    priority: url.searchParams.get("priority") ?? "low",
    durationMs: url.searchParams.get("durationMs") ?? "250"
  });
  if (!parsed.success) return jsonError(400, "invalid_query", { issues: parsed.error.issues });

  const before = sem.snapshot();
  if (parsed.data.priority === "low") {
    const release = sem.tryAcquire();
    if (!release) {
      return jsonError(503, "load_shed", { before }, { "Retry-After": "1" });
    }
    try {
      await sem.work(parsed.data.durationMs);
      return jsonOk({ ok: true, priority: "low", before, after: sem.snapshot() });
    } finally {
      release();
    }
  }

  try {
    const release = await sem.acquire();
    try {
      await sem.work(parsed.data.durationMs);
      return jsonOk({ ok: true, priority: "high", before, after: sem.snapshot() });
    } finally {
      release();
    }
  } catch (e) {
    return jsonError(503, "queue_full", { before }, { "Retry-After": "1" });
  }
}

