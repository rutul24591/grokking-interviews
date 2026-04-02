import { kv, type Region } from "@/lib/multiRegionKv";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const QuerySchema = z.object({
  region: z.enum(["us-east", "eu-west"]),
  key: z.string().min(1),
  consistency: z.enum(["local", "session"]).default("local"),
  sessionId: z.string().optional()
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    region: url.searchParams.get("region") ?? "us-east",
    key: url.searchParams.get("key") ?? "",
    consistency: url.searchParams.get("consistency") ?? "local",
    sessionId: url.searchParams.get("sessionId") ?? undefined
  });
  if (!parsed.success) return jsonError(400, "invalid_query", { issues: parsed.error.issues });

  const res = kv.get(parsed.data.region as Region, parsed.data.key);
  if (parsed.data.consistency === "session" && parsed.data.sessionId) {
    const required = kv.requiredVersion(parsed.data.sessionId);
    if (required > 0 && res.version < required) {
      return jsonError(409, "stale_read", {
        requiredVersion: required,
        observedVersion: res.version,
        hint: "retry or read from write region"
      });
    }
  }

  return jsonOk({ ok: true, region: parsed.data.region, ...res });
}

