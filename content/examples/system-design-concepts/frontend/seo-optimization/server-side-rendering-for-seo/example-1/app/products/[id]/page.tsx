import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getProductById } from "@/lib/products";

export const dynamic = "force-dynamic";

const ParamsSchema = z.object({ id: z.string().min(1) });
type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = ParamsSchema.parse(await params);
  const product = getProductById(id);
  if (!product) return { title: "Not found" };

  return {
    title: product.name,
    description: product.tagline,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      title: product.name,
      description: product.tagline,
      url: `/products/${product.id}`,
      type: "website"
    }
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = ParamsSchema.parse(await params);
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <main>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-300">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <a href="/" className="hover:underline">
              Home
            </a>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-slate-100">
            {product.name}
          </li>
        </ol>
      </nav>

      <article className="rounded-xl border border-white/10 bg-white/5 p-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="mt-2 text-slate-300">{product.tagline}</p>
          <p className="mt-4 text-sm text-slate-300">
            <span className="font-semibold text-slate-100">${product.priceUsd}</span> · Updated{" "}
            <time dateTime={product.updatedAt}>{product.updatedAt}</time>
          </p>
        </header>

        <section aria-labelledby="details" className="mt-8">
          <h2 id="details" className="text-xl font-semibold">
            Details (SSR HTML)
          </h2>
          <p className="mt-2 text-slate-200">{product.description}</p>
          <p className="mt-4 text-sm text-slate-300">
            If a crawler doesn’t execute JS, it still sees this content in the initial HTML response.
          </p>
        </section>
      </article>
    </main>
  );
}

