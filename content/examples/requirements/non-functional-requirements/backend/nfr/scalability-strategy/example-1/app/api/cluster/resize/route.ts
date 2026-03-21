import { cluster } from "@/lib/cluster";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const Schema = z.object({ shards: z.number().int().min(1).max(64) }).strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  cluster.resize(parsed.data.shards);
  return jsonOk({ ok: true, state: cluster.state() });
}

