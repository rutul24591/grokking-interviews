import { cluster } from "@/lib/haCluster";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const Schema = z.object({ node: z.enum(["A", "B"]) }).strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  cluster.fail(parsed.data.node);
  return jsonOk({ ok: true, state: cluster.snapshot() });
}

