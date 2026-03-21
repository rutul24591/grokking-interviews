import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { getDoc, updateDoc } from "@/lib/store";

const PatchSchema = z.object({
  baseVersion: z.number().int().min(0),
  content: z.string().min(0).max(50_000),
  force: z.boolean().optional(),
});

export async function GET() {
  return jsonOk({ ok: true, doc: getDoc() });
}

export async function PATCH(req: Request) {
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return jsonError(415, "unsupported_content_type");
  const body = PatchSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return jsonError(400, "invalid_body");

  const r = updateDoc(body.data.baseVersion, body.data.content, { force: Boolean(body.data.force) });
  if (!r.ok) return jsonError(409, "conflict", { doc: r.doc });
  return jsonOk({ ok: true, doc: r.doc });
}

