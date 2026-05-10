"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-third-party-sdk-integration",
  title: "Design Third-Party SDK Integration",
  description:
    "Production-grade SDK integration with async loading, error isolation, version pinning, and graceful degradation.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "third-party-sdk-integration",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-06",
  tags: ["lld", "sdk-integration", "third-party", "error-isolation", "performance"],
  relatedTopics: ["telemetry-analytics-pipeline", "feature-flag-system"],
};

export default function ThirdPartySDKIntegrationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Modern web applications integrate multiple third-party SDKs: analytics (Segment, Mixpanel), payments (Stripe), maps (Google Maps, Mapbox), customer support (Intercom, Zendesk), A/B testing (LaunchDarkly, Optimizely), video (Mux, Vimeo), and authentication (Auth0, Okta). Each SDK is a foreign code execution context running inside the application's JavaScript environment. A bug in any one of them—a runtime error, an infinite loop, an API that throws unexpectedly—can crash the entire application. A slow SDK initialization delays the application's time to interactive. A CDN outage for an SDK script makes features dependent on that SDK unavailable.</p>
        <p>The discipline of third-party SDK integration is about building boundaries: keeping SDK failures from becoming application failures, keeping SDK loading from blocking the critical rendering path, keeping SDK behavior observable so anomalies are detected, and keeping SDK dependencies manageable so upgrades don't require coordinated code changes across the codebase.</p>
        <p><strong>Explicit assumptions:</strong> SDKs are loaded from third-party CDNs (not bundled into the application build). Loading is asynchronous. SDK APIs are async (initialization may take 1-5 seconds). The application must degrade gracefully when any SDK fails to load or errors at runtime. SDK version updates should not require code changes (via version pinning with controlled updates).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Async loading:</strong> SDK scripts load asynchronously without blocking HTML parsing or the application's JavaScript execution.</li>
          <li><strong>Stub/queue pattern:</strong> Calls to SDK APIs made before the SDK has loaded are queued and replayed once the SDK initializes, so the calling code doesn't need to check readiness.</li>
          <li><strong>Error isolation:</strong> A runtime error in an SDK does not propagate to the application's error boundary. SDK errors are caught, logged, and silently swallowed.</li>
          <li><strong>Timeout handling:</strong> If an SDK fails to load within a configurable timeout (5 seconds), the application proceeds without it. No blocking wait for SDK readiness.</li>
          <li><strong>Version pinning:</strong> SDK script URLs reference a specific version, not a floating "latest." Version updates are intentional and tested.</li>
          <li><strong>Subresource Integrity (SRI):</strong> Script tags include integrity hashes to prevent compromised CDN delivery of tampered SDK code.</li>
          <li><strong>Graceful degradation:</strong> Features that depend on a failed SDK display appropriate fallbacks rather than broken states or blank UI sections.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> SDK loading must not increase Time to Interactive (TTI). All SDKs loaded with defer or async; no render-blocking scripts.</li>
          <li><strong>Reliability:</strong> Application core functionality must work when any one (or all) third-party SDKs are unavailable.</li>
          <li><strong>Security:</strong> SDK scripts verified via SRI hashes. No CDN-injected code can execute without matching the expected hash.</li>
          <li><strong>Observability:</strong> SDK initialization times, error rates, and API call failures are tracked in the application's error monitoring.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>Each SDK integration follows a common pattern: a wrapper module that encapsulates the SDK, providing a stable API to the rest of the application while abstracting the SDK's specific loading and initialization details. The wrapper handles: injecting the SDK script into the DOM asynchronously, implementing the stub/queue pattern for pre-load API calls, catching and logging SDK errors, implementing timeouts, and providing a degraded fallback when the SDK is unavailable.</p>
        <p>The rest of the application uses only the wrapper's API—never calling the SDK directly. This creates a boundary: if the SDK's API changes in a new version, only the wrapper needs to be updated, not every call site in the application. If the SDK needs to be swapped out (replacing Intercom with Zendesk), only the wrapper changes. This is the Adapter pattern applied to third-party SDKs.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/third-party-sdk-integration.svg"
          alt="Third-party SDK integration showing async deferred loading with stub queue pattern, React error boundary isolation, sandboxed iframe for untrusted SDKs, SRI hash verification, version pinning, and graceful degradation on SDK failure"
          caption="Third-party SDK integration showing async deferred loading with stub queue pattern, React error boundary isolation, sandboxed iframe for untrusted SDKs, SRI hash verification, version pinning, and graceful degradation on SDK failure"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Async Script Loading Pattern</h3>
        <p>Third-party SDK scripts should never be loaded as synchronous script tags in the HTML head. A synchronous script tag blocks HTML parsing until the script downloads and executes—potentially adding 500ms-2s to Time to Interactive if the CDN is slow. Instead, use one of two async patterns: the script tag with async or defer attributes, or the programmatic script injection pattern.</p>
        <p>The async attribute downloads the script in parallel with HTML parsing and executes it as soon as it downloads (interrupting parsing if necessary). The defer attribute downloads in parallel and executes after HTML parsing is complete. For SDKs that don't need to run immediately on parse, defer is preferred—it guarantees the DOM is ready when the SDK runs and doesn't interrupt the parser. For SDKs that need to run as early as possible (A/B testing SDKs that must modify content before first render), async is necessary, and the script URL should be self-hosted or cached aggressively to minimize the download time.</p>
        <p>Programmatic injection (creating a script element via JavaScript and appending it to the document) is equivalent to async in terms of non-blocking behavior. It's useful when the decision to load an SDK is conditional (only load Intercom if the user is authenticated, only load the analytics SDK if consent is granted). The script element is created with src set to the version-pinned SDK URL and integrity set to the SRI hash, then appended to document.head.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Stub and Queue Pattern</h3>
        <p>Most analytics and support SDKs recommend a snippet that immediately creates a stub object on window before the SDK script loads. The stub records API calls in an array; when the SDK loads, it processes the queued calls. This pattern allows code like analytics.track("page_view") to be called immediately in the application's startup sequence, even though the analytics SDK may not have finished loading yet.</p>
        <p>Implementing a custom stub for a wrapper module: on initialization, the wrapper creates a queue array and a proxy object that pushes each API call (method name + arguments) onto the queue. When the SDK script loads and calls the wrapper's onReady() callback, the wrapper drains the queue by calling the real SDK methods with the queued arguments. Any future calls go directly to the real SDK. This pattern works for fire-and-forget calls (analytics events, log calls); it doesn't work for calls that return values (the stub cannot return a meaningful value before the SDK loads).</p>
        <p>For calls that need return values (e.g., fetching the user's A/B test variant), the stub returns a Promise that resolves when the SDK loads and the real call completes. The calling code awaits this Promise. The wrapper's timeout mechanism rejects the Promise after 5 seconds if the SDK has not loaded—the calling code can then use a default value rather than waiting indefinitely.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Error Isolation via Try-Catch and Error Boundaries</h3>
        <p>All calls to the SDK through the wrapper are wrapped in try-catch. If the SDK throws synchronously (a bug in the SDK, an API contract violation), the exception is caught, logged to the application's error monitoring, and the wrapper returns a safe default (null, an empty array, or a rejected Promise with a descriptive error). The application's code, which receives the safe default, handles it gracefully.</p>
        <p>Asynchronous SDK errors (unhandled promise rejections from SDK code, setTimeout callbacks that throw) are harder to isolate because they don't propagate through the wrapper's try-catch. The global window.onerror and window.onunhandledrejection handlers should categorize errors by source (check if the stack trace originates from a known SDK file path) and route SDK errors to a separate error bucket rather than the application's primary error alert channel. SDK errors are expected and should not page on-call engineers at 3am.</p>
        <p>React Error Boundaries provide UI-level isolation: wrapping SDK-dependent components in an Error Boundary ensures that a rendering error caused by a SDK's data (e.g., a malformed response from the Intercom API causing a React render to throw) does not crash the entire application. The Error Boundary catches the error and renders a fallback UI for just that section.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Version Pinning and SRI</h3>
        <p>Third-party CDN scripts referenced by a floating version (https://cdn.segment.com/analytics.js/latest/analytics.min.js) can change without warning—the SDK vendor can push a breaking change or, in a supply chain attack, a compromised CDN can serve modified JavaScript. Both risks are mitigated by version pinning and Subresource Integrity (SRI).</p>
        <p>Version pinning references the specific version in the URL: https://cdn.segment.com/analytics.js/4.15.3/analytics.min.js. The application only updates to a newer version after testing the new version in a staging environment. Some SDK vendors provide a changelog and semantic versioning guarantee; others do not—always verify what constitutes a "safe" version update for each SDK.</p>
        <p>SRI adds a cryptographic hash to the script tag: &lt;script src="..." integrity="sha384-{"{"}hash{"}"}" crossorigin="anonymous"&gt;. The browser verifies the downloaded script matches the hash before executing it. If the CDN delivers a different file (due to tampering, caching corruption, or a CDN misconfiguration), the browser refuses to execute it. SRI hashes must be regenerated when the SDK version changes—they are specific to the exact file bytes of a given version. Some CDN providers publish SRI hashes alongside their SDK downloads; others require generating the hash with openssl dgst -sha384 -binary analytics.min.js | openssl base64 -A.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Timeout and Graceful Degradation</h3>
        <p>An SDK that never loads (CDN down, script blocked by corporate firewall, network timeout) should not prevent the application from becoming interactive. The wrapper sets a timeout (typically 5 seconds) using a Promise.race between the SDK's onLoad callback and a timeout Promise. If the timeout fires first, the wrapper transitions to a "degraded" state: all API calls return safe defaults (or no-ops for fire-and-forget), and the wrapper exposes an isAvailable() method that returns false.</p>
        <p>The application code checks isAvailable() (or handles the safe defaults) to decide whether to show SDK-dependent UI. For analytics: if the analytics SDK is unavailable, continue operating normally—events are lost but the product works. For the payment SDK (Stripe): if Stripe.js fails to load, the payment form is replaced with a "Payment processing is temporarily unavailable. Please try again later." message—the application cannot safely accept card data without Stripe's hosted fields. The degradation behavior must be designed per SDK based on how critical the SDK's functionality is.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Observability and Performance Monitoring</h3>
        <p>SDK initialization time should be measured and tracked as a performance metric. Using the Performance API: mark("sdk_load_start") before injecting the script, mark("sdk_load_end") in the SDK's onLoad callback, then measure("sdk_load", "sdk_load_start", "sdk_load_end") to compute the delta. Send this measurement to the application's performance monitoring (or the analytics SDK itself, once it loads). Tracking initialization time over time allows detecting regressions (an SDK update that slows initialization by 500ms) before users report it.</p>
        <p>SDK error rates should be tracked separately from application error rates in monitoring dashboards. An SDK with a 2% error rate on API calls is normal and expected; the same error rate from application code would be a severity-1 incident. Separating the buckets prevents SDK noise from drowning out application signals. Tag SDK errors with the SDK name (tag: "stripe-sdk", "segment-sdk") in the error monitoring system and create separate alert rules with higher thresholds for SDK errors.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Bundling versus CDN loading for SDKs: bundling SDK code into the application's JavaScript bundle is more reliable (no external CDN dependency, no SRI complexity, all code under version control) but increases bundle size and means SDK updates require a full application deploy. CDN loading keeps the bundle small and allows SDK updates independently of the application, but introduces the reliability and security concerns described above. For payment SDKs (Stripe.js must be loaded from Stripe's CDN for PCI compliance), CDN loading is required. For other SDKs, bundling is often the better choice for reliability.</p>
        <p>Sandboxed iframes for untrusted SDKs: for SDKs from vendors with limited trust (ad networks, affiliate tracking pixels), sandboxed iframes provide a stronger isolation boundary than JavaScript error catching. A sandboxed iframe (sandbox="allow-scripts allow-same-origin") cannot access the parent page's DOM, localStorage, or cookies. This prevents a compromised or malicious SDK from exfiltrating user data. The trade-off is that sandboxed iframes cannot call back into the parent page without postMessage, which requires designing a specific message API.</p>
        <p>Monitoring SDK-induced layout shifts: some SDKs inject UI elements (chat widgets, cookie banners, pop-ups) that cause Cumulative Layout Shift (CLS), a Core Web Vital. SDKs that inject elements after initial render push content down or sideways as the user is reading, creating a poor experience. Measure CLS before and after adding any SDK that modifies the DOM. Reserve space for expected SDK UI insertions (e.g., a fixed-height placeholder for the cookie banner) to prevent layout shifts.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>Production third-party SDK integration requires: async script loading (defer attribute or programmatic injection, never synchronous head tags), the stub/queue pattern to handle pre-load API calls without blocking, try-catch isolation and React Error Boundaries to contain SDK errors, version pinning and SRI hashes to prevent supply chain attacks and unexpected breaking changes, and a 5-second timeout with graceful degradation for each SDK. The Adapter pattern (wrapping each SDK in a module that exposes a stable API) creates a maintainability boundary: SDK swaps and upgrades are contained to one file. SDK initialization times and error rates should be tracked separately from application metrics, with higher alert thresholds reflecting the lower reliability expectations for third-party code. Graceful degradation behavior is designed per SDK based on how critical its functionality is to the application's core value proposition.</p>
      </section>
    </ArticleLayout>
  );
}
