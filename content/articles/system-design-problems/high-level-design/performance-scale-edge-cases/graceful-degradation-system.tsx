"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-graceful-degradation-system",
  title: "Design a Graceful Degradation System",
  description:
    "Architecture for a frontend that degrades gracefully under partial failures: circuit breakers per service dependency, feature flags for runtime feature removal, priority-tiered UI components (critical vs. enhanced vs. non-essential), fallback content strategies (cached data, skeleton screens, static placeholders), progressive enhancement baseline, error boundary isolation per feature zone, health-check-driven degradation mode toggle, and user-facing degradation notices with expected recovery time.",
  category: "high-level-design",
  subcategory: "performance-scale-edge-cases",
  slug: "graceful-degradation-system",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-12",
  tags: ["hld", "graceful-degradation", "circuit-breaker", "feature-flags", "error-boundary", "fallback", "resilience"],
  relatedTopics: ["frontend-1m-concurrent-users", "multi-region-frontend-architecture"],
};

export default function GracefulDegradationSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A graceful degradation system ensures that partial backend failures do not cause total frontend failures. Modern web applications depend on dozens of microservices — recommendations, search, notifications, analytics, payment, authentication, personalization, ad targeting, and more. Any one of these services can be slow, throwing errors, or completely unavailable at any given time. Without deliberate degradation design, a single failing microservice can cascade: a slow recommendations API blocks the page render, a crashing notifications service causes unhandled React errors that unmount the entire component tree, or a degraded search cluster makes the search bar spin indefinitely, confusing users about whether their query was received.</p>
        <p>Graceful degradation means: when a dependency fails, the system continues to provide the most valuable functionality with reduced features, rather than failing completely. The user can still browse products, read articles, and complete purchases even when the recommendations panel is down, the search is slow, and the notification badge is missing. The degradation is transparent when possible (the section simply disappears or shows cached data), and explained when not (a brief "Some features are temporarily unavailable" notice).</p>
        <p><strong>Explicit scope:</strong> Frontend circuit breakers, React error boundaries, feature flag-driven degradation, fallback content strategies, and health-check-driven degradation mode. Not in scope: backend circuit breaker implementation (Hystrix/Resilience4j), infrastructure failover, or database availability patterns.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Failure isolation:</strong> A failure in one feature zone must not propagate to other zones. A crash in the recommendations component must not unmount the product listing or checkout flow. Error boundaries isolate failures to the smallest possible UI surface.</li>
          <li><strong>Circuit breaker per dependency:</strong> Each external API dependency has a circuit breaker with three states: Closed (healthy, all requests pass through), Open (failing, all requests return immediately with fallback data — no actual network requests), and Half-Open (recovery testing, one request passes through to check if the service has recovered). Circuit breaker opens after a configurable threshold (e.g., 5 failures in 10 seconds). It transitions to Half-Open after a cooldown (30 seconds).</li>
          <li><strong>Feature flag degradation:</strong> An operator can remotely disable specific features via feature flags (LaunchDarkly or a custom flag service) without a deployment. When a feature is disabled, its component renders a static placeholder or nothing. This allows instant response to a newly discovered problem without redeployment.</li>
          <li><strong>Fallback content:</strong> For non-critical features that fail, the UI shows: (a) cached content from the previous successful load (if available in the service worker cache or React Query cache); (b) a static placeholder (a muted list of generic items to maintain layout); (c) nothing (if the feature is non-essential and its absence is not disorienting). Never show infinite spinners for optional features.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Critical path protection:</strong> Core user journeys (login, browse primary content, add to cart, checkout) must never be affected by failures in non-critical services. Critical paths are isolated from non-critical dependencies at the component level — they do not share the same API calls or state contexts.</li>
          <li><strong>Degradation visibility:</strong> Engineers can see real-time which features are degraded via a degradation dashboard. Each circuit breaker's state (open/closed/half-open), open duration, and error rate is logged and visualized. On-call engineers receive alerts when a circuit breaker opens.</li>
          <li><strong>Fast recovery:</strong> When a failing service recovers, degraded features automatically recover without user intervention. Circuit breakers probe the service in Half-Open state and re-close on success. Degradation notices disappear automatically. No page refresh required.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The architecture treats the UI as a set of independent feature zones, each with its own failure domain. The critical zone (primary content, authentication, checkout) is built with no non-essential dependencies — it works even when every other service is down. The enhanced zone (recommendations, search, notifications, social features) is wrapped in error boundaries and connected to circuit breakers. The non-essential zone (analytics, A/B test variants, ad slots, onboarding hints) degrades silently (empty space or nothing). The DegradationContext (a React context) holds the current circuit breaker state and feature flag state — components subscribe to this context to know whether to render their full experience, a fallback, or nothing.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/performance-scale-edge-cases/graceful-degradation-system.svg"
          alt="Graceful degradation system: circuit breaker state machine (Closed: requests pass, count errors; threshold 5 errors/10s → Open: return fallback immediately; cooldown 30s → Half-Open: 1 probe request; success → Closed; failure → Open), feature priority tiers (P0 critical: auth+browse+checkout — isolated, no non-essential deps, never shed; P1 enhanced: recommendations+search+notifications — error boundaries, circuit breakers, cached fallbacks; P2 non-essential: analytics+ads+hints — silent fail, empty space), React error boundaries (boundary per feature zone: catches render errors; logs to Sentry; renders fallback UI from boundary props; never crashes parent zone), fallback strategy (1. React Query cache: serve stale data with 'may be outdated' label; 2. SW cache: last known API response; 3. Static placeholder: maintains layout; 4. Empty/hide: non-essential zones), feature flags (LaunchDarkly or custom flag service: disable_recommendations=true → component returns null; remote kill switch without deploy; gradual re-enable: 1%→10%→100% rollout), health dashboard (circuit breaker states real-time: green=closed, amber=half-open, red=open; error rate sparklines per service; auto-alert on open &gt;60s)."
          caption="Circuit breaker state machine (Closed→Open 5 errors/10s, Half-Open probe after 30s), P0/P1/P2 feature priority tiers (critical never shed, enhanced fallback to cache, non-essential silent fail), React error boundaries per zone, 4-tier fallback strategy (React Query cache → SW cache → static placeholder → hide), feature flag kill switch, real-time degradation dashboard"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Frontend Circuit Breaker Implementation</h3>
        <p>A frontend circuit breaker is a class that wraps API calls and tracks their success/failure rates. Implementation: the circuit breaker maintains a sliding window of the last N requests (using a circular buffer of timestamps and outcomes). When the error rate in the window exceeds the threshold, the circuit opens. In the Open state, the execute() method immediately returns a rejected promise with a CircuitOpenError, bypassing the actual API call. The calling code catches this error and renders the fallback. After the cooldown period, the state transitions to Half-Open, and the next execute() call is allowed through — if it succeeds, the circuit closes; if it fails, the circuit returns to Open with a fresh cooldown.</p>
        <p>Each API endpoint or microservice dependency gets its own circuit breaker instance, stored in a React context (CircuitBreakerProvider). The configuration is per-service: the recommendations service has a low threshold (3 errors in 10s, fast to open because it is non-critical) while the authentication service has a high threshold (20 errors in 10s, slow to open because it is critical). The circuit breaker state is persisted in React state, not localStorage — circuit breaker state should be local to the current session (a new page load retries all services fresh).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">React Error Boundaries</h3>
        <p>React error boundaries catch rendering errors (thrown during render, in lifecycle methods, or in constructor) within their subtree and render a fallback UI instead. Each feature zone (recommendations, search, notifications, product listing) is wrapped in its own ErrorBoundary component with a zone-specific fallback. The ErrorBoundary's fallback prop determines what to show: for recommendations, the fallback is a static list of generic popular items (maintaining the layout width); for notifications, the fallback is an empty badge (the bell icon with no count); for the checkout flow, the fallback is an error message with a "try again" button that retriggers the ErrorBoundary's componentDidUpdate retry logic.</p>
        <p>Error boundaries do not catch: async errors (unhandled promise rejections), event handler errors (onClick, onChange), or errors in the error boundary itself. For async errors (fetch failures), the pattern is to catch the error in the data-fetching hook and throw it as a synchronous render error that the boundary will catch: if (error) throw error inside the render function (React Query's throwOnError option does this automatically). Event handler errors must be caught manually and fed into component state as an error flag that triggers a conditional render of the error state.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Fallback Content Strategy</h3>
        <p>The fallback hierarchy for non-critical features: (1) React Query stale cache — if the data was successfully fetched in the last session and React Query's stale time allows, render the stale data with a subtle "Last updated X minutes ago" label. This is the best fallback — the layout is identical to the success state and the content is real. (2) Service worker cache — if React Query has no in-memory cache but the service worker has a cached API response from a previous visit, use that. (3) Static placeholder — a muted, non-interactive version of the component that maintains its space in the layout. For a recommendations carousel, this is a row of grey rounded rectangles with the same dimensions as real cards. This prevents layout shift when the real content loads. (4) Collapse/hide — if showing a placeholder would be more confusing than hiding the section, remove it from the DOM entirely and let the adjacent layout flow into the space.</p>
        <p>The fallback selection logic is encoded in a useFallback hook that takes the API loading/error state and returns the appropriate FallbackLevel enum. Components use this hook to decide what to render rather than writing if-error-then logic inline. This centralizes the fallback strategy and makes it easy to change the policy globally.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Health-Check Degradation Mode</h3>
        <p>A global degradation mode (triggered by the health check endpoint returning a degraded status) enables pre-emptive simplification of the UI before individual circuit breakers open. The health check endpoint (GET /api/health) returns a JSON response with the status of each dependency: &#123;"status": "degraded", "services": &#123;"recommendations": "down", "search": "slow", "auth": "healthy"&#125;&#125;. The frontend fetches this endpoint on page load and every 30 seconds. When a service is flagged as "down," the corresponding circuit breaker is pre-opened (skipping the failure accumulation phase), and the feature is immediately shown in its fallback state. This provides a faster user experience than waiting for 5 failed API calls to open the circuit organically.</p>
        <p>The degraded mode banner ("Some features are temporarily unavailable. Our team is working on it.") is shown when any non-critical circuit is open. It auto-dismisses when all circuits close. A "Show details" link expands the banner to show which specific features are affected and an estimated recovery time (pulled from the health check endpoint's estimated_recovery field, which engineering sets when they page an incident).</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Circuit breaker threshold tuning: setting the threshold too low (opens on 2 errors in 10s) causes false positives — a brief network blip opens the circuit and hides the feature unnecessarily. Setting it too high (opens on 50 errors in 10s) allows the degraded service to hammer users with failures for longer before the circuit opens. Threshold tuning requires understanding the normal error rate of each service (ambient failures from timeouts, transient 5xx) and setting the circuit threshold above the ambient rate but below the failure-mode rate. Per-service thresholds are better than a single global threshold.</p>
        <p>Progressive enhancement as the degradation baseline: true progressive enhancement (the page works without JavaScript entirely, enhanced by JS) is the ultimate graceful degradation — even if the entire client-side JS bundle fails to load, the user gets a functional HTML response from SSR. For modern SPAs, full progressive enhancement is rarely achievable, but the philosophy applies: each enhancement layer (JS interactivity, real-time updates, personalization) should be optional rather than required for basic functionality. An app where the core read experience works without any client-side data fetching (all data in SSR) is inherently more resilient than an app where the page is blank without successful API calls.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A graceful degradation system is built on four pillars: (1) circuit breakers per dependency (sliding window, Closed/Open/Half-Open state machine, per-service thresholds, Open state returns fallback immediately bypassing network); (2) React error boundaries per feature zone (zone-specific fallback UI, async errors surfaced via throwOnError, event errors caught manually); (3) priority-tiered UI (P0 critical — isolated, never shed; P1 enhanced — circuit-breaker-wrapped, cached fallbacks; P2 non-essential — silent fail); and (4) health-check-driven pre-degradation (GET /api/health every 30s, pre-open circuits for flagged services, degradation banner with recovery ETA). The defining principle: every non-critical dependency must have an explicit fallback before it is integrated — the question "what does this feature look like when its API is down?" must be answered in the design phase, not discovered in production.</p>
      </section>
    </ArticleLayout>
  );
}
