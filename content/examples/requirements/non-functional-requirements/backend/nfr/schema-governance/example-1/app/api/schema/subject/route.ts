import { registry } from "@/lib/schemaRegistry";
import { jsonError, jsonOk } from "@/lib/http";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const subject = (url.searchParams.get("subject") || "").trim();
  if (!subject) return jsonError(400, "missing_subject");
  return jsonOk({ ok: true, subject, schemas: registry.get(subject) });
}

