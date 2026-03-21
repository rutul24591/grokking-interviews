import { kv } from "@/lib/replicatedKv";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const QuerySchema = z.object({
  key: z.string().min(1),
  read: z.enum(["leader", "follower"]).default("follower"),
  consistency: z.enum(["none", "ryow"]).default("none"),
  sessionId: z.string().optional()
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    key: url.searchParams.get("key") ?? "",
    read: url.searchParams.get("read") ?? "follower",
    consistency: url.searchParams.get("consistency") ?? "none",
    sessionId: url.searchParams.get("sessionId") ?? undefined
  });
  if (!parsed.success) return jsonError(400, "invalid_query", { issues: parsed.error.issues });

  const { key, read, consistency, sessionId } = parsed.data;
  const res = kv.get(key, read);

  if (read === "follower" && consistency === "ryow" && sessionId) {
    const required = kv.sessionRequiresVersion(sessionId);
    if (required > 0 && res.version < required) {
      return jsonError(409, "stale_read", {
        requiredVersion: required,
        observedVersion: res.version,
        leaderVersion: res.leaderVersion,
        hint: "read from leader or retry after replication catches up"
      });
    }
  }

  return jsonOk({
    ok: true,
    source: read,
    ...res
  });
}

