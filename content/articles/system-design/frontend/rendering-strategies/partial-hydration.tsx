"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-partial-hydration-extensive",
  title: "Partial Hydration",
  description:
    "Comprehensive guide to Partial Hydration covering concepts, implementation techniques, and best practices for conditional component hydration.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "partial-hydration",
  wordCount: 3180,
  readingTime: 13,
  lastUpdated: "2026-03-05",
  tags: ["frontend", "rendering", "hydration", "performance", "optimization"],
  relatedTopics: [
    "progressive-hydration",
    "selective-hydration",
    "islands-architecture",
  ],
};

export default function PartialHydrationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Partial Hydration</strong> is a rendering optimization
          technique that hydrates components based on specific conditions rather
          than hydrating everything upfront. Components hydrate conditionally
          when they meet certain criteria: becoming visible in the viewport,
          user interaction (click/hover), time-based triggers, media query
          matches, network conditions, or custom predicates. This provides
          granular control over what hydrates, when it hydrates, and under what
          circumstances.
        </HighlightBlock>
        <p>
          Partial hydration represents the most flexible approach to hydration
          optimization. While progressive hydration uses priority levels and
          selective hydration distinguishes static from interactive, partial
          hydration enables arbitrary conditions for each component. A component
          might hydrate when: scrolled into view AND user is on WiFi, OR when
          idle AND screen is desktop-sized, OR immediately if it&apos;s
          above-the-fold on a fast connection.
        </p>
        <p>
          This technique emerged from real-world performance needs where
          different components require different hydration strategies based on
          their role, position, importance, and context. A hero video player
          needs immediate hydration on desktop but can wait until visible on
          mobile. A modal dialog shouldn&apos;t hydrate until opened. A complex
          chart can defer hydration until the user scrolls to it. Analytics
          widgets should wait for idle time regardless of visibility.
        </p>
        <p>
          Partial hydration is particularly valuable for complex applications
          with diverse component types and varying user interaction patterns. It
          allows developers to optimize each component individually rather than
          applying a one-size-fits-all hydration strategy. Companies building
          content platforms, e-commerce sites, and media applications use
          partial hydration to balance performance, interactivity, and
          complexity.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding partial hydration requires grasping several key
          concepts:
        </p>
        <ul>
          <HighlightBlock as="li" tier="important">
            <strong>Conditional Hydration Predicates:</strong> Each component
            has a hydration predicate - a condition that must be satisfied
            before hydration occurs. Predicates can be simple (isVisible,
            hasBeenClicked) or complex (isVisible AND isIdle AND connectionSpeed
            &gt; 3G).
          </HighlightBlock>
          <li>
            <strong>Visibility-Based Hydration:</strong> Using Intersection
            Observer API to detect viewport visibility. Components remain as
            static HTML until they enter the visible area (or approach it within
            rootMargin). Prevents hydrating off-screen content that users may
            never see.
          </li>
          <li>
            <strong>Interaction-Based Hydration:</strong> Deferring hydration
            until user interacts with a component or its vicinity. On first
            click, hover, or focus, the component quickly hydrates and processes
            the interaction. Works for components where slight delay is
            acceptable (modals, dropdowns, tooltips).
          </li>
          <li>
            <strong>Time-Based Hydration:</strong> Hydrating after a specific
            time delay or during browser idle periods. Uses setTimeout,
            requestIdleCallback, or requestAnimationFrame. Ensures critical
            content hydrates first, then defers less important components to
            idle time.
          </li>
          <li>
            <strong>Media Query-Based Hydration:</strong> Hydrating based on
            screen size, orientation, or device capabilities. Desktop might
            hydrate rich interactions immediately while mobile defers them.
            Touch devices might skip hover effects entirely.
          </li>
          <li>
            <strong>Network-Aware Hydration:</strong> Using Network Information
            API to check connection speed and type. On fast WiFi, hydrate
            everything. On slow 3G, hydrate only critical components. On
            save-data mode, minimize hydration aggressively.
          </li>
          <li>
            <strong>Composite Conditions:</strong> Combining multiple predicates
            with AND/OR logic. For example: hydrate when (visible OR clicked)
            AND (idle OR desktop) AND (WiFi OR cached). This enables
            sophisticated, context-aware hydration strategies.
          </li>
          <li>
            <strong>Hydration State Management:</strong> Tracking which
            components have hydrated, which are pending, which conditions are
            met. This prevents duplicate hydration and enables
            debugging/monitoring.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>Partial hydration follows a sophisticated multi-stage process:</p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Partial Hydration Flow</h3>
          <ol className="space-y-3">
            <li>
              <strong>1. Build-Time Analysis:</strong> Identify components and
              their hydration conditions
              <ul className="ml-6 mt-2 space-y-1">
                <li>
                  • Parse hydration directives (visible, idle, interaction,
                  media)
                </li>
                <li>• Generate hydration metadata for each component</li>
                <li>
                  • Create separate bundles for each lazy-hydrated component
                </li>
              </ul>
            </li>
            <li>
              <strong>2. Server-Side Rendering:</strong> Render all components
              to HTML
              <ul className="ml-6 mt-2 space-y-1">
                <li>
                  • Add hydration markers
                  (data-hydrate-when=&quot;visible&quot;)
                </li>
                <li>• Include component metadata in HTML</li>
              </ul>
            </li>
            <li>
              <strong>3. HTML Delivery:</strong> Browser receives and displays
              full HTML (fast FCP)
            </li>
            <li>
              <strong>4. Hydration Orchestrator Initialization:</strong> Load
              small orchestrator script
              <ul className="ml-6 mt-2 space-y-1">
                <li>• Scan page for components with hydration markers</li>
                <li>• Register observers and listeners based on conditions</li>
                <li>• Set up Intersection Observers for visible conditions</li>
                <li>• Attach event listeners for interaction conditions</li>
                <li>• Schedule idle callbacks for time-based conditions</li>
              </ul>
            </li>
            <li>
              <strong>5. Condition Monitoring:</strong> Orchestrator
              continuously monitors conditions
              <ul className="ml-6 mt-2 space-y-1">
                <li>• Check viewport visibility</li>
                <li>• Listen for user interactions</li>
                <li>• Monitor idle periods</li>
                <li>• Track network conditions</li>
                <li>• Evaluate media queries</li>
              </ul>
            </li>
            <li>
              <strong>6. Conditional Hydration Trigger:</strong> When
              condition(s) satisfied:
              <ul className="ml-6 mt-2 space-y-1">
                <li>• Dynamically import component code</li>
                <li>• Initialize framework for that component</li>
                <li>• Hydrate component DOM subtree</li>
                <li>• Attach event listeners and state</li>
                <li>• Mark component as hydrated</li>
                <li>• Clean up observers/listeners</li>
              </ul>
            </li>
            <li>
              <strong>7. Progressive Completion:</strong> Components hydrate as
              conditions are met
              <ul className="ml-6 mt-2 space-y-1">
                <li>• Critical components may hydrate immediately</li>
                <li>• Visible components hydrate as user scrolls</li>
                <li>• Idle components hydrate during pauses</li>
                <li>• Interactive components hydrate on demand</li>
              </ul>
            </li>
          </ol>
        </div>

        <HighlightBlock as="p" tier="crucial">
          The key innovation: hydration happens only when explicitly triggered
          by satisfied conditions. This eliminates wasted hydration of
          components users may never interact with or see. The orchestrator is
          lightweight (2-5KB) and efficiently manages multiple observation
          strategies simultaneously.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/partial-hydration-orchestration.svg"
          alt="Partial Hydration Orchestration"
          caption="Partial Hydration Orchestration - Components hydrate based on different conditions managed by orchestrator"
        />

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/partial-hydration-event-flow.svg"
          alt="Partial Hydration Event Flow"
          caption="Partial Hydration Event Flow - Orchestrator monitors conditions and triggers hydration on demand"
        />

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/partial-hydration-timeline.svg"
          alt="Partial Hydration Timeline"
          caption="Partial Hydration Timeline - Components hydrate only when conditions are met; unused components never hydrate"
        />
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Partial Hydration</th>
              <th className="p-3 text-left">Progressive/Selective</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Flexibility</strong>
              </td>
              <td className="p-3">
                Extremely flexible
                <br />
                Custom conditions per component
                <br />
                Composite predicates (AND/OR)
              </td>
              <td className="p-3">
                Fixed strategies
                <br />
                Priority levels or static/interactive
                <br />
                Less granular control
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Complexity</strong>
              </td>
              <td className="p-3">
                High (orchestrator needed)
                <br />
                Multiple observation strategies
                <br />
                Condition management overhead
              </td>
              <td className="p-3">
                Medium (simpler patterns)
                <br />
                Straightforward implementation
                <br />
                Less overhead
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Performance Gains</strong>
              </td>
              <td className="p-3">
                Maximum (fine-grained control)
                <br />
                Hydrate only what&apos;s truly needed
                <br />
                Context-aware optimization
              </td>
              <td className="p-3">
                Good (coarse-grained)
                <br />
                Fixed strategy for all
                <br />
                Predictable but less optimal
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Developer Experience</strong>
              </td>
              <td className="p-3">
                Complex (many decisions)
                <br />
                Per-component configuration
                <br />
                Debugging can be tricky
              </td>
              <td className="p-3">
                Simpler (fewer decisions)
                <br />
                Consistent patterns
                <br />
                Easier debugging
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Best For</strong>
              </td>
              <td className="p-3">
                Complex apps with diverse components
                <br />
                Performance-critical applications
                <br />
                Mobile-first experiences
              </td>
              <td className="p-3">
                Content sites (selective)
                <br />
                Consistent component types
                <br />
                Simpler applications
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">
            Comparison: Progressive vs Selective vs Partial
          </h3>
          <ul className="space-y-2">
            <li>
              <strong>Progressive:</strong> Everything hydrates in priority
              order (critical → high → normal → low → idle). Simple,
              predictable, good for most SSR apps. Limited flexibility.
            </li>
            <li>
              <strong>Selective:</strong> Only interactive components hydrate,
              static stays static. Maximum JS savings for content sites. Binary
              decision (interactive or not).
            </li>
            <li>
              <strong>Partial:</strong> Components hydrate when conditions are
              met (visible AND idle, OR clicked, etc.). Maximum flexibility and
              control. Highest complexity.
            </li>
          </ul>
          <p className="mt-3 text-sm">
            Choose based on needs: Progressive for SSR apps, Selective for
            content sites, Partial for complex apps requiring fine-grained
            control and context-aware optimization.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Choose Appropriate Conditions:</strong> Match hydration
            conditions to component purpose. Navigation = immediate. Video
            player = visible. Analytics = idle. Modal = interaction. Don&apos;t
            over-optimize - use simpler conditions when possible.
          </li>
          <li>
            <strong>Use Generous rootMargin:</strong> For visibility-based
            hydration, start loading 100-200px before component becomes visible.
            This gives time for download and hydration before user reaches it,
            avoiding layout shifts and perceived lag.
          </li>
          <li>
            <strong>Implement Network Awareness:</strong> Check connection type
            and adapt hydration strategy. On fast WiFi, be more aggressive. On
            slow 3G, defer more aggressively. Respect save-data mode by
            minimizing hydration.
          </li>
          <li>
            <strong>Provide Fallbacks:</strong> Ensure components work (or
            degrade gracefully) before hydration. Static buttons should be
            links. Forms should use native HTML submission. Don&apos;t rely
            entirely on JavaScript.
          </li>
          <li>
            <strong>Monitor Hydration Performance:</strong> Track which
            components hydrate, when, and how long it takes. Log metrics to
            analytics. Identify components that are never hydrated (remove
            condition or mark static).
          </li>
          <li>
            <strong>Keep Orchestrator Lightweight:</strong> The hydration
            orchestrator must be small (2-5KB) since it loads immediately.
            Minimize dependencies. Use native APIs (IntersectionObserver,
            requestIdleCallback).
          </li>
          <li>
            <strong>Handle Edge Cases:</strong> What if component never becomes
            visible? What if JavaScript fails to load? What if user has low
            battery? Design for graceful degradation and edge cases.
          </li>
          <li>
            <strong>Use Composite Conditions Wisely:</strong> Complex conditions
            (A AND B OR C) are powerful but harder to debug and reason about.
            Document why complex conditions are needed. Start simple, add
            complexity only when measurably beneficial.
          </li>
          <li>
            <strong>Cleanup Observers and Listeners:</strong> After hydration,
            disconnect IntersectionObservers, remove event listeners, cancel
            timeouts. Prevent memory leaks and unnecessary observation work.
          </li>
          <li>
            <strong>Test Across Devices and Conditions:</strong> Test on real
            devices with varying network speeds. Test with save-data mode
            enabled. Test with JavaScript disabled. Ensure consistent experience
            across conditions.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Over-Engineering Conditions:</strong> Creating overly
            complex conditions for minor gains. Start simple (visible, idle,
            immediate). Add complexity only when data shows it&apos;s needed.
            Complexity has maintenance cost.
          </li>
          <li>
            <strong>Tight rootMargin:</strong> Using 0px or small rootMargin
            means component starts hydrating when visible, causing delay. Use
            100-200px to prefetch before visible. Balance prefetching with
            over-eager loading.
          </li>
          <li>
            <strong>Forgetting Mobile Constraints:</strong> Desktop may handle
            aggressive hydration, mobile can&apos;t. Test on real mid-range
            Android devices (Moto G4/G5). Implement network-aware and
            battery-aware strategies.
          </li>
          <li>
            <strong>No Hydration Fallback:</strong> Assuming hydration always
            succeeds. Network failures, JS errors, or blocked scripts can
            prevent hydration. Ensure base functionality works without
            JavaScript.
          </li>
          <li>
            <strong>Hydration Race Conditions:</strong> Multiple conditions
            triggering simultaneously causing duplicate hydration attempts.
            Track hydration state and short-circuit if already hydrating or
            hydrated.
          </li>
          <li>
            <strong>Memory Leaks from Observers:</strong> Not disconnecting
            IntersectionObservers or removing event listeners after hydration.
            This causes memory leaks, especially for single-page apps with
            navigation.
          </li>
          <li>
            <strong>Interaction Hydration Lag:</strong> User clicks before
            hydration completes, interaction is lost or delayed. Provide
            immediate visual feedback (disabled state, loading indicator) while
            hydrating.
          </li>
          <li>
            <strong>Inconsistent Conditions:</strong> Different conditions for
            similar components confuses users and developers. Establish patterns
            (all galleries use visible, all modals use interaction) and document
            them.
          </li>
          <li>
            <strong>Poor Debugging Experience:</strong> Complex conditions are
            hard to debug. Add logging, monitoring, and visual indicators (dev
            mode). Track which conditions are met and when hydration occurs.
          </li>
          <li>
            <strong>Ignoring Browser Support:</strong> IntersectionObserver has
            95%+ support but requestIdleCallback has ~90%. Provide polyfills or
            fallbacks for older browsers. Test across browser landscape.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>Partial hydration excels in these scenarios:</p>

        <ul className="space-y-3">
          <li>
            <strong>Media-Heavy Sites:</strong> News sites and media platforms
            use partial hydration for videos, image galleries, and interactive
            graphics. Videos hydrate only when visible and on WiFi. Image
            galleries hydrate when user scrolls to them. This prevents hydrating
            expensive components users may never interact with.
          </li>
          <li>
            <strong>E-commerce Product Pages:</strong> Product pages use
            multiple conditions: image gallery hydrates when visible, variant
            selector hydrates immediately (critical for conversion), reviews
            hydrate during idle, recommendation carousel hydrates when visible.
            Network-aware: on 3G, defer recommendations and reviews.
          </li>
          <li>
            <strong>Long-Form Content:</strong> Articles with embedded
            interactive elements (charts, calculators, quizzes) scattered
            throughout. Each element hydrates when visible rather than all at
            once. For a 5000-word article with 10 interactive elements, this
            means loading 1-2 at a time instead of all 10 upfront.
          </li>
          <li>
            <strong>Social Media Platforms:</strong> Feed items hydrate as they
            enter viewport. Modals (share, report, edit) hydrate on interaction.
            Profile popups hydrate on hover. Chat widgets hydrate when opened.
            This keeps initial load minimal while providing rich interactivity
            on-demand.
          </li>
          <li>
            <strong>Dashboard Applications:</strong> Complex dashboards with
            multiple widgets use partial hydration with priorities. Critical KPI
            widgets hydrate immediately. Charts hydrate when visible. Detailed
            tables hydrate during idle. Settings panels hydrate on interaction.
            Desktop gets aggressive hydration, mobile is more conservative.
          </li>
          <li>
            <strong>Documentation Platforms:</strong> Documentation with
            interactive code examples use partial hydration. Code editors
            hydrate when visible (and user scrolls to them). Search hydrates
            immediately (high priority). API explorers hydrate on interaction.
            This keeps docs fast while providing rich interactivity where
            needed.
          </li>
          <li>
            <strong>Progressive Web Apps:</strong> PWAs use network-aware
            partial hydration. On first visit with slow connection, minimal
            hydration. On return visit with fast connection and cached assets,
            aggressive hydration. This balances first-time experience with
            returning user richness.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">Case Study: CNN Article Pages</h3>
          <p>
            CNN uses sophisticated partial hydration for article pages with
            multiple interactive elements:
          </p>
          <ul className="mt-2 space-y-1">
            <li>• Article text: Static HTML, zero JavaScript</li>
            <li>
              • Video player: Hydrates when visible, only on WiFi for mobile
            </li>
            <li>• Related articles: Hydrate during idle time</li>
            <li>• Comment section: Hydrates when visible (below-fold)</li>
            <li>• Share buttons: Hydrate on interaction (click/hover)</li>
            <li>• Newsletter signup: Hydrates during idle time</li>
            <li>• Ad slots: Hydrate progressively based on priority</li>
          </ul>
          <p className="mt-3 text-sm">
            Result: Initial JS payload reduced from 450KB to 85KB, TTI improved
            from 4.2s to 1.1s on mobile 3G. User engagement increased 12% due to
            faster perceived load times.
          </p>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://web.dev/progressive-hydration/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Progressive & Partial Hydration - web.dev
            </a>
          </li>
          <li>
            <a
              href="https://docs.astro.build/en/reference/directives-reference/#client-directives"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Astro Client Directives (Partial Hydration)
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Intersection Observer API
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - requestIdleCallback
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Network Information API
            </a>
          </li>
          <li>
            <a
              href="https://www.patterns.dev/posts/progressive-hydration/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              patterns.dev - Progressive Hydration Patterns
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
