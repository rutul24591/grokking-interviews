declare global {
  // eslint-disable-next-line no-var
  var __PING_COUNT__: number | undefined;
}

export async function GET() {
  globalThis.__PING_COUNT__ ??= 0;
  globalThis.__PING_COUNT__ += 1;
  return Response.json({ ok: true, count: globalThis.__PING_COUNT__, ts: Date.now() });
}

