import { auditLog } from "@/lib/auditLog";
import { jsonOk } from "@/lib/http";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") || "100"), 500);
  return jsonOk({ logs: auditLog.list(limit), limit });
}

