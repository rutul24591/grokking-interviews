import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  priceUsd: z.number()
});

export type Product = z.infer<typeof ProductSchema>;

const PRODUCTS: Product[] = [
  {
    id: "p_101",
    name: "Distributed Cache Hoodie",
    description:
      "Warm hoodie for cold cache misses. Built for low-latency mornings and high-throughput afternoons.",
    priceUsd: 79
  },
  {
    id: "p_102",
    name: "Latency Budget Notebook",
    description:
      "Notebook for writing requirements, performance budgets, and incident follow-ups without dropping context.",
    priceUsd: 18
  }
];

export async function getProduct(id: string): Promise<Product | null> {
  // In real life: fetch from CMS/DB; here we keep it deterministic.
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

export async function listProducts(): Promise<Product[]> {
  return PRODUCTS;
}

