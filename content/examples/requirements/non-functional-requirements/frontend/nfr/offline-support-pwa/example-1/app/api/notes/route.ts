import { jsonOk } from "@/lib/http";
import { listNotes } from "@/lib/notes";

export async function GET() {
  // Keep the API response cache-neutral. Offline caching is owned by the service worker.
  return jsonOk(listNotes());
}

