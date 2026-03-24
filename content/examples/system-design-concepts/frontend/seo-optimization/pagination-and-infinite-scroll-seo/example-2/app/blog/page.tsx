import type { Metadata } from "next";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const raw = typeof sp.page === "string" ? sp.page : "1";
  const page = Math.max(1, Number(raw) || 1);
  return { alternates: { canonical: page <= 1 ? "/blog" : `/blog?page=${page}` } };
}

export default async function Page({ searchParams }: PageProps) {
  const sp = await searchParams;
  const raw = typeof sp.page === "string" ? sp.page : "1";
  const page = Math.max(1, Number(raw) || 1);
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Blog</h1>
      <p className="text-sm opacity-80">
        Current page param: <code>{page}</code>
      </p>
      <p className="text-sm opacity-80">
        Canonicalizes <code>?page=1</code> to <code>/blog</code>.
      </p>
    </main>
  );
}

