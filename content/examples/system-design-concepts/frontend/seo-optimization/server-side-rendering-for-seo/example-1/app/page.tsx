import Link from "next/link";
import { listProducts } from "@/lib/products";

export default function Page() {
  const products = listProducts();

  return (
    <main>
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Server-side rendered product pages</h1>
        <p className="mt-2 text-slate-300">
          Each product page is rendered on the server and includes title/description in the initial HTML.
        </p>
      </header>

      <section aria-labelledby="products" className="space-y-4">
        <h2 id="products" className="text-xl font-semibold">
          Products
        </h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {products.map((p) => (
            <li key={p.id}>
              <article className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold">
                  <Link href={`/products/${p.id}`} className="hover:underline">
                    {p.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-slate-300">{p.tagline}</p>
                <p className="mt-3 text-sm text-slate-300">
                  <span className="font-semibold text-slate-100">${p.priceUsd}</span> · Updated{" "}
                  <time dateTime={p.updatedAt}>{p.updatedAt}</time>
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
        <h2 className="text-base font-semibold text-slate-100">What to verify</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            “View Source” for a product page contains the product name/description (SSR output).
          </li>
          <li>
            Metadata is derived from server data via <code>generateMetadata()</code>.
          </li>
          <li>
            The API exists, but SEO relies on the HTML response, not JSON endpoints.
          </li>
        </ul>
      </section>
    </main>
  );
}

