"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-frontend-internationalization",
  title: "Internationalization (i18n)",
  description: "Guide to implementing internationalization covering translations, RTL support, and locale formatting.",
  category: "functional-requirements",
  subcategory: "cross-cutting",
  slug: "internationalization",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "cross-cutting", "i18n", "localization", "frontend"],
  relatedTopics: ["l10n", "translations", "globalization"],
};

export default function InternationalizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Internationalization</strong> enables products to support multiple 
          languages and regions, expanding global reach and improving user experience 
          for non-English speakers.
        </p>
      </section>

      <section>
        <h2>Implementation</h2>
        <ul className="space-y-3">
          <li><strong>Frameworks:</strong> react-i18next, FormatJS, Lingui.</li>
          <li><strong>Keys:</strong> Translation keys, not hardcoded strings.</li>
          <li><strong>Context:</strong> Provide context for translators.</li>
        </ul>
      </section>

      <section>
        <h2>Locale Considerations</h2>
        <ul className="space-y-3">
          <li><strong>RTL:</strong> Right-to-left languages (Arabic, Hebrew).</li>
          <li><strong>Dates:</strong> Locale-specific date formats.</li>
          <li><strong>Numbers:</strong> Decimal separators, currency formats.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle text expansion?</p>
            <p className="mt-2 text-sm">A: Design for 30-50% expansion, flexible layouts, avoid fixed widths, test with long languages (German).</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you manage translations?</p>
            <p className="mt-2 text-sm">A: Translation management system, professional translators, context for translators, QA process.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
