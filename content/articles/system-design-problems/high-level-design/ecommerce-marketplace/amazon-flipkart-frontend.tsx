"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-amazon-flipkart-frontend",
  title: "Design Amazon / Flipkart Frontend",
  description:
    "Architecture for a large-scale e-commerce frontend: page composition strategy (SSR homepage, ISR category pages, CSR cart/checkout), micro-frontend module federation, product catalog CDN caching with real-time stock invalidation, performance optimization (LCP, INP, CLS), A/B experimentation layer, personalized recommendations, and multi-region edge delivery.",
  category: "high-level-design",
  subcategory: "ecommerce-marketplace",
  slug: "amazon-flipkart-frontend",
  wordCount: 5100,
  readingTime: 31,
  lastUpdated: "2026-05-11",
  tags: ["hld", "ecommerce", "frontend", "ssr", "cdn", "micro-frontend", "performance", "personalization"],
  relatedTopics: ["product-listing-recommendation-ui", "cart-checkout-concurrency"],
};

export default function AmazonFlipkartFrontendArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Designing the frontend for a large-scale marketplace like Amazon or Flipkart means reconciling two fundamentally conflicting requirements: content freshness and delivery performance. Product prices, stock levels, and promotional banners change by the minute. At the same time, product detail pages must achieve sub-2-second LCP globally to prevent cart abandonment (studies show each 100ms of additional page load time reduces conversion rates by ~1%). Pure server-side rendering (every request hits origin) gives freshness but no performance at global scale. Pure static generation gives performance but stale prices and inventory. The real answer is a carefully layered rendering strategy per page type, combined with selective cache invalidation and client-side hydration only where truly needed.</p>
        <p>A second challenge is organizational scale. Amazon's frontend is built and deployed by hundreds of teams. The homepage is a composed page where the hero banner, sponsored products, browsing history widget, and deal of the day are each owned by different teams deploying on different cadences. This mandates a micro-frontend or server-side composition architecture where teams can deploy independently without a central release gate. The tradeoff: composed pages are harder to optimize for performance (each component may load its own JavaScript bundle) and harder to test end-to-end.</p>
        <p><strong>Explicit scope:</strong> Web frontend architecture for homepage, category listings, product detail pages, cart, and checkout. Not in scope: native mobile apps, seller portal, or logistics tracking UI.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Homepage:</strong> Personalized hero banner, featured categories, browsing history carousel, deal-of-the-day countdown, sponsored products. Each section is independently owned and deployed by different teams.</li>
          <li><strong>Product listing page (PLP):</strong> Faceted filtering (category, price, brand, rating), infinite scroll or pagination, sort by relevance/price/rating, sponsored result injection, real-time stock badges ("Only 3 left").</li>
          <li><strong>Product detail page (PDP):</strong> Image gallery, price with live strike-through for discounts, stock status, seller selection, variant picker (size/color), add-to-cart, similar products carousel, reviews.</li>
          <li><strong>Cart:</strong> Real-time price validation on cart load, stock validation before checkout, quantity adjustment, coupon/promo code application, estimated delivery date per item.</li>
          <li><strong>A/B experimentation:</strong> Any UI element (button text, layout variant, recommendation algorithm) can be A/B tested without a code deploy. Experiment assignments are server-side (in SSR response headers) to avoid layout shift.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Core Web Vitals:</strong> LCP &lt; 2.5s, INP &lt; 200ms, CLS &lt; 0.1 globally (including emerging markets on 3G connections).</li>
          <li><strong>Availability:</strong> 99.99% uptime. A CDN failure must not take down product pages — origin fallback within 100ms.</li>
          <li><strong>Price/stock freshness:</strong> Prices displayed must be at most 5 minutes stale. Stock badges must be at most 60 seconds stale.</li>
          <li><strong>Scale:</strong> Handle traffic spikes of 10× during sale events (Big Billion Days, Prime Day). CDN must absorb &gt;95% of page requests.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>Each page type uses the rendering strategy that best matches its freshness/performance trade-off. The homepage uses SSR at the edge (Next.js on Cloudflare Workers/Vercel Edge): rendered per-request to include personalization (user's browsing history, account-specific deals) but running at edge PoPs globally for sub-100ms TTFB. Category listing pages use ISR (Incremental Static Regeneration) with a 5-minute stale-while-revalidate: the static HTML is served instantly from CDN, and in the background a new version is regenerated every 5 minutes incorporating updated prices and inventory. Product detail pages use ISR with a 1-minute revalidation for the core page shell (images, description, specs) plus client-side hydration for price, stock, and delivery estimate (the three most volatile fields). The cart and checkout are fully CSR: no caching is appropriate for user-specific, transaction-critical state.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ecommerce-marketplace/amazon-flipkart-frontend.svg"
          alt="Amazon Flipkart frontend architecture showing rendering strategy matrix (Homepage: SSR at edge Next.js Cloudflare Workers personalized per-user sub-100ms TTFB; Category PLP: ISR 5min stale-while-revalidate CDN serve static HTML background regen; PDP: ISR 1min shell + CSR hydration for price/stock/delivery; Cart/Checkout: full CSR no cache user-specific transaction-critical), CDN and edge layer (global PoPs 95%+ cache hit rate; stale-while-revalidate; origin fallback <100ms; Cache-Control max-age=300 s-maxage=60; cache invalidation webhooks on price/stock change), micro-frontend composition (Module Federation or ESI Edge Side Includes; homepage composed of hero banner team A + browsing history team B + sponsored products team C + deal countdown team D each deploy independently; shared design system component library; server-side shell renders skeleton; components hydrate independently), performance optimization (LCP: preload hero image link rel=preload priority=high above-fold image critical CSS inlined; INP: event handler debounce 50ms offload to Web Worker; CLS: skeleton loaders reserve layout space img width/height set CSS aspect-ratio; Lighthouse CI gate blocks deploy if CWV regress), A/B experiment layer (server-side bucket assignment in SSR response no layout shift; experiment config Edge KV store; bucket = Hash(userId+expId) mod 100; 100ms overhead max), real-time stock and price (CSR hydration POST /api/live-data itemIds[] returns price+stock+delivery; polling every 60s for stock badges; WebSocket for flash sale countdown timers; stale price guard: cart load re-validates prices before checkout CTA enabled)."
          caption="Rendering strategy matrix (SSR edge / ISR / CSR by page type), CDN with stale-while-revalidate and cache invalidation, micro-frontend composition (Module Federation / ESI), Core Web Vitals optimization (LCP/INP/CLS), server-side A/B bucketing, and CSR hydration for live price/stock"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Rendering Strategy by Page Type</h3>
        <p>The homepage is SSR at the edge. The edge function reads the user's session cookie to identify their account, calls three internal APIs (browsing-history, account-deals, featured-banners) with a combined timeout budget of 80ms (using Promise.race with a 80ms timeout, falling back to generic content if any API is slow), and returns a fully rendered HTML page. Edge execution means this SSR happens at the CDN PoP closest to the user (Mumbai for Indian users, Frankfurt for European users), achieving TTFB under 120ms even with the API calls. The rendered HTML is not cached (personalized content cannot be shared across users) but the sub-components fetched via ESI (Edge Side Includes) for non-personalized sections (top categories, trending products) are cached at the edge for 5 minutes.</p>
        <p>Product detail pages use ISR with two revalidation bands. The static shell (product title, description, images, specs, reviews summary) is regenerated every 60 seconds. The volatile data (current price, stock level, delivery date) is excluded from the ISR shell and fetched client-side on hydration via a single batched POST /api/live-data?items=[sku]. This pattern—ISR shell + CSR volatile data—achieves the best of both worlds: the page loads instantly from CDN (no TTFB wait for origin), and the price/stock data is fresh as of the user's visit. The slight disadvantage is that the user sees the price appear 200–300ms after the page is visible (a skeleton loader holds the price slot during this window, preventing CLS).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Micro-Frontend Composition</h3>
        <p>The homepage is composed from micro-frontends owned by different teams. The composition strategy uses a hybrid: server-side ESI (Edge Side Includes) for above-the-fold sections (hero banner, top categories) and client-side Module Federation for below-the-fold sections (browsing history, recommendations, sponsored products). ESI composition happens at the CDN edge: the homepage shell includes ESI tags pointing to sub-component fragment URLs; the CDN assembles the final HTML by fetching each fragment in parallel before serving the response. Module Federation: each team publishes a remote JavaScript module; the homepage shell loads these modules lazily on scroll (IntersectionObserver triggers load when the section enters the viewport). This achieves independent deployability (each team ships their micro-frontend independently) without blocking the initial page load on below-fold component bundles.</p>
        <p>Shared dependencies: React, the design system component library, and routing utilities are shared singletons (defined as shared in webpack Module Federation config) to prevent each micro-frontend from bundling its own copy. Without sharing, a page composed of 5 micro-frontends could load 5 separate copies of React, adding ~180KB per copy. With sharing, all micro-frontends reference the host application's single React instance.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Core Web Vitals Optimization</h3>
        <p>LCP (Largest Contentful Paint) on product pages is the hero product image. Three optimizations: (1) Preload: the SSR response includes a &lt;link rel="preload" as="image" href="..." fetchpriority="high"&gt; in the &lt;head&gt; for the first product image, telling the browser to start downloading it before parsing the rest of the page. (2) Image optimization: product images are served via a CDN image pipeline that generates WebP variants at multiple sizes (320px, 640px, 1280px) and serves the appropriate size via srcset. (3) Critical CSS: above-the-fold CSS is inlined in &lt;style&gt; tags in the HTML (not linked as a separate file that would block rendering). Together these bring LCP from ~3.5s to ~1.8s on 4G mobile.</p>
        <p>INP (Interaction to Next Paint) is dominated by faceted filter interactions on the PLP (clicking a filter checkbox should visually update immediately). The filter handler uses React's startTransition to mark the re-render as non-urgent, keeping the checkbox visual response immediate (the transition registers in &lt;50ms) while the heavy list re-render happens asynchronously without blocking the UI thread. For product image gallery swipes on PDP, the image preloading uses a sliding window: when the user views image N, images N+1 and N+2 are prefetched in the background.</p>
        <p>CLS (Cumulative Layout Shift): the most common CLS source on e-commerce pages is images without explicit dimensions (the browser doesn't know the height until the image loads, causing content below to shift). All product images use explicit width and height attributes or CSS aspect-ratio: 1/1 to reserve the layout space before the image loads. Dynamic content injected after page load (cookie consent banners, notification prompts) uses position: fixed to avoid pushing page content, and is sized conservatively (max-height constrained) to bound CLS impact.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Cache Invalidation Strategy</h3>
        <p>ISR cache invalidation is triggered by backend events, not purely by time. When a product's price changes in the catalog service, a price-changed event is published to a webhook queue. The queue delivers a POST to the frontend's revalidation API: POST /api/revalidate?path=/product/[sku]. Next.js (or equivalent) invalidates the CDN cache for that specific path, causing the next request to regenerate the page with the new price. This event-driven invalidation means price changes propagate to the frontend within 30–60 seconds (the time for the event to travel through the queue and for the CDN to regenerate the page), rather than waiting for the next 60-second ISR cycle. During a flash sale (where thousands of prices change simultaneously), the revalidation queue is rate-limited to prevent the origin from being overwhelmed with regeneration requests. Pages not yet invalidated serve the stale ISR version with a "prices may have changed" notice; the CSR hydration layer fetches the current price on the client side immediately on hydration, so the user always sees the live price regardless of which ISR version was served.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">A/B Experimentation Without Layout Shift</h3>
        <p>Client-side A/B testing (assigning the user to a variant in JavaScript after page load) causes layout shift: the user sees the control version for 100–300ms, then the variant flashes in. This is particularly bad for experiments that change above-the-fold content (hero banner, CTA button). The solution is server-side experiment assignment: the edge function reads the user's experiment bucket (from a cookie or derived from userId hash) and renders the correct variant server-side before sending HTML. The experiment configuration (which variants exist, what percentage gets each) is stored in a KV store at the edge (Cloudflare KV, Vercel Edge Config) so the edge function can read it without an origin round-trip. Experiment metrics (which variant a user saw, whether they converted) are tracked as events in the analytics pipeline, attributed by the experiment bucket ID included in every page response.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>ISR + CSR hydration versus full SSR: the ISR shell + CSR volatile data pattern means there is a brief moment where the page shows stale price data from the ISR shell before the CSR hydration updates it. During this window (200–400ms), the user could theoretically screenshot a lower price. In practice this is acceptable: the cart re-validates prices before the checkout CTA becomes enabled (the "Place Order" button is disabled until a live price check completes). This guard prevents any stale-price-based purchase. The alternative—always SSR the price—adds 200–400ms to TTFB for every PDP request and eliminates the CDN cache benefit.</p>
        <p>Micro-frontend bundle overhead: Module Federation reduces duplicate loading of shared libraries but adds runtime overhead: the Module Federation runtime must negotiate shared scope between host and remotes before rendering, adding 20–50ms of JavaScript execution time. For above-the-fold components (hero banner, navigation) this overhead is unacceptable. These components are either bundled directly in the host application or loaded via ESI (server-side composition, no JS overhead). Module Federation is appropriate only for below-the-fold, lazily-loaded sections.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A large-scale e-commerce frontend layers rendering strategies by page freshness requirements: SSR at edge for the personalized homepage (TTFB &lt;120ms), ISR with 1–5 minute revalidation for catalog pages (CDN cache hit &gt;95%), and CSR hydration for volatile fields (price/stock, &lt;300ms hydration time). Micro-frontend composition uses ESI for above-the-fold (server-side, zero JS overhead) and Module Federation for below-the-fold (lazy-loaded, shared dependencies). Core Web Vitals are optimized systematically: LCP via hero image preload + WebP + critical CSS inline; INP via React startTransition for filter interactions; CLS via explicit image dimensions and aspect-ratio reservation. Cache invalidation is event-driven (webhook on price change → CDN path invalidation within 60s) rather than purely time-based, with a cart-load price re-validation guard before checkout. A/B experiments are assigned server-side at the edge (reading experiment config from edge KV, no client-side assignment) to eliminate layout shift. The defining architectural constraint: the CDN must absorb &gt;95% of all page requests — origin must never be on the critical path for catalog browsing.</p>
      </section>
    </ArticleLayout>
  );
}
