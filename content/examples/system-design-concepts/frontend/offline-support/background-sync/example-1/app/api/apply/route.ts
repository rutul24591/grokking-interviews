type ApplyReq = { id: string; idempotencyKey: string; payload: unknown };

const seen = new Map<string, { firstSeenAt: number }>();

export async function POST(req: Request) {
  const body = (await req.json()) as ApplyReq;
  const key = req.headers.get("x-idempotency-key") || body.idempotencyKey;
  if (!key) return Response.json({ ok: false, error: "missing-idempotency-key" }, { status: 400 });

  if (seen.has(key)) {
    return Response.json({ ok: true, deduped: true, key, at: new Date().toISOString() });
  }

  seen.set(key, { firstSeenAt: Date.now() });

  return Response.json({
    ok: true,
    deduped: false,
    applied: { id: body.id, payload: body.payload },
    key,
    at: new Date().toISOString()
  });
}

