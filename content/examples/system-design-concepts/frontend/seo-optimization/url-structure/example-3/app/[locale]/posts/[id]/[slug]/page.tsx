import type { Metadata } from "next";

type PageProps = { params: Promise<{ locale: string; id: string; slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id, slug } = await params;
  return {
    title: `${slug.replace(/-/g, " ")} (${locale})`,
    alternates: {
      canonical: `/${locale}/posts/${id}/${slug}`,
      languages: {
        en: `/en/posts/${id}/${slug}`,
        fr: `/fr/posts/${id}/${slug}`
      }
    }
  };
}

export default async function Page({ params }: PageProps) {
  const { locale, id, slug } = await params;
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Locale URL</h1>
      <p className="text-sm opacity-80">
        Locale: <code>{locale}</code>
      </p>
      <p className="text-sm opacity-80">
        Post: <code>{id}</code> / <code>{slug}</code>
      </p>
    </main>
  );
}

