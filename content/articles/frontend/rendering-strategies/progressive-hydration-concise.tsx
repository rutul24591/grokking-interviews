"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-progressive-hydration-concise",
  title: "Progressive Hydration",
  description: "Quick overview of Progressive Hydration pattern for interviews and rapid learning.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "progressive-hydration",
  version: "concise",
  wordCount: 920,
  readingTime: 4,
  lastUpdated: "2026-03-05",
  tags: ["frontend", "rendering", "hydration", "SSR", "performance"],
  relatedTopics: ["server-side-rendering", "selective-hydration", "streaming-ssr"],
};

export default function ProgressiveHydrationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Progressive Hydration</strong> is an optimization technique where components hydrate in priority order
          rather than all at once. Critical above-the-fold elements (navigation, hero sections, primary CTAs) hydrate
          first (within 200-500ms), making the page quickly interactive. Less critical components (footer, off-screen
          content, analytics) hydrate later - either during idle time, when scrolled into view, or on user interaction.
        </p>
        <p>
          This solves the SSR &quot;frozen page&quot; problem where fully-rendered HTML appears interactive but clicks are
          ignored during the 3-8 second hydration period. Progressive hydration breaks this monolithic process into
          smaller chunks, enabling incremental interactivity and dramatically improving Time to Interactive (TTI).
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li>
            <strong>Priority Levels:</strong> Components assigned priorities (critical, high, normal, low, idle).
            Critical = navigation, search, hero CTAs. Low = footer, analytics, chat widgets.
          </li>
          <li>
            <strong>Visibility-Based Hydration:</strong> Use Intersection Observer to hydrate components only when
            they enter the viewport. Off-screen content stays as static HTML until scrolled to.
          </li>
          <li>
            <strong>Idle-Time Hydration:</strong> Use requestIdleCallback to hydrate low-priority components during
            browser idle periods, avoiding main thread blocking.
          </li>
          <li>
            <strong>Interaction-Based:</strong> Defer hydration until user interacts. Component becomes interactive
            on first click/hover. Works for components where slight delay is acceptable.
          </li>
          <li>
            <strong>Code Splitting:</strong> Each lazily hydrated component in separate bundle. Critical bundle stays
            small (&lt;50-70KB gzipped), rest loads on-demand.
          </li>
          <li>
            <strong>Suspense Boundaries:</strong> React 18+ Suspense enables independent hydration. Each boundary
            hydrates separately without blocking others.
          </li>
        </ul>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// React 18 Progressive Hydration
import { lazy, Suspense } from 'react';

// Critical: loads immediately
import Navigation from './Navigation';
import Hero from './Hero';

// High priority: lazy loads
const ProductGrid = lazy(() => import('./ProductGrid'));

// Low priority: lazy loads
const Footer = lazy(() => import('./Footer'));

export default function Page() {
  return (
    <>
      {/* Hydrates in ~200ms */}
      <Navigation />
      <Hero />

      {/* Hydrates in ~1s */}
      <Suspense fallback={<div>Loading...</div>}>
        <ProductGrid />
      </Suspense>

      {/* Hydrates during idle time */}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}

// Visibility-based hydration hook
function useVisibilityHydration() {
  const [shouldHydrate, setShouldHydrate] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldHydrate(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, shouldHydrate };
}

// Astro built-in progressive hydration
---
<Navigation />
<Hero />
<ProductCarousel client:visible />  <!-- Hydrates when visible -->
<Footer client:idle />              <!-- Hydrates during idle -->
<ChatWidget client:only="react" />  <!-- Client-side only -->
---`}</code>
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
                ✓ Fast TTI (200-800ms vs 3-8s)<br/>
                ✓ No frozen page state<br/>
                ✓ Smaller initial JS payload<br/>
                ✓ Better mobile performance<br/>
                ✓ Improved Core Web Vitals<br/>
                ✓ Progressive enhancement<br/>
                ✓ Lower TBT (Total Blocking Time)
              </td>
              <td className="p-3">
                ✗ More complex implementation<br/>
                ✗ Requires priority planning<br/>
                ✗ More testing needed<br/>
                ✗ Potential layout shifts<br/>
                ✗ Hydration mismatch risks<br/>
                ✗ Framework limitations<br/>
                ✗ Need error boundaries
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Perfect for:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• E-commerce sites (fast &quot;Add to Cart&quot; critical for conversion)</li>
          <li>• News/media sites (reading experience vs comments/ads)</li>
          <li>• Marketing landing pages (hero CTA vs testimonials/footer)</li>
          <li>• Documentation sites (main content vs sidebar/footer)</li>
          <li>• Content-heavy SSR apps with lots of components</li>
          <li>• Mobile-first experiences (limited CPU/network)</li>
          <li>• Apps where every 100ms in TTI matters</li>
        </ul>

        <p><strong>Avoid when:</strong></p>
        <ul className="space-y-1">
          <li>• Simple sites with few components (overhead not worth it)</li>
          <li>• All content above-the-fold needs immediate interaction</li>
          <li>• Team lacks experience with advanced hydration patterns</li>
          <li>• Pure CSR apps (no SSR, no hydration needed)</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>
            <strong>Core Trade-off:</strong> Progressive hydration trades implementation complexity for dramatically
            better TTI and user experience. Worth it for content-heavy SSR apps where interactivity speed matters.
          </li>
          <li>
            <strong>Key Difference from Full Hydration:</strong> Full hydration = 3-8s frozen page, all-or-nothing.
            Progressive = 200ms for critical elements, incremental interactivity. Explain with concrete timings.
          </li>
          <li>
            <strong>Three Hydration Strategies:</strong> Know the differences:
            <ul className="ml-6 mt-1">
              <li>• Progressive: Hydrates everything, but in priority order</li>
              <li>• Selective: Only hydrates interactive components (static stays static)</li>
              <li>• Partial: Conditional hydration (visibility, interaction, time)</li>
            </ul>
          </li>
          <li>
            <strong>React 18 Suspense:</strong> Mention that React 18 made progressive hydration much easier with
            Suspense boundaries enabling independent hydration. Each Suspense boundary is a hydration unit.
          </li>
          <li>
            <strong>Priority Criteria:</strong> Critical = user intent (nav, search, primary CTA). High = visible
            interactive content. Low = analytics, footer, chat. Base on analytics data, not assumptions.
          </li>
          <li>
            <strong>Real-World Impact:</strong> Reference Shopify Hydrogen case study: 40% faster TTI, 2.3% conversion
            increase. Every 100ms delay in interactivity costs ~1% conversion in e-commerce.
          </li>
          <li>
            <strong>Implementation Tools:</strong> Mention requestIdleCallback, Intersection Observer, React.lazy(),
            Next.js dynamic(), Astro client:visible/idle/only directives, Qwik&apos;s automatic approach.
          </li>
          <li>
            <strong>Common Pitfall:</strong> Over-prioritizing too many components defeats the purpose. Be ruthless -
            only navigation and hero CTA should be critical. Everything else can wait.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does progressive hydration improve Time to Interactive?</p>
            <p className="mt-2 text-sm">
              A: Instead of hydrating the entire page at once (3-8s), progressive hydration breaks it into priority
              chunks. Critical elements (nav, hero CTA) hydrate first in 200-500ms, making the page immediately
              interactive. Less critical components hydrate later during idle time or when visible. This eliminates
              the &quot;frozen page&quot; problem where users click but nothing happens.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you decide component priority levels?</p>
            <p className="mt-2 text-sm">
              A: Use analytics and user intent. Critical = components users interact with first (navigation, search,
              primary CTA). High = visible interactive content (product grids, videos). Normal = below-fold interactive
              content. Low = analytics, chat widgets, footer. Avoid assumptions - use real user behavior data to
              inform priorities.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between progressive, selective, and partial hydration?</p>
            <p className="mt-2 text-sm">
              A: Progressive hydrates everything eventually, just in priority order. Selective only hydrates
              interactive components - static content never hydrates. Partial is similar to progressive but with
              more granular control - hydrates based on specific conditions (visibility, interaction, time). All
              three solve the same problem (slow hydration) with different approaches.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
