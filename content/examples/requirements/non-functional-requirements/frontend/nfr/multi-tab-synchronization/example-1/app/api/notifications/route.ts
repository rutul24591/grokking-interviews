import { jsonOk } from "@/lib/http";
import { getNotifications } from "@/lib/notifications";

export async function GET() {
  return jsonOk(getNotifications());
}

