"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-responsive-design",
  title: "Responsive Design",
  description:
    "Comprehensive guide to Responsive Design covering fluid layouts, media queries, flexible images, responsive typography, and production-scale responsive patterns.",
  category: "frontend",
  subcategory: "mobile-considerations",
  slug: "responsive-design",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-02",
  tags: [
    "frontend",
    "responsive design",
    "media queries",
    "fluid layouts",
    "mobile",
    "CSS",
  ],
  relatedTopics: [
    "mobile-first-design",
    "viewport-configuration",
    "mobile-performance-optimization",
  ],
};

export default function ResponsiveDesignArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Responsive Design</strong> is an approach to web design that
          makes web pages render well on a variety of devices and window or
          screen sizes. Coined by Ethan Marcotte in 2010, responsive design
          combines three technical components: fluid grids (layouts based on
          percentages rather than fixed pixels), flexible images (images that
          scale within their containers), and media queries (CSS rules that
          apply based on device characteristics). The goal is to provide an
          optimal viewing experience — easy reading and navigation with minimum
          resizing, panning, and scrolling — across devices from mobile phones
          to large desktop monitors.
        </p>
        <p>
          For staff-level engineers, responsive design is not just about CSS —
          it&apos;s about architectural decisions that affect performance,
          maintainability, and user experience. The choice between responsive
          (same HTML, different CSS) vs. adaptive (different HTML for different
          devices) vs. RESS (Responsive Design + Server Side Components) has
          implications for caching, SEO, and development workflow. Responsive
          design requires thinking about content prioritization, touch targets,
          performance budgets, and progressive enhancement from the start.
        </p>
        <p>
          Responsive design involves several technical challenges.{" "}
          <strong>Breakpoint strategy</strong> — where to set media query
          breakpoints (device-based vs. content-based).{" "}
          <strong>Image optimization</strong> — serving appropriately sized
          images for different viewports. <strong>Performance</strong> —
          avoiding loading desktop-sized assets for mobile users.{" "}
          <strong>Testing</strong> — ensuring design works across the
          fragmented device landscape (different screen sizes, pixel densities,
          browser capabilities).
        </p>
        <p>
          The business case for responsive design is clear: mobile traffic
          exceeds desktop traffic for most websites. Google uses mobile-first
          indexing — the mobile version of your site is the primary version for
          search ranking. Responsive design is more maintainable than separate
          mobile sites (one codebase, one URL structure). For e-commerce,
          responsive design directly impacts conversion — users abandon sites
          that don&apos;t work well on their device.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Fluid Grids:</strong> Layout based on relative units
            (percentages, fr, em, rem) rather than fixed pixels. A three-column
            layout becomes <code>width: 33.33%</code> per column, not{" "}
            <code>width: 400px</code>. Fluid grids enable layouts to scale
            smoothly across viewport sizes.
          </li>
          <li>
            <strong>Media Queries:</strong> CSS rules that apply conditionally
            based on device characteristics. Most common:{" "}
            <code>min-width</code> and <code>max-width</code> for viewport
            breakpoints. Also: <code>prefers-reduced-motion</code>,{" "}
            <code>prefers-color-scheme</code>, <code>orientation</code>,{" "}
            <code>resolution</code>. Media queries enable different styles for
            different contexts.
          </li>
          <li>
            <strong>Flexible Images:</strong> Images that scale within their
            containers. Basic: <code>img {'{'} max-width: 100%; height: auto; {'}'}</code>.
            Advanced: <code>srcset</code> and <code>sizes</code> attributes for
            serving different image files based on viewport and pixel density.
          </li>
          <li>
            <strong>Breakpoints:</strong> Viewport widths where layout changes.
            Common breakpoints: 320px (small mobile), 768px (tablet), 1024px
            (desktop), 1440px (large desktop). Modern approach: content-based
            breakpoints (where content breaks) rather than device-based
            breakpoints.
          </li>
          <li>
            <strong>Mobile-First:</strong> Write base styles for mobile, then
            use <code>min-width</code> media queries to enhance for larger
            screens. This ensures mobile users get optimized CSS (no unused
            desktop styles) and forces content prioritization.
          </li>
          <li>
            <strong>Responsive Typography:</strong> Font sizes that scale with
            viewport. Techniques: <code>clamp()</code> function (min, preferred,
            max), <code>vw</code> units, media query-based size changes.
            Readable typography is critical for responsive design.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/responsive-design-breakpoints.svg"
          alt="Responsive Design Breakpoints showing how layout adapts across mobile, tablet, and desktop viewports"
          caption="Responsive breakpoints — same HTML structure adapts via CSS: single column on mobile, two columns on tablet, three columns on desktop"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Responsive design architecture consists of a fluid grid system, a
          breakpoint strategy, responsive images, and responsive typography. The
          architecture must handle the full range of viewport sizes (from 320px
          to 2560px+), different pixel densities (1x to 3x+), and different
          input methods (touch, mouse, keyboard).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/fluid-grid-system.svg"
          alt="Fluid Grid System showing percentage-based columns that adapt to viewport width"
          caption="Fluid grid — columns defined as percentages (not pixels) automatically resize with viewport; gutters maintain consistent spacing"
          width={900}
          height={500}
        />

        <h3>Breakpoint Strategy</h3>
        <p>
          Two approaches exist for breakpoints. <strong>Device-based
          breakpoints</strong> target specific devices (iPhone, iPad, desktop).
          Problem: new devices constantly released, maintenance burden.{" "}
          <strong>Content-based breakpoints</strong> set breakpoints where
          content layout breaks (text too long, images too small, whitespace
          excessive). Advantage: future-proof, design-driven. Modern best
          practice: content-based breakpoints with device breakpoints as
          refinement.
        </p>
        <p>
          Implementation: start with mobile base styles (no media query). Add{" "}
          <code>@media (min-width: 600px)</code> where content needs more space.
          Add <code>@media (min-width: 900px)</code> where three-column layout
          makes sense. Continue adding breakpoints as content requires. This
          produces efficient CSS — only the breakpoints your design needs.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/responsive-images-strategy.svg"
          alt="Responsive Images Strategy showing srcset and sizes attributes for different viewport image loading"
          caption="Responsive images — srcset provides multiple image files, sizes tells browser which to load based on viewport; browser selects optimal image"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Responsive design involves trade-offs between performance,
          maintainability, and user experience.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/responsive-vs-adaptive.svg"
          alt="Responsive vs Adaptive design comparison showing same HTML/different CSS vs different HTML for different devices"
          caption="Responsive vs Adaptive — responsive uses same HTML with CSS adapting (maintainable), adaptive uses different HTML per device (optimized but complex)"
          width={900}
          height={550}
        />

        <h3>Responsive vs. Adaptive vs. RESS</h3>
        <p>
          <strong>Responsive (same HTML, different CSS):</strong> Single URL,
          single HTML document, CSS adapts layout. Advantages: maintainable
          (one codebase), SEO-friendly (one URL), shareable links. Limitations:
          mobile downloads desktop HTML (performance), one-size-fits-all
          content. Best for: most websites, content sites, e-commerce.
        </p>
        <p>
          <strong>Adaptive (different HTML per device):</strong> Server detects
          device, serves different HTML. Advantages: optimized HTML per device,
          can serve mobile-specific content. Limitations: multiple codebases,
          SEO complexity (multiple URLs), maintenance burden. Best for: legacy
          mobile sites, highly different mobile vs. desktop experiences.
        </p>
        <p>
          <strong>RESS (Responsive + Server Side):</strong> Responsive design
          with server-side component optimization. Server serves responsive CSS
          but optimizes images, critical CSS, and JavaScript per device.
          Advantages: best of both (maintainable + performant). Limitations:
          server complexity, requires smart server logic. Best for:
          performance-critical sites, large e-commerce.
        </p>

        <h3>CSS Architecture Approaches</h3>
        <p>
          <strong>Single Stylesheet:</strong> All CSS in one file with media
          queries. Advantages: simple, easy to understand. Limitations: large
          file, mobile downloads desktop CSS. Best for: small sites.
        </p>
        <p>
          <strong>CSS Split by Breakpoint:</strong> Separate CSS files per
          breakpoint range. Advantages: mobile only loads mobile CSS.
          Limitations: multiple HTTP requests, complex build. Best for:
          performance-critical sites.
        </p>
        <p>
          <strong>CSS-in-JS with Responsive Props:</strong> Responsive logic in
          JavaScript (styled-components, Emotion). Advantages: dynamic,
          component-scoped. Limitations: JavaScript required, runtime overhead.
          Best for: React/JavaScript-heavy applications.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Mobile-First CSS:</strong> Write base styles for mobile, use{" "}
            <code>min-width</code> media queries for larger screens. This
            ensures mobile users get optimized CSS (no unused desktop styles).
            Forces content prioritization — what&apos;s essential for mobile?
          </li>
          <li>
            <strong>Use Relative Units:</strong> Use <code>em</code>,{" "}
            <code>rem</code>, <code>%</code>, <code>vw</code>, <code>fr</code>{" "}
            instead of <code>px</code> for layout. Relative units scale
            naturally with viewport and user preferences (browser zoom, font
            size settings).
          </li>
          <li>
            <strong>Responsive Images with srcset:</strong> Use{" "}
            <code>srcset</code> and <code>sizes</code> attributes to serve
            appropriately sized images. A 2000px image wastes bandwidth on
            mobile. Example:{" "}
            <code>&lt;img srcset=&quot;small.jpg 400w, medium.jpg 800w, large.jpg 1600w&quot; sizes=&quot;(max-width: 600px) 400px, 800px&quot;&gt;</code>.
          </li>
          <li>
            <strong>Touch-Friendly Targets:</strong> Minimum touch target size
            of 44×44 pixels (Apple HIG recommendation). Adequate spacing
            between interactive elements. Touch targets visible without hover
            (no hover-only states for mobile).
          </li>
          <li>
            <strong>Test on Real Devices:</strong> Browser dev tools simulate
            viewports but don&apos;t replicate real device behavior (touch,
            performance, network). Test on actual mobile devices. Use device
            labs or services like BrowserStack for broad coverage.
          </li>
          <li>
            <strong>Performance Budget:</strong> Set performance budgets per
            breakpoint. Mobile should load faster than desktop. Techniques:
            conditional loading (don&apos;t load desktop-only JavaScript for
            mobile), image optimization, critical CSS.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Desktop-First CSS:</strong> Writing desktop styles as base,
            then using <code>max-width</code> media queries to scale down.
            Problem: mobile downloads all desktop CSS, then overrides it.
            Solution: mobile-first with <code>min-width</code> queries.
          </li>
          <li>
            <strong>Fixed-Width Elements:</strong> Using <code>px</code> for
            layout widths. Breaks on viewports smaller than fixed width.
            Solution: use percentages, <code>fr</code> units, or{" "}
            <code>clamp()</code>.
          </li>
          <li>
            <strong>Non-Responsive Images:</strong> Serving same image file to
            all devices. A 2MB desktop image wastes mobile bandwidth. Solution:{" "}
            <code>srcset</code>, responsive image CDN, or{" "}
            <code>&lt;picture&gt;</code> element.
          </li>
          <li>
            <strong>Too Many Breakpoints:</strong> Setting breakpoints for every
            device (iPhone SE, iPhone 14, iPad, iPad Pro, etc.). Maintenance
            nightmare. Solution: content-based breakpoints, test at key widths
            (320px, 768px, 1024px, 1440px).
          </li>
          <li>
            <strong>Ignoring Touch:</strong> Designing for mouse, not touch.
            Hover states don&apos;t work on touch. Small click targets are hard
            to tap. Solution: design for touch first, ensure 44×44px minimum
            targets, no hover-only interactions.
          </li>
          <li>
            <strong>Testing Only in DevTools:</strong> Browser responsive mode
            doesn&apos;t replicate real device performance, touch behavior, or
            network conditions. Solution: test on real devices, use throttling
            to simulate mobile networks.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Product Pages</h3>
        <p>
          E-commerce sites (Amazon, Shopify stores) use responsive design for
          product pages. Mobile: single column, large product images, sticky
          &quot;Add to Cart&quot; button. Tablet: two columns (image + details).
          Desktop: three columns (images, details, related products). Images use
          srcset for optimal sizing. Touch targets large enough for mobile
          shopping.
        </p>

        <h3>News and Media Sites</h3>
        <p>
          News sites (NYTimes, Guardian) prioritize readability across devices.
          Mobile: single column, large readable text (16px+), simplified
          navigation. Desktop: multi-column with sidebar, related articles,
          ads. Typography scales with viewport using clamp(). Images use lazy
          loading and responsive srcset.
        </p>

        <h3>Dashboard Applications</h3>
        <p>
          Dashboards (analytics, admin panels) face responsive challenges with
          complex data tables and charts. Mobile: stack cards vertically,
          simplify charts, hide less-critical data. Desktop: multi-column grid,
          full data tables, complex visualizations. Techniques: CSS Grid for
          layout, responsive charts (Chart.js, D3 responsive scales),
          progressive disclosure (show more on desktop).
        </p>

        <h3>SaaS Web Applications</h3>
        <p>
          SaaS apps (GitHub, Notion) use responsive design for accessibility
          across devices. Mobile: simplified navigation (hamburger menu),
          touch-friendly interactions, essential features only. Desktop: full
          feature set, keyboard shortcuts, multi-panel layouts. Approach:
          mobile-first CSS, component-level responsiveness, feature detection
          for advanced interactions.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What&apos;s the difference between mobile-first and
              desktop-first responsive design?
            </p>
            <p className="mt-2 text-sm">
              A: Mobile-first: base styles for mobile, <code>min-width</code>{" "}
              media queries to enhance for larger screens. Desktop-first: base
              styles for desktop, <code>max-width</code> queries to scale down.
              Mobile-first advantages: mobile users get optimized CSS (no unused
              desktop styles), forces content prioritization, better
              performance. Desktop-first disadvantages: mobile downloads all
              desktop CSS. Industry standard is mobile-first. Mobile-first also
              aligns with progressive enhancement philosophy — start with basic
              experience, enhance for capable devices/browsers.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you choose breakpoints for responsive design?
            </p>
            <p className="mt-2 text-sm">
              A: Two approaches: (1) Device-based: 320px (iPhone SE), 768px
              (iPad), 1024px (desktop). Problem: new devices constantly
              released. (2) Content-based: add breakpoint where content layout
              breaks (text line too long, images too small, excessive
              whitespace). Best practice: content-based breakpoints as primary,
              test at common device widths (320px, 768px, 1024px, 1440px) to
              catch issues. Start with mobile, add <code>min-width</code>{" "}
              breakpoints as content requires. Content-based breakpoints are
              future-proof — they work regardless of new device releases.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement responsive images?
            </p>
            <p className="mt-2 text-sm">
              A: Three techniques: (1) CSS: <code>img {'{'} max-width: 100%; height: auto; {'}'}</code>{" "}
              for fluid scaling. (2) srcset/sizes:{" "}
              <code>&lt;img srcset=&quot;small.jpg 400w, large.jpg 800w&quot; sizes=&quot;(max-width: 600px) 400px, 800px&quot;&gt;</code>{" "}
              — browser selects optimal image. (3) Picture element:{" "}
              <code>&lt;picture&gt;&lt;source media=&quot;(min-width: 800px)&quot; srcset=&quot;large.jpg&quot;&gt;&lt;img src=&quot;small.jpg&quot;&gt;&lt;/picture&gt;</code>{" "}
              — art direction (different crops for different viewports). Best
              for most cases: srcset + sizes for automatic optimization.
              Modern browsers handle srcset well — always provide multiple
              sizes to serve appropriately sized images per device.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle responsive typography?
            </p>
            <p className="mt-2 text-sm">
              A: Techniques: (1) clamp():{" "}
              <code>font-size: clamp(16px, 2vw, 24px)</code> — min 16px,
              preferred 2vw, max 24px. Smooth scaling. (2) Media queries:{" "}
              <code>@media (min-width: 768px) {'{'} body {'{'} font-size: 18px; {'}'} {'}'}</code>{" "}
              — step changes at breakpoints. (3) vw units:{" "}
              <code>font-size: 2vw</code> — scales with viewport (use with min/max
              clamp). Best: clamp() for smooth scaling, media queries for
              precise control at breakpoints. Also: relative units (rem) for
              accessibility (respects user font size settings). Clamp() is
              modern CSS — no JavaScript needed, smooth scaling between min/max.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you test responsive designs effectively?
            </p>
            <p className="mt-2 text-sm">
              A: Multi-layered approach: (1) Browser DevTools: quick testing at
              common viewport widths. (2) Real devices: test on actual
              phones/tablets — touch behavior, performance, network conditions
              differ from simulation. (3) Responsive design testing services:
              BrowserStack, Sauce Labs for broad device coverage. (4) Key
              widths to test: 320px (small mobile), 375px (iPhone), 768px
              (tablet), 1024px (desktop), 1440px (large desktop). (5) Test
              interactions: touch targets, hover states (don&apos;t exist on
              touch), keyboard navigation. DevTools are good for initial
              testing, but always verify on real devices before launch.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle responsive performance optimization?
            </p>
            <p className="mt-2 text-sm">
              A: Strategies: (1) Conditional loading: don&apos;t load
              desktop-only JavaScript for mobile. (2) Responsive images: srcset
              serves appropriately sized images. (3) Critical CSS: inline
              critical CSS, defer non-critical. (4) Performance budgets: mobile
              should have smaller bundle than desktop. (5) Network-aware
              loading: use Network Information API to detect slow connections,
              serve lighter experience. (6) Lazy loading: defer off-screen
              content. Measure: Lighthouse mobile score, real device
              performance testing. Mobile performance directly impacts
              conversion — every 100ms matters for user experience.
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
              href="https://alistapart.com/article/responsive-web-design/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Ethan Marcotte — Responsive Web Design (Original Article)
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — Responsive Design Guide
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/responsive-images/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Web.dev — Responsive Images
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/2021/08/complete-guide-responsive-web-design/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Smashing Magazine — Complete Guide to Responsive Web Design
            </a>
          </li>
          <li>
            <a
              href="https://css-tricks.com/a-complete-guide-to-css-media-queries/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              CSS-Tricks — Complete Guide to CSS Media Queries
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG21/Understanding/reflow.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              WCAG 2.1 — Reflow (Accessibility for Responsive Design)
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
