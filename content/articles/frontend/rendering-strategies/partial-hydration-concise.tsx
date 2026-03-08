"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-partial-hy-concise",
  title: "Partial Hydration",
  description: "Discover partial hydration techniques for shipping less JavaScript by hydrating only necessary components on demand.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "partial-hydration",
  version: "concise",
  wordCount: 1950,
  readingTime: 8,
  lastUpdated: "2026-03-06",
  tags: ["frontend", "rendering", "hydration", "performance", "optimization"],
};

export default function PartialHydrationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Partial Hydration</strong> is a technique that hydrates components conditionally based on specific
          triggers (visibility, user interaction, idle time, media queries) rather than hydrating everything on page
          load. Components are rendered to HTML on the server but only become interactive when their hydration
          conditions are met. This dramatically reduces JavaScript execution and improves Time to Interactive (TTI).
        </p>
        <p>
          <strong>Core Principle:</strong> Hydrate on demand, not by default. A lightweight orchestrator (2-5KB)
          monitors conditions and triggers hydration only when needed. Components users never interact with or see
          never hydrate, eliminating wasted JavaScript execution.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul>
          <li>
            <strong>Conditional Hydration:</strong> Components hydrate based on explicit conditions (visible, idle,
            interaction, media, time). Not all components hydrate—only those meeting their conditions.
          </li>
          <li>
            <strong>Hydration Orchestrator:</strong> Lightweight script (2-5KB) that scans the page for components
            with hydration markers, sets up observers (IntersectionObserver, event listeners, idle callbacks), and
            triggers hydration when conditions are satisfied.
          </li>
          <li>
            <strong>Hydration Strategies:</strong> Different triggers for different needs:
            <ul className="ml-6 mt-2 space-y-1">
              <li><strong>Visible:</strong> Hydrate when component enters viewport (IntersectionObserver)</li>
              <li><strong>Idle:</strong> Hydrate during browser idle periods (requestIdleCallback)</li>
              <li><strong>Interaction:</strong> Hydrate on first click/hover/focus</li>
              <li><strong>Media:</strong> Hydrate based on media query (mobile vs desktop)</li>
              <li><strong>Time:</strong> Hydrate after delay (setTimeout)</li>
            </ul>
          </li>
          <li>
            <strong>Lazy Component Loading:</strong> Each conditionally-hydrated component is code-split into a
            separate bundle. JavaScript downloads only when the component is about to hydrate, reducing initial
            payload by 60-80%.
          </li>
          <li>
            <strong>Granular Control:</strong> Mix strategies on the same page. Navigation hydrates immediately,
            carousel hydrates when visible, analytics hydrates during idle, modals hydrate on interaction. Flexible
            per-component configuration.
          </li>
        </ul>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Next.js-style partial hydration example
import dynamic from 'next/dynamic';

// Critical navigation - hydrate immediately
import Navigation from './Navigation';

// Carousel - hydrate when visible
const Carousel = dynamic(() => import('./Carousel'), {
  ssr: true, // Server-render HTML
  loading: () => <div>Loading carousel...</div>,
});

// Modal - hydrate on interaction (lazy load entirely)
const Modal = dynamic(() => import('./Modal'), {
  ssr: false, // Don't even render on server
  loading: null,
});

// Analytics - hydrate during idle
const Analytics = dynamic(() => import('./Analytics'), {
  ssr: true,
  loading: null,
});

export default function ProductPage() {
  return (
    <div>
      {/* Hydrates immediately - critical */}
      <Navigation />

      {/* Server-rendered, hydrates when scrolled into view */}
      <Carousel products={products} />

      <article>
        <h1>Product Details</h1>
        <p>5000 words of static content...</p>
      </article>

      {/* Not rendered on server, loads on button click */}
      <button onClick={() => setShowModal(true)}>Open Modal</button>
      {showModal && <Modal />}

      {/* Server-rendered, hydrates during idle */}
      <Analytics />
    </div>
  );
}

// With custom hooks for manual control
import { useHydrate } from './hooks/useHydrate';

function CustomComponent() {
  const { hydrated, triggerHydrate } = useHydrate({
    strategy: 'visible',
    threshold: 0.5, // 50% visible
  });

  if (!hydrated) {
    // Static HTML fallback
    return <div>Static content preview...</div>;
  }

  // Fully interactive component
  return <InteractiveComponent />;
}

// Result:
// - Navigation: 20KB, hydrates at 0ms
// - Carousel: 30KB, hydrates at 2000ms (when user scrolls)
// - Article: 0KB, never hydrates (pure HTML)
// - Modal: 15KB, hydrates at 5000ms (when user clicks)
// - Analytics: 10KB, hydrates at 3000ms (during idle)
//
// Total JS: 75KB (vs 300KB if all hydrated upfront)
// TTI: 200ms (vs 3-5s full hydration)`}</code>
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
              <td><strong>Minimal JS:</strong> 60-80% reduction, only load what{'\''}s needed</td>
              <td><strong>Complex Setup:</strong> Requires orchestrator and careful planning</td>
            </tr>
            <tr>
              <td><strong>Fast TTI:</strong> Critical components interactive in 200-500ms</td>
              <td><strong>Delayed Interactions:</strong> Slight lag when triggering deferred components</td>
            </tr>
            <tr>
              <td><strong>Flexible:</strong> Mix strategies per component (visible, idle, click)</td>
              <td><strong>Testing:</strong> More scenarios to test (all condition paths)</td>
            </tr>
            <tr>
              <td><strong>Automatic Optimization:</strong> Unused components never hydrate</td>
              <td><strong>Framework Support:</strong> Limited native support, often custom implementation</td>
            </tr>
            <tr>
              <td><strong>Better Mobile:</strong> Less JS parsing on slow devices</td>
              <td><strong>Orchestrator Overhead:</strong> 2-5KB orchestrator script needed</td>
            </tr>
            <tr>
              <td><strong>Core Web Vitals:</strong> Improves TTI, TBT, INP significantly</td>
              <td><strong>Edge Cases:</strong> Race conditions if conditions trigger simultaneously</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Ideal Use Cases:</strong></p>
        <ul>
          <li>
            <strong>Content-Heavy Sites:</strong> Blogs, news, documentation where most content is static text/images.
            Only interactive widgets (comments, search, carousels) need hydration. Saves 70-90% of JavaScript.
          </li>
          <li>
            <strong>E-Commerce Product Pages:</strong> Product descriptions and specs are static. Hydrate add-to-cart,
            size selector, image carousel only. Reviews below-the-fold hydrate when visible. Fast TTI improves
            conversions.
          </li>
          <li>
            <strong>Landing Pages:</strong> Hero and content are static. Hydrate signup forms immediately, chat widget
            during idle, analytics when idle. Achieves 95+ Lighthouse scores.
          </li>
          <li>
            <strong>Dashboard Below-the-Fold Widgets:</strong> Critical charts hydrate immediately. Below-the-fold
            widgets (activity feed, notifications) hydrate when scrolled into view. Reduces initial JS by 50%.
          </li>
        </ul>

        <p><strong>Not Ideal For:</strong></p>
        <ul>
          <li>
            <strong>Highly Interactive Apps:</strong> If {'>'} 80% of the UI is interactive (dashboards, editors,
            tools), partial hydration adds complexity without much benefit. Full hydration or SPA is simpler.
          </li>
          <li>
            <strong>Simple Pages:</strong> If the entire page is fast to hydrate (small bundle, few components),
            partial hydration{'\''}s orchestrator overhead outweighs benefits. Use traditional SSR.
          </li>
          <li>
            <strong>Real-Time Apps:</strong> Apps requiring instant interactivity everywhere (collaborative tools,
            games, live dashboards). Can{'\''}t afford hydration delays.
          </li>
        </ul>
      </section>

      <section>
        <h2>Hydration Strategies Comparison</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Strategy</th>
              <th className="text-left">When It Hydrates</th>
              <th className="text-left">Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Visible</strong></td>
              <td>When 50%+ enters viewport</td>
              <td>Below-fold carousels, image galleries, videos</td>
            </tr>
            <tr>
              <td><strong>Idle</strong></td>
              <td>During browser idle periods</td>
              <td>Analytics, chat widgets, social embeds</td>
            </tr>
            <tr>
              <td><strong>Interaction</strong></td>
              <td>On first click/hover/focus</td>
              <td>Modals, dropdowns, accordions, tooltips</td>
            </tr>
            <tr>
              <td><strong>Media</strong></td>
              <td>When media query matches</td>
              <td>Mobile-only menus, desktop-only sidebars</td>
            </tr>
            <tr>
              <td><strong>Time</strong></td>
              <td>After specified delay</td>
              <td>Low-priority features, ads, background tasks</td>
            </tr>
            <tr>
              <td><strong>Immediate</strong></td>
              <td>On page load (default)</td>
              <td>Navigation, critical forms, search bars</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul>
          <li>
            <strong>Define Clearly:</strong> "Partial Hydration conditionally hydrates components based on triggers
            (visibility, interaction, idle) rather than hydrating everything upfront. A lightweight orchestrator
            monitors conditions and triggers hydration on demand."
          </li>
          <li>
            <strong>Key Strategies:</strong> Explain visible (IntersectionObserver), idle (requestIdleCallback),
            interaction (event listeners), media (matchMedia). Each optimizes for different scenarios.
          </li>
          <li>
            <strong>Orchestrator Role:</strong> Mention the 2-5KB orchestrator that scans components, sets up
            observers, and triggers hydration. This small overhead enables large JS savings (60-80% reduction).
          </li>
          <li>
            <strong>TTI Improvement:</strong> Partial hydration achieves 200-500ms TTI for critical components (vs
            3-5s full hydration). Users can interact with important parts while less critical components hydrate in
            the background.
          </li>
          <li>
            <strong>Compare to Progressive & Selective:</strong> Progressive hydrates everything in priority order.
            Selective only hydrates interactive components (islands). Partial uses conditions for flexible,
            per-component control. It{'\''}s a hybrid approach.
          </li>
          <li>
            <strong>Trade-offs:</strong> Be clear: better performance but added complexity. Requires orchestrator,
            careful condition planning, and more testing. Slight delay when triggering deferred components. Not worth
            it for simple pages.
          </li>
          <li>
            <strong>Real Example:</strong> "E-commerce product page: product details (static HTML, 0 JS), add-to-cart
            button (immediate hydration, 15KB), image carousel (visible hydration, 25KB when scrolled), reviews
            (visible hydration, 20KB below-fold), analytics (idle hydration, 10KB during pause). Total: 70KB JS vs
            300KB full SPA."
          </li>
          <li>
            <strong>Framework Support:</strong> Mention that partial hydration isn{'\''}t built into most frameworks
            natively. Next.js dynamic imports with ssr:true come close. Astro/Fresh have client directives
            (client:visible, client:idle). Often requires custom implementation.
          </li>
          <li>
            <strong>When NOT to Use:</strong> Highly interactive apps, simple pages, or real-time apps where instant
            interactivity is critical everywhere. Interviewers value understanding limitations.
          </li>
        </ul>
      </section>

      <section>
        <h2>Key Takeaways</h2>
        <ul>
          <li>Partial Hydration = Conditional hydration based on triggers (visible, idle, interaction, media, time)</li>
          <li>Orchestrator (2-5KB) monitors conditions and triggers hydration on demand</li>
          <li>Reduces JavaScript by 60-80%; unused components never hydrate</li>
          <li>Achieves 200-500ms TTI for critical components vs 3-5s full hydration</li>
          <li>Flexible per-component strategies: mix immediate, visible, idle, interaction</li>
          <li>Best for content-heavy sites with sparse interactivity</li>
          <li>Trade-off: Better performance vs setup complexity and slight interaction delays</li>
          <li>Compare: Progressive (all eventually), Selective (islands only), Partial (conditions)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
