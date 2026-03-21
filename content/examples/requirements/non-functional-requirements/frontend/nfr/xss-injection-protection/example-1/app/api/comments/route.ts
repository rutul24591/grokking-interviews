import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { addComment, listComments, resetComments } from "@/lib/comments";

const BodySchema = z.object({
  author: z.string().min(1).max(40),
  text: z.string().min(1).max(500)
});

export async function GET() {
  return jsonOk({ ok: true, comments: listComments() });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "invalid_json");
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_payload", { issues: parsed.error.issues });
  const c = addComment(parsed.data.author, parsed.data.text);
  return jsonOk({ ok: true, comment: c });
}

export async function DELETE() {
  resetComments();
  return jsonOk({ ok: true });
}

