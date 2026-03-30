function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const failRate = Math.min(1, Math.max(0, Number(url.searchParams.get("failRate") || 0)));
  const delayMs = Math.min(5_000, Math.max(0, Number(url.searchParams.get("delayMs") || 0)));

  if (delayMs) await sleep(delayMs);

  const rnd = Math.random();
  if (rnd < failRate) {
    return Response.json(
      { ok: false, error: "simulated-failure", rnd, failRate, at: new Date().toISOString() },
      { status: 503 },
    );
  }

  return Response.json({ ok: true, value: Math.random().toString(16).slice(2), rnd, failRate, at: new Date().toISOString() });
}

