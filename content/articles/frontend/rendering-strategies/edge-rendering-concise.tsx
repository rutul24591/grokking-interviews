"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-edge-rende-concise",
  title: "Edge Rendering",
  description: "Learn edge rendering strategies for delivering personalized content with minimal latency using edge compute platforms.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "edge-rendering",
  version: "concise",
  wordCount: 2000,
  readingTime: 8,
  lastUpdated: "2026-03-06",
  tags: ["frontend", "rendering", "edge", "CDN", "performance", "Vercel"],
};

export default function EdgeRenderingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Edge Rendering</strong> runs server-side rendering (SSR) at CDN edge locations—200-300 globally
          distributed nodes close to users—rather than centralized origin servers. A user in Tokyo gets HTML rendered
          in Tokyo (10-30ms latency), not Virginia (200-300ms). This provides consistent 50-100ms TTFB worldwide,
          eliminating the geography tax of traditional SSR.
        </p>
        <p>
          <strong>Core Principle:</strong> Render where users are, not where servers happen to be. Edge platforms
          (Cloudflare Workers, Vercel Edge, Deno Deploy) use V8 isolates for fast, lightweight code execution at
          every CDN location. Enables personalized content (user-specific data, A/B tests, geolocation) with CDN-level
          performance.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul>
          <li>
            <strong>Distributed Execution:</strong> Code deploys to 200-300 edge locations simultaneously. Requests
            route to the nearest location via Anycast. Every user gets low-latency rendering regardless of geography.
            No multi-region deployment complexity.
          </li>
          <li>
            <strong>V8 Isolates:</strong> Edge platforms use V8 isolates (not containers). Cold starts: 0-5ms (vs.
            100-500ms Lambda). Memory: 128-512MB. Execution time: 10-50ms. Restricted runtime (no Node.js fs,
            child_process—Web APIs only).
          </li>
          <li>
            <strong>Edge Cache & KV Stores:</strong> Edge rendering pairs with edge caching (Cloudflare KV, Vercel
            Edge Config). Cache rendered HTML, user preferences, or API responses at each edge location. Reduces
            database queries and API calls.
          </li>
          <li>
            <strong>Global Data Access:</strong> For best performance, use globally distributed databases (Cloudflare
            D1, PlanetScale, CockroachDB) or edge-replicated databases (Supabase with read replicas). Querying
            centralized DBs from edge negates latency benefits.
          </li>
          <li>
            <strong>Hybrid Architecture:</strong> Not all rendering happens at edge. Fast operations (HTML shell,
            authentication, simple queries) run at edge. Heavy operations (complex DB queries, ML, image processing)
            fall back to origin servers.
          </li>
        </ul>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Next.js + Vercel Edge Functions
// app/products/page.tsx

// Force edge runtime (not Node.js)
export const runtime = 'edge';

export default async function ProductsPage() {
  // Runs at 300+ edge locations globally
  const products = await fetch('https://api.example.com/products', {
    // Cache at edge for 60 seconds
    next: { revalidate: 60 },
  }).then(res => res.json());

  return (
    <div>
      <h1>Products</h1>
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
// - User in Tokyo: 50ms TTFB (Tokyo edge → nearby API)
// - User in London: 60ms TTFB (London edge → nearby API)
// - User in Sydney: 70ms TTFB (Sydney edge → nearby API)
//
// Traditional SSR (us-east-1 origin):
// - User in Tokyo: 300ms TTFB (cross-Pacific latency)
// - User in London: 200ms TTFB (trans-Atlantic latency)
// - User in Sydney: 400ms TTFB (half-world latency)`}</code>
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
              <td><strong>Global Low Latency:</strong> 50-100ms TTFB worldwide</td>
              <td><strong>Runtime Limits:</strong> No Node.js stdlib, limited APIs</td>
            </tr>
            <tr>
              <td><strong>Auto-Scaling:</strong> CDN handles traffic, no capacity planning</td>
              <td><strong>Bundle Size:</strong> 1-5MB limit, aggressive tree-shaking needed</td>
            </tr>
            <tr>
              <td><strong>Fast Cold Starts:</strong> 0-5ms V8 isolates</td>
              <td><strong>Execution Time:</strong> 10-50ms max, heavy ops need origin</td>
            </tr>
            <tr>
              <td><strong>Personalization:</strong> User-specific content at CDN speed</td>
              <td><strong>Data Latency:</strong> Centralized DBs negate edge benefits</td>
            </tr>
            <tr>
              <td><strong>Cost Efficient:</strong> Pay-per-request, no idle servers</td>
              <td><strong>Debugging:</strong> Harder to access logs, test locally</td>
            </tr>
            <tr>
              <td><strong>Built-in DDoS:</strong> CDN-level protection</td>
              <td><strong>Vendor Lock-In:</strong> Platform-specific APIs (KV, D1, etc.)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Ideal Use Cases:</strong></p>
        <ul>
          <li>
            <strong>Global Applications:</strong> Users distributed worldwide. Traditional SSR penalizes distant users
            (400ms+ TTFB for Australia if origin in US). Edge rendering equalizes performance (50-100ms everywhere).
          </li>
          <li>
            <strong>Personalized Content:</strong> A/B testing, user segmentation, geolocation-based content,
            authentication. Edge enables per-user rendering at CDN speed. Previously, caching and personalization were
            mutually exclusive.
          </li>
          <li>
            <strong>E-Commerce:</strong> Product pages with geo-specific pricing, currency, language. Shopify Hydrogen
            uses edge rendering for global stores. Fast TTFB improves conversions.
          </li>
          <li>
            <strong>News & Media:</strong> Article pages with geolocation-based ads, paywalls, content restrictions.
            Fast TTFB critical for SEO and engagement. Edge rendering serves localized content instantly.
          </li>
        </ul>

        <p><strong>Not Ideal For:</strong></p>
        <ul>
          <li>
            <strong>Heavy Computation:</strong> Video encoding, image processing, ML inference, large data
            transformations. These exceed edge execution time limits (10-50ms). Run on origin servers or dedicated
            compute.
          </li>
          <li>
            <strong>Large Dependencies:</strong> Full Next.js, heavyweight ORMs, large npm packages. Bundle size
            limits (1-5MB) require aggressive optimization. Use origin SSR if bundles can{'\''}t fit.
          </li>
          <li>
            <strong>Centralized Data:</strong> If your database/API is in one region (us-east-1 RDS) with no
            replication, edge functions still pay cross-region latency. Edge rendering needs distributed data to
            fully benefit.
          </li>
        </ul>
      </section>

      <section>
        <h2>Popular Platforms</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Platform</th>
              <th className="text-left">Locations</th>
              <th className="text-left">Runtime</th>
              <th className="text-left">Pricing</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Cloudflare Workers</strong></td>
              <td>310+</td>
              <td>V8, 50ms CPU</td>
              <td>$5/mo for 10M requests</td>
            </tr>
            <tr>
              <td><strong>Vercel Edge</strong></td>
              <td>300+ (Cloudflare)</td>
              <td>V8, 25s wall time</td>
              <td>$2/million requests</td>
            </tr>
            <tr>
              <td><strong>Deno Deploy</strong></td>
              <td>35+</td>
              <td>Deno, TypeScript-native</td>
              <td>Free: 100K/day</td>
            </tr>
            <tr>
              <td><strong>AWS Lambda@Edge</strong></td>
              <td>450+</td>
              <td>Node.js, 10s timeout</td>
              <td>$0.60/million + duration</td>
            </tr>
            <tr>
              <td><strong>Fastly Compute@Edge</strong></td>
              <td>300+</td>
              <td>WebAssembly (Rust, JS)</td>
              <td>$0.45/million + compute</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Comparison: Edge vs Origin SSR</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Metric</th>
              <th className="text-left">Edge Rendering</th>
              <th className="text-left">Origin SSR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TTFB (Global)</td>
              <td>50-100ms (consistent)</td>
              <td>100-500ms (varies by location)</td>
            </tr>
            <tr>
              <td>Cold Start</td>
              <td>0-5ms</td>
              <td>100-500ms (Lambda) or 0ms (containers)</td>
            </tr>
            <tr>
              <td>Scaling</td>
              <td>Automatic (CDN-level)</td>
              <td>Manual (load balancers, ASGs)</td>
            </tr>
            <tr>
              <td>Runtime</td>
              <td>Restricted (Web APIs only)</td>
              <td>Full Node.js</td>
            </tr>
            <tr>
              <td>Execution Time</td>
              <td>10-50ms</td>
              <td>Unlimited (seconds to minutes)</td>
            </tr>
            <tr>
              <td>Bundle Size</td>
              <td>1-5MB</td>
              <td>Unlimited</td>
            </tr>
            <tr>
              <td>Cost at Scale</td>
              <td>Cheaper (pay per request)</td>
              <td>More expensive (always-on servers)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul>
          <li>
            <strong>Define Clearly:</strong> "Edge Rendering runs SSR at CDN edge locations (300+ globally distributed
            nodes) instead of centralized origin servers. Provides 50-100ms TTFB worldwide by rendering close to users."
          </li>
          <li>
            <strong>Key Platforms:</strong> Cloudflare Workers (310+ locations), Vercel Edge (Cloudflare network),
            Deno Deploy, AWS Lambda@Edge. Show awareness of major platforms and their trade-offs.
          </li>
          <li>
            <strong>V8 Isolates:</strong> Explain that edge uses V8 isolates (not containers). Fast cold starts (0-5ms),
            limited memory (128-512MB), restricted runtime (no Node.js). Contrast with Lambda (100-500ms cold starts,
            full Node.js).
          </li>
          <li>
            <strong>Geography Tax:</strong> Emphasize how edge rendering eliminates the geography tax. Traditional SSR:
            Australian user to US server = 400ms latency. Edge SSR: Australian user to Sydney edge = 60ms latency.
            Global equality.
          </li>
          <li>
            <strong>Trade-offs:</strong> Be clear: better latency but runtime restrictions. No Node.js stdlib, 1-5MB
            bundle limits, 10-50ms execution time. Heavy operations need origin. Centralized data negates benefits.
          </li>
          <li>
            <strong>Use Cases:</strong> Describe real scenarios: "E-commerce product page with geo-specific pricing.
            Tokyo user sees JPY from Tokyo edge (50ms). London user sees GBP from London edge (60ms). Same code,
            distributed execution."
          </li>
          <li>
            <strong>Data Strategy:</strong> Mention that edge rendering needs distributed data (Cloudflare D1,
            PlanetScale, CockroachDB) or aggressive caching (KV stores). Querying centralized RDS defeats the
            purpose—still pay cross-region latency.
          </li>
          <li>
            <strong>When NOT to Use:</strong> Heavy computation (video encoding, ML), large dependencies (full Next.js),
            centralized data without replication. Interviewers appreciate understanding limitations.
          </li>
        </ul>
      </section>

      <section>
        <h2>Key Takeaways</h2>
        <ul>
          <li>Edge Rendering = SSR at CDN edge locations (300+ worldwide)</li>
          <li>Consistent 50-100ms TTFB globally; eliminates geography tax</li>
          <li>Uses V8 isolates: 0-5ms cold starts, 128-512MB memory, 10-50ms execution</li>
          <li>Restricted runtime: Web APIs only, no Node.js stdlib, 1-5MB bundle limits</li>
          <li>Best for: Global apps, personalization, fast rendering with distributed data</li>
          <li>Not for: Heavy computation, large bundles, centralized databases</li>
          <li>Platforms: Cloudflare Workers, Vercel Edge, Deno Deploy, Lambda@Edge</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
