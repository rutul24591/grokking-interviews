import { jsonOk } from "@/lib/http";
import { issueBearer } from "@/lib/auth";

export async function POST() {
  const t = issueBearer("user_1");
  return jsonOk({ ok: true, mode: "bearer" as const, token: t.token });
}

