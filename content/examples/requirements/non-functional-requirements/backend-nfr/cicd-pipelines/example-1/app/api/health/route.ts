import { jsonOk } from "@/lib/http";
import { getBuildInfo } from "@/lib/buildInfo";

export async function GET() {
  return jsonOk({
    ok: true,
    build: getBuildInfo(),
    now: new Date().toISOString()
  });
}

