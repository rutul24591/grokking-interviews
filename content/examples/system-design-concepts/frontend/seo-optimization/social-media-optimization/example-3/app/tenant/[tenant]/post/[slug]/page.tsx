import type { Metadata } from "next";
import { allowlistedOgImage } from "@/lib/ogAllowlist";
import { safeTitle } from "@/lib/safeText";

type PageProps = { params: Promise<{ tenant: string; slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tenant, slug } = await params;
  const title = safeTitle(`${tenant.toUpperCase()} — ${slug.replace(/-/g, " ")}`);

  const ogPath = allowlistedOgImage("/api/og-default");
  return {
    title,
    description: "Demonstrates allowlists and safe fallbacks for social previews.",
    openGraph: { title, images: [{ url: ogPath }] },
    twitter: { card: "summary", title }
  };
}

export default async function Page({ params }: PageProps) {
  const { tenant, slug } = await params;
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">
        Tenant <code>{tenant}</code> · Post <code>{slug}</code>
      </h1>
      <p className="text-sm opacity-80">
        Metadata uses safe truncation and an allowlisted OG image path.
      </p>
    </main>
  );
}

