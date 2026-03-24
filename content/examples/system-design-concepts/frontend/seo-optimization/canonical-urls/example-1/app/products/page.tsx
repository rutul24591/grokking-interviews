import type { Metadata } from "next";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const sort = typeof sp.sort === "string" ? sp.sort : "relevance";
  const canonical = sort === "relevance" ? "/products" : `/products?sort=${encodeURIComponent(sort)}`;
  return { alternates: { canonical } };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const sort = typeof sp.sort === "string" ? sp.sort : "relevance";
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Products</h1>
      <p className="text-sm opacity-80">
        Sort: <code>{sort}</code>
      </p>
      <p className="text-sm opacity-80">
        Tracking params like <code>utm_source</code> are stripped via middleware redirects.
      </p>
    </main>
  );
}

