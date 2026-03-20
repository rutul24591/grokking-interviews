import { jsonError, jsonOk } from "@/lib/http";
import { createObjectStore } from "@/lib/objectStore";

export async function GET(req: Request, ctx: { params: Promise<{ key: string }> }) {
  const { key } = await ctx.params;
  const store = createObjectStore(req);
  const obj = await store.getText(key);
  if (!obj) return jsonError(404, "not_found");
  return jsonOk({ ok: true, provider: store.provider, ref: obj.ref, value: obj.value });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ key: string }> }) {
  const { key } = await ctx.params;
  const store = createObjectStore(req);
  const ok = await store.delete(key);
  if (!ok) return jsonError(404, "not_found");
  return jsonOk({ ok: true, provider: store.provider });
}

