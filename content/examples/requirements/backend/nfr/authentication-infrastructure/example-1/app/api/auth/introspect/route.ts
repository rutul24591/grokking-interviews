import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { cached } from "@/lib/introspectionCache";
import { introspect } from "@/lib/tokens";

const QuerySchema = z.object({ token: z.string().min(1) });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) return jsonError(400, "invalid_query", { issues: parsed.error.issues });

  const out = cached(`introspect:${parsed.data.token}`, 3000, () => introspect(parsed.data.token));
  return jsonOk({ ok: true, ...out });
}

