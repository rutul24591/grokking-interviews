import { jsonOk } from "@/lib/http";
import { reset } from "@/lib/workQueue";

export async function POST() {
  reset();
  return jsonOk({ ok: true });
}

