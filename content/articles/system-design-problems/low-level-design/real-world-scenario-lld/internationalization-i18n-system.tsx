"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-internationalization-i18n-system",
  title: "Internationalization (i18n) System",
  description:
    "Production-grade i18n architecture covering translation loading and namespacing, ICU MessageFormat for pluralization, RTL layout with CSS logical properties, locale detection and URL routing, font subsetting, and translation workflow automation.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "internationalization-i18n-system",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-16",
  tags: ["i18n", "internationalization", "l10n", "rtl", "icu", "next-js", "lld"],
};

export default function InternationalizationI18nSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        Internationalization (i18n) is the process of designing a system so it can be adapted to different languages,
        regions, and cultures without engineering changes. Localization (l10n) is the process of actually adapting
        it for a specific locale. At staff-level interviews, interviewers test whether you understand the architectural
        decisions — namespace splitting, ICU message format, RTL layout, locale routing, font subsetting — not just
        whether you've used an i18n library before.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/internationalization-i18n-system.svg"
        alt="Internationalization (i18n) system architecture diagram"
        caption="Translation loading, ICU pluralization, RTL layout, locale routing, and translation workflow"
      />

      <h2>Translation Architecture</h2>

      <h3>Message Catalog Format</h3>
      <p>
        Translation strings are stored as key-value pairs in JSON files, one per locale:
      </p>
      <p>
        The key is a stable identifier used in code. The value is the translated string for that locale. Keys should
        never be the English string itself (that creates coupling between the key and the English translation) — use
        descriptive dot-separated namespaced keys: <code>checkout.button.submit</code>,
        <code>product.price.free</code>.
      </p>
      <p>
        Two format standards dominate:
      </p>
      <ul>
        <li>
          <strong>Simple JSON:</strong> Flat or nested key-value pairs. Simple to parse, limited for complex
          pluralization or formatting. Used by i18next.
        </li>
        <li>
          <strong>ICU MessageFormat:</strong> A richer message format standard (from the Unicode Consortium) that
          handles plurals, gender, select cases, and embedded formatting. Used by react-intl (FormatJS).
        </li>
      </ul>

      <h3>Namespace Splitting</h3>
      <p>
        Loading all translations for all features on every page wastes bandwidth. A checkout page does not need
        translations for the admin dashboard. Namespace splitting divides translations by feature or page:
      </p>
      <ul>
        <li><code>common.json</code> — shared strings (button labels, error messages)</li>
        <li><code>checkout.json</code> — checkout-specific strings</li>
        <li><code>account.json</code> — account settings strings</li>
        <li><code>admin.json</code> — admin dashboard strings</li>
      </ul>
      <p>
        Each page loads only the namespaces it needs. In Next.js with <code>next-i18next</code>, declare the
        namespaces needed in <code>getServerSideProps</code> or the page's <code>serverSideTranslations</code> call.
        The framework fetches only those namespace files from the CDN and passes them as props.
      </p>

      <HighlightBlock as="p" tier="crucial">
        Never load all namespaces on every page. For a large application with 50+ namespaces, loading all of them
        adds hundreds of KB of translation data to every page load. Always declare explicit namespace dependencies
        per page or per route.
      </HighlightBlock>

      <h3>Dynamic Loading on Locale Switch</h3>
      <p>
        When a user switches locale at runtime (without a full page reload), the application must fetch the new
        locale's translation files. The loading strategy:
      </p>
      <ol>
        <li>Show a loading indicator or keep the current locale visible while fetching.</li>
        <li>Fetch the required namespace files for the new locale from the CDN.</li>
        <li>Add them to the i18n instance's resource store.</li>
        <li>Trigger a re-render — all components using the translation hook will re-render with new strings.</li>
      </ol>
      <p>
        Translation files should be served from a CDN with long cache headers (since the content doesn't change
        between deploys without a URL change). Use content-hashed filenames — when translations update on a
        new deployment, the hash changes and the browser fetches the new file rather than using the cached version.
      </p>

      <h3>Fallback Chain</h3>
      <p>
        If a translation key is missing in the requested locale, fall back in order:
      </p>
      <ol>
        <li>Requested locale: <code>pt-BR</code></li>
        <li>Base language: <code>pt</code></li>
        <li>Default locale: <code>en</code></li>
        <li>Key itself as fallback: <code>checkout.button.submit</code></li>
      </ol>
      <p>
        The key-as-fallback is useful during development when translations haven't been added yet — the key is
        visible in the UI, making it obvious which strings are missing. In production, a missing key should be
        logged to the monitoring system (Sentry or a translation monitoring service) so the translators can add it.
      </p>

      <h3>Server-Side Rendering</h3>
      <p>
        For SSR applications, translations must be available on the server when rendering the initial HTML. The
        pattern: the server determines the locale from the request, loads the required namespace files, and passes
        them as serialized JSON in the page props. The React component tree renders on the server with translations
        available — the initial HTML contains translated text, not placeholder keys.
      </p>
      <p>
        Without this, SSR renders untranslated keys on the server, the browser shows a flash of untranslated content,
        and then re-renders with the correct strings after the translation files load client-side — creating CLS
        and a poor experience for users.
      </p>

      <h2>ICU MessageFormat</h2>
      <p>
        Simple string interpolation handles the easy cases. Real production i18n requires handling pluralization
        rules, gender agreement, and complex sentence structures that differ across languages.
      </p>

      <h3>Variable Interpolation</h3>
      <p>
        Never concatenate translated strings with variables:
      </p>
      <p>
        The concatenation approach breaks when languages place the name at the end of the sentence or use different
        sentence structure. Always use variable placeholders within the message string:
      </p>
      <p>
        The message key value is <code>{"\"Hello, {name}!\""}</code> — the i18n library substitutes the variable into the
        translated string. The translator sees the full sentence with the placeholder and can position it correctly
        for their language.
      </p>

      <h3>Pluralization</h3>
      <p>
        English has two plural forms (one, other). Arabic has six (zero, one, two, few, many, other). Russian has
        three distinct forms that depend on the last digit and last two digits of the count. A naive approach —
        ternary for one vs many — fails immediately in non-English locales.
      </p>
      <p>
        ICU MessageFormat handles pluralization correctly using CLDR (Common Locale Data Repository) plural rules:
      </p>
      <p>
        The message format is: <code>"{'{'}count, plural, =0 {'{'} No items {'}'} one {'{'} # item {'}'} other {'{'} # items {'}'} {'}'}"</code>.
        The <code>#</code> symbol is replaced by the formatted count. The i18n library applies the locale's plural
        rules — for Russian, <code>count = 21</code> would use the <code>one</code> form (21 предмет, not 21 предметов).
      </p>

      <h3>Select and Gender</h3>
      <p>
        Some languages grammatically inflect for gender. ICU's <code>select</code> format handles this:
        <code>"{'{'}gender, select, male {'{'} He liked it {'}'} female {'{'} She liked it {'}'} other {'{'} They liked it {'}'} {'}'}"</code>.
        The translator provides all forms; the correct one is selected at runtime.
      </p>

      <h3>Intl APIs for Formatting</h3>
      <p>
        Number formatting, date formatting, and relative time should use the browser's built-in
        <code>Intl</code> APIs rather than hand-coded formatting or library dependencies:
      </p>
      <ul>
        <li>
          <strong>Intl.NumberFormat:</strong> Formats numbers, currencies, and percentages per locale. The number
          <code>1234567.89</code> formats as "1,234,567.89" in en-US and "1.234.567,89" in de-DE. Currencies include
          the correct symbol and decimal precision for the locale.
        </li>
        <li>
          <strong>Intl.DateTimeFormat:</strong> Formats dates and times per locale and calendar. The same Date object
          formats differently for en-US (January 15, 2026) vs ja-JP (2026年1月15日).
        </li>
        <li>
          <strong>Intl.RelativeTimeFormat:</strong> Formats relative times: "2 hours ago", "in 3 days" — fully
          localized. Replaces moment.js fromNow() with zero dependencies.
        </li>
        <li>
          <strong>Intl.ListFormat:</strong> Formats arrays as localized lists: "a, b, and c" in en-US; "a, b und c"
          in de-DE. Conjunction, disjunction, and unit styles supported.
        </li>
      </ul>

      <HighlightBlock as="p" tier="important">
        Never use moment.js in new projects — it is 232 KB uncompressed, not tree-shakeable, and its locale data
        adds another 160 KB. Use date-fns (modular, tree-shakeable) for date arithmetic and the native Intl API for
        display formatting.
      </HighlightBlock>

      <h2>RTL (Right-to-Left) Layout</h2>
      <p>
        Arabic, Hebrew, Persian, and Urdu are written right-to-left. Supporting RTL requires architectural decisions
        that are much harder to retrofit than to design upfront.
      </p>

      <h3>Direction Attribute</h3>
      <p>
        Set <code>dir="rtl"</code> on the <code>&lt;html&gt;</code> element when the active locale is RTL. The
        browser automatically mirrors text alignment, bidirectional text rendering, and some form element positioning.
        Never hardcode direction in component CSS — the direction attribute handles the baseline, and CSS should
        handle only the exceptions.
      </p>

      <h3>CSS Logical Properties</h3>
      <p>
        Physical CSS properties (<code>margin-left</code>, <code>padding-right</code>, <code>border-left</code>,
        <code>text-align: left</code>) are directional — they mean the same physical side regardless of the writing
        direction. Logical properties (<code>margin-inline-start</code>, <code>padding-inline-end</code>,
        <code>border-inline-start</code>, <code>text-align: start</code>) are direction-relative — they automatically
        flip for RTL.
      </p>
      <p>
        The migration: replace every physical directional property with its logical equivalent. This is a one-time
        migration but it makes every new component automatically RTL-compatible without any additional CSS overrides.
      </p>
      <p>
        Properties that do NOT need logical equivalents: <code>margin-top/bottom</code>, <code>padding-top/bottom</code>,
        <code>border-top/bottom</code> — these are already axis-neutral.
      </p>

      <h3>Directional Icons</h3>
      <p>
        Icons with inherent direction (back arrow, forward arrow, progress indicator, breadcrumb chevron) must be
        mirrored for RTL. Non-directional icons (search, play/pause, close, checkmark) must not be mirrored.
      </p>
      <p>
        Implementation: apply CSS <code>transform: scaleX(-1)</code> to directional icons when <code>dir="rtl"</code>.
        A utility class <code>.icon-directional</code> can be applied to all directional icons; the global RTL
        stylesheet applies the transform when the direction is RTL.
      </p>

      <h3>Text Expansion</h3>
      <p>
        German text is typically 30–40% longer than equivalent English. Finnish is even more so. Arabic and Hebrew
        can be shorter or longer depending on the content. UI elements with fixed widths will clip or overflow when
        the locale changes.
      </p>
      <p>
        Mitigation: design all UI elements to be flexible in width. Use <code>min-width</code> instead of
        <code>width</code>. Avoid fixed-width buttons — let them grow with their content. Test with German or
        Finnish during development (both are commonly used for "expansion stress testing" precisely because of their
        long compound words).
      </p>

      <h3>CJK (Chinese, Japanese, Korean) Considerations</h3>
      <p>
        CJK text has no spaces between words — word wrapping happens at any character boundary. Set
        <code>overflow-wrap: break-word</code> or <code>word-break: break-all</code> on containers that display
        CJK text to prevent overflow. CJK characters are generally the same width, so text expansion is less of
        an issue than with German, but font loading is a significant concern: a full CJK font is 2+ MB.
      </p>
      <p>
        Solution: Unicode-range subsetting. Serve only the glyphs actually used on the page via
        <code>unicode-range</code> CSS descriptor, or use a font service that automatically subsets based on the
        text content of the page (Google Fonts does this for CJK fonts via its API).
      </p>

      <h2>Locale Detection and Routing</h2>

      <h3>Detection Priority</h3>
      <p>
        Determine the initial locale in this order:
      </p>
      <ol>
        <li>
          <strong>Explicit user preference:</strong> If the user has previously selected a locale (stored in a cookie
          or user profile), use it. This overrides all other signals.
        </li>
        <li>
          <strong>Accept-Language header:</strong> The browser sends the user's configured language preference. Parse
          the quality values (e.g., <code>en-US,en;q=0.9,de;q=0.8</code>) and pick the highest-priority locale
          that the application supports.
        </li>
        <li>
          <strong>Geographic IP:</strong> Use the request's IP address to infer a default locale for users in a
          specific region. Less reliable than Accept-Language but useful for markets where browser language settings
          don't reflect the actual preferred language (common in multinational enterprise settings).
        </li>
        <li>
          <strong>Application default:</strong> Fall back to the configured default locale (usually en-US).
        </li>
      </ol>

      <h3>URL-Based Locale Routing</h3>
      <p>
        The recommended approach for SEO is to embed the locale in the URL:
      </p>
      <ul>
        <li><strong>Subdomain:</strong> <code>de.example.com</code>, <code>fr.example.com</code></li>
        <li><strong>Path prefix:</strong> <code>example.com/de/products</code>, <code>example.com/fr/products</code></li>
        <li><strong>Query parameter:</strong> <code>example.com/products?lang=de</code> — not recommended for SEO</li>
      </ul>
      <p>
        Path prefix is the most common. Next.js supports it natively with the <code>i18n</code> config in
        <code>next.config.js</code>: declare <code>locales</code>, <code>defaultLocale</code>, and
        <code>localeDetection</code>. The framework handles the routing, redirects non-prefixed URLs to the detected
        locale, and passes the active locale to all pages.
      </p>

      <h3>hreflang Tags</h3>
      <p>
        For SEO, each page must declare its alternate language versions using <code>hreflang</code> link tags in the
        document head. This tells search engines which version of the page to show to users in each locale:
      </p>
      <p>
        Use <code>x-default</code> for the default fallback version (typically the English version). Include a
        self-referencing hreflang for the current page. Missing hreflang tags cause search engines to potentially
        show the wrong language version to users.
      </p>

      <h2>Translation Workflow</h2>

      <h3>String Extraction</h3>
      <p>
        Translation keys are written by engineers in code. A CLI tool extracts all keys and their default values
        from the source code and generates or updates the source locale file (usually English). Tools: i18next-parser,
        formatjs extract. Run in CI as a check: if the generated source locale file differs from the committed one,
        the build fails (engineers forgot to commit updated translations).
      </p>

      <h3>Translation Management System (TMS)</h3>
      <p>
        Source locale files are synced to a TMS (Phrase, Lokalise, Crowdin) where professional translators work.
        The TMS provides a translation UI, translation memory (reuses previous translations of identical strings),
        and machine translation suggestions. When translations are complete, the TMS exports the locale files back
        to the repository via a pull request or direct push.
      </p>

      <h3>Pseudo-Localization</h3>
      <p>
        Pseudo-localization replaces every source character with an accented or decorated equivalent:
        "Hello, World!" becomes "Ĥéļļö, Ŵöŕļð!". Two purposes:
      </p>
      <ul>
        <li>
          <strong>Catch hardcoded strings:</strong> Any text that is not translated (hardcoded in JSX or CSS) appears
          in normal ASCII even under pseudo-localization. Visually obvious during testing.
        </li>
        <li>
          <strong>Simulate text expansion:</strong> Pseudo-localized strings are typically 40% longer than the source.
          This stress-tests UI layouts for text overflow before real translated content is available.
        </li>
      </ul>
      <p>
        Run pseudo-localization in CI on every PR to a dedicated test environment. Any clipping, overflow, or
        untranslated string is visible immediately.
      </p>

      <h3>Translation Coverage Check</h3>
      <p>
        Before shipping a new feature, verify all new source strings have corresponding translations in all
        supported locales. Automate this in CI: compare the key sets of all locale files against the source locale
        file. Any missing key in any locale file fails the build with a list of missing keys. This prevents shipping
        features that show raw translation keys to non-English users.
      </p>

      <h2>Interview Q&A</h2>

      <h3>Q: How do you handle a language that has 6 plural forms (like Arabic) when your source strings only have 2?</h3>
      <p>
        ICU MessageFormat supports all 6 CLDR plural categories (zero, one, two, few, many, other). The English
        source message uses only <code>one</code> and <code>other</code>. The Arabic translation uses all 6 forms.
        The i18n library applies the locale's CLDR plural rules at runtime — for Arabic count = 3, it selects the
        <code>few</code> form. The engineer writing the source string writes the English ICU message; the Arabic
        translator writes the full Arabic ICU message with all required forms. The code doesn't change.
      </p>

      <h3>Q: A designer wants to add a navigation arrow icon that points right in LTR. How do you handle RTL?</h3>
      <p>
        The arrow is a directional icon — it points forward in the reading direction. In RTL, "forward" is to the
        left. Approaches:
      </p>
      <ul>
        <li>
          <strong>CSS transform:</strong> Apply <code>transform: scaleX(-1)</code> to the icon when <code>dir="rtl"</code>
          is active on the document. CSS selector: <code>[dir="rtl"] .icon-directional {'{'} transform: scaleX(-1); {'}'}</code>.
          Zero extra assets required.
        </li>
        <li>
          <strong>Separate RTL SVG:</strong> Provide a pre-mirrored SVG for RTL. More control over the exact visual
          but doubles the assets to maintain.
        </li>
        <li>
          <strong>Use a bidirectional icon system:</strong> Design system libraries (Material Icons, Phosphor Icons)
          mark icons as directional or non-directional. Directional icons automatically mirror with direction.
        </li>
      </ul>

      <h3>Q: The Accept-Language header says a user wants Japanese, but your site doesn't support Japanese. What do you do?</h3>
      <p>
        Apply the fallback chain:
      </p>
      <ol>
        <li>Check if <code>ja-JP</code> is supported → no.</li>
        <li>Check if the base language <code>ja</code> is supported → no.</li>
        <li>Check the next preferred locale from the Accept-Language header (headers include quality values:
        <code>ja;q=1.0, en;q=0.9</code>) → <code>en</code> → yes, supported.</li>
        <li>Serve English content.</li>
      </ol>
      <p>
        Additionally: offer a locale selector in the UI so the user can explicitly choose their preferred supported
        language. Log the unsupported language request (without PII) to track demand for adding new languages.
        If Japanese consistently appears in unsupported language requests at high volume, it becomes a signal to
        prioritize Japanese localization.
      </p>

      <h3>Q: How would you design the i18n system for a Next.js application that supports 25 locales with SSR?</h3>
      <p>
        Architecture decisions:
      </p>
      <ul>
        <li>
          <strong>URL-based routing:</strong> Use Next.js i18n routing with path prefix strategy
          (<code>/en</code>, <code>/de</code>, <code>/ja</code>). The framework handles locale detection,
          redirect from <code>/products</code> to <code>/en/products</code>, and passes <code>locale</code> to
          every page.
        </li>
        <li>
          <strong>SSR-first translations:</strong> In each page's <code>getServerSideProps</code> (or Server
          Components data fetching), load the required namespace files for the active locale. Pass them as
          <code>_nextI18Next</code> props. The page renders on the server with full translations — no flash of
          untranslated content.
        </li>
        <li>
          <strong>CDN caching for translation files:</strong> Serve all translation files (<code>public/locales</code>)
          from the CDN with <code>Cache-Control: max-age=31536000, immutable</code>. Content-hash the file names so
          deploys with updated translations bust the cache.
        </li>
        <li>
          <strong>Namespace splitting:</strong> Define namespace groups by route: common (loaded everywhere),
          auth (login/register pages), checkout (cart/checkout pages), account (settings/profile). Each page
          declares its namespace requirements in <code>serverSideTranslations</code>.
        </li>
        <li>
          <strong>Build-time extraction:</strong> Run i18next-parser in CI to extract all keys. Compare against
          committed locale files. Sync changes to Phrase TMS. Professional translators provide missing translations
          before the feature ships.
        </li>
        <li>
          <strong>RTL support:</strong> Detect RTL locales (ar, he, fa, ur) and add <code>dir="rtl"</code> to the
          <code>&lt;html&gt;</code> element server-side. All components use CSS logical properties. A single
          RTL-specific stylesheet handles the icon mirroring exceptions.
        </li>
        <li>
          <strong>Locale switching:</strong> Locale switcher in the header writes the selected locale to a cookie
          and navigates to the same path with the new locale prefix. No full application reload needed for Next.js
          App Router — it navigates to the new locale route and the server renders with the new locale.
        </li>
      </ul>
    </ArticleLayout>
  );
}
