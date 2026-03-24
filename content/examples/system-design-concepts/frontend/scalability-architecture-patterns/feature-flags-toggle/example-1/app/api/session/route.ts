import { cookies } from "next/headers";
import { z } from "zod";
import { writeSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

const FormSchema = z.object({
  userId: z.string().min(1),
  country: z.enum(["US", "IN", "GB", "DE", "BR"])
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const parsed = FormSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return new Response("bad request", { status: 400 });

  const cookieStore = await cookies();
  writeSessionCookie(cookieStore, { userId: parsed.data.userId, country: parsed.data.country });

  return Response.redirect(new URL("/admin", req.url), 303);
}

