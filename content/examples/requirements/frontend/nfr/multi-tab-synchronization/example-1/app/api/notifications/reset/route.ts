import { jsonOk } from "@/lib/http";
import { resetNotifications } from "@/lib/notifications";

export async function POST() {
  resetNotifications();
  return jsonOk({ ok: true });
}

