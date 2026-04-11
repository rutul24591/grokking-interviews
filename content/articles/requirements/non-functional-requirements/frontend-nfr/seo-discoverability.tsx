"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-seo-discoverability",
  title: "SEO & Discoverability",
  description:
    "Comprehensive guide to frontend SEO: meta tags, structured data, sitemaps, SSR for SEO, Core Web Vitals, and social media optimization.",
  category: "frontend",
  subcategory: "nfr",
  slug: "seo-discoverability",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-11",
  tags: [
    "frontend",
    "nfr",
    "seo",
    "meta-tags",
    "structured-data",
    "sitemap",
    "social-sharing",
  ],
  relatedTopics: [
    "rendering-strategy",
    "page-load-performance",
    "internationalization",
  ],
};

export default function SEODiscoverabilityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>SEO (Search Engine Optimization)</strong> encompasses
          techniques to improve a website&apos;s visibility in search engine
          results pages (SERPs). For frontend engineers, SEO involves technical
          implementation — meta tags, structured data, site architecture,
          performance optimization, and ensuring content is crawlable and
          indexable by search engine bots. <strong>Discoverability</strong>
          extends beyond search engines to social media sharing, link previews,
          and content syndication. Proper Open Graph tags, Twitter Cards, and
          structured data ensure content looks compelling when shared on social
          platforms, driving referral traffic and brand awareness.
        </p>
        <p>
          For staff engineers, SEO is a business-critical non-functional
          requirement. Organic search drives 40-60% of traffic for content
          sites, e-commerce, and SaaS companies. Poor SEO directly impacts
          revenue — lower search ranking means fewer visitors, fewer
          conversions, and less revenue. Technical SEO decisions (rendering
          strategy, URL structure, site speed, mobile-friendliness) are often
          made by frontend teams and have lasting impact on organic traffic.
          Unlike paid advertising, which stops driving traffic when the budget
          ends, SEO investment compounds over time — well-optimized content
          continues attracting visitors for months or years.
        </p>
        <p>
          SEO impact factors span content quality (relevant, keyword-optimized
          content), technical implementation (crawlability, site speed,
          mobile-friendliness, HTTPS), user experience signals (bounce rate,
          dwell time, Core Web Vitals), and domain authority (backlinks,
          reputation). Frontend engineers directly influence the technical, UX,
          and performance factors — the rendering strategy determines whether
          content is visible to crawlers, the site architecture affects how
          thoroughly bots crawl the site, and performance optimization affects
          Core Web Vitals which are Google ranking signals.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Meta tags provide search engines and social platforms with information
          about each page. The title tag (50-60 characters, primary keyword
          first, unique per page) is the most important on-page SEO factor — it
          appears as the clickable headline in search results. The meta
          description (150-160 characters, compelling summary with keywords)
          appears below the title in search results and influences click-through
          rate. The canonical URL prevents duplicate content issues by
          specifying the preferred URL when the same content exists at multiple
          URLs. The viewport meta tag is required for mobile-friendly ranking.
          The robots meta tag controls crawling behavior (index/noindex,
          follow/nofollow) for each page.
        </p>
        <p>
          Structured data (Schema.org) provides explicit clues about page
          content to search engines, enabling rich results — enhanced search
          listings with star ratings, prices, images, FAQs, and event
          information. JSON-LD is Google&apos;s recommended format, placed in a{" "}
          <code>&lt;script type=&quot;application/ld+json&quot;&gt;</code> tag
          that does not affect page rendering. Common schema types include
          Article (blog posts, news), Product (e-commerce with price,
          availability, reviews), Recipe (cooking with ingredients, nutrition),
          Event (dates, locations, tickets), FAQ (questions and answers), and
          LocalBusiness (address, hours, reviews). Rich results achieve higher
          click-through rates due to their enhanced appearance and eligibility
          for special features like carousels and knowledge panels.
        </p>
        <p>
          Open Graph tags and Twitter Cards control how pages appear when shared
          on social media. Open Graph (used by Facebook, LinkedIn, and most
          platforms) requires og:title, og:description, og:image (1200×630
          recommended), og:url, and og:type. Twitter Cards add
          twitter:card (summary or summary_large_image), twitter:title,
          twitter:description, twitter:image, and twitter:site (@username).
          Proper social sharing tags are essential for content marketing — a
          compelling link preview with a relevant image dramatically increases
          click-through rates from social media compared to a plain URL.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/meta-tags-social-preview.svg"
          alt="Meta Tags and Social Preview"
          caption="How meta tags appear in search results and social media previews — title tag, meta description, Open Graph tags, and Twitter Card optimization"
        />

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/seo-audit-pipeline.svg"
          alt="SEO Audit Pipeline in CI/CD"
          caption="SEO audit pipeline in CI/CD — Lighthouse CI for SEO scoring, structured data validation, broken link detection, SEO health dashboard, Google Search Console integration, and automated sitemap generation"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Technical SEO architecture ensures search engines can discover, crawl,
          and index all important pages. XML sitemaps list all important URLs
          with their last modified date, helping search engines discover content
          that may not be linked from other pages. Sitemaps should exclude
          noindex pages and duplicates, be submitted to Google Search Console,
          referenced in robots.txt, and kept under 50,000 URLs per sitemap
          (split into multiple sitemaps for larger sites). Robots.txt controls
          which parts of the site crawlers can access — it should block
          administrative paths (/admin/, /api/) but must not block CSS or
          JavaScript files because Google needs them to render and evaluate
          pages.
        </p>
        <p>
          URL structure affects both SEO and user experience. Descriptive,
          keyword-rich URLs (example.com/products/wireless-headphones) rank
          better than opaque URLs (example.com/p?id=12345). URLs should be
          short, readable, use hyphens to separate words, be consistently
          lowercase, and avoid unnecessary query parameters. When URLs change,
          implement 301 (permanent) redirects from old URLs to new ones to
          preserve search ranking and prevent 404 errors. Internal linking
          creates a logical site hierarchy — link to important pages from the
          homepage, use descriptive anchor text, implement breadcrumbs, and
          avoid orphan pages (pages with no incoming links that crawlers cannot
          discover).
        </p>
        <p>
          Mobile-first indexing means Google primarily uses the mobile version
          of a site for indexing and ranking. Ensure the mobile and desktop
          versions have the same content (do not hide important content on
          mobile), use responsive design rather than separate mobile URLs, test
          with Google&apos;s Mobile-Friendly Test, and avoid intrusive
          interstitials (full-screen popups) on mobile that block content.
          Mobile-friendliness is a ranking factor — sites that are not
          mobile-friendly rank lower in both mobile and desktop search results.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/structured-data-rich-results.svg"
          alt="Structured Data Rich Results"
          caption="Examples of rich results enabled by structured data — product cards with price and ratings, recipes with cooking time, FAQs, and events with dates"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Rendering strategy is the most impactful SEO decision. Server-Side
          Rendering sends full HTML to crawlers — content is immediately
          available without JavaScript execution, providing the best SEO. Static
          Site Generation is equally good for SEO — pre-rendered HTML served
          from CDN is ideal for crawlers. Client-Side Rendering is problematic
          — the initial HTML is an empty shell, and while Google can execute
          JavaScript, it does so with delays and not all crawlers support it.
          Social media previews are often broken with CSR because social
          platforms do not execute JavaScript when generating link previews.
          The recommendation is SSR/SSG/ISR for all public, SEO-critical pages
          and CSR only for authenticated areas where SEO does not matter.
        </p>
        <p>
          Core Web Vitals are confirmed Google ranking signals — poor
          performance directly impacts search rankings. LCP under 2.5s, INP
          under 200ms, and CLS under 0.1 are the thresholds for &quot;good&quot;
          ratings. Pages that exceed these thresholds rank lower than comparable
          pages with good scores. The performance-SEO connection means that
          frontend performance optimization is also SEO optimization —
          optimizing images, minimizing JavaScript, using CDNs, and enabling
          compression all improve both Core Web Vitals and search ranking.
          Monitor Core Web Vitals in Google Search Console to identify pages
          that need performance improvement for SEO.
        </p>
        <p>
          SEO investment must be prioritized by business impact. For content
          sites and e-commerce, SEO is a primary traffic driver and deserves
          significant investment — SSR/SSR rendering, structured data, optimized
          meta tags, XML sitemaps, and performance optimization. For internal
          tools and dashboards, SEO is irrelevant because the audience is known
          and authenticated — investment should focus on usability and
          performance instead. For SaaS marketing sites, SEO is important for
          lead generation — invest in content creation, blog SEO, landing page
          optimization, and technical SEO, but the investment level is
          proportional to the role of organic search in the acquisition funnel.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implement a per-page SEO checklist for every new page or content
          update. Each page needs a unique title (50-60 characters, keyword
          first), unique meta description (150-160 characters, compelling
          summary), canonical URL, proper heading hierarchy (one H1, logical
          H2-H6 structure), semantic HTML (proper use of article, section, nav,
          aside), alt text for all images, internal links to related content,
          structured data if applicable (Article, Product, FAQ), Open Graph
          tags, Twitter Cards, mobile-friendly responsive design, and fast load
          time (Core Web Vitals within &quot;good&quot; thresholds). Test each
          page with Lighthouse SEO audit, validate structured data with Google
          Rich Results Test, and submit new URLs to Google Search Console for
          indexing.
        </p>
        <p>
          Optimize images for both performance and SEO. Use descriptive,
          keyword-rich file names (wireless-headphones-black.jpg, not
          IMG_1234.jpg). Provide meaningful alt text that describes the image
          content for accessibility and image search. Use modern formats (WebP,
          AVIF) with proper sizing — oversized images hurt both performance and
          Core Web Vitals, which affect ranking. Implement lazy loading for
          below-the-fold images but do not lazy-load the LCP image (usually the
          hero or featured image) because it delays the most important
          performance metric.
        </p>
        <p>
          Monitor SEO health continuously using Google Search Console and
          automated auditing. Search Console provides data on search queries
          driving traffic, click-through rates, indexing status, Core Web Vitals
          by page, mobile usability issues, and structured data errors. Set up
          automated SEO audits in CI/CD using tools like Lighthouse CI to catch
          regressions (missing meta tags, broken links, accessibility issues)
          before deployment. Track organic traffic trends over time and
          investigate drops — they may indicate technical issues (pages
          accidentally noindexed, rendering changes that break crawler
          visibility, performance regressions affecting Core Web Vitals).
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Using CSR for public-facing content is the most damaging SEO mistake.
          When search engine crawlers encounter a CSR page, they receive an
          empty HTML shell with no content. While Google can execute JavaScript
          to discover content, it does so in a second wave of indexing that may
          be delayed by days or weeks, and other search engines (Bing, DuckDuckGo,
          Baidu) may not execute JavaScript at all. Social media platforms
          definitely do not execute JavaScript, so link previews show nothing.
          The fix is to use SSR, SSG, or ISR for all public content. If
          migrating an existing CSR application, prioritize the homepage,
          landing pages, and high-traffic content pages for server rendering
          first.
        </p>
        <p>
          Duplicate content across multiple URLs dilutes search ranking. When
          the same content is accessible at multiple URLs (example.com/products
          and example.com/products?page=1, or HTTP and HTTPS versions, or www
          and non-www versions), search engines may split ranking signals across
          the duplicates, resulting in lower ranking for all versions. The fix
          is to use canonical URLs to designate the preferred version, implement
          301 redirects from duplicate URLs to the canonical URL, and ensure
          internal links consistently point to the canonical URL.
        </p>
        <p>
          Blocking CSS and JavaScript in robots.txt prevents Google from
          rendering pages correctly. Google needs to execute JavaScript and
          apply CSS to understand the page layout, identify hidden content, and
          evaluate Core Web Vitals. If robots.txt blocks these resources, Google
          sees an unstyled, non-interactive version of the page, which may
          affect ranking. Ensure robots.txt does not disallow CSS and JS file
          paths. Use the URL Inspection tool in Google Search Console to verify
          that Google can render your pages correctly.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          E-commerce platforms invest heavily in SEO because product search is a
          primary customer acquisition channel. Amazon, Shopify stores, and
          direct-to-consumer brands optimize product pages with unique titles
          (product name, brand, key attributes), detailed descriptions with
          keywords, structured data (Product schema with price, availability,
          ratings), optimized images with alt text, and fast load times. They
          also optimize category pages (aggregated product listings) and blog
          content (buying guides, product comparisons) for long-tail keywords.
          The result is product pages that rank for both branded searches
          (specific product names) and unbranded searches (&quot;best wireless
          headphones under $100&quot;).
        </p>
        <p>
          News and media websites depend on SEO for traffic and revenue. The
          New York Times, The Guardian, and Bloomberg use SSR for article pages
          (full HTML for crawlers), structured data (Article and NewsArticle
          schema), AMP (Accelerated Mobile Pages) for fast mobile loading,
          Google News sitemaps for rapid indexing of breaking news, and live
          blog structured data for ongoing events. Their SEO strategy includes
          optimizing for Google News and Google Discover, which drive
          significant referral traffic for timely content.
        </p>
        <p>
          SaaS companies use SEO for content marketing and lead generation. The
          marketing site (SSG for speed) hosts blog posts, case studies,
          documentation, and landing pages optimized for industry keywords.
          Structured data (SoftwareApplication, FAQ, HowTo schema) enhances
          search listings. The product application (CSR) is behind authentication
          and does not need SEO. Internal linking between blog posts, product
          pages, and documentation creates a strong site hierarchy that helps
          crawlers discover and rank all content. The investment in SEO-driven
          content marketing generates organic leads at a lower cost per
          acquisition than paid advertising.
        </p>
      </section>

      <section>
        <h2>Advanced SEO Architecture</h2>
        <p>
          JavaScript SEO challenges stem from the fundamental tension between modern SPA architectures and search engine crawling capabilities. When Googlebot encounters a CSR page, it goes through a two-wave indexing process: first, it indexes the initial HTML (which is empty for CSR), and second, it queues the page for JavaScript rendering in a separate rendering wave that may be delayed by hours, days, or weeks. During this delay, the page has no indexed content and ranks for no queries. Other search engines (Bing, DuckDuckGo, Baidu, Yandex) have varying JavaScript execution capabilities — some do not execute JavaScript at all, meaning CSR pages are completely invisible to them. The solution is server-side rendering (SSR, SSG, or ISR) for all public content, ensuring that the initial HTML contains the full content. For applications that cannot migrate to SSR immediately, dynamic rendering provides a transitional approach — the server detects whether the request comes from a search engine crawler (based on the User-Agent header) and serves a pre-rendered HTML version to crawlers while serving the CSR application to regular users. Dynamic rendering is a temporary solution because Google considers it a form of cloaking if the content differs between the crawler and user versions, and it requires maintaining a rendering infrastructure (Puppeteer, Rendertron) that adds operational complexity. The permanent solution is to adopt SSR/SSG/ISR through a modern framework like Next.js, Nuxt, or SvelteKit, which provides server rendering as a first-class feature.
        </p>
        <p>
          Structured data implementation patterns enable rich results that significantly improve click-through rates from search engine results pages. JSON-LD (JavaScript Object Notation for Linked Data) is Google&apos;s recommended format, placed in a script tag with type=&quot;application/ld+json&quot; in the page head or body. The implementation strategy for dynamic pages (product pages, article pages, event pages) is to generate the JSON-LD dynamically on the server during rendering, embedding the page-specific data (product name, price, availability, reviews; article headline, author, date published, image; event name, date, location, ticket URL) directly into the JSON-LD script. This ensures that the structured data is present in the initial HTML response, available to crawlers without JavaScript execution. For SPAs, the JSON-LD must be injected into the document head during client-side navigation, and Googlebot must execute the JavaScript to discover it — a riskier approach that may result in delayed or missed structured data processing. The structured data should be validated using Google&apos;s Rich Results Test tool before deployment, and monitored in Google Search Console&apos;s Rich Results report after deployment to detect errors (missing required fields, invalid values, deprecated schema types). Common structured data types for web applications include Article (blog posts, news), Product (e-commerce with price, availability, reviews, aggregate rating), FAQ (questions and answers, eligible for FAQ rich results), HowTo (step-by-step instructions, eligible for HowTo rich results), LocalBusiness (address, hours, reviews, geo coordinates), Event (dates, locations, tickets, performers), and BreadcrumbList (navigation hierarchy, eligible for breadcrumb rich results in search listings).
        </p>
        <p>
          International SEO addresses the complexity of serving content in multiple languages and regions, ensuring that search engines understand which language/region version of a page to show to users in different locations. The hreflang attribute is the primary mechanism — it tells search engines the language and regional targeting of each page variant. For example, a page available in English (US), English (UK), and German (DE) would include hreflang tags pointing to each variant: link rel=&quot;alternate&quot; hreflang=&quot;en-us&quot; href=&quot;https://example.com/en-us/page&quot;, link rel=&quot;alternate&quot; hreflang=&quot;en-gb&quot; href=&quot;https://example.com/en-gb/page&quot;, and link rel=&quot;alternate&quot; hreflang=&quot;de&quot; href=&quot;https://example.com/de/page&quot;. Each variant must include hreflang tags pointing to all other variants (reciprocal linking), and each variant should include an x-default hreflang tag pointing to the default/fallback version for users whose language does not match any variant. The hreflang tags should be implemented in the HTML head (as link elements) or in the XML sitemap (as hreflang annotations on each URL), and the implementation must be consistent across all pages. Geo-targeting in Google Search Console allows setting a target country for a domain or subdomain, which helps Google understand which users the content is intended for. For country-specific domains (example.fr, example.de), the geo-targeting is automatic based on the ccTLD. For subdirectories (example.com/fr/, example.com/de/), the geo-targeting must be set manually in Search Console. The URL structure choice (ccTLDs, subdomains, subdirectories) has SEO implications — ccTLDs provide the strongest geo-targeting signal but require separate domains for each country, subdomains are treated as separate properties by Google, and subdirectories consolidate domain authority across all languages within a single property.
        </p>
        <p>
          Core Web Vitals impact on ranking is a confirmed Google search algorithm factor — pages with poor Core Web Vitals scores rank lower than comparable pages with good scores, all else being equal. The ranking impact is relatively modest compared to content relevance and backlink authority, but it becomes significant for competitive queries where many pages have similar content quality and authority. LCP (Largest Contentful Paint) under 2.5s is the loading threshold — pages with LCP above 2.5s are rated &quot;needs improvement&quot; and above 4.0s are rated &quot;poor,&quot; both of which negatively impact ranking. INP (Interaction to Next Paint) under 200ms is the interactivity threshold — pages with INP above 200ms provide a sluggish user experience and are penalized in ranking. CLS (Cumulative Layout Shift) under 0.1 is the visual stability threshold — pages with CLS above 0.1 experience unexpected layout shifts that frustrate users and are penalized in ranking. The Core Web Vitals are measured at the p75 percentile (75% of user experiences must meet the threshold for the page to be rated &quot;good&quot;), meaning that even if most users have good performance, the slowest 25% of users determine the page&apos;s rating. Optimization strategies include server-side rendering for fast LCP (HTML arrives with content already rendered), code splitting and lazy loading for fast INP (less JavaScript to execute), and reserving space for images and embeds for low CLS (preventing layout shift when images load). The Chrome UX Report (CrUX) provides field data for Core Web Vitals at the origin level, and Google Search Console provides page-level Core Web Vitals data for indexed pages.
        </p>
        <p>
          SEO for SPAs presents unique challenges because the initial HTML is empty, and search engines must execute JavaScript to discover content. While Google can execute JavaScript, the two-wave indexing process (HTML indexing followed by JavaScript rendering) introduces delays and uncertainty. The recommended approach for SPAs is to adopt a hybrid rendering strategy — use SSR or SSG for public-facing pages (homepage, landing pages, product pages, blog posts) that benefit from SEO, and CSR for authenticated areas (dashboards, settings, admin panels) where SEO is irrelevant. If the SPA cannot be migrated to SSR/SSG immediately, prerendering provides a middle ground — a prerendering service (Prerender.io, Rendertron, Netlify Prerendering) crawls the SPA, executes the JavaScript, captures the rendered HTML, and serves the pre-rendered HTML to search engine crawlers while serving the live SPA to regular users. Prerendering is easier to implement than full SSR (it does not require changing the application architecture) but introduces a dependency on the prerendering service and may serve stale content if the prerendering cache is not refreshed frequently. The sitemap for an SPA should include all public URLs (not just the homepage), and the routing should use standard URL paths (/products, /about, /contact) rather than hash-based routing (#/products, #/about), because search engines do not reliably execute JavaScript to discover hash-based routes.
        </p>
        <p>
          Search Console automation enables programmatic management of SEO health monitoring, URL indexing, and performance reporting at scale. The Google Search Console API provides access to search performance data (queries, clicks, impressions, average position), index coverage data (indexed pages, errors, warnings), sitemap status, and Core Web Vitals reports. Automated workflows include daily performance monitoring that tracks organic traffic trends and alerts on significant drops (more than 20% week-over-week), weekly index coverage audits that identify new crawl errors or pages blocked by robots.txt, and monthly Core Web Vitals reports that track the percentage of pages rated &quot;good&quot; and identify pages that need optimization. The URL Inspection API allows programmatic inspection of individual URLs to verify their indexing status, detect rendering issues, and request indexing for new or updated pages. The indexing request API (Indexing API) is primarily designed for job postings and live streaming content that needs rapid indexing, but it can be used for any URL that requires immediate indexing (breaking news, time-sensitive product launches). The automated reporting pipeline aggregates Search Console data with analytics data (Google Analytics, Adobe Analytics) and business metrics (conversions, revenue) to provide a comprehensive view of SEO impact — not just traffic volume, but the quality of organic traffic and its contribution to business outcomes. The reporting should segment by query type (branded vs. unbranded searches), page type (product pages, blog posts, category pages), and device (mobile vs. desktop) to identify optimization opportunities within each segment.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What meta tags are essential for SEO?
            </p>
            <p className="mt-2 text-sm">
              A: Title (50-60 characters, primary keyword first, unique per
              page), meta description (150-160 characters, compelling summary),
              canonical URL (prevents duplicate content), viewport
              (mobile-friendly ranking), and robots (crawl control). For social
              sharing: Open Graph tags (og:title, og:description, og:image at
              1200×630) and Twitter Cards (twitter:card, twitter:title,
              twitter:image). Each page needs unique values — duplicate or
              missing meta tags hurt ranking and social sharing.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does rendering strategy affect SEO?
            </p>
            <p className="mt-2 text-sm">
              A: SSR and SSG send full HTML to crawlers — content is immediately
              visible, providing the best SEO. CSR sends empty HTML with
              JavaScript — Google can execute JS but with delays, and other
              search engines may not execute it at all. Social media previews
              are broken with CSR because platforms don&apos;t execute
              JavaScript. Use SSR/SSG/ISR for public content that needs SEO, CSR
              only for authenticated areas where SEO doesn&apos;t matter.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is structured data and why does it matter?
            </p>
            <p className="mt-2 text-sm">
              A: Structured data (Schema.org) uses JSON-LD to provide explicit
              content clues to search engines. It enables rich results —
              enhanced search listings with star ratings, prices, images, FAQs,
              and event information. Rich results achieve higher click-through
              rates due to their enhanced appearance. Common types: Article,
              Product, Recipe, Event, FAQ, LocalBusiness. Validate with
              Google&apos;s Rich Results Test and monitor in Search Console.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do Core Web Vitals affect SEO?
            </p>
            <p className="mt-2 text-sm">
              A: Core Web Vitals (LCP, INP, CLS) are confirmed Google ranking
              signals. Poor performance = lower rankings. LCP under 2.5s
              (loading), INP under 200ms (interactivity), CLS under 0.1
              (visual stability). Optimize images, minimize JavaScript, use CDN,
              enable Brotli compression, implement caching. Monitor in Search
              Console&apos;s Core Web Vitals report to identify pages that need
              improvement. Performance optimization is SEO optimization.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is your SEO checklist for a new page?
            </p>
            <p className="mt-2 text-sm">
              A: Unique title and meta description, canonical URL, proper
              heading hierarchy (one H1, logical H2-H6), semantic HTML, alt
              text for all images, internal links to related content, structured
              data if applicable, Open Graph and Twitter Card tags,
              mobile-friendly responsive design, fast load time (Core Web Vitals
              in &quot;good&quot; range). Test with Lighthouse SEO audit,
              validate structured data with Rich Results Test, and submit the
              URL to Google Search Console for indexing.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developers.google.com/search"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Search Central — Documentation and Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://schema.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Schema.org — Structured Data Vocabulary
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/learn/seo/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — SEO Fundamentals
            </a>
          </li>
          <li>
            <a
              href="https://search.google.com/test/rich-results"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Rich Results Test
            </a>
          </li>
          <li>
            <a
              href="https://moz.com/beginners-guide-to-seo"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Moz — Beginner&apos;s Guide to SEO
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
