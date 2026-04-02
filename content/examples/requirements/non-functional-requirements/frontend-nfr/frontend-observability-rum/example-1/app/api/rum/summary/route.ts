import { jsonOk } from "@/lib/http";
import { getRumSummary } from "@/lib/rum/store";

export async function GET() {
  return jsonOk(getRumSummary());
}

