import { z } from "zod";

export const runtime = "nodejs";

const BodySchema = z.object({
  userId: z.string().min(1),
  flagKey: z.string().min(1)
});

const Seen = new Set<string>();

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const body = BodySchema.safeParse(json);
  if (!body.success) return Response.json({ ok: false }, { status: 400 });

  const key = `${body.data.flagKey}:${body.data.userId}`;
  const deduped = Seen.has(key);
  if (!deduped) Seen.add(key);

  // In production: append to Kafka / pubsub, or write to an analytics sink asynchronously.
  return Response.json({ ok: true, deduped });
}

