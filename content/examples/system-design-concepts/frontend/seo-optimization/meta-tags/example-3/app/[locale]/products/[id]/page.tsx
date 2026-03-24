import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";

type PageProps = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const product = await getProduct(id);
  if (!product) return {};

  const canonical = `/${locale}/products/${id}`;
  return {
    title: locale === "fr" ? `${product.name} (FR)` : product.name,
    alternates: {
      canonical,
      languages: {
        en: `/en/products/${id}`,
        fr: `/fr/products/${id}`
      }
    }
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">
        {product.name} <span className="text-sm opacity-70">({locale})</span>
      </h1>
      <p className="text-sm opacity-80">
        This page sets <code>alternates.languages</code> for hreflang-style alternates.
      </p>
    </main>
  );
}

