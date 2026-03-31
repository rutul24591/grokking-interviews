"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-analytics-tracking-page-view-tracking",
  title: "Page View Tracking",
  description: "Staff-level guide to page view tracking: SPA vs MPA detection, session management, sampling strategies, data quality, and privacy compliance for analytics at scale.",
  category: "frontend",
  subcategory: "analytics-tracking",
  slug: "page-view-tracking",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: ["frontend", "analytics", "tracking", "page-views", "sessions", "privacy", "data-quality"],
  relatedTopics: ["event-tracking", "user-journey-tracking", "analytics-tools-integration", "privacy-compliant-tracking"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Page view tracking</strong> is the systematic capture and recording of user navigation through a web application. Each page view represents a user visiting a distinct URL or route, and tracking these views forms the foundation of web analytics—enabling measurement of traffic, engagement, content performance, and user behavior patterns.
        </p>
        <p>
          While conceptually simple ("record when a user loads a page"), page view tracking becomes complex in modern web applications. Single-page applications (SPAs) don't trigger full page reloads, requiring manual route change detection. Privacy regulations (GDPR, CCPA) require consent before tracking. Ad blockers and browser privacy features (ITP, ETP) block or limit tracking. High-traffic sites need sampling to manage data volume and cost.
        </p>
        <p>
          For staff/principal engineers, page view tracking requires balancing four competing concerns. <strong>Data Accuracy</strong> means tracking all page views reliably without duplicates or gaps. <strong>Performance</strong> means tracking must not impact page load or user experience. <strong>Privacy Compliance</strong> means respecting user consent and regulatory requirements. <strong>Cost Management</strong> means high-traffic sites need sampling to control analytics costs.
        </p>
        <p>
          The business impact of page view tracking decisions is significant and multifaceted. Page views are the primary metric for site traffic, and inaccurate tracking leads to wrong capacity planning and business decisions. Page view data identifies popular content, informing editorial and product decisions. Search engines use traffic signals for ranking, so understanding page views helps optimize SEO strategy. Ad inventory and pricing are often based on page views, meaning inaccurate tracking directly impacts revenue.
        </p>
        <p>
          In system design interviews, page view tracking demonstrates understanding of event-driven architecture, distributed systems, data quality, and the trade-offs between accuracy, performance, and cost. It shows you think about production realities, not just feature implementation.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/analytics-tracking/spa-vs-mpa-tracking.svg"
          alt="Comparison of page view tracking in Multi-Page Applications (automatic tracking on each page load) versus Single-Page Applications (manual tracking via router hooks)"
          caption="SPA vs MPA tracking — MPA automatically tracks on each page load, while SPA requires manual tracking via router hooks like useEffect or router.events"
        />

        <h3>Page View vs. Session</h3>
        <p>
          Understanding the distinction between page views and sessions is fundamental to analytics. A <strong>page view</strong> is a single instance of a user loading a specific page or URL—each navigation creates a new page view. A <strong>session</strong> is a continuous period of user activity, where multiple page views belong to one session. Sessions expire after inactivity, typically 30 minutes.
        </p>
        <p>
          For example, a user visits the homepage (1 page view), clicks to an article (2 page views), reads for 5 minutes, then clicks to another article (3 page views). This is 3 page views in 1 session. Understanding this distinction matters because session-level metrics (bounce rate, pages per session, session duration) behave differently from page-level metrics (page views, unique page views, time on page).
        </p>

        <h3>SPA vs. MPA Tracking</h3>
        <p>
          Tracking differs fundamentally between multi-page applications (MPA) and single-page applications (SPA). In an MPA, each navigation triggers a full page reload. The analytics script loads on each page and automatically tracks the page view. Implementation is simple—just include the analytics snippet on all pages. The main challenge is ensuring consistent tracking across all pages.
        </p>
        <p>
          In an SPA, navigation happens via client-side routing without page reloads. The analytics script loads once on initial page load, but subsequent navigations don't trigger automatic tracking. You must manually detect route changes and fire page view events. Implementation requires hooking into the router (React Router's useEffect on location change, Next.js router.events, Vue Router's afterEach). The challenge is avoiding duplicate tracking, handling browser back/forward buttons, and correctly tracking the initial load.
        </p>
        <p>
          The key insight is that SPA tracking requires explicit instrumentation. The analytics script loads once, but must be notified of each route change. This is typically done by creating a tracking utility that abstracts the analytics provider, then calling <code>trackPageView(path, title)</code> from router hooks.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/analytics-tracking/session-management.svg"
          alt="Session management architecture showing first visit session ID generation, subsequent page view tracking, timeout checking, and session continuation vs new session creation"
          caption="Session management — generate session ID on first visit, persist in cookie, update last_activity on each page view, create new session after 30 minutes of inactivity"
        />

        <h3>Session Management</h3>
        <p>
          Sessions group related page views together, and session management involves several key components. The <strong>session ID</strong> is a unique identifier for each session, generated on the first page view. The <strong>session timeout</strong> determines when sessions expire after inactivity—typically 30 minutes. New activity after timeout creates a new session. <strong>Session storage</strong> stores the session ID in a cookie or localStorage for persistence across page views. <strong>Cross-device</strong> tracking recognizes that the same user on different devices creates different sessions, but user login can stitch sessions together.
        </p>
        <p>
          Session attribution is important for marketing analysis. The first page view in a session captures traffic source information like UTM parameters and referrer. Subsequent page views inherit this attribution. This means if a user arrives via Google Ads, views 5 pages, and converts on the 5th page, the conversion is attributed to Google Ads.
        </p>
        <p>
          Implementation typically involves generating a UUID on first visit, storing it in a cookie with a long expiry (2 years for returning user recognition), and updating a last_activity timestamp on each page view. If the current time minus last_activity exceeds 30 minutes, a new session ID is generated.
        </p>

        <h3>Sampling Strategies</h3>
        <p>
          High-traffic sites often sample page views to manage data volume. Analytics costs scale with volume—100 million page views per month costs 10x more than 10 million. Sampling tracks only a percentage of page views, such as 10% or 1%. Consistent sampling uses consistent hashing (e.g., hash session_id) to ensure the same user is always sampled the same way. Weighting multiplies sampled metrics by 1/sample_rate for accurate totals.
        </p>
        <p>
          For example, with a 10% sample rate, if you see 1,000 page views in the sample, actual traffic is 10,000. All metrics like bounce rate and time on page remain statistically accurate. The key insight is that sampling reduces cost while maintaining statistical accuracy for aggregate metrics.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/analytics-tracking/sampling-architecture.svg"
          alt="Page view sampling architecture showing all page views tracked without sampling versus 10% sampled tracking using hash-based consistent sampling"
          caption="Sampling architecture — 10% sampling provides statistically accurate data at 10% of the cost; use consistent hashing (hash session_id mod 100) for same-user tracking"
        />

        <h3>Data Quality</h3>
        <p>
          Page view data quality depends on completeness, accuracy, and consistency. <strong>Completeness</strong> asks whether all page views are captured—ad blockers, script errors, and network failures cause gaps. <strong>Accuracy</strong> asks whether page views are counted correctly—duplicates, bot traffic, and SPA misconfiguration cause inflation. <strong>Consistency</strong> asks whether tracking is consistent across pages and time—changes in implementation cause breaks in trends.
        </p>
        <p>
          Monitoring is essential for maintaining data quality. Track page view volume over time. Sudden drops indicate tracking failures. Sudden spikes indicate duplicates or bot traffic. Set up alerts for anomalies so you can investigate and fix issues quickly.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          A robust page view tracking architecture treats tracking as a first-class system with proper error handling, monitoring, and privacy controls.
        </p>

        <h3>SPA Page View Tracking Architecture</h3>
        <p>
          For single-page applications, implement tracking by hooking into router navigation events. In React Router, use a useEffect hook that depends on the location object. In Next.js, use router.events.on('routeChangeComplete'). In Vue Router, use router.afterEach(). Fire the page view event on each navigation with the new path and page title.
        </p>
        <p>
          Track the initial page view on app mount separately from route changes to avoid duplicate tracking. Debounce rapid navigation to prevent tracking intermediate states when users navigate quickly. Wrap tracking in try-catch to ensure tracking errors never break the application.
        </p>
        <p>
          Create a tracking utility that abstracts the analytics provider. Call <code>trackPageView(path, title)</code> from router hooks. This abstraction makes it easy to switch analytics providers later without changing application code.
        </p>

        <h3>Session Management Architecture</h3>
        <p>
          Implement session management by generating a UUID on first visit and storing it in a cookie. Cookies are preferred over localStorage because they're sent with requests (enabling server-side tracking) and have better browser support for cross-tab sharing. Set the cookie with a long expiry like 2 years for returning user recognition.
        </p>
        <p>
          Track a last_activity timestamp and update it on each page view. If the current time minus last_activity exceeds 30 minutes, generate a new session ID. This creates a new session for returning users while maintaining continuity for active users.
        </p>
        <p>
          Use the same session ID across tabs by storing in a shared cookie. When a user opens multiple tabs, all tabs should report the same session ID so session-level metrics are accurate.
        </p>

        <h3>Consent Gating Architecture</h3>
        <p>
          Implement consent gating by checking consent status before firing any page view. If consent has not yet been given, queue page views in memory. When consent is granted, flush the queue and send all queued events. If the user withdraws consent, stop tracking immediately and delete any queued events.
        </p>
        <p>
          Wrap the tracking function with a consent check. If no consent, push to a queue array. When consent is granted, iterate through the queue and send each event, then clear the queue. Store consent choice in a cookie or localStorage, and sync to backend for server-side tracking.
        </p>

        <h3>Error Handling</h3>
        <p>
          Tracking should never break the application. Wrap all tracking calls in try-catch blocks. Set a timeout for tracking requests (e.g., 2 seconds) so slow analytics endpoints don't hang. If tracking fails, don't retry excessively—log the error and move on. Log tracking errors separately for monitoring so you can detect and fix issues.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Page view tracking involves trade-offs between accuracy, performance, and cost. Tracking 100% of page views provides the best accuracy but incurs the highest cost and more requests impacting performance. Sampled tracking at 10% provides good statistical accuracy at much lower cost. Consent-gated tracking provides fair accuracy depending on consent rate, with variable cost based on how many users consent.
        </p>
        <p>
          The staff-level insight is that sampling is often necessary for high-traffic sites. A 10% sample rate provides statistically accurate data at 10% of the cost. For sites with millions of page views per month, this trade-off is essential for cost management while maintaining analytical value.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Create a tracking utility that abstracts the analytics provider, making it easy to switch providers later. Hook into the router for SPAs to detect route changes automatically. Don't forget to track the initial page view on app mount—this is a common oversight.
        </p>
        <p>
          Implement proper session management with timeout and ID persistence. Check consent before tracking and queue events until consent is given. For high-traffic sites, sample page views to control costs while maintaining statistical accuracy.
        </p>
        <p>
          Wrap tracking in try-catch so tracking errors never break the application. Track page view volume over time and alert on sudden drops or spikes. Filter out internal and developer traffic from analytics to keep data clean. Document the tracking implementation for team reference and onboarding.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is not tracking SPA routes—only tracking the initial load and missing all route changes. This results in massive undercounting of page views. Another common issue is duplicate tracking, where both the initial load and first route change are tracked, resulting in double-counting.
        </p>
        <p>
          Missing session management causes each page view to be counted as a new session, inflating session count and breaking metrics like bounce rate and pages per session. Not checking consent before tracking violates GDPR and CCPA, risking significant fines.
        </p>
        <p>
          Synchronous tracking that blocks page render hurts performance—always track asynchronously. Not monitoring tracking health means you won't know when tracking breaks. Without monitoring, tracking failures can go undetected for weeks or months.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>News Site: SPA Migration</h3>
        <p>
          A news site migrated from MPA to Next.js SPA, and page view tracking broke—only the initial load was tracked. The solution was implementing router-based tracking using Next.js router events, tracking initial load separately from route changes, and adding debounce to prevent duplicates. Page view tracking was restored to 100% accuracy with no duplicates, and historical comparisons remained valid.
        </p>

        <h3>E-Commerce: Session Management</h3>
        <p>
          An e-commerce site had inflated session counts because each page view was counted as a new session. The solution was implementing a session ID stored in a cookie with a 30-minute timeout. The session ID persisted across page views, grouping related page views into sessions. Session count dropped 80% (becoming accurate), and metrics like bounce rate and pages per session became meaningful.
        </p>

        <h3>Media Site: GDPR Compliance</h3>
        <p>
          A media site needed GDPR compliance for page view tracking. The solution was implementing consent gating—queueing page views until user consents, firing queued events on consent, and respecting withdrawal immediately. The site achieved GDPR compliance with a 65% consent rate and zero compliance incidents.
        </p>

        <h3>High-Traffic Site: Sampling</h3>
        <p>
          A high-traffic site with 100 million page views per month had prohibitive analytics costs. The solution was implementing 10% sampling using consistent hashing (hash session_id). Metrics were multiplied by 10 for accurate totals. Analytics costs were reduced 90% while maintaining statistical accuracy for all metrics.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: How do you track page views in a single-page application (SPA)?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              SPA page view tracking requires manual instrumentation because route changes don't trigger page reloads. Hook into the router's navigation events—for React Router, use a useEffect hook on location change; for Next.js, use router.events; for Vue Router, use router.afterEach(). Track the initial page view on app mount separately from route changes to avoid double-counting. Fire the page view event on each navigation with the new path and title. Debounce rapid navigation to prevent tracking intermediate states.
            </p>
            <p>
              The key insight is that SPA tracking requires explicit instrumentation. The analytics script loads once, but must be notified of each route change.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do you manage sessions in page view tracking?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Generate a UUID on first visit and store it in a cookie (preferred) or localStorage. Track a last_activity timestamp and update it on each page view. If current time minus last_activity exceeds 30 minutes, create a new session by generating a new session ID. Use the same session ID across tabs by storing in a shared cookie.
            </p>
            <p>
              Sessions group related page views together. Without session management, each page view is counted as a new session, inflating session count and breaking metrics like bounce rate and pages per session.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you implement GDPR-compliant page view tracking?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Check consent before firing any page view. If consent has not yet been given, queue page views in memory. When consent is granted, flush the queue and send all queued events. If the user withdraws consent, stop tracking immediately and delete any queued events. Store consent choice in a cookie or localStorage, and sync to backend for server-side tracking.
            </p>
            <p>
              Non-compliance can result in fines up to 4% of global revenue under GDPR. Consent gating is critical.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What is sampling and when should you use it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Sampling tracks only a percentage of page views (e.g., 10%, 1%) instead of 100%. Analytics costs scale with volume, so sampling reduces cost while maintaining statistical accuracy. Use consistent hashing (e.g., hash session_id) to ensure the same user is always sampled the same way. Multiply sampled metrics by 1/sample_rate for accurate totals.
            </p>
            <p>
              Use sampling for high-traffic sites (10M+ page views/month). A 10% sample rate provides statistically accurate data at 10% of the cost.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you monitor page view tracking health?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Track page view volume over time—sudden drops indicate tracking failures, and sudden spikes indicate duplicates or bot traffic. Track tracking errors and alert on elevated error rates. Track consent rate and alert on sudden drops which indicate consent banner issues. Verify actual sampling rate matches expected rate.
            </p>
            <p>
              Monitoring is critical because tracking failures are silent—the app works, but data is missing. You need alerts to know when tracking breaks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What are common causes of page view tracking failures?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              SPA misconfiguration where route changes aren't tracked, only initial load. Ad blockers blocking analytics scripts, losing 10-30% of traffic. JavaScript errors preventing tracking from firing. Network failures causing tracking requests to fail silently. Consent issues where the consent banner isn't showing or consent isn't being recorded. Router API changes breaking tracking integration.
            </p>
            <p>
              Mitigation: Monitor volume, implement error handling, use server-side tracking as backup, and test after deployments.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developers.google.com/analytics/devguides/collection/ga4/pages" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google Analytics: Page Views
            </a> — GA4 page view tracking documentation.
          </li>
          <li>
            <a href="https://segment.com/academy/collecting-data/best-practices-for-implementing-page-views/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Segment: Page View Best Practices
            </a> — Comprehensive guide to page view implementation.
          </li>
          <li>
            <a href="https://nextjs.org/docs/app/building-your-application/routing/router-events" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Next.js: Router Events
            </a> — Next.js router events for SPA tracking.
          </li>
          <li>
            <a href="https://reactrouter.com/en/main/start/tutorial" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Router Documentation
            </a> — React Router integration for tracking.
          </li>
          <li>
            <a href="https://gdpr.eu/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GDPR.eu
            </a> — GDPR compliance guide for businesses.
          </li>
          <li>
            <a href="https://plausible.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Plausible Analytics
            </a> — Privacy-friendly, lightweight analytics alternative.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
