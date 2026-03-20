import { log } from "@/lib/durableLog";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const AppendSchema = z.object({ payload: z.string().min(1), mode: z.enum(["memory", "durable"]) }).strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = AppendSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  const entry = log.append(parsed.data.payload, parsed.data.mode);
  return jsonOk({ ok: true, entry });
}

