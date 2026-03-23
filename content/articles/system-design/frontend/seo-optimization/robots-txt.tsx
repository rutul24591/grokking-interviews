"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-robots-txt-extensive",
  title: "robots.txt",
  description:
    "Staff-level deep dive into robots.txt including directive syntax, crawl budget management, crawler-specific rules, and security considerations for web applications.",
  category: "frontend",
  subcategory: "seo-optimization",
  slug: "robots-txt",
  wordCount: 4200,
  readingTime: 17,
  lastUpdated: "2026-03-22",
  tags: [
    "frontend",
    "SEO",
    "robots.txt",
    "crawl budget",
    "web crawlers",
    "indexing control",
  ],
  relatedTopics: ["xml-sitemaps", "meta-tags", "canonical-urls"],
};

export default function RobotsTxtArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>robots.txt</strong> is a plain-text file placed at the root of
          a website (example.com/robots.txt) that instructs web crawlers which
          URLs they are allowed or disallowed from accessing. Formally defined
          by the <strong>Robots Exclusion Protocol</strong> (RFC 9309, published
          in 2022), robots.txt has been the primary mechanism for managing
          crawler access since 1994, making it one of the oldest and most
          fundamental web standards still in active use.
        </p>
        <p>
          Every major search engine crawler — Googlebot, Bingbot, Baiduspider,
          Yandex — checks robots.txt before crawling any URL on a domain. The
          file is fetched once and cached (Google caches it for up to 24 hours),
          and its directives are applied to all subsequent crawl requests. A
          missing robots.txt (404 response) is interpreted as full crawl
          permission, while a server error (5xx response) causes crawlers to
          temporarily halt crawling the entire site.
        </p>
        <p>
          At the staff/principal engineer level, robots.txt is a critical
          infrastructure configuration that directly impacts crawl budget
          allocation, indexation coverage, and security posture. A single
          misplaced <code>Disallow: /</code> directive can prevent search
          engines from indexing the entire site — and because robots.txt is
          served from a static path with no build-time validation by default,
          this type of error can ship to production undetected. Conversely,
          overly permissive robots.txt can expose internal endpoints, admin
          panels, and staging content to crawlers, creating both security and
          SEO problems.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>User-agent Directive:</strong> Specifies which crawler the
            following rules apply to. <code>User-agent: *</code> targets all
            crawlers. Specific crawlers like <code>User-agent: Googlebot</code>{" "}
            or <code>User-agent: Bingbot</code> allow crawler-specific rules.
            Crawlers use the most specific matching user-agent block — if both a
            wildcard and Googlebot-specific block exist, Googlebot follows only
            its specific block.
          </li>
          <li>
            <strong>Disallow Directive:</strong> Prevents crawlers from
            accessing URLs matching the specified path prefix.{" "}
            <code>Disallow: /admin</code> blocks all URLs starting with /admin.{" "}
            <code>Disallow: /</code> blocks the entire site.{" "}
            <code>Disallow:</code> (empty value) allows everything. Disallow
            prevents crawling but does not prevent indexing — a page can still
            appear in search results (without a snippet) if other pages link to
            it.
          </li>
          <li>
            <strong>Allow Directive:</strong> Explicitly permits access to URLs
            within a disallowed path. <code>Allow: /admin/public</code> combined
            with <code>Disallow: /admin</code> blocks all /admin paths except
            /admin/public. The Allow directive was not in the original protocol
            but is now standardized in RFC 9309 and supported by all major
            crawlers.
          </li>
          <li>
            <strong>Sitemap Directive:</strong> Declares the location of XML
            sitemaps. <code>Sitemap: https://example.com/sitemap.xml</code> can
            appear anywhere in the file and is not scoped to a user-agent block.
            Multiple Sitemap directives can reference different sitemap files.
          </li>
          <li>
            <strong>Crawl-delay Directive:</strong> Specifies the number of
            seconds a crawler should wait between requests. Supported by Bingbot
            and Yandex but ignored by Googlebot (which manages its own crawl
            rate). Google provides crawl rate settings in Search Console
            instead.
          </li>
          <li>
            <strong>Wildcard Patterns:</strong> RFC 9309 standardized wildcard
            support. <code>*</code> matches any sequence of characters.{" "}
            <code>$</code> anchors the match to the end of the URL.{" "}
            <code>Disallow: /*.pdf$</code> blocks all URLs ending in .pdf.{" "}
            <code>Disallow: /*/temp</code> blocks URLs containing /temp at any
            depth.
          </li>
          <li>
            <strong>Path Matching Rules:</strong> Directives match path
            prefixes, not exact paths. <code>Disallow: /fish</code> blocks
            /fish, /fish.html, /fish/salmon, and /fisherman. The matching is
            case-sensitive. Longer, more specific paths take precedence over
            shorter paths when Allow and Disallow conflict.
          </li>
          <li>
            <strong>HTTP Status Code Behavior:</strong> If robots.txt returns
            200, directives are followed. If 404, crawlers assume no
            restrictions. If 5xx, crawlers assume full disallow and temporarily
            stop crawling the site. If 429 (rate limited), crawlers reduce their
            crawl rate. This makes robots.txt availability a critical uptime
            concern.
          </li>
        </ul>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Understanding how crawlers evaluate robots.txt is essential for
          writing effective rules and diagnosing crawl issues.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/seo-optimization/robots-txt-diagram-1.svg"
          alt="Crawler request flow showing how robots.txt is fetched, cached, and evaluated before each URL request"
        />
        <p>
          When a crawler encounters a new domain, it first fetches robots.txt
          and caches the result. For every subsequent URL on that domain, the
          crawler checks the cached rules before making the request. If the URL
          matches a Disallow pattern, the request is skipped. This means
          robots.txt is one of the highest-traffic files on any website — it
          receives a request before any other crawl activity begins.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/seo-optimization/robots-txt-diagram-2.svg"
          alt="Robots.txt directive hierarchy showing how specificity rules determine which Allow or Disallow directive takes precedence"
        />
        <p>
          When multiple directives could apply to a URL, the most specific
          (longest matching) path wins. If an Allow and Disallow directive have
          the same path length, Allow takes precedence (per Google&apos;s
          implementation). This specificity-based resolution enables granular
          control — you can disallow a broad path while allowing specific
          sub-paths within it.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/seo-optimization/robots-txt-diagram-3.svg"
          alt="Crawl budget management architecture showing how robots.txt, server capacity, and content signals determine overall crawl allocation"
        />
        <p>
          Crawl budget is the combined effect of crawl rate limit (how fast
          Google can crawl without overloading the server) and crawl demand (how
          many URLs Google wants to crawl based on importance and freshness).
          robots.txt directly shapes crawl budget by removing low-value URLs
          from the crawl pool, allowing the budget to be spent on high-value
          content.
        </p>
      </section>

      {/* Section 4: Trade-offs & Comparisons */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Mechanism</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3 font-medium">robots.txt Disallow</td>
              <td className="p-3">
                Prevents crawling entirely; saves crawl budget; site-wide
                configuration in one file; no per-page markup needed
              </td>
              <td className="p-3">
                Does not prevent indexing (URLs can still appear in results
                without snippets); publicly visible; no page-level granularity
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Meta Robots noindex</td>
              <td className="p-3">
                Prevents indexing definitively; page-level control; can combine
                noindex with follow to pass link equity; invisible in source
              </td>
              <td className="p-3">
                Requires crawling the page first (uses crawl budget); must be in
                every page&apos;s HTML; can be overridden by CMS errors
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium">X-Robots-Tag Header</td>
              <td className="p-3">
                Works for non-HTML resources (PDFs, images); server-level
                control; can be set via CDN/proxy rules
              </td>
              <td className="p-3">
                Requires server/CDN configuration; less visible than HTML
                directives; requires crawling the resource
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium">nofollow Link Attribute</td>
              <td className="p-3">
                Link-level control; prevents specific link equity transfer;
                useful for UGC and sponsored content
              </td>
              <td className="p-3">
                Does not prevent discovery or indexing; Google treats nofollow
                as a hint since 2019; requires per-link implementation
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
            <strong>Keep robots.txt Simple and Tested:</strong> Complex wildcard
            patterns and extensive rule sets are difficult to maintain and easy
            to get wrong. Prefer simple, clear path prefixes. Test rules with
            Google&apos;s robots.txt tester in Search Console before deploying.
          </li>
          <li>
            <strong>Never Block CSS, JavaScript, or Image Files:</strong>{" "}
            Googlebot needs to render pages to understand content and layout.
            Blocking render-critical resources causes Google to see a broken
            version of the page, negatively impacting rankings and user
            experience assessment.
          </li>
          <li>
            <strong>
              Use noindex Instead of Disallow for Sensitive Pages:
            </strong>{" "}
            Disallow prevents crawling but not indexing. A disallowed URL can
            still appear in search results if external sites link to it. To
            fully remove a page from search results, use the noindex meta tag or
            X-Robots-Tag header.
          </li>
          <li>
            <strong>Block Low-Value URL Patterns:</strong> Internal search
            result pages, faceted navigation permutations, session-ID URLs, and
            internal redirects waste crawl budget. Disallow these patterns to
            focus crawl resources on high-value content.
          </li>
          <li>
            <strong>Ensure robots.txt High Availability:</strong> A 5xx error on
            robots.txt causes crawlers to assume the entire site is disallowed
            and stop crawling. Serve robots.txt from a CDN or static file system
            with high availability guarantees, separate from dynamic application
            infrastructure.
          </li>
          <li>
            <strong>Include Sitemap Directive:</strong> Always declare sitemap
            locations in robots.txt using the Sitemap directive. This is the
            primary automatic discovery mechanism for sitemaps across all search
            engines.
          </li>
          <li>
            <strong>Version Control and Deploy Review:</strong> Treat robots.txt
            as critical infrastructure code. Keep it in version control, require
            code review for changes, and include it in deployment validation
            checks. A single-character error can de-index an entire site.
          </li>
        </ol>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Using robots.txt as Security:</strong> robots.txt is
            publicly accessible — anyone can read it to discover the URLs you
            are trying to hide. Sensitive paths listed in Disallow directives
            (admin panels, internal APIs) become a roadmap for attackers. Use
            authentication, not robots.txt, for security.
          </li>
          <li>
            <strong>Leaving Staging Disallow in Production:</strong> A common
            deployment error where <code>Disallow: /</code> from the staging
            robots.txt is accidentally deployed to production. This immediately
            blocks all crawling. Automated deployment checks should validate
            that production robots.txt does not contain a site-wide disallow.
          </li>
          <li>
            <strong>Blocking JavaScript and CSS:</strong> Legacy robots.txt
            rules that block /js/ and /css/ directories prevent Googlebot from
            rendering pages. Google explicitly warns against this in Search
            Console and may downrank pages it cannot render properly.
          </li>
          <li>
            <strong>Assuming Disallow Prevents Indexing:</strong> Disallow only
            prevents crawling. Google may still index the URL based on external
            signals (inbound links, anchor text) and display it in search
            results without a snippet. To prevent indexing, use noindex.
          </li>
          <li>
            <strong>Overly Broad Wildcard Rules:</strong> Patterns like{" "}
            <code>Disallow: /*?</code> block all URLs with query parameters,
            including legitimate paginated content, filtered views with unique
            content, and API callbacks that may be needed for functionality.
          </li>
          <li>
            <strong>Not Handling robots.txt Errors:</strong> If the server
            returns a 500 error for robots.txt, Google assumes the entire site
            is disallowed and stops crawling completely. This can happen during
            deployments, server outages, or CDN misconfigurations.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Large E-Commerce (Walmart, Target):</strong> Block internal
            search results (/search?q=), cart and checkout flows (/cart,
            /checkout), account pages (/account), and faceted navigation
            parameter combinations that generate millions of low-value URL
            permutations.
          </li>
          <li>
            <strong>News Sites (Reuters, AP):</strong> Allow full crawling of
            article content while blocking print versions, AMP cache endpoints,
            and internal content management paths. News sitemaps are declared
            for Google News crawling.
          </li>
          <li>
            <strong>SaaS Platforms (Salesforce, HubSpot):</strong> Block
            customer-specific subdomains and tenant paths from public search
            crawling while allowing marketing pages, documentation, and blog
            content. Crawler-specific rules may allow Googlebot access to public
            API documentation while blocking other crawlers.
          </li>
          <li>
            <strong>AI Crawler Blocking:</strong> With the rise of AI training
            data collection, many sites now specifically block AI crawlers like
            GPTBot, Google-Extended, CCBot, and anthropic-ai using
            crawler-specific User-agent blocks while maintaining access for
            search engine crawlers.
          </li>
        </ul>
      </section>

      {/* Section 8: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Does robots.txt Disallow prevent a page from appearing in
              Google search results?
            </p>
            <p className="mt-2 text-sm">
              A: No. Disallow prevents crawling, not indexing. Google may still
              index a disallowed URL and display it in search results — just
              without a content snippet or cached version. This happens when
              external sites link to the URL, giving Google enough signals to
              list it. To fully prevent indexing, use the noindex meta robots
              tag. Importantly, you cannot use both Disallow and noindex
              together — if the URL is disallowed, Google cannot crawl the page
              to see the noindex tag. The URL must be crawlable for noindex to
              work.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What happens when robots.txt returns a 500 error?
            </p>
            <p className="mt-2 text-sm">
              A: Major crawlers interpret a 5xx error on robots.txt as a
              &quot;full disallow&quot; — they assume the site owner
              doesn&apos;t want crawling and temporarily stop crawling the
              entire site. Google specifically waits and retries, reducing crawl
              rate significantly. If the error persists for an extended period,
              Google may begin removing pages from the index. This makes
              robots.txt availability a critical infrastructure concern — it
              should be served from highly available infrastructure (CDN, static
              file hosting) rather than through the application server.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do Allow and Disallow directives interact when they
              conflict?
            </p>
            <p className="mt-2 text-sm">
              A: The most specific (longest matching path) directive wins. If{" "}
              <code>Disallow: /admin</code> and{" "}
              <code>Allow: /admin/public</code> both match a URL like
              /admin/public/page, the Allow directive wins because
              &quot;/admin/public&quot; is a longer, more specific match than
              &quot;/admin&quot;. If the paths have equal length, Allow takes
              precedence (per Google&apos;s implementation of RFC 9309). This
              specificity-based resolution enables patterns like &quot;disallow
              everything under /api except /api/docs.&quot;
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you manage robots.txt for a large microservices
              architecture with multiple subdomains?
            </p>
            <p className="mt-2 text-sm">
              A: Each subdomain requires its own robots.txt — the protocol is
              scoped to the subdomain level. I would centralize robots.txt
              configuration in a shared repository with per-subdomain config
              files. A deployment pipeline generates each subdomain&apos;s
              robots.txt from the centralized config, validates it against
              known-good patterns (no accidental Disallow: /), and deploys it to
              each subdomain&apos;s static hosting. Monitoring checks robots.txt
              availability and content hash across all subdomains to detect
              drift or outages.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Should you use robots.txt to block AI training crawlers?
            </p>
            <p className="mt-2 text-sm">
              A: This is increasingly common — sites add User-agent blocks for
              GPTBot, CCBot, Google-Extended, and other AI crawlers to prevent
              content from being used in training data. However, robots.txt is
              voluntary — there&apos;s no enforcement mechanism guaranteeing
              compliance. Well-established AI companies (OpenAI, Google,
              Anthropic) generally respect robots.txt, but smaller or less
              scrupulous crawlers may ignore it. For stronger protection,
              combine robots.txt directives with rate limiting, bot detection,
              and legal terms of service.
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
              href="https://datatracker.ietf.org/doc/html/rfc9309"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              RFC 9309 — Robots Exclusion Protocol
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/search/docs/crawling-indexing/robots/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              Google Search Central — robots.txt Introduction
            </a>
          </li>
          <li>
            <a
              href="https://www.robotstxt.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              robotstxt.org — The Web Robots Pages
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              Google — Overview of Google Crawlers
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
