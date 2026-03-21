import { keyring } from "@/lib/keyring";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const Schema = z.object({ token: z.string().min(1) }).strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });

  const res = keyring.verify(parsed.data.token);
  if (!res.ok) return jsonError(401, res.error);
  return jsonOk({ ok: true, sub: res.payload.sub, kid: res.kid });
}

