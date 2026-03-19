"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-rendering-strategy",
  title: "Rendering Strategy",
  description:
    "Comprehensive guide to frontend rendering strategies: CSR, SSR, SSG, ISR, and hybrid approaches. Learn to choose the right strategy for your use case.",
  category: "frontend",
  subcategory: "nfr",
  slug: "rendering-strategy",
  version: "extensive",
  wordCount: 11000,
  readingTime: 44,
  lastUpdated: "2026-03-15",
  tags: [
    "frontend",
    "nfr",
    "rendering",
    "csr",
    "ssr",
    "ssg",
    "isr",
    "performance",
  ],
  relatedTopics: ["page-load-performance", "perceived-performance", "seo"],
};

export default function RenderingStrategyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Rendering Strategy</strong> determines where and when your
          application&apos;s HTML is generated: on the server, in the browser,
          at build time, or at request time. This fundamental architectural
          decision impacts performance, SEO, user experience, development
          complexity, and infrastructure costs.
        </p>
        <p>
          The evolution of rendering strategies reflects the web&apos;s changing
          demands. Early websites were server-rendered (PHP, ASP, JSP). The rise
          of SPAs (Single Page Applications) around 2010 shifted toward
          Client-Side Rendering (CSR) with frameworks like AngularJS, React, and
          Vue. However, CSR&apos;s SEO and performance limitations led to a
          resurgence of server rendering with modern frameworks like Next.js,
          Nuxt, and SvelteKit offering hybrid approaches.
        </p>
        <p>
          Today&apos;s frontend engineers must understand multiple rendering
          strategies and choose based on:
        </p>
        <ul>
          <li>
            <strong>Content type:</strong> Static, dynamic, or user-specific
          </li>
          <li>
            <strong>SEO requirements:</strong> Does content need to be indexed
            by search engines?
          </li>
          <li>
            <strong>Performance goals:</strong> Target metrics for LCP, TTI, and
            Core Web Vitals
          </li>
          <li>
            <strong>Infrastructure:</strong> Available server resources, CDN
            usage, edge computing
          </li>
          <li>
            <strong>Development experience:</strong> Team familiarity, debugging
            complexity
          </li>
        </ul>
        <p>
          For staff and principal engineers, rendering strategy decisions have
          long-term implications. Choosing wrong can lead to poor SEO, slow
          performance, high infrastructure costs, or development bottlenecks.
          This guide covers all major rendering strategies with their trade-offs
          and selection criteria.
        </p>
      </section>

      <section>
        <h2>Rendering Strategy Spectrum</h2>
        <p>
          Rendering strategies exist on a spectrum from fully static to fully
          dynamic, and from server to client:
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/rendering-strategy-spectrum.svg"
          alt="Rendering Strategy Spectrum"
          caption="Rendering strategies on a spectrum from static to dynamic, and server to client — showing where each approach fits"
        />

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Key Dimensions</h3>
          <ul className="space-y-3">
            <li>
              <strong>When:</strong> Build time, request time, or client-side at
              runtime
            </li>
            <li>
              <strong>Where:</strong> Server, CDN edge, or browser
            </li>
            <li>
              <strong>Frequency:</strong> Once per build, once per request, or
              every interaction
            </li>
            <li>
              <strong>Personalization:</strong> Same for all users, segmented,
              or fully personalized
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Client-Side Rendering (CSR)</h2>
        <p>
          <strong>Client-Side Rendering</strong> sends a minimal HTML shell to
          the browser, and JavaScript builds the entire UI dynamically. The
          server provides data via APIs; the client handles all rendering.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">How It Works</h3>
        <ol className="space-y-2">
          <li>
            1. Browser requests page → Server returns empty HTML + JS bundle
          </li>
          <li>2. Browser downloads and executes JavaScript</li>
          <li>3. JavaScript fetches data from API</li>
          <li>4. JavaScript renders UI in the browser</li>
          <li>5. Subsequent navigation happens entirely client-side</li>
        </ol>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Advantages</h3>
        <ul className="space-y-2">
          <li>
            ✅ <strong>Rich interactivity:</strong> Instant UI updates, no page
            reloads
          </li>
          <li>
            ✅ <strong>Simple hosting:</strong> Static files on CDN, no server
            needed
          </li>
          <li>
            ✅ <strong>Clear separation:</strong> Frontend and backend are
            independent
          </li>
          <li>
            ✅ <strong>Fast subsequent navigation:</strong> No server
            round-trips after initial load
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Disadvantages</h3>
        <ul className="space-y-2">
          <li>
            ❌ <strong>Slow initial load:</strong> Must download JS before
            seeing content
          </li>
          <li>
            ❌ <strong>Poor SEO:</strong> Search engines may not execute
            JavaScript
          </li>
          <li>
            ❌ <strong>Blank screen:</strong> Users see nothing until JS loads
          </li>
          <li>
            ❌ <strong>Large bundles:</strong> All framework code ships to
            client
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Best For</h3>
        <ul className="space-y-2">
          <li>Dashboard applications (authenticated, SEO not needed)</li>
          <li>Internal tools and admin panels</li>
          <li>Real-time collaborative apps (Figma, Google Docs)</li>
          <li>Apps where interactivity trumps initial load time</li>
        </ul>
      </section>

      <section>
        <h2>Server-Side Rendering (SSR)</h2>
        <p>
          <strong>Server-Side Rendering</strong> generates HTML on the server
          for each request. The browser receives fully-rendered HTML and can
          display content immediately, then JavaScript &quot;hydrates&quot; the
          page to make it interactive.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">How It Works</h3>
        <ol className="space-y-2">
          <li>1. Browser requests page</li>
          <li>2. Server fetches data and renders HTML</li>
          <li>3. Server sends complete HTML to browser</li>
          <li>4. Browser displays content immediately (fast FCP)</li>
          <li>5. JavaScript downloads and hydrates the page</li>
        </ol>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Advantages</h3>
        <ul className="space-y-2">
          <li>
            ✅ <strong>Fast FCP:</strong> Content visible immediately
          </li>
          <li>
            ✅ <strong>Excellent SEO:</strong> Full HTML available to crawlers
          </li>
          <li>
            ✅ <strong>Social sharing:</strong> Meta tags work correctly
          </li>
          <li>
            ✅ <strong>Progressive enhancement:</strong> Works even if JS fails
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Disadvantages</h3>
        <ul className="space-y-2">
          <li>
            ❌ <strong>Server load:</strong> Must render on every request
          </li>
          <li>
            ❌ <strong>Higher TTFB:</strong> Server processing adds latency
          </li>
          <li>
            ❌ <strong>Complex infrastructure:</strong> Need server capacity for
            traffic spikes
          </li>
          <li>
            ❌ <strong>Hydration cost:</strong> JS still needed for
            interactivity
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Best For</h3>
        <ul className="space-y-2">
          <li>Content-heavy sites (news, blogs, documentation)</li>
          <li>E-commerce product pages (SEO critical)</li>
          <li>Marketing and landing pages</li>
          <li>Public-facing content requiring social sharing</li>
        </ul>
      </section>

      <section>
        <h2>Static Site Generation (SSG)</h2>
        <p>
          <strong>Static Site Generation</strong> pre-renders HTML at build
          time. The generated HTML is cached and served from a CDN for every
          request. No server processing occurs at request time.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">How It Works</h3>
        <ol className="space-y-2">
          <li>1. At build time, framework renders all pages to HTML</li>
          <li>2. HTML files are deployed to CDN</li>
          <li>3. Browser requests page → CDN serves cached HTML</li>
          <li>4. Content displays instantly (fastest possible FCP)</li>
          <li>5. JavaScript hydrates for interactivity</li>
        </ol>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Advantages</h3>
        <ul className="space-y-2">
          <li>
            ✅ <strong>Fastest FCP:</strong> Pre-built HTML served from edge
          </li>
          <li>
            ✅ <strong>Excellent SEO:</strong> Full HTML available
          </li>
          <li>
            ✅ <strong>Simple hosting:</strong> Static files on CDN
          </li>
          <li>
            ✅ <strong>Low cost:</strong> No server processing per request
          </li>
          <li>
            ✅ <strong>High scalability:</strong> CDN handles any traffic
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Disadvantages</h3>
        <ul className="space-y-2">
          <li>
            ❌ <strong>Stale content:</strong> Must rebuild to update
          </li>
          <li>
            ❌ <strong>Build time:</strong> Scales with number of pages
          </li>
          <li>
            ❌ <strong>Not for dynamic content:</strong> Can&apos;t personalize
            per user
          </li>
          <li>
            ❌ <strong>Deploy complexity:</strong> Full redeploy for content
            changes
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Best For</h3>
        <ul className="space-y-2">
          <li>Documentation sites</li>
          <li>Marketing and landing pages</li>
          <li> Blogs with infrequent updates</li>
          <li>Product pages with stable content</li>
        </ul>
      </section>

      <section>
        <h2>Incremental Static Regeneration (ISR)</h2>
        <p>
          <strong>Incremental Static Regeneration</strong> combines SSG&apos;s
          performance with dynamic updates. Pages are statically generated but
          can be updated in the background without full rebuilds.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">How It Works</h3>
        <ol className="space-y-2">
          <li>1. Pages are pre-generated at build time (like SSG)</li>
          <li>2. CDN serves cached static HTML</li>
          <li>
            3. After revalidation period expires, next request triggers
            background regeneration
          </li>
          <li>4. Old page served while new page generates</li>
          <li>5. New page replaces old in cache for future requests</li>
        </ol>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Advantages</h3>
        <ul className="space-y-2">
          <li>
            ✅ <strong>Fresh content:</strong> Updates without full rebuild
          </li>
          <li>
            ✅ <strong>SSG performance:</strong> Still served from CDN
          </li>
          <li>
            ✅ <strong>Scalable:</strong> Only popular pages regenerate
          </li>
          <li>
            ✅ <strong>Best of both worlds:</strong> Static speed + dynamic
            freshness
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Disadvantages</h3>
        <ul className="space-y-2">
          <li>
            ❌ <strong>Stale window:</strong> Brief period with old content
          </li>
          <li>
            ❌ <strong>First request slow:</strong> Initial generation happens
            on demand
          </li>
          <li>
            ❌ <strong>Cache invalidation:</strong> Must manage revalidation
            carefully
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Best For</h3>
        <ul className="space-y-2">
          <li>E-commerce with frequently changing prices</li>
          <li>News sites with regular updates</li>
          <li>Large sites where full rebuild is impractical</li>
          <li>Content that changes but not in real-time</li>
        </ul>
      </section>

      <section>
        <h2>Hybrid Rendering</h2>
        <p>
          <strong>Hybrid Rendering</strong> combines multiple strategies within
          a single application. Different pages use different rendering based on
          their requirements.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Patterns</h3>
        <ul className="space-y-3">
          <li>
            <strong>SSG + CSR:</strong> Static marketing pages, CSR dashboard
          </li>
          <li>
            <strong>SSR + CSR:</strong> SSR for SEO pages, CSR for authenticated
            areas
          </li>
          <li>
            <strong>SSG + ISR:</strong> Static pages with incremental updates
            for dynamic content
          </li>
          <li>
            <strong>Edge SSR + CSR:</strong> Edge-rendered content pages,
            client-side app shell
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Implementation</h3>
        <p>Modern frameworks make hybrid rendering straightforward:</p>
        <ul className="space-y-2">
          <li>
            <strong>Next.js:</strong> <code>getStaticProps</code> (SSG),{" "}
            <code>getServerSideProps</code> (SSR), <code>revalidate</code> (ISR)
          </li>
          <li>
            <strong>Nuxt:</strong> <code>nuxt.config.ts</code> routing rules for
            different strategies
          </li>
          <li>
            <strong>SvelteKit:</strong> <code>load</code> functions with{" "}
            <code>prerender</code> options
          </li>
          <li>
            <strong>Remix:</strong> Nested routes with different caching
            strategies
          </li>
        </ul>
      </section>

      <section>
        <h2>Decision Framework</h2>
        <p>Use this framework to choose the right rendering strategy:</p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/rendering-strategy-decision-tree.svg"
          alt="Rendering Strategy Decision Tree"
          caption="Decision tree for choosing rendering strategy based on content type, SEO needs, and personalization requirements"
        />

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Key Questions</h3>
          <ol className="space-y-3">
            <li>
              <strong>Is content user-specific?</strong>
              <ul className="mt-2 ml-6">
                <li>Yes → CSR or SSR</li>
                <li>No → Continue</li>
              </ul>
            </li>
            <li>
              <strong>Does it need SEO?</strong>
              <ul className="mt-2 ml-6">
                <li>Yes → SSR, SSG, or ISR</li>
                <li>No → CSR is fine</li>
              </ul>
            </li>
            <li>
              <strong>How often does content change?</strong>
              <ul className="mt-2 ml-6">
                <li>Never/rarely → SSG</li>
                <li>Periodically → ISR</li>
                <li>Every request → SSR</li>
              </ul>
            </li>
            <li>
              <strong>What&apos;s your infrastructure?</strong>
              <ul className="mt-2 ml-6">
                <li>CDN only → SSG or ISR</li>
                <li>Server available → SSR or hybrid</li>
              </ul>
            </li>
          </ol>
        </div>
      </section>

      <section>
        <h2>Performance Comparison</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Strategy</th>
              <th className="p-3 text-left">FCP</th>
              <th className="p-3 text-left">TTI</th>
              <th className="p-3 text-left">SEO</th>
              <th className="p-3 text-left">Server Load</th>
              <th className="p-3 text-left">Best Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>CSR</strong>
              </td>
              <td className="p-3">Slow</td>
              <td className="p-3">Slow</td>
              <td className="p-3">Poor</td>
              <td className="p-3">None</td>
              <td className="p-3">Dashboards, apps</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>SSR</strong>
              </td>
              <td className="p-3">Fast</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Excellent</td>
              <td className="p-3">High</td>
              <td className="p-3">Content sites, e-commerce</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>SSG</strong>
              </td>
              <td className="p-3">Fastest</td>
              <td className="p-3">Fast</td>
              <td className="p-3">Excellent</td>
              <td className="p-3">None</td>
              <td className="p-3">Static content, docs</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>ISR</strong>
              </td>
              <td className="p-3">Fast</td>
              <td className="p-3">Fast</td>
              <td className="p-3">Excellent</td>
              <td className="p-3">Low</td>
              <td className="p-3">Dynamic content at scale</td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/rendering-strategy-comparison.svg"
          alt="Rendering Strategy Comparison Chart"
          caption="Side-by-side comparison of CSR, SSR, SSG, and ISR across FCP, TTI, SEO, server load, and scalability dimensions"
        />
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When would you choose CSR over SSR?
            </p>
            <p className="mt-2 text-sm">
              A: Choose CSR for authenticated applications where SEO
              doesn&apos;t matter (dashboards, admin panels, internal tools).
              CSR is simpler to host (static CDN), has clear frontend/backend
              separation, and provides fast subsequent navigation. Avoid CSR for
              public content that needs SEO or social sharing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What&apos;s the difference between SSG and ISR?
            </p>
            <p className="mt-2 text-sm">
              A: SSG generates all pages at build time — content is static until
              next deploy. ISR also generates at build time but can regenerate
              pages in the background after a revalidation period. ISR gives you
              SSG performance with dynamic updates, ideal for large sites where
              full rebuilds are impractical.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does hydration work in SSR?</p>
            <p className="mt-2 text-sm">
              A: Hydration is the process where JavaScript attaches event
              listeners to server-rendered HTML. The server sends complete HTML
              for fast FCP. The browser displays it immediately. Then JavaScript
              downloads and &quot;hydrates&quot; the static HTML, making it
              interactive. Until hydration completes, the page is visible but
              not interactive.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What rendering strategy would you use for an e-commerce site?
            </p>
            <p className="mt-2 text-sm">
              A: Hybrid approach. Product listing and detail pages: ISR (fresh
              prices, CDN performance). Marketing pages: SSG (static, fast).
              Cart and checkout: CSR (user-specific, authenticated). Search
              results: SSR or ISR depending on personalization. This balances
              SEO, performance, and dynamic requirements.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the Core Web Vitals implications of each strategy?
            </p>
            <p className="mt-2 text-sm">
              A: SSG/ISR have best LCP (pre-built HTML). SSR has good LCP but
              TTFB can suffer. CSR has worst LCP (must wait for JS). For INP,
              CSR can be best after initial load (no server round-trips). For
              CLS, all strategies depend on proper layout reservation — SSR/SSG
              have advantage since HTML structure is known upfront.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://web.dev/rendering-on-the-web/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — Rendering on the Web
            </a>
          </li>
          <li>
            <a
              href="https://nextjs.org/docs/app/building-your-application/rendering"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js Documentation — Rendering
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/2021/06/ssg-ssr-hybrid-rendering/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Smashing Magazine — SSG, SSR, and Hybrid Rendering
            </a>
          </li>
          <li>
            <a
              href="https://patterns.dev/posts/rendering-patterns/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              patterns.dev — Rendering Patterns
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
