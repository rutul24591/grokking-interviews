import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hasPost } from "@/lib/posts";

export const runtime = "nodejs";

const BodySchema = z.object({
  token: z.string().min(1),
  slug: z.string().min(1)
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const body = BodySchema.safeParse(json);
  if (!body.success) return Response.json({ error: "bad_request" }, { status: 400 });

  const expected = process.env.REVALIDATE_TOKEN ?? "dev";
  if (body.data.token !== expected) return Response.json({ error: "forbidden" }, { status: 403 });
  if (!hasPost(body.data.slug)) return Response.json({ error: "not_found" }, { status: 404 });

  revalidatePath(`/blog/${body.data.slug}`);
  return Response.json({ ok: true, revalidated: `/blog/${body.data.slug}` });
}

