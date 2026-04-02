import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { createObjectStore } from "@/lib/objectStore";

const CreateSchema = z.object({
  key: z.string().min(1).max(120),
  value: z.string().min(0).max(200_000),
});

export async function GET(req: Request) {
  const store = createObjectStore(req);
  const objects = await store.list();
  return jsonOk({ ok: true, provider: store.provider, capabilities: store.capabilities, objects });
}

export async function POST(req: Request) {
  const store = createObjectStore(req);
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return jsonError(415, "unsupported_content_type");
  const body = CreateSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return jsonError(400, "invalid_body");
  const r = await store.putText(body.data.key, body.data.value);
  return jsonOk({ ok: true, provider: store.provider, ref: r.ref });
}

