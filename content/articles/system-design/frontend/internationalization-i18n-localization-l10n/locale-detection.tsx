"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-locale-detection",
  title: "Locale Detection",
  description:
    "Comprehensive guide to Locale Detection covering browser detection, URL-based routing, user preferences, fallback chains, and production-scale i18n patterns.",
  category: "frontend",
  subcategory: "internationalization-i18n-localization-l10n",
  slug: "locale-detection",
  wordCount: 5100,
  readingTime: 20,
  lastUpdated: "2026-04-02",
  tags: [
    "frontend",
    "i18n",
    "locale detection",
    "language detection",
    "routing",
    "fallback",
  ],
  relatedTopics: [
    "multi-language-support",
    "date-time-number-formatting",
    "lazy-loading-translations",
  ],
};

export default function LocaleDetectionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Locale detection</strong> is the process of determining which
          language and regional conventions to use for a user. This involves
          detecting the user&apos;s preferred language from browser settings,
          URL structure, cookies, user profile, or IP-based geolocation. Locale
          detection is the first step in internationalization — before you can
          display content in the user&apos;s language, you must determine which
          language that is. The detection strategy affects SEO, user experience,
          and conversion rates.
        </p>
        <p>
          For staff-level engineers, locale detection involves architectural
          decisions about detection priority (which signal takes precedence),
          fallback chains (what if detected locale isn&apos;t supported), and
          persistence (how to remember user&apos;s override). The key insight:
          detection should be automatic but overrideable — users should always
          be able to manually select their preferred language.
        </p>
        <p>
          Locale detection involves several technical challenges.{" "}
          <strong>Browser language</strong> — navigator.language can be
          misleading (user travels, uses shared computer).{" "}
          <strong>URL structure</strong> — /en/, /es/, /fr/ paths are
          SEO-friendly but require routing changes. <strong>User
          preferences</strong> — stored locale should persist across sessions
          and devices. <strong>Fallback chains</strong> — what if user prefers
          es-MX but you only support es? Fall back to base language or default?
        </p>
        <p>
          The business case for correct locale detection is clear: users expect
          applications to &quot;know&quot; their language. Automatic detection
          reduces friction for first-time users. However, detection failures
          frustrate users — showing Spanish content to an English user in Mexico
          is worse than showing English with a language selector. The best
          approach: detect automatically, but make override obvious and
          persistent.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Browser Language (navigator.language):</strong> Returns
            user&apos;s preferred language from browser settings. Example:{" "}
            <code>&apos;en-US&apos;</code>, <code>&apos;es-ES&apos;</code>.
            Advantage: automatic, no user input. Limitation: can be wrong
            (travelers, shared computers, corporate environments).
          </li>
          <li>
            <strong>Accept-Language Header:</strong> HTTP header sent with every
            request. Contains ordered list of preferred languages with quality
            values. Example: <code>en-US,en;q=0.9,es;q=0.8</code>. Server can
            use this for initial locale detection before JavaScript loads.
          </li>
          <li>
            <strong>URL-Based Detection:</strong> Locale in URL path
            (<code>/en/products</code>, <code>/es/productos</code>). Advantages:
            SEO-friendly, shareable URLs, explicit locale. Limitations: requires
            routing changes, longer URLs.
          </li>
          <li>
            <strong>Subdomain Detection:</strong> Locale in subdomain
            (<code>en.example.com</code>, <code>es.example.com</code>).
            Advantages: clean separation, CDN-friendly. Limitations: SSL
            complexity, cookie domain issues.
          </li>
          <li>
            <strong>User Profile:</strong> Stored locale preference in user
            account. Advantages: explicit, persists across devices. Limitations:
            requires authentication, not available for anonymous users.
          </li>
          <li>
            <strong>Geolocation (IP-Based):</strong> Infer locale from user&apos;s
            IP address. Advantages: works for anonymous users. Limitations: VPNs,
            travel, imprecise (country ≠ language).
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/internationalization-i18n-localization-l10n/locale-detection-strategies.svg"
          alt="Locale Detection Strategies showing browser language, URL, user profile, and geolocation detection methods"
          caption="Locale detection strategies — browser language (automatic), URL paths (SEO-friendly), user profile (explicit), geolocation (fallback)"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Locale detection architecture consists of a detection pipeline
          (multiple signals in priority order), a fallback chain (what if
          detected locale isn&apos;t supported), and a persistence layer
          (remember user&apos;s override). The architecture must handle
          detection on first visit, respect user overrides, and work for both
          anonymous and authenticated users.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/internationalization-i18n-localization-l10n/locale-detection-pipeline.svg"
          alt="Locale Detection Pipeline showing priority order of detection signals"
          caption="Detection pipeline — user override (highest priority) → user profile → URL → cookie → browser language → default (lowest priority)"
          width={900}
          height={500}
        />

        <h3>Fallback Chain Strategy</h3>
        <p>
          When detected locale isn&apos;t supported, fall back through a chain:
          specific → base → default. Example: user prefers es-MX (Mexican
          Spanish), you support es (Spanish) but not es-MX. Fall back: es-MX →
          es → en (default). This ensures users get content in a related
          language rather than defaulting to English immediately.
        </p>
        <p>
          Implement fallback in your i18n library. react-i18next supports
          language fallback via configuration. For custom implementations: parse
          locale code, try exact match, try base language match, try default.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/internationalization-i18n-localization-l10n/locale-fallback-chain.svg"
          alt="Locale Fallback Chain showing es-MX → es → en fallback progression"
          caption="Fallback chain — specific locale (es-MX) falls back to base language (es), then to default (en) if unsupported"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Locale detection strategies involve trade-offs between automation,
          explicit control, and SEO.
        </p>

        <h3>URL Structure Strategies</h3>
        <p>
          <strong>Subdirectory (/en/, /es/):</strong> Most common approach.
          Advantages: SEO-friendly (Google recommends), simple implementation,
          works with any hosting. Limitations: longer URLs, requires routing
          changes. Best for: most applications.
        </p>
        <p>
          <strong>Subdomain (en.example.com):</strong> Separate subdomain per
          locale. Advantages: clean separation, can host locales separately,
          CDN-friendly. Limitations: SSL complexity, cookie domain issues, SEO
          treats as separate sites. Best for: large enterprises with separate
          locale teams.
        </p>
        <p>
          <strong>Query Parameter (?lang=en):</strong> Locale as query param.
          Advantages: simple, no routing changes. Limitations: not SEO-friendly,
          URLs not shareable. Best for: internal tools, not public websites.
        </p>
        <p>
          <strong>No URL Indicator:</strong> Detect from browser/cookie only.
          Advantages: clean URLs. Limitations: not shareable, SEO issues,
          confusing for users. Best for: single-language sites with optional
          translation.
        </p>

        <h3>Detection Priority</h3>
        <p>
          Recommended priority order: (1) User override (explicit selection),
          (2) User profile (authenticated), (3) URL path, (4) Cookie/localStorage,
          (5) Browser language, (6) Default locale. This respects user choice
          while providing sensible defaults for new visitors.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Always Allow Override:</strong> Provide obvious language
            selector. Users know their preference better than detection
            algorithms. Store override persistently (localStorage + user
            profile).
          </li>
          <li>
            <strong>Use URL Paths for SEO:</strong>{" "}
            <code>/en/products</code>, <code>/es/productos</code>. Google
            recommends subdirectories for multi-language sites. Enables
            locale-specific SEO optimization.
          </li>
          <li>
            <strong>Implement Proper Fallback:</strong> Don&apos;t immediately
            default to English. Fall back through base language first (es-MX →
            es → en). Users prefer related language over unrelated default.
          </li>
          <li>
            <strong>Redirect Carefully:</strong> On first visit, redirect based
            on detection. But remember user&apos;s override — don&apos;t
            redirect if user manually changed locale. Use cookie/localStorage to
            track &quot;locale was auto-detected&quot; vs &quot;user selected&quot;.
          </li>
          <li>
            <strong>Handle Anonymous vs Authenticated:</strong> For anonymous
            users: browser language → cookie → default. For authenticated: user
            profile → browser language → default. Store locale preference in
            user profile for cross-device consistency.
          </li>
          <li>
            <strong>Test Detection Logic:</strong> Test with various browser
            languages, URL structures, and fallback scenarios. Test edge cases:
            unsupported locale, locale with no base language support, multiple
            locale changes.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Redirecting on Every Visit:</strong> Auto-redirecting based
            on browser language every time frustrates users who manually
            changed locale. Only redirect on first visit, then respect user
            choice.
          </li>
          <li>
            <strong>Ignoring Accept-Language Quality Values:</strong> Header
            <code>en-US,en;q=0.9,es;q=0.8</code> means user prefers en-US over
            en over es. Respect quality ordering when detecting.
          </li>
          <li>
            <strong>Not Supporting Base Language:</strong> Supporting es-ES but
            not es means Mexican users (es-MX) get English instead of Spanish.
            Always support base language codes.
          </li>
          <li>
            <strong>Geolocation ≠ Language:</strong> IP-based geolocation
            determines country, not language. Switzerland has 4 official
            languages. Canada has 2. Don&apos;t assume language from country.
          </li>
          <li>
            <strong>Forgetting hreflang Tags:</strong> For SEO, add{" "}
            <code>&lt;link rel=&quot;alternate&quot; hreflang=&quot;es&quot; href=&quot;...&quot;&gt;</code>{" "}
            tags to help Google serve correct locale in search results.
          </li>
          <li>
            <strong>Not Testing with Real Locales:</strong> Testing only with
            en-US misses issues with RTL locales, non-Latin scripts, and
            alternative calendars. Test with ar-SA, ja-JP, zh-CN, he-IL.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Multi-Region</h3>
        <p>
          Global e-commerce (Amazon, Zara) uses URL subdirectories for
          locale/region: /en-us/, /es-mx/, /de-de/. First-time visitors are
          redirected based on IP + browser language. Returning visitors keep
          their selected locale. Product URLs are locale-specific for SEO.
          Checkout flow maintains locale throughout.
        </p>

        <h3>SaaS Application</h3>
        <p>
          SaaS apps (GitHub, Notion) store locale in user profile.
          Authentication → load profile → apply locale. For anonymous pages
          (marketing site), use URL paths. For app, use profile preference.
          Language selector in user settings persists across devices.
        </p>

        <h3>Content/Media Sites</h3>
        <p>
          News sites (BBC, CNN) have separate locale sites (bbc.com/news vs
          bbc.com/mundo). Detection happens on homepage, but users can navigate
          between locale versions. hreflang tags ensure Google shows correct
          locale in search results by region.
        </p>

        <h3>Travel and Hospitality</h3>
        <p>
          Travel sites (Booking.com, Airbnb) detect locale from browser + IP,
          but prominently display currency and language selectors. Users often
          book travel in different language than their residence (booking hotel
          in Japan while living in US). Detection is helpful but override is
          critical.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement locale detection in a Next.js application?
            </p>
            <p className="mt-2 text-sm">
              A: Use next-intl or next-i18next for built-in detection. For
              custom: (1) Middleware checks Accept-Language header, redirects to
              appropriate locale path. (2) Cookie stores user&apos;s override.
              (3) User profile (if authenticated) takes precedence. (4)
              Implement fallback chain in i18n config. Use
              useLocale() hook to access current locale in components.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle locale detection for SEO?
            </p>
            <p className="mt-2 text-sm">
              A: Use URL subdirectories (/en/, /es/) — Google recommends this.
              Add hreflang tags to each page pointing to alternate locale
              versions. Set canonical URL per locale. Implement server-side
              detection (not client-side redirect) so Googlebot sees correct
              content. Use sitemap with locale-specific URLs. Avoid
              JavaScript-only locale switching for public content.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement a locale fallback chain?
            </p>
            <p className="mt-2 text-sm">
              A: Parse locale code into base + region (es-MX → base: es,
              region: MX). Try loading translations in order: (1) Exact match
              (es-MX), (2) Base language (es), (3) Default locale (en). In
              react-i18next, configure fallbackLng: {`{ es: ['en'], default: ['en'] }`}.
              For custom: recursively try parent locales until translations
              found or default reached.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you persist user&apos;s locale preference across
              sessions and devices?
            </p>
            <p className="mt-2 text-sm">
              A: Three-layer persistence: (1) localStorage for immediate
              persistence (survives page reload). (2) Cookie for server-side
              detection on first load. (3) User profile for cross-device
              consistency (requires authentication). On locale change: update
              all three layers. On load: profile → cookie → localStorage →
              browser language → default.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle locale detection for anonymous vs
              authenticated users?
            </p>
            <p className="mt-2 text-sm">
              A: Anonymous: browser language → cookie → default. Authenticated:
              user profile → browser language → default. Key difference:
              authenticated users have explicit preference stored in profile.
              Implementation: on auth, check if profile has locale — if not, set
              from current detection. On locale change for authenticated user,
              update profile via API call.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you avoid redirect loops in locale detection?
            </p>
            <p className="mt-2 text-sm">
              A: Track detection state: &quot;auto-detected&quot; vs
              &quot;user-selected&quot;. Only auto-redirect if state is
              auto-detected. Once user manually changes locale, set state to
              user-selected and never auto-redirect again. Store this state in
              cookie. Also: check current URL before redirecting — if already on
              correct locale path, don&apos;t redirect.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — Accept-Language Header
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Search — Locale-Adaptive Pages
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/International/questions/qa-international-multilingual"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              W3C — International and Multilingual Web Sites
            </a>
          </li>
          <li>
            <a
              href="https://next-intl-docs.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              next-intl — Internationalization for Next.js
            </a>
          </li>
          <li>
            <a
              href="https://www.i18next.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              i18next — Internationalization Framework
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/2021/09/building-multilingual-website-nextjs/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Smashing Magazine — Building Multilingual Website with Next.js
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
