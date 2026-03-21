import { cluster } from "@/lib/haCluster";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const Schema = z.object({ key: z.string().min(1), value: z.string().min(1) }).strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  try {
    const res = cluster.write(parsed.data.key, parsed.data.value);
    return jsonOk({ ok: true, ...res });
  } catch (e) {
    return jsonError(503, "leader_down");
  }
}

