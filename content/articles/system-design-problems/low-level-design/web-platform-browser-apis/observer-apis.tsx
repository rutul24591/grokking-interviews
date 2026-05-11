"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-observer-apis",
  title: "Design Observer APIs",
  description:
    "Production-grade Intersection, Mutation, and Resize Observers for efficient DOM monitoring, lazy loading, and responsive layouts without polling.",
  category: "low-level-design",
  subcategory: "web-platform-browser-apis",
  slug: "observer-apis",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "observers",
    "intersection",
    "mutation",
    "resize",
    "performance",
  ],
  relatedTopics: [
    "web-performance-optimization",
    "progressive-image-loading",
    "dom-and-virtual-dom",
  ],
};

export default function ObserverAPIsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">
          DOM polling (setInterval checking visibility, size) expensive: wasteful
          CPU, batteries drained (mobile), janky UX. Observer APIs solve: monitor
          DOM asynchronously, fire callback only when change detected. Key
          challenges: efficient threshold handling (intersection), batching
          mutations, handling nested observers, and managing observer lifecycles
          (prevent memory leaks).
        </HighlightBlock>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">Need to detect visibility (element in viewport or hidden).</HighlightBlock>
          <HighlightBlock as="li" tier="important">
            Need to detect DOM changes (attributes, text content, children).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">Need to detect size changes (responsive layout).</HighlightBlock>
          <HighlightBlock as="li" tier="important">
            Polling (setInterval) too expensive, need event-driven approach.
          </HighlightBlock>
          <li>Performance-critical (optimize battery, CPU usage).</li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Intersection Observer:</strong> Detect when element enters
            viewport.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Mutation Observer:</strong> Detect DOM changes (attribute,
            text, children).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Resize Observer:</strong> Detect element size changes.
          </HighlightBlock>
          <li>
            <strong>Thresholds:</strong> Trigger at specific visibility %
            (0%, 50%, 100%).
          </li>
          <li>
            <strong>Batching:</strong> Collect changes, fire once per frame
            (efficient).
          </li>
          <li>
            <strong>Unobserve:</strong> Stop observing when no longer needed
            (cleanup).
          </li>
          <li>
            <strong>Root Element:</strong> Observe relative to specific root
            (viewport or container).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Latency:</strong> Callback fires within 100ms of change.
          </HighlightBlock>
          <li>
            <strong>CPU:</strong> Minimal overhead (event-driven, not polling).
          </li>
          <li>
            <strong>Memory:</strong> Observer instance &lt;1KB overhead.
          </li>
          <li>
            <strong>Accuracy:</strong> Detect all changes (no missed events).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Element hidden (display: none) then shown. Should fire visibility
            change.
          </li>
          <li>
            Document size changes (window resize). All observers fire.
          </li>
          <li>
            Nested observers (observer callbacks modify DOM). Risk infinite
            loop (careful).
          </li>
          <HighlightBlock as="li" tier="crucial">
            Observer garbage collected while observing. Risk: callback never
            fires, memory leak.
          </HighlightBlock>
          <li>
            Rapid mutations (add/remove 1000 elements). Observer batches, fires
            once.
          </li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">Observer APIs: register observer, watch elements asynchronously,
          browser fires callback on change (batched, async). No polling.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Three
          main APIs: Intersection (visibility), Mutation (DOM changes), Resize
          (size changes). Unobserve when done (cleanup). Monitor multiple
          elements efficiently.</Highlight></HighlightBlock>
      </section>

      <section>
                <h2>Diagram Walkthrough</h2>

<ArticleImage
          src="/diagrams/system-design-problems/low-level-design/web-platform-browser-apis/observer-apis.svg"
          alt="Observer APIs showing IntersectionObserver, MutationObserver, and ResizeObserver patterns, use cases, and configuration options"
          caption="Observer APIs showing IntersectionObserver, MutationObserver, and ResizeObserver patterns, use cases, and configuration options"
        />

        <HighlightBlock as="p" tier="crucial">
          Interview signal: the diagram captures the end-to-end flow for <strong>Design Observer APIs</strong>. You should be able to explain the happy path and the failure paths (retries, cancellation, backpressure), not just the API surface.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Look for the &ldquo;control points&rdquo; where correctness is enforced: idempotency keys, monotonic request/version tokens, single-flight coordination, and durable persistence boundaries.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          In interviews, call out observability and operability: what you log/measure (p95 latency, error rates, retries/queue depth) and how you keep degraded modes user-safe (read-only, queued, or cached fallbacks).
        </HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Intersection Observer</h3>
        <p>Detect when element enters/leaves viewport.</p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Use Case:</strong> Lazy loading images, infinite scroll,
            analytics tracking.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Configuration:</strong> root (viewport default), rootMargin
            (offset), threshold (visibility %).
          </HighlightBlock>
          <li>
            <strong>Threshold:</strong> 0 (just visible), 0.5 (50% visible), 1
            (fully visible).
          </li>
          <li>
            <strong>Callback:</strong> Fired when intersection changes, receives
            IntersectionObserverEntry (ratio, bounds).
          </li>
          <li>
            <strong>Efficiency:</strong> Browser optimized (skips offscreen,
            uses native compositing).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Mutation Observer</h3>
        <p>Detect changes to DOM tree.</p>
        <ul className="space-y-2">
          <li>
            <strong>Use Case:</strong> Monitor dynamic content, form changes,
            undo/redo.
          </li>
          <li>
            <strong>Watched Changes:</strong> childList (children added/removed),
            attributes, characterData (text).
          </li>
          <li>
            <strong>Options:</strong> subtree (watch descendants), attributeFilter
            (only specific attributes).
          </li>
          <li>
            <strong>Callback:</strong> Batched, fired once per frame (async).
            Contains MutationRecord array.
          </li>
          <li>
            <strong>Caution:</strong> Callback modifies DOM → new mutations →
            callback again. Risk infinite loop.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Resize Observer</h3>
        <p>Detect element size changes.</p>
        <ul className="space-y-2">
          <li>
            <strong>Use Case:</strong> Responsive layout (adapt to container
            width), charts (resize canvas).
          </li>
          <li>
            <strong>Triggers:</strong> Element size changes (via CSS, parent
            resize, explicit style).
          </li>
          <li>
            <strong>Callback:</strong> Receives ResizeObserverEntry (new size,
            old size).
          </li>
          <li>
            <strong>Batched:</strong> Multiple resize events batched into one
            callback.
          </li>
          <li>
            <strong>Timing:</strong> Fires before paint (can modify layout
            safely).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Observer Lifecycle</h3>
        <p>Create, observe, cleanup.</p>
        <ul className="space-y-2">
          <li>
            <strong>Create:</strong> new IntersectionObserver(callback,
            options).
          </li>
          <li>
            <strong>Observe:</strong> observer.observe(element) starts watching.
          </li>
          <li>
            <strong>Unobserve:</strong> observer.unobserve(element) stops
            watching (individual).
          </li>
          <li>
            <strong>Disconnect:</strong> observer.disconnect() stops all
            (cleanup on unmount).
          </li>
          <li>
            <strong>Takerecords:</strong> observer.takeRecords() returns pending
            entries (manual flush).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Performance Optimization</h3>
        <p>Efficient observer usage.</p>
        <ul className="space-y-2">
          <li>
            <strong>Root Margin:</strong> Trigger before element fully visible
            (early load).
          </li>
          <li>
            <strong>Threshold Array:</strong> Multiple thresholds (0, 0.5, 1)
            fires once per transition.
          </li>
          <li>
            <strong>Reuse Observer:</strong> Single observer watches many
            elements (shared).
          </li>
          <li>
            <strong>Unobserve Early:</strong> Stop watching after action taken
            (lazy load done).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Debounce Callback:</strong> Resize observer fires frequently,
            debounce update.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Lazy Loading Pattern</h3>
        <p>Efficient image loading with Intersection Observer.</p>
        <ul className="space-y-2">
          <li>
            <strong>Placeholder:</strong> LQIP (low-quality image placeholder)
            initially.
          </li>
          <li>
            <strong>Detect Visibility:</strong> Intersection Observer detects
            enter viewport.
          </li>
          <li>
            <strong>Load Full Image:</strong> Set src (or fetch) when visible,
            fade in.
          </li>
          <li>
            <strong>Unobserve:</strong> After loading, unobserve (save CPU).
          </li>
          <li>
            <strong>Benefits:</strong> Faster initial load (skip off-screen
            images), reduced bandwidth.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Infinite Scroll Pattern</h3>
        <p>Load more items as user scrolls.</p>
        <ul className="space-y-2">
          <li>
            <strong>Sentinel:</strong> Last item or sentinel element at end of
            list.
          </li>
          <li>
            <strong>Observe:</strong> Watch sentinel with Intersection Observer.
          </li>
          <li>
            <strong>Trigger:</strong> Sentinel enters viewport → load next batch
            (append).
          </li>
          <li>
            <strong>Update Sentinel:</strong> Move sentinel to new last item.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Benefits:</strong> Efficient pagination (no manual buttons),
            smooth UX.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Analytics Tracking</h3>
        <p>Track element visibility for analytics.</p>
        <ul className="space-y-2">
          <li>
            <strong>Ad Visibility:</strong> Track when ads visible (for
            impression counting).
          </li>
          <li>
            <strong>Content Sections:</strong> Track which sections user sees
            (engagement).
          </li>
          <li>
            <strong>Threshold:</strong> Use 50% visible threshold (threshold:
            0.5).
          </li>
          <li>
            <strong>Report:</strong> On visibility change, send analytics event
            (visible/hidden).
          </li>
          <li>
            <strong>Unobserve:</strong> After 1st visible event, unobserve
            (don't re-track).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring & Observability</h3>
        <p>Track observer health.</p>
        <ul className="space-y-2">
          <li>
            <strong>Callback Time:</strong> How long do callbacks take? (avoid
            blocking).
          </li>
          <li>
            <strong>Mutation Count:</strong> How many mutations per second?
            (detect pathological patterns).
          </li>
          <li>
            <strong>Observer Count:</strong> How many active observers?
            (resource usage).
          </li>
          <li>
            <strong>Memory:</strong> Observer overhead (should be small).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Latency:</strong> Time from change to callback (should be
            &lt;100ms).
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Browser Support</h3>
        <HighlightBlock as="p" tier="crucial">
          Intersection Observer: modern browsers (IE 11 no). Mutation Observer:
          universal support. Resize Observer: modern browsers (IE no).
          Polyfills available for older browsers.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">React Integration</h3>
        <HighlightBlock as="p" tier="important">
          useEffect hook for lifecycle. useRef for element. Cleanup:
          unobserve/disconnect on unmount. Hook libraries (react-intersection-observer)
          abstract this.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Observers</h3>
        <HighlightBlock as="p" tier="important">
          Mock IntersectionObserver in tests (real browser integration tests
          needed). Simulate visibility changes, mutations, resizes. Verify
          callbacks fire.
        </HighlightBlock>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Composite Observers</h3>
        <p>
          Combine observers: lazy load image (intersection) and track size
          (resize). Efficient: single callback for both.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Observer Pooling</h3>
        <HighlightBlock as="p" tier="important">
          Reuse observer instances for many elements (single observer, observe
          multiple). Reduces memory, speeds up init.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">IntersectionObserver with Delay</h3>
        <HighlightBlock as="p" tier="important">
          Don't load immediately on visibility. Debounce or delay: load only if
          visible for 2+ seconds (prevent preloading off-screen).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing at Scale</h3>
        <HighlightBlock as="p" tier="important">
          1000 observed elements, rapid mutations. Verify callbacks don't
          block UI (no jank). Memory remains stable.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Pitfalls</h3>
        <HighlightBlock as="p" tier="important">
          Common: forget disconnect() → memory leak (observers keep firing).
          Solution: cleanup in useEffect return. Another: mutation observer
          creates infinite loop. Solution: guard against self-modifications.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Incident Response</h3>
        <HighlightBlock as="p" tier="crucial">
          High callback latency: check if callback does heavy work (defer to
          worker). Memory growing: verify disconnect() called. UI jank: profile
          callback time.
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Precision vs Efficiency</h3>
        <HighlightBlock as="p" tier="crucial">
          High threshold precision (many values): fires often. Single threshold
          (0 or 1): fewer fires. Balance: use 0.5 for most use cases.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Root Margin Tradeoff</h3>
        <HighlightBlock as="p" tier="important">
          Large root margin: early load (smooth scrolling) but more prefetch.
          Small: accurate visibility but late load. Typical: 50px (start loading
          before visible).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Observer Overhead</h3>
        <HighlightBlock as="p" tier="important">
          Each observer has overhead. Reuse observers (single, watch many) vs
          unique (per element). Reuse more efficient.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Batching for efficiency (fires once per frame). Monitoring callback latency and observer count. Testing with mocks and</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">integration tests. Common patterns: lazy loading images (LQIP + Intersection), infinite scroll, ad impression tracking. Real-world systems use observer pooling (reuse instances), cleanup in React useEffect, and libraries (react-intersection-observer) for abstraction.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
