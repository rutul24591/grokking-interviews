export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  priceUsd: number;
  updatedAt: string;
};

const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Aurora Standing Desk",
    tagline: "A stable standing desk with quiet motors and reliable presets.",
    description:
      "This content is rendered on the server (SSR). For SEO, the important part is that the HTML response contains the product details without requiring client-side rendering.",
    priceUsd: 699,
    updatedAt: "2026-03-24"
  },
  {
    id: "p2",
    name: "Quill Mechanical Keyboard",
    tagline: "A keyboard designed for long writing sessions with low fatigue.",
    description:
      "Use SSR/SSG/ISR for public, indexable pages. Treat personalized pages separately and avoid exposing them to search.",
    priceUsd: 179,
    updatedAt: "2026-03-24"
  }
];

export function listProducts(): Product[] {
  return PRODUCTS;
}

export function getProductById(id: string): Product | null {
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

