"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "feature-detection",
  title: "Feature Detection",
  description:
    "Comprehensive guide to browser feature detection strategies — using capability checks over user-agent sniffing, Modernizr patterns, CSS @supports, JavaScript API detection, and building adaptive experiences based on device capabilities.",
  category: "frontend",
  subcategory: "error-handling-monitoring",
  slug: "feature-detection",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-31",
  tags: [
    "feature-detection",
    "browser-compatibility",
    "Modernizr",
    "CSS-supports",
    "progressive-enhancement",
  ],
  relatedTopics: [
    "graceful-degradation",
    "error-boundaries",
    "user-error-messages",
  ],
};

export default function FeatureDetectionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section className="mb-12">
        <h2>Definition &amp; Context</h2>
        <p className="mb-4">
          <strong>Feature detection</strong> is the practice of programmatically
          testing whether a browser or runtime environment supports a specific
          API, property, or behavior before attempting to use it. Rather than
          asking &quot;which browser is the user running?&quot; feature detection
          asks &quot;can this environment do what I need?&quot; This
          capability-first approach is the foundation of robust cross-browser
          engineering. At the staff and principal level, feature detection is not
          merely a defensive coding technique — it is an architectural
          philosophy that determines how entire product experiences are tiered,
          how polyfill budgets are managed, and how teams ship confidently to a
          fragmented device landscape without maintaining parallel codebases.
        </p>
        <p className="mb-4">
          Feature detection rose to prominence as the web matured beyond the
          early browser wars, where developers relied on <strong>user-agent
          sniffing</strong> to determine which browser was rendering a page.
          User-agent strings proved deeply unreliable: browsers deliberately
          spoofed each other&apos;s UA tokens for compatibility, new browsers
          appeared that existing UA parsers could not recognize, and embedded
          WebViews presented entirely custom UA strings that bore no
          resemblance to any known browser. A UA-sniffing approach that worked
          in January could break by March when Chrome shipped a new version or a
          device manufacturer shipped a custom WebView. Feature detection
          eliminated this fragility by testing actual capability rather than
          inferred identity.
        </p>
        <p className="mb-4">
          The principle is straightforward: test whether a property exists on a
          global object, whether a CSS declaration is understood by the
          rendering engine, or whether constructing a particular object
          succeeds. If the test passes, use the feature. If it fails, fall back
          to an alternative. This binary branching enables two complementary
          strategies — <strong>progressive enhancement</strong>, where a
          baseline experience is enriched when capabilities are available, and{" "}
          <strong>graceful degradation</strong>, where a full-featured
          experience strips functionality that the environment cannot support.
          Both strategies depend on accurate, performant feature detection as
          their decision mechanism.
        </p>
        <p>
          For senior architects, feature detection also serves as the gateway
          to <strong>adaptive loading</strong> — an advanced pattern where the
          entire resource payload is shaped by device capabilities. A high-end
          desktop browser with fast networking receives heavy interactive
          visualizations, while a budget Android phone on a 2G connection
          receives a lighter, optimized experience. Feature detection, in this
          broader sense, extends beyond binary API existence checks to encompass
          runtime hardware and network capability assessment, making it a
          cornerstone of modern performance engineering and inclusive design.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section className="mb-12">
        <h2>Core Concepts</h2>

        <h3>JavaScript API Detection</h3>
        <p className="mb-4">
          The most fundamental form of feature detection is checking whether a
          JavaScript property or method exists on a known object. The canonical
          pattern is the <code>in</code> operator or a truthiness check against
          a global object. For example, testing{" "}
          <code>{`"serviceWorker" in navigator`}</code> reveals whether the
          Service Worker API is available without throwing an error or requiring
          a try-catch. Similarly, checking{" "}
          <code>{`typeof IntersectionObserver !== "undefined"`}</code> confirms
          whether the Intersection Observer API is present before instantiating
          one.
        </p>
        <p className="mb-4">
          Property existence checks divide into several categories. A{" "}
          <strong>simple property check</strong> verifies that a namespace or
          property exists on a global like <code>window</code>,{" "}
          <code>navigator</code>, or <code>document</code>. A{" "}
          <strong>method availability check</strong> goes a step further by
          confirming that a specific function is callable — for instance,
          verifying that <code>navigator.share</code> is a function before
          invoking the Web Share API. A{" "}
          <strong>constructor availability check</strong> tests whether a class
          constructor can be invoked, which is critical for APIs like{" "}
          <code>ResizeObserver</code>, <code>MutationObserver</code>, or{" "}
          <code>AbortController</code> that are used via instantiation. Duck
          typing — checking that an object has the expected shape of properties
          and methods — can augment these basic checks when an API might exist
          in name but lack required sub-features. For example, a browser might
          expose a <code>Notification</code> constructor but not support the{" "}
          <code>actions</code> property on notification options. A deeper duck
          type check can probe for these specifics.
        </p>
        <p className="mb-4">
          At the staff level, it is essential to understand the difference
          between an API being <strong>present</strong> and being{" "}
          <strong>functional</strong>. Some browsers expose an API on the global
          object but throw when you try to use it (common with permissions-gated
          APIs like geolocation in insecure contexts). Others may expose a
          method that returns a stub or no-op value. Robust feature detection
          often requires a <strong>probe test</strong> — actually calling the
          API in a controlled way and observing whether it succeeds — rather
          than merely checking for property existence. This is the approach
          Modernizr pioneered for many CSS and HTML5 features.
        </p>

        <h3>CSS Feature Queries</h3>
        <p className="mb-4">
          The <code>@supports</code> at-rule provides native CSS-level feature
          detection. It allows authors to conditionally apply style blocks
          based on whether the browser understands a particular CSS property-value
          pair. For example,{" "}
          <code>{`@supports (display: grid)`}</code> wraps styles that should
          only apply when CSS Grid is supported. Conditions can be combined
          with <code>and</code>, <code>or</code>, and <code>not</code>{" "}
          operators to express complex capability requirements, such as
          requiring both <code>display: grid</code> and{" "}
          <code>gap: 1rem</code> support before applying a grid layout that
          depends on the gap property.
        </p>
        <p className="mb-4">
          On the JavaScript side, the <code>CSS.supports()</code> static method
          mirrors the <code>@supports</code> rule programmatically. It accepts
          either a single property-value pair as two arguments or a full
          condition string, and returns a boolean. This is valuable when CSS
          decisions need to be made in JavaScript — for instance, choosing
          between a CSS-based animation strategy and a JavaScript-driven
          fallback. The combination of <code>@supports</code> in stylesheets
          and <code>CSS.supports()</code> in scripts creates a complete feature
          detection surface for styling capabilities.
        </p>
        <p className="mb-4">
          A key architectural pattern is the <strong>fallback-first</strong>{" "}
          approach: write baseline styles that work everywhere, then use{" "}
          <code>@supports</code> to layer on enhanced styles. This avoids the
          anti-pattern of writing modern CSS first and then trying to undo it
          inside a <code>@supports not</code> block, which is brittle and
          harder to maintain. The fallback-first model aligns naturally with
          progressive enhancement and keeps the CSS cascade predictable.
        </p>

        <h3>Modernizr and Detection Libraries</h3>
        <p className="mb-4">
          Modernizr was the defining feature detection library of the
          responsive web era. Its mechanism is instructive even if you never
          use the library itself. Modernizr works by creating temporary DOM
          elements, applying styles or invoking APIs, and then inspecting the
          results. For CSS detection, it might create a hidden{" "}
          <code>div</code>, apply a CSS property, and check whether the
          computed style reflects the expected value. For JavaScript API
          detection, it performs property existence checks and probe tests
          against the relevant global objects.
        </p>
        <p className="mb-4">
          Modernizr&apos;s most visible feature is its injection of CSS classes
          onto the <code>{`<html>`}</code> element. If a feature is detected,
          a class like <code>flexbox</code> is added; if not, a class like{" "}
          <code>no-flexbox</code> is added. This allows CSS authors to scope
          styles to capability classes without writing any JavaScript in their
          stylesheets — a pattern that predated <code>@supports</code> and
          remains useful for features that <code>@supports</code> cannot
          detect, such as touch support or WebGL availability.
        </p>
        <p className="mb-4">
          Modern applications should use Modernizr judiciously. Its custom
          build tool lets you include only the detects you need, but even so,
          the library adds JavaScript that must be parsed and executed. For
          projects that only need a handful of checks — say, Service Worker
          and IntersectionObserver — writing manual checks is lighter and more
          transparent. Modernizr remains valuable for large-scale projects
          that must detect dozens of features and want a unified, tested
          detection layer rather than scattered one-off checks of varying
          quality.
        </p>

        <h3>User-Agent Sniffing vs Feature Detection</h3>
        <p className="mb-4">
          User-agent sniffing parses the <code>navigator.userAgent</code>{" "}
          string to identify the browser, version, and operating system. This
          approach has a long history of failure. UA strings are{" "}
          <strong>spoofable</strong> — browsers routinely include tokens from
          other browsers for compatibility (Chrome&apos;s UA string contains
          &quot;Safari&quot; and &quot;AppleWebKit&quot;). They are{" "}
          <strong>unpredictable</strong> — new browsers, embedded WebViews,
          and in-app browsers present UA strings that no parser anticipated.
          And they are <strong>decoupled from capability</strong> — knowing
          that a user runs Chrome 120 tells you nothing about whether they
          have disabled certain APIs via flags or enterprise policy, or whether
          they are on a platform where Chrome lacks a feature available on
          other platforms.
        </p>
        <p className="mb-4">
          There are narrow cases where UA information is still necessary.{" "}
          <strong>Analytics and telemetry</strong> benefit from knowing the
          browser distribution of your users. <strong>Targeted bug
          workarounds</strong> for specific browser versions — such as a
          known Safari rendering bug in version 16.3 — may require UA-based
          conditionals because the bug cannot be detected via feature probing.{" "}
          <strong>Compliance and licensing</strong> requirements sometimes
          mandate identifying the rendering engine. In these cases, the{" "}
          <strong>User-Agent Client Hints API</strong> provides a structured,
          opt-in alternative to parsing raw UA strings. The server or client
          requests specific pieces of information (brand, version, platform,
          mobile status) via the <code>navigator.userAgentData</code> object
          or the <code>Sec-CH-UA</code> HTTP headers, receiving clean,
          structured data rather than a freeform string that requires regex
          parsing.
        </p>
        <p className="mb-4">
          The guiding principle for staff engineers is: <strong>use feature
          detection for capability decisions and UA data only for
          observability or known-bug workarounds</strong>. Mixing the two — for
          instance, using UA sniffing to decide whether to show a feature — is
          a maintenance hazard that guarantees future breakage as new browser
          versions ship.
        </p>

        <h3>Runtime Capability Assessment</h3>
        <p className="mb-4">
          Beyond binary API existence checks, modern feature detection extends
          to assessing <strong>device capability at runtime</strong>. The{" "}
          <code>navigator.hardwareConcurrency</code> property reports the
          number of logical CPU cores, indicating how much parallelism the
          device can handle. The <code>navigator.deviceMemory</code> property
          (where available) reports approximate RAM in gigabytes. The{" "}
          <strong>Network Information API</strong> via{" "}
          <code>navigator.connection</code> exposes the effective connection
          type (<code>effectiveType</code>), downlink speed, and round-trip
          time — enabling applications to distinguish between a user on a 4G
          connection and one on a slow 2G link.
        </p>
        <p className="mb-4">
          These signals feed into <strong>adaptive loading</strong> strategies
          where the application deliberately tiers its experience. A device
          with 8 cores and 8 GB of RAM on a fast connection receives
          high-fidelity animations, eager image preloading, and rich
          interactive components. A device with 2 cores and 1 GB of RAM on an
          effective 2G connection receives simplified layouts, placeholder
          images that load only on interaction, and lighter JavaScript bundles.
          This is not degradation — it is intentional optimization for each
          device class, resulting in a better experience on constrained
          hardware than a one-size-fits-all approach that would simply be slow.
        </p>
        <p>
          Responsive images are themselves a form of feature detection. The{" "}
          <code>srcset</code> attribute and <code>{`<picture>`}</code> element
          let the browser select the optimal image source based on viewport
          width, device pixel ratio, and supported formats. When a browser
          supports AVIF, it can select a highly compressed source; when it
          does not, it falls back to WebP or JPEG. This declarative, in-markup
          feature detection for media is one of the most impactful
          real-world applications of the capability-first principle, saving
          substantial bandwidth across billions of page loads daily.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section className="mb-12">
        <h2>Architecture &amp; Flow</h2>
        <p className="mb-4">
          The following diagrams illustrate the key architectural patterns
          behind feature detection — from decision trees that guide runtime
          branching, to comparisons of detection strategies, to adaptive
          loading architectures that leverage device capability signals.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/error-handling-monitoring/feature-detection-diagram-1.svg"
          alt="Feature detection decision tree showing capability check leading to enhanced or fallback code path"
          caption="Figure 1: Feature detection decision flow for adaptive experiences"
        />
        <p className="mb-4">
          The decision tree above captures the fundamental runtime branching
          that feature detection enables. At each capability checkpoint, the
          application tests a specific API or property. If the test passes, the
          enhanced code path executes — potentially loading additional modules,
          enabling richer interactions, or using a native API. If the test
          fails, a fallback path activates — either a polyfill, a simpler
          alternative implementation, or a graceful removal of the feature with
          an appropriate user-facing message. Crucially, both paths must be
          tested and maintained. A fallback that has never been exercised in QA
          is indistinguishable from no fallback at all.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/error-handling-monitoring/feature-detection-diagram-2.svg"
          alt="Comparison of user-agent sniffing vs feature detection showing reliability differences"
          caption="Figure 2: User-Agent sniffing vs feature detection reliability"
        />
        <p className="mb-4">
          This comparison highlights the reliability gap between the two
          approaches. User-agent sniffing introduces a layer of indirection —
          parsing a string to infer a browser, then mapping that browser to a
          set of assumed capabilities. Each inference step introduces error
          potential: the UA string may be spoofed, the capability mapping may
          be outdated, or the user may have changed defaults. Feature detection
          eliminates the indirection by testing the capability directly,
          producing a ground-truth result that holds regardless of which
          browser, version, or configuration the user has.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/error-handling-monitoring/feature-detection-diagram-3.svg"
          alt="Adaptive loading architecture using device capability detection to serve appropriate experience tier"
          caption="Figure 3: Adaptive loading based on runtime capability detection"
        />
        <p>
          The adaptive loading architecture demonstrates how runtime capability
          signals — CPU cores, available memory, network speed, and API
          support — are collected during application initialization and used
          to select an experience tier. This approach is used at scale by
          companies like Google and Facebook, where the same URL must serve
          billions of devices spanning flagship smartphones and low-cost feature
          phones. The tier selection happens once, early in the page lifecycle,
          and governs which bundles are loaded, which assets are fetched, and
          how aggressive prefetching and caching behaviors are.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparisons
          ============================================================ */}
      <section className="mb-12">
        <h2>Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          Choosing the right strategy for handling browser differences depends
          on your application&apos;s constraints, team size, and target device
          landscape. The following comparison evaluates four common approaches
          across key engineering dimensions.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-theme text-sm">
            <thead>
              <tr className="bg-panel">
                <th className="border border-theme p-3 text-left">Dimension</th>
                <th className="border border-theme p-3 text-left">Feature Detection</th>
                <th className="border border-theme p-3 text-left">UA Sniffing</th>
                <th className="border border-theme p-3 text-left">Polyfills</th>
                <th className="border border-theme p-3 text-left">Transpilation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-theme p-3 font-medium">Reliability</td>
                <td className="border border-theme p-3">High — tests actual capability directly</td>
                <td className="border border-theme p-3">Low — UA strings are unreliable and spoofable</td>
                <td className="border border-theme p-3">Medium — depends on polyfill quality and completeness</td>
                <td className="border border-theme p-3">High — output targets specific syntax levels</td>
              </tr>
              <tr>
                <td className="border border-theme p-3 font-medium">Maintenance Burden</td>
                <td className="border border-theme p-3">Low — checks remain valid as browsers evolve</td>
                <td className="border border-theme p-3">High — requires updating UA mappings constantly</td>
                <td className="border border-theme p-3">Medium — polyfills need updates and auditing</td>
                <td className="border border-theme p-3">Low — configured once via Babel/SWC targets</td>
              </tr>
              <tr>
                <td className="border border-theme p-3 font-medium">Performance Impact</td>
                <td className="border border-theme p-3">Negligible — property checks are near-instant</td>
                <td className="border border-theme p-3">Low — regex parsing is cheap</td>
                <td className="border border-theme p-3">Medium to High — polyfills add bundle size</td>
                <td className="border border-theme p-3">Low to Medium — transpiled code may be larger</td>
              </tr>
              <tr>
                <td className="border border-theme p-3 font-medium">Future-proofing</td>
                <td className="border border-theme p-3">Excellent — new browsers that support a feature pass the test automatically</td>
                <td className="border border-theme p-3">Poor — new browsers break existing parsers</td>
                <td className="border border-theme p-3">Good — polyfills become no-ops as support arrives</td>
                <td className="border border-theme p-3">Good — raise targets as older browsers retire</td>
              </tr>
              <tr>
                <td className="border border-theme p-3 font-medium">Specificity</td>
                <td className="border border-theme p-3">Granular — tests individual features</td>
                <td className="border border-theme p-3">Coarse — tests browser identity, not features</td>
                <td className="border border-theme p-3">Granular — fills specific missing APIs</td>
                <td className="border border-theme p-3">Syntax-level — handles language features only</td>
              </tr>
              <tr>
                <td className="border border-theme p-3 font-medium">Implementation Complexity</td>
                <td className="border border-theme p-3">Low for basics, medium for probe tests</td>
                <td className="border border-theme p-3">Medium — parsing UA strings correctly is tricky</td>
                <td className="border border-theme p-3">Low — import and configure</td>
                <td className="border border-theme p-3">Low — build tool configuration</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mb-4 mt-4">
          In practice, mature applications use a combination of these
          strategies. Transpilation handles syntax compatibility at build time.
          Polyfills fill missing APIs conditionally, often loaded only when
          feature detection confirms they are needed (the &quot;differential
          serving&quot; pattern). Feature detection governs runtime behavior
          branching. And UA data is reserved for analytics and targeted bug
          workarounds. The goal is to minimize the runtime cost of compatibility
          while maximizing the reliability of each strategy layer.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section className="mb-12">
        <h2>Best Practices</h2>
        <ul className="space-y-4">
          <li>
            <strong>Test capability, never identity.</strong> Every feature
            detection check should test whether a specific API, property, or
            behavior exists — never whether the browser is Chrome, Safari, or
            Firefox. Testing identity couples your code to a snapshot of browser
            capabilities that will drift over time. Testing capability produces
            code that automatically adapts as browsers evolve, new browsers
            emerge, and existing browsers enable or disable features.
          </li>
          <li>
            <strong>
              Prefer <code>@supports</code> for CSS before reaching for
              JavaScript.
            </strong>{" "}
            CSS feature queries are evaluated by the rendering engine natively
            and do not require JavaScript execution. They are cheaper, faster,
            and less error-prone than checking CSS capabilities from JavaScript.
            Only use <code>CSS.supports()</code> in script when the detection
            result must influence JavaScript logic, such as choosing between
            animation strategies or conditionally loading a layout component.
          </li>
          <li>
            <strong>Detect early and cache results.</strong> Feature detection
            checks should run once during application initialization, and the
            results should be stored in a capabilities object or module-level
            constants. Repeatedly checking the same feature inside render loops,
            event handlers, or hot code paths adds unnecessary overhead. A
            centralized capabilities module also gives teams a single location
            to audit which features are being detected and what fallbacks exist.
          </li>
          <li>
            <strong>
              Provide meaningful fallbacks, not just feature removal.
            </strong>{" "}
            When a feature is unavailable, the fallback should provide
            equivalent value through an alternative mechanism, not simply hide
            the feature. If the Web Share API is not available, render a
            copy-to-clipboard button with manual share options rather than
            removing the share button entirely. If IntersectionObserver is
            absent, fall back to a scroll event listener with throttling rather
            than disabling lazy loading. The user&apos;s goals remain the same
            regardless of browser capabilities — your job is to meet those
            goals with whatever tools are available.
          </li>
          <li>
            <strong>Test on real devices, not just emulators.</strong> Browser
            DevTools device emulation simulates viewport sizes and touch events
            but does not replicate actual device constraints — memory limits,
            CPU throttling, GPU capabilities, and network conditions all differ
            between a MacBook Pro simulating a Moto G and an actual Moto G.
            Feature detection that passes in emulation may fail on real hardware
            due to memory pressure, missing GPU acceleration, or power-saving
            modes that disable background APIs.
          </li>
          <li>
            <strong>
              Use feature detection to conditionally load polyfills.
            </strong>{" "}
            Rather than shipping polyfills to all browsers regardless of need,
            check whether the native API exists first. If it does, skip the
            polyfill entirely. If it does not, dynamically import the polyfill.
            This differential loading pattern can reduce JavaScript payload by
            20-40% for modern browsers while still supporting older ones. Tools
            like <code>polyfill.io</code> automate this at the CDN level, but
            self-hosted conditional imports offer more control and avoid
            third-party dependency risks.
          </li>
          <li>
            <strong>
              Document which features are required versus enhanced.
            </strong>{" "}
            Maintain a clear, team-visible document that lists every detected
            feature and categorizes it as either required (the application
            cannot function without it) or enhanced (the application works but
            with reduced fidelity without it). Required features define your
            minimum supported environment and should trigger prominent user
            messaging if absent. Enhanced features degrade silently. This
            documentation prevents the gradual accumulation of undocumented
            feature dependencies that surface as mysterious production bugs on
            older devices.
          </li>
          <li>
            <strong>Version your capability detection alongside your code.</strong>{" "}
            As you add new detected features or change fallback strategies,
            these changes should be peer-reviewed and tracked in version
            control. A capability detection change can have a broader blast
            radius than a typical component change because it affects every
            user on a particular class of device. Treat capability modules with
            the same rigor as authentication or data-access layers.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section className="mb-12">
        <h2>Common Pitfalls</h2>
        <ul className="space-y-4">
          <li>
            <strong>False positives from partially implemented APIs.</strong>{" "}
            A browser may expose an API on the global object without fully
            implementing it. The <code>Notification</code> constructor might
            exist but <code>Notification.permission</code> might always return{" "}
            <code>&quot;denied&quot;</code> on certain platforms. The{" "}
            <code>fetch</code> API might be present but lack support for{" "}
            <code>AbortController</code> integration. Simply checking{" "}
            <code>{`"Notification" in window`}</code> is not sufficient — you
            need probe tests that exercise the specific behavior your
            application depends on. This is one of the most common mistakes in
            feature detection and accounts for a disproportionate share of
            cross-browser bugs in production.
          </li>
          <li>
            <strong>Checking the wrong property or object.</strong> Developers
            sometimes check a related but different property than the one
            their code actually uses. For example, checking{" "}
            <code>{`"geolocation" in navigator`}</code> confirms the
            Geolocation API exists but says nothing about whether the user has
            granted permission or whether the device has GPS hardware. Checking{" "}
            <code>{`"WebSocket" in window`}</code> confirms the constructor
            exists but does not guarantee that the network allows WebSocket
            connections (corporate proxies often block them). Feature detection
            must precisely match the API surface your code depends on.
          </li>
          <li>
            <strong>Over-reliance on Modernizr increasing bundle size.</strong>{" "}
            Including the full Modernizr library adds 15-25 KB of JavaScript
            that parses and executes during the critical rendering path. Many
            of those detections are irrelevant to your application. If you only
            need three or four checks, the overhead of a library is unjustified.
            Always use Modernizr&apos;s custom build tool to include only the
            detects you need, and evaluate whether manual checks would be
            simpler and lighter for small detection sets.
          </li>
          <li>
            <strong>Feature detection that breaks with new browser versions.</strong>{" "}
            If your detection logic is too clever — for example, relying on a
            specific error message string from a failed API call — it can break
            when a browser changes its error messages. Detection code should
            check simple, stable signals: property existence, constructor
            availability, or boolean return values from well-defined test
            methods. Avoid relying on side effects, error message content, or
            timing characteristics that are implementation details rather than
            specified behavior.
          </li>
          <li>
            <strong>Not accounting for API availability in different contexts.</strong>{" "}
            Some APIs are available only in secure contexts (HTTPS). Service
            Workers, the Credential Management API, and the Web Crypto API all
            require a secure origin. An application that detects these features
            during local development over HTTP will get different results than
            in production over HTTPS. Other APIs behave differently in iframes,
            Web Workers, or cross-origin contexts. Your detection logic must
            account for the execution context, not just the browser.
          </li>
          <li>
            <strong>Testing only in modern browsers.</strong> Feature detection
            is pointless if you only test the fallback paths in the same
            modern browsers where the primary path works. Set up a testing
            matrix that includes your lowest-tier supported browsers and
            devices. Use BrowserStack, Sauce Labs, or physical device labs to
            verify that fallback paths activate correctly and provide an
            acceptable experience. Cross-browser testing infrastructure is as
            important as the detection code itself.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section className="mb-12">
        <h2>Real-World Use Cases</h2>

        <h3>YouTube — Adaptive Streaming Quality</h3>
        <p className="mb-4">
          YouTube serves video to an extraordinarily diverse device landscape,
          from high-end desktop browsers to low-cost smart TVs and feature
          phones. The player employs extensive feature detection to determine
          which streaming protocols and codecs are available. It checks for
          Media Source Extensions (MSE) support, tests which video codecs the
          device can decode (H.264, VP9, AV1), and assesses available hardware
          decoding capabilities via the <code>MediaCapabilities</code> API.
          Based on these detection results, YouTube selects the optimal video
          stream — a device that supports AV1 hardware decoding receives a
          higher-quality stream at the same bandwidth compared to one limited
          to H.264. The player also monitors{" "}
          <code>navigator.connection.effectiveType</code> and buffer health in
          real time, adapting quality mid-stream. This capability-driven
          approach ensures that every device gets the best possible experience
          its hardware and network can support, without YouTube needing to
          maintain a database mapping every device model to a capability set.
        </p>

        <h3>Google Search — Tiered Experiences for Device Classes</h3>
        <p className="mb-4">
          Google Search serves billions of queries daily across every conceivable
          device class. Rather than serving a single codebase and hoping it
          performs well everywhere, Google uses feature detection and device
          capability assessment to deliver tiered experiences. On low-end
          devices (identified via <code>navigator.deviceMemory</code> and{" "}
          <code>navigator.hardwareConcurrency</code> signals), the search
          results page uses simpler layouts, fewer interactive elements, and
          defers non-essential JavaScript. On capable devices, the page
          delivers rich interactive features like instant previews, dynamic
          filtering, and pre-rendered result expansions. This approach improved
          engagement metrics on low-end devices significantly — not by adding
          features, but by removing the performance cost of features those
          devices could not run smoothly. The lesson for architects is that
          feature detection is as much about what you choose not to load as
          what you choose to enable.
        </p>

        <h3>Spotify Web Player — Audio API Feature Detection</h3>
        <p>
          The Spotify web player must deliver high-quality audio streaming
          across browsers that differ substantially in their audio API support.
          The player detects whether the Web Audio API is available for
          advanced audio processing features like crossfading, equalization,
          and audio visualization. It checks for Media Session API support to
          integrate with operating system media controls — displaying track
          information and playback controls in the notification shade on
          Android or the Now Playing widget on macOS. When the Encrypted Media
          Extensions (EME) API is available with a compatible Content Decryption
          Module, Spotify can stream DRM-protected content at higher quality
          tiers. On browsers where these APIs are absent, the player falls
          back to simpler HTML5 <code>{`<audio>`}</code> element playback with
          reduced features. Each capability check is independent, allowing the
          player to enable the maximum feature set that each browser supports
          without an all-or-nothing approach.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Common Interview Questions
          ============================================================ */}
      <section className="mb-12">
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="mb-2 font-semibold">
              Q: Why is feature detection preferred over user-agent sniffing
              for determining browser capabilities?
            </p>
            <p>
              Feature detection tests the actual capability of the browser
              rather than inferring it from an unreliable identity string.
              User-agent strings are spoofed by browsers for compatibility,
              are not standardized, and cannot account for user configuration
              changes, enterprise policies, or new browser versions. Feature
              detection produces a ground-truth result: either the API exists
              and behaves correctly, or it does not. This eliminates the
              maintenance burden of keeping UA mapping tables current and
              prevents breakage when new browsers appear. The only legitimate
              uses for UA data are analytics and targeted workarounds for
              known browser-version-specific bugs that cannot be detected via
              capability probing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="mb-2 font-semibold">
              Q: How does CSS <code>@supports</code> work, and when would you
              use <code>CSS.supports()</code> in JavaScript instead?
            </p>
            <p>
              The <code>@supports</code> at-rule lets you conditionally apply
              CSS blocks based on whether the browser understands a
              property-value combination. It is evaluated natively by the CSS
              engine with zero JavaScript overhead. You use it to write
              fallback-first stylesheets where baseline styles work everywhere
              and enhanced styles are wrapped in <code>@supports</code> blocks.
              The JavaScript <code>CSS.supports()</code> method is used when
              the detection result must influence JavaScript logic — for
              example, choosing between a CSS animation strategy and a
              JavaScript-driven animation library, or deciding whether to lazy
              load a layout component that depends on CSS Grid with subgrid
              support. The rule of thumb is: use <code>@supports</code> when
              the branching is purely CSS, and <code>CSS.supports()</code> when
              JavaScript needs to participate in the decision.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="mb-2 font-semibold">
              Q: How would you handle false positives in feature detection
              where an API exists but does not work correctly?
            </p>
            <p>
              False positives are one of the hardest problems in feature
              detection. The first defense is to test the specific behavior
              you depend on, not just the API&apos;s existence. Instead of
              checking <code>{`"Notification" in window`}</code>, try
              requesting notification permission in a controlled way and
              handle the result. For APIs that cannot be safely probed
              without side effects, maintain a known-issues list of
              browser-version combinations where the API is present but
              buggy, and combine feature detection with a narrow UA check
              specifically for those versions. Another approach is to wrap
              the first real invocation in a try-catch and set a
              &quot;verified&quot; flag, falling back to the alternative
              implementation if the initial call fails. The key principle is
              that the cost of a false positive (broken functionality for
              the user) is much higher than the cost of a false negative
              (using a slightly less optimal fallback), so design detection
              logic to be conservative.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="mb-2 font-semibold">
              Q: Describe an adaptive loading strategy using runtime device
              capability detection.
            </p>
            <p>
              An adaptive loading strategy begins by collecting device signals
              during application initialization:{" "}
              <code>navigator.hardwareConcurrency</code> for CPU cores,{" "}
              <code>navigator.deviceMemory</code> for RAM,{" "}
              <code>navigator.connection.effectiveType</code> for network
              speed, and <code>navigator.connection.saveData</code> for the
              user&apos;s data-saver preference. These signals are combined
              into a device tier classification — typically high, medium, or
              low. The tier then governs several decisions: which JavaScript
              bundles to load (full vs lite), how many images to eagerly fetch
              versus lazy load, whether to enable animations and transitions,
              and how aggressive prefetching should be. For example, a
              &quot;low&quot; tier device might disable all non-essential
              animations, use placeholder images until explicit user
              interaction, load a stripped-down component library, and avoid
              any speculative prefetching. The tier is computed once and stored
              in application state, ensuring consistent behavior throughout
              the session without redundant capability checks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="mb-2 font-semibold">
              Q: When is user-agent sniffing still acceptable in modern
              frontend engineering?
            </p>
            <p>
              User-agent data remains acceptable in three narrow scenarios.
              First, <strong>analytics and telemetry</strong> — understanding
              your browser distribution helps inform support decisions, but
              this is observational, not functional. Second,{" "}
              <strong>targeted workarounds for known browser bugs</strong>{" "}
              that cannot be detected via feature probing — for example, a
              rendering bug in Safari 16.3 that produces incorrect layout
              under specific conditions. In this case, a narrow UA check
              scoped to that exact version is preferable to a general hack
              that affects all browsers. Third,{" "}
              <strong>compliance requirements</strong> where regulations
              mandate identifying the rendering engine. In all cases, prefer
              the User-Agent Client Hints API over raw UA string parsing, as
              it provides structured, versioned data without the fragility
              of regex-based parsing. And critically, never use UA data to
              gate features that can be detected directly — that path leads
              to maintenance debt and user-facing breakage.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="mb-2 font-semibold">
              Q: How did Modernizr work internally, and when would you choose
              it over manual feature detection today?
            </p>
            <p>
              Modernizr works by creating temporary DOM elements, applying
              CSS properties or invoking JavaScript APIs on them, and
              inspecting the results. For CSS features, it creates a hidden
              element, sets a style property, and reads back the computed
              style to see if the browser accepted the value. For JavaScript
              APIs, it performs existence checks and probe tests. Results are
              exposed as boolean properties on the <code>Modernizr</code>{" "}
              global object and as CSS classes on the{" "}
              <code>{`<html>`}</code> element, enabling CSS-only branching
              without inline JavaScript. Today, you would choose Modernizr
              when your application needs to detect a large number of
              features (dozens) and you want a tested, community-maintained
              detection layer rather than writing and maintaining custom
              checks. You would avoid Modernizr for small detection sets (3-5
              features) where manual checks are lighter, more transparent,
              and avoid the library overhead. Always use Modernizr&apos;s
              custom build tool — never include the full library — and
              evaluate whether native alternatives like <code>@supports</code>{" "}
              and the <code>MediaCapabilities</code> API have made specific
              Modernizr detects unnecessary.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References & Further Reading
          ============================================================ */}
      <section className="mb-12">
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <strong>MDN Web Docs — Feature Detection:</strong>{" "}
            Comprehensive documentation on implementing feature detection with
            JavaScript and CSS, including <code>@supports</code> reference and
            best practices for capability checks.
          </li>
          <li>
            <strong>MDN Web Docs — User-Agent Client Hints API:</strong>{" "}
            Reference for the structured alternative to raw UA string parsing,
            covering <code>navigator.userAgentData</code> and{" "}
            <code>Sec-CH-UA</code> headers.
          </li>
          <li>
            <strong>Modernizr Documentation:</strong>{" "}
            Official documentation for the feature detection library, including
            the custom build tool and full detection reference.
          </li>
          <li>
            <strong>Google Developers — Adaptive Loading:</strong>{" "}
            Detailed guide on using <code>navigator.connection</code>,{" "}
            <code>navigator.deviceMemory</code>, and{" "}
            <code>navigator.hardwareConcurrency</code> to serve tiered
            experiences based on device capability.
          </li>
          <li>
            <strong>Web.dev — Browser Compatibility:</strong>{" "}
            Articles on progressive enhancement, graceful degradation, and
            modern cross-browser development strategies.
          </li>
          <li>
            <strong>Can I Use:</strong>{" "}
            The definitive reference for checking browser support tables for
            specific APIs, CSS features, and HTML elements — essential
            companion data for feature detection decisions.
          </li>
          <li>
            <strong>Philip Walton — &quot;Responsive Components&quot;:</strong>{" "}
            Discussion of component-level feature detection and responsive
            design patterns that go beyond viewport-based media queries.
          </li>
          <li>
            <strong>Network Information API Specification (WICG):</strong>{" "}
            The W3C specification for <code>navigator.connection</code>{" "}
            including <code>effectiveType</code>, <code>downlink</code>, and{" "}
            <code>saveData</code> properties used in adaptive loading.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
