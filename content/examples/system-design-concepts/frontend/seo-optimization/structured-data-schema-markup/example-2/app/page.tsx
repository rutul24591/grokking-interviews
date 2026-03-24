import { productSchema } from "@/lib/productSchema";

export default function Page() {
  const schema = productSchema({
    name: "Latency Budget Notebook",
    description: "Notebook for tracking performance budgets and regressions.",
    sku: "NB-001",
    priceUsd: 18,
    ratingValue: 4.6,
    reviewCount: 214
  });

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Composable Product schema</h1>
      <pre className="overflow-auto rounded border border-white/10 bg-black/30 p-3 text-xs">
        <code>{JSON.stringify(schema, null, 2)}</code>
      </pre>
    </main>
  );
}

