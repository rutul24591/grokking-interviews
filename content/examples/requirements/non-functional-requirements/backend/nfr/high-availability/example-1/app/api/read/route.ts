import { cluster } from "@/lib/haCluster";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const QuerySchema = z.object({ key: z.string().min(1), from: z.enum(["A", "B"]).optional() });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    key: url.searchParams.get("key") ?? "",
    from: url.searchParams.get("from") ?? undefined
  });
  if (!parsed.success) return jsonError(400, "invalid_query", { issues: parsed.error.issues });
  try {
    const value = cluster.read(parsed.data.key, parsed.data.from);
    return jsonOk({ ok: true, value });
  } catch (e) {
    return jsonError(503, "node_down");
  }
}

