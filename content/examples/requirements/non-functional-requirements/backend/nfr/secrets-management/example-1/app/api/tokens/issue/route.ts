import { keyring } from "@/lib/keyring";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const Schema = z.object({ sub: z.string().min(1) }).strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  return jsonOk({ ok: true, ...keyring.issue(parsed.data.sub) });
}

