"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-responsive-cross-device-architecture",
  title: "Design a Responsive Cross-Device Frontend Architecture",
  description:
    "Principal-level design of a responsive frontend architecture across phones, tablets, desktops, foldables, and low-end devices using design tokens, container queries, adaptive media, input normalization, accessibility, and performance budgets.",
  category: "high-level-design",
  subcategory: "cross-platform-mobile-systems",
  slug: "responsive-cross-device-architecture",
  wordCount: 5600,
  readingTime: 32,
  lastUpdated: "2026-05-22",
  tags: ["hld", "responsive-design", "cross-device", "container-queries", "adaptive-images", "progressive-enhancement", "touch-events", "performance-budget", "viewport"],
  relatedTopics: ["pwa-offline-sync", "web-react-native-shared-system"],
};

export default function ResponsiveCrossDeviceArchitectureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Responsive Cross-Device Frontend Architecture around system boundary, state ownership, failure handling, scalability, security, and observable recovery. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock>
        <p>
          A responsive cross-device frontend architecture delivers one product experience across phones, tablets, desktops, foldables, smart displays, embedded browsers, and assistive technologies without maintaining separate application codebases for every form factor. The goal is broader than resizing layouts. The architecture must adapt information density, navigation, input model, media quality, accessibility behavior, and performance cost to the user&apos;s current context.
        </p>
        <HighlightBlock as="p" tier="crucial">
          Principal-level responsive design is a systems problem. It joins design tokens, component contracts, content modeling, rendering performance, asset delivery, accessibility, input semantics, observability, and organizational governance. A page that merely fits on mobile is not the same as an architecture that scales across product teams and device classes.
        </HighlightBlock>
        <p>
          This design is important for marketplaces, dashboards, SaaS admin tools, banking portals, healthcare workflows, learning platforms, and media products where users frequently switch between devices. The same user may start on a phone, continue on a tablet, and finish on a desktop. The frontend should preserve task continuity while making the best use of the available screen, input precision, network quality, and device capability.
        </p>
        <p>
          The architecture should avoid two extremes. One extreme is device-specific forks that duplicate routes, components, analytics, and accessibility behavior. The other is one fluid layout that ignores device capabilities and produces cramped mobile views or wasteful desktop views. The stronger approach is shared product semantics with adaptive presentation and delivery.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: the design must preserve correctness under latency, concurrency, partial failure, and changing permissions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Responsive Cross-Device Frontend Architecture, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>
        <p>
          Design tokens are the foundation. Primitive tokens describe raw values such as color scales and spacing increments. Semantic tokens describe intent such as primary text, critical action, page surface, or subtle border. Component tokens bind those semantics to a component&apos;s local parts. This layering lets themes, density modes, and brand adjustments happen without rewriting every component.
        </p>
        <p>
          Container queries move responsiveness from the page to the component. A card should adapt to the space allocated by its parent, not to the global viewport. The same card might appear in a narrow sidebar, a two-column tablet grid, a dense desktop table-adjacent panel, or a full-width mobile feed. Component-level responsiveness makes design-system components portable across layouts.
        </p>
        <HighlightBlock as="p" tier="important">
          Responsive architecture should distinguish viewport adaptation, container adaptation, capability adaptation, and preference adaptation. Viewport answers how much screen exists. Container answers how much space a component has. Capability answers whether the device supports hover, fine pointer, high bandwidth, or enough CPU. Preference answers what the user has requested, such as reduced motion, larger text, dark mode, or data saving.
        </HighlightBlock>
        <p>
          Adaptive media delivery prevents the responsive layout from becoming a bandwidth problem. Images should be delivered in sizes and formats appropriate to the rendered slot, not to the largest possible desktop asset. Art direction may require different crops for portrait mobile, landscape tablet, and wide desktop. Known intrinsic dimensions and stable aspect ratios prevent layout shifts.
        </p>
        <p>
          Input normalization is essential because viewport size does not reliably identify input type. A tablet may have a keyboard and trackpad. A laptop may have a touch screen. A phone may connect to an external display. The architecture should use pointer and hover capability queries, not mobile user-agent assumptions, and should keep keyboard and screen-reader interaction paths first-class.
        </p>
        <p>
          Performance budgets must vary by device and connection, but user preference should override capability. A high-end device with data saver enabled should still receive reduced payload. A low-end device on fast Wi-Fi should not automatically receive heavy animation if CPU and memory cannot sustain it. Budgeting should consider JavaScript, CSS, images, fonts, hydration cost, main-thread work, and layout stability.
        </p>
        <p>
          Content modeling is part of responsiveness. If the desktop design depends on eight columns of metadata and the mobile design hides six of them, the architecture needs a declared priority model rather than ad hoc CSS hiding. Each field should be classified as essential, supporting, contextual, or optional per workflow. That classification drives card summaries, detail panels, table column collapse, filter drawers, and accessible labels.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: state model, API contracts, cache policy, async workflow, authorization, rollout, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        <p>
          The architecture has five cooperating layers. The token layer defines design primitives and semantics. The component layer implements portable responsive components using container-aware contracts. The page composition layer allocates regions and content priority. The delivery layer selects assets and code by capability and preference. The observability layer measures real user experience across device classes, not only lab benchmarks.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/cross-platform-mobile-systems/responsive-cross-device-architecture.svg"
          alt="Responsive cross-device frontend architecture with token system, layout grid, adaptive images, network capability detection, pointer events, performance tiers, and responsive navigation."
          caption="Responsive architecture combines token governance, component-level responsiveness, adaptive assets, input capability handling, and performance budgets rather than treating responsiveness as CSS breakpoints only."
        />
        <p>
          A request begins with server-rendered or statically served HTML that includes critical CSS, stable layout dimensions, and priority resource hints for the above-the-fold experience. The browser chooses image candidates based on rendered size and supported format. The app then hydrates or initializes interactive islands progressively. Expensive modules such as animation, data grids, maps, and charts should load only when the user&apos;s route, device capability, and preferences justify them.
        </p>
        <p>
          Components should declare their own layout thresholds and density states. A data card might show a compact title-only view in a narrow container, add metadata in a medium container, and show inline actions in a wide container. A dashboard region might switch from stacked cards to a grid as its container grows. The page should not know every internal breakpoint of every component; it should allocate regions and let components adapt internally.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/cross-platform-mobile-systems/responsive-cross-device-architecture-component-flow.svg"
          alt="Component responsiveness flow showing page regions, container size, component density states, content priority, and accessible interaction behavior."
          caption="Container-aware components adapt based on allocated space and content priority, while accessibility semantics remain stable across visual presentations."
        />
        <p>
          Navigation is a special case because it controls orientation, accessibility, and task efficiency. Mobile may use a drawer or bottom navigation. Tablet may use an icon rail or collapsible sidebar. Desktop may use a persistent sidebar or horizontal navigation. The underlying route model, link list, active state, permissions, and analytics should remain shared. Visual presentation can change, but the product should not maintain separate navigation truth for each device class.
        </p>
        <p>
          Server rendering and hydration need their own device strategy. The server usually knows user agent and request headers, but not exact container size, pointer capability, or user-controlled zoom. The first render should therefore choose a conservative layout that avoids hydration mismatch and major layout shift. Client-side capability refinement can enhance density, load richer modules, or switch interaction affordances after hydration, but the server-rendered DOM should remain semantically correct and usable.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/cross-platform-mobile-systems/responsive-cross-device-architecture-performance.svg"
          alt="Performance budget matrix for low-end, mid-range, and high-end devices with JavaScript, media, font, animation, and monitoring constraints."
          caption="Device-tier budgets should limit JavaScript, media, fonts, and animation cost, with user preferences such as reduced motion and data saver treated as hard constraints."
        />
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>
        <p>
          Container queries improve component portability, but they add design-system discipline. Teams need clear component boundaries, stable container wrappers, and testing across placement contexts. Media queries remain useful for page-level layout and global chrome. The trade-off is not container queries versus media queries; it is choosing the right scope for the decision. Page regions respond to viewport and route context. Components respond to their allocated container.
        </p>
        <p>
          A single shared component can reduce duplication but can also become overloaded with too many visual modes. If a component supports every possible desktop, tablet, mobile, compact, dense, embedded, and marketing variant, it becomes hard to reason about and test. Principal-level architecture defines when to create variants: shared semantics and behavior should stay together, while substantially different workflows may deserve separate composed components.
        </p>
        <HighlightBlock as="p" tier="important">
          Adaptive delivery trades implementation complexity for user experience and cost control. Serving precise image sizes, deferring heavy modules, and honoring device preferences reduces bandwidth and improves Core Web Vitals, but it requires build tooling, CDN transformations, monitoring, and fallback behavior. Without governance, adaptive delivery can become inconsistent across teams.
        </HighlightBlock>
        <p>
          Capability detection is more robust than user-agent detection, but it is still imperfect. Network Information API support varies. Hardware concurrency is a coarse signal. Viewport does not prove device class. Save-Data, reduced motion, color scheme, contrast, hover, pointer, and viewport should be treated as signals with priority rules, not as a single source of truth. The safest default is a functional mid-tier experience that progressively enhances.
        </p>
        <p>
          Dense desktop layouts improve efficiency for expert users but can overwhelm casual users and screen magnification workflows. Mobile-first layouts improve simplicity but can waste desktop space and increase click depth. The product should tie density to task context, user role, and explicit preferences, not only screen width. Administrative tools and consumer marketing pages should not use the same density rules.
        </p>
        <p>
          Responsive personalization can improve productivity but can harm predictability. Remembering a user&apos;s density, sidebar, table column, or split-pane preferences makes repeated work faster on the same device, but those preferences may be wrong on another screen size or after a role change. A robust design scopes preferences by route, device class, and sometimes organization policy, while keeping a reset path and sensible defaults.
        </p>
        <p>
          Separate mobile and desktop codebases can move quickly for specialized experiences, but they duplicate accessibility fixes, analytics events, design tokens, state handling, and bug fixes. A unified architecture requires more upfront investment in component contracts and testing, but it scales better for long-lived products with many surfaces.
        </p>
      </section>

      <section>
        <h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: latency, error rate, fallback rate, conversion, stale-state duration, and rollback success.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>
        <p>
          Establish a token governance model before scaling components. Tokens should describe semantic intent, include density and theme variants, and be reviewed as part of the design-system contract. Raw color, spacing, and font values should not spread across product components because they make responsiveness, theming, and accessibility changes expensive.
        </p>
        <p>
          Use mobile-first and content-first defaults, then enhance. The baseline should be readable, keyboard accessible, and functional in narrow containers and older browsers. Wider containers can add metadata, side-by-side layout, persistent controls, and richer previews. This makes fallback behavior intentional rather than accidental.
        </p>
        <p>
          Keep accessibility semantics stable while visuals change. Navigation should preserve route labels and active state. Drawers should manage focus and restore it on close. Icon-only modes need accessible names. Components should not duplicate interactive links in hidden desktop and mobile variants because duplicated DOM can confuse keyboard navigation and assistive technology if not handled carefully.
        </p>
        <p>
          Design image and media pipelines as part of architecture. Generate multiple widths, support modern formats with fallback, preserve intrinsic dimensions, apply lazy loading below the fold, and avoid loading video or high-resolution media on constrained networks or data-saving preferences. Real-user monitoring should track image bytes and layout shift by viewport class.
        </p>
        <p>
          Define performance budgets per route and device class. Budgets should include JavaScript transfer, parsed and executed JavaScript, CSS, fonts, image bytes, long tasks, hydration time, interaction latency, and layout shift. Heavy experiences should have explicit justification and should be lazy-loaded behind user intent or high-confidence capability checks.
        </p>
        <p>
          Test the matrix that users actually occupy. That includes small phones, large phones, tablets, narrow desktop windows, high zoom, keyboard-only navigation, screen readers, reduced motion, data saver, right-to-left languages where relevant, and low-end Android devices. Responsive architecture fails most often in combinations, not in the happy-path viewport widths shown in design files.
        </p>
        <p>
          Responsive architecture should be driven by capability and content priority, not only viewport width. A small phone, foldable, tablet, desktop, embedded browser, and TV can have different input modes, memory limits, network conditions, and accessibility needs. A principal-level design defines which content and interactions are essential, which can be deferred, and which require alternate flows rather than trying to fit the same desktop composition everywhere.
        </p>
        <p>
          Server rendering and hydration strategy matter across devices. Sending a desktop-heavy layout to mobile and hiding it with CSS wastes bandwidth and can hurt Core Web Vitals. Sending device-specific markup can improve performance but risks cache fragmentation and hydration mismatch. A mature design uses responsive CSS for normal layout changes, server-side adaptation only for major content differences, and careful cache keys when user agent or client hints affect output.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: stale state, hidden partial failure, unbounded retries, ownership ambiguity, and missing observability.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>
        <p>
          The most common pitfall is using viewport width as a proxy for everything. Width does not tell you whether the user has a mouse, touch, keyboard, screen reader, reduced motion preference, slow CPU, or constrained data plan. Overloading breakpoints with unrelated assumptions creates brittle experiences.
        </p>
        <p>
          Another pitfall is duplicating mobile and desktop markup for convenience. Duplicate links, duplicate forms, and duplicate stateful controls can produce accessibility issues, analytics double-counting, hydration mismatches, and inconsistent bug fixes. If separate visual structures are necessary, shared data and behavior should still come from one source of truth.
        </p>
        <p>
          Teams often optimize layout but ignore payload. A perfectly reflowed mobile page can still be unusable if it downloads desktop images, charting libraries, multiple font families, and unused admin modules. Responsiveness must include delivery and runtime cost, not just CSS.
        </p>
        <p>
          Container queries can be misused as a replacement for product thinking. A component that hides critical information in narrow containers may harm task completion. Content priority rules should be explicit: what is essential, what can move behind disclosure, and what should disappear only when it is genuinely optional.
        </p>
        <p>
          Testing only common breakpoints misses real failures. Users resize desktop windows, use browser zoom, run split-screen tablet modes, rotate devices, attach keyboards, and use foldables. The architecture should be resilient to continuous size changes, not only a few named breakpoints.
        </p>
        <p>
          Teams often forget that responsive behavior includes state continuity. A user can rotate the device, resize a desktop window, move from mobile web to desktop, or open split-screen mode. Layout changes should not lose form state, scroll context, media position, or selected filters. Stable state ownership and responsive-safe component boundaries are part of the architecture.
        </p>
        <p>
          Another pitfall is treating accessibility as a final pass. Touch targets, keyboard traversal, reduced motion, zoom, screen reader order, and focus restoration can all change across breakpoints. Responsive systems need test matrices that include input modality and assistive technology, not only screenshot width.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>
        <p>
          SaaS admin tools need dense desktop workflows for operators while still supporting review, approval, and alert triage on mobile. A strong architecture lets tables become summaries, filters become drawers, and secondary columns become detail panels without changing the underlying route and permission model.
        </p>
        <p>
          Commerce experiences need adaptive product cards, media, filters, and checkout flows. Mobile users need thumb-friendly filtering and fast images. Desktop users benefit from comparison density and richer media. The architecture must preserve product identity and analytics while adapting the presentation.
        </p>
        <p>
          News and learning platforms need readable typography, stable image aspect ratios, offline-friendly assets where appropriate, and careful ad or recommendation placement across screen sizes. Layout shifts and heavy media directly affect engagement, accessibility, and revenue.
        </p>
        <p>
          Enterprise dashboards need role-aware density. Executives may need summary cards on tablets, analysts may need large multi-panel desktop views, and field users may need compact mobile updates. Shared tokens and responsive components let the product support these modes without separate applications.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>
        <h3 className="mt-6 mb-3 text-lg font-semibold">1. How would you architect responsiveness beyond basic media queries?</h3>
        <p>
          I would separate page-level layout, component-level adaptation, capability detection, and user preferences. Pages define regions and content priority. Components use container-aware rules to adapt to allocated space. Capability signals handle hover, pointer precision, network, and device constraints. Preferences such as reduced motion and data saver override enhancement. This avoids using viewport width as a proxy for every decision.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">2. When would you use container queries instead of media queries?</h3>
        <p>
          I would use container queries for reusable components whose layout depends on their allocated space, such as cards, panels, filters, and dashboard widgets. I would use media queries for global page structure, application chrome, and viewport-level concerns. Container queries improve portability, but they require disciplined component boundaries and testing across placements.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">3. How do you keep responsive navigation accessible?</h3>
        <p>
          I would keep one route model and one source of navigation truth, then adapt visual presentation by breakpoint and capability. Mobile drawers need proper button semantics, expanded state, focus movement into the drawer, focus trap while open, Escape and backdrop close behavior, and focus restoration. Icon-only modes need accessible names. I would avoid duplicated hidden navigation trees unless the accessibility and keyboard behavior is explicitly tested.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">4. How do you design adaptive images and media for performance?</h3>
        <p>
          I would generate multiple image widths and modern formats, serve candidates based on rendered slot size, use art direction for genuinely different crops, preserve intrinsic dimensions to avoid layout shift, lazy-load below-the-fold media, and preload only critical above-the-fold assets. I would monitor real-user image bytes, LCP, and CLS by device class because asset mistakes often dominate mobile performance.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">5. How would you define performance budgets across devices?</h3>
        <p>
          Budgets should include JavaScript transfer and execution, CSS, fonts, media bytes, long tasks, interaction latency, hydration time, and layout stability. Low-end devices should receive fewer scripts, less animation, smaller media, and system fonts where possible. Mid-tier devices get a balanced experience. High-end devices can progressively load richer interactions. Data saver and reduced motion should be hard constraints regardless of detected capability.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">6. What would you monitor after launching this architecture?</h3>
        <p>
          I would monitor Core Web Vitals, interaction latency, JavaScript execution time, image bytes, layout shift, font loading behavior, navigation errors, drawer accessibility issues from automated and manual testing, and conversion or task-completion metrics segmented by viewport, device memory where available, network quality, browser, input capability, and route. Responsive problems often appear only in specific combinations, so segmentation matters.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries" target="_blank" rel="noreferrer">MDN: CSS Container Queries</a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images" target="_blank" rel="noreferrer">MDN: Responsive Images</a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events" target="_blank" rel="noreferrer">MDN: Pointer Events</a>
          </li>
          <li>
            <a href="https://web.dev/articles/responsive-web-design-basics" target="_blank" rel="noreferrer">web.dev: Responsive Web Design Basics</a>
          </li>
          <li>
            <a href="https://web.dev/articles/adaptive-serving-based-on-network-quality" target="_blank" rel="noreferrer">web.dev: Adaptive Serving Based on Network Quality</a>
          </li>
          <li>
            <a href="https://www.w3.org/WAI/fundamentals/accessibility-principles/" target="_blank" rel="noreferrer">W3C WAI: Accessibility Principles</a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
