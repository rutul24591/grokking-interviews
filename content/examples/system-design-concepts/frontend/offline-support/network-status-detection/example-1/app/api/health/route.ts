function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function HEAD(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") || "ok";
  const delayMs = Number(url.searchParams.get("delayMs") || 0);

  if (delayMs > 0) await sleep(Math.min(delayMs, 10_000));

  if (mode === "fail") {
    return new Response(null, { status: 503 });
  }
  return new Response(null, { status: 204 });
}

export async function GET(req: Request) {
  const res = await HEAD(req);
  if (!res.ok && res.status !== 204) return res;
  return Response.json({ ok: true, at: new Date().toISOString() }, { status: res.status === 204 ? 200 : res.status });
}

