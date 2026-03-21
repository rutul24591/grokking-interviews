import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { listStolen, recordStolen, resetStolen } from "@/lib/exfiltration";

const BodySchema = z.object({ token: z.string().min(1) });

export async function GET() {
  return jsonOk({ ok: true, stolen: listStolen() });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "invalid_json");
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_payload", { issues: parsed.error.issues });
  recordStolen(parsed.data.token);
  return jsonOk({ ok: true, stolen: listStolen() });
}

export async function DELETE() {
  resetStolen();
  return jsonOk({ ok: true, stolen: [] });
}

