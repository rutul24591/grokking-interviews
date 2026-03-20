import { auditLog } from "@/lib/auditLog";
import { jsonOk } from "@/lib/http";

export async function GET() {
  return jsonOk(auditLog.verify());
}

