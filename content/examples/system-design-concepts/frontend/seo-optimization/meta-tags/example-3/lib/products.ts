export type Product = { id: string; name: string };

const PRODUCTS: Product[] = [
  { id: "p_101", name: "Distributed Cache Hoodie" },
  { id: "p_102", name: "Latency Budget Notebook" }
];

export async function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

