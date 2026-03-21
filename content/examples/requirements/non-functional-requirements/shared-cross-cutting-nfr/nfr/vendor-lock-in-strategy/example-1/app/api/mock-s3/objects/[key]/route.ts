import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { mockS3Delete, mockS3Get, mockS3Put } from "@/lib/mockS3Store";
import { sha256Etag } from "@/lib/objectStore";

const BodySchema = z.object({
  value: z.string().max(200_000),
});

export async function GET(_req: Request, ctx: { params: Promise<{ key: string }> }) {
  const { key } = await ctx.params;
  const obj = mockS3Get(key);
  if (!obj) return jsonError(404, "not_found");
  return jsonOk({
    ok: true,
    ref: { key: obj.key, size: obj.value.length, updatedAt: obj.updatedAt, etag: obj.etag },
    value: obj.value,
  });
}

export async function PUT(req: Request, ctx: { params: Promise<{ key: string }> }) {
  const { key } = await ctx.params;
  const body = BodySchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return jsonError(400, "invalid_body");
  const etag = sha256Etag(body.data.value);
  const obj = mockS3Put(key, body.data.value, etag);
  return jsonOk({
    ok: true,
    ref: { key: obj.key, size: obj.value.length, updatedAt: obj.updatedAt, etag: obj.etag },
  });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ key: string }> }) {
  const { key } = await ctx.params;
  const ok = mockS3Delete(key);
  if (!ok) return jsonError(404, "not_found");
  return jsonOk({ ok: true });
}

