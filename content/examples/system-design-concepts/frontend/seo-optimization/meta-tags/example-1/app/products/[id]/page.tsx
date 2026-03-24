import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return {};

  const title = product.name;
  const description = product.description;
  const url = `/products/${product.id}`;
  const ogImage = `/api/og?title=${encodeURIComponent(product.name)}`;

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630 }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage]
    }
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">{product.name}</h1>
      <p className="text-sm opacity-80">{product.description}</p>
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="text-sm">
          Price: <code>${product.priceUsd}</code>
        </div>
        <p className="mt-3 text-sm opacity-80">
          View Source to confirm the meta tags are present in the initial HTML response.
        </p>
      </div>
    </main>
  );
}

