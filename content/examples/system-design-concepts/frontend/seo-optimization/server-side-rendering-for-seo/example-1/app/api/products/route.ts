import { listProducts } from "@/lib/products";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ products: listProducts() });
}

