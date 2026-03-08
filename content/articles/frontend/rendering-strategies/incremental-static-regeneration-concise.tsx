"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-incrementa-concise",
  title: "Incremental Static Regeneration (ISR)",
  description: "Quick guide to ISR, combining static generation with on-demand revalidation for semi-dynamic content.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "incremental-static-regeneration",
  version: "concise",
  wordCount: 900,
  readingTime: 4,
  lastUpdated: "2026-03-05",
  tags: ["frontend", "rendering", "ISR", "Next.js", "hybrid"],
  relatedTopics: ["static-site-generation", "server-side-rendering", "edge-rendering"],
};

export default function IncrementalStaticRegenerationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Incremental Static Regeneration (ISR)</strong> is a hybrid rendering pattern that combines SSG&apos;s
          instant load times with SSR&apos;s content freshness. Pages are statically generated once, cached at CDN edge,
          and automatically regenerated in the background when stale or on-demand via webhooks. This delivers sub-100ms
          TTFB while keeping content updated without full site rebuilds.
        </p>
        <p>
          ISR implements <strong>stale-while-revalidate</strong>: when a page expires, users receive the cached version
          immediately while the server regenerates fresh content in the background. The updated page serves to the next
          visitor. This ensures zero-downtime updates and perfect performance while maintaining near-real-time freshness.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li>
            <strong>Time-Based Revalidation:</strong> Set revalidation period (e.g., 60 seconds). After expiration,
            next request serves stale content and triggers background regeneration. Fresh content ready for subsequent
            visitors.
          </li>
          <li>
            <strong>On-Demand Revalidation:</strong> Explicitly trigger regeneration via API webhooks from CMS or admin
            actions. Provides near-instant content updates (2-10 seconds) without polling. More efficient than short
            time-based revalidation.
          </li>
          <li>
            <strong>Fallback Modes:</strong> For pages not pre-rendered at build time: <code>fallback: true</code> (show
            loading state), <code>fallback: &apos;blocking&apos;</code> (wait for generation), or{" "}
            <code>fallback: false</code> (404 if not pre-rendered).
          </li>
          <li>
            <strong>Background Regeneration:</strong> Page updates happen asynchronously without blocking user requests.
            Cache continues serving traffic during regeneration. No downtime or performance impact.
          </li>
          <li>
            <strong>Cache Tags:</strong> Group related pages for bulk revalidation. Tag all product pages with
            &apos;products&apos; to invalidate entire category when pricing changes. More efficient than individual
            path revalidation.
          </li>
        </ul>
      </section>

      <section>
        <h2>Quick Example</h2>
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold">Next.js Pages Router (Time-Based)</h3>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
              <code>{`// pages/products/[id].tsx
export const getStaticPaths = async () => {
  const products = await fetch('https://api.example.com/products?limit=100')
    .then(res => res.json());

  return {
    paths: products.map((p) => ({ params: { id: p.id } })),
    fallback: 'blocking' // Generate unpopular pages on-demand
  };
};

export const getStaticProps = async ({ params }) => {
  const product = await fetch(\`https://api.example.com/products/\${params.id}\`)
    .then(res => res.json());

  return {
    props: { product },
    revalidate: 60 // Regenerate every 60 seconds (ISR!)
  };
};

export default function ProductPage({ product }) {
  return <div>{product.name}</div>;
}`}</code>
            </pre>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold">Next.js App Router (On-Demand)</h3>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
              <code>{`// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request) {
  const { productId } = await request.json();

  // Revalidate specific page
  revalidatePath(\`/products/\${productId}\`);

  // Or revalidate by tag
  revalidateTag('products');

  return Response.json({ revalidated: true });
}

// Webhook from CMS triggers instant update
// POST /api/revalidate with { productId: "123" }`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section>
        <h2>Pros &amp; Cons</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-3 text-left">Advantages</th>
                <th className="p-3 text-left">Disadvantages</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3">
                  <strong>SSG-level Performance:</strong> 10-50ms TTFB, instant FCP, perfect Core Web Vitals from
                  CDN edge caching
                </td>
                <td className="p-3">
                  <strong>Content Staleness:</strong> Time-based revalidation means content can be stale for up to
                  revalidation period
                </td>
              </tr>
              <tr>
                <td className="p-3">
                  <strong>Near Real-Time Updates:</strong> On-demand revalidation provides 2-10 second update latency
                  via CMS webhooks
                </td>
                <td className="p-3">
                  <strong>Platform Lock-In:</strong> ISR is Next.js-specific. Other frameworks have limited or no
                  equivalent support
                </td>
              </tr>
              <tr>
                <td className="p-3">
                  <strong>Fast Builds:</strong> Pre-render only critical pages (top 100-1000), generate rest on-demand.
                  No full rebuilds
                </td>
                <td className="p-3">
                  <strong>Complexity:</strong> Cache invalidation, fallback modes, and revalidation timing require
                  careful tuning and testing
                </td>
              </tr>
              <tr>
                <td className="p-3">
                  <strong>Infinite Scale:</strong> CDN caching handles any traffic volume. Background regeneration
                  doesn&apos;t impact users
                </td>
                <td className="p-3">
                  <strong>Infrastructure Required:</strong> Needs serverless/Node.js backend for regeneration. Not
                  purely static hosting
                </td>
              </tr>
              <tr>
                <td className="p-3">
                  <strong>Cost Effective:</strong> Lower server costs than SSR (most requests hit cache). Higher than
                  pure SSG but reasonable
                </td>
                <td className="p-3">
                  <strong>Cache Debugging:</strong> Harder to debug cache issues. Must verify revalidation logic,
                  cache purging, timing
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>When to Use</h2>
        <p>
          <strong>Perfect for:</strong>
        </p>
        <ul className="mt-2 space-y-2">
          <li>
            <strong>E-commerce catalogs</strong> - 100k+ products, stable details, inventory/pricing update hourly
          </li>
          <li>
            <strong>News &amp; media sites</strong> - Articles need SEO, fast load, and periodic updates (5-60 min)
          </li>
          <li>
            <strong>CMS-driven marketing</strong> - Editors update content via headless CMS, webhooks trigger instant
            revalidation
          </li>
          <li>
            <strong>Documentation sites</strong> - Content updates weekly but needs fast load and instant search
          </li>
          <li>
            <strong>Job boards &amp; listings</strong> - New content generates on-demand, existing content revalidates
            hourly
          </li>
        </ul>
        <p className="mt-4">
          <strong>Avoid for:</strong>
        </p>
        <ul className="mt-2 space-y-2">
          <li>• Real-time content (stock prices, live scores) - use SSR or client-side fetching</li>
          <li>• Personalized pages (user dashboards) - no shared cache benefit</li>
          <li>• Truly static content (legal pages) - pure SSG is simpler</li>
          <li>• Frequent updates (&gt;1/second) - revalidation can&apos;t keep up</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-2">
          <li>
            <strong>Explain stale-while-revalidate:</strong> Users always get instant cached response. Background
            regeneration updates cache for next visitor. Zero-downtime, SSG-level performance with SSR-like freshness.
          </li>
          <li>
            <strong>Compare to SSG and SSR:</strong> ISR combines SSG performance (10-50ms TTFB) with SSR freshness
            (configurable staleness). Trade-off: slight content lag (seconds to minutes) vs instant updates (SSR) or
            long staleness (SSG).
          </li>
          <li>
            <strong>Time-based vs on-demand:</strong> Time-based revalidation checks expiration on request (simple,
            predictable). On-demand revalidation uses webhooks from CMS (faster updates, more complex setup). Combine
            both for best results.
          </li>
          <li>
            <strong>Scaling strategy:</strong> Pre-render critical pages (&lt;1000) at build time for instant
            availability. Use fallback: &apos;blocking&apos; for long-tail pages. Build time stays fast, users get
            instant responses.
          </li>
          <li>
            <strong>Common pitfall:</strong> Over-revalidating (5-10s intervals) wastes server resources. Use
            on-demand revalidation via webhooks instead. Reserve time-based for reasonable intervals (60s+).
          </li>
          <li>
            <strong>Cache invalidation:</strong> Revalidate related pages when one updates (product page + category
            page). Use cache tags to group pages for bulk invalidation. Consider eventual consistency acceptable.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm">Q: How does ISR handle high traffic during regeneration?</h3>
            <p className="mt-1 text-sm">
              A: Regeneration happens in background—cached page continues serving all traffic. Next.js deduplicates
              concurrent regeneration requests (cache stampede prevention). Only one regeneration runs per page even
              with 1000s of requests. Users never wait.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Q: What happens if revalidation fails (API error)?</h3>
            <p className="mt-1 text-sm">
              A: Stale content continues serving. Failed regeneration doesn&apos;t break the site. Implement error
              logging and monitoring. Consider retry logic or fallback data. Show content freshness timestamps to users
              if critical.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Q: ISR vs ISG vs SSG with cache - what&apos;s the difference?</h3>
            <p className="mt-1 text-sm">
              A: ISR = Incremental Static Regeneration (Next.js term). ISG = Incremental Static Generation (same
              concept, different name). SSG with cache = static files + CDN caching only (no background regeneration).
              ISR adds automatic background updates.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
