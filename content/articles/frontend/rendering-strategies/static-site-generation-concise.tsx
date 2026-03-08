"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-static-sit-concise",
  title: "Static Site Generation (SSG)",
  description: "Quick overview of Static Site Generation pattern for interviews and rapid learning.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "static-site-generation",
  version: "concise",
  wordCount: 890,
  readingTime: 4,
  lastUpdated: "2026-03-05",
  tags: ["frontend", "rendering", "SSG", "performance", "Jamstack"],
  relatedTopics: ["client-side-rendering", "server-side-rendering", "incremental-static-regeneration"],
};

export default function StaticSiteGenerationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Static Site Generation (SSG)</strong> is a pattern where HTML pages are pre-rendered at build time
          and served as static files from a CDN. Unlike SSR (renders per request) or CSR (renders in browser), SSG
          generates all HTML during deployment. The framework fetches data from APIs/CMSs, renders components to HTML,
          and outputs static files that can be deployed anywhere.
        </p>
        <p>
          Modern SSG tools (Next.js, Gatsby, Astro, Eleventy) automate build-time rendering with data fetching,
          component frameworks, and incremental builds. The result is blazingly fast sites (10-50ms TTFB) with
          perfect SEO, minimal hosting costs, and infinite CDN scalability. Trade-off: content updates require
          rebuilds, making it best for content that changes infrequently.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li>
            <strong>Build-Time Rendering:</strong> Pages rendered once during <code>npm run build</code>, not at
            runtime. Framework fetches all data, renders components, outputs static HTML/CSS/JS.
          </li>
          <li>
            <strong>Static Files Output:</strong> Build produces plain files (HTML/CSS/JS) deployed to CDN or
            object storage. No server runtime needed - files served directly.
          </li>
          <li>
            <strong>Pre-Rendering with Data:</strong> Unlike hand-coded HTML, SSG fetches data at build time.
            CMS content, product catalogs, blog posts queried and baked into HTML.
          </li>
          <li>
            <strong>CDN Distribution:</strong> Static files cached globally on CDN edge nodes. Requests served
            from nearest location (10-50ms TTFB). Infinite scalability.
          </li>
          <li>
            <strong>Hydration:</strong> Static HTML can include React/Vue components. After initial display,
            JavaScript hydrates page for interactivity. Instant load + rich features.
          </li>
          <li>
            <strong>Revalidation:</strong> Modern approaches like ISR (Incremental Static Regeneration) allow
            updating pages without full rebuilds. Combine SSG speed with near-real-time content.
          </li>
        </ul>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Next.js Pages Router - SSG
import type { GetStaticProps, GetStaticPaths } from 'next';

interface Props {
  post: { title: string; content: string };
}

// Generate static params at build time
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await fetch('https://cms.example.com/posts')
    .then(r => r.json());

  return {
    paths: posts.map(p => ({ params: { slug: p.slug } })),
    fallback: 'blocking', // Generate on-demand for missing pages
  };
};

// Fetch data at build time
export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const post = await fetch(\`https://cms.example.com/posts/\${params.slug}\`)
    .then(r => r.json());

  return {
    props: { post },
    revalidate: 60, // ISR: Regenerate every 60 seconds
  };
};

export default function BlogPost({ post }: Props) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

// Gatsby SSG with GraphQL
export const query = graphql\`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter { title date }
    }
  }
\`;

export default function Post({ data }) {
  return (
    <article>
      <h1>{data.markdownRemark.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
    </article>
  );
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Pros & Cons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Pros</th>
              <th className="p-3 text-left">Cons</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                ✓ Fastest TTFB (10-50ms from CDN)<br/>
                ✓ Perfect SEO (full HTML at crawl)<br/>
                ✓ Cheapest hosting ($0-10/mo)<br/>
                ✓ Infinite CDN scalability<br/>
                ✓ No server maintenance<br/>
                ✓ Perfect Core Web Vitals
              </td>
              <td className="p-3">
                ✗ Content updates require rebuild<br/>
                ✗ Build time increases with pages<br/>
                ✗ Not for dynamic/personalized content<br/>
                ✗ No real-time data<br/>
                ✗ Requires CI/CD infrastructure<br/>
                ✗ Large sites (10k+ pages) challenging
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Perfect for:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Blogs and content sites (content updates daily/weekly)</li>
          <li>• Documentation sites (React docs, Stripe docs)</li>
          <li>• Marketing and landing pages (fast load = better conversion)</li>
          <li>• E-commerce product catalogs (stable inventory)</li>
          <li>• Portfolios and agency sites</li>
          <li>• Event/conference sites (static schedules)</li>
          <li>• Small business sites (menu, hours, location)</li>
        </ul>

        <p><strong>Avoid for:</strong></p>
        <ul className="space-y-1">
          <li>• User dashboards (no benefit from pre-rendering personalized content)</li>
          <li>• Real-time apps (stock prices, live scores - data stale immediately)</li>
          <li>• Sites with millions of pages - build times impractical</li>
          <li>• Content updating every few seconds/minutes</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>
            <strong>Core Trade-off:</strong> SSG trades content freshness (rebuild required) for maximum performance
            (CDN-served HTML). Best when content changes infrequently but needs to load instantly.
          </li>
          <li>
            <strong>Build vs Runtime:</strong> SSG renders at build time (once), SSR at request time (every request),
            CSR at runtime (in browser). SSG is fastest for users, slowest for content updates.
          </li>
          <li>
            <strong>Performance Metrics:</strong> SSG has best TTFB (10-50ms), FCP (100-300ms), and Core Web Vitals.
            Mention this wins SEO ranking and conversion optimization. Compare with SSR (500ms-2s TTFB) and CSR
            (3-10s FCP).
          </li>
          <li>
            <strong>ISR Hybrid:</strong> Know about Incremental Static Regeneration - combines SSG speed with
            periodic updates. Pages regenerate after revalidation interval without full rebuild. Best of both worlds.
          </li>
          <li>
            <strong>Real Examples:</strong> Mention Gatsby sites (Smashing Magazine), Next.js docs, marketing sites
            (Vercel homepage). Contrast with SSR (Amazon product pages) and CSR (dashboards).
          </li>
          <li>
            <strong>Jamstack Architecture:</strong> SSG is core of Jamstack (JavaScript, APIs, Markup). Decouples
            frontend from backend. Static hosting (Netlify, Vercel) with API microservices.
          </li>
          <li>
            <strong>Build Optimization:</strong> Mention incremental builds (rebuild only changed pages), parallel
            data fetching, and build caching. Large sites need these optimizations.
          </li>
          <li>
            <strong>Common Pitfalls:</strong> Using SSG for dynamic content, slow builds without incremental strategy,
            not implementing fallback pages, forgetting webhook-triggered rebuilds from CMS.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: SSG vs SSR - when to use each?</p>
            <p className="mt-2 text-sm">
              A: Use SSG for content that changes infrequently (hours to days) where maximum performance matters
              (blogs, docs, marketing). Use SSR for dynamic content needing real-time data or personalization
              (e-commerce with live inventory, user dashboards). SSG has faster load (CDN) but stale content.
              SSR has slower load (server processing) but always fresh. ISR bridges the gap.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle content updates in SSG?</p>
            <p className="mt-2 text-sm">
              A: Three approaches: 1) Full rebuild triggered by CMS webhooks (simple, works for small sites). 2)
              ISR with revalidation intervals (Next.js - pages regenerate after N seconds). 3) On-demand revalidation
              via API (Next.js - CMS triggers specific page updates). Choose based on update frequency and site size.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is Incremental Static Regeneration (ISR)?</p>
            <p className="mt-2 text-sm">
              A: ISR is hybrid approach combining SSG and SSR. Pages are static but regenerate in background after
              revalidation period. First request after revalidation serves stale content (fast), triggers rebuild,
              subsequent requests get fresh content. Gives SSG performance with near-real-time updates. Set
              revalidate: 60 in Next.js getStaticProps to regenerate every 60 seconds.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you optimize SSG build times?</p>
            <p className="mt-2 text-sm">
              A: Use incremental builds (rebuild only changed pages), implement parallel data fetching, cache API
              responses during build, use GraphQL to fetch only needed fields, paginate large collections, consider
              ISR to reduce build scope, optimize images at build time, monitor and profile slow build steps. Target
              builds {'<'}10 minutes for 1000+ page sites.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
