"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-mobile-performance-optimization",
  title: "Mobile Performance Optimization",
  description:
    "Comprehensive guide to Mobile Performance Optimization covering bundle size, code splitting, image optimization, critical CSS, and production-scale mobile performance patterns.",
  category: "frontend",
  subcategory: "mobile-considerations",
  slug: "mobile-performance-optimization",
  wordCount: 5300,
  readingTime: 21,
  lastUpdated: "2026-04-02",
  tags: [
    "frontend",
    "mobile",
    "performance",
    "optimization",
    "bundle size",
    "images",
  ],
  relatedTopics: [
    "responsive-design",
    "lazy-loading-translations",
    "viewport-configuration",
  ],
};

export default function MobilePerformanceOptimizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Mobile Performance Optimization</strong> encompasses techniques
          to make web applications load faster and run smoother on mobile
          devices. Mobile users face unique constraints: slower networks (3G,
          4G), limited CPU power, less memory, and smaller screens. A site that
          loads in 2 seconds on desktop might take 8+ seconds on mobile without
          optimization. For staff-level engineers, mobile performance is both a
          technical challenge and a business imperative — 53% of mobile users
          abandon sites that take longer than 3 seconds to load.
        </p>
        <p>
          Mobile performance optimization involves multiple layers: network
          optimization (reduce bytes transferred), rendering optimization
          (reduce paint/composite work), JavaScript optimization (reduce parse
          and execute time), and caching optimization (reduce repeat load time).
          Each layer requires different techniques and trade-offs.
        </p>
        <p>
          Mobile performance involves several technical considerations.{" "}
          <strong>Bundle size</strong> — mobile networks are slower, every KB
          matters. <strong>Code splitting</strong> — load only code needed for
          current view. <strong>Image optimization</strong> — images are 50%+
          of page weight. <strong>Critical CSS</strong> — inline above-fold
          styles, defer rest. <strong>Lazy loading</strong> — defer off-screen
          content.
        </p>
        <p>
          The business case for mobile performance is clear: faster sites have
          lower bounce rates, higher engagement, and better conversion. Google
          uses page speed as a ranking factor for mobile search. Amazon found
          every 100ms of latency cost 1% in sales. Mobile performance isn&apos;t
          optional — it&apos;s essential for user experience and business
          success.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Performance Budget:</strong> Maximum allowed size for
            different resource types (JavaScript, CSS, images). Example: JS
            &lt; 170KB, CSS &lt; 50KB, images &lt; 500KB. Enforce in CI/CD —
            fail build if budget exceeded.
          </li>
          <li>
            <strong>Code Splitting:</strong> Split JavaScript into multiple
            chunks loaded on-demand. Route-based splitting (load code per page),
            component-based splitting (load heavy components lazily). Reduces
            initial load time.
          </li>
          <li>
            <strong>Image Optimization:</strong> Serve appropriately sized
            images (don&apos;t send 2000px image to mobile). Use modern formats
            (WebP, AVIF). Lazy load off-screen images. Images are often 50%+ of
            page weight.
          </li>
          <li>
            <strong>Critical CSS:</strong> Inline CSS for above-fold content,
            defer rest. Eliminates render-blocking CSS for initial view.
            Improves First Contentful Paint (FCP).
          </li>
          <li>
            <strong>Resource Hints:</strong>{" "}
            <code>preload</code> (load this soon),{" "}
            <code>prefetch</code> (load when idle),{" "}
            <code>preconnect</code> (establish connection early). Guide browser
            loading priorities.
          </li>
          <li>
            <strong>Mobile-Specific Optimization:</strong> Serve smaller bundles
            to mobile (less JavaScript), use responsive images, minimize main
            thread work (mobile CPUs are slower), avoid layout thrashing.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/mobile-performance-budget.svg"
          alt="Mobile Performance Budget showing size limits for JavaScript, CSS, images, and total page weight"
          caption="Performance budget — set maximum sizes for each resource type, enforce in CI/CD, mobile budgets should be stricter than desktop"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Mobile performance architecture consists of build-time optimization
          (minification, tree-shaking, image optimization), runtime optimization
          (code splitting, lazy loading), and caching optimization (service
          workers, CDN). The architecture must handle different network
          conditions (3G, 4G, WiFi) and device capabilities (low-end vs.
          high-end phones).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/code-splitting-strategy.svg"
          alt="Code Splitting Strategy showing route-based and component-based splitting for mobile optimization"
          caption="Code splitting — route-based (load per page), component-based (lazy load heavy components); mobile gets smaller initial bundle"
          width={900}
          height={500}
        />

        <h3>Mobile-Specific Optimizations</h3>
        <p>
          <strong>Adaptive Loading:</strong> Detect device capability (via
          Network Information API, Device Memory API), serve lighter experience
          to low-end devices. Less JavaScript, lower quality images, simpler
          animations.
        </p>
        <p>
          <strong>Service Worker Caching:</strong> Cache critical resources for
          offline and repeat visits. Cache-first strategy for static assets,
          network-first for dynamic content. Reduces repeat load time
          dramatically.
        </p>
        <p>
          <strong>Main Thread Optimization:</strong> Mobile CPUs are slower than
          desktop. Minimize JavaScript execution time, break up long tasks, use
          Web Workers for heavy computation. Keep main thread free for user
          input and rendering.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/image-optimization-pipeline.svg"
          alt="Image Optimization Pipeline showing responsive images, format conversion, and lazy loading"
          caption="Image optimization — serve responsive images (srcset), modern formats (WebP/AVIF), lazy load off-screen images; images are 50%+ of page weight"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Mobile performance involves trade-offs between load time,
          functionality, and development complexity.
        </p>

        <h3>Code Splitting Strategies</h3>
        <p>
          <strong>Route-Based Splitting:</strong> One chunk per route.
          Advantages: simple, automatic with frameworks. Limitations: chunk size
          varies by route. Best for: most applications.
        </p>
        <p>
          <strong>Component-Based Splitting:</strong> Lazy load individual
          components. Advantages: fine-grained control. Limitations: more
          complex, more HTTP requests. Best for: large components (charts,
          editors).
        </p>
        <p>
          <strong>No Splitting:</strong> Single bundle. Advantages: simple, one
          request. Limitations: large initial load. Best for: small apps only.
        </p>

        <h3>Image Format Trade-offs</h3>
        <p>
          <strong>WebP:</strong> Modern format, 25-35% smaller than JPEG.
          Advantages: good compression, widely supported. Limitations: not
          supported in Safari &lt; 14. Best for: most images.
        </p>
        <p>
          <strong>AVIF:</strong> Newest format, 50% smaller than JPEG.
          Advantages: best compression. Limitations: limited support (Chrome
          85+, Firefox 93+). Best for: progressive enhancement with JPEG
          fallback.
        </p>
        <p>
          <strong>JPEG/PNG:</strong> Universal support. Advantages: works
          everywhere. Limitations: larger file sizes. Best for: fallback,
          maximum compatibility.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Set Performance Budgets:</strong> Define maximum sizes: JS
            &lt; 170KB (compressed), CSS &lt; 50KB, images &lt; 500KB per page.
            Enforce in CI/CD — fail build if exceeded. Mobile budgets should be
            stricter than desktop.
          </li>
          <li>
            <strong>Optimize Images:</strong> Use responsive images (srcset),
            modern formats (WebP), lazy loading. Compress images (TinyPNG,
            ImageOptim). Serve appropriately sized images — don&apos;t send
            desktop-sized images to mobile.
          </li>
          <li>
            <strong>Minimize JavaScript:</strong> Tree-shake unused code,
            code-split routes, lazy load non-critical components. Avoid large
            libraries when smaller alternatives exist. Measure bundle impact
            before adding dependencies.
          </li>
          <li>
            <strong>Use Critical CSS:</strong> Inline above-fold CSS, defer
            rest. Eliminates render-blocking CSS. Tools: Critical, PurgeCSS.
            Improves First Contentful Paint.
          </li>
          <li>
            <strong>Leverage Caching:</strong> Service workers for offline
            support, CDN for static assets, browser caching with long TTLs.
            Cache-first strategy for static assets.
          </li>
          <li>
            <strong>Test on Real Devices:</strong> DevTools simulation
            doesn&apos;t replicate real mobile performance. Test on low-end
            devices (not just latest iPhone). Use network throttling (3G, Slow
            3G).
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Testing Only on Desktop:</strong> Desktop performance
            doesn&apos;t predict mobile performance. Mobile has slower networks,
            slower CPUs, less memory. Test on real mobile devices.
          </li>
          <li>
            <strong>Ignoring Image Size:</strong> Images are often 50%+ of page
            weight. Sending 2MB images to mobile wastes bandwidth and time. Use
            responsive images, compression, modern formats.
          </li>
          <li>
            <strong>Too Much JavaScript:</strong> JavaScript is expensive on
            mobile — parse and execute time adds up. 500KB JS on desktop might
            take 2 seconds to parse on low-end mobile. Minimize JS, code-split.
          </li>
          <li>
            <strong>Blocking the Main Thread:</strong> Long JavaScript tasks
            block user input and rendering. Break up long tasks, use Web
            Workers, avoid synchronous XHR.
          </li>
          <li>
            <strong>No Caching Strategy:</strong> Repeat visitors download same
            resources. Use service workers, CDN, browser caching. Cache-first
            for static assets.
          </li>
          <li>
            <strong>Optimizing Only for Fast Networks:</strong> Not everyone has
            WiFi or 5G. Test on 3G, Slow 3G. Use adaptive loading for different
            network conditions.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Mobile Optimization</h3>
        <p>
          E-commerce sites optimize heavily for mobile (70%+ traffic is mobile).
          Techniques: lazy load product images, code-split checkout flow,
          critical CSS for product pages, service worker for offline browsing.
          Result: 30-50% faster load times, 10-20% higher conversion.
        </p>

        <h3>News Site Performance</h3>
        <p>
          News sites (Washington Post, Guardian) use AMP-like optimization:
          inline critical CSS, lazy load images and comments, defer
          non-critical JavaScript, CDN for global delivery. Mobile users get
          fast article loads even on slow networks.
        </p>

        <h3>Progressive Web App</h3>
        <p>
          PWAs (Twitter Lite, Pinterest) use service workers for offline
          support, app shell architecture (cache UI shell), background sync for
          actions. Mobile users get app-like performance with web flexibility.
          Twitter Lite reduced data usage by 70%, increased engagement by 65%.
        </p>

        <h3>Low-End Device Optimization</h3>
        <p>
          Facebook Lite, Google Go optimize for low-end devices (1GB RAM, slow
          CPUs). Techniques: reduced JavaScript, simpler UI, lower quality
          images, aggressive caching. Billions of users on low-end devices get
          usable experience.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you optimize a website for mobile performance?
            </p>
            <p className="mt-2 text-sm">
              A: Multi-layer approach: (1) Reduce bytes: optimize images
              (srcset, WebP), minify CSS/JS, code-split. (2) Reduce round trips:
              HTTP/2, CDN, preconnect. (3) Optimize rendering: critical CSS,
              lazy loading, avoid layout thrashing. (4) Cache: service workers,
              browser caching. (5) Test: Lighthouse, WebPageTest on 3G, real
              devices. Measure Core Web Vitals (LCP, FID, CLS).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What&apos;s a performance budget and how do you enforce it?
            </p>
            <p className="mt-2 text-sm">
              A: Performance budget sets maximum sizes: JS &lt; 170KB, CSS
              &lt; 50KB, images &lt; 500KB. Enforce in CI/CD: use
              webpack-bundle-analyzer, Lighthouse CI, or custom scripts. Fail
              build if budget exceeded. Mobile budgets should be stricter than
              desktop (mobile networks are slower). Review budget quarterly as
              app grows.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you optimize images for mobile?
            </p>
            <p className="mt-2 text-sm">
              A: Techniques: (1) Responsive images with srcset — serve
              appropriately sized images. (2) Modern formats — WebP (25-35%
              smaller), AVIF (50% smaller). (3) Lazy loading — defer off-screen
              images. (4) Compression — TinyPNG, ImageOptim. (5) CDN —
              Cloudinary, Imgix for on-the-fly optimization. Images are often
              50%+ of page weight — optimization has biggest impact.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle JavaScript performance on mobile?
            </p>
            <p className="mt-2 text-sm">
              A: Strategies: (1) Code splitting — load only code needed for
              current view. (2) Tree shaking — remove unused code. (3) Lazy
              loading — defer non-critical components. (4) Minimize main thread
              work — break up long tasks, use Web Workers. (5) Measure — Chrome
              DevTools Performance tab, identify bottlenecks. Mobile CPUs are
              slower — JS that&apos;s fine on desktop can block mobile for
              seconds. A 500KB JS bundle might parse in 200ms on desktop but
              take 2+ seconds on low-end mobile — always test on target devices.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are Core Web Vitals and why do they matter?
            </p>
            <p className="mt-2 text-sm">
              A: Core Web Vitals are Google&apos;s user-centric performance
              metrics: (1) LCP (Largest Contentful Paint) — load time, target
              &lt; 2.5s. (2) FID (First Input Delay) — interactivity, target
              &lt; 100ms. (3) CLS (Cumulative Layout Shift) — visual stability,
              target &lt; 0.1. They matter because: (1) Google uses them for
              search ranking. (2) They correlate with user experience. (3)
              They&apos;re measurable and actionable. Google&apos;s Page
              Experience update uses Core Web Vitals as ranking factor — poor
              scores can hurt search visibility and organic traffic.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you test mobile performance effectively?
            </p>
            <p className="mt-2 text-sm">
              A: Multi-layered testing: (1) Lab tools: Lighthouse, WebPageTest
              with 3G throttling. (2) Field data: Chrome UX Report, real user
              monitoring (RUM). (3) Real devices: test on low-end Android
              phones, not just latest iPhone. (4) Network conditions: test on
              3G, Slow 3G, not just WiFi. (5) Continuous monitoring: track
              performance over time, catch regressions early. Lab data shows
              potential performance, field data shows real user experience —
              both are needed for complete picture.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://web.dev/performance/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Web.dev — Performance Guides
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/web/fundamentals/performance/get-started"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google — Performance Fundamentals
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/vitals/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google — Core Web Vitals
            </a>
          </li>
          <li>
            <a
              href="https://images.guide/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Images Guide — Image Optimization
            </a>
          </li>
          <li>
            <a
              href="https://webpack.js.org/guides/code-splitting/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Webpack — Code Splitting Guide
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/2021/08/mobile-performance-optimization/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Smashing Magazine — Mobile Performance Optimization
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
