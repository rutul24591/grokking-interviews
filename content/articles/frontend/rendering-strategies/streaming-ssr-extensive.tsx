"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-streaming--extensive",
  title: "Streaming SSR",
  description: "Understand streaming server-side rendering for faster time-to-first-byte and improved perceived performance with progressive content delivery.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "streaming-ssr",
  version: "extensive",
  wordCount: 3500,
  readingTime: 14,
  lastUpdated: "2026-03-06",
  tags: ["frontend", "rendering", "SSR", "streaming", "React", "performance", "Suspense"],
  relatedTopics: ["server-side-rendering", "progressive-hydration", "selective-hydration"],
};

export default function StreamingSsrExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Streaming SSR (Server-Side Rendering)</strong> is a rendering technique that sends HTML to the
          client progressively in chunks as they're rendered on the server, rather than waiting for the entire page
          to complete before sending anything. This allows the browser to start displaying and parsing HTML
          immediately while the server continues generating remaining content in the background.
        </p>
        <p>
          Traditional SSR (synchronous SSR) has a critical limitation: the server must finish rendering the entire
          HTML document before sending any bytes to the client. If your page fetches data from 5 APIs and one takes
          10 seconds, the user sees nothing for 10 seconds—a blank screen or loading spinner. The TTFB (Time to
          First Byte) is blocked by the slowest operation. <strong>Streaming SSR solves this</strong> by flushing
          HTML to the client as soon as parts are ready.
        </p>
        <p>
          The pattern gained mainstream adoption with <strong>React 18</strong> (March 2022), which introduced
          <code>renderToPipeableStream</code> (Node.js) and <code>renderToReadableStream</code> (Web Streams API).
          These APIs work with React Suspense boundaries to enable granular streaming. <strong>Next.js 13+</strong>
          (with App Router), <strong>Remix</strong>, and <strong>Hydrogen</strong> (Shopify) have embraced
          streaming as the default rendering mode. Streaming SSR represents the evolution of SSR: from
          all-or-nothing blocking renders to progressive, chunk-by-chunk delivery that improves perceived
          performance dramatically.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>Understanding Streaming SSR requires grasping several fundamental concepts:</p>
        <ul>
          <li>
            <strong>Progressive HTML Streaming:</strong> Instead of buffering the entire HTML document, the server
            sends HTML in chunks as they're rendered. The browser can start parsing and displaying early chunks
            (header, navigation, hero) while later chunks (comments, recommendations) are still being generated.
            Uses HTTP chunked transfer encoding under the hood.
          </li>
          <li>
            <strong>Suspense Boundaries:</strong> React Suspense wraps components that may be slow (data fetching,
            lazy imports). While these components are loading, React sends a fallback (loading UI) immediately,
            then replaces it with real content once ready. Suspense is the key to granular streaming—it tells React
            what can be deferred vs. what must be rendered immediately.
          </li>
          <li>
            <strong>Out-of-Order Streaming:</strong> Chunks don't have to arrive in document order. React can stream
            the page shell first, then inject slow components wherever they belong in the DOM tree via inline scripts.
            For example, a slow product recommendation widget at the top can be replaced after fast footer content
            has already been sent.
          </li>
          <li>
            <strong>Selective Hydration:</strong> React 18 pairs streaming with selective hydration. Instead of
            waiting for all JavaScript to download before hydrating anything, React hydrates components as their
            code arrives. The page becomes interactive progressively: header first, then main content, then
            sidebar, etc. This drastically reduces Time to Interactive (TTI).
          </li>
          <li>
            <strong>Shell vs. Content:</strong> The "shell" (layout, navigation, header, footer) typically renders
            fast and streams first, providing instant structure. The "content" (articles, comments, dynamic data)
            streams afterward. The shell gives users immediate visual feedback even if content is slow.
          </li>
          <li>
            <strong>Automatic Code-Splitting:</strong> With Suspense lazy imports, code-split chunks are
            automatically prioritized. If a suspended component enters the viewport, its JavaScript bundle is
            fetched with higher priority. This works seamlessly with streaming SSR.
          </li>
          <li>
            <strong>Back-Pressure Handling:</strong> Streaming SSR respects network back-pressure. If the client
            is on a slow connection and can{'\''}t consume HTML fast enough, the server pauses rendering until the
            network buffer clears. This prevents memory exhaustion on the server.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>The Streaming SSR architecture follows this request-response pattern:</p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Streaming SSR Request Flow</h3>
          <ol className="space-y-3">
            <li><strong>1. User Request:</strong> Browser requests <code>/product/123</code></li>
            <li><strong>2. Server Starts Rendering:</strong> React begins server rendering the component tree</li>
            <li><strong>3. Flush Shell Immediately:</strong> Send HTML shell (header, nav, layout) as soon as ready (~50-100ms)</li>
            <li><strong>4. Browser Starts Parsing:</strong> User sees page structure instantly (TTFB {'<'}100ms, FCP {'<'}200ms)</li>
            <li><strong>5. Suspense Boundaries Detected:</strong> React encounters Suspense around slow components</li>
            <li><strong>6. Stream Fallback UI:</strong> Send loading placeholders (skeleton UI) for suspended components</li>
            <li><strong>7. Continue Rendering Other Parts:</strong> Stream fast components (static sections, cached data)</li>
            <li><strong>8. Resolve Slow Data:</strong> API calls complete, database queries finish</li>
            <li><strong>9. Stream Real Content:</strong> Replace fallbacks with actual content via inline script tags</li>
            <li><strong>10. Close Stream:</strong> Send final HTML chunk; connection closes</li>
            <li><strong>11. Selective Hydration:</strong> React hydrates interactive components progressively as JS downloads</li>
            <li><strong>12. Fully Interactive:</strong> All components hydrated; page fully interactive (TTI)</li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/frontend/rendering-strategies/streaming-ssr-sequence.svg"
          alt="Streaming SSR Flow Sequence"
          caption="Streaming SSR Flow - Progressive delivery of HTML chunks as they're rendered"
        />

        <p>
          This progressive approach transforms the user experience. With traditional SSR, users wait 2-3 seconds
          seeing nothing, then everything appears at once. With Streaming SSR, they see the shell in 100ms, main
          content in 800ms, and additional content trickles in. The page feels fast even when parts are slow.
        </p>

        <ArticleImage
          src="/diagrams/frontend/rendering-strategies/streaming-ssr-architecture.svg"
          alt="Streaming SSR Architecture"
          caption="Streaming SSR Architecture - Suspense boundaries enable progressive, out-of-order streaming"
        />
      </section>

      <section>
        <h2>Implementation Examples</h2>
        <p>Here{'\''}s how Streaming SSR is implemented in modern React frameworks:</p>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold">Next.js 13+ App Router (Streaming by Default)</h3>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
              <code>{`// app/product/[id]/page.tsx - Server Component
import { Suspense } from 'react';
import ProductImage from './ProductImage';
import ProductDetails from './ProductDetails';
import Reviews from './Reviews';
import RecommendedProducts from './RecommendedProducts';

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Shell renders immediately (fast, no data fetching)
  return (
    <div>
      <header>
        <nav>Logo | Search | Cart</nav>
      </header>

      <main>
        {/* Fast: Static or cached image */}
        <ProductImage productId={params.id} />

        {/* Suspense: Slow database query */}
        <Suspense fallback={<ProductDetailsSkeleton />}>
          <ProductDetails productId={params.id} />
        </Suspense>

        {/* Suspense: Slow API call */}
        <Suspense fallback={<ReviewsSkeleton />}>
          <Reviews productId={params.id} />
        </Suspense>

        {/* Suspense: Recommendation engine query */}
        <Suspense fallback={<RecommendationsSkeleton />}>
          <RecommendedProducts productId={params.id} />
        </Suspense>
      </main>

      <footer>© 2026 MyStore</footer>
    </div>
  );
}

// ProductDetails.tsx - Async Server Component
async function ProductDetails({ productId }: { productId: string }) {
  // This fetch is awaited; Suspense boundary handles the delay
  const product = await fetch(\`https://api.example.com/products/\${productId}\`, {
    cache: 'no-store', // Force fresh data
  }).then(res => res.json());

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <button>Add to Cart - \${product.price}</button>
    </div>
  );
}

// Reviews.tsx - Async Server Component
async function Reviews({ productId }: { productId: string }) {
  // Slow API call (2-3 seconds)
  const reviews = await fetch(\`https://api.example.com/reviews/\${productId}\`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  }).then(res => res.json());

  return (
    <div>
      <h2>Customer Reviews</h2>
      {reviews.map((review) => (
        <div key={review.id}>
          <p>{review.rating} stars - {review.text}</p>
        </div>
      ))}
    </div>
  );
}

// Result:
// - Shell (header, nav, footer) streams in 100ms
// - ProductImage displays immediately
// - ProductDetails appears at 800ms (replaces skeleton)
// - Reviews appear at 2000ms (replaces skeleton)
// - RecommendedProducts appear at 1500ms (replaces skeleton)
//
// User sees structure instantly, content progressively fills in!`}</code>
            </pre>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">React 18 + Express (Manual Streaming)</h3>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
              <code>{`// server.js - Node.js Express server with React streaming
import express from 'express';
import { renderToPipeableStream } from 'react-dom/server';
import App from './App';

const app = express();

app.get('/', (req, res) => {
  // Set headers for streaming
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Transfer-Encoding', 'chunked');

  // Start streaming React
  const { pipe, abort } = renderToPipeableStream(<App />, {
    // Called when shell is ready (synchronous components)
    onShellReady() {
      // Start sending HTML immediately
      res.statusCode = 200;
      pipe(res);
    },
    // Called when all content is ready (including Suspense)
    onAllReady() {
      console.log('All content rendered');
    },
    // Error handling
    onError(error) {
      console.error('Streaming error:', error);
      res.statusCode = 500;
      res.send('<!doctype html><p>Internal Server Error</p>');
    },
  });

  // Cleanup on client disconnect
  req.on('close', () => {
    abort();
  });
});

app.listen(3000);

// App.jsx - React component with Suspense
import { Suspense } from 'react';
import Header from './Header';
import SlowComponent from './SlowComponent';

function App() {
  return (
    <html>
      <head>
        <title>Streaming SSR Example</title>
      </head>
      <body>
        <Header /> {/* Fast, renders in shell */}

        <Suspense fallback={<div>Loading content...</div>}>
          <SlowComponent /> {/* Delayed, streams after shell */}
        </Suspense>

        <footer>© 2026</footer>
      </body>
    </html>
  );
}

// SlowComponent.jsx - Simulates slow data fetching
function SlowComponent() {
  // In real app, this would be an async data fetch
  const data = use(fetchData()); // React 'use' hook for async data

  return <div>Slow content loaded: {data}</div>;
}

// Result:
// - Browser receives HTML shell (Header + fallback) in ~100ms
// - SlowComponent streams and replaces fallback after data resolves
// - Footer streams last`}</code>
            </pre>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Remix Deferred Data (Streaming Pattern)</h3>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
              <code>{`// routes/product.$id.tsx - Remix route with deferred data
import { defer } from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';

// Loader: Return fast data immediately, defer slow data
export async function loader({ params }: LoaderFunctionArgs) {
  const productPromise = fetchProduct(params.id); // Slow: 2s
  const imageUrl = await fetchProductImage(params.id); // Fast: 100ms

  return defer({
    // Fast data: awaited, available immediately
    imageUrl,
    // Slow data: NOT awaited, deferred for streaming
    product: productPromise,
  });
}

export default function ProductRoute() {
  const { imageUrl, product } = useLoaderData<typeof loader>();

  return (
    <div>
      <header>Navigation</header>

      {/* Fast: imageUrl is available immediately */}
      <img src={imageUrl} alt="Product" />

      {/* Slow: product data streams after shell */}
      <Suspense fallback={<p>Loading product details...</p>}>
        <Await resolve={product}>
          {(resolvedProduct) => (
            <div>
              <h1>{resolvedProduct.name}</h1>
              <p>{resolvedProduct.description}</p>
            </div>
          )}
        </Await>
      </Suspense>

      <footer>Footer</footer>
    </div>
  );
}

// Result:
// - Shell (header, image, fallback, footer) streams in 150ms
// - Product details stream in at 2000ms, replacing fallback
//
// defer() enables streaming in Remix by marking data as async`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section>
        <h2>Streaming vs. Traditional SSR</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Aspect</th>
              <th className="text-left">Streaming SSR</th>
              <th className="text-left">Traditional SSR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>TTFB</strong></td>
              <td>Fast (100-200ms) - shell streams immediately</td>
              <td>Slow (1-5s) - waits for all data</td>
            </tr>
            <tr>
              <td><strong>FCP</strong></td>
              <td>Excellent (150-300ms) - users see structure instantly</td>
              <td>Poor (1-5s) - nothing visible until complete</td>
            </tr>
            <tr>
              <td><strong>Perceived Performance</strong></td>
              <td>Feels fast - progressive content display</td>
              <td>Feels slow - long blank screen</td>
            </tr>
            <tr>
              <td><strong>Error Handling</strong></td>
              <td>Complex - partial content already sent</td>
              <td>Simple - can show full error page</td>
            </tr>
            <tr>
              <td><strong>SEO</strong></td>
              <td>Excellent - all content eventually in HTML</td>
              <td>Excellent - all content in HTML</td>
            </tr>
            <tr>
              <td><strong>Caching</strong></td>
              <td>Complex - hard to cache streaming responses</td>
              <td>Simple - cache full HTML document</td>
            </tr>
            <tr>
              <td><strong>Hydration</strong></td>
              <td>Selective - hydrates progressively</td>
              <td>All-at-once - waits for full JS bundle</td>
            </tr>
            <tr>
              <td><strong>Server Resources</strong></td>
              <td>Higher - connection stays open longer</td>
              <td>Lower - connection closes quickly</td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/frontend/rendering-strategies/streaming-ssr-performance.svg"
          alt="Streaming SSR vs Traditional SSR Performance"
          caption="Performance Timeline - Streaming SSR delivers content progressively vs. Traditional SSR's all-or-nothing approach"
        />
      </section>

      <section>
        <h2>Trade-offs & Limitations</h2>
        <p><strong>Advantages:</strong></p>
        <ul>
          <li>
            <strong>Instant First Paint:</strong> Users see page structure in 100-200ms, dramatically improving
            perceived performance and reducing bounce rates. No more long blank screens.
          </li>
          <li>
            <strong>Better UX for Slow Operations:</strong> Even if one API takes 10 seconds, users still see the
            rest of the page immediately. Slow operations don{'\''}t block fast ones.
          </li>
          <li>
            <strong>Selective Hydration:</strong> Pairs with progressive hydration. Critical above-the-fold content
            becomes interactive first; below-the-fold content hydrates later. Reduces TTI.
          </li>
          <li>
            <strong>Improved Core Web Vitals:</strong> FCP and LCP are significantly better. TTFB is lower. INP
            (Interaction to Next Paint) benefits from selective hydration.
          </li>
          <li>
            <strong>Parallel Data Fetching:</strong> Multiple Suspense boundaries can resolve in parallel. Traditional
            SSR often fetches sequentially. Streaming naturally parallelizes.
          </li>
        </ul>

        <p><strong>Disadvantages:</strong></p>
        <ul>
          <li>
            <strong>Complex Error Handling:</strong> If an error occurs after the shell is sent, you can{'\''}t show
            a full error page. Must handle errors inline. Error boundaries become critical.
          </li>
          <li>
            <strong>Caching Challenges:</strong> CDNs and reverse proxies struggle to cache streaming responses.
            Traditional SSR can cache full HTML; streaming responses are dynamic by nature. Requires edge computing
            or cache-everything-except-Suspense strategies.
          </li>
          <li>
            <strong>SEO Complexity:</strong> While all content eventually arrives, search engine crawlers may have
            timeouts. If a Suspense boundary takes 10+ seconds, crawlers might not see that content. Test carefully.
          </li>
          <li>
            <strong>Increased Server Load:</strong> Connections stay open longer (seconds vs. milliseconds).
            More concurrent connections means higher memory usage. Requires robust server infrastructure.
          </li>
          <li>
            <strong>Debugging Difficulty:</strong> Inspecting streamed HTML is harder. Chrome DevTools shows partial
            HTML as it arrives. Traditional SSR sends one complete document that{'\''}s easy to inspect.
          </li>
          <li>
            <strong>HTTP/1.1 Limitations:</strong> Works best over HTTP/2+ for multiplexing. HTTP/1.1 head-of-line
            blocking can delay chunks. Modern deployment typically requires HTTP/2.
          </li>
        </ul>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>To build performant applications with Streaming SSR, follow these practices:</p>

        <p><strong>Strategic Suspense Boundaries:</strong> Don{'\''}t wrap everything in Suspense. Wrap only slow operations (database queries, external APIs, heavy computations). Fast components should render in the shell for instant FCP. Over-using Suspense fragments the page and hurts perceived performance.</p>

        <p><strong>Meaningful Fallback UI:</strong> Loading spinners are okay but skeleton screens are better. Show the shape of content (gray boxes, placeholder text) so users understand what{'\''}s coming. Match the skeleton to the actual layout for smooth transitions.</p>

        <p><strong>Prioritize Critical Content:</strong> Ensure above-the-fold content (hero, main heading, navigation) is in the shell and renders fast. Below-the-fold content (comments, related articles, ads) can be deferred with Suspense.</p>

        <p><strong>Error Boundaries Inside Suspense:</strong> Wrap Suspense boundaries with error boundaries to handle failures gracefully. If a suspended component errors, show an inline error message instead of crashing the whole page.</p>

        <p><strong>Test on Real Networks:</strong> Streaming shines on slow networks (3G, rural broadband) where progressive display keeps users engaged. Test with Chrome DevTools network throttling. Ensure timeouts are reasonable (3-5s max for Suspense).</p>

        <p><strong>Monitor TTFB and FCP:</strong> Use Real User Monitoring (RUM) to track TTFB and FCP in production. Streaming should reduce TTFB to {'<'}200ms and FCP to {'<'}500ms. If not, identify slow shell components and optimize them.</p>

        <p><strong>Consider Edge Rendering:</strong> Combine Streaming SSR with edge computing (Vercel Edge, Cloudflare Workers, Deno Deploy) to reduce server-to-client latency. Edge functions can stream HTML from locations close to users.</p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>Streaming SSR excels in specific scenarios:</p>

        <ul>
          <li>
            <strong>Product Pages with Reviews:</strong> Product details (title, price, description) load fast
            from cache. Reviews fetch from API (2-3s). Stream product first, reviews stream later. User can read
            description and add to cart while reviews load.
          </li>
          <li>
            <strong>Dashboard with Multiple Widgets:</strong> Dashboard shell (nav, sidebar) renders immediately.
            Each widget (analytics chart, notifications, activity feed) fetches data independently and streams when
            ready. User sees structure instantly instead of staring at blank dashboard.
          </li>
          <li>
            <strong>News Article Pages:</strong> Article text renders fast (static or cached). Comments, related
            articles, and ads defer with Suspense. Core content (FCP) appears in 200ms; supplementary content
            trickles in.
          </li>
          <li>
            <strong>Social Media Feeds:</strong> Feed skeleton displays immediately. Posts stream in as they{'\''}re
            fetched (paginated or lazy-loaded). User scrolls while content loads. Feels instant compared to
            traditional SSR waiting for entire feed.
          </li>
          <li>
            <strong>Search Results:</strong> Search UI (input, filters) renders in shell. Results stream as search
            API responds. Facets and refinements (which require aggregation queries) defer with Suspense. Users
            see structure instantly.
          </li>
        </ul>

        <p>
          Streaming SSR is <strong>not ideal</strong> for simple static pages (blogs, marketing sites) where
          everything is fast and cacheable—traditional SSG or SSR is simpler. Also challenging for pages requiring
          aggressive CDN caching, as streaming responses are hard to cache.
        </p>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul>
          <li>
            <a href="https://react.dev/reference/react-dom/server/renderToPipeableStream" target="_blank" rel="noopener noreferrer">
              React renderToPipeableStream Documentation
            </a> - Official guide to streaming SSR in React
          </li>
          <li>
            <a href="https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming" target="_blank" rel="noopener noreferrer">
              Next.js Streaming and Suspense
            </a> - Next.js implementation of streaming SSR
          </li>
          <li>
            <a href="https://remix.run/docs/en/main/guides/streaming" target="_blank" rel="noopener noreferrer">
              Remix Streaming Guide
            </a> - Remix{'\''}s approach to deferred data and streaming
          </li>
          <li>
            <a href="https://www.patterns.dev/posts/ssr" target="_blank" rel="noopener noreferrer">
              Patterns.dev: Server-Side Rendering
            </a> - Comprehensive guide including streaming patterns
          </li>
          <li>
            <a href="https://web.dev/rendering-on-the-web/" target="_blank" rel="noopener noreferrer">
              Web.dev: Rendering on the Web
            </a> - Overview of rendering strategies including streaming
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
