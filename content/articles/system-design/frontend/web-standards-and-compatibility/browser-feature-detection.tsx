"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-browser-feature-detection-extensive",
  title: "Browser Feature Detection",
  description:
    "Staff-level deep dive into browser feature detection strategies, capability probing architectures, detection libraries, runtime capability assessment, and systematic approaches to building feature-aware applications.",
  category: "frontend",
  subcategory: "web-standards-and-compatibility",
  slug: "browser-feature-detection",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-23",
  tags: [
    "frontend",
    "feature detection",
    "browser compatibility",
    "web standards",
    "capability probing",
    "modernizr",
  ],
  relatedTopics: [
    "progressive-enhancement",
    "graceful-degradation",
    "polyfills-and-transpilation",
    "legacy-browser-support",
  ],
};

export default function BrowserFeatureDetectionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Browser feature detection</strong> is the practice of
          programmatically testing whether a browser supports a specific API,
          CSS property, HTML element, or capability before using it in
          application code. Rather than making assumptions about browser
          capabilities based on the user agent string (browser sniffing),
          feature detection directly probes the runtime environment — checking
          whether an object exists, a method is callable, a CSS property is
          recognized, or a media query evaluates correctly. This approach yields
          reliable, future-proof compatibility decisions because it tests actual
          capability rather than inferred capability from browser identity.
        </p>
        <p>
          Feature detection became a cornerstone of professional web development
          in the late 2000s as the limitations of user agent sniffing became
          apparent. User agent strings are unreliable: they can be spoofed by
          users and extensions, they are deliberately obfuscated by browser
          vendors (Chrome&apos;s user agent string famously contains
          &quot;Mozilla&quot;, &quot;AppleWebKit&quot;, and &quot;Safari&quot;),
          and they provide no information about which specific features a
          browser version supports. Modernizr, released in 2009, popularized
          systematic feature detection by providing a comprehensive library of
          tests that probed for specific HTML5 and CSS3 features and exposed
          results as CSS classes and JavaScript properties.
        </p>
        <p>
          At the staff and principal engineer level, feature detection is an
          architectural concern that goes beyond individual API checks. A mature
          feature detection strategy involves centralizing detection logic,
          caching results for performance, categorizing features into capability
          tiers, and using detection results to drive rendering decisions at the
          component level. Detection also feeds into analytics — understanding
          which features are available to your actual user population informs
          technology adoption decisions, compatibility contract reviews, and
          polyfill investment. Organizations that treat feature detection as
          infrastructure (rather than ad hoc checks sprinkled through
          components) build more maintainable, adaptable frontend architectures.
        </p>
        <p>
          The modern feature detection landscape extends far beyond checking for
          DOM APIs and CSS properties. Contemporary applications need to detect
          hardware capabilities (GPU acceleration, sensor availability, camera
          and microphone access), network conditions (connection type, effective
          bandwidth via the Network Information API), user preferences (reduced
          motion, color scheme, contrast preferences via media queries), and
          platform capabilities (service worker support, Web Workers,
          WebAssembly support). This expanded scope makes centralized,
          well-architected detection services essential — the alternative is a
          proliferation of inconsistent, duplicated checks that create
          maintenance burden and testing complexity.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Direct API Probing:</strong> The most fundamental detection
            technique — testing whether a JavaScript object, constructor, or
            method exists in the runtime environment. Checking for
            &quot;IntersectionObserver&quot; in window, testing whether
            navigator.serviceWorker is defined, or verifying that
            document.createElement(&quot;canvas&quot;).getContext(&quot;webgl&quot;)
            returns a non-null value. Direct probing is fast, reliable, and
            requires no external libraries.
          </li>
          <li>
            <strong>CSS Feature Queries:</strong> The @supports rule in CSS
            allows stylesheets to conditionally apply rules based on whether the
            browser recognizes a CSS property-value pair. @supports (display:
            grid) applies styles only in browsers that support CSS Grid. In
            JavaScript, CSS.supports() provides the same detection capability
            programmatically. Feature queries are the CSS equivalent of
            JavaScript API probing and handle visual degradation without any
            JavaScript execution.
          </li>
          <li>
            <strong>Capability Profiling:</strong> The practice of running a
            suite of feature detection tests at application initialization and
            aggregating the results into a capability profile — a structured
            representation of the current environment&apos;s capabilities. The
            profile is then used throughout the application to make rendering
            and behavior decisions. This avoids redundant detection and ensures
            consistent capability assessment across all components.
          </li>
          <li>
            <strong>Progressive Capability Testing:</strong> A strategy where
            detection tests are ordered from most capable to least capable, and
            the first passing test determines the capability tier. For rendering
            capabilities, the progression might be: WebGL 2 → WebGL 1 → Canvas
            2D → SVG → static images. Each level provides a different experience
            quality, and the detection cascade identifies the best available
            option.
          </li>
          <li>
            <strong>Feature Detection vs. Feature Inference:</strong> Detection
            tests the specific feature needed. Inference assumes that the
            presence of one feature implies the presence of others — for
            example, assuming that a browser supporting Promises also supports
            fetch. Inference is unreliable because browser vendors implement
            features independently. Always test the specific feature you intend
            to use rather than inferring from related features.
          </li>
          <li>
            <strong>User Preference Detection:</strong> Media queries like
            prefers-reduced-motion, prefers-color-scheme, and prefers-contrast
            detect user accessibility and aesthetic preferences set at the
            operating system level. These are not browser capabilities in the
            traditional sense — they are user-declared preferences that
            applications should respect. Detection via matchMedia in JavaScript
            or @media in CSS allows adapting the experience to the user&apos;s
            stated needs.
          </li>
          <li>
            <strong>Asynchronous Detection:</strong> Some capabilities cannot be
            detected synchronously. Permission-gated APIs (camera, microphone,
            geolocation), storage quotas (IndexedDB available space), and codec
            support (via MediaSource.isTypeSupported or canPlayType) require
            asynchronous probing. The detection architecture must accommodate
            async detection without blocking initial render, typically by
            rendering a loading state or default variant while detection
            completes and then updating if needed.
          </li>
          <li>
            <strong>Detection Caching:</strong> Feature detection results are
            stable within a page load — a browser either supports
            IntersectionObserver or it does not, and this does not change during
            the session. Detection results should be cached after the first
            probe to avoid repeated DOM access and object creation. For
            detection results that are stable across sessions (hardware
            capabilities, installed codecs), caching to localStorage or
            sessionStorage can skip detection on subsequent page loads entirely.
          </li>
        </ul>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Feature detection architecture spans initialization-time probing,
          capability profile construction, and runtime integration with
          component rendering. The following diagrams illustrate how mature
          detection systems are structured.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/web-standards-and-compatibility/browser-feature-detection-diagram-1.svg"
          alt="Centralized feature detection service architecture showing probe execution, profile construction, and context distribution"
          caption="Figure 1: Centralized detection service — how feature probes are executed, aggregated into a capability profile, and distributed to components."
        />
        <p>
          The centralized detection service runs at application initialization,
          before the component tree mounts. It executes a battery of feature
          probes — JavaScript API checks, CSS feature queries, hardware
          capability tests, and user preference queries. Results are aggregated
          into a structured capability profile that categorizes the environment
          into a support tier (full, standard, basic, minimal). The profile is
          exposed to the component tree via a React context provider (or
          equivalent framework mechanism), making detection results available to
          any component without prop drilling. Components query the capability
          context to decide which variant to render. The service also emits the
          capability profile to analytics, creating visibility into the
          capability distribution of the actual user population.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/web-standards-and-compatibility/browser-feature-detection-diagram-2.svg"
          alt="Feature detection decision tree showing how detection results cascade through capability checks to component variant selection"
          caption="Figure 2: Detection decision tree — how cascading capability checks determine which component variant to render."
        />
        <p>
          The detection decision tree illustrates how individual feature probes
          combine into rendering decisions. For a complex component like an
          interactive data visualization, the decision tree might check: Does
          the browser support WebGL? If yes, use the WebGL renderer with
          hardware acceleration. If not, does it support Canvas 2D? If yes, use
          the canvas-based renderer with software rendering. If not, does it
          support inline SVG? If yes, use the SVG renderer with DOM-based
          interaction. If none are available, render a static image with an alt
          text description. Each branch of the decision tree leads to a specific
          component implementation, and the tree is traversed once at mount time
          with results cached for the component&apos;s lifecycle.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/web-standards-and-compatibility/browser-feature-detection-diagram-3.svg"
          alt="CSS feature detection flow showing @supports cascade, JavaScript matchMedia integration, and conditional style application"
          caption="Figure 3: CSS feature detection — how @supports rules and matchMedia integrate to provide capability-aware styling."
        />
        <p>
          CSS feature detection operates independently of JavaScript, using
          @supports rules to conditionally apply styles. The cascade begins with
          base styles that work universally, then progressively layers
          enhancements behind @supports blocks. For dynamic detection (user
          preference changes, viewport-dependent capabilities),
          JavaScript&apos;s matchMedia API provides both initial state and
          change listeners via the addEventListener method on MediaQueryList
          objects. This enables responsive detection — when a user changes their
          system color scheme preference, the matchMedia listener fires and the
          application adapts in real time without a page reload. The combination
          of CSS @supports for static capabilities and matchMedia for dynamic
          preferences provides comprehensive detection coverage across both
          visual and behavioral dimensions.
        </p>
      </section>

      {/* Section 4: Trade-offs & Comparisons */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-theme bg-panel p-2 text-left">
                Aspect
              </th>
              <th className="border border-theme bg-panel p-2 text-left">
                Advantages
              </th>
              <th className="border border-theme bg-panel p-2 text-left">
                Disadvantages
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-theme p-2">
                Feature detection vs. user agent sniffing
              </td>
              <td className="border border-theme p-2">
                Feature detection tests actual capability, works with unknown
                future browsers, handles spoofed user agents correctly, and
                adapts to incremental feature adoption by browser vendors.
              </td>
              <td className="border border-theme p-2">
                Feature detection requires individual tests for each capability,
                cannot detect known browser bugs (where a feature exists but
                behaves incorrectly), and some tests have runtime cost.
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2">
                Centralized detection service vs. inline checks
              </td>
              <td className="border border-theme p-2">
                Centralized detection runs probes once, caches results, provides
                consistent capability assessment, and creates a single place to
                update detection logic as browser support evolves.
              </td>
              <td className="border border-theme p-2">
                Adds architectural complexity and a context dependency. Inline
                checks are simpler for components that need only one specific
                detection test and are easier to understand in isolation.
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2">
                Synchronous vs. asynchronous detection
              </td>
              <td className="border border-theme p-2">
                Synchronous detection provides instant results and simplifies
                rendering logic. Asynchronous detection handles permission-gated
                and resource-dependent capabilities.
              </td>
              <td className="border border-theme p-2">
                Synchronous detection cannot cover all capabilities.
                Asynchronous detection introduces loading states and potential
                layout shifts as results arrive after initial render.
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2">
                CSS @supports vs. JavaScript detection
              </td>
              <td className="border border-theme p-2">
                CSS detection handles visual degradation without JavaScript
                overhead, works even when JavaScript fails, and integrates
                naturally with the cascade.
              </td>
              <td className="border border-theme p-2">
                CSS detection is limited to CSS feature availability. Complex
                detection logic (testing method signatures, verifying behavior
                not just existence) requires JavaScript.
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2">
                Detection libraries vs. native checks
              </td>
              <td className="border border-theme p-2">
                Libraries like Modernizr provide comprehensive, well-tested
                detection suites. They handle edge cases and browser quirks that
                native checks might miss.
              </td>
              <td className="border border-theme p-2">
                Libraries add bundle weight (Modernizr can be 20+ KB depending
                on configured tests). Most modern applications need only a
                handful of detection tests, making a full library overkill.
                Custom builds mitigate this but add configuration complexity.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>
              Always detect the specific feature you intend to use:
            </strong>{" "}
            Do not infer capability from related features. Testing for Promise
            does not guarantee fetch support. Testing for CSS Grid does not
            guarantee subgrid support. Each feature detection test should probe
            the exact API, property, or method that the application code depends
            on. This discipline prevents false positives where a feature is
            assumed available but is actually missing.
          </li>
          <li>
            <strong>
              Centralize detection in a capability service for applications with
              multiple detection needs:
            </strong>{" "}
            When more than three or four components need feature detection, a
            centralized service pays for itself. The service runs detection
            probes once, caches results, computes a capability tier, and exposes
            results via context. This eliminates redundant probing, ensures
            consistent tier assignment, and provides a single location to update
            when dropping or adding feature support.
          </li>
          <li>
            <strong>Use CSS @supports for visual-only detection:</strong> When
            the detection decision only affects visual presentation (layout
            approach, animation style, visual effects), CSS feature queries
            handle it without JavaScript involvement. This keeps detection
            results in the style layer where they are most natural and ensures
            visual degradation works even if JavaScript is delayed or fails
            entirely.
          </li>
          <li>
            <strong>Cache detection results to avoid redundant probing:</strong>{" "}
            Feature availability does not change within a page session. Cache
            detection results in module-level variables or a detection store to
            avoid repeatedly creating test elements, calling CSS.supports(), or
            checking for API existence. For expensive detection tests (WebGL
            context creation, canvas performance benchmarks), consider caching
            results in sessionStorage for faster detection on subsequent page
            loads.
          </li>
          <li>
            <strong>Report detection results to analytics:</strong> Instrument
            the capability service to emit detection results as analytics
            events. This creates a real-time view of the capability distribution
            of your actual user population — far more actionable than
            caniuse.com statistics. Use this data to drive browserslist updates,
            compatibility contract reviews, and polyfill investment decisions.
          </li>
          <li>
            <strong>Test detection logic with capability mocking:</strong> Unit
            tests for detection-dependent components should mock the capability
            service to simulate different environments. Create test fixtures for
            each supported capability tier (full, standard, basic, minimal) and
            verify that components render the correct variant at each tier.
            Integration tests should verify the detection service itself by
            selectively disabling APIs in the test environment.
          </li>
          <li>
            <strong>Handle detection failure gracefully:</strong> Detection
            probes themselves can fail — trying to create a WebGL context might
            throw an exception on devices with exhausted GPU memory. Wrap
            detection probes in try-catch blocks and treat detection failure as
            feature absence. Never let a detection error crash the application
            or prevent rendering entirely.
          </li>
        </ol>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Confusing feature existence with correct behavior:</strong>{" "}
            A browser may expose an API (the property exists, the constructor is
            defined) but implement it incorrectly or incompletely. Early
            implementations of IntersectionObserver, for example, had different
            threshold behaviors across browsers. When correct behavior is
            critical, detection tests must go beyond existence checks and verify
            behavior — calling the API with known inputs and checking the
            output. This is more expensive but necessary for APIs with a history
            of inconsistent implementations.
          </li>
          <li>
            <strong>
              Running expensive detection synchronously in the critical path:
            </strong>{" "}
            Some detection tests are expensive — creating WebGL contexts,
            running canvas performance benchmarks, or testing audio codec
            support. Running these synchronously during application
            initialization blocks rendering and delays Time to Interactive. Move
            expensive detection to requestIdleCallback or a Web Worker, render a
            default variant immediately, and upgrade to the detected variant
            when results arrive.
          </li>
          <li>
            <strong>Feature inference chains:</strong> Assuming that because a
            browser supports feature A, it must also support features B, C, and
            D. Browser vendors implement features on their own schedules —
            Safari might support CSS Grid but not Container Queries, while
            Firefox supports both. Each capability must be independently
            detected. Feature inference was the root cause of many Modernizr-era
            bugs where libraries made chain assumptions that broke on specific
            browser-version combinations.
          </li>
          <li>
            <strong>
              Not accounting for feature being present but disabled:
            </strong>{" "}
            Some features may exist in the browser but be disabled by enterprise
            policies, privacy extensions, or user settings. WebRTC can be
            disabled by browser extensions. Local storage can be disabled in
            private browsing mode. Service Workers may be blocked by corporate
            firewalls. Detection must account for these scenarios — typically by
            trying to use the feature in a safe way and catching the resulting
            error, rather than just checking for the API&apos;s existence.
          </li>
          <li>
            <strong>Duplicating detection logic across components:</strong> When
            multiple components independently check for the same feature,
            maintenance becomes fragile. If the detection approach needs to
            change (from a simple existence check to a behavioral test, for
            example), every detection site must be updated. Centralize detection
            to ensure a single source of truth and a single update point.
          </li>
          <li>
            <strong>Ignoring detection in server-side rendering:</strong>{" "}
            Server-rendered markup has no browser environment — feature
            detection APIs are unavailable. Components that depend on detection
            must either render a universal default during SSR (to be hydrated
            with the detected variant on the client) or defer rendering entirely
            until client-side detection completes. Mismatched SSR output and
            client hydration output causes hydration errors and visual flicker.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          <strong>YouTube&apos;s video player capability cascade:</strong>{" "}
          YouTube&apos;s web player uses an extensive feature detection cascade
          to determine the optimal playback pipeline. The detection chain checks
          for Media Source Extensions (MSE) for adaptive bitrate streaming,
          Encrypted Media Extensions (EME) for DRM content, WebCodecs for
          hardware-accelerated decoding, HDR color space support via CSS media
          queries and WebGL extensions, and Picture-in-Picture API support. Each
          detection result feeds into a capability matrix that determines which
          video qualities are offered, whether HDR toggle appears, and how the
          player handles DRM-protected content. The fallback cascade ensures
          video playback works even when advanced APIs are unavailable.
        </p>
        <p>
          <strong>Figma&apos;s rendering engine selection:</strong> Figma
          detects WebGL support and GPU capabilities to determine whether to use
          its WebGL-based rendering engine (for hardware-accelerated vector
          rendering) or fall back to a Canvas 2D implementation. The detection
          goes beyond simple WebGL existence — Figma benchmarks GPU performance
          during initial load, checking framerate stability and memory limits to
          ensure the WebGL path will actually deliver a good experience. Devices
          with technically available but underperforming WebGL implementations
          are routed to the Canvas 2D path, preventing sluggish editing
          experiences.
        </p>
        <p>
          <strong>Twitter/X adaptive media loading:</strong> Twitter uses the
          Network Information API (navigator.connection) to adapt media loading
          behavior based on connection quality. On slow connections (detected
          via effectiveType or downlink values), images load at lower
          resolutions, videos do not autoplay, and high-resolution media
          requires explicit user action. When the Network Information API is
          unavailable, Twitter falls back to observing actual download speeds of
          initial resources and uses those measurements as a proxy for
          connection quality. This adaptive approach reduces data usage and
          improves perceived performance for users on constrained networks.
        </p>
        <p>
          <strong>Notion&apos;s editor input detection:</strong> Notion detects
          input method capabilities to adapt its editor behavior. Touch input
          detection determines whether to show touch-optimized drag handles and
          mobile-friendly block menus. Keyboard layout detection (via the
          Keyboard API where available) influences shortcut hints and modifier
          key labels. Pointer precision detection (via pointer media queries)
          adjusts hit target sizes for stylus, finger, and mouse input. These
          detection results create an editor experience that feels native across
          laptops, tablets, and phones without requiring separate codebases.
        </p>
      </section>

      {/* Section 8: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Why is feature detection preferred over user agent sniffing?
            </p>
            <p className="mt-2 text-sm">
              A: Feature detection tests actual capability — whether the browser
              can do what you need, not what browser it claims to be. User agent
              strings are unreliable because they are spoofable, deliberately
              misleading (Chrome&apos;s UA contains Safari and Mozilla
              identifiers), increasingly frozen by browser vendors via
              User-Agent Client Hints, and they provide no granularity about
              which specific features a version supports. Feature detection
              works with future unknown browsers, handles incremental feature
              adoption across browser versions, and produces correct results
              regardless of UA string manipulation. The only scenario where UA
              analysis adds value is detecting known browser bugs where the
              feature exists but behaves incorrectly — and even then, behavioral
              feature testing is a more robust approach.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you architect a feature detection system for a large
              application?
            </p>
            <p className="mt-2 text-sm">
              A: Create a centralized capability service that runs at
              application initialization. The service executes a configured set
              of detection probes (JavaScript API checks, CSS.supports calls,
              hardware capability tests, user preference queries), aggregates
              results into a structured capability profile, assigns the
              environment to a support tier from the compatibility contract, and
              exposes the profile via context. Components consume detection
              results from context rather than running their own probes. The
              service caches results in memory for the session and optionally in
              sessionStorage for faster initialization on subsequent loads.
              Detection results are emitted to analytics for population-level
              capability tracking. The service is testable via capability
              profile fixtures that simulate different environments.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle feature detection in server-side rendered
              applications?
            </p>
            <p className="mt-2 text-sm">
              A: During SSR, no browser environment exists, so feature detection
              is impossible. The SSR pass should render a universal default —
              the most broadly compatible variant of each detection-dependent
              component. On the client, the detection service runs during
              hydration, determines the actual capability profile, and if the
              detected variant differs from the SSR default, the component
              updates. To minimize visual disruption, design the SSR default to
              closely match the most common client capability tier. For
              components where the SSR and client variants differ significantly,
              use CSS-based detection (@supports, media queries) which applies
              during the first paint without waiting for JavaScript hydration,
              or defer rendering of those components until client-side detection
              completes using Suspense boundaries or conditional mounting.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between detecting feature existence and
              detecting correct feature behavior?
            </p>
            <p className="mt-2 text-sm">
              A: Existence detection checks whether an API or property is
              defined — window.IntersectionObserver !== undefined. Behavioral
              detection verifies that the feature works correctly by actually
              using it with known inputs and validating outputs. Existence
              detection is fast and sufficient for most APIs, but behavioral
              detection is necessary for APIs with a history of inconsistent
              implementations across browsers. For example, early Safari
              implementations of IntersectionObserver had different root margin
              behavior than the specification defined. A behavioral test would
              create an observer with known thresholds and verify the callback
              fires correctly. The trade-off is performance — behavioral tests
              are more expensive and should be reserved for APIs where known
              implementation divergences affect your application&apos;s
              correctness.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When would you still use Modernizr versus writing custom
              detection checks?
            </p>
            <p className="mt-2 text-sm">
              A: Modernizr is valuable when you need detection for legacy or
              obscure features where the detection logic is non-trivial —
              detecting touch event support, testing for specific CSS property
              support including prefixed variants, or checking for nuanced HTML5
              feature availability. For modern APIs (IntersectionObserver,
              ResizeObserver, CSS Grid, Custom Properties), simple existence
              checks are sufficient and do not justify a library dependency. If
              you need Modernizr, use its custom build tool to include only the
              specific tests you require — the full library includes hundreds of
              tests, most of which are irrelevant to any single application. In
              most modern applications, native detection covers all needs, and
              Modernizr is reserved for edge cases involving legacy features or
              complex detection logic that would be error-prone to reimplement.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References & Further Reading */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Testing/Feature_detection"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Implementing Feature Detection
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/@supports"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — CSS Feature Queries (@supports)
            </a>
          </li>
          <li>
            <a
              href="https://modernizr.com/docs"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Modernizr — Feature Detection Library Documentation
            </a>
          </li>
          <li>
            <a
              href="https://caniuse.com/"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Can I Use — Browser Feature Support Reference
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/articles/adaptive-serving-based-on-network-quality"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — Adaptive Serving Based on Network Quality
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
