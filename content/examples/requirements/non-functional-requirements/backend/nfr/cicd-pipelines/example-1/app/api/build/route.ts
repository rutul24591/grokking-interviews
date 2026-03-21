import { jsonOk } from "@/lib/http";
import { getBuildInfo } from "@/lib/buildInfo";

export async function GET() {
  return jsonOk(getBuildInfo());
}

