import type { Metadata } from "next";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const p = typeof sp.page === "string" ? Number(sp.page) : 1;
  const page = Number.isFinite(p) && p > 0 ? p : 1;
  const canonical = page <= 1 ? "/blog" : `/blog?page=${page}`;
  return { alternates: { canonical } };
}

export default async function BlogPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const p = typeof sp.page === "string" ? Number(sp.page) : 1;
  const page = Number.isFinite(p) && p > 0 ? p : 1;

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Blog (page {page})</h1>
      <p className="text-sm opacity-80">
        Canonical rules: <code>?page=1</code> → <code>/blog</code>, and pages 2+ canonicalize to themselves.
      </p>
    </main>
  );
}

