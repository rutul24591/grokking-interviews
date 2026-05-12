"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-progressive-hydration-system",
  title: "Design a Progressive Hydration System",
  description:
    "Architecture for progressive hydration: SSR-rendered HTML is sent immediately for fast FCP, then JavaScript hydrates components incrementally by priority — above-the-fold critical components first (synchronous hydration on main thread), interactive components on interaction (event-triggered hydration), non-critical components on idle (requestIdleCallback hydration), and below-fold components when visible (IntersectionObserver hydration). Eliminates the monolithic TTI cliff of full-bundle hydration.",
  category: "high-level-design",
  subcategory: "performance-scale-edge-cases",
  slug: "progressive-hydration-system",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-12",
  tags: ["hld", "progressive-hydration", "ssr", "islands-architecture", "ttI", "fcp", "react-18", "suspense"],
  relatedTopics: ["low-end-device-frontend", "high-latency-network-optimized-ui"],
};

export default function ProgressiveHydrationSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Full-bundle hydration is the standard Next.js/React behavior: the server renders the entire page to HTML (excellent for FCP), sends the full JS bundle to the client, and then React traverses the entire component tree to "hydrate" it — attaching event listeners and initializing state. On a low-end device with a 1MB JS bundle, this hydration phase can block the main thread for 5–10 seconds. During this window, the page looks interactive (the HTML is visible) but is not — clicks on buttons do nothing because the event listeners are not yet attached. This creates a frustrating UX where the Time-to-Interactive (TTI) lags far behind the First Contentful Paint (FCP).</p>
        <p>Progressive hydration solves this by prioritizing which components hydrate first. If the user is looking at the hero section, hydrate that first. If a dropdown is below the fold, delay its hydration until the user scrolls to it. If a chatbot widget is non-critical, hydrate it only when the browser is idle. This approach closes the FCP-to-TTI gap by ensuring that the most important interactive components are hydrated first, making the page feel interactive quickly even when the total hydration cost is high.</p>
        <p><strong>Explicit scope:</strong> Hydration prioritization strategies, island-based hydration, React 18 Suspense-based streaming hydration, and trigger-based hydration patterns. Not in scope: server-side streaming implementation details, RSC (React Server Components) architecture, or framework-specific bundler configuration.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Immediate FCP:</strong> The server-rendered HTML must be sent to the browser before any JavaScript executes. The user sees real content within 1–2 seconds on a 3G connection, regardless of JS bundle size. The HTML is complete and readable — not a loading spinner waiting for JS.</li>
          <li><strong>Priority-ordered hydration:</strong> Components hydrate in a defined priority order: (1) Critical interactive components above the fold (navigation, hero CTA button, search bar) hydrate first, synchronously; (2) User-triggered components (dropdowns, modals, tooltips) hydrate when the user first interacts with them (click, hover, focus); (3) Non-critical components (chatbot, social share buttons, comments section) hydrate on requestIdleCallback; (4) Below-fold components hydrate when they enter the viewport via IntersectionObserver.</li>
          <li><strong>No interactivity cliff:</strong> The time from FCP to the first interactive element (navigation, primary CTA) must be under 1 second. Even if total hydration takes 10 seconds, the user can interact with critical elements immediately after FCP.</li>
          <li><strong>Graceful degradation for slow JS:</strong> If JS has not hydrated a component when the user tries to interact with it, the system must handle this gracefully: show a brief loading indicator, queue the interaction to replay once hydrated, or use the SSR form submission fallback (for forms).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>TTI improvement:</strong> Progressive hydration must reduce TTI (as measured by Lighthouse) by at least 40% compared to full-bundle synchronous hydration on a Moto G4 device. This is the primary metric — FCP is already good with SSR; TTI improvement is the goal.</li>
          <li><strong>Hydration ordering predictability:</strong> The hydration order must be deterministic and controllable by developers. Engineers must be able to explicitly set component hydration priority without guessing framework internals. A HydrationPriority enum (Critical, Interactive, Idle, Visible) provides this control.</li>
          <li><strong>No hydration mismatch:</strong> The client-side hydration must produce identical DOM to the server-rendered HTML. Hydration mismatches (where React throws away server HTML and re-renders) eliminate the FCP benefit and are treated as critical bugs. All data-dependent rendering must use the same data on server and client.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The architecture builds on React 18's concurrent rendering capabilities. The server streams HTML using React 18's renderToPipeableStream — the HTML head and above-fold content are sent first (within the first chunk), with Suspense boundaries around below-fold sections. The client receives the initial HTML and begins rendering (FCP). The JS bundle is split by hydration priority: the critical bundle (contains code for Critical-priority components only, ~20KB) is loaded eagerly; lower-priority component code is loaded lazily when triggered. React 18's hydrateRoot with concurrent mode allows interrupting hydration for user input — if the user clicks during hydration, React pauses the hydration work, processes the click event, and resumes hydration. This ensures clicks are never silently dropped during the hydration phase.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/performance-scale-edge-cases/progressive-hydration-system.svg"
          alt="Progressive hydration system: server streaming SSR (React 18 renderToPipeableStream; first chunk: HTML head + above-fold HTML; Suspense fallback for below-fold; streamed incrementally — browser can paint before JS loads), critical hydration (hydrateRoot starts immediately on bundle load; priority 1: nav + hero CTA + search bar; synchronous hydration — main thread; bundle size: ~20KB critical chunk only), interaction-triggered hydration (user hovers/clicks component not yet hydrated; event listener at document level captures event; dynamic import() loads component chunk; hydrate that subtree; replay queued interaction), idle hydration (requestIdleCallback: hydrate P3 components when idle; deadline.timeRemaining() check — yield if &lt;5ms; chatbot, social share, newsletter widget), visibility hydration (IntersectionObserver threshold=0.1 on each P4 component container; when visible: load chunk + hydrate; comments section, related articles, footer widgets), React 18 concurrent (hydrateRoot with concurrent mode; user click during hydration: React yields, processes event, resumes; Suspense boundaries: selective hydration — partially hydrated tree still interactive at hydrated parts)."
          caption="Server streaming SSR (first chunk above-fold HTML, Suspense below-fold), critical bundle hydration (&lt;20KB, nav+hero+search first), interaction-triggered hydration (document event capture → dynamic import → subtree hydrate → replay), idle hydration (requestIdleCallback + timeRemaining check), visibility hydration (IntersectionObserver 0.1 threshold), React 18 concurrent hydrateRoot (yields for user input during hydration)"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Hydration Priority Implementation</h3>
        <p>A HydrationBoundary component wraps each island with its priority configuration. The component uses a custom hook (useHydration) that determines when to trigger hydration based on the priority prop. For Critical priority, hydration is triggered immediately via hydrateRoot when the component mounts on the client. For Interactive priority, a global event capture listener (document.addEventListener("click", handleInteraction, &#123; capture: true &#125;)) intercepts the first event targeting the component's DOM container — the event is prevented, the component's JS chunk is dynamically imported, the subtree is hydrated, and the event is replayed. For Idle priority, a requestIdleCallback queue processes components in order of their registration; each iteration checks deadline.timeRemaining() and yields if less than 5ms remain (preventing janky long tasks). For Visible priority, an IntersectionObserver with threshold=0.1 triggers hydration when 10% of the component's container enters the viewport.</p>
        <p>The server adds data-hydration-priority="critical|interactive|idle|visible" attributes to the SSR-rendered HTML containers. The client-side bootstrap script reads these attributes and registers each container with the appropriate hydration queue before the React bundles load. This ensures that even if the JS takes 5 seconds to arrive, the hydration orchestration code is already set up from the tiny bootstrap script (2KB, inline in HTML).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">React 18 Streaming and Selective Hydration</h3>
        <p>React 18's renderToPipeableStream enables streaming SSR: the server starts sending HTML before the full component tree is rendered. Suspense boundaries define natural split points — when the server hits a Suspense boundary around a slow-loading component (e.g., one that requires a database query), it sends the Suspense fallback HTML (skeleton) immediately and continues rendering other parts of the page. When the slow component resolves, its HTML is streamed as a subsequent chunk with an inline script tag that tells React where to inject it in the DOM. The browser handles this injection without a page reload.</p>
        <p>Selective hydration (a React 18 feature) allows React to hydrate whichever Suspense boundary the user interacts with first, even if it has not yet hydrated in order. If the user clicks a button in the "below-fold" section before the "above-fold" section has finished hydrating, React prioritizes hydrating the clicked section first. This is automatic when using hydrateRoot with React 18 — no configuration required. The result: user interactions are never silently dropped, even in partially hydrated pages.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Islands Architecture</h3>
        <p>The Islands Architecture is a specific progressive hydration pattern where most of the page is static HTML (server-rendered, never hydrated) and only specific "islands" of interactivity are hydrated as React components. For a content-heavy page (news article, product detail), the article body, breadcrumb, and static header are never hydrated — they are served as plain HTML. Only the interactive elements (comments section, share widget, related products carousel, add-to-cart button) are islands that hydrate. This reduces the total JavaScript that executes on the page, since un-hydrated components never load their JS. Astro, Qwik, and Fresh implement this pattern natively; in Next.js, it is achieved by using Server Components for static content (RSC, which never hydrate) and Client Components only for interactive islands.</p>
        <p>The trade-off: islands cannot share React state with each other directly (they are separate React roots). Cross-island communication requires a non-React mechanism: a global event bus (CustomEvent dispatch/listen), a shared Zustand store (loaded by both islands), or URL state (sharing data through query parameters). For simple cases (a counter that two components read), URL state is the cleanest. For complex shared state (cart contents shared across header badge and product page), a small global Zustand store is appropriate.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Handling Interaction Before Hydration</h3>
        <p>The hardest UX problem in progressive hydration: the user clicks a button before it is hydrated. The button looks clickable (it is rendered HTML), but the React event handler is not attached yet. Solutions: (1) Replay strategy — the event capture listener queues the event, hydrates the component, then dispatches the same event on the now-hydrated component. Works for simple clicks. Fails for complex events with side effects (file drops, form submissions with validation). (2) Optimistic HTML form fallback — for critical actions (add to cart, submit form), the SSR-rendered HTML uses a real HTML form with a POST action. Without JavaScript, the form submits via full page reload to the server (classic HTML form behavior). With JavaScript, the form's submit handler is replaced by React's event handler after hydration. This means the action always works, before and after hydration. (3) Pending indicator — show a subtle loading indicator on components that are not yet hydrated when the user hovers over them (CSS :hover on [data-hydration-pending] attribute). This signals to the user that the component is loading, preventing confusion when clicks are slightly delayed.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Progressive hydration complexity vs. benefit: implementing the full hydration priority system with event queuing and replay adds significant complexity compared to standard Next.js hydration. The benefit is only tangible on pages with large JS bundles (&gt;200KB) and significant below-fold content. For simple pages (login form, settings page), progressive hydration adds complexity without meaningful TTI improvement. The decision should be data-driven: measure TTI on key pages with a simulated Moto G4 device before adding progressive hydration complexity.</p>
        <p>Hydration mismatch prevention: any data that differs between server and client renders (random numbers, Date.now(), window dimensions, user locale) will cause a hydration mismatch. Solutions: suppress hydration for known-mismatch components (suppressHydrationWarning prop), ensure server and client use the same data source (pass data as JSON in the initial HTML rather than re-fetching on the client), and use React 18's useId() for deterministic IDs (replaces the common pattern of Math.random() for unique IDs that caused mismatches). Hydration mismatches are logged as React warnings in development — they must be treated as P1 bugs, not ignored.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A progressive hydration system reduces TTI without sacrificing FCP by hydrating components in priority order: (1) Critical (nav + hero CTA + search bar, synchronous hydration, ~20KB critical bundle); (2) Interactive (event-triggered via document capture listener → dynamic import → subtree hydrate → event replay); (3) Idle (requestIdleCallback queue with deadline.timeRemaining() yield guard); (4) Visible (IntersectionObserver 0.1 threshold → chunk load + hydrate). React 18's streaming SSR (renderToPipeableStream + Suspense) enables above-fold HTML delivery before below-fold DB queries complete, and selective hydration prioritizes user-clicked sections. The Islands Architecture (RSC for static, Client Components only for interactive islands) eliminates JS for never-interactive content. Pre-hydration interaction is handled via HTML form fallbacks for critical actions and event replay for simple clicks. The core principle: every millisecond of main-thread JS work should earn its place — hydration that the user cannot yet see or interact with is wasted time.</p>
      </section>
    </ArticleLayout>
  );
}
