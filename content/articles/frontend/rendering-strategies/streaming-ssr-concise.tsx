"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-streaming--concise",
  title: "Streaming SSR",
  description: "Understand streaming server-side rendering for faster time-to-first-byte and improved perceived performance with progressive content delivery.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "streaming-ssr",
  version: "concise",
  wordCount: 1900,
  readingTime: 8,
  lastUpdated: "2026-03-06",
  tags: ["frontend", "rendering", "SSR", "streaming", "React", "performance"],
};

export default function StreamingSsrConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Streaming SSR</strong> sends HTML to the client progressively in chunks as they{'\''}re rendered,
          rather than waiting for the entire page to complete. Traditional SSR blocks on the slowest operation (if
          one API takes 10s, users wait 10s). Streaming SSR sends the page shell immediately (100-200ms TTFB) and
          streams slow content later, dramatically improving perceived performance.
        </p>
        <p>
          <strong>Core Mechanism:</strong> Uses React 18{'\''}s <code>renderToPipeableStream</code> and Suspense
          boundaries to identify fast vs. slow components. Fast components (shell, navigation, static content)
          stream first. Slow components (data fetching, APIs) show fallbacks and stream when ready. Enables
          selective hydration where critical components become interactive first.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul>
          <li>
            <strong>Progressive HTML Streaming:</strong> Server sends HTML in chunks using HTTP chunked transfer
            encoding. Browser parses and displays early chunks (shell) while later chunks (content) are still being
            generated. Users see structure in 100-200ms instead of waiting 2-5s for everything.
          </li>
          <li>
            <strong>Suspense Boundaries:</strong> React Suspense wraps slow components. While loading, React sends
            fallback UI (loading spinner, skeleton) immediately, then replaces with real content once ready. Each
            Suspense boundary streams independently.
          </li>
          <li>
            <strong>Out-of-Order Streaming:</strong> Chunks can arrive in any order. React injects content wherever
            it belongs via inline scripts. Fast footer can stream before slow header widget. Order doesn{'\''}t
            matter.
          </li>
          <li>
            <strong>Selective Hydration:</strong> Pairs with progressive hydration. React hydrates components as
            their JavaScript arrives, rather than waiting for the entire bundle. Critical components hydrate first;
            below-the-fold components hydrate later.
          </li>
          <li>
            <strong>Shell-First Strategy:</strong> The "shell" (layout, navigation, header, footer) renders and
            streams immediately. The "content" (articles, comments, dynamic data) defers with Suspense. Shell
            provides instant visual feedback.
          </li>
        </ul>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Next.js 13+ App Router - Streaming by default
import { Suspense } from 'react';

export default async function ProductPage({ params }) {
  return (
    <div>
      {/* Shell: Fast, streams immediately */}
      <header>Navigation</header>

      {/* Fast: Cached image */}
      <ProductImage id={params.id} />

      {/* Suspense: Slow database query */}
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails id={params.id} />
      </Suspense>

      {/* Suspense: Slow API call */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews id={params.id} />
      </Suspense>

      {/* Shell: Fast, streams with header */}
      <footer>© 2026</footer>
    </div>
  );
}

// ProductDetails.tsx - Async Server Component
async function ProductDetails({ id }) {
  // 800ms database query
  const product = await db.query('SELECT * FROM products WHERE id = ?', [id]);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <button>Add to Cart</button>
    </div>
  );
}

// Timeline:
// 100ms: Browser receives shell (header, image, fallbacks, footer)
// 800ms: ProductDetails streams in, replaces skeleton
// 2000ms: Reviews stream in, replace skeleton
//
// Traditional SSR: Wait 2000ms, then everything appears
// Streaming SSR: Structure visible in 100ms, content fills progressively`}</code>
        </pre>
      </section>

      <section>
        <h2>Pros & Cons</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Pros</th>
              <th className="text-left">Cons</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Fast TTFB:</strong> Shell in 100-200ms vs. 2-5s traditional SSR</td>
              <td><strong>Complex Errors:</strong> Can{'\''}t show full error page after shell sent</td>
            </tr>
            <tr>
              <td><strong>Better UX:</strong> Users see structure instantly, no blank screens</td>
              <td><strong>Caching Hard:</strong> CDNs struggle to cache streaming responses</td>
            </tr>
            <tr>
              <td><strong>Selective Hydration:</strong> Critical content interactive first</td>
              <td><strong>Server Load:</strong> Connections stay open longer (higher memory)</td>
            </tr>
            <tr>
              <td><strong>Parallel Fetching:</strong> Multiple Suspense resolve simultaneously</td>
              <td><strong>Debugging:</strong> Harder to inspect partial HTML streams</td>
            </tr>
            <tr>
              <td><strong>Core Web Vitals:</strong> Improves FCP, LCP, TTI</td>
              <td><strong>HTTP/2 Required:</strong> Works best with HTTP/2 multiplexing</td>
            </tr>
            <tr>
              <td><strong>Resilient:</strong> Slow operations don{'\''}t block fast ones</td>
              <td><strong>SEO Risk:</strong> Crawlers may timeout before all content streams</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Ideal Use Cases:</strong></p>
        <ul>
          <li>
            <strong>Pages with Mixed Performance:</strong> When some parts are fast (cached, static) and others are
            slow (API calls, database queries). Product pages, dashboards, news articles.
          </li>
          <li>
            <strong>Content-Heavy Sites:</strong> E-commerce (product details fast, reviews slow), news (article
            fast, comments slow), social media (feed skeleton immediate, posts stream).
          </li>
          <li>
            <strong>User Experience Priority:</strong> When perceived performance matters more than total load time.
            Users prefer seeing structure in 100ms vs. staring at blank screens for 3s.
          </li>
          <li>
            <strong>Modern React Apps:</strong> Next.js 13+, Remix with deferred data, or custom React 18 apps
            using <code>renderToPipeableStream</code>. Works seamlessly with App Router.
          </li>
        </ul>

        <p><strong>Not Ideal For:</strong></p>
        <ul>
          <li>
            <strong>Fully Static Sites:</strong> Blogs, marketing pages where everything is fast and cached. SSG
            (Static Site Generation) is simpler and more cacheable than streaming SSR.
          </li>
          <li>
            <strong>Aggressive CDN Caching:</strong> If your strategy relies on caching full HTML pages at the edge,
            streaming is incompatible. Traditional SSR or SSG works better for CDN caching.
          </li>
          <li>
            <strong>Simple Pages:</strong> Pages with no slow operations don{'\''}t benefit. Adds complexity without
            performance gains. Use traditional SSR or SSG instead.
          </li>
        </ul>
      </section>

      <section>
        <h2>Comparison: Streaming vs Traditional SSR</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Metric</th>
              <th className="text-left">Streaming SSR</th>
              <th className="text-left">Traditional SSR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TTFB</td>
              <td>100-200ms</td>
              <td>1-5s</td>
            </tr>
            <tr>
              <td>FCP</td>
              <td>150-300ms</td>
              <td>1-5s</td>
            </tr>
            <tr>
              <td>User Experience</td>
              <td>Progressive display, feels fast</td>
              <td>Long blank screen, then everything appears</td>
            </tr>
            <tr>
              <td>Hydration</td>
              <td>Selective (progressive)</td>
              <td>All-at-once (blocking)</td>
            </tr>
            <tr>
              <td>Error Handling</td>
              <td>Complex (inline errors after shell)</td>
              <td>Simple (full error page)</td>
            </tr>
            <tr>
              <td>Caching</td>
              <td>Difficult (streaming responses)</td>
              <td>Easy (static HTML documents)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Frameworks Supporting Streaming</h2>
        <ul>
          <li>
            <strong>Next.js 13+:</strong> App Router uses streaming by default. Suspense boundaries automatically
            enable progressive rendering. <code>loading.tsx</code> files create Suspense fallbacks.
          </li>
          <li>
            <strong>Remix:</strong> Use <code>defer()</code> in loaders to mark data as streaming. <code>{'<Await>'}</code>
            component handles deferred data with Suspense. Granular control over what streams.
          </li>
          <li>
            <strong>React 18 + Express:</strong> Manual setup with <code>renderToPipeableStream</code> or
            <code>renderToReadableStream</code>. Full control but requires more boilerplate.
          </li>
          <li>
            <strong>Hydrogen (Shopify):</strong> Built-in streaming SSR for e-commerce. Optimized for product pages
            with slow data fetching.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul>
          <li>
            <strong>Define Clearly:</strong> "Streaming SSR sends HTML in chunks as they{'\''}re rendered, rather
            than waiting for the entire page. Shell streams first (100ms), slow content streams later."
          </li>
          <li>
            <strong>Key API:</strong> React 18{'\''}s <code>renderToPipeableStream</code> (Node.js) and
            <code>renderToReadableStream</code> (Web Streams). Suspense boundaries mark streaming points.
          </li>
          <li>
            <strong>TTFB Focus:</strong> Explain how streaming dramatically reduces TTFB (100-200ms vs. 2-5s). Users
            see structure instantly instead of blank screens. This improves Core Web Vitals (FCP, LCP).
          </li>
          <li>
            <strong>Selective Hydration:</strong> Mention that streaming pairs with selective hydration. Critical
            components hydrate first, below-the-fold later. Reduces TTI.
          </li>
          <li>
            <strong>Trade-offs:</strong> Be clear: better UX but harder caching. Complex error handling. Higher
            server load (connections stay open). Not ideal for fully static sites.
          </li>
          <li>
            <strong>Real Example:</strong> Describe product page: "Shell (header, nav) streams in 100ms. Product
            image (cached) displays. Product details (database query, 800ms) stream next. Reviews (API, 2s) stream
            last. User can read and add to cart while reviews load."
          </li>
          <li>
            <strong>Framework Knowledge:</strong> Next.js 13+ uses streaming by default. Remix has <code>defer()</code>.
            Show awareness of ecosystem and React 18 primitives.
          </li>
          <li>
            <strong>When NOT to Use:</strong> Static blogs, pages needing aggressive CDN caching, or simple pages
            with no slow operations. Interviewers value understanding limitations.
          </li>
        </ul>
      </section>

      <section>
        <h2>Key Takeaways</h2>
        <ul>
          <li>Streaming SSR = Progressive HTML delivery in chunks as they{'\''}re rendered</li>
          <li>Reduces TTFB from 2-5s to 100-200ms by streaming shell immediately</li>
          <li>Uses React Suspense to mark slow components for deferred streaming</li>
          <li>Pairs with selective hydration for progressive interactivity</li>
          <li>Best for pages with mixed fast/slow operations (e-commerce, dashboards, news)</li>
          <li>Trade-off: Better UX vs. harder caching and error handling</li>
          <li>Supported in Next.js 13+, Remix, and React 18 <code>renderToPipeableStream</code></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
