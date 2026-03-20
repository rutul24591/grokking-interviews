import { jsonError, jsonOk } from "@/lib/http";
import { flaky } from "@/lib/store";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key") || "default";
  const r = flaky(key);
  if (!r.ok) return jsonError(503, "upstream_unavailable", { attempt: r.attempt });
  return jsonOk({ ok: true, attempt: r.attempt, data: { message: "success" } });
}

