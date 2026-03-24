import { dedupeSchemas, jsonLdScriptContent } from "@/lib/jsonLd";

export default function Page() {
  const schemas = dedupeSchemas([
    { "@context": "https://schema.org", "@type": "BreadcrumbList", name: "crumbs", url: "/x" },
    { "@context": "https://schema.org", "@type": "Article", name: "Edge Cache", url: "/x" },
    { "@context": "https://schema.org", "@type": "FAQPage", name: "FAQ", url: "/x" }
  ]);

  const content = jsonLdScriptContent(schemas);

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Multiple schemas</h1>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: content }} />
      <pre className="overflow-auto rounded border border-white/10 bg-black/30 p-3 text-xs">
        <code>{content}</code>
      </pre>
    </main>
  );
}

