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
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-15",
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
        <h2>Definition & Context</h2>
        <p>
          <strong>SEO (Search Engine Optimization)</strong> encompasses
          techniques to improve a website&apos;s visibility in search engine
          results. For frontend engineers, SEO involves technical
          implementation: meta tags, structured data, site architecture,
          performance optimization, and ensuring content is crawlable and
          indexable.
        </p>
        <p>
          <strong>Discoverability</strong> extends beyond search engines to
          social media sharing, link previews, and content syndication. Proper
          Open Graph tags, Twitter Cards, and structured data ensure content
          looks compelling when shared.
        </p>
        <p>
          For staff engineers, SEO is a business-critical NFR. Organic search
          drives significant traffic for content sites, e-commerce, and SaaS.
          Poor SEO directly impacts revenue. Technical SEO decisions (SSR vs
          CSR, URL structure, site speed) are often made by frontend teams.
        </p>
        <p>
          <strong>SEO impact factors:</strong>
        </p>
        <ul>
          <li>
            <strong>Content:</strong> Quality, relevance, keyword optimization
          </li>
          <li>
            <strong>Technical:</strong> Crawlability, site speed,
            mobile-friendliness, HTTPS
          </li>
          <li>
            <strong>UX signals:</strong> Bounce rate, dwell time, Core Web
            Vitals
          </li>
          <li>
            <strong>Authority:</strong> Backlinks, domain reputation
          </li>
        </ul>
      </section>

      <section>
        <h2>Meta Tags</h2>
        <p>
          Meta tags provide search engines and social platforms with information
          about your pages.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Essential Meta Tags</h3>
        <ul className="space-y-2">
          <li>
            <strong>Title:</strong>{" "}
            <code>&lt;title&gt;Page Title | Site Name&lt;/title&gt;</code>
            <br />
            50-60 characters, primary keyword first, unique per page.
          </li>
          <li>
            <strong>Description:</strong>{" "}
            <code>
              &lt;meta name=&quot;description&quot; content=&quot;...&quot;&gt;
            </code>
            <br />
            150-160 characters, compelling summary, includes keywords. Shows in
            search results.
          </li>
          <li>
            <strong>Canonical:</strong>{" "}
            <code>
              &lt;link rel=&quot;canonical&quot; href=&quot;...&quot;&gt;
            </code>
            <br />
            Prevents duplicate content issues. Specifies preferred URL when
            content exists at multiple URLs.
          </li>
          <li>
            <strong>Viewport:</strong>{" "}
            <code>
              &lt;meta name=&quot;viewport&quot;
              content=&quot;width=device-width, initial-scale=1&quot;&gt;
            </code>
            <br />
            Required for mobile-friendly ranking.
          </li>
          <li>
            <strong>Robots:</strong>{" "}
            <code>
              &lt;meta name=&quot;robots&quot; content=&quot;index,
              follow&quot;&gt;
            </code>
            <br />
            Controls crawling: index/noindex, follow/nofollow.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Open Graph Tags (Social Sharing)
        </h3>
        <p>
          Open Graph tags control how pages appear when shared on Facebook,
          LinkedIn, and other platforms.
        </p>
        <ul className="space-y-2">
          <li>
            <code>og:title</code> — Page title for social sharing
          </li>
          <li>
            <code>og:description</code> — Description for social cards
          </li>
          <li>
            <code>og:image</code> — Preview image (1200×630 recommended)
          </li>
          <li>
            <code>og:url</code> — Canonical URL
          </li>
          <li>
            <code>og:type</code> — Content type (website, article, product)
          </li>
          <li>
            <code>og:site_name</code> — Site name
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Twitter Cards</h3>
        <p>Twitter-specific tags for enhanced tweets.</p>
        <ul className="space-y-2">
          <li>
            <code>twitter:card</code> — Card type (summary, summary_large_image)
          </li>
          <li>
            <code>twitter:title</code> — Tweet title
          </li>
          <li>
            <code>twitter:description</code> — Tweet description
          </li>
          <li>
            <code>twitter:image</code> — Preview image
          </li>
          <li>
            <code>twitter:site</code> — @username of site
          </li>
          <li>
            <code>twitter:creator</code> — @username of author
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/meta-tags-social-preview.svg"
          alt="Meta Tags and Social Preview"
          caption="How meta tags appear in search results and social media previews — title, description, and image optimization"
        />
      </section>

      <section>
        <h2>Structured Data (Schema.org)</h2>
        <p>
          Structured data provides explicit clues about page content to search
          engines, enabling rich results (enhanced search listings with stars,
          prices, images).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Common Schema Types</h3>
        <ul className="space-y-2">
          <li>
            <strong>Article:</strong> Blog posts, news articles
          </li>
          <li>
            <strong>Product:</strong> E-commerce products with price,
            availability, reviews
          </li>
          <li>
            <strong>Recipe:</strong> Cooking recipes with ingredients, nutrition
          </li>
          <li>
            <strong>Event:</strong> Events with dates, locations, tickets
          </li>
          <li>
            <strong>FAQ:</strong> FAQ pages with questions and answers
          </li>
          <li>
            <strong>LocalBusiness:</strong> Business info with address, hours,
            reviews
          </li>
          <li>
            <strong>JobPosting:</strong> Job listings with salary, location,
            requirements
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">JSON-LD Format</h3>
        <p>JSON-LD is Google&apos;s recommended format for structured data.</p>
        <ul className="space-y-2">
          <li>
            Placed in{" "}
            <code>&lt;script type=&quot;application/ld+json&quot;&gt;</code> tag
          </li>
          <li>Doesn&apos;t affect page rendering</li>
          <li>Easy to generate dynamically</li>
          <li>Validated with Google&apos;s Rich Results Test</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Rich Results Benefits
        </h3>
        <ul className="space-y-2">
          <li>Higher click-through rates (enhanced appearance)</li>
          <li>Better visibility in search results</li>
          <li>
            Eligibility for special features (carousels, knowledge panels)
          </li>
          <li>Voice search optimization</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Implementation</h3>
        <ul className="space-y-2">
          <li>Use schema.org vocabulary</li>
          <li>Include required properties for your content type</li>
          <li>Test with Google Rich Results Test</li>
          <li>Monitor in Google Search Console</li>
          <li>Keep structured data in sync with visible content</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/structured-data-rich-results.svg"
          alt="Structured Data Rich Results"
          caption="Examples of rich results enabled by structured data — product cards, recipes, FAQs, and events"
        />
      </section>

      <section>
        <h2>Technical SEO</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">XML Sitemaps</h3>
        <p>Sitemaps help search engines discover all pages on your site.</p>
        <ul className="space-y-2">
          <li>List all important URLs</li>
          <li>Include lastmod (last modified date)</li>
          <li>Exclude noindex pages, duplicates</li>
          <li>Submit to Google Search Console</li>
          <li>Reference in robots.txt</li>
          <li>Keep under 50,000 URLs per sitemap (split if larger)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Robots.txt</h3>
        <p>Controls which parts of your site crawlers can access.</p>
        <ul className="space-y-2">
          <li>
            <code>User-agent: *</code> — Apply to all crawlers
          </li>
          <li>
            <code>Disallow: /admin/</code> — Block specific paths
          </li>
          <li>
            <code>Sitemap: https://example.com/sitemap.xml</code> — Reference
            sitemap
          </li>
          <li>Don&apos;t block CSS/JS (needed for rendering)</li>
          <li>
            Use noindex meta tag, not robots.txt, for pages you want out of
            search
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">URL Structure</h3>
        <ul className="space-y-2">
          <li>Use descriptive, keyword-rich URLs</li>
          <li>Keep URLs short and readable</li>
          <li>Use hyphens to separate words</li>
          <li>Avoid parameters when possible</li>
          <li>Use lowercase consistently</li>
          <li>Implement proper redirects for URL changes (301)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Internal Linking</h3>
        <ul className="space-y-2">
          <li>Link to important pages from homepage</li>
          <li>Use descriptive anchor text</li>
          <li>Create logical site hierarchy</li>
          <li>Implement breadcrumbs</li>
          <li>Avoid orphan pages (pages with no incoming links)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Mobile-First Indexing
        </h3>
        <ul className="space-y-2">
          <li>Google primarily uses mobile version for indexing</li>
          <li>Ensure mobile and desktop have same content</li>
          <li>Responsive design preferred</li>
          <li>Test with Google&apos;s Mobile-Friendly Test</li>
          <li>Avoid intrusive interstitials on mobile</li>
        </ul>
      </section>

      <section>
        <h2>SEO and Rendering Strategies</h2>
        <p>How you render pages significantly impacts SEO.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Server-Side Rendering (SSR)
        </h3>
        <p>Best for SEO — full HTML sent to crawler.</p>
        <ul className="space-y-2">
          <li>Content immediately available in HTML</li>
          <li>No JavaScript execution needed</li>
          <li>Fastest time to content for crawlers</li>
          <li>Ideal for: content sites, e-commerce, news</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Static Site Generation (SSG)
        </h3>
        <p>Excellent for SEO — pre-rendered HTML.</p>
        <ul className="space-y-2">
          <li>HTML generated at build time</li>
          <li>Fastest delivery (CDN-served)</li>
          <li>Content must be known at build time</li>
          <li>Ideal for: blogs, documentation, marketing pages</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Client-Side Rendering (CSR)
        </h3>
        <p>Problematic for SEO — content loaded via JavaScript.</p>
        <ul className="space-y-2">
          <li>Initial HTML is empty shell</li>
          <li>Google can execute JavaScript but with delays</li>
          <li>Other crawlers may not execute JS</li>
          <li>Social media previews often broken</li>
          <li>
            Only use for: authenticated apps, dashboards (where SEO doesn&apos;t
            matter)
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Hybrid Approach</h3>
        <p>Different pages, different strategies.</p>
        <ul className="space-y-2">
          <li>SSG/SSR for public, SEO-critical pages</li>
          <li>CSR for authenticated, dashboard areas</li>
          <li>Next.js, Nuxt, SvelteKit support hybrid</li>
          <li>Configure per-route based on SEO needs</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/seo-rendering-strategies.svg"
          alt="SEO and Rendering Strategies"
          caption="How rendering strategies affect SEO — SSR/SSG provide immediate content, CSR requires JavaScript execution"
        />
      </section>

      <section>
        <h2>Core Web Vitals and SEO</h2>
        <p>
          Google uses Core Web Vitals as ranking signals. Poor performance
          directly impacts search rankings.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Core Web Vitals</h3>
        <ul className="space-y-2">
          <li>
            <strong>LCP (Largest Contentful Paint):</strong> Loading
            performance. Target: &lt;2.5s
          </li>
          <li>
            <strong>INP (Interaction to Next Paint):</strong> Interactivity.
            Target: &lt;200ms
          </li>
          <li>
            <strong>CLS (Cumulative Layout Shift):</strong> Visual stability.
            Target: &lt;0.1
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Performance SEO Tips
        </h3>
        <ul className="space-y-2">
          <li>Optimize images (WebP/AVIF, proper sizing, lazy loading)</li>
          <li>Preload critical resources (fonts, LCP image)</li>
          <li>Minimize JavaScript (code splitting, tree shaking)</li>
          <li>Use CDN for static assets</li>
          <li>Enable compression (Brotli)</li>
          <li>Implement caching strategies</li>
          <li>Monitor with PageSpeed Insights, Search Console</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What meta tags are essential for SEO?
            </p>
            <p className="mt-2 text-sm">
              A: Title (50-60 chars, keyword first), description (150-160 chars,
              compelling summary), canonical URL (prevents duplicates), viewport
              (mobile-friendly), and robots (crawl control). For social sharing:
              Open Graph tags (og:title, og:description, og:image) and Twitter
              Cards.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does rendering strategy affect SEO?
            </p>
            <p className="mt-2 text-sm">
              A: SSR and SSG send full HTML to crawlers — best for SEO. CSR
              sends empty HTML with JavaScript — Google can execute JS but with
              delays, other crawlers may not. Social media previews often break
              with CSR. Use SSR/SSG for public content, CSR for authenticated
              areas where SEO doesn&apos;t matter.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is structured data and why does it matter?
            </p>
            <p className="mt-2 text-sm">
              A: Structured data (Schema.org) provides explicit content clues to
              search engines using JSON-LD. Enables rich results — enhanced
              listings with stars, prices, images. Higher click-through rates,
              better visibility. Common types: Article, Product, Recipe, Event,
              FAQ, LocalBusiness. Validate with Google Rich Results Test.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do Core Web Vitals affect SEO?
            </p>
            <p className="mt-2 text-sm">
              A: Core Web Vitals (LCP, INP, CLS) are Google ranking signals.
              Poor performance = lower rankings. LCP under 2.5s (loading), INP
              under 200ms (interactivity), CLS under 0.1 (stability). Optimize
              images, minimize JS, use CDN, enable compression, implement
              caching. Monitor in Search Console.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What&apos;s your SEO checklist for a new page?
            </p>
            <p className="mt-2 text-sm">
              A: Unique title/description, canonical URL, proper heading
              hierarchy (H1-H6), semantic HTML, alt text for images, internal
              links, structured data (if applicable), Open Graph tags,
              mobile-friendly, fast load time, XML sitemap inclusion, robots.txt
              allows crawling. Test with Lighthouse, validate structured data,
              submit to Search Console.
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
              Google Search Central
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
        </ul>
      </section>
    </ArticleLayout>
  );
}
