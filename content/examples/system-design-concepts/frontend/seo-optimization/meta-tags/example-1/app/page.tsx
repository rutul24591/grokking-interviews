import Link from "next/link";
import { listProducts } from "@/lib/products";

export default async function Page() {
  const products = await listProducts();
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Meta tags demo</h1>
      <p className="text-sm opacity-80">
        Each product page uses <code>generateMetadata()</code> to set title, description, Open Graph, Twitter Card, and canonical URL.
      </p>
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-semibold">Products</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
          {products.map((p) => (
            <li key={p.id}>
              <Link className="text-blue-300 hover:underline" href={`/products/${p.id}`}>
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

