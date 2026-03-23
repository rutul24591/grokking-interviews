"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-url-structure-extensive",
  title: "URL Structure",
  description:
    "Staff-level deep dive into SEO-friendly URL structure including hierarchical path design, URL migration strategies, parameter handling, and internationalized URLs.",
  category: "frontend",
  subcategory: "seo-optimization",
  slug: "url-structure",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-22",
  tags: [
    "frontend",
    "SEO",
    "URL structure",
    "URL design",
    "slugs",
    "URL migration",
    "redirects",
  ],
  relatedTopics: [
    "canonical-urls",
    "xml-sitemaps",
    "pagination-and-infinite-scroll-seo",
  ],
};

export default function UrlStructureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>URL structure</strong> is the design of a website&apos;s URL
          patterns — how paths are organized, how resources are named, and how
          the URL hierarchy maps to the site&apos;s information architecture. A
          well-designed URL structure serves three audiences simultaneously:
          users (who read URLs to understand context and navigation), search
          engines (which use URL signals for crawling, indexing, and ranking),
          and developers (who maintain routing logic and URL generation).
        </p>
        <p>
          Google has consistently stated that URLs are a minor ranking factor,
          but their impact on SEO extends far beyond direct ranking signals.
          Clean, descriptive URLs improve click-through rates in search results
          (users are more likely to click a URL they can read and understand),
          facilitate better internal and external linking (anchor text in shared
          URLs is more meaningful), reduce duplicate content issues (clean URL
          patterns minimize parameter-based duplicates), and improve crawl
          efficiency (predictable URL structures allow more efficient crawling).
        </p>
        <p>
          At the staff/principal engineer level, URL structure is an
          architectural decision made during system design that becomes
          extremely expensive to change after launch. URL migrations — changing
          the structure of existing URLs — require comprehensive redirect
          mapping, sitemap regeneration, canonical updates, and months of
          monitoring as search engines process the changes. A URL structure
          designed with scalability, internationalization, and content growth in
          mind prevents costly migrations later.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>URL Components:</strong> A URL consists of protocol
            (https://), subdomain (www), domain (example.com), path
            (/category/product), query parameters (?color=red), and fragment
            (#section). For SEO, the path is the most important component — it
            should be descriptive, hierarchical, and stable. Query parameters
            should be reserved for non-content-affecting state (sorting,
            filtering, tracking).
          </li>
          <li>
            <strong>Slug Design:</strong> A slug is the URL-safe representation
            of a page title or identifier. Effective slugs are lowercase,
            hyphen-separated, concise, and include relevant keywords without
            being keyword-stuffed. &quot;running-shoes-men&quot; is better than
            &quot;mens-high-performance-running-shoes-2026-new-arrival&quot; or
            &quot;product-12345.&quot;
          </li>
          <li>
            <strong>Hierarchical Paths:</strong> URLs organized in a tree
            structure (/electronics/phones/iphone-16) that reflects the
            site&apos;s content taxonomy. Each path segment represents a level
            in the hierarchy. This structure helps search engines understand
            content relationships and enables breadcrumb generation.
          </li>
          <li>
            <strong>Flat URL Structures:</strong> All pages exist at the root
            level (/iphone-16-review, /galaxy-s25-review) without hierarchical
            nesting. Flat structures minimize URL depth but sacrifice
            hierarchical context. Best suited for blogs or sites where content
            doesn&apos;t have a natural taxonomy.
          </li>
          <li>
            <strong>URL Parameters vs Path Segments:</strong> Content-defining
            attributes should be path segments (/shoes/red) while state
            modifiers should be parameters (/shoes?sort=price). Path segments
            are considered part of the URL identity (different paths = different
            pages), while parameters are often treated as variations of the same
            page by search engines.
          </li>
          <li>
            <strong>Trailing Slashes:</strong> Whether URLs end with a trailing
            slash (/about/ vs /about) is technically irrelevant for SEO, but
            consistency is essential. Both versions should resolve to the same
            content via redirect or canonical. Inconsistency creates duplicate
            content.
          </li>
          <li>
            <strong>Case Sensitivity:</strong> URLs are technically
            case-sensitive per HTTP specification. /About and /about are
            different URLs. However, most sites and search engines treat URLs as
            case-insensitive. Best practice is to use lowercase exclusively and
            redirect any uppercase variants to lowercase.
          </li>
          <li>
            <strong>Hyphens vs Underscores:</strong> Google treats hyphens as
            word separators but treats underscores as word joiners.
            &quot;web-design&quot; is read as two words while
            &quot;web_design&quot; is read as one word. Always use hyphens in
            URL slugs.
          </li>
          <li>
            <strong>Internationalized URLs:</strong> Multi-language sites must
            choose between subdirectories (/en/products, /fr/products),
            subdomains (en.example.com, fr.example.com), or country-code TLDs
            (example.co.uk, example.fr). Each approach has different
            implications for domain authority, server configuration, and content
            management.
          </li>
          <li>
            <strong>URL Length:</strong> While no official limit exists for SEO,
            URLs beyond 2,048 characters may be truncated by browsers and tools.
            Practical best practice is to keep URLs under 100 characters.
            Shorter, more readable URLs tend to perform better in click-through
            rates and social sharing.
          </li>
        </ul>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          URL architecture decisions cascade through the entire application
          stack, from routing configuration to content management to SEO
          infrastructure.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/seo-optimization/url-structure-diagram-1.svg"
          alt="URL anatomy breakdown showing protocol, subdomain, domain, path segments, query parameters, and fragment with their SEO relevance"
        />
        <p>
          Each URL component carries different SEO weight. The domain and path
          are the primary identifiers that search engines use for indexing.
          Query parameters are secondary signals that may or may not indicate
          distinct content. Fragments (hash) are completely ignored by search
          engines — content accessible only via fragment changes (hash routing)
          is effectively invisible to crawlers.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/seo-optimization/url-structure-diagram-2.svg"
          alt="URL hierarchy and site architecture mapping showing how URL paths reflect content taxonomy and information architecture"
        />
        <p>
          The URL hierarchy should mirror the site&apos;s information
          architecture. A well-structured URL path (/electronics/phones/iphone)
          communicates the content&apos;s position in the taxonomy, enables
          automated breadcrumb generation, and helps search engines understand
          topic clustering. URLs should be designed alongside the content
          taxonomy, not as an afterthought.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/seo-optimization/url-structure-diagram-3.svg"
          alt="URL migration and redirect chain architecture showing how old URLs are mapped to new URLs via 301 redirects during site restructuring"
        />
        <p>
          URL migrations require comprehensive redirect mapping to preserve
          ranking signals. Each old URL must 301 redirect to its corresponding
          new URL. Redirect chains (old → intermediate → new) should be avoided
          — always redirect directly to the final destination. During migration,
          sitemaps must be updated, canonical tags adjusted, and internal links
          rewritten. Google Search Console&apos;s Change of Address tool can
          accelerate the process for domain-level migrations.
        </p>
      </section>

      {/* Section 4: Trade-offs & Comparisons */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Approach</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3 font-medium">Hierarchical URLs</td>
              <td className="p-3">
                Clear content relationships; enables breadcrumbs; reflects
                taxonomy; helps search engines understand topic clusters
              </td>
              <td className="p-3">
                Deeper paths reduce crawl priority; category changes require URL
                changes; rigid structure limits content reorganization
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Flat URLs</td>
              <td className="p-3">
                Minimal crawl depth; simple routing; content can be reorganized
                without URL changes; no dependency on taxonomy
              </td>
              <td className="p-3">
                No hierarchical context; harder to generate breadcrumbs;
                potential slug conflicts; doesn&apos;t communicate content
                relationships
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Subdirectory i18n (/en/)</td>
              <td className="p-3">
                Consolidated domain authority; single hosting setup; easy to
                manage in one codebase; clear language segmentation
              </td>
              <td className="p-3">
                Less geo-targeting signal than ccTLDs; all languages share one
                domain reputation; complex routing configuration
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium">
                Subdomain i18n (en.example.com)
              </td>
              <td className="p-3">
                Can be hosted independently; separate Search Console properties;
                flexible infrastructure per region
              </td>
              <td className="p-3">
                Domain authority is not fully shared; treated as separate sites
                by search engines; additional DNS and hosting complexity
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Use Descriptive, Keyword-Relevant Slugs:</strong> URLs
            should be readable and describe the page content.
            /blog/seo-url-best-practices is better than /blog/post-12345 or
            /blog/p?id=12345. Include primary keywords naturally without
            stuffing.
          </li>
          <li>
            <strong>Keep URLs as Short as Practical:</strong> Remove unnecessary
            words (articles, prepositions) from slugs. /shoes/nike-air-max is
            better than /shop/all-shoes/brand-nike/nike-air-max-running-shoes.
            Shorter URLs are easier to share, less likely to be truncated, and
            have higher click-through rates.
          </li>
          <li>
            <strong>Use Hyphens as Word Separators:</strong> Always use hyphens
            (-) not underscores (_) or spaces (%20). Google explicitly treats
            hyphens as word separators, making &quot;url-structure-guide&quot;
            parseable as three distinct words.
          </li>
          <li>
            <strong>Enforce Lowercase URLs:</strong> Implement server-side or
            CDN-level redirects that convert any uppercase URL to its lowercase
            equivalent. This prevents duplicate content from case variations.
          </li>
          <li>
            <strong>Choose a Trailing Slash Convention and Enforce It:</strong>{" "}
            Pick either trailing slash or no trailing slash and redirect the
            alternative. Next.js&apos;s <code>trailingSlash</code> config option
            handles this at the framework level. Inconsistency creates duplicate
            URLs.
          </li>
          <li>
            <strong>Design for Stability:</strong> URLs should be permanent.
            Once published and indexed, changing a URL requires a redirect and
            loses some ranking equity. Design URL patterns that accommodate
            content changes — use slugs based on content identity rather than
            attributes that might change (product titles can change, product IDs
            should not).
          </li>
          <li>
            <strong>Plan URL Migrations Carefully:</strong> Map every old URL to
            its new counterpart. Implement 301 redirects (not 302). Update
            sitemaps, canonical tags, and internal links. Monitor 404 errors in
            Search Console for missed redirects. Allow 3-6 months for full
            migration to settle.
          </li>
          <li>
            <strong>Use Subdirectories for Internationalization:</strong> Google
            recommends subdirectories (/en/, /fr/) as the default approach for
            multi-language sites. They consolidate domain authority, are simpler
            to manage, and work well with hreflang annotations.
          </li>
        </ol>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>ID-Only URLs:</strong> Using database IDs as the sole URL
            identifier (/product/123456) provides no keyword signal, no user
            context, and no content description. Always include a descriptive
            slug, optionally alongside an ID for uniqueness
            (/product/123456/nike-air-max).
          </li>
          <li>
            <strong>Session IDs in URLs:</strong> Appending session IDs to URLs
            (/page?sessionid=abc123) creates infinite duplicate URLs. Each user
            session generates a new &quot;page&quot; from the crawler&apos;s
            perspective. Use cookies for session management, not URL parameters.
          </li>
          <li>
            <strong>Hash-Based Routing for Content:</strong> Using fragment
            identifiers for navigation (/app#/products/shoes) makes content
            invisible to search engines. Fragments are stripped before server
            requests — the server always receives /app regardless of the hash
            content. Use path-based routing for any content that should be
            indexed.
          </li>
          <li>
            <strong>Excessively Deep URL Hierarchies:</strong> URLs with 5+
            levels of nesting (/a/b/c/d/e/product) signal low importance to
            crawlers and are difficult for users to parse. Keep maximum nesting
            to 3-4 levels.
          </li>
          <li>
            <strong>Changing URLs Without Redirects:</strong> Restructuring URLs
            without implementing 301 redirects causes 404 errors for all
            existing links, bookmarks, and search engine index entries. Ranking
            equity built over months or years is lost instantly.
          </li>
          <li>
            <strong>Keyword Stuffing in URLs:</strong> URLs like
            /best-cheap-seo-tools-free-seo-software-top-seo are spammy, damage
            user trust, and may trigger search engine spam filters. Keep slugs
            concise and natural.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Stack Overflow:</strong> Uses a hybrid ID + slug pattern
            (/questions/12345/how-to-parse-json). The numeric ID ensures
            uniqueness while the slug provides readability and keyword signals.
            If the slug changes (question title edit), the old slug redirects to
            the new one while the ID remains stable.
          </li>
          <li>
            <strong>Shopify:</strong> Enforces a consistent URL structure across
            millions of stores: /collections/collection-name for categories,
            /products/product-slug for products. This predictable pattern
            enables platform-wide SEO tooling and consistent crawler behavior.
          </li>
          <li>
            <strong>Wikipedia:</strong> Uses a flat URL structure with
            descriptive slugs (/wiki/URL_structure). Despite millions of
            articles, the flat /wiki/ prefix keeps all content at minimal crawl
            depth. Underscores are used instead of hyphens — a legacy decision
            that predates Google&apos;s hyphen recommendation.
          </li>
          <li>
            <strong>Airbnb:</strong> Implements subdirectory
            internationalization with hierarchical paths: /en/rooms/12345 for
            English, /fr/rooms/12345 for French. The room ID ensures
            cross-language consistency while hreflang annotations connect
            language variants.
          </li>
        </ul>
      </section>

      {/* Section 8: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Should you use a hierarchical or flat URL structure?
            </p>
            <p className="mt-2 text-sm">
              A: It depends on the content model. Hierarchical URLs
              (/category/subcategory/item) are best for e-commerce,
              documentation, and sites with clear taxonomies — they communicate
              content relationships and enable breadcrumbs. Flat URLs
              (/item-slug) are better for blogs, news sites, and content that
              doesn&apos;t have a natural hierarchy. The key principle is that
              URL structure should reflect actual content organization. Avoid
              deep hierarchies (more than 3-4 levels) as they increase crawl
              depth and reduce URL readability.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle a large-scale URL migration?
            </p>
            <p className="mt-2 text-sm">
              A: First, create a comprehensive mapping between old and new URLs
              — every old URL must have a 301 redirect to its new counterpart.
              Implement redirects at the server/CDN level for performance.
              Update all internal links to point directly to new URLs
              (don&apos;t rely on redirect chains). Regenerate sitemaps with new
              URLs. Update canonical tags. Submit new sitemaps in Search
              Console. Monitor 404 reports daily for the first month. Track
              organic traffic at the page level to identify pages that lost
              rankings. Keep old redirects in place for at least 12 months —
              removing them too early causes ranking loss.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the SEO difference between subdirectory and subdomain
              for internationalization?
            </p>
            <p className="mt-2 text-sm">
              A: Subdirectories (/en/, /fr/) consolidate all domain authority
              under one domain — links to any language version benefit the
              entire domain. Subdomains (en.example.com) are treated as separate
              sites by search engines, meaning domain authority is split. Google
              recommends subdirectories as the default approach. Subdomains are
              appropriate when language versions need different infrastructure,
              CDN configurations, or hosting regions. ccTLDs (.co.uk, .fr)
              provide the strongest geo-targeting signal but fully split domain
              authority.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Why should you avoid using hash-based routing for SEO content?
            </p>
            <p className="mt-2 text-sm">
              A: Hash fragments (#section) are not sent to the server in HTTP
              requests — the server always receives the URL without the
              fragment. Search engines strip fragments before indexing, meaning
              /app#/products and /app#/about are the same URL to Google. All
              content behind hash routing is invisible to crawlers that
              don&apos;t execute JavaScript. Even Googlebot, which does execute
              JavaScript, does not interact with hash-based state changes.
              Path-based routing (/products, /about) is mandatory for any
              content targeting search traffic.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle URL slugs when content titles change?
            </p>
            <p className="mt-2 text-sm">
              A: The safest approach is to generate the slug once at content
              creation and never change it, even if the title is updated. This
              preserves the URL permanently, avoiding redirect management. Stack
              Overflow uses this pattern — question URLs contain the original
              title slug, and any slug works as long as the numeric ID is
              correct. If slugs must change (rare), implement a 301 redirect
              from the old slug to the new one and keep the redirect
              permanently. Never change slugs without redirects.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References & Further Reading */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developers.google.com/search/docs/crawling-indexing/url-structure"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              Google Search Central — URL Structure
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              Google — Managing Multi-Regional Sites
            </a>
          </li>
          <li>
            <a
              href="https://datatracker.ietf.org/doc/html/rfc3986"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              RFC 3986 — Uniform Resource Identifier (URI) Syntax
            </a>
          </li>
          <li>
            <a
              href="https://ahrefs.com/blog/seo-friendly-urls/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              Ahrefs — SEO-Friendly URLs Guide
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
