import { cluster } from "@/lib/cluster";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const Schema = z.object({ keys: z.array(z.string().min(1)).min(1).max(5000) }).strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  return jsonOk({ ok: true, result: cluster.assign(parsed.data.keys) });
}

