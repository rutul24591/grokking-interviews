import { keyring } from "@/lib/keyring";
import { jsonOk } from "@/lib/http";

export async function POST() {
  const res = keyring.rotate();
  // Intentionally does not return secret material.
  return jsonOk({ ok: true, ...res });
}

