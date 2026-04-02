import { jsonOk } from "@/lib/http";
import { resetNotes } from "@/lib/notes";

export async function POST() {
  resetNotes();
  return jsonOk({ ok: true });
}

