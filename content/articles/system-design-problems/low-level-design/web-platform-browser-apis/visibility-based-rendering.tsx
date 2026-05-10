"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-visibility-based-rendering",
  title: "Visibility-Based Rendering System",
  description: "Conditional rendering and resource optimization based on page visibility and viewport intersection",
  category: "low-level-design",
  subcategory: "web-platform-browser-apis",
  slug: "visibility-based-rendering",
  wordCount: 5900,
  readingTime: 35,
  lastUpdated: "2026-05-06",
  tags: ["lld", "performance", "rendering", "visibility", "intersection-observer"],
  relatedTopics: ["idle-task-scheduling", "progressive-enhancement"],
};

export default function VisibilityBasedRenderingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A dashboard loads 50 charts. All charts render immediately, each making API calls to fetch data, performing expensive calculations, and updating DOM. The browser is overwhelmed: memory spikes, CPU maxed, rendering thread blocked. User scrolls to see a chart; it's already rendered but wasted resources on charts they'll never see.</p>
        <p>A dashboard with 100+ list items: the component tree is huge, React reconciliation is slow, re-renders lag even though only 10 items are visible. Off-screen items consume memory, computation, and network bandwidth.</p>
        <p>Better approach: visibility-based rendering. Only render and compute for elements currently visible in the viewport (via IntersectionObserver). Off-screen elements are deferred until they're about to enter the viewport. Page hidden (user switched tabs)? Pause animations, defer API calls, reduce update frequency. Page visible again? Resume and catch up.</p>
        <p>Key insight: the user only perceives what they see. Rendering off-screen content is wasted work. Rendering invisible content is pure waste. Conditional rendering based on visibility dramatically improves performance, battery life (mobile), and user experience.</p>
        <p><strong>Explicit assumptions:</strong> IntersectionObserver API available for viewport detection. Page Visibility API available for tab visibility detection. React or similar framework for conditional rendering. Components are idempotent and can be mounted/unmounted without state loss (or state is restored).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Viewport detection:</strong> Detect which elements are currently visible in the viewport using IntersectionObserver. Only render visible elements.</li>
          <li><strong>Lazy mounting:</strong> When an element approaches the viewport (before it enters), preemptively mount and render to avoid jank as the user scrolls.</li>
          <li><strong>Unmounting:</strong> When an element leaves the viewport (scrolls out), unmount it to free memory and stop computations.</li>
          <li><strong>Page visibility detection:</strong> Use Page Visibility API to detect when the page is hidden (user switched tabs). Pause animations, defer API calls, reduce polling frequency.</li>
          <li><strong>Resumption:</strong> When the page becomes visible again, resume animations, fetch any stale data, and resume normal update frequency.</li>
          <li><strong>Placeholder rendering:</strong> While waiting for a component to mount, show a placeholder (spinner, skeleton) to maintain layout stability.</li>
          <li><strong>State preservation:</strong> Optionally preserve component state when unmounted so re-mounting doesn't lose user input or scroll position.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Latency:</strong> IntersectionObserver detection under 16ms (60fps). Mounting latency under 100ms to avoid visible lag.</li>
          <li><strong>Memory:</strong> Off-screen components unmounted; memory freed. Large lists (10k+ items) with virtualization under 50MB in-memory DOM.</li>
          <li><strong>CPU:</strong> Idle CPU when page is hidden. Active update frequency reduced by 10-50x when hidden.</li>
          <li><strong>Battery:</strong> Reduced power draw on mobile when page is hidden (animations paused, polling disabled).</li>
          <li><strong>Browser compatibility:</strong> Chrome 51+, Firefox 55+, Safari 12.1+ (IntersectionObserver). Page Visibility API on all modern browsers.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>The system wraps components with a visibility coordinator. The coordinator uses IntersectionObserver to track which elements are in the viewport and which are approaching. Only visible and near-visible elements are mounted and rendered. Off-screen elements remain unmounted (or rendered as placeholders).</p>
        <p>A page visibility monitor listens to the Page Visibility API. When the page is hidden, polling intervals are increased 10x, animations are paused, and API request frequency is reduced. When the page becomes visible, these are restored. This preserves battery on mobile and reduces server load when pages are backgrounded.</p>
        <p>Mounting is preemptive: as the user scrolls toward an item, it's mounted slightly before entering the viewport (300-500px ahead). This avoids jank where the user sees a blank space while waiting for render. The threshold is tuned based on device performance and scroll speed.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/web-platform-browser-apis/visibility-based-rendering.svg"
          alt="Visibility-based rendering system showing viewport detection, component mount/unmount lifecycle, hysteresis, and Page Visibility API integration"
          caption="Visibility-based rendering system showing viewport detection, component mount/unmount lifecycle, hysteresis, and Page Visibility API integration"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">IntersectionObserver-Based Viewport Detection</h3>
        <p>IntersectionObserver efficiently detects when elements enter/leave the viewport. A single observer instance watches all list items. For each item, the observer tracks visibility state (not visible, partially visible, fully visible). Triggering is configurable via rootMargin: a negative margin shrinks the detection area (only very visible), a positive margin expands it (detects approaching elements).</p>
        <p>Typical configuration: rootMargin "300px 0px" means detect items 300px before entering the viewport from top/bottom. As the user scrolls, this gives 300px of lead time to mount components before they're visible, ensuring smooth render by the time they enter the viewport.</p>
        <p><strong>Observer Batching and Performance Optimization:</strong> Creating separate IntersectionObserver instances for each component is wasteful (overhead per instance). Instead, use a single shared observer and aggregate all callback notifications in a microtask batch. When multiple items enter/leave simultaneously during fast scrolling, collect all callbacks and dispatch a single state update (via `queueMicrotask` or `flushSync` in React 18). This prevents render thrashing and reduces GC pressure. Additionally, use the `threshold` array (e.g., `[0, 0.5, 1]`) to detect partial visibility transitions, enabling more nuanced rendering decisions: fully off-screen (threshold 0) vs. partially visible (threshold 0.5) vs. fully visible (threshold 1). This allows intermediate states where a component starts rendering (at 0.5) before becoming fully visible, further smoothing the user experience.</p>
        <p><strong>Root Element and Container Scrolling Scenarios:</strong> The observer's `root` property defaults to the viewport, but custom roots enable container-level scrolling (e.g., a scrollable div within the page, not the window). For nested scrollable containers, configure the observer with the appropriate root. Cross-origin iframes complicate this: observers cannot traverse the iframe boundary, so each iframe requires its own visibility system. For shadow DOM, observers work normally but the reference frame is the shadow root's containing block. Additionally, when observing elements in transform: scale() or other 3D transforms, the intersection calculations respect the transformed geometry, not the original layout box. Account for this when tuning thresholds for scaled content.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Component Mount/Unmount Lifecycle</h3>
        <p>Each item has a visibility state: hidden (not yet visible), mounting (approaching), visible (in viewport), unmounting (leaving viewport). When transitioning from hidden to mounting, the component is mounted in React. When transitioning to unmounting, the component is marked for unmount. After the item fully leaves the viewport, it's unmounted and removed from the DOM.</p>
        <p>Granular rendering: only the currently visible set of components have React state updates. Off-screen updates (e.g., data changes to unmounted items) are queued and applied only when the item remounts, avoiding wasted renders for invisible content.</p>
        <p><strong>React Hook Patterns and Lifecycle Synchronization:</strong> Use a custom hook `useVisibility()` to expose visibility state to child components. The hook reads from a context or refs provided by the visibility coordinator. In the mounting phase, components initialize expensive subscriptions (data polling, animation frames) via `useEffect` with the visibility state as a dependency. When the component transitions from mounting to unmounting, the `useEffect` cleanup function unsubscribes from these listeners. This pattern prevents memory leaks: subscribers are always cleaned up when visibility changes. Additionally, use `useMemo` with the visibility state as a dependency to ensure expensive computations (sorting, filtering, aggregations) only run when the component is visible or approaching visibility, not continuously.</p>
        <p><strong>Render Batching and Thrashing Prevention:</strong> Rapid mount/unmount cycles (visibility state flickering at the threshold boundary during smooth scrolling) cause excessive re-renders. Implement debouncing or hysteresis: once an item transitions to mounting, keep it mounted until it fully exits the rootMargin (not just the threshold). This prevents thrashing. Additionally, batch visibility state updates for multiple items in a single React transaction. If 10 items transition simultaneously, update the visibility state for all 10 in one `setState`, triggering a single render pass, not 10. Use a requestAnimationFrame boundary or queueMicrotask to collect all intersection changes and dispatch a single update. This optimization is critical for smooth scrolling performance.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Page Visibility State Management</h3>
        <p>The document.visibilityState property indicates if the page is visible, hidden, or prerendering. The visibilitychange event fires when this changes. A context or store tracks the visibility state and makes it available to all components.</p>
        <p>When hidden=true, components are notified to pause expensive work: stop polling, pause animations, defer non-critical API calls. When hidden=false, components are notified to resume. This is especially effective for dashboards with real-time data where stopping polling while hidden saves significant bandwidth and server load.</p>
        <p><strong>Cross-Tab State Coordination and Stale Data Handling:</strong> When a page is backgrounded for hours and then made visible, any cached data (from 8 hours ago) is stale. Upon visibility change to true, components should refetch data or increment a global version key. For real-time dashboards (stock tickers, live feeds), a brief flicker is acceptable as data updates. For transactional apps (banking), stale data can be critical. Implement a `dataFreshnessThreshold` (e.g., 5 minutes): if data is older than 5 minutes when the page becomes visible, refetch. If newer, reuse. Additionally, coordinate across browser tabs: if one tab logs out (signaling visibility change and logout), other tabs should detect the logout event via storage events and clear their state synchronously, preventing the user from seeing stale data while the tab is backgrounded.</p>
        <p><strong>Prerendering and Bfcache Considerations:</strong> Some browsers prerender pages in the background before the user navigates to them. The visibilityState is "prerendering" in this phase. Don't start API calls or background work during prerendering; they're wasted and can interfere with actual page load metrics. Additionally, when a page enters the browser back/forward cache (bfcache), it's in a frozen state. On re-entry from bfcache, the visibilitychange event fires, signaling the opportunity to restore listeners and refetch stale data. Implement a `pagehide` listener to clean up subscriptions before bfcache freeze, and a `pageshow` listener to restore state. This ensures smooth navigation in mobile browsers where bfcache is aggressively used.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Adaptive Thresholds</h3>
        <p>The rootMargin threshold (how far ahead to mount) is tuned based on device performance and user scroll speed. On high-end devices, mounting 500px ahead is safe. On low-end devices or slow networks, mounting 200px ahead to ensure render completes before visibility.</p>
        <p>Scroll speed detection: measure user scroll velocity. If scrolling fast, increase rootMargin to 600px. If scrolling slowly, reduce to 200px. This adapts mounting lead time to actual user behavior, balancing smoothness against resource usage.</p>
        <p><strong>Device Performance Detection and Adaptive Margins:</strong> Use the Network Information API (navigator.connection.effectiveType) to detect device connectivity (4g, 3g, 2g). For slow networks, increase rootMargin to 600px (give more lead time for slow renders). For fast networks, reduce to 300px. Similarly, use `navigator.deviceMemory` and `navigator.hardwareConcurrency` to detect available resources. On low-memory devices (≤2GB RAM), reduce rootMargin and keep fewer components mounted to avoid memory pressure. On high-concurrency devices (≥8 cores), allow more concurrent mounts. Additionally, profile the app: measure average component render time and use this to calculate optimal rootMargin. If a component takes 400ms to render and the user scrolls at 500px/s, set rootMargin to at least 400ms * 500px/s = 200px. For higher safety margin (reducing jank risk), multiply by 1.5-2x: 300-400px.</p>
        <p><strong>Velocity-Based Threshold Adjustment and Hysteresis:</strong> Calculate scroll velocity by tracking scroll position over time (e.g., every 100ms). If the user is scrolling at more than 1000px/s (very fast, typical on mobile with fling), increase rootMargin aggressively to 800px to ensure mounted components render before they enter the viewport. If scrolling is slow or stopped, reduce rootMargin to 200px to save memory. Implement hysteresis: once you increase the margin due to fast scrolling, don't decrease it immediately when scrolling slows—wait 2 seconds. This prevents flapping between small and large margins, which causes mount/unmount thrashing. Additionally, detect directional changes (user scrolls up, then down): on reversal, temporarily increase margin in the opposite direction to cover the new scroll direction.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Placeholder Strategy</h3>
        <p>While waiting for a component to mount and render, show a placeholder. For list items: a skeleton screen (fake content outline). For cards: a shimmer animation. For large content: a spinner. Placeholder prevents layout shift and gives the user visual feedback that content is loading.</p>
        <p>Placeholder height matches expected content height (for skeleton screens) to maintain layout stability. No placeholder: user sees blank space, then content suddenly renders, causing a jarring shift. With placeholder: smooth, expected progression.</p>
        <p><strong>Placeholder Rendering and Layout Stability Optimization:</strong> Static placeholders (a div with fixed height) are wasteful if the component mounts instantly (no visible loading). Implement a small delay (100-200ms) before showing the placeholder. If the component mounts within 100ms, skip the placeholder entirely (no flash). If mount takes longer, show the placeholder. This "flash prevention" improves UX: users don't see placeholder flashing for fast-loading content. Additionally, for components with variable content (sometimes text, sometimes an image), generate multiple placeholder variants based on the data type, and select the appropriate variant for each item. For images, use blurhash or LQIP (low-quality image placeholder) as the placeholder, providing visual continuity as the full image loads.</p>
        <p><strong>Skeleton Screen Dimensions and Content Mapping:</strong> Skeleton screens should match the final content layout exactly to avoid Cumulative Layout Shift (CLS). Use the metadata or schema of the data being loaded to determine expected dimensions. For example, if loading a user profile that will display 100x100 avatar, show a 100x100 skeleton. Generate skeleton variants server-side (send with the page HTML) or store dimensions in a config (e.g., cardDimensions with avatar: &#39;100x100&#39;, title: &#39;200x20&#39;, description: &#39;200x60&#39;). This allows the client to render accurate placeholders without waiting for component data.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">State Preservation and Restoration</h3>
        <p>Unmounting a component discards its state. If the user fills a form field in an off-screen item, scrolls away, and scrolls back, the form is empty (state lost). To prevent this, optionally preserve state in SessionStorage or a parent reducer when unmounting. On remount, restore from storage.</p>
        <p>This is optional and adds complexity. For most list items (where re-rendering is cheap), state loss is acceptable. For heavy components with user input, state preservation improves UX. Trade-off: memory and complexity versus UX.</p>
        <p><strong>State Serialization and Storage Strategies:</strong> When a component unmounts, serialize its state (convert React state to JSON). For simple form inputs, serialization is cheap. For complex objects (nested state, circular references), use a serialization library (e.g., structuredClone, JSON with custom replacers). Store serialized state in a `useState` or Zustand store (in-memory) keyed by item ID. On remount, deserialize and restore via `useEffect`. Alternatively, use sessionStorage for persistence across page reloads: `sessionStorage.setItem('item_123_state', JSON.stringify(state))`. SessionStorage is cleared on browser close, preventing stale state from corrupting data. For sensitive fields (passwords, API tokens), encrypt before storage or skip preservation entirely.</p>
        <p><strong>State Invalidation and Coherence with Server State:</strong> Preserved state can become stale. If the user fills a form offline, the server updates the underlying data, and then the user scrolls back to the item and sees the stale local form state. Implement a `stateVersion` or `timestamp` on stored state. On remount, compare the local state version with the server state version. If server is newer, discard local state and fetch fresh data. If local is newer (user made more changes), use local. For conflict resolution, prefer server-as-source-of-truth, but offer a merge UI if the app requires editing unsaved changes. Additionally, implement a `clearStateOn` rule: if the user navigates away from the list entirely (e.g., to a detail page), clear all preserved state. This prevents users from returning days later with stale form data.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Integration with Virtual Scrolling</h3>
        <p>Virtual scrolling (rendering only visible items) is similar but more aggressive: a virtual scroller renders a fixed window of items (e.g., 5) while the user scrolls through thousands. Combined with visibility detection: the scroller manages mounting/unmounting, and each item also uses visibility detection for internal content (nested items, images, etc.).</p>
        <p>Most large lists use virtual scrolling; visibility-based rendering is a complementary optimization for nested content within each item.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Performance Monitoring and Metrics</h3>
        <p>Track metrics: number of mounted components, memory usage, FCP (first contentful paint), and FID (first input delay). With visibility-based rendering, these typically improve 20-50% on large lists. Monitor visibility state transitions: how often do items mount/unmount? High frequency indicates threshold tuning is needed.</p>
        <p><strong>Instrumentation and Real-User Monitoring:</strong> Instrument the visibility system to emit metrics: (1) Mounted component count (histogram, updated every 500ms). (2) Mount/unmount rate (events/second, should be &lt;5 for stable scrolling). (3) Time-to-render-after-mount (latency from mount callback to first paint, should be &lt;100ms). (4) Memory usage (measure via performance.memory API on supported browsers). Aggregate these in an analytics pipeline and alert if mount rate exceeds 10/sec (indicating thrashing) or time-to-render exceeds 200ms (indicating slow renders). Additionally, track web vitals: LCP (Largest Contentful Paint) should improve with visibility rendering (only load critical content first), CLS (Cumulative Layout Shift) should remain stable if placeholders match final dimensions.</p>
        <p><strong>Testing and Simulation Strategies:</strong> Test visibility rendering under realistic conditions: (1) Simulate slow networks (3G: 1.6Mbps, measure time-to-render impact). (2) Simulate low-end devices (1GB RAM, single core, measure memory pressure). (3) Rapid scroll gestures (fling on mobile, 2000px/s velocity, verify no jank). (4) Rapid mount/unmount cycles at the threshold boundary (script a scroll that hovers at the boundary, verify hysteresis prevents thrashing). Unit tests: verify observer callback fires at the right visibility transitions, verify state updates batch correctly, verify memory is released on unmount. Integration tests: verify a list with 10k items keeps in-memory DOM under 50MB and paints within 100ms of first scroll. End-to-end: verify paint metrics improve by 30%+ compared to rendering all items.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Complexity versus benefit: visibility-based rendering adds code and complexity. For small lists (50 items), benefit is minimal. For large lists (500+ items), benefit is substantial. Threshold: implement for lists expected to exceed 100 items on typical devices.</p>
        <p>Threshold tuning: too small (100px), frequent mount/unmount thrashing. Too large (1000px), mounting happens so early that render completes but component sits idle, wasting memory. Sweet spot is typically 300-500px based on device and scroll speed.</p>
        <p>State preservation: preserving unmounted state adds memory (each unmounted item keeps state in memory). On lists of 10k items with heavy state, this is unacceptable. Accept state loss (component remounts fresh) or use virtual scrolling instead.</p>
        <p>Page visibility optimization: pausing animations and polling when hidden saves 30-50% CPU on backgrounded tabs. However, some real-time dashboards want updates even when hidden (e.g., stock tickers). Allow per-component opt-out.</p>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 1: IntersectionObserver-Wrapped List</h3>
        <p>List component uses IntersectionObserver to track item visibility. Items mount on intersection entry, unmount on intersection exit with rootMargin for lead time.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 2: Page Visibility Context</h3>
        <p>Root component tracks Page Visibility API state in context. Child components consume context and adjust polling frequency, animation speed, or API call rates based on visibility.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 3: Virtual Scroller with Visibility Detection</h3>
        <p>Virtual scroller renders only N visible items. Each item also applies visibility-based rendering for nested content, creating a layered optimization.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>Visibility-based rendering optimizes performance by conditionally rendering components only when visible in the viewport or about to become visible, and pausing expensive work when the page is hidden. Essential patterns include IntersectionObserver for viewport detection with configurable rootMargin for preemptive mounting, Page Visibility API integration to pause animations and polling, and placeholder rendering to maintain layout stability. Trade-offs include complexity (worth it for 100+ item lists), threshold tuning (300-500px optimal), and state preservation (optional, adds memory). Real-world systems (Twitter, LinkedIn, Google Docs) use these patterns on large feeds and documents. For best results, measure paint metrics and memory usage before and after implementation, tune thresholds based on device performance, and reserve for lists exceeding typical viewport content (100+ items). Combine with virtual scrolling for massive lists (10k+ items).</p>
      </section>
    </ArticleLayout>
  );
}
