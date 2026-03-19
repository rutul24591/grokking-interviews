"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-internationalization-localization",
  title: "Internationalization & Localization",
  description:
    "Comprehensive guide to i18n and l10n: translation management, RTL support, date/number formatting, locale detection, and building globally-accessible applications.",
  category: "frontend",
  subcategory: "nfr",
  slug: "internationalization-localization",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-15",
  tags: [
    "frontend",
    "nfr",
    "i18n",
    "l10n",
    "translation",
    "rtl",
    "globalization",
  ],
  relatedTopics: ["accessibility", "cross-browser-compatibility", "seo"],
};

export default function InternationalizationLocalizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Internationalization (i18n)</strong> is designing applications
          to support multiple languages and regions without engineering changes.{" "}
          <strong>Localization (l10n)</strong> is adapting the application for a
          specific locale — translating content, formatting dates, handling
          currencies.
        </p>
        <p>
          The numbers 18 and 10 come from counting letters between first and
          last: internationalization → i + 18 letters + n, localization → l + 10
          letters + n.
        </p>
        <p>
          For staff engineers, i18n is an architecture decision. Retrofitting
          i18n after launch is expensive — string concatenation, hardcoded
          dates, and LTR assumptions create technical debt. Building i18n from
          the start enables global expansion without rewrites.
        </p>
        <p>
          <strong>Business impact:</strong>
        </p>
        <ul>
          <li>
            <strong>Market expansion:</strong> 75% of internet users don&apos;t
            speak English as first language
          </li>
          <li>
            <strong>Conversion rates:</strong> Users 3x more likely to buy from
            sites in their language
          </li>
          <li>
            <strong>Legal compliance:</strong> Some regions require local
            language support
          </li>
          <li>
            <strong>Accessibility:</strong> i18n patterns overlap with
            accessibility (semantic HTML, flexible layouts)
          </li>
        </ul>
      </section>

      <section>
        <h2>i18n Architecture Patterns</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Translation File Structure
        </h3>
        <p>Organize translations by feature/domain, not by page.</p>
        <ul className="space-y-2">
          <li>
            <strong>Namespace by feature:</strong> common, navigation, forms,
            errors, products
          </li>
          <li>
            <strong>Avoid monolithic files:</strong> 5000-line translation files
            are unmaintainable
          </li>
          <li>
            <strong>Lazy load namespaces:</strong> Load translations per
            route/feature
          </li>
          <li>
            <strong>Version translations:</strong> Track changes, enable
            rollback
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Translation Keys</h3>
        <p>Use descriptive, hierarchical keys.</p>
        <ul className="space-y-2">
          <li>
            <strong>Good:</strong> <code>forms.login.emailLabel</code>,{" "}
            <code>errors.network.generic</code>
          </li>
          <li>
            <strong>Avoid:</strong> <code>button.submit</code> (too generic),{" "}
            <code>text1</code> (meaningless)
          </li>
          <li>
            <strong>Include context:</strong>{" "}
            <code>product.details.addToCart</code> vs <code>cart.addItem</code>
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Interpolation</h3>
        <p>Never concatenate strings for dynamic content.</p>
        <ul className="space-y-2">
          <li>
            <strong>Bad:</strong>{" "}
            <code>{`'Hello ' + name + ', you have ' + count + ' messages'`}</code>
          </li>
          <li>
            <strong>Good:</strong>{" "}
            <code>{`'Hello {name}, you have {count} messages'`}</code> with
            interpolation
          </li>
          <li>
            <strong>Why:</strong> Word order varies by language. &quot;You have
            5 messages&quot; in English might be &quot;5 messages you have&quot;
            in another language.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pluralization</h3>
        <p>Different languages have different plural rules.</p>
        <ul className="space-y-2">
          <li>
            <strong>English:</strong> one vs other (1 message vs 2 messages)
          </li>
          <li>
            <strong>Arabic:</strong> zero, one, two, few, many, other (6 plural
            forms)
          </li>
          <li>
            <strong>Chinese/Japanese:</strong> Often no plural distinction
          </li>
          <li>
            <strong>Use ICU plural rules:</strong> Libraries handle complexity
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/i18n-architecture.svg"
          alt="i18n Architecture Diagram"
          caption="Internationalization architecture — translation files, i18n library, locale detection, and rendering pipeline"
        />
      </section>

      <section>
        <h2>i18n Libraries</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">react-i18next</h3>
        <p>Most popular React i18n library, built on i18next core.</p>
        <ul className="space-y-2">
          <li>
            <strong>Features:</strong> Interpolation, pluralization, context,
            namespaces, lazy loading
          </li>
          <li>
            <strong>Ecosystem:</strong> Devtools, backend connectors,
            translation management integrations
          </li>
          <li>
            <strong>Best for:</strong> Most React applications
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          FormatJS (react-intl)
        </h3>
        <p>Part of FormatJS suite, strong formatting capabilities.</p>
        <ul className="space-y-2">
          <li>
            <strong>Features:</strong> ICU message format, date/number
            formatting, pluralization
          </li>
          <li>
            <strong>Strengths:</strong> Standard ICU syntax, excellent
            formatting
          </li>
          <li>
            <strong>Best for:</strong> Apps needing robust date/number
            formatting
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Lingui</h3>
        <p>Minimalist i18n with macro support.</p>
        <ul className="space-y-2">
          <li>
            <strong>Features:</strong> Macros for compile-time extraction,
            minimal runtime
          </li>
          <li>
            <strong>Strengths:</strong> Clean syntax, small bundle size
          </li>
          <li>
            <strong>Best for:</strong> Teams wanting minimal configuration
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Next-intl (for Next.js)
        </h3>
        <p>i18n built for Next.js App Router.</p>
        <ul className="space-y-2">
          <li>
            <strong>Features:</strong> SSR/SSG support, routing integration,
            type-safe
          </li>
          <li>
            <strong>Strengths:</strong> Next.js native integration
          </li>
          <li>
            <strong>Best for:</strong> Next.js applications
          </li>
        </ul>
      </section>

      <section>
        <h2>RTL (Right-to-Left) Support</h2>
        <p>
          Arabic, Hebrew, Persian, and Urdu are RTL languages. Supporting them
          requires more than translation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          CSS Logical Properties
        </h3>
        <p>Use logical instead of physical properties.</p>
        <ul className="space-y-2">
          <li>
            <code>margin-inline-start</code> instead of <code>margin-left</code>
          </li>
          <li>
            <code>margin-inline-end</code> instead of <code>margin-right</code>
          </li>
          <li>
            <code>padding-block-start</code> instead of <code>padding-top</code>
          </li>
          <li>
            <code>inset-inline-start</code> instead of <code>left</code>
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Layout Flipping</h3>
        <p>Mirror layouts for RTL.</p>
        <ul className="space-y-2">
          <li>Navigation moves to right side</li>
          <li>Icons with direction (arrows, chevrons) flip</li>
          <li>Text alignment changes (but not numbers!)</li>
          <li>Progress indicators flow right-to-left</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">RTL Testing</h3>
        <ul className="space-y-2">
          <li>Test with actual RTL content, not just Lorem Ipsum</li>
          <li>Check form layouts, tables, modals</li>
          <li>Verify icons and images make sense in RTL</li>
          <li>Test mixed LTR/RTL content (English words in Arabic text)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Implementation</h3>
        <ul className="space-y-2">
          <li>
            Add <code>dir=&quot;rtl&quot;</code> to html tag for RTL locales
          </li>
          <li>
            Use <code>[dir=&quot;rtl&quot;]</code> CSS selector for RTL-specific
            overrides
          </li>
          <li>Test with browser DevTools forcing RTL direction</li>
          <li>Consider RTL from design phase, not as afterthought</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/rtl-layout-flip.svg"
          alt="RTL Layout Comparison"
          caption="LTR vs RTL layout comparison — showing navigation, icons, and content flow mirroring"
        />
      </section>

      <section>
        <h2>Date, Time, and Number Formatting</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Use Intl API</h3>
        <p>JavaScript&apos;s Intl API handles locale-specific formatting.</p>
        <ul className="space-y-2">
          <li>
            <code>Intl.DateTimeFormat</code> for dates and times
          </li>
          <li>
            <code>Intl.NumberFormat</code> for numbers and currencies
          </li>
          <li>
            <code>Intl.RelativeTimeFormat</code> for relative times (&quot;2
            days ago&quot;)
          </li>
          <li>
            <code>Intl.ListFormat</code> for list formatting
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Date Format Variations
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>US:</strong> MM/DD/YYYY (12/31/2024)
          </li>
          <li>
            <strong>Europe:</strong> DD.MM.YYYY (31.12.2024)
          </li>
          <li>
            <strong>ISO:</strong> YYYY-MM-DD (2024-12-31)
          </li>
          <li>
            <strong>China:</strong> YYYY 年 MM 月 DD 日
          </li>
          <li>
            <strong>Always store dates as ISO 8601</strong> in backend, format
            on frontend
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Number Format Variations
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>US:</strong> 1,234.56 (comma for thousands, period for
            decimal)
          </li>
          <li>
            <strong>Germany:</strong> 1.234,56 (period for thousands, comma for
            decimal)
          </li>
          <li>
            <strong>India:</strong> 1,23,456 (different grouping pattern)
          </li>
          <li>
            <strong>Always store numbers as raw values</strong>, format for
            display
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Currency Formatting</h3>
        <ul className="space-y-2">
          <li>
            Use <code>Intl.NumberFormat</code> with{" "}
            <code>style: &apos;currency&apos;</code>
          </li>
          <li>Symbol position varies ( before, after, space-separated)</li>
          <li>Decimal precision varies (0, 2, or 3 decimals)</li>
          <li>
            Consider showing multiple currencies for international e-commerce
          </li>
        </ul>
      </section>

      <section>
        <h2>Locale Detection and Switching</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Detection Strategies
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Browser language:</strong> navigator.language (first-time
            visitors)
          </li>
          <li>
            <strong>URL:</strong> /en/, /de/, /ja/ paths (explicit,
            SEO-friendly)
          </li>
          <li>
            <strong>Subdomain:</strong> en.example.com, de.example.com
          </li>
          <li>
            <strong>User preference:</strong> Saved in profile (returning users)
          </li>
          <li>
            <strong>IP geolocation:</strong> Fallback for unknown users
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          URL Structure Options
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Path:</strong> example.com/en/products (recommended)
          </li>
          <li>
            <strong>Subdomain:</strong> en.example.com/products
          </li>
          <li>
            <strong>Query param:</strong> example.com/products?lang=en (not
            recommended for SEO)
          </li>
          <li>
            <strong>Separate domain:</strong> example.de, example.fr (for major
            markets)
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Language Switcher UX
        </h3>
        <ul className="space-y-2">
          <li>
            Show language names in their own language (Deutsch, not German)
          </li>
          <li>Include native script (日本語 for Japanese)</li>
          <li>Place in header or footer (consistent location)</li>
          <li>Preserve current page when switching</li>
          <li>Remember preference for return visits</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Fallback Strategy</h3>
        <ul className="space-y-2">
          <li>Define fallback locale (usually English)</li>
          <li>Load fallback for missing translations</li>
          <li>Log missing translations for translation team</li>
          <li>Never show translation keys to users</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/locale-detection-flow.svg"
          alt="Locale Detection Flow"
          caption="Locale detection decision tree — browser language, URL, user preference, and geolocation"
        />
      </section>

      <section>
        <h2>Translation Management</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Translation Workflow
        </h3>
        <ol className="space-y-3">
          <li>Developers add new translation keys in code</li>
          <li>Extraction script collects keys to translation files</li>
          <li>Files uploaded to translation management system</li>
          <li>Translators work in their native language</li>
          <li>Approved translations downloaded and committed</li>
          <li>Deploy with new translations</li>
        </ol>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Translation Management Systems
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Lokalise:</strong> Developer-friendly, API, integrations
          </li>
          <li>
            <strong>Crowdin:</strong> Large community, open-source friendly
          </li>
          <li>
            <strong>Transifex:</strong> Enterprise features, workflow automation
          </li>
          <li>
            <strong>Phrase:</strong> Translation memory, glossary
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Best Practices</h3>
        <ul className="space-y-2">
          <li>Provide context for translators (screenshots, descriptions)</li>
          <li>Use translation memory for consistency</li>
          <li>Maintain glossary of brand/product terms</li>
          <li>Test translations in context (not just in TMS)</li>
          <li>
            Account for text expansion (German is 30% longer than English)
          </li>
          <li>Plan for text contraction (Chinese is often shorter)</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you structure translations for a large application?
            </p>
            <p className="mt-2 text-sm">
              A: Namespace by feature/domain (common, forms, products, errors),
              not by page. Use hierarchical keys (forms.login.emailLabel). Lazy
              load namespaces per route. Store translations as JSON with
              interpolation placeholders. Never concatenate strings — word order
              varies by language. Use ICU plural rules for pluralization.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement RTL support?
            </p>
            <p className="mt-2 text-sm">
              A: Use CSS logical properties (margin-inline-start instead of
              margin-left). Add dir=&quot;rtl&quot; to html tag for RTL locales.
              Flip layouts (navigation moves right, arrows mirror). Test with
              actual RTL content. Consider RTL from design phase — icons,
              images, and layouts should make sense mirrored.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle date/number formatting across locales?
            </p>
            <p className="mt-2 text-sm">
              A: Use Intl API (Intl.DateTimeFormat, Intl.NumberFormat). Store
              dates as ISO 8601 in backend, format on frontend. Numbers:
              1,234.56 in US, 1.234,56 in Germany. Dates: MM/DD/YYYY in US,
              DD.MM.YYYY in Europe. Always format for display, store raw values.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What&apos;s your strategy for locale detection?
            </p>
            <p className="mt-2 text-sm">
              A: Multi-layer approach: (1) URL path for explicit selection
              (/en/, /de/) — best for SEO. (2) User preference for returning
              users. (3) Browser language for first-time visitors. (4)
              Geolocation as fallback. Always allow manual override and remember
              preference.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle translation workflow in a team?
            </p>
            <p className="mt-2 text-sm">
              A: Developers add keys in code. Extraction script collects to JSON
              files. Upload to translation management system (Lokalise,
              Crowdin). Translators work in TMS with context (screenshots,
              descriptions). Approved translations downloaded and committed.
              CI/CD validates no missing keys. Log missing translations in
              production for follow-up.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.i18next.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              i18next — Internationalization Framework
            </a>
          </li>
          <li>
            <a
              href="https://formatjs.io/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              FormatJS — Internationalization Libraries
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Intl API
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/International/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — Internationalization Resources
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
