import { NextResponse } from "next/server";
import { z } from "zod";
import { addComment, listComments } from "@/lib/store";

const QuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  cursor: z.string().optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = QuerySchema.parse(Object.fromEntries(url.searchParams.entries()));
  const page = listComments({ limit: query.limit, cursor: query.cursor ?? null });
  return NextResponse.json(page);
}

const FormSchema = z.object({
  author: z.string().min(1).max(40),
  message: z.string().min(1).max(280),
});

export async function POST(req: Request) {
  const url = new URL(req.url);
  const formData = await req.formData();
  const author = String(formData.get("author") ?? "");
  const message = String(formData.get("message") ?? "");
  const parsed = FormSchema.safeParse({ author, message });
  if (!parsed.success) {
    // Progressive enhancement: on a real site you’d re-render with errors. For demo: redirect with a flag.
    return NextResponse.redirect(new URL("/?error=1", url), { status: 303 });
  }

  const created = addComment(parsed.data);

  // If JS enhancement asked for JSON, return JSON; otherwise redirect (PRG).
  const accept = req.headers.get("accept") ?? "";
  const wantsJson = accept.includes("application/json") || req.headers.get("x-enhanced") === "1";
  if (wantsJson) return NextResponse.json({ ok: true, comment: created });

  return NextResponse.redirect(new URL("/?ok=1", url), { status: 303 });
}

