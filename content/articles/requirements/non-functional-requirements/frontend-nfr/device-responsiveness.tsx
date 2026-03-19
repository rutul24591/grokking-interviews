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
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-15",
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
        <h2>Definition & Context</h2>
        <p>
          <strong>Device Responsiveness</strong> ensures web applications adapt
          seamlessly to different screen sizes, orientations, input methods, and
          device capabilities. This includes phones, tablets, laptops, desktops,
          and emerging form factors like foldables and large-screen phones.
        </p>
        <p>
          For staff engineers, responsiveness is both a technical and business
          requirement. Mobile traffic exceeds desktop for most sites. Google
          uses mobile-first indexing. Poor mobile experience directly impacts
          conversion rates and search rankings.
        </p>
        <p>
          <strong>Responsive design considerations:</strong>
        </p>
        <ul>
          <li>
            <strong>Screen sizes:</strong> 320px (small phones) to 2560px+
            (large desktops)
          </li>
          <li>
            <strong>Input methods:</strong> Touch, mouse, keyboard, stylus,
            voice
          </li>
          <li>
            <strong>Pixel density:</strong> 1x to 4x+ (Retina, high-DPI)
          </li>
          <li>
            <strong>Device capabilities:</strong> Touch support, hover support,
            camera, GPS
          </li>
          <li>
            <strong>Network conditions:</strong> WiFi, 4G, 3G, offline
          </li>
        </ul>
      </section>

      <section>
        <h2>Mobile-First Approach</h2>
        <p>
          Design and develop for mobile first, then enhance for larger screens.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Why Mobile-First</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Start with minimal CSS/JS, add
            features progressively
          </li>
          <li>
            <strong>Focus:</strong> Prioritize essential content and features
          </li>
          <li>
            <strong>Google indexing:</strong> Mobile-first indexing is standard
          </li>
          <li>
            <strong>Cost efficiency:</strong> Easier to add than remove
          </li>
          <li>
            <strong>Future-proof:</strong> New devices tend toward smaller form
            factors
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Implementation</h3>
        <ul className="space-y-2">
          <li>Write base styles for mobile (no media query)</li>
          <li>Use min-width media queries for larger screens</li>
          <li>Progressive enhancement (add features, don&apos;t remove)</li>
          <li>Test on actual mobile devices, not just DevTools</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CSS Architecture</h3>
        <pre className="my-4 overflow-x-auto rounded-lg bg-panel-soft p-4 text-sm">
          <code>{`/* Base styles (mobile) */
.container { padding: 1rem; }

/* Tablet and up */
@media (min-width: 768px) {
  .container { padding: 2rem; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container { padding: 3rem; max-width: 1200px; }
}`}</code>
        </pre>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/mobile-first-approach.svg"
          alt="Mobile-First Approach"
          caption="Mobile-first responsive design — starting with mobile base styles and progressively enhancing for larger screens"
        />
      </section>

      <section>
        <h2>Breakpoint Strategy</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Common Breakpoints</h3>
        <ul className="space-y-2">
          <li>
            <strong>320px:</strong> Small phones (iPhone SE, small Android)
          </li>
          <li>
            <strong>375-414px:</strong> Standard phones (iPhone, Pixel)
          </li>
          <li>
            <strong>768px:</strong> Tablets (iPad portrait)
          </li>
          <li>
            <strong>1024px:</strong> Tablets (iPad landscape), small laptops
          </li>
          <li>
            <strong>1280px:</strong> Standard laptops
          </li>
          <li>
            <strong>1440px+:</strong> Large desktops
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Breakpoint Best Practices
        </h3>
        <ul className="space-y-2">
          <li>Use content-driven breakpoints, not device-specific</li>
          <li>Keep breakpoint count minimal (3-5 typically)</li>
          <li>Name breakpoints semantically (sm, md, lg, xl)</li>
          <li>Document breakpoint decisions</li>
          <li>Test at breakpoint boundaries</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Fluid Layouts</h3>
        <ul className="space-y-2">
          <li>Use relative units (%, rem, em, vw, vh)</li>
          <li>Avoid fixed widths where possible</li>
          <li>Use CSS Grid and Flexbox for flexible layouts</li>
          <li>Implement fluid typography (clamp(), vw units)</li>
          <li>Use max-width for images and containers</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Container Queries</h3>
        <ul className="space-y-2">
          <li>New CSS feature: style based on container size, not viewport</li>
          <li>More granular than media queries</li>
          <li>Components adapt to their container</li>
          <li>Browser support: 90%+ (2024+)</li>
          <li>
            Use @container instead of @media for component-level responsiveness
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/breakpoint-strategy.svg"
          alt="Breakpoint Strategy"
          caption="Responsive breakpoints — content-driven breakpoints with fluid layouts between breakpoints"
        />
      </section>

      <section>
        <h2>Touch vs Mouse Interactions</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Touch Target Sizes</h3>
        <ul className="space-y-2">
          <li>
            <strong>Minimum:</strong> 44×44px (Apple HIG), 48×48px (Material
            Design)
          </li>
          <li>
            <strong>Spacing:</strong> 8px minimum between touch targets
          </li>
          <li>
            <strong>Important actions:</strong> Larger targets for primary
            actions
          </li>
          <li>
            <strong>Thumb zone:</strong> Place frequent actions in easy thumb
            reach
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Hover States</h3>
        <ul className="space-y-2">
          <li>Touch devices don&apos;t have hover</li>
          <li>Don&apos;t hide critical info behind hover</li>
          <li>Use :hover AND :focus for keyboard accessibility</li>
          <li>Consider touch-friendly alternatives (tap to reveal)</li>
          <li>Test with actual touch devices</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Touch Gestures</h3>
        <ul className="space-y-2">
          <li>
            <strong>Swipe:</strong> Navigation, delete actions, carousels
          </li>
          <li>
            <strong>Pinch:</strong> Zoom (images, maps)
          </li>
          <li>
            <strong>Long press:</strong> Context menus, selection
          </li>
          <li>
            <strong>Pull to refresh:</strong> Content refresh pattern
          </li>
          <li>Provide visual feedback for gestures</li>
          <li>Don&apos;t override native gestures without clear alternative</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Input Considerations
        </h3>
        <ul className="space-y-2">
          <li>Use appropriate input types (tel, email, number)</li>
          <li>Show correct keyboard for input type</li>
          <li>Autocomplete attributes for form fields</li>
          <li>Avoid zoom on input focus (iOS)</li>
          <li>Consider virtual keyboard impact on layout</li>
        </ul>
      </section>

      <section>
        <h2>Responsive Images and Media</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Responsive Images</h3>
        <ul className="space-y-2">
          <li>Use srcset for resolution switching</li>
          <li>Use sizes for art direction</li>
          <li>Lazy load below-fold images</li>
          <li>Specify width and height to prevent CLS</li>
          <li>Use modern formats (WebP, AVIF) with fallbacks</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Video Responsiveness
        </h3>
        <ul className="space-y-2">
          <li>Use fluid containers (max-width: 100%)</li>
          <li>Aspect ratio preservation</li>
          <li>Consider mobile data usage</li>
          <li>Provide captions for silent viewing</li>
          <li>Lazy load video content</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Performance Considerations
        </h3>
        <ul className="space-y-2">
          <li>Serve smaller images to mobile</li>
          <li>Consider network conditions</li>
          <li>Use CDN with device detection</li>
          <li>Implement progressive image loading</li>
          <li>Test on slow networks (3G throttling)</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/responsive-images.svg"
          alt="Responsive Images"
          caption="Responsive image delivery — srcset for resolution switching, sizes for art direction, and lazy loading"
        />
      </section>

      <section>
        <h2>Cross-Device Testing</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Testing Methods</h3>
        <ul className="space-y-2">
          <li>
            <strong>DevTools:</strong> Quick testing, device simulation
          </li>
          <li>
            <strong>Real devices:</strong> Most accurate, essential for final
            testing
          </li>
          <li>
            <strong>BrowserStack/Sauce Labs:</strong> Wide device coverage
          </li>
          <li>
            <strong>Responsive design mode:</strong> Test breakpoint transitions
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Testing Checklist</h3>
        <ul className="space-y-2">
          <li>Test at all breakpoints</li>
          <li>Test both orientations (portrait/landscape)</li>
          <li>Test touch interactions on real devices</li>
          <li>Test with virtual keyboard open</li>
          <li>Test on slow networks</li>
          <li>Test accessibility on mobile (screen readers, keyboard)</li>
          <li>Test on iOS Safari (often different from Chrome)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Common Issues</h3>
        <ul className="space-y-2">
          <li>iOS Safari viewport issues (100vh problem)</li>
          <li>Android address bar overlap</li>
          <li>Touch delay on older browsers</li>
          <li>Fixed position elements with virtual keyboard</li>
          <li>Horizontal scroll from overflow</li>
          <li>Text too small on mobile (minimum 16px for inputs)</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is mobile-first design and why use it?
            </p>
            <p className="mt-2 text-sm">
              A: Mobile-first means designing for mobile screens first, then
              enhancing for larger screens with media queries. Benefits: better
              performance (start minimal), forces prioritization of essential
              content, aligns with Google&apos;s mobile-first indexing, easier
              to add than remove. Write base styles for mobile, use min-width
              media queries for larger screens.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you choose breakpoints?</p>
            <p className="mt-2 text-sm">
              A: Use content-driven breakpoints, not device-specific. Let
              content dictate when layout needs to change. Common breakpoints:
              320px (small phones), 768px (tablets), 1024px (laptops), 1280px+
              (desktops). Keep breakpoint count minimal (3-5). Name semantically
              (sm, md, lg, xl). Test at breakpoint boundaries.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are touch target size guidelines?
            </p>
            <p className="mt-2 text-sm">
              A: Minimum 44×44px (Apple) or 48×48px (Material Design). 8px
              spacing between targets. Larger for important actions. Place
              frequent actions in thumb zone. Don&apos;t hide critical info
              behind hover (no hover on touch). Test with actual touch devices.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle responsive images?
            </p>
            <p className="mt-2 text-sm">
              A: Use srcset for resolution switching (different sizes for
              different screens). Use sizes attribute to tell browser which size
              to use. Lazy load below-fold images. Specify width/height to
              prevent CLS. Use modern formats (WebP, AVIF) with fallbacks. Serve
              smaller images to mobile devices.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What&apos;s your cross-device testing strategy?
            </p>
            <p className="mt-2 text-sm">
              A: DevTools for quick iteration, real devices for final testing.
              Test at all breakpoints, both orientations, touch interactions,
              virtual keyboard impact, slow networks. Test iOS Safari
              specifically (often different from Chrome). Use BrowserStack for
              wide device coverage. Checklist: layout, interactions,
              performance, accessibility on each device class.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://web.dev/responsive-web-design-basics/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — Responsive Web Design Basics
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
        </ul>
      </section>
    </ArticleLayout>
  );
}
