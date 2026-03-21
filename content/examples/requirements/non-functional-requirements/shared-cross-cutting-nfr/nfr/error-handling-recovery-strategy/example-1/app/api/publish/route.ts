import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore, type PublishResult } from "@/lib/store";
import { withRetry } from "@/lib/retry";

const BodySchema = z.object({
  idempotencyKey: z.string().min(8),
  contentId: z.string().min(1),
  retry: z
    .object({
      maxAttempts: z.number().int().min(1).max(10).default(4),
      baseDelayMs: z.number().int().min(10).max(1000).default(60),
      maxDelayMs: z.number().int().min(50).max(5000).default(800),
      jitterPct: z.number().min(0).max(1).default(0.2),
    })
    .default({}),
});

function isRetryable(e: unknown) {
  if (!(e instanceof Error)) return false;
  return e.message.includes("503") || e.message.includes("timeout");
}

async function callDependency(baseUrl: string): Promise<{ writeId: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 800);
  try {
    const res = await fetch(new URL("/api/dependency", baseUrl), {
      method: "POST",
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`${res.status} dependency`);
    return (await res.json()) as { writeId: string };
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw new Error("timeout");
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: Request) {
  const baseUrl = new URL(req.url).origin;
  const body = BodySchema.parse(await req.json());
  const s = getStore();

  const existing = s.idempotency.get(body.idempotencyKey);
  if (existing?.status === "ok") {
    return NextResponse.json({ ok: true, deduped: true, result: existing.result });
  }
  if (existing?.status === "error") {
    return NextResponse.json(
      { ok: false, deduped: true, error: existing.error },
      { status: 502 },
    );
  }

  if (!s.breaker.canAttempt()) {
    return NextResponse.json(
      { ok: false, error: "circuit_open" },
      { status: 503 },
    );
  }

  try {
    const { value, attempts } = await withRetry({
      policy: body.retry,
      fn: async () => callDependency(baseUrl),
      retryable: isRetryable,
    });

    const result: PublishResult = {
      publishedAt: new Date().toISOString(),
      dependencyWriteId: value.writeId,
    };
    s.idempotency.set(body.idempotencyKey, { status: "ok", result });
    s.breaker.onSuccess();
    return NextResponse.json({ ok: true, deduped: false, attempts, result });
  } catch (e) {
    s.breaker.onFailure();
    const msg = e instanceof Error ? e.message : String(e);
    s.idempotency.set(body.idempotencyKey, { status: "error", error: msg });
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}

