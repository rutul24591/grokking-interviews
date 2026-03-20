import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { issueAccessToken } from "@/lib/tokens";

const BodySchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "invalid_json");
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_payload", { issues: parsed.error.issues });

  // Demo auth: accept any password for a known username
  if (parsed.data.username !== "demo") return jsonError(401, "invalid_credentials");

  const token = issueAccessToken("user_demo", 15_000);
  return jsonOk({ ok: true, accessToken: token.token, expiresAt: token.expiresAt });
}

