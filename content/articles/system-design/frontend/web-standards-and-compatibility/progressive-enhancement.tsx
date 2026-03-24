"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-progressive-enhancement-extensive",
  title: "Progressive Enhancement",
  description:
    "Staff-level deep dive into progressive enhancement including layered architecture, baseline-first design, feature detection strategies, and resilience patterns for modern web applications.",
  category: "frontend",
  subcategory: "web-standards-and-compatibility",
  slug: "progressive-enhancement",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-23",
  tags: [
    "frontend",
    "progressive enhancement",
    "web standards",
    "accessibility",
    "resilience",
    "compatibility",
  ],
  relatedTopics: [
    "graceful-degradation",
    "browser-feature-detection",
    "polyfills-and-transpilation",
  ],
};

export default function ProgressiveEnhancementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Progressive enhancement</strong> is a design and development
          philosophy where web experiences are built in layers — starting with a
          universally accessible baseline of semantic HTML, then adding
          presentational styling with CSS, and finally layering on interactive
          behavior with JavaScript. Each layer enhances the experience for
          capable browsers and devices without compromising functionality for
          those that lack support. The core principle is that content and core
          functionality must be available to every user, regardless of their
          browser, device, network conditions, or assistive technology.
        </p>
        <p>
          Progressive enhancement emerged in the early 2000s as a response to
          the browser wars and the practice of building sites exclusively for
          the latest browsers. The term was coined by Steven Champeon in 2003,
          advocating a reversal of the then-dominant &quot;graceful
          degradation&quot; approach. While graceful degradation starts with the
          full experience and patches it for older browsers, progressive
          enhancement starts with the baseline and builds upward — a
          fundamentally different architectural mindset that prioritizes
          resilience over feature parity.
        </p>
        <p>
          At the staff/principal engineer level, progressive enhancement is not
          merely a coding technique but a strategic architecture decision. It
          directly impacts reliability (the baseline works even when JavaScript
          fails, CDNs go down, or networks are unreliable), accessibility
          (semantic HTML foundations meet WCAG requirements by default),
          performance (critical content loads without waiting for JavaScript
          bundles), and SEO (search engines index content from the HTML layer
          without JavaScript rendering). Organizations that adopt progressive
          enhancement at the system level — encoding it in design systems,
          component libraries, and engineering standards — build inherently more
          resilient products.
        </p>
        <p>
          The modern web has made progressive enhancement both more relevant and
          more nuanced. Single-page applications, client-side rendering, and
          JavaScript-heavy frameworks challenge traditional progressive
          enhancement assumptions. However, server components (React Server
          Components), streaming SSR, and islands architecture represent the
          industry&apos;s recognition that the baseline-first philosophy
          produces better outcomes. The question is no longer whether to use
          progressive enhancement, but how to implement it within modern
          framework constraints.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Content Layer (HTML):</strong> The foundation of progressive
            enhancement. Semantic HTML delivers the core content and
            functionality — text, links, forms, navigation — without any CSS or
            JavaScript. This layer must be complete enough that a user on a
            text-only browser or screen reader can accomplish all primary tasks.
            Forms submit via standard POST requests, navigation uses anchor
            tags, and content is structured with semantic elements.
          </li>
          <li>
            <strong>Presentation Layer (CSS):</strong> Styling enhances the
            visual experience without altering functionality. Layout, color,
            typography, and responsive design are applied through CSS. If CSS
            fails to load (network error, content blocker), the content remains
            readable and functional in its default browser styling. Modern CSS
            features like Grid and custom properties can be layered using
            feature queries (<code>@supports</code>).
          </li>
          <li>
            <strong>Behavior Layer (JavaScript):</strong> Interactive
            enhancements are the final layer — form validation, dynamic content
            loading, animations, and rich interactions. This layer is explicitly
            optional. If JavaScript fails (disabled, blocked, errored, still
            loading), users still have full access to content and basic
            functionality through the HTML layer.
          </li>
          <li>
            <strong>Feature Detection:</strong> Rather than checking browser
            identity (user-agent sniffing), progressive enhancement uses feature
            detection to determine what capabilities are available. APIs like{" "}
            <code>if (&apos;serviceWorker&apos; in navigator)</code> or CSS{" "}
            <code>@supports</code> queries allow code to test for specific
            features before using them, enabling graceful capability-based
            enhancement.
          </li>
          <li>
            <strong>Baseline Contract:</strong> An explicit agreement about what
            functionality is guaranteed for all users versus what is
            enhancement-only. This contract should be documented and enforced —
            specifying which tasks work without JavaScript, which features
            require specific browser capabilities, and what the fallback
            experience looks like for each capability gap.
          </li>
          <li>
            <strong>Cutting the Mustard:</strong> A technique popularized by the
            BBC where a feature detection test determines whether a browser is
            &quot;modern enough&quot; to receive the enhanced JavaScript
            experience. Browsers that fail the test receive only the baseline
            HTML/CSS experience. This creates a clean binary decision rather
            than attempting to support every intermediate capability level.
          </li>
          <li>
            <strong>Unobtrusive JavaScript:</strong> A practice where JavaScript
            behavior is added to existing HTML elements rather than generating
            HTML from JavaScript. Event listeners are attached after DOM load,
            forms have server-side fallback actions, and links have real href
            attributes. The HTML works independently; JavaScript enhances it.
          </li>
          <li>
            <strong>Server-Side Rendering as Baseline:</strong> In modern
            frameworks, SSR provides the HTML baseline layer. The server renders
            complete HTML that works without JavaScript. Client-side hydration
            then enhances the static HTML with interactive capabilities. This
            represents progressive enhancement at the framework level — the
            server delivers the baseline, the client enhances it.
          </li>
        </ul>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Progressive enhancement creates a layered architecture where each
          layer is independent and additive. Understanding these layers and
          their failure modes is essential for building resilient systems.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/web-standards-and-compatibility/progressive-enhancement-diagram-1.svg"
          alt="Progressive enhancement layer model showing HTML content layer, CSS presentation layer, and JavaScript behavior layer with their respective capabilities"
        />
        <p>
          The three-layer model illustrates how capabilities stack. The HTML
          layer provides structure, semantics, and basic interactivity (links,
          forms). CSS adds visual design, layout, and responsive behavior.
          JavaScript adds rich interactions, real-time updates, and enhanced UX.
          Each layer degrades independently — a CSS failure doesn&apos;t break
          functionality, and a JavaScript failure doesn&apos;t break content
          access.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/web-standards-and-compatibility/progressive-enhancement-diagram-2.svg"
          alt="Feature detection and enhancement pipeline showing how browser capabilities are tested and enhancements are conditionally applied"
        />
        <p>
          The enhancement pipeline shows the decision process. On page load,
          feature detection tests determine available capabilities. Based on
          results, the appropriate enhancement level is applied — from baseline
          HTML-only through fully enhanced with all JavaScript features. This
          pipeline ensures users receive the best experience their environment
          supports without breaking for unsupported features.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/web-standards-and-compatibility/progressive-enhancement-diagram-3.svg"
          alt="Modern progressive enhancement architecture with SSR baseline, hydration enhancement, and islands of interactivity"
        />
        <p>
          Modern progressive enhancement maps to server/client architecture.
          Server-side rendering produces the HTML baseline — complete, semantic,
          and functional. Client-side hydration enhances this baseline with
          interactive capabilities. Islands architecture takes this further by
          selectively hydrating only interactive components, leaving static
          content as server-rendered HTML. This approach minimizes JavaScript
          payload while maximizing baseline quality.
        </p>
      </section>

      {/* Section 4: Trade-offs & Comparisons */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Approach</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3 font-medium">Progressive Enhancement</td>
              <td className="p-3">
                Inherently resilient — works when layers fail; accessible by
                default; SEO-friendly baseline; performs well on slow networks;
                future-proof foundation
              </td>
              <td className="p-3">
                Higher upfront design effort; requires server-side rendering
                capability; developers must think in layers; some interactions
                are harder to implement baseline-first
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Graceful Degradation</td>
              <td className="p-3">
                Faster initial development for modern browsers; full feature set
                designed first; familiar to SPA developers
              </td>
              <td className="p-3">
                Retrofitting fallbacks is expensive and often incomplete;
                failures are discovered late; baseline users get a broken
                experience patched after the fact
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium">JavaScript-Required SPA</td>
              <td className="p-3">
                Rich interactivity; simplified state management; component-based
                architecture; strong developer tooling ecosystem
              </td>
              <td className="p-3">
                No content without JavaScript; poor SEO without SSR; higher
                initial load time; breaks for users with JavaScript disabled or
                blocked; single point of failure
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Islands Architecture</td>
              <td className="p-3">
                Progressive enhancement at the component level; minimal
                JavaScript shipped; excellent performance; framework-level
                support (Astro, Fresh)
              </td>
              <td className="p-3">
                Limited framework options; inter-island communication
                complexity; less mature ecosystem; requires architectural
                rethinking for existing SPAs
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
            <strong>Start Every Feature with the HTML Layer:</strong> Before
            writing any JavaScript, build the feature using only HTML. Forms
            should submit to server endpoints, navigation should use anchor tags
            with real hrefs, and content should be structured semantically. This
            baseline becomes the fallback that works everywhere.
          </li>
          <li>
            <strong>Use Feature Detection, Not Browser Detection:</strong> Test
            for specific capabilities rather than identifying browsers. Feature
            detection is forward-compatible — new browsers that support a
            feature automatically receive the enhancement. User-agent sniffing
            is fragile, easily spoofed, and requires constant maintenance as new
            browsers emerge.
          </li>
          <li>
            <strong>Define and Document the Baseline Contract:</strong>{" "}
            Explicitly document which tasks are baseline (work without
            JavaScript) and which are enhancement-only. This contract should be
            reviewed by product, engineering, and accessibility teams. Without
            it, the baseline erodes over time as developers add JavaScript
            dependencies without realizing they are breaking the contract.
          </li>
          <li>
            <strong>Test with JavaScript Disabled:</strong> Regularly test the
            application with JavaScript disabled to verify the baseline
            experience. Add this to CI/CD as an automated check — crawl key
            pages without JavaScript and verify that core content is present and
            forms are functional.
          </li>
          <li>
            <strong>
              Use Server-Side Rendering as the Delivery Mechanism:
            </strong>{" "}
            SSR naturally produces the HTML baseline layer. React Server
            Components, Next.js, and similar frameworks generate complete HTML
            on the server. Client-side hydration then becomes the enhancement
            layer. This aligns framework architecture with progressive
            enhancement principles.
          </li>
          <li>
            <strong>Layer CSS Enhancements with @supports:</strong> Use CSS
            feature queries to conditionally apply advanced layout and styling.
            Start with a simple, widely-supported layout (flexbox), then enhance
            with newer features (grid, container queries, :has() selector) for
            browsers that support them.
          </li>
          <li>
            <strong>Keep the JavaScript Layer Modular:</strong> Structure
            JavaScript enhancements as independent modules that attach to
            existing HTML. If one module fails to load or errors, other
            enhancements and the baseline experience remain unaffected. Avoid
            monolithic JavaScript bundles where a single error breaks
            everything.
          </li>
          <li>
            <strong>
              Encode Progressive Enhancement in the Design System:
            </strong>{" "}
            Component libraries should produce semantic HTML by default and
            enhance with JavaScript. A Button component should render as an
            actual <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code>
            element, not a styled div with click handlers. System-level
            enforcement prevents individual developers from bypassing the
            baseline.
          </li>
        </ol>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>JavaScript-Only Navigation:</strong> Client-side routing
            without server-side fallback means users cannot access pages when
            JavaScript fails. Every route in the application should resolve to a
            server-rendered page. This is the most common progressive
            enhancement violation in modern SPAs.
          </li>
          <li>
            <strong>Forms Without Server-Side Action:</strong> Forms that only
            submit via JavaScript (fetch/XHR) with no form action attribute
            become non-functional when JavaScript is unavailable. Always include
            a server-side form handler as the baseline, then enhance with
            JavaScript for inline validation and async submission.
          </li>
          <li>
            <strong>Content Generated Entirely by JavaScript:</strong> If page
            content is rendered exclusively by client-side JavaScript, the
            baseline experience is a blank page. This affects users with
            JavaScript disabled, slow networks where the bundle hasn&apos;t
            loaded, and search engines that don&apos;t execute JavaScript.
          </li>
          <li>
            <strong>Using Divs Instead of Semantic Elements:</strong> Replacing
            links with div onClick handlers, buttons with styled spans, or
            headings with font-sized divs breaks the HTML layer&apos;s inherent
            functionality. Semantic elements provide keyboard navigation, focus
            management, and screen reader support for free.
          </li>
          <li>
            <strong>Baseline Erosion Over Time:</strong> Without explicit
            testing and enforcement, the baseline degrades as developers add
            JavaScript dependencies without considering the no-JS experience.
            After six months of unmonitored development, the
            &quot;baseline&quot; may require JavaScript for basic tasks.
          </li>
          <li>
            <strong>
              Confusing Progressive Enhancement with Feature Flags:
            </strong>{" "}
            Progressive enhancement is about capability-based layering, not
            toggling features on and off. Feature flags control business logic
            (who sees what). Progressive enhancement controls technical
            resilience (what works when capabilities are limited).
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>GOV.UK:</strong> The UK Government Digital Service is the
            canonical example of progressive enhancement at scale. Every
            government service works without JavaScript — forms submit, content
            displays, and navigation functions. JavaScript adds enhanced
            validation, dynamic content updates, and improved interactions. This
            ensures that citizens on any device, browser, or network can access
            critical government services.
          </li>
          <li>
            <strong>GitHub:</strong> GitHub extensively uses progressive
            enhancement. Repository browsing, file viewing, and issue reading
            work with server-rendered HTML. JavaScript enhances with inline
            editing, real-time notifications, code review interactions, and
            keyboard shortcuts. When GitHub&apos;s JavaScript CDN had an outage
            in 2018, the site remained functional for reading and navigation —
            the baseline held.
          </li>
          <li>
            <strong>Basecamp/Hey:</strong> Basecamp&apos;s products use Hotwire
            (Turbo + Stimulus) which is architecturally progressive enhancement.
            Server-rendered HTML is the baseline, Turbo enhances page
            transitions without full reloads, and Stimulus adds lightweight
            interactivity. The entire product works without JavaScript — it just
            works better with it.
          </li>
          <li>
            <strong>Financial Times:</strong> The FT uses a &quot;cut the
            mustard&quot; approach where a feature detection test determines
            whether the browser receives the full JavaScript experience or the
            baseline HTML/CSS experience. This binary decision simplified their
            support matrix from hundreds of browser/version combinations to two
            tiers, dramatically reducing QA effort.
          </li>
        </ul>
      </section>

      {/* Section 8: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between progressive enhancement and
              graceful degradation?
            </p>
            <p className="mt-2 text-sm">
              A: They address the same problem from opposite directions.
              Progressive enhancement starts with a minimal, universally
              functional baseline (HTML) and adds layers of capability for more
              advanced browsers. Graceful degradation starts with the
              full-featured experience and adds fallbacks for less capable
              browsers. The practical difference is significant — progressive
              enhancement ensures the baseline always works because it was
              designed first. Graceful degradation often has an incomplete
              baseline because fallbacks are added retroactively, and edge cases
              are discovered in production rather than during design.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement progressive enhancement in a React
              application?
            </p>
            <p className="mt-2 text-sm">
              A: Use server-side rendering as the baseline layer — React Server
              Components or Next.js SSR generates complete HTML on the server.
              This HTML is functional without JavaScript (forms have action
              attributes, links have hrefs). Client-side hydration then enhances
              with interactive features — inline validation, optimistic updates,
              real-time notifications. For complex interactions, use the Islands
              pattern (selective hydration) so only interactive components load
              JavaScript. Feature detection gates advanced capabilities like
              Service Workers or Web Animations API.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Is progressive enhancement still relevant with modern browsers?
            </p>
            <p className="mt-2 text-sm">
              A: More relevant than ever. JavaScript failures are not just about
              old browsers — they include network failures (CDN outages,
              unreliable connections), content blockers (which can block
              third-party JavaScript), corporate proxies (which may strip
              scripts), JavaScript errors (a single uncaught exception can break
              the entire app), and slow networks (where users interact with HTML
              before JavaScript loads). Progressive enhancement protects against
              all these real-world failure modes that affect modern browsers on
              modern devices.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you enforce progressive enhancement across a large
              engineering organization?
            </p>
            <p className="mt-2 text-sm">
              A: Three mechanisms: First, encode it in the design system —
              components should render semantic HTML by default with JavaScript
              enhancements layered on top. Second, automate baseline testing in
              CI/CD — crawl pages without JavaScript and verify content
              presence, form functionality, and navigation. Third, define an
              explicit baseline contract in documentation — specifying which
              features are baseline and which are enhancements. Code review
              should verify that new features don&apos;t break the baseline
              contract.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is &quot;cutting the mustard&quot; and when would you use
              it?
            </p>
            <p className="mt-2 text-sm">
              A: Cutting the mustard is a technique where a small JavaScript
              feature detection test determines whether a browser is
              &quot;modern enough&quot; to receive the enhanced experience.
              Browsers that pass get the full JavaScript bundle; browsers that
              fail get only the HTML/CSS baseline. The BBC pioneered this to
              simplify their support matrix — instead of supporting hundreds of
              browser/version combinations, they support two tiers: enhanced and
              baseline. This reduces QA effort, simplifies development, and
              ensures baseline users get a working experience rather than a
              broken enhanced experience.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does progressive enhancement relate to accessibility?
            </p>
            <p className="mt-2 text-sm">
              A: Progressive enhancement and accessibility share the same
              foundation — semantic HTML. A progressively enhanced baseline
              built with proper heading hierarchy, form labels, link text, and
              landmark elements is inherently accessible. Screen readers consume
              the HTML layer directly, so a strong baseline means strong
              accessibility by default. JavaScript enhancements must maintain
              accessibility (ARIA attributes, focus management, keyboard
              support), but the baseline provides the essential structure.
              Organizations that practice progressive enhancement consistently
              score higher on accessibility audits because the foundation is
              solid.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <p>
          Progressive Enhancement introduces security considerations around feature detection, graceful degradation of security features, and ensuring baseline security across all enhancement levels.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Progressive Enhancement Security Patterns</h3>
          <ul className="space-y-2">
            <li>
              <strong>Baseline Security:</strong> Security features must work at the baseline level. Mitigation: implement security at the HTML/CSS layer, ensure JavaScript enhancements don't bypass security, validate all input server-side regardless of client-side validation.
            </li>
            <li>
              <strong>Feature Detection Security:</strong> Feature detection can leak information about user's browser. Mitigation: use standardized feature detection libraries, avoid fingerprinting via feature detection, implement server-side feature detection where possible.
            </li>
            <li>
              <strong>Graceful Security Degradation:</strong> Enhanced features may have additional security requirements. Mitigation: validate capabilities server-side, implement fallback security measures, ensure baseline security is never compromised.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Performance Benchmarks</h2>
        <p>
          Progressive Enhancement performance depends on baseline efficiency, enhancement loading strategy, and feature detection overhead.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Performance Metrics to Track</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Metric</th>
                <th className="p-2 text-left">Target</th>
                <th className="p-2 text-left">Measurement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Baseline Load Time</td>
                <td className="p-2">&lt;1 second</td>
                <td className="p-2">Lighthouse, WebPageTest</td>
              </tr>
              <tr>
                <td className="p-2">Enhancement Load Time</td>
                <td className="p-2">&lt;3 seconds</td>
                <td className="p-2">Performance.now()</td>
              </tr>
              <tr>
                <td className="p-2">Feature Detection Time</td>
                <td className="p-2">&lt;10ms</td>
                <td className="p-2">Performance.now()</td>
              </tr>
              <tr>
                <td className="p-2">Baseline Functionality</td>
                <td className="p-2">100% core features</td>
                <td className="p-2">Manual testing</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Enhancement Strategy Comparison</h3>
          <p>
            Different enhancement strategies have different performance characteristics:
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <strong>CSS Enhancements:</strong> Load time: ~10-50ms. Best for: visual enhancements, layout improvements. Limitation: requires CSS support.
            </li>
            <li>
              <strong>JavaScript Enhancements:</strong> Load time: ~100-500ms. Best for: interactive features, complex functionality. Limitation: requires JavaScript support.
            </li>
            <li>
              <strong>Progressive Images:</strong> Load time: ~50-200ms. Best for: image-heavy pages. Limitation: requires modern image format support.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Cost Analysis</h2>
        <p>
          Progressive Enhancement has development costs but provides significant benefits for accessibility, SEO, and resilience.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Development Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Initial Development:</strong> Building with PE from start: +20-30% development time. Retrofitting PE to existing code: +50-100% refactoring time.
            </li>
            <li>
              <strong>Testing:</strong> Testing across enhancement levels: +30-50% testing time. Automated testing can reduce this overhead.
            </li>
            <li>
              <strong>Maintenance:</strong> Well-structured PE code is easier to maintain. Estimate: 10-20% reduction in bug fixes.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">ROI from Progressive Enhancement</h3>
          <ul className="space-y-2">
            <li>
              <strong>Accessibility:</strong> Built-in accessibility reduces legal risk. Estimate: $50K-150K savings in potential legal fees.
            </li>
            <li>
              <strong>SEO Benefits:</strong> Search engines can crawl baseline content. Estimate: 10-30% improvement in organic traffic.
            </li>
            <li>
              <strong>Resilience:</strong> Site works when JavaScript fails. Estimate: 5-10% of users benefit from baseline functionality.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">When to Use Progressive Enhancement</h3>
          <p>
            Use PE when: (1) you need maximum accessibility, (2) SEO is critical, (3) you serve users with varying browser capabilities. Avoid when: (1) you're building internal tools with known browser requirements, (2) the application requires modern features for core functionality.
          </p>
        </div>
      </section>

      {/* Section 9: References & Further Reading */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://alistapart.com/article/understandingprogressiveenhancement/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              A List Apart — Understanding Progressive Enhancement
            </a>
          </li>
          <li>
            <a
              href="https://www.gov.uk/service-manual/technology/using-progressive-enhancement"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              GOV.UK Service Manual — Using Progressive Enhancement
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/articles/progressively-enhance-your-pwa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              web.dev — Progressively Enhance Your PWA
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/2009/04/progressive-enhancement-what-it-is-and-how-to-use-it/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              Smashing Magazine — Progressive Enhancement Guide
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
