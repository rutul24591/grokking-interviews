"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-edge-rende-extensive",
  title: "Edge Rendering",
  description: "Learn edge rendering strategies for delivering personalized content with minimal latency using edge compute platforms.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "edge-rendering",
  version: "extensive",
  wordCount: 3600,
  readingTime: 15,
  lastUpdated: "2026-03-06",
  tags: ["frontend", "rendering", "edge", "CDN", "performance", "Vercel", "Cloudflare"],
  relatedTopics: ["server-side-rendering", "streaming-ssr", "static-site-generation"],
};

export default function EdgeRenderingExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Edge Rendering</strong> is a rendering strategy that executes server-side rendering (SSR) logic at
          edge locations—CDN nodes distributed globally—rather than on a centralized origin server. Instead of routing
          all requests to a single data center (e.g., us-east-1), edge rendering processes requests at the CDN location
          closest to the user, dramatically reducing latency and improving Time to First Byte (TTFB).
        </p>
        <p>
          Traditional SSR architecture sends every request to an origin server, typically in one geographic region. A
          user in Sydney requesting a page hosted in Virginia experiences 200-300ms of network latency before the server
          even starts rendering. <strong>Edge Rendering solves this</strong> by running SSR code in 200-300 global
          locations simultaneously. The Sydney user hits an edge node in Australia (10-30ms latency), which renders the
          HTML locally and returns it almost instantly.
        </p>
        <p>
          The pattern emerged with the evolution of <strong>edge computing platforms</strong>: <strong>Cloudflare Workers</strong>
          (2017), <strong>AWS Lambda@Edge</strong> (2017), <strong>Fastly Compute@Edge</strong> (2019),
          <strong>Vercel Edge Functions</strong> (2021), and <strong>Deno Deploy</strong> (2021). These platforms moved
          beyond simple CDN caching to enable arbitrary code execution at the edge. React frameworks like Next.js, Remix,
          and SvelteKit now support edge runtimes, making edge rendering accessible to mainstream developers. Edge Rendering
          represents the convergence of SSR and CDN infrastructure: rendering happens where users are, not where servers
          happen to be.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>Understanding Edge Rendering requires grasping several fundamental concepts:</p>
        <ul>
          <li>
            <strong>Edge Locations:</strong> CDN providers operate 200-300 globally distributed Points of Presence (PoPs).
            Cloudflare has 310+ locations, AWS has 450+ edge locations, Vercel uses Cloudflare{'\''}s network. Edge
            functions deploy to all locations simultaneously via one deployment, ensuring every user gets low-latency
            access.
          </li>
          <li>
            <strong>Request Routing:</strong> When a user requests a page, DNS and Anycast routing direct them to the
            nearest edge location based on network proximity (not just geography). The edge node executes rendering logic
            locally and returns HTML, eliminating cross-continent round trips to origin servers.
          </li>
          <li>
            <strong>Edge Runtime Constraints:</strong> Edge environments aren{'\''}t full Node.js. They use restricted
            runtimes (V8 isolates, not containers) with limited APIs. No file system, limited Node.js APIs, smaller memory
            (128MB-512MB), faster cold starts (0-5ms vs. 100-500ms Lambda). Code must be edge-compatible.
          </li>
          <li>
            <strong>Streaming SSR at the Edge:</strong> Edge rendering pairs naturally with streaming SSR. The edge node
            streams HTML progressively to users, reducing TTFB even further. React 18{'\''}s <code>renderToReadableStream</code>
            (Web Streams API) works seamlessly on edge runtimes.
          </li>
          <li>
            <strong>Data Fetching Strategies:</strong> Edge nodes fetch data from nearby databases (Cloudflare D1, Vercel
            Postgres, Supabase) or origin APIs. For best performance, co-locate data storage with edge compute or use global
            databases (CockroachDB, PlanetScale, Fauna). Caching (KV stores, in-memory) is critical at the edge.
          </li>
          <li>
            <strong>Personalization at the Edge:</strong> Edge rendering enables personalized content (user-specific data,
            A/B tests, geolocation) while maintaining CDN-level latency. This was impossible with static CDN caching—you
            couldn{'\''}t cache per-user pages. Edge rendering makes per-user SSR fast.
          </li>
          <li>
            <strong>Hybrid Architecture:</strong> Not all rendering happens at the edge. Heavy computation, complex database
            queries, or legacy APIs may still run on origin servers. Edge functions handle fast, lightweight rendering (shell,
            above-the-fold content) and proxy slow operations to origin.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>The Edge Rendering architecture follows this distributed request-response pattern:</p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Edge Rendering Request Flow</h3>
          <ol className="space-y-3">
            <li><strong>1. User Request:</strong> User in Tokyo requests <code>example.com/products</code></li>
            <li><strong>2. DNS + Anycast Routing:</strong> Request routes to nearest edge location (Tokyo or Singapore, 10-20ms latency)</li>
            <li><strong>3. Edge Function Execution:</strong> Edge worker (V8 isolate) starts executing rendering code (cold start: 0-5ms)</li>
            <li><strong>4. Check Edge Cache:</strong> Query KV store for cached data (products list, user preferences)</li>
            <li><strong>5. Fetch Data (if needed):</strong> Call nearby database (Cloudflare D1, Supabase in ap-southeast-1) or origin API</li>
            <li><strong>6. Render HTML:</strong> Execute React SSR at the edge, generate HTML with user-specific data</li>
            <li><strong>7. Stream to User:</strong> Stream HTML chunks progressively (using Web Streams API)</li>
            <li><strong>8. TTFB:</strong> User receives first byte in 30-80ms (vs. 200-400ms origin SSR)</li>
            <li><strong>9. Cache Response:</strong> Store rendered HTML in edge cache (if cacheable) with short TTL</li>
            <li><strong>10. Browser Hydration:</strong> JavaScript downloads and hydrates the page (same as traditional SSR)</li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/frontend/rendering-strategies/edge-rendering-architecture.svg"
          alt="Edge Rendering Architecture"
          caption="Edge Rendering Architecture - Distributed rendering at CDN locations closest to users"
        />

        <p>
          This architecture eliminates the geography tax of centralized servers. Whether users are in New York, London,
          Tokyo, or Sydney, they all experience 50-100ms TTFB because rendering happens locally. Traditional SSR might
          give New Yorkers 150ms TTFB but Australians 400ms+ TTFB. Edge Rendering equalizes performance globally.
        </p>

        <ArticleImage
          src="/diagrams/frontend/rendering-strategies/edge-rendering-flow.svg"
          alt="Edge Rendering Flow Sequence"
          caption="Edge Rendering Flow - Fast path uses edge cache and nearby database; heavy operations fall back to origin"
        />
      </section>

      <section>
        <h2>Implementation Examples</h2>
        <p>Here{'\''}s how Edge Rendering is implemented across popular platforms:</p>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold">Vercel Edge Functions + Next.js</h3>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
              <code>{`// app/products/page.tsx - Edge Runtime
import { cookies } from 'next/headers';

// Force this route to use Edge Runtime (not Node.js)
export const runtime = 'edge';

export default async function ProductsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  // Fetch data from edge-compatible API or database
  const products = await fetch('https://api.example.com/products', {
    headers: {
      'X-User-ID': userId || 'anonymous',
    },
    // Cache for 60 seconds at the edge
    next: { revalidate: 60 },
  }).then(res => res.json());

  return (
    <div>
      <h1>Products for User {userId}</h1>
      <div className="grid">
        {products.map((product) => (
          <div key={product.id}>
            <h2>{product.name}</h2>
            <p>\${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Result:
// - Deploys to 300+ Vercel/Cloudflare edge locations
// - TTFB: 50-100ms globally (vs. 200-400ms origin SSR)
// - Personalized for each user (via cookies)
// - Response cached for 60s at each edge location`}</code>
            </pre>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Cloudflare Workers + Remix</h3>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
              <code>{`// app/routes/products.tsx - Remix on Cloudflare Workers
import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

export async function loader({ request, context }: LoaderFunctionArgs) {
  // Cloudflare Workers context includes KV, D1, Durable Objects
  const { env } = context;

  // Check edge cache (Cloudflare KV)
  const cached = await env.PRODUCTS_KV.get('products-list');
  if (cached) {
    return json(JSON.parse(cached), {
      headers: { 'X-Cache': 'HIT' },
    });
  }

  // Fetch from Cloudflare D1 (edge database)
  const db = env.DB;
  const { results } = await db.prepare(
    'SELECT * FROM products WHERE active = 1 LIMIT 50'
  ).all();

  // Cache for 5 minutes
  await env.PRODUCTS_KV.put(
    'products-list',
    JSON.stringify(results),
    { expirationTtl: 300 }
  );

  return json(results, {
    headers: {
      'Cache-Control': 'public, max-age=300',
      'X-Cache': 'MISS',
    },
  });
}

export default function ProductsRoute() {
  const products = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Products (Edge Rendered)</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}

// Result:
// - Runs on Cloudflare Workers (310+ locations)
// - Uses Cloudflare D1 (SQLite at the edge) for data
// - KV cache reduces database queries
// - TTFB: 30-80ms globally`}</code>
            </pre>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Deno Deploy + Fresh (Islands)</h3>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
              <code>{`// routes/products.tsx - Fresh on Deno Deploy
import { Handlers, PageProps } from '$fresh/server.ts';

interface Product {
  id: string;
  name: string;
  price: number;
}

export const handler: Handlers<Product[]> = {
  async GET(req, ctx) {
    // Deno Deploy runs at 35+ global edge locations
    const url = new URL(req.url);
    const region = req.headers.get('CF-IPCountry') || 'US';

    // Fetch from edge-compatible KV or database
    const products = await fetch(
      \`https://api.example.com/products?region=\${region}\`,
      { signal: AbortSignal.timeout(500) } // 500ms timeout
    ).then(res => res.json());

    return ctx.render(products);
  },
};

export default function ProductsPage({ data }: PageProps<Product[]>) {
  return (
    <div>
      <h1>Products in Your Region</h1>
      <ul>
        {data.map((product) => (
          <li key={product.id}>
            {product.name} - \${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Result:
// - Runs on Deno Deploy edge network
// - Geolocation-aware rendering (CF-IPCountry header)
// - Timeout prevents slow origin from blocking edge
// - TTFB: 50-120ms globally`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section>
        <h2>Edge vs. Origin SSR</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Aspect</th>
              <th className="text-left">Edge Rendering</th>
              <th className="text-left">Origin SSR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Latency</strong></td>
              <td>30-100ms (distributed globally)</td>
              <td>100-400ms (depends on user location)</td>
            </tr>
            <tr>
              <td><strong>TTFB</strong></td>
              <td>Consistent worldwide (50-100ms)</td>
              <td>Varies by geography (100-500ms)</td>
            </tr>
            <tr>
              <td><strong>Scalability</strong></td>
              <td>Auto-scales globally, CDN handles traffic</td>
              <td>Requires manual scaling, load balancers</td>
            </tr>
            <tr>
              <td><strong>Cold Starts</strong></td>
              <td>0-5ms (V8 isolates)</td>
              <td>100-500ms (Lambda) or persistent containers</td>
            </tr>
            <tr>
              <td><strong>Runtime</strong></td>
              <td>Restricted (no Node.js, limited APIs)</td>
              <td>Full Node.js, unlimited APIs</td>
            </tr>
            <tr>
              <td><strong>Memory</strong></td>
              <td>128MB-512MB</td>
              <td>512MB-10GB</td>
            </tr>
            <tr>
              <td><strong>Execution Time</strong></td>
              <td>10-50ms (short-lived)</td>
              <td>Unlimited (seconds to minutes)</td>
            </tr>
            <tr>
              <td><strong>Cost</strong></td>
              <td>Pay per request (cheaper at scale)</td>
              <td>Pay for servers (more expensive at scale)</td>
            </tr>
            <tr>
              <td><strong>Best For</strong></td>
              <td>Fast, lightweight, personalized content</td>
              <td>Heavy computation, complex queries, legacy APIs</td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/frontend/rendering-strategies/edge-rendering-performance.svg"
          alt="Edge vs Origin SSR Global Performance"
          caption="Global Performance - Edge rendering provides consistent low latency worldwide; Origin SSR penalizes distant users"
        />
      </section>

      <section>
        <h2>Trade-offs & Limitations</h2>
        <p><strong>Advantages:</strong></p>
        <ul>
          <li>
            <strong>Global Low Latency:</strong> Every user worldwide gets 50-100ms TTFB, regardless of location.
            Eliminates the geography tax where Australian users suffer 400ms+ TTFB from US servers.
          </li>
          <li>
            <strong>Auto-Scaling & Reliability:</strong> CDN infrastructure handles scaling automatically. No need for
            load balancers, auto-scaling groups, or capacity planning. Built-in DDoS protection and high availability.
          </li>
          <li>
            <strong>Fast Cold Starts:</strong> V8 isolates start in 0-5ms (vs. 100-500ms for Lambda containers).
            Users rarely experience cold start delays. Edge functions are always warm.
          </li>
          <li>
            <strong>Personalization + CDN Speed:</strong> Deliver user-specific content (A/B tests, geolocation,
            authentication) with CDN-level latency. Previously impossible—caching and personalization were mutually
            exclusive.
          </li>
          <li>
            <strong>Cost Efficiency at Scale:</strong> Pay-per-request pricing is cheaper than always-on servers at
            high traffic volumes. Cloudflare Workers: $0.50/million requests. Vercel Edge: $2/million requests. No
            idle server costs.
          </li>
        </ul>

        <p><strong>Disadvantages:</strong></p>
        <ul>
          <li>
            <strong>Runtime Restrictions:</strong> No Node.js standard library (fs, child_process, etc.). Limited to
            Web APIs (fetch, Response, Request). Many npm packages don{'\''}t work. Must use edge-compatible libraries.
          </li>
          <li>
            <strong>Small Bundle Size Limits:</strong> Cloudflare Workers: 1-5MB compressed. Vercel Edge: 1MB. Large
            frameworks or heavy dependencies may not fit. Requires aggressive tree-shaking and code-splitting.
          </li>
          <li>
            <strong>Limited Execution Time:</strong> Cloudflare: 50ms CPU time. Vercel: 25s wall time. Heavy
            computations, large database queries, or slow APIs must run on origin servers. Edge is for fast operations
            only.
          </li>
          <li>
            <strong>Data Access Latency:</strong> If your database is centralized (us-east-1), edge functions still
            pay that latency cost. Requires globally distributed databases (Cloudflare D1, PlanetScale, CockroachDB)
            or edge caching to fully benefit.
          </li>
          <li>
            <strong>Debugging Complexity:</strong> Edge logs are harder to access. No local file system for debugging.
            Errors may only surface in production. Testing edge-specific behavior locally is challenging.
          </li>
          <li>
            <strong>Vendor Lock-In:</strong> Edge platforms have different APIs (Cloudflare KV, Vercel Edge Config,
            Deno KV). Migrating between platforms requires code changes. Less portability than containerized SSR.
          </li>
        </ul>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>To build performant applications with Edge Rendering, follow these practices:</p>

        <p><strong>Use Edge for Fast Operations:</strong> Edge functions should complete in 10-50ms. Perfect for: HTML rendering (SSR), simple data fetching (cached or nearby DB), authentication checks, A/B test logic, geolocation. Offload heavy operations (image processing, ML inference, complex queries) to origin servers or serverless functions.</p>

        <p><strong>Co-Locate Data with Compute:</strong> If using edge rendering, use edge databases (Cloudflare D1, Turso, Supabase with read replicas) or globally distributed DBs (PlanetScale, CockroachDB). Querying us-east-1 RDS from a Sydney edge node negates edge benefits. Cache aggressively in edge KV stores.</p>

        <p><strong>Keep Bundles Small:</strong> Use tree-shaking, code-splitting, and minimal dependencies. Avoid large libraries (moment.js, lodash—use date-fns, lodash-es instead). Measure bundle size with <code>@vercel/ncc</code> or Cloudflare wrangler CLI. Stay under 500KB compressed.</p>

        <p><strong>Graceful Degradation:</strong> If edge rendering fails (timeout, error), fall back to origin SSR or static fallback. Don{'\''}t let edge failures block users entirely. Use try-catch and error boundaries.</p>

        <p><strong>Monitor Edge Performance:</strong> Track TTFB by region, edge cache hit rates, and error rates per edge location. Use Real User Monitoring (RUM) to see actual user experiences. Identify slow regions or cache misses.</p>

        <p><strong>Hybrid Architecture:</strong> Not everything needs edge rendering. Use edge for above-the-fold content (shell, hero, navigation) and origin SSR for below-the-fold or slow operations (comments, recommendations). Combine edge with streaming SSR for best results.</p>

        <p><strong>Test Edge-Specific Behaviors:</strong> Use <code>miniflare</code> (Cloudflare Workers local simulator) or Vercel Edge runtime locally. Test timeouts, memory limits, and API restrictions before deploying. Edge environments differ from Node.js.</p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>Edge Rendering excels in specific scenarios:</p>

        <ul>
          <li>
            <strong>Global E-Commerce:</strong> Product pages rendered at the edge with geolocation pricing, currency,
            and language. User in Japan sees JPY prices from Tokyo edge. User in Germany sees EUR from Frankfurt edge.
            TTFB: 50-80ms globally. Used by Shopify Hydrogen.
          </li>
          <li>
            <strong>Personalized Marketing Pages:</strong> A/B testing, user segmentation, and personalized content at
            CDN speed. Show different hero images, CTAs, or pricing based on user attributes (location, device, referrer)
            without sacrificing performance. Used by Vercel, Netlify customers.
          </li>
          <li>
            <strong>News & Media Sites:</strong> Edge rendering for article pages with geolocation-specific ads, paywalls,
            and content restrictions. Fast TTFB globally is critical for engagement and SEO. Used by major news outlets.
          </li>
          <li>
            <strong>Authentication & Authorization:</strong> Edge middleware checks JWT tokens, session cookies, or OAuth
            tokens before rendering. Protects pages without origin server round trips. 10-20ms auth checks at the edge.
          </li>
          <li>
            <strong>API Gateways:</strong> Edge functions act as API proxies with caching, rate limiting, and
            transformation. Reduce origin API load by handling requests at the edge. Used for GraphQL gateways,
            REST API aggregation.
          </li>
        </ul>

        <p>
          Edge Rendering is <strong>not ideal</strong> for computation-heavy tasks (video encoding, data processing),
          applications requiring large dependencies (full Next.js, heavyweight ORMs), or pages with complex backend
          integrations (legacy monoliths, slow databases without replication).
        </p>
      </section>

      <section>
        <h2>Platforms & Ecosystem</h2>
        <p>Several platforms provide edge rendering capabilities:</p>

        <ul>
          <li>
            <strong>Cloudflare Workers:</strong> 310+ locations, V8 isolates, 50ms CPU limit. KV store, D1 (SQLite),
            Durable Objects. $5/month for 10 million requests. Most mature edge platform. Used by Discord, Shopify.
          </li>
          <li>
            <strong>Vercel Edge Functions:</strong> Built on Cloudflare network. Seamless Next.js integration
            (<code>export const runtime = {'\'edge\''}</code>). 1MB bundle limit. $2/million requests. Used by
            Next.js, Vercel customers.
          </li>
          <li>
            <strong>Deno Deploy:</strong> 35+ locations, TypeScript-native, V8 isolates. Deno KV (global key-value
            store). Free tier: 100K requests/day. Used by Fresh framework, Deno ecosystem.
          </li>
          <li>
            <strong>AWS Lambda@Edge:</strong> 450+ CloudFront locations, Node.js runtime. 10s execution time, 50MB
            bundle. Integrated with AWS ecosystem (DynamoDB, S3). Used by enterprises with AWS infrastructure.
          </li>
          <li>
            <strong>Fastly Compute@Edge:</strong> WebAssembly-based edge compute, supports Rust, JavaScript,
            AssemblyScript. 300+ locations. Advanced caching and VCL scripting. Used by Vimeo, Stripe.
          </li>
          <li>
            <strong>Netlify Edge Functions:</strong> Built on Deno, global edge network. Seamless Netlify integration.
            $20/month for 2 million requests. Used by Netlify customers, Jamstack sites.
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul>
          <li>
            <a href="https://developers.cloudflare.com/workers/" target="_blank" rel="noopener noreferrer">
              Cloudflare Workers Documentation
            </a> - Official guide to edge computing on Cloudflare
          </li>
          <li>
            <a href="https://vercel.com/docs/functions/edge-functions" target="_blank" rel="noopener noreferrer">
              Vercel Edge Functions
            </a> - Next.js edge runtime and deployment guide
          </li>
          <li>
            <a href="https://deno.com/deploy/docs" target="_blank" rel="noopener noreferrer">
              Deno Deploy Documentation
            </a> - Deno{'\''}s edge runtime and global deployment
          </li>
          <li>
            <a href="https://www.cloudflare.com/learning/serverless/glossary/what-is-edge-computing/" target="_blank" rel="noopener noreferrer">
              Cloudflare: What is Edge Computing?
            </a> - Educational resource on edge computing concepts
          </li>
          <li>
            <a href="https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes" target="_blank" rel="noopener noreferrer">
              Next.js Edge and Node.js Runtimes
            </a> - When to use edge vs Node.js runtime in Next.js
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
