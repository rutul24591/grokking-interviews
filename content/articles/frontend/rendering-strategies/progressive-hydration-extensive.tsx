"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-progressive-hydration-extensive",
  title: "Progressive Hydration",
  description: "Comprehensive guide to Progressive Hydration covering concepts, implementation strategies, and best practices for optimizing hydration performance.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "progressive-hydration",
  version: "extensive",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-05",
  tags: ["frontend", "rendering", "hydration", "SSR", "performance"],
  relatedTopics: ["server-side-rendering", "selective-hydration", "streaming-ssr"],
};

export default function ProgressiveHydrationExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Progressive Hydration</strong> is an optimization technique for server-side rendered (SSR) applications
          that hydrates components in a prioritized order rather than all at once. Instead of blocking the main thread
          to hydrate the entire page immediately, progressive hydration hydrates critical above-the-fold content first,
          then incrementally hydrates remaining components based on priority, viewport visibility, or user interaction.
        </p>
        <p>
          This approach emerged as a solution to the &quot;hydration problem&quot; in SSR applications. Traditional SSR sends
          fully-rendered HTML to the browser, providing fast First Contentful Paint (FCP), but then requires downloading
          and executing JavaScript to &quot;hydrate&quot; the static HTML into an interactive application. During this hydration
          period (often 3-8 seconds on mobile), the page appears interactive but is actually frozen - clicks and
          interactions are ignored or queued, creating a frustrating user experience.
        </p>
        <p>
          Progressive hydration addresses this by breaking the monolithic hydration process into smaller, prioritized
          chunks. Critical interactive elements (navigation, forms, buttons above-the-fold) hydrate first, making the
          page partially interactive within milliseconds. Less critical components (footer, off-screen content,
          analytics widgets) hydrate later, either on-demand when scrolled into view or during idle time using
          <code className="mx-1 rounded bg-slate-700 px-1.5 py-0.5 text-sm">requestIdleCallback</code>.
        </p>
        <p>
          This technique is particularly valuable for content-heavy sites, e-commerce platforms, and news sites where
          fast Time to Interactive (TTI) is crucial for user engagement and conversion rates. Companies like Airbnb,
          Shopify, and The Guardian have reported significant improvements in TTI and user engagement after implementing
          progressive hydration strategies.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>Understanding progressive hydration requires grasping several key concepts:</p>
        <ul>
          <li>
            <strong>Hydration Priority Levels:</strong> Components are assigned priority levels (critical, high, normal,
            low, idle) based on their importance to user experience. Critical components include navigation, hero sections,
            and forms. Low-priority components include analytics, chat widgets, and footer content.
          </li>
          <li>
            <strong>Visibility-Based Hydration:</strong> Using Intersection Observer API to detect when components enter
            the viewport. Components outside the visible area remain as static HTML until scrolled into view, reducing
            initial JavaScript execution time.
          </li>
          <li>
            <strong>Interaction-Based Hydration:</strong> Deferring hydration until user interaction. A static button
            or form remains non-interactive until clicked, at which point it hydrates instantly. This works for
            components where slight delay is acceptable.
          </li>
          <li>
            <strong>Idle-Time Hydration:</strong> Leveraging browser idle periods using
            <code className="mx-1 rounded bg-slate-700 px-1.5 py-0.5 text-sm">requestIdleCallback</code> to hydrate
            low-priority components without blocking the main thread during critical rendering.
          </li>
          <li>
            <strong>Code Splitting Integration:</strong> Progressive hydration works hand-in-hand with code splitting.
            Each component&apos;s hydration code is split into separate bundles, loaded on-demand when needed, reducing
            initial JavaScript payload.
          </li>
          <li>
            <strong>Suspense Boundaries:</strong> In React 18+, Suspense boundaries enable progressive hydration by
            allowing independent hydration of component trees. Each Suspense boundary can hydrate separately without
            blocking others.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>Progressive hydration follows a multi-stage process:</p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Progressive Hydration Flow</h3>
          <ol className="space-y-3">
            <li><strong>1. Server-Side Rendering:</strong> Server renders full HTML with all components</li>
            <li><strong>2. HTML Streaming:</strong> Browser receives and displays HTML immediately (fast FCP)</li>
            <li><strong>3. JavaScript Download:</strong> Critical JS bundles download in parallel</li>
            <li><strong>4. Critical Hydration (0-500ms):</strong> Hydrate above-the-fold interactive elements
              <ul className="ml-6 mt-2 space-y-1">
                <li>• Navigation menus</li>
                <li>• Primary CTA buttons</li>
                <li>• Search bars</li>
                <li>• Critical forms</li>
              </ul>
            </li>
            <li><strong>5. High-Priority Hydration (500ms-2s):</strong> Hydrate important visible components
              <ul className="ml-6 mt-2 space-y-1">
                <li>• Hero sections with interactions</li>
                <li>• Product carousels</li>
                <li>• Video players</li>
              </ul>
            </li>
            <li><strong>6. Visibility-Based Hydration (on-demand):</strong> Hydrate components as they enter viewport</li>
            <li><strong>7. Idle-Time Hydration (during idle):</strong> Hydrate low-priority components
              <ul className="ml-6 mt-2 space-y-1">
                <li>• Footer content</li>
                <li>• Analytics scripts</li>
                <li>• Chat widgets</li>
                <li>• Social media embeds</li>
              </ul>
            </li>
            <li><strong>8. Interaction-Based Hydration (on-demand):</strong> Hydrate components when user interacts</li>
          </ol>
        </div>

        <p>
          This staged approach ensures users can interact with critical parts of the page within milliseconds while
          deferring expensive hydration of less important components. The key is determining the right priority for
          each component based on user behavior data and business goals.
        </p>

        <ArticleImage
          src="/diagrams/frontend/rendering-strategies/progressive-hydration-timeline.svg"
          alt="Progressive Hydration Timeline"
          caption="Progressive Hydration Timeline - Components hydrate in priority order, enabling early interactivity for critical elements"
        />

        <ArticleImage
          src="/diagrams/frontend/rendering-strategies/progressive-hydration-priorities.svg"
          alt="Progressive Hydration Priority Levels"
          caption="Progressive Hydration Priority Levels - Different strategies for different component types"
        />
      </section>

      <section>
        <h2>Implementation Examples</h2>
        <p>Here&apos;s how to implement progressive hydration across different frameworks:</p>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold">React 18 with Suspense (Recommended)</h3>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
              <code>{`// Progressive hydration with React 18 Suspense
import { lazy, Suspense } from 'react';

// Critical components load immediately
import Navigation from './Navigation';
import HeroSection from './HeroSection';

// High-priority components lazy load
const ProductCarousel = lazy(() => import('./ProductCarousel'));
const VideoPlayer = lazy(() => import('./VideoPlayer'));

// Low-priority components lazy load
const Footer = lazy(() => import('./Footer'));
const ChatWidget = lazy(() => import('./ChatWidget'));

export default function HomePage() {
  return (
    <>
      {/* Critical: Hydrates immediately */}
      <Navigation />
      <HeroSection />

      {/* High priority: Hydrates with Suspense */}
      <Suspense fallback={<div>Loading...</div>}>
        <ProductCarousel />
      </Suspense>

      <Suspense fallback={<div>Loading video...</div>}>
        <VideoPlayer />
      </Suspense>

      {/* Low priority: Hydrates during idle time */}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
    </>
  );
}`}</code>
            </pre>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Custom Visibility-Based Hydration Hook</h3>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
              <code>{`// useVisibilityHydration.ts
import { useEffect, useState, useRef } from 'react';

export function useVisibilityHydration() {
  const [shouldHydrate, setShouldHydrate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldHydrate(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before visible
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, shouldHydrate };
}

// Usage in component
function LazySection({ children }) {
  const { ref, shouldHydrate } = useVisibilityHydration();

  return (
    <div ref={ref}>
      {shouldHydrate ? children : <div>Loading...</div>}
    </div>
  );
}

// Use in page
export default function Page() {
  return (
    <>
      <Navigation />
      <HeroSection />

      <LazySection>
        <ExpensiveComponent />
      </LazySection>
    </>
  );
}`}</code>
            </pre>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Idle-Time Hydration with requestIdleCallback</h3>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
              <code>{`// useIdleHydration.ts
import { useEffect, useState } from 'react';

export function useIdleHydration(timeout = 2000) {
  const [shouldHydrate, setShouldHydrate] = useState(false);

  useEffect(() => {
    const requestIdleCallback =
      window.requestIdleCallback ||
      ((cb) => setTimeout(cb, 1));

    const handle = requestIdleCallback(
      () => setShouldHydrate(true),
      { timeout }
    );

    return () => {
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(handle);
      } else {
        clearTimeout(handle);
      }
    };
  }, [timeout]);

  return shouldHydrate;
}

// Usage
function FooterSection() {
  const shouldHydrate = useIdleHydration();

  if (!shouldHydrate) {
    return <div dangerouslySetInnerHTML={{ __html: serverHTML }} />;
  }

  return <Footer />; // Fully interactive
}`}</code>
            </pre>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Next.js with Progressive Hydration</h3>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
              <code>{`// pages/index.tsx
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Critical components
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';

// Progressive loading with dynamic imports
const ProductGrid = dynamic(() => import('@/components/ProductGrid'), {
  loading: () => <div>Loading products...</div>,
  ssr: true, // Server-render but hydrate progressively
});

const Reviews = dynamic(() => import('@/components/Reviews'), {
  loading: () => null,
  ssr: true,
  // Hydrate during idle time
  suspense: true,
});

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: true,
  // Lowest priority
  suspense: true,
});

export default function HomePage() {
  return (
    <>
      <Navigation />
      <Hero />

      <Suspense fallback={<div>Loading...</div>}>
        <ProductGrid />
      </Suspense>

      <Suspense fallback={null}>
        <Reviews />
      </Suspense>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}`}</code>
            </pre>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Astro Islands (Built-in Progressive Hydration)</h3>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
              <code>{`---
// src/pages/index.astro
import Navigation from '../components/Navigation.astro';
import Hero from '../components/Hero.astro';
import ProductCarousel from '../components/ProductCarousel.tsx';
import Footer from '../components/Footer.astro';
---

<html>
  <body>
    <!-- Static, no hydration needed -->
    <Navigation />

    <!-- Static, no hydration -->
    <Hero />

    <!-- Hydrate when visible -->
    <ProductCarousel client:visible />

    <!-- Hydrate during idle time -->
    <Footer client:idle />

    <!-- Hydrate on interaction -->
    <ChatWidget client:only="react" />
  </body>
</html>`}</code>
            </pre>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Qwik (Automatic Progressive Hydration)</h3>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
              <code>{`// Qwik automatically does progressive hydration
import { component$, useSignal } from '@builder.io/qwik';

export default component$(() => {
  const count = useSignal(0);

  return (
    <>
      <header>
        <nav>Navigation</nav>
      </header>

      <main>
        {/* Only hydrates when button is clicked */}
        <button onClick$={() => count.value++}>
          Count: {count.value}
        </button>

        {/* Hydrates when visible */}
        <ProductGrid />
      </main>

      {/* Never hydrates unless interacted with */}
      <footer>Footer content</footer>
    </>
  );
});`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Progressive Hydration</th>
              <th className="p-3 text-left">Full Hydration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Time to Interactive</strong></td>
              <td className="p-3">
                Fast (200-800ms for critical content)<br/>
                Incremental interactivity
              </td>
              <td className="p-3">
                Slow (3-8s for full page)<br/>
                All-or-nothing interactivity
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Initial JS Payload</strong></td>
              <td className="p-3">
                Small (only critical code)<br/>
                Rest loads on-demand
              </td>
              <td className="p-3">
                Large (entire app bundle)<br/>
                Everything loads upfront
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>User Experience</strong></td>
              <td className="p-3">
                Feels fast and responsive<br/>
                No frozen state<br/>
                Progressive enhancement
              </td>
              <td className="p-3">
                Frozen during hydration<br/>
                Clicks ignored<br/>
                Frustrating delay
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Complexity</strong></td>
              <td className="p-3">
                Higher (priority management)<br/>
                Requires careful planning<br/>
                More testing needed
              </td>
              <td className="p-3">
                Simple (hydrate everything)<br/>
                Straightforward<br/>
                Easy to implement
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Core Web Vitals</strong></td>
              <td className="p-3">
                Excellent FCP, LCP, TTI<br/>
                Low TBT (Total Blocking Time)<br/>
                Good INP (Interaction Next Paint)
              </td>
              <td className="p-3">
                Good FCP (with SSR)<br/>
                Poor TTI<br/>
                High TBT
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Mobile Performance</strong></td>
              <td className="p-3">
                Significantly better<br/>
                Reduced CPU usage<br/>
                Better battery life
              </td>
              <td className="p-3">
                Poor on low-end devices<br/>
                Heavy CPU load<br/>
                Battery drain
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/frontend/rendering-strategies/progressive-vs-traditional-hydration.svg"
          alt="Progressive vs Traditional SSR Hydration Comparison"
          caption="Progressive vs Traditional Hydration - Progressive hydration enables early interactivity while traditional SSR blocks until complete"
        />

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">Progressive vs Selective vs Partial Hydration</h3>
          <ul className="space-y-2">
            <li>
              <strong>Progressive:</strong> Hydrates everything eventually, but in priority order. All components
              become interactive, just not all at once.
            </li>
            <li>
              <strong>Selective:</strong> Only hydrates interactive components. Static content never hydrates, staying
              as HTML forever.
            </li>
            <li>
              <strong>Partial:</strong> Hydrates based on conditions (visibility, interaction, time). Similar to
              progressive but more granular control.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Prioritize Based on User Intent:</strong> Analyze user behavior to determine which components users
            interact with first. Navigation, search, and primary CTAs should always be critical priority. Use analytics
            to inform priority decisions.
          </li>
          <li>
            <strong>Use Suspense Boundaries Strategically:</strong> In React 18+, wrap each priority level in separate
            Suspense boundaries. This enables independent hydration and prevents one slow component from blocking others.
          </li>
          <li>
            <strong>Implement Intersection Observer:</strong> For below-the-fold content, use Intersection Observer with
            appropriate rootMargin (50-100px) to start hydrating just before components become visible. Disconnect
            observers after hydration to prevent memory leaks.
          </li>
          <li>
            <strong>Leverage requestIdleCallback:</strong> For low-priority components (analytics, chat widgets),
            hydrate during browser idle time. Set reasonable timeout (2-3s) as fallback since requestIdleCallback
            isn&apos;t supported everywhere.
          </li>
          <li>
            <strong>Code Split Aggressively:</strong> Each lazily hydrated component should be in its own bundle.
            Use dynamic imports with React.lazy() or Next.js dynamic(). Keep critical bundle under 50-70KB gzipped.
          </li>
          <li>
            <strong>Provide Meaningful Fallbacks:</strong> While components hydrate, show skeleton screens or
            lightweight placeholders. Avoid jarring content shifts by reserving space with min-height.
          </li>
          <li>
            <strong>Test on Real Devices:</strong> Progressive hydration benefits are most visible on low-end mobile
            devices. Test on actual hardware, not just Chrome DevTools throttling. Aim for &lt;1s TTI on mid-range
            Android (Moto G4/G5).
          </li>
          <li>
            <strong>Monitor Performance Metrics:</strong> Track TTI, TBT (Total Blocking Time), and INP (Interaction
            to Next Paint) with Real User Monitoring (RUM). Set performance budgets for each priority level.
          </li>
          <li>
            <strong>Handle Hydration Errors Gracefully:</strong> Wrap hydration logic in error boundaries. If
            hydration fails, fall back to static HTML. Log errors to monitoring service for debugging.
          </li>
          <li>
            <strong>Document Priority Levels:</strong> Maintain clear documentation of which components belong to
            which priority tier and why. This helps team members make consistent decisions when adding new features.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Over-Prioritizing Everything:</strong> Marking too many components as &quot;critical&quot; defeats the purpose.
            Be ruthless - only navigation, hero section, and primary CTAs should be critical. Everything else can wait.
          </li>
          <li>
            <strong>Ignoring Hydration Mismatches:</strong> Server HTML must exactly match client-rendered output,
            or React will throw hydration errors and re-render everything (killing performance). Avoid randomness,
            timestamps, or client-only logic in SSR code.
          </li>
          <li>
            <strong>Not Testing Edge Cases:</strong> What happens if a component fails to hydrate? What if JavaScript
            is disabled? Ensure graceful degradation and error handling for all scenarios.
          </li>
          <li>
            <strong>Forgetting Mobile Performance:</strong> Progressive hydration is critical for mobile, where
            JavaScript execution is 5-10x slower than desktop. Test on real low-end devices, not just throttled Chrome.
          </li>
          <li>
            <strong>Neglecting Intersection Observer Cleanup:</strong> Failing to disconnect observers after hydration
            creates memory leaks. Always cleanup in useEffect return or componentWillUnmount.
          </li>
          <li>
            <strong>Loading Too Much Too Soon:</strong> Starting to load a component when it&apos;s 50% visible is too late.
            Use generous rootMargin (100-200px) to start loading before user scrolls to it.
          </li>
          <li>
            <strong>Blocking Critical Hydration:</strong> Ensure critical components don&apos;t have heavy dependencies.
            If your Navigation imports a 200KB library, that blocks TTI. Lazy load dependencies too.
          </li>
          <li>
            <strong>Poor Error Handling:</strong> If a low-priority component fails to load, don&apos;t let it crash the
            app. Use error boundaries and retry logic with exponential backoff.
          </li>
          <li>
            <strong>Inconsistent Hydration Strategy:</strong> Mixing full hydration in some pages and progressive in
            others creates inconsistent user experience. Establish app-wide patterns.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>Progressive hydration excels in these scenarios:</p>

        <ul className="space-y-3">
          <li>
            <strong>E-commerce Product Pages:</strong> Shopify, Amazon, and Etsy use progressive hydration to make
            &quot;Add to Cart&quot; buttons interactive within 500ms while deferring reviews, recommendations, and footer
            hydration. This directly improves conversion rates - every 100ms delay in interactivity costs 1% conversion.
          </li>
          <li>
            <strong>News & Media Sites:</strong> The Guardian, NYTimes, and Washington Post progressively hydrate
            article pages. The reading experience (scrolling, text selection) works immediately while comments,
            related articles, and ads hydrate later. This reduces bounce rate from frustrated users.
          </li>
          <li>
            <strong>Social Media Feeds:</strong> Twitter and Facebook hydrate visible posts first, then progressively
            hydrate off-screen content as users scroll. Infinite scroll triggers hydration of new posts on-demand.
          </li>
          <li>
            <strong>SaaS Dashboards:</strong> Notion, Linear, and Airtable hydrate critical navigation and primary
            views first, then lazy load heavy components (charts, editors, sidebars) as needed. This makes apps feel
            instant even with complex functionality.
          </li>
          <li>
            <strong>Documentation Sites:</strong> Next.js docs, React docs, and MDN progressively hydrate the main
            content area first, then sidebar navigation, then footer. Search is prioritized since it&apos;s heavily used.
          </li>
          <li>
            <strong>Marketing Landing Pages:</strong> High-conversion landing pages use progressive hydration to make
            hero CTAs interactive within 200-300ms while deferring testimonials, feature grids, and analytics scripts.
          </li>
          <li>
            <strong>Booking Platforms:</strong> Airbnb, Booking.com hydrate search filters and date pickers first
            (critical for user intent), then progressively hydrate listings, maps, and recommendations.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">Case Study: Shopify Hydrogen</h3>
          <p>
            Shopify&apos;s Hydrogen framework uses progressive hydration by default. Product pages hydrate the buy button
            and image gallery first (critical for conversion), then defer variant selector, reviews, and recommendations.
            This resulted in:
          </p>
          <ul className="mt-2 space-y-1">
            <li>• 40% faster Time to Interactive</li>
            <li>• 60% reduction in Total Blocking Time</li>
            <li>• 2.3% increase in conversion rate</li>
            <li>• 15% reduction in bounce rate</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://web.dev/progressive-hydration/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Progressive Hydration - web.dev
            </a>
          </li>
          <li>
            <a href="https://react.dev/reference/react/Suspense" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React 18 Suspense Documentation
            </a>
          </li>
          <li>
            <a href="https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Next.js Lazy Loading & Code Splitting
            </a>
          </li>
          <li>
            <a href="https://docs.astro.build/en/concepts/islands/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Astro Islands Architecture
            </a>
          </li>
          <li>
            <a href="https://qwik.builder.io/docs/concepts/resumable/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Qwik Resumability & Progressive Hydration
            </a>
          </li>
          <li>
            <a href="https://www.patterns.dev/posts/progressive-hydration" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              patterns.dev - Progressive Hydration Pattern
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
