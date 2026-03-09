"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { MermaidDiagram } from "@/components/articles/MermaidDiagram";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-lazy-loading-extensive",
  title: "Lazy Loading (Images, Components, Routes)",
  description: "Comprehensive guide to lazy loading images, components, and routes for frontend performance optimization.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "lazy-loading",
  version: "extensive",
  wordCount: 11000,
  readingTime: 44,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "lazy-loading", "images", "intersection-observer"],
  relatedTopics: ["code-splitting", "image-optimization", "virtualization-windowing"],
};

export default function LazyLoadingExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Lazy loading</strong> is a design pattern that delays the initialization or loading of resources
          until they are actually needed. In frontend development, this means deferring the download of images,
          JavaScript modules, components, and even entire routes until the user is about to interact with or view
          them — rather than loading everything upfront on initial page load.
        </p>
        <p>
          The concept originates from software engineering's broader "lazy evaluation" principle (also found in
          functional programming, database query optimization, and operating system memory management), but in web
          development it specifically targets the performance bottleneck of downloading and processing too many
          resources on initial page load.
        </p>
        <p>
          Consider a typical e-commerce product listing page: it might contain 60 product images, a chat widget,
          a review section, a recommendation carousel, and a footer with social feeds. Without lazy loading, the
          browser attempts to download all 60 images, initialize the chat widget, and load every component
          simultaneously — even though the user can only see 6 products and the top section. With lazy loading,
          only the visible content loads initially; everything else loads progressively as the user scrolls or
          interacts.
        </p>
        <p>
          Modern browsers have embraced this pattern with native support (<code>loading="lazy"</code> for images
          and iframes), while frameworks provide first-class APIs (<code>React.lazy</code>, <code>next/dynamic</code>)
          for component and route-level lazy loading. The Intersection Observer API provides the low-level primitive
          for building custom lazy loading solutions.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Viewport-Based Loading:</strong> The most common trigger — resources load when they're about to
            enter the browser's visible area. The Intersection Observer API detects this efficiently without polling
            scroll events.
          </li>
          <li>
            <strong>Interaction-Based Loading:</strong> Resources load in response to user actions — clicking a button
            to open a modal, hovering over a navigation link, or focusing an input field.
          </li>
          <li>
            <strong>Route-Based Loading:</strong> Entire page bundles load when the user navigates to that route.
            This is a specialized form of lazy loading powered by dynamic <code>import()</code>.
          </li>
          <li>
            <strong>Idle-Based Loading:</strong> Resources load during browser idle periods using
            <code>requestIdleCallback</code> or low-priority fetch hints. This loads non-critical resources without
            competing with critical rendering work.
          </li>
          <li>
            <strong>Placeholder Strategy:</strong> What the user sees while the real resource loads. Options include
            blur-up (low-quality image placeholder), skeleton screens, solid color placeholders, or dominant color
            extraction. Good placeholders prevent layout shift and provide visual continuity.
          </li>
          <li>
            <strong>Loading Threshold:</strong> How far in advance to start loading before the resource enters the
            viewport. A 200-300px margin gives the browser time to download the resource so it's ready when
            the user scrolls to it.
          </li>
        </ul>
      </section>

      <section>
        <h2>Lazy Loading Images</h2>
        <p>
          Images are the single largest opportunity for lazy loading. They account for 50-70% of total page weight
          on most websites, and users typically only see 10-30% of a page's images without scrolling.
        </p>

        <MermaidDiagram
          chart={`sequenceDiagram
    participant U as User
    participant B as Browser
    participant S as Server

    Note over U,S: Initial Page Load
    U->>B: Load page
    B->>S: GET hero-image.jpg (eager)
    B->>S: GET product-1.jpg (eager - above fold)
    B->>S: GET product-2.jpg (eager - above fold)
    Note over B: Images 3-60 deferred (loading="lazy")

    Note over U,S: User Scrolls Down
    U->>B: Scroll to row 2
    B->>B: IntersectionObserver fires
    B->>S: GET product-3.jpg
    B->>S: GET product-4.jpg
    B->>S: GET product-5.jpg
    Note over B: Loaded just-in-time

    Note over U,S: User Scrolls More
    U->>B: Scroll to row 3
    B->>S: GET product-6.jpg
    B->>S: GET product-7.jpg`}
          caption="Progressive image loading — only images near the viewport are fetched"
        />

        <h3 className="mt-6 font-semibold">Native Browser Lazy Loading</h3>
        <p>
          The <code>loading</code> attribute is the simplest and most performant approach. The browser handles
          all the complexity — viewport detection, threshold management, and network prioritization.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Native lazy loading ===
// Supported in Chrome 76+, Firefox 75+, Safari 15.4+, Edge 79+

// Lazy — deferred until near viewport
<img
  src="/product-image.jpg"
  alt="Product Name"
  loading="lazy"
  width={400}
  height={300}
  decoding="async"     // Don't block rendering for decode
/>

// Eager — load immediately (default behavior)
// Use for above-the-fold images, hero banners, LCP elements
<img
  src="/hero-banner.jpg"
  alt="Welcome to our store"
  loading="eager"
  fetchPriority="high"  // Tell browser this is high priority
  width={1200}
  height={600}
/>

// Also works on iframes
<iframe
  src="https://www.youtube.com/embed/video-id"
  loading="lazy"
  width={560}
  height={315}
  title="Video player"
/>

// === Critical rule: ALWAYS set width and height ===
// Without dimensions, the browser can't reserve space before loading
// This causes Cumulative Layout Shift (CLS)

// BAD — causes layout shift
<img src="/photo.jpg" loading="lazy" alt="Photo" />

// GOOD — browser reserves 400x300 space immediately
<img src="/photo.jpg" loading="lazy" alt="Photo" width={400} height={300} />

// Or use CSS aspect-ratio
<img
  src="/photo.jpg"
  loading="lazy"
  alt="Photo"
  style={{ aspectRatio: '4/3', width: '100%', height: 'auto' }}
/>`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Intersection Observer for Custom Control</h3>
        <p>
          When you need more control — custom thresholds, animation effects, blur-up placeholders, or analytics
          tracking — use the Intersection Observer API directly.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useState, useRef, useEffect, useCallback } from 'react';

// === Reusable lazy image hook ===
function useLazyLoad(options = {}) {
  const { rootMargin = '200px', threshold = 0 } = options;
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return { ref, isInView };
}

// === Progressive image component with blur-up ===
function ProgressiveImage({ src, placeholder, alt, width, height }) {
  const { ref, isInView } = useLazyLoad({ rootMargin: '300px' });
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      ref={ref}
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
      }}
    >
      {/* Low-quality placeholder (inline base64 or tiny image) */}
      <img
        src={placeholder}
        alt=""
        aria-hidden="true"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: loaded ? 'none' : 'blur(20px)',
          transform: 'scale(1.1)', // Hide blur edges
          transition: 'filter 0.5s ease-out',
        }}
      />

      {/* Full-resolution image — only loads when in view */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={() => setLoaded(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.5s ease-out',
          }}
        />
      )}
    </div>
  );
}

// === Usage ===
<ProgressiveImage
  src="/photos/landscape-2400.jpg"
  placeholder="data:image/jpeg;base64,/9j/4AAQ..." // 20x15px base64
  alt="Mountain landscape"
  width={800}
  height={600}
/>`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Next.js Image Component</h3>
        <p>
          Next.js provides the most complete image lazy loading solution out of the box — automatic lazy loading,
          responsive sizes, format optimization (WebP/AVIF), and blur placeholders.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import Image from 'next/image';

// Lazy loaded by default with blur placeholder
<Image
  src="/photos/product.jpg"
  alt="Product photo"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQ..."
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// Above-the-fold — eager loaded with preload hint
<Image
  src="/hero.jpg"
  alt="Hero banner"
  width={1200}
  height={600}
  priority        // Disables lazy loading, adds <link rel="preload">
  sizes="100vw"
/>

// Dynamic import source with lazy loading
function ProductCard({ product }) {
  return (
    <Image
      src={product.imageUrl}
      alt={product.name}
      width={400}
      height={300}
      placeholder="blur"
      blurDataURL={product.blurHash}
      quality={75}
    />
  );
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Lazy Loading Components</h2>
        <p>
          Component-level lazy loading uses code splitting to defer downloading JavaScript for components that
          aren't immediately needed. This is especially valuable for heavy components that bundle large
          third-party libraries.
        </p>

        <MermaidDiagram
          chart={`flowchart TD
    subgraph Immediate Load
        A[App Shell<br/>50KB] --> B[Header]
        A --> C[Hero Section]
        A --> D[Product Grid]
    end

    subgraph Lazy - On Scroll
        E[Reviews Section<br/>30KB]
        F[Recommendation Carousel<br/>45KB]
    end

    subgraph Lazy - On Interaction
        G[Rich Text Editor<br/>300KB]
        H[Image Gallery Lightbox<br/>80KB]
        I[Share Modal<br/>25KB]
    end

    subgraph Lazy - Conditional
        J[Admin Tools<br/>150KB]
        K[Chat Widget<br/>120KB]
    end

    D -.->|Scroll| E
    E -.->|Scroll| F
    D -.->|Click Write Review| G
    D -.->|Click Image| H
    D -.->|Click Share| I
    A -.->|Admin Role| J
    A -.->|Feature Flag| K`}
          caption="Component loading strategy — different triggers for different components"
        />

        <h3 className="mt-6 font-semibold">React.lazy with Suspense</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { lazy, Suspense, useState } from 'react';

// === Interaction-triggered lazy loading ===
const ShareModal = lazy(() => import('./ShareModal'));
const ImageLightbox = lazy(() => import('./ImageLightbox'));

function ProductPage({ product }) {
  const [showShare, setShowShare] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  return (
    <div>
      <ProductDetails product={product} />

      <button onClick={() => setShowShare(true)}>Share</button>
      <button onClick={() => setLightboxImage(product.images[0])}>
        View Full Size
      </button>

      {/* Modal loads on demand */}
      {showShare && (
        <Suspense fallback={<ModalSkeleton />}>
          <ShareModal
            product={product}
            onClose={() => setShowShare(false)}
          />
        </Suspense>
      )}

      {/* Lightbox loads on demand */}
      {lightboxImage && (
        <Suspense fallback={<div className="loading-overlay" />}>
          <ImageLightbox
            image={lightboxImage}
            onClose={() => setLightboxImage(null)}
          />
        </Suspense>
      )}
    </div>
  );
}

// === Tab-based lazy loading ===
const OverviewTab = lazy(() => import('./tabs/Overview'));
const SpecsTab = lazy(() => import('./tabs/Specifications'));
const ReviewsTab = lazy(() => import('./tabs/Reviews'));

const TAB_COMPONENTS = {
  overview: OverviewTab,
  specs: SpecsTab,
  reviews: ReviewsTab,
};

function ProductTabs({ productId }) {
  const [activeTab, setActiveTab] = useState('overview');
  const TabComponent = TAB_COMPONENTS[activeTab];

  return (
    <div>
      <div role="tablist">
        {Object.keys(TAB_COMPONENTS).map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <Suspense fallback={<TabSkeleton />}>
        <TabComponent productId={productId} />
      </Suspense>
    </div>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Scroll-Triggered Component Loading</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { lazy, Suspense, useState, useRef, useEffect } from 'react';

// Generic wrapper for scroll-triggered lazy loading
function LazySection({ importFn, fallback, rootMargin = '200px', ...props }) {
  const [Component, setComponent] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Dynamic import when section enters viewport
          importFn().then(mod => {
            setComponent(() => mod.default);
          });
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [importFn, rootMargin]);

  return (
    <div ref={ref}>
      {Component ? <Component {...props} /> : fallback}
    </div>
  );
}

// Usage — sections load as user scrolls
function LongPage({ data }) {
  return (
    <main>
      {/* Above the fold — loaded immediately */}
      <HeroSection data={data.hero} />
      <FeaturedProducts products={data.featured} />

      {/* Below the fold — loaded on scroll */}
      <LazySection
        importFn={() => import('./sections/Testimonials')}
        fallback={<TestimonialsSkeleton />}
        testimonials={data.testimonials}
      />

      <LazySection
        importFn={() => import('./sections/RecentBlogPosts')}
        fallback={<BlogPostsSkeleton />}
        posts={data.recentPosts}
      />

      <LazySection
        importFn={() => import('./sections/Newsletter')}
        fallback={<NewsletterSkeleton />}
        rootMargin="400px" // Load earlier — it's important
      />

      <LazySection
        importFn={() => import('./sections/Footer')}
        fallback={<FooterSkeleton />}
      />
    </main>
  );
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Lazy Loading Routes</h2>
        <p>
          Route-based lazy loading ensures that each page's JavaScript is only downloaded when the user navigates
          to that page. This is the most impactful form of lazy loading for multi-page applications.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === React Router with lazy loading ===
import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// Each route is a separate chunk
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() =>
  import(/* webpackPrefetch: true */ './pages/Products')
);
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() =>
  import(/* webpackPrefetch: true */ './pages/Cart')
);
const Checkout = lazy(() => import('./pages/Checkout'));
const Account = lazy(() => import('./pages/Account'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'account/*', element: <Account /> },
    ],
  },
]);

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

// === Prefetch on hover for instant navigation ===
function NavigationLink({ to, importFn, children }) {
  return (
    <Link
      to={to}
      onMouseEnter={() => importFn()}  // Prefetch on hover
      onFocus={() => importFn()}       // Prefetch on keyboard focus
    >
      {children}
    </Link>
  );
}

// Usage
const productsImport = () => import('./pages/Products');
const Products = lazy(productsImport);

<NavigationLink to="/products" importFn={productsImport}>
  Products
</NavigationLink>`}</code>
        </pre>
      </section>

      <section>
        <h2>Performance Impact & Metrics</h2>

        <MermaidDiagram
          chart={`graph LR
    subgraph Without Lazy Loading
        A[Initial Load<br/>3.2MB] --> B[FCP: 4.2s]
        A --> C[LCP: 5.8s]
        A --> D[TTI: 7.1s]
    end

    subgraph With Lazy Loading
        E[Initial Load<br/>450KB] --> F[FCP: 1.2s]
        E --> G[LCP: 1.8s]
        E --> H[TTI: 2.4s]
    end`}
          caption="Impact of lazy loading on Core Web Vitals — typical improvements for a content-heavy page"
        />

        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Metric</th>
              <th className="p-3 text-left">Without Lazy Loading</th>
              <th className="p-3 text-left">With Lazy Loading</th>
              <th className="p-3 text-left">Improvement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Initial Transfer Size</strong></td>
              <td className="p-3">3.2 MB</td>
              <td className="p-3">450 KB</td>
              <td className="p-3">86% reduction</td>
            </tr>
            <tr>
              <td className="p-3"><strong>HTTP Requests</strong></td>
              <td className="p-3">65 (all images)</td>
              <td className="p-3">12 (visible only)</td>
              <td className="p-3">82% fewer requests</td>
            </tr>
            <tr>
              <td className="p-3"><strong>FCP</strong></td>
              <td className="p-3">4.2s</td>
              <td className="p-3">1.2s</td>
              <td className="p-3">71% faster</td>
            </tr>
            <tr>
              <td className="p-3"><strong>LCP</strong></td>
              <td className="p-3">5.8s</td>
              <td className="p-3">1.8s</td>
              <td className="p-3">69% faster</td>
            </tr>
            <tr>
              <td className="p-3"><strong>TTI</strong></td>
              <td className="p-3">7.1s</td>
              <td className="p-3">2.4s</td>
              <td className="p-3">66% faster</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Bandwidth Saved</strong></td>
              <td className="p-3">—</td>
              <td className="p-3">~2.7 MB per visit</td>
              <td className="p-3">For users who don't scroll to bottom</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Lazy-loading the LCP image:</strong> The most damaging mistake. If your Largest Contentful Paint
            element (usually a hero image or banner) is lazy-loaded, it won't start downloading until the browser
            evaluates the Intersection Observer or the <code>loading="lazy"</code> threshold — adding significant
            delay. Always use <code>loading="eager"</code> and <code>fetchPriority="high"</code> for LCP images.
          </li>
          <li>
            <strong>No dimensions on images:</strong> Without <code>width</code> and <code>height</code> attributes
            (or CSS aspect-ratio), the browser can't reserve space for lazy images. When they load, they push
            surrounding content down — causing layout shifts (bad CLS). Always specify dimensions.
          </li>
          <li>
            <strong>Too aggressive threshold:</strong> Setting <code>rootMargin: "0px"</code> means images only start
            loading when they're at the viewport edge. On fast scrolling, users see blank spaces. Use 200-300px
            margins for a smooth experience.
          </li>
          <li>
            <strong>No fallback content:</strong> Leaving lazy sections blank while loading creates jarring UX.
            Implement skeleton screens, blur placeholders, or dominant color backgrounds. The placeholder should
            match the final content's dimensions exactly.
          </li>
          <li>
            <strong>Lazy loading everything:</strong> Above-the-fold content, critical navigation elements, and
            the primary content area should load eagerly. Lazy loading should only target below-fold and
            interaction-dependent content.
          </li>
          <li>
            <strong>Not handling errors:</strong> Network failures during lazy loading leave users with broken
            images or missing sections. Implement error boundaries for components and <code>onerror</code> handlers
            for images with fallback sources.
          </li>
          <li>
            <strong>Scroll handler instead of Intersection Observer:</strong> Using scroll event listeners for
            lazy loading is a common legacy pattern that causes performance problems — scroll handlers fire
            on every scroll frame (60+ times/second) and block the main thread. Always use Intersection Observer.
          </li>
          <li>
            <strong>Not lazy-loading iframes:</strong> Embedded videos, maps, and social widgets are heavy resources
            that benefit enormously from lazy loading. An embedded YouTube player downloads ~800KB. Use
            <code>loading="lazy"</code> on iframes or replace them with a click-to-load placeholder.
          </li>
        </ul>
      </section>

      <section>
        <h2>Advanced Patterns</h2>

        <h3 className="mt-4 font-semibold">Priority Hints with Lazy Loading</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Combine lazy loading with fetchPriority for fine-grained control
// Above fold — high priority, eager
<img src="/hero.jpg" fetchPriority="high" loading="eager" />

// Above fold but not LCP — auto priority, eager
<img src="/logo.png" fetchPriority="auto" loading="eager" />

// Below fold — low priority, lazy
<img src="/footer-image.jpg" fetchPriority="low" loading="lazy" />

// Programmatic priority with fetch()
const prefetchImage = (src) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Facade Pattern for Heavy Third-Party Widgets</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Instead of loading a 800KB YouTube embed immediately,
// show a static thumbnail that loads the real player on click

function YouTubeFacade({ videoId, title }) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        src={\`https://www.youtube.com/embed/\${videoId}?autoplay=1\`}
        title={title}
        width={560}
        height={315}
        allow="autoplay"
      />
    );
  }

  return (
    <button
      onClick={() => setLoaded(true)}
      style={{ position: 'relative', width: 560, height: 315 }}
      aria-label={\`Play video: \${title}\`}
    >
      {/* Thumbnail — tiny compared to full embed */}
      <img
        src={\`https://i.ytimg.com/vi/\${videoId}/hqdefault.jpg\`}
        alt={title}
        loading="lazy"
        width={560}
        height={315}
      />
      {/* Play button overlay */}
      <svg viewBox="0 0 68 48" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 68,
        height: 48,
      }}>
        <path d="M66.5 7.7c-.8-2.9-2.5-5.4-5.4-6.2C55.8.1 34 0 34 0S12.2.1 6.9 1.5C4 2.3 2.3 4.8 1.5 7.7.1 13 0 24 0 24s.1 11 1.5 16.3c.8 2.9 2.5 5.4 5.4 6.2C12.2 47.9 34 48 34 48s21.8-.1 27.1-1.5c2.9-.8 5.4-2.5 6.2-5.4C68.9 35 69 24 69 24s-.1-11-2.5-16.3z" fill="red"/>
        <path d="M45 24L27 14v20" fill="white"/>
      </svg>
    </button>
  );
}

// Saves ~800KB per embedded video until user clicks play`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Progressive Loading with React 18 Suspense</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { Suspense, lazy, startTransition, useState } from 'react';

// Multiple Suspense boundaries for granular loading
function DashboardPage() {
  return (
    <div>
      {/* Critical content — loads first */}
      <Suspense fallback={<MetricsSkeleton />}>
        <KeyMetrics />
      </Suspense>

      {/* Secondary content — can load later */}
      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />
      </Suspense>

      {/* Tertiary content — lowest priority */}
      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivity />
      </Suspense>
    </div>
  );
}

// Use startTransition to keep current UI while loading
function Navigation() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigate = (page) => {
    startTransition(() => {
      setCurrentPage(page);
    });
    // Current page stays visible until new page's chunk loads
    // No flash of loading state for fast networks
  };

  return (
    <nav>
      <button onClick={() => navigate('home')}>Home</button>
      <button onClick={() => navigate('dashboard')}>Dashboard</button>
    </nav>
  );
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Testing Lazy Loading</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Chrome DevTools ===
// 1. Network tab: filter by "Img" to see image loading order
// 2. Throttle to "Slow 3G" to observe lazy loading timing
// 3. Performance tab: check for layout shifts (CLS) from lazy images

// === Lighthouse ===
// Check these audits:
// - "Defer offscreen images" (should pass with lazy loading)
// - "Properly size images"
// - "Largest Contentful Paint image was lazily loaded" (FAIL — fix this!)

// === Unit testing with Testing Library ===
import { render, screen } from '@testing-library/react';

test('lazy component loads on interaction', async () => {
  render(<ProductPage />);

  // Component not loaded yet
  expect(screen.queryByTestId('review-editor')).not.toBeInTheDocument();

  // Trigger lazy load
  fireEvent.click(screen.getByText('Write Review'));

  // Wait for lazy component to load
  const editor = await screen.findByTestId('review-editor');
  expect(editor).toBeInTheDocument();
});

// === Mock Intersection Observer in tests ===
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;`}</code>
        </pre>
      </section>

      <section>
        <h2>Best Practices Summary</h2>
        <ol className="space-y-3">
          <li>
            <strong>Categorize all resources by priority:</strong> Above-fold/LCP content loads eagerly.
            Below-fold content loads on scroll. Interaction-dependent content loads on trigger. Non-essential
            content loads on idle.
          </li>
          <li>
            <strong>Never lazy-load the LCP element:</strong> Use <code>loading="eager"</code> and
            <code>fetchPriority="high"</code> for hero images and primary content.
          </li>
          <li>
            <strong>Always set image dimensions:</strong> Prevent CLS with explicit <code>width</code>/<code>height</code>
            or CSS <code>aspect-ratio</code>. Every lazy image needs reserved space.
          </li>
          <li>
            <strong>Use native lazy loading for images:</strong> <code>loading="lazy"</code> is simpler and more
            performant than JavaScript solutions. Use Intersection Observer only when you need custom behavior.
          </li>
          <li>
            <strong>Provide quality placeholders:</strong> Blur-up, skeleton screens, or dominant color placeholders.
            Match the dimensions of the final content exactly.
          </li>
          <li>
            <strong>Set appropriate loading margins:</strong> 200-300px <code>rootMargin</code> for images,
            400-600px for heavy components, to give the browser time to download before scroll reaches them.
          </li>
          <li>
            <strong>Use facades for third-party embeds:</strong> Replace heavy embeds (YouTube, maps, chat widgets)
            with lightweight placeholders that load the real widget on interaction.
          </li>
          <li>
            <strong>Prefetch likely-next routes:</strong> Hover-based and viewport-based prefetching eliminates the
            latency penalty of route-level lazy loading.
          </li>
          <li>
            <strong>Handle errors gracefully:</strong> Implement retry logic for chunk failures, fallback images
            for broken image loads, and error boundaries for component failures.
          </li>
          <li>
            <strong>Test on throttled connections:</strong> Lazy loading's impact is most visible on slow networks.
            Always test with network throttling to verify the experience.
          </li>
        </ol>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-3">
          <li>
            Lazy loading defers resource loading until needed — images via <code>loading="lazy"</code>,
            components via <code>React.lazy</code> + Suspense, routes via dynamic imports.
          </li>
          <li>
            The three loading triggers are <strong>viewport proximity</strong> (Intersection Observer),
            <strong>user interaction</strong> (click/hover), and <strong>idle time</strong> (requestIdleCallback).
          </li>
          <li>
            Never lazy-load LCP/above-the-fold content — it hurts Core Web Vitals. Use <code>fetchPriority="high"</code>
            and <code>loading="eager"</code> for critical content.
          </li>
          <li>
            Always prevent CLS by setting explicit dimensions on lazy images and using skeleton placeholders
            for lazy components.
          </li>
          <li>
            The facade pattern replaces heavy third-party embeds (YouTube ~800KB) with lightweight placeholders
            that load the real widget on click — massive bandwidth savings.
          </li>
          <li>
            Native <code>loading="lazy"</code> is preferred for images (simpler, more performant). Intersection
            Observer is used when you need custom thresholds, animations, or analytics tracking.
          </li>
          <li>
            Prefetching (hover-based, viewport-based) compensates for the latency that lazy loading introduces
            on route navigation.
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://web.dev/lazy-loading-images/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Lazy Loading Images
            </a>
          </li>
          <li>
            <a href="https://web.dev/browser-level-image-lazy-loading/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Browser-Level Image Lazy Loading
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Intersection Observer API
            </a>
          </li>
          <li>
            <a href="https://nextjs.org/docs/app/api-reference/components/image" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Next.js — Image Component
            </a>
          </li>
          <li>
            <a href="https://web.dev/lcp-lazy-loading/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Don't Lazy-Load LCP Images
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
