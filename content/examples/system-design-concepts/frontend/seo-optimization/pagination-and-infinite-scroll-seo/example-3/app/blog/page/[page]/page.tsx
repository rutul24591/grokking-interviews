import { notFound } from "next/navigation";
import { z } from "zod";

type PageProps = { params: Promise<{ page: string }> };

const PageSchema = z.coerce.number().int().min(1).max(10);

export default async function Page({ params }: PageProps) {
  const { page } = await params;
  const parsed = PageSchema.safeParse(page);
  if (!parsed.success) notFound();
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Blog page {parsed.data}</h1>
      <p className="text-sm opacity-80">
        Hard bounds prevent infinite crawl paths (e.g. page=999).
      </p>
    </main>
  );
}

