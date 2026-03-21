import { jsonOk } from "@/lib/http";
import { criticalData } from "@/lib/data";

export async function GET() {
  return jsonOk(await criticalData());
}

