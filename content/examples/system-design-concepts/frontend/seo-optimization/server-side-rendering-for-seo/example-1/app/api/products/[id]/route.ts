import { z } from "zod";
import { getProductById } from "@/lib/products";

export const runtime = "nodejs";

const ParamsSchema = z.object({ id: z.string().min(1) });

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = ParamsSchema.parse(await ctx.params);
  const product = getProductById(id);
  if (!product) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json({ product });
}

