import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { addRumEvents } from "@/lib/rum/store";

const TagsSchema = z.record(z.string()).optional();
const EventSchema = z.object({
  id: z.string().min(8),
  ts: z.number().int().positive(),
  sessionId: z.string().min(8),
  page: z.string().min(1),
  type: z.enum(["web_vital", "error", "route", "custom"]),
  name: z.string().min(1),
  value: z.number().optional(),
  unit: z.enum(["ms", "score", "count", "bytes"]).optional(),
  tags: TagsSchema,
});

const BodySchema = z.object({
  app: z.string().min(1),
  version: z.string().min(1),
  events: z.array(EventSchema).min(1).max(50),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "invalid_json");
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "invalid_payload", { issues: parsed.error.issues });
  }

  const ua = req.headers.get("user-agent") || "unknown";
  const accepted = addRumEvents(parsed.data.events, { app: parsed.data.app, version: parsed.data.version, ua });
  return jsonOk({ ok: true, accepted });
}

