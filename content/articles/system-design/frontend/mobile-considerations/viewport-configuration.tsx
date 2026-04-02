"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-viewport-configuration",
  title: "Viewport Configuration",
  description:
    "Comprehensive guide to Viewport Configuration covering meta viewport tag, visual viewport vs layout viewport, mobile browser quirks, and production-scale responsive patterns.",
  category: "frontend",
  subcategory: "mobile-considerations",
  slug: "viewport-configuration",
  wordCount: 5200,
  readingTime: 20,
  lastUpdated: "2026-04-02",
  tags: [
    "frontend",
    "viewport",
    "meta tag",
    "mobile",
    "responsive",
    "browser quirks",
  ],
  relatedTopics: [
    "responsive-design",
    "mobile-first-design",
    "mobile-performance-optimization",
  ],
};

export default function ViewportConfigurationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Viewport Configuration</strong> controls how a webpage is
          displayed on mobile devices through the meta viewport tag. The
          viewport is the visible area of a webpage — on desktop, this is the
          browser window; on mobile, it&apos;s the screen (minus browser UI like
          address bar). Without proper viewport configuration, mobile browsers
          assume your site is designed for desktop and zoom out to show the
          entire page (typically 980px wide), making text tiny and requiring
          pinch-to-zoom. The meta viewport tag tells the browser to match the
          viewport to the device width, enabling proper responsive design.
        </p>
        <p>
          For staff-level engineers, viewport configuration involves
          understanding the difference between visual viewport (what user sees)
          and layout viewport (what CSS uses for layout), handling mobile
          browser UI (address bar that shows/hides), and dealing with browser
          quirks (iOS Safari zoom on input focus, Android address bar overlap).
          Proper viewport configuration is foundational — without it, responsive
          design doesn&apos;t work correctly.
        </p>
        <p>
          Viewport configuration involves several technical considerations.{" "}
          <strong>Initial scale</strong> — starting zoom level (1.0 = 100%, no
          zoom). <strong>Minimum/maximum scale</strong> — zoom limits
          (accessibility requires allowing zoom). <strong>Viewport units</strong>{" "}
          — <code>vw</code>, <code>vh</code> behave differently on mobile
          (address bar affects vh). <strong>Dynamic viewport</strong> — address
          bar show/hide changes viewport height, triggering resize events.
        </p>
        <p>
          The business case for proper viewport configuration is clear: without
          it, mobile users see a zoomed-out desktop site with tiny text. This
          creates poor user experience, high bounce rates, and lost conversions.
          Google&apos;s mobile-first indexing penalizes sites without proper
          viewport configuration. Proper viewport setup is the first step in
          mobile optimization — everything else (responsive CSS, touch events)
          depends on it.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Meta Viewport Tag:</strong>{" "}
            <code>&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;</code>.{" "}
            <code>width=device-width</code> matches viewport to screen width.{" "}
            <code>initial-scale=1.0</code> starts at 100% zoom. Required for
            responsive design.
          </li>
          <li>
            <strong>Visual Viewport:</strong> What the user actually sees —
            excludes browser UI (address bar, toolbar). Changes when address bar
            shows/hides. Accessed via <code>visualViewport</code> API. Important
            for fixed/sticky positioning.
          </li>
          <li>
            <strong>Layout Viewport:</strong> What CSS uses for layout — the
            coordinate system for CSS. Typically larger than visual viewport
            (includes area behind browser UI). <code>width=device-width</code>{" "}
            sets layout viewport to device width.
          </li>
          <li>
            <strong>Viewport Units:</strong>{" "}
            <code>vw</code> (viewport width), <code>vh</code> (viewport height),{" "}
            <code>vmin</code>, <code>vmax</code>. On mobile,{" "}
            <code>vh</code> includes area behind address bar — use{" "}
            <code>dvh</code> (dynamic vh) for visual viewport height.
          </li>
          <li>
            <strong>Scale Control:</strong>{" "}
            <code>minimum-scale</code>, <code>maximum-scale</code>,{" "}
            <code>user-scalable</code>. Don&apos;t disable zoom (accessibility
            violation). Allow users to zoom for readability.
          </li>
          <li>
            <strong>Viewport-Fit:</strong>{" "}
            <code>viewport-fit=cover</code> for notched devices (iPhone X+).
            Extends viewport into safe area. Use <code>env(safe-area-inset-*)</code>{" "}
            to avoid notches.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/viewport-meta-tag-properties.svg"
          alt="Viewport Meta Tag Properties showing width, initial-scale, minimum-scale, maximum-scale, user-scalable options"
          caption="Viewport meta tag — width=device-width matches viewport to screen, initial-scale=1.0 starts at 100% zoom, avoid disabling user zoom for accessibility"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Viewport configuration architecture consists of the meta viewport tag
          (initial setup), CSS viewport units (responsive sizing), and
          JavaScript viewport APIs (dynamic handling). The architecture must
          handle different mobile browsers (iOS Safari, Android Chrome), notched
          devices, and dynamic viewport changes (address bar show/hide).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/visual-vs-layout-viewport.svg"
          alt="Visual vs Layout Viewport showing the difference between what user sees and what CSS uses for layout"
          caption="Visual vs Layout viewport — visual viewport is what user sees (excludes browser UI), layout viewport is CSS coordinate system (includes area behind browser UI)"
          width={900}
          height={500}
        />

        <h3>Mobile Browser Viewport Behavior</h3>
        <p>
          <strong>iOS Safari:</strong> Address bar at bottom (iOS 15+),
          collapses on scroll. <code>vh</code> includes address bar area — use{" "}
          <code>dvh</code> or JavaScript calculation. Zooms page when focusing
          input if font-size &lt; 16px — use 16px minimum to prevent.
        </p>
        <p>
          <strong>Android Chrome:</strong> Address bar at top, collapses on
          scroll. <code>vh</code> more reliable than iOS. No auto-zoom on input
          focus. Use <code>height: 100dvh</code> for full-height layouts.
        </p>
        <p>
          <strong>Notched Devices:</strong> iPhone X+, Android notched phones.
          Use <code>viewport-fit=cover</code> to extend into safe area. Use{" "}
          <code>env(safe-area-inset-top)</code>,{" "}
          <code>env(safe-area-inset-bottom)</code> to avoid notches and home
          indicator.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/mobile-browser-viewport-comparison.svg"
          alt="Mobile Browser Viewport Comparison showing iOS Safari vs Android Chrome viewport behavior differences"
          caption="Mobile browser comparison — iOS Safari and Android Chrome handle viewport differently; address bar behavior affects vh units and fixed positioning"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Viewport configuration involves trade-offs between control,
          accessibility, and browser compatibility.
        </p>

        <h3>Scale Control Trade-offs</h3>
        <p>
          <strong>Allow Zoom (Recommended):</strong>{" "}
          <code>user-scalable=yes</code> (default). Advantages: accessibility
          (users with vision impairment can zoom), user control. Limitations:
          users might zoom and break layout. Best for: all public websites.
        </p>
        <p>
          <strong>Disable Zoom (Not Recommended):</strong>{" "}
          <code>user-scalable=no</code>. Advantages: consistent layout.
          Limitations: accessibility violation (WCAG failure), frustrates users.
          Best for: never — accessibility requirement to allow zoom.
        </p>
        <p>
          <strong>Limit Zoom Range:</strong>{" "}
          <code>minimum-scale=1, maximum-scale=5</code>. Advantages: prevents
          excessive zoom out, allows reasonable zoom in. Limitations: still
          restricts user control. Best for: specific use cases where some
          restriction needed.
        </p>

        <h3>Viewport Unit Approaches</h3>
        <p>
          <strong>vh/vw Units:</strong> Standard viewport units. Advantages:
          simple, widely supported. Limitations: <code>vh</code> includes area
          behind browser UI on mobile. Best for: desktop, non-full-height
          layouts.
        </p>
        <p>
          <strong>dvh/dvw Units:</strong> Dynamic viewport units. Advantages:{" "}
          <code>dvh</code> matches visual viewport (excludes browser UI).
          Limitations: newer, less support (iOS Safari 16+). Best for:
          full-height mobile layouts.
        </p>
        <p>
          <strong>JavaScript Calculation:</strong> Calculate viewport height in
          JS, set CSS variable. Advantages: works everywhere, precise control.
          Limitations: JavaScript required, resize event handling. Best for:
          maximum compatibility, complex layouts.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Always Include Viewport Meta Tag:</strong>{" "}
            <code>&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;</code>.
            First thing in <code>&lt;head&gt;</code>. Without it, responsive
            design doesn&apos;t work.
          </li>
          <li>
            <strong>Don&apos;t Disable Zoom:</strong> Never use{" "}
            <code>user-scalable=no</code> or <code>maximum-scale=1</code>.
            Accessibility violation (WCAG 2.1 Level A). Users need zoom for
            readability.
          </li>
          <li>
            <strong>Use 16px Minimum Font Size:</strong> iOS Safari zooms page
            when focusing input with font-size &lt; 16px. Use 16px minimum for
            inputs to prevent auto-zoom. Or embrace the zoom and design for it.
          </li>
          <li>
            <strong>Handle Notched Devices:</strong> Use{" "}
            <code>viewport-fit=cover</code> for full-screen experience. Use{" "}
            <code>padding: env(safe-area-inset-*)</code> to avoid notches and
            home indicator.
          </li>
          <li>
            <strong>Use dvh for Full-Height Layouts:</strong>{" "}
            <code>height: 100dvh</code> for full-height sections. Fallback to{" "}
            <code>height: 100vh</code> for older browsers. Or use JavaScript
            calculation with CSS variable.
          </li>
          <li>
            <strong>Test on Real Devices:</strong> Viewport behavior differs on
            real devices vs. DevTools. Test on iOS Safari, Android Chrome. Test
            notched devices. Test address bar show/hide behavior.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Missing Viewport Meta Tag:</strong> Site renders as desktop
            on mobile, tiny text, requires pinch-to-zoom. Always include viewport
            meta tag — it&apos;s the foundation of mobile web.
          </li>
          <li>
            <strong>Disabling Zoom:</strong>{" "}
            <code>user-scalable=no</code> fails WCAG accessibility. Users with
            vision impairment can&apos;t read content. Always allow zoom.
          </li>
          <li>
            <strong>100vh on Mobile:</strong>{" "}
            <code>height: 100vh</code> includes area behind address bar —
            content hidden. Use <code>100dvh</code> or JavaScript calculation.
          </li>
          <li>
            <strong>Input Auto-Zoom on iOS:</strong> Input with font-size &lt;
            16px triggers page zoom on focus. Prevents user from seeing form.
            Use 16px minimum or handle the zoom.
          </li>
          <li>
            <strong>Ignoring Safe Areas:</strong> Content overlaps notch or home
            indicator on iPhone X+. Use <code>viewport-fit=cover</code> and{" "}
            <code>env(safe-area-inset-*)</code>.
          </li>
          <li>
            <strong>Fixed Positioning Issues:</strong>{" "}
            <code>position: fixed</code> behaves differently when address bar
            shows/hides. Test fixed headers/footers on mobile.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Full-Screen Mobile App Layout</h3>
        <p>
          Mobile web apps need full-screen layout (header, content, footer). Use{" "}
          <code>height: 100dvh</code> for container. Header: fixed top with{" "}
          <code>env(safe-area-inset-top)</code>. Footer: fixed bottom with{" "}
          <code>env(safe-area-inset-bottom)</code>. Content: scrollable between
          header and footer. Handles notches and address bar.
        </p>

        <h3>Responsive Image Gallery</h3>
        <p>
          Image gallery with viewport-based sizing. Images sized with{" "}
          <code>width: 100vw</code> for full-bleed effect. Lightbox uses{" "}
          <code>position: fixed; inset: 0</code> to cover viewport. Handle
          address bar show/hide — lightbox should always cover visible area.
        </p>

        <h3>Mobile Form Design</h3>
        <p>
          Forms with input fields. Use 16px font-size to prevent iOS auto-zoom.
          Viewport configured to allow zoom (accessibility). On input focus,
          scroll input into view (prevent keyboard from hiding input). Handle
          virtual keyboard — viewport height changes when keyboard appears.
        </p>

        <h3>Progressive Web App (PWA)</h3>
        <p>
          PWA installed to home screen runs in &quot;standalone&quot; mode — no
          browser UI. Viewport configuration same, but no address bar to handle.
          Use <code>display: standalone</code> in manifest. Full-screen
          experience, handle notches with safe-area-inset.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What does the meta viewport tag do and why is it important?
            </p>
            <p className="mt-2 text-sm">
              A: Meta viewport tag controls how webpage displays on mobile.{" "}
              <code>width=device-width</code> matches viewport to screen width
              (not desktop width). <code>initial-scale=1.0</code> starts at 100%
              zoom. Without it, mobile browsers assume desktop site, zoom out to
              show full 980px page, text is tiny, requires pinch-to-zoom. With
              it, responsive CSS works correctly, text is readable, proper
              mobile experience.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What&apos;s the difference between visual viewport and layout
              viewport?
            </p>
            <p className="mt-2 text-sm">
              A: Visual viewport: what user actually sees — excludes browser UI
              (address bar, toolbar). Changes when address bar shows/hides.
              Layout viewport: CSS coordinate system — typically larger,
              includes area behind browser UI. <code>width=device-width</code>{" "}
              sets layout viewport. For full-height layouts, use visual viewport
              (<code>dvh</code> or JavaScript calculation).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Why does iOS zoom when focusing an input field?
            </p>
            <p className="mt-2 text-sm">
              A: iOS Safari auto-zooms when input font-size &lt; 16px. Assumption:
              user needs zoom to read small text. Problem: zoomed view shows
              only part of form, user can&apos;t see context. Solutions: (1) Use
              16px minimum font-size for inputs (prevents zoom). (2) Embrace
              zoom — design form to work when zoomed. (3) Use JavaScript to
              detect and handle zoom. The 16px minimum is a well-known iOS
              quirk — always test forms on actual iOS devices to verify behavior.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle full-height layouts on mobile?
            </p>
            <p className="mt-2 text-sm">
              A: Three approaches: (1) <code>height: 100dvh</code> — dynamic vh,
              excludes browser UI. Best: simple, modern. (2) JavaScript
              calculation: <code>const vh = window.innerHeight * 0.01;</code>{" "}
              set CSS variable <code>--vh</code>, use <code>height: calc(var(--vh) * 100)</code>.
              Works everywhere. (3) <code>height: 100vh</code> with overflow —
              simple but includes area behind browser UI. Best: dvh with
              JavaScript fallback. dvh is newer (iOS Safari 16+) — provide
              fallback for older browsers to ensure consistent experience.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle notched devices (iPhone X+)?
            </p>
            <p className="mt-2 text-sm">
              A: Use <code>viewport-fit=cover</code> in meta viewport tag —
              extends viewport into safe area (behind notch). Use CSS{" "}
              <code>env(safe-area-inset-top)</code>,{" "}
              <code>env(safe-area-inset-bottom)</code>,{" "}
              <code>env(safe-area-inset-left)</code>,{" "}
              <code>env(safe-area-inset-right)</code> to add padding avoiding
              notch and home indicator. Example:{" "}
              <code>padding-top: max(1rem, env(safe-area-inset-top))</code>.
              Safe area insets are provided by the browser — no need to
              hardcode values for specific devices. CSS handles different notch
              sizes automatically.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Should you disable user zoom for mobile sites?
            </p>
            <p className="mt-2 text-sm">
              A: No — never disable zoom. <code>user-scalable=no</code> or{" "}
              <code>maximum-scale=1</code> fails WCAG 2.1 Level A accessibility.
              Users with vision impairment need zoom to read content. Even
              users without impairment may need zoom in bright sunlight or for
              small text. Allow zoom — design responsive layout that works at
              different zoom levels. Disabling zoom is an accessibility
              violation that can lead to legal issues — always allow users to
              zoom for readability.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — Viewport Meta Tag
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/Viewport_concepts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — Viewport Concepts
            </a>
          </li>
          <li>
            <a
              href="https://webkit.org/blog/7929/designing-websites-for-iphone-x/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              WebKit — Designing Websites for iPhone X
            </a>
          </li>
          <li>
            <a
              href="https://css-tricks.com/the-trick-to-viewport-units-on-mobile/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              CSS-Tricks — Viewport Units on Mobile
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/responsive-web-design-basics/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Web.dev — Responsive Web Design Basics
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG21/Understanding/reflow.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              WCAG 2.1 — Reflow (Zoom Requirements)
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
