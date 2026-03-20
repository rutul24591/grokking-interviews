import { jsonError, jsonOk } from "@/lib/http";
import { evaluate, getConfig } from "@/lib/store";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") || "";
  if (!userId) return jsonError(400, "missing_userId");
  return jsonOk({ ok: true, config: getConfig(), userId, ...evaluate(userId) });
}

