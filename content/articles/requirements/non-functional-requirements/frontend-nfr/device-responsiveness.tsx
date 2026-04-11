"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-device-responsiveness",
  title: "Device Responsiveness",
  description:
    "Comprehensive guide to responsive design: mobile-first approach, breakpoints, fluid layouts, touch interactions, and cross-device testing strategies.",
  category: "frontend",
  subcategory: "nfr",
  slug: "device-responsiveness",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-11",
  tags: [
    "frontend",
    "nfr",
    "responsive",
    "mobile-first",
    "breakpoints",
    "touch",
    "cross-device",
  ],
  relatedTopics: ["accessibility", "performance", "media-optimization"],
};

export default function DeviceResponsivenessArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Device Responsiveness</strong> ensures that web applications
          adapt seamlessly to different screen sizes, orientations, input
          methods, and device capabilities. This encompasses phones (320px to
          430px wide), tablets (768px to 1024px), laptops (1280px to 1440px),
          desktops (1440px to 2560px+), and emerging form factors like foldable
          devices and large-screen phones. For staff engineers, responsiveness
          is both a technical challenge and a business imperative — mobile
          traffic exceeds desktop for most consumer websites, Google uses
          mobile-first indexing for search ranking, and poor mobile experience
          directly impacts conversion rates, user engagement, and brand
          perception.
        </p>
        <p>
          Responsive design extends beyond layout adaptation to encompass input
          method differences (touch targets versus mouse precision), pixel
          density variations (1x to 4x+ Retina displays requiring higher
          resolution assets), device capabilities (camera, GPS, biometric
          authentication), and network conditions (WiFi, 4G, 3G, offline). A
          truly responsive application considers all these dimensions, not just
          viewport width. A layout that looks perfect on a desktop browser may
          be unusable on a phone where the user has large fingers, limited
          bandwidth, and is viewing the screen in bright sunlight.
        </p>
        <p>
          The mobile-first design philosophy — designing for the smallest screen
          first and progressively enhancing for larger screens — has become the
          industry standard. This approach forces prioritization of essential
          content and features, naturally produces leaner CSS (adding styles for
          larger screens rather than overriding desktop styles for mobile),
          aligns with Google&apos;s mobile-first indexing, and is more cost
          efficient because it is easier to add complexity than to remove it.
          The alternative — desktop-first design — often results in mobile
          experiences that feel like cramped desktop layouts rather than
          purpose-built mobile interfaces.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          The mobile-first approach organizes CSS from smallest to largest
          viewport. Base styles — written without media queries — target mobile
          devices. Min-width media queries add enhancements for progressively
          larger screens. This contrasts with desktop-first design, which uses
          max-width queries to reduce complexity for smaller screens. The
          mobile-first approach is architecturally cleaner because each
          breakpoint adds new capabilities rather than overriding existing ones,
          reducing CSS specificity conflicts and making the stylesheet easier to
          reason about.
        </p>
        <p>
          Breakpoint strategy determines where layouts change between screen
          sizes. The best practice is to use content-driven breakpoints rather
          than device-specific ones — let the content dictate when the layout
          needs to change, rather than targeting specific device dimensions.
          Common content-driven breakpoints cluster around 320px (small phones),
          768px (tablets), 1024px (laptops), and 1280px+ (desktops), but these
          should be validated against your actual content and user analytics.
          Keep the breakpoint count minimal — three to five breakpoints
          typically cover the full range of devices. Name breakpoints
          semantically (sm, md, lg, xl) rather than by device (phone, tablet,
          desktop) because device dimensions change with every product cycle.
        </p>
        <p>
          Fluid layouts use relative units (percentages, rem, em, viewport
          units) instead of fixed pixel values, allowing content to scale
          proportionally with the viewport. CSS Grid and Flexbox provide
          powerful layout capabilities that adapt to available space without
          requiring breakpoint-specific rules for every layout change. Fluid
          typography scales font sizes smoothly between breakpoints using
          <code>clamp()</code> or viewport units, avoiding the jarring font size
          jumps that occur when typography changes only at breakpoints. CSS
          Container Queries represent a paradigm shift — instead of styling
          based on the viewport size, components can respond to their container
          size, enabling truly modular responsive components that adapt
          regardless of where they are placed in the layout.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/mobile-first-approach.svg"
          alt="Mobile-First Approach"
          caption="Mobile-first responsive design — starting with mobile base styles and progressively enhancing for larger screens with min-width media queries"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Responsive design architecture organizes styles into three layers:
          base styles for the smallest viewport, breakpoint-specific
          enhancements for larger viewports, and component-level responsiveness
          using Container Queries. The base layer defines the mobile experience
          — single-column layouts, full-width buttons, touch-friendly target
          sizes (minimum 44×44px), and simplified navigation (hamburger menu or
          bottom navigation). The breakpoint layer enhances this foundation —
          adding columns to the layout at the tablet breakpoint, expanding
          navigation to a horizontal menu at the desktop breakpoint, and
          increasing font sizes and spacing for readability on larger screens.
        </p>
        <p>
          Touch interaction architecture requires different design considerations
          than mouse-based interaction. Touch targets must meet minimum size
          requirements — 44×44px per Apple&apos;s Human Interface Guidelines or
          48×48px per Material Design — with at least 8px spacing between
          targets to prevent accidental taps. Primary actions should be placed
          in the thumb zone (the bottom-right area for right-handed users,
          bottom-left for left-handed users) for comfortable one-handed use.
          Hover states, which are fundamental to desktop UX, do not exist on
          touch devices — critical information and actions must be visible
          without hover. Touch gestures (swipe, pinch, long press) provide
          additional interaction channels but must have visible alternatives
          because not all users discover gesture-based interactions.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/breakpoint-strategy.svg"
          alt="Breakpoint Strategy"
          caption="Content-driven breakpoint strategy — showing how layout evolves from single-column mobile to multi-column desktop with fluid transitions between breakpoints"
        />

        <p>
          Responsive image delivery is integral to device responsiveness. The{" "}
          <code>srcset</code> attribute provides multiple image resolutions,
          allowing the browser to select the most appropriate size based on the
          device&apos;s pixel density and viewport width. The <code>sizes</code>
          attribute tells the browser how large the image will be displayed at
          different viewport widths, enabling it to download the optimal
          resolution before CSS has finished loading. The <code>
            &lt;picture&gt;
          </code>{" "}
          element enables art direction — serving entirely different image crops
          or compositions for different screen sizes — and format switching,
          serving AVIF or WebP to supporting browsers with JPEG fallbacks for
          older browsers. Lazy loading defers below-the-fold images until they
          approach the viewport, reducing initial page weight.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/responsive-images.svg"
          alt="Responsive Image Delivery"
          caption="Responsive image delivery — srcset for resolution switching, picture element for art direction, and lazy loading for below-the-fold images"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Breakpoint count and granularity involve a trade-off between design
          precision and CSS complexity. More breakpoints allow pixel-perfect
          layouts at specific device sizes but increase CSS file size,
          maintenance burden, and the risk of inconsistent layouts between
          breakpoints. Fewer breakpoints produce simpler, more maintainable CSS
          but may result in suboptimal layouts at intermediate screen sizes.
          Fluid layouts with <code>clamp()</code> and CSS Grid&apos;s{" "}
          <code>minmax()</code> reduce the need for breakpoints by creating
          layouts that adapt continuously rather than at discrete breakpoints.
          The pragmatic approach is to use fluid layouts for continuous
          adaptation supplemented by a minimal set of breakpoints (3-5) for
          structural layout changes that fluid techniques cannot achieve.
        </p>
        <p>
          Container Queries versus media queries represent a fundamental
          architectural choice in component design. Media queries respond to
          viewport size, meaning a component&apos;s appearance depends on the
          overall page layout — a card component looks different in a sidebar
          versus the main content area because the viewport is the same but the
          available space differs. Container queries respond to the component&apos;s
          container size, enabling the card to adapt based on its actual
          available space regardless of viewport. Container queries have 90%+
          browser support as of 2024 but are not supported in older browsers.
          The trade-off is modern, modular component design versus broader
          browser compatibility.
        </p>
        <p>
          Testing strategy breadth versus depth is a practical consideration.
          Testing every possible device and browser combination is impossible —
          there are hundreds of device models, browser versions, and OS
          combinations. The pragmatic approach is to test on the devices
          represented in your user analytics, prioritizing the top 5-10 devices
          that account for 80%+ of your traffic. Use DevTools for initial
          iteration, BrowserStack for comprehensive coverage, and physical
          devices for final validation of the most-used configurations. Include
          iOS Safari specifically in your test matrix because it often renders
          differently from Chrome and has unique quirks (viewport handling,
          touch event behavior, font size adjustments).
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Write CSS with a mobile-first architecture from the start of the
          project. Define your breakpoint tokens in a design token system and
          use them consistently across all components. Write base styles for
          mobile without media queries, then add enhancements with min-width
          queries for each breakpoint. Use CSS custom properties for spacing
          scales that increase at larger breakpoints. Apply max-width constraints
          to content areas on desktop to prevent lines of text from becoming too
          long to read comfortably (optimal reading width is 50-75 characters
          per line).
        </p>
        <p>
          Design touch interactions with accessibility and ergonomics in mind.
          Ensure all interactive elements meet minimum touch target sizes with
          adequate spacing. Place frequent actions in the thumb zone for
          comfortable one-handed use. Provide visual feedback for all touch
          interactions — buttons should have active/pressed states, scrollable
          areas should have scroll indicators, and swipeable elements should
          show partial content to indicate scrollability. Test touch
          interactions on actual devices, not just DevTools simulation, because
          DevTools cannot replicate finger size, touch accuracy, or the physical
          ergonomics of one-handed use.
        </p>
        <p>
          Implement responsive image delivery as a default practice, not an
          optimization added later. Use <code>srcset</code> with width
          descriptors for all content images, provide <code>sizes</code>
          hints based on your layout, and use the <code>&lt;picture&gt;</code>
          element for hero images that benefit from art direction. Specify width
          and height attributes on all images to prevent Cumulative Layout Shift
          (CLS), a Core Web Vital metric. Lazy-load images that are below the
          fold on initial render. Serve modern image formats (WebP, AVIF) with
          JPEG fallbacks using the <code>&lt;picture&gt;</code> element&apos;s
          source ordering.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The iOS Safari viewport height problem is the most well-known
          cross-device pitfall. Setting <code>height: 100vh</code> on iOS
          Safari includes the area behind the browser&apos;s address and
          navigation bars, causing content to extend below the visible area.
          The fix is <code>height: 100dvh</code> (dynamic viewport height,
          supported in Safari 15.4+) or a JavaScript fallback using{" "}
          <code>window.innerHeight</code>. A related issue is fixed-position
          elements being obscured by the virtual keyboard on Android — elements
          positioned with <code>position: fixed; bottom: 0</code> slide up with
          the keyboard on some Android browsers. Use{" "}
          <code>position: sticky</code> or JavaScript-based positioning as a
          workaround.
        </p>
        <p>
          Horizontal scroll overflow is a common layout bug that breaks the
          mobile experience. It occurs when an element exceeds the viewport
          width — typically caused by images without max-width constraints,
          absolutely positioned elements placed outside the viewport, or content
          with fixed widths (tables, code blocks). The symptom is that users can
          scroll horizontally, which is unexpected on mobile and indicates a
          broken layout. Prevention includes setting <code>max-width: 100%</code>
          on all images and media, using <code>overflow-x: hidden</code> on the
          body as a safety net (though this masks the underlying issue), and
          testing at every breakpoint during development.
        </p>
        <p>
          Designing hover-dependent interactions is a pitfall that makes
          applications unusable on touch devices. Tooltips that only appear on
          hover, navigation menus that expand on hover, and action buttons that
          reveal on hover all fail on touch devices where there is no hover
          state. The solution is to ensure all information and actions are
          accessible without hover — show tooltips on tap, use click/tap for
          menu expansion, and keep action buttons visible or use swipe gestures
          with visible indicators. Use CSS <code>:hover</code> only for
          enhanced states, not for essential functionality.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          News and media websites serve content to the broadest possible device
          range and are heavily impacted by Google&apos;s mobile-first indexing.
          The New York Times, The Guardian, and BBC News all use mobile-first
          responsive design with content-driven breakpoints. Their layouts
          transition from single-column on mobile to multi-column grid layouts
          on desktop, with typography scales that ensure readability across all
          devices. Images use srcset for resolution switching and lazy loading
          for below-the-fold content. The business impact is direct — mobile
          traffic accounts for 60-70% of news site visits, and Google&apos;s
          search ranking algorithm prioritizes mobile-friendly sites.
        </p>
        <p>
          E-commerce platforms face unique responsive design challenges because
          product browsing, comparison, and checkout have different requirements
          across devices. Users browse on mobile during commutes but often
          complete purchases on desktop. The responsive design must support
          seamless cross-device journeys — product lists that are scannable on
          mobile (large images, minimal text) but information-dense on desktop
          (grid layout, comparison features). The checkout flow is simplified on
          mobile (fewer fields, auto-fill, digital wallets like Apple Pay and
          Google Pay) while providing full payment options on desktop. Amazon
          and Shopify-powered stores exemplify this approach.
        </p>
        <p>
          Data-heavy dashboards present the most challenging responsive design
          scenario. Complex data tables, charts, and multi-panel layouts that
          work well on desktop do not translate directly to mobile. Common
          strategies include progressive disclosure on mobile (show summary
          metrics, expand for details), horizontal scroll for data tables with
          sticky first columns, and chart simplification on mobile (fewer data
          points, simplified legends). Some dashboard applications use a
          &quot;companion app&quot; strategy — a simplified mobile app for
          monitoring and alerts, with the full dashboard available only on
          desktop. This acknowledges that some interfaces are inherently
          desktop-oriented.
        </p>
      </section>

      <section>
        <h2>Advanced Responsive Architecture</h2>
        <p>
          Container queries implementation represents a paradigm shift from viewport-based responsive design to component-based responsiveness. Unlike media queries, which style components based on the viewport size (meaning a component looks different in a sidebar versus the main content area because the viewport is the same but the available space differs), container queries style components based on their container&apos;s actual dimensions. The implementation requires two steps: first, declaring a containment context on the parent element using container-type: inline-size (which establishes the container as a sizing reference for its descendants), and second, writing container queries on the child components using @container with a minimum width condition. The container query evaluates the width of the nearest ancestor with a containment context, not the viewport, enabling truly modular responsive components that adapt regardless of where they are placed in the layout. This is particularly powerful for design systems and component libraries — a card component can define its own responsive breakpoints (switching from horizontal to vertical layout at 400px container width) that work correctly whether the card is in a narrow sidebar (300px container) or a wide main content area (800px container). Container queries have 90%+ browser support as of 2024 (Chrome 105+, Firefox 110+, Safari 16+) but are not supported in older browsers. The fallback strategy is to use media queries as the baseline styling and container queries as a progressive enhancement — older browsers get viewport-based responsiveness, while modern browsers get the more precise container-based responsiveness.
        </p>
        <p>
          Foldable device support addresses the emerging category of devices with flexible displays that can be folded, unfolded, or partially folded, creating dynamic screen geometries that traditional responsive design does not account for. The Surface Duo (dual-screen), Samsung Galaxy Fold (single folding screen), and other foldable devices present unique challenges — when folded, the device has a single small screen (typically 5-6 inches); when unfolded, it has a large continuous screen (7-8 inches); and when partially folded (tabletop mode, book mode), it has two separate screens with a hinge between them. The CSS Viewport Segments API (currently experimental, supported in Chrome on Surface Duo) provides media features that detect the foldable device&apos;s state — env(fold-top), env(fold-left), env(fold-width), and env(fold-height) define the rectangle of the hinge area, allowing the layout to avoid placing interactive elements in the fold zone. The implementation uses CSS environment variables within media queries — a media query with a spanning condition detects a vertical fold and allows the layout to place content on either side of the fold. For foldable devices that do not support the Viewport Segments API, the responsive design should rely on the actual viewport dimensions — when the device is unfolded, the viewport width is the full unfolded width, and the layout should adapt accordingly using standard media queries or container queries. The key principle is content continuity — when the user unfolds the device, the content should flow seamlessly across the expanded viewport without losing context, scroll position, or interaction state.
        </p>
        <p>
          Responsive typography systems ensure that text remains readable and aesthetically pleasing across all screen sizes, from small phones to large desktop monitors. The foundation is fluid typography — using CSS clamp() to define a font size range that scales smoothly between a minimum and maximum value based on the viewport width. For example, font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem) sets the font size to a minimum of 1rem (on small screens), a maximum of 1.5rem (on large screens), and scales fluidly between them based on 2% of the viewport width plus a base offset. This approach eliminates the jarring font size jumps that occur when typography changes only at breakpoints, providing a continuous typographic rhythm. The type scale — the ratio between heading levels, body text, and caption text — should be maintained across all viewport sizes using consistent mathematical ratios (typically 1.125 to 1.333, based on musical harmony ratios). Line length is a critical readability factor — the optimal reading width is 50-75 characters per line, and on large desktop screens, unconstrained text can exceed 150 characters per line, making it difficult for the reader&apos;s eye to track from the end of one line to the beginning of the next. The solution is to set max-width constraints on text containers (max-width: 65ch for body text, where &quot;ch&quot; is the width of the &quot;0&quot; character) and center the content within the available space. Responsive line height adjusts based on font size — smaller text needs more line height for readability (line-height: 1.6-1.8 for body text), while larger text (headings) can use tighter line height (line-height: 1.1-1.3).
        </p>
        <p>
          Touch target optimization across devices goes beyond meeting minimum size requirements to encompass the ergonomic realities of how users interact with touch screens on different device form factors. On phones, users typically hold the device with one hand and interact with their thumb, which has a limited reach zone — the bottom-right area for right-handed users and bottom-left for left-handed users. Primary actions (submit, confirm, navigate) should be placed in the thumb zone, while secondary actions (cancel, delete, settings) can be placed at the top of the screen. On tablets, users may hold the device with two hands or place it on a surface, changing the interaction dynamics — the thumb zone is less relevant, and touch targets should be sized for accurate tapping regardless of position. The WCAG 2.1 Level AAA standard recommends a minimum touch target size of 44x44 CSS pixels with at least 8px spacing between targets, and this should be applied consistently across all device sizes. The challenge is that on small screens, fitting many touch targets with adequate spacing is difficult — the solution is to prioritize the most important actions as touch-visible targets and hide secondary actions behind overflow menus (the three-dot menu) or swipe gestures. Touch target sizing should be tested with actual fingers, not mouse pointers in DevTools, because DevTools simulates touch events but does not simulate finger size, accuracy, or the physical ergonomics of holding the device.
        </p>
        <p>
          Responsive image art direction goes beyond resolution switching (serving the same image at different sizes) to serving entirely different image compositions optimized for different screen sizes. A hero image that works on desktop — a wide landscape with a person on the right side — may lose the person entirely when cropped to a mobile aspect ratio, because the person falls outside the cropped area. Art direction solves this by serving different image crops for different screen sizes — the desktop version shows the full wide landscape, while the mobile version shows a tighter crop centered on the person. The implementation uses the picture element with multiple source elements, each with a media query specifying the viewport conditions for that source, and a srcset for resolution switching within each source. The browser evaluates the media queries in order and uses the first matching source, downloading the appropriate image for the current viewport. Art direction is particularly important for product photography (showing different angles on different screen sizes), editorial content (different image compositions for different layouts), and hero images with focal points that must remain visible at all sizes. The trade-off is asset management — each image requires multiple art-directed variants, increasing the complexity of the content management workflow and the storage requirements. Automated art direction tools (Cloudinary, Imgix) can generate art-directed crops from the original image using focal point detection, reducing the manual effort.
        </p>
        <p>
          Cross-device testing automation addresses the impossibility of manually testing every device, browser, and OS combination that users may access the application. The testing strategy is layered: DevTools responsive mode provides rapid iteration during development, allowing engineers to test at any viewport size, simulate device pixel ratios, and throttle network conditions. BrowserStack and Sauce Labs provide cloud-based access to real devices and browsers, enabling testing on specific device models (iPhone 14, Samsung Galaxy S23, iPad Pro) and browser versions (Safari 16, Chrome 110, Firefox 108) that the engineering team does not physically own. Visual regression testing tools (Percy, Chromatic, Playwright screenshots) capture screenshots of the application at all breakpoints and compare them against baseline screenshots, detecting visual regressions (layout breaks, overlapping elements, missing content) that functional tests miss. The automated testing pipeline runs visual regression tests on every pull request, flagging any differences for review. Physical device testing is still necessary for final validation — at minimum, one iOS device and one Android device should be used to verify touch interactions, scroll behavior, virtual keyboard handling, and platform-specific rendering quirks that emulators cannot replicate. The testing matrix should be informed by analytics — test the devices and browsers that account for the top 80% of user traffic, and periodically review the analytics to update the testing matrix as user device patterns evolve.
        </p>
        <p>
          Responsive design tokens provide a systematic approach to managing responsive values (spacing, typography, colors, breakpoints) across the entire application through a centralized design token system. Design tokens are named values that represent design decisions — instead of hardcoding spacing values (padding: 16px, margin: 24px), the application uses token references (padding: var(--spacing-md), margin: var(--spacing-lg)). For responsive design, tokens can be viewport-dependent — the --spacing-lg token might resolve to 16px on mobile, 24px on tablet, and 32px on desktop, using CSS custom properties that are updated at each breakpoint. This approach ensures consistency across all components — every component that uses --spacing-lg gets the same responsive spacing value, and changing the token updates all components simultaneously. The token system is typically defined in a configuration file (JSON, YAML, or JavaScript) and compiled into CSS custom properties, Tailwind CSS configuration, or design tool libraries (Figma tokens, Style Dictionary). Responsive design tokens also apply to typography (--font-size-base, --font-size-lg, --font-size-xl), color palettes (--color-primary, --color-secondary), and elevation/shadow values (--shadow-sm, --shadow-md, --shadow-lg). The benefit is that responsive design decisions are made at the token level, not scattered across individual component styles, making the design system easier to maintain, audit, and evolve. When the design team decides to increase spacing across the application, they update the spacing tokens in one place, and all components reflect the change.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is mobile-first design and why use it?
            </p>
            <p className="mt-2 text-sm">
              A: Mobile-first means designing for the smallest screen first,
              then progressively enhancing for larger screens using min-width
              media queries. Benefits include better performance (start with
              minimal CSS), forced content prioritization (essential features
              first), alignment with Google&apos;s mobile-first indexing, and
              cost efficiency (easier to add complexity than remove it). Write
              base styles for mobile without media queries, add enhancements
              with min-width queries for each breakpoint.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you choose breakpoints?</p>
            <p className="mt-2 text-sm">
              A: Use content-driven breakpoints, not device-specific ones. Let
              the content dictate when the layout needs to change — add a
              breakpoint when the content becomes unreadable or the layout breaks.
              Keep the count minimal, typically 3-5 breakpoints. Common values
              cluster around 768px (tablets), 1024px (laptops), and 1280px+
              (desktops). Name breakpoints semantically (sm, md, lg, xl) rather
              than by device because device dimensions change with each product
              cycle. Test at breakpoint boundaries to ensure smooth transitions.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are touch target size guidelines?
            </p>
            <p className="mt-2 text-sm">
              A: Minimum 44×44px per Apple&apos;s Human Interface Guidelines or
              48×48px per Material Design. Maintain at least 8px spacing between
              touch targets to prevent accidental taps. Make primary actions
              larger than secondary actions. Place frequent actions in the thumb
              zone (bottom-right for right-handed users). Do not hide critical
              information behind hover states since touch devices have no hover.
              Test with actual touch devices to verify target sizes and spacing.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle responsive images?
            </p>
            <p className="mt-2 text-sm">
              A: Use srcset with width descriptors (400w, 800w, 1200w) for
              resolution switching based on device pixel ratio and viewport
              width. Use the sizes attribute to tell the browser how large the
              image will display at different viewports. Use the picture element
              for art direction (different crops for different sizes) and format
              switching (AVIF/WebP with JPEG fallback). Always specify width and
              height to prevent CLS. Lazy-load below-the-fold images.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is your cross-device testing strategy?
            </p>
            <p className="mt-2 text-sm">
              A: Use DevTools for quick iteration during development. Test on
              real devices for final validation — at minimum one iOS device and
              one Android device. Use BrowserStack for comprehensive browser and
              device coverage. Test at all breakpoints, both orientations, with
              the virtual keyboard open, and on throttled 3G networks. Include
              accessibility testing on mobile (VoiceOver on iOS, TalkBack on
              Android). Test iOS Safari specifically because it often renders
              differently from Chrome and has unique viewport quirks.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://web.dev/learn/design/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — Responsive Web Design Fundamentals
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Media_Queries"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — CSS Media Queries
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — CSS Container Queries
            </a>
          </li>
          <li>
            <a
              href="https://material.io/design/platform-guidance/android-touch.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Material Design — Touch Targets
            </a>
          </li>
          <li>
            <a
              href="https://developer.apple.com/design/human-interface-guidelines/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple Human Interface Guidelines — Touch
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
