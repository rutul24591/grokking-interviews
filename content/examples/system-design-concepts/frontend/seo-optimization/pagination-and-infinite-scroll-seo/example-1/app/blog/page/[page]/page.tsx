import type { Metadata } from "next";
import Link from "next/link";
import LoadMore from "./ui/LoadMore";
import { listPosts } from "@/lib/posts";

type PageProps = { params: Promise<{ page: string }> };

const PAGE_SIZE = 10;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page } = await params;
  const p = Math.max(1, Number(page) || 1);
  return { alternates: { canonical: p <= 1 ? "/blog/page/1" : `/blog/page/${p}` } };
}

export default async function BlogPage({ params }: PageProps) {
  const { page } = await params;
  const p = Math.max(1, Number(page) || 1);
  const { items, total } = await listPosts(p, PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Blog (page {p})</h1>
      <p className="text-sm opacity-80">
        Server-rendered pagination with crawlable links. Infinite scroll is progressive enhancement.
      </p>

      <ul className="space-y-2 text-sm">
        {items.map((it) => (
          <li key={it.id} className="rounded border border-white/10 bg-white/5 p-3">
            {it.title}
          </li>
        ))}
      </ul>

      <nav className="flex items-center justify-between text-sm">
        <span>
          {p > 1 ? (
            <Link className="text-blue-300 hover:underline" href={`/blog/page/${p - 1}`}>
              ← Prev
            </Link>
          ) : (
            <span className="opacity-50">← Prev</span>
          )}
        </span>
        <span className="opacity-80">
          {p} / {totalPages}
        </span>
        <span>
          {p < totalPages ? (
            <Link className="text-blue-300 hover:underline" href={`/blog/page/${p + 1}`}>
              Next →
            </Link>
          ) : (
            <span className="opacity-50">Next →</span>
          )}
        </span>
      </nav>

      <LoadMore initialPage={p} pageSize={PAGE_SIZE} totalPages={totalPages} />
    </main>
  );
}

