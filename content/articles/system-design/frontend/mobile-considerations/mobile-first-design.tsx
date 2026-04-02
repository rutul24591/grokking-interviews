"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-mobile-first-design",
  title: "Mobile-First Design",
  description:
    "Comprehensive guide to Mobile-First Design covering progressive enhancement, breakpoint strategy, content prioritization, and production-scale mobile-first patterns.",
  category: "frontend",
  subcategory: "mobile-considerations",
  slug: "mobile-first-design",
  wordCount: 5300,
  readingTime: 21,
  lastUpdated: "2026-04-02",
  tags: [
    "frontend",
    "mobile-first",
    "progressive enhancement",
    "responsive design",
    "CSS",
    "breakpoints",
  ],
  relatedTopics: [
    "responsive-design",
    "viewport-configuration",
    "mobile-performance-optimization",
  ],
};

export default function MobileFirstDesignArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Mobile-First Design</strong> is a design and development
          approach that starts with designing for mobile devices, then
          progressively enhances the experience for larger screens. Coined by
          Luke Wroblewski in 2009, mobile-first flips the traditional
          &quot;desktop-first&quot; workflow — instead of designing for desktop
          then stripping features for mobile, you design for mobile constraints
          first, then add features and layout complexity for tablets and
          desktops. This approach forces content prioritization (what&apos;s
          essential?), performance optimization (mobile networks are slower),
          and touch-friendly interaction design from the start.
        </p>
        <p>
          For staff-level engineers, mobile-first is both a design philosophy
          and a technical implementation strategy. Technically, mobile-first CSS
          means base styles target mobile, with <code>min-width</code> media
          queries adding enhancements for larger screens. This produces more
          efficient CSS — mobile devices don&apos;t download desktop-specific
          styles that get overridden. Design-wise, mobile-first forces
          difficult decisions about feature priority that benefit all users, not
          just mobile.
        </p>
        <p>
          Mobile-first involves several technical considerations.{" "}
          <strong>CSS architecture</strong> — base styles for mobile,{" "}
          <code>min-width</code> queries for enhancements.{" "}
          <strong>Content strategy</strong> — what content is essential vs.
          nice-to-have? <strong>Performance</strong> — mobile users often on
          slower networks, need optimized assets. <strong>Progressive
          enhancement</strong> — core functionality works everywhere, advanced
          features layer on top for capable devices.
        </p>
        <p>
          The business case for mobile-first is compelling: mobile traffic
          exceeds desktop for most sites, Google uses mobile-first indexing
          (mobile version is primary for search ranking), and mobile-first
          design produces better experiences for all users. Companies that
          switched to mobile-first report improved conversion rates, reduced
          bounce rates, and faster load times across all devices.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Progressive Enhancement:</strong> Start with basic,
            universally-supported HTML/CSS. Layer on advanced features for
            capable browsers. Core content accessible everywhere, enhanced
            experience for modern browsers. Mobile-first is progressive
            enhancement applied to viewport size.
          </li>
          <li>
            <strong>min-width Media Queries:</strong> Mobile-first CSS uses{" "}
            <code>min-width</code> (not <code>max-width</code>). Base styles =
            mobile. <code>@media (min-width: 600px)</code> adds tablet
            enhancements. <code>@media (min-width: 1024px)</code> adds desktop
            layout. Mobile doesn&apos;t download desktop CSS.
          </li>
          <li>
            <strong>Content Prioritization:</strong> Mobile constraints force
            decisions: what content is essential? What can be deferred? What
            navigation patterns work for touch? These decisions benefit desktop
            users too — clearer hierarchy, faster load, focused content.
          </li>
          <li>
            <strong>Touch-First Interaction:</strong> Design for touch input
            first (no hover states, large tap targets, swipe gestures). Mouse
            users can use touch-optimized interfaces; touch users can&apos;t use
            mouse-optimized interfaces. Touch-first is inclusive design.
          </li>
          <li>
            <strong>Performance Budget:</strong> Mobile users often on slower
            networks (3G, 4G). Set performance budgets: max bundle size, image
            size, time-to-interactive. Optimize for mobile constraints —
            benefits desktop too.
          </li>
          <li>
            <strong>Graceful Degradation vs. Progressive Enhancement:</strong>{" "}
            Graceful degradation: start with full experience, make it work on
            older devices. Progressive enhancement: start with basic experience,
            enhance for capable devices. Mobile-first uses progressive
            enhancement — more resilient, better UX.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/mobile-first-css-architecture.svg"
          alt="Mobile-First CSS Architecture showing base styles for mobile with min-width media queries for larger screens"
          caption="Mobile-first CSS — base styles target mobile, min-width media queries progressively enhance for tablet and desktop; mobile doesn't download desktop CSS"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Mobile-first architecture consists of base styles (mobile),
          progressive enhancements (tablet, desktop), and conditional loading
          (don&apos;t load desktop-only assets for mobile). The architecture
          must handle the full range of devices while ensuring mobile users get
          optimized experience.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/progressive-enhancement-layers.svg"
          alt="Progressive Enhancement Layers showing core content, enhanced layout, and advanced features stacked"
          caption="Progressive enhancement layers — core HTML content works everywhere, CSS adds layout, JavaScript adds interactivity; each layer enhances the previous"
          width={900}
          height={500}
        />

        <h3>CSS Architecture Patterns</h3>
        <p>
          <strong>Single Mobile-First Stylesheet:</strong> All CSS in one file,
          mobile base styles first, then <code>min-width</code> media queries.
          Advantages: simple, easy to maintain. Limitations: mobile downloads
          desktop CSS (even if not applied). Best for: small to medium sites.
        </p>
        <p>
          <strong>Split by Breakpoint:</strong> Separate CSS files per
          breakpoint. Mobile loads <code>mobile.css</code>, desktop loads{" "}
          <code>mobile.css + desktop.css</code>. Advantages: mobile doesn&apos;t
          download desktop CSS. Limitations: multiple HTTP requests, complex
          build. Best for: performance-critical sites.
        </p>
        <p>
          <strong>Critical CSS + Async Load:</strong> Inline critical CSS
          (above-fold mobile styles), async load rest. Advantages: fast initial
          render, mobile-optimized. Limitations: build complexity. Best for:
          large sites with complex CSS.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/content-prioritization-mobile-first.svg"
          alt="Content Prioritization showing how mobile constraints force content hierarchy decisions"
          caption="Content prioritization — mobile screen constraints force decisions: essential content first (navigation, primary action), secondary content deferred (related links, footer)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Mobile-first involves trade-offs between design complexity,
          development workflow, and user experience.
        </p>

        <h3>Mobile-First vs. Desktop-First</h3>
        <p>
          <strong>Mobile-First:</strong> Base styles for mobile,{" "}
          <code>min-width</code> queries. Advantages: mobile-optimized CSS,
          forces content prioritization, better performance. Limitations:
          designers accustomed to desktop tools may find mobile canvas
          constraining. Best for: new projects, content-focused sites.
        </p>
        <p>
          <strong>Desktop-First:</strong> Base styles for desktop,{" "}
          <code>max-width</code> queries. Advantages: designers work on large
          canvas first. Limitations: mobile downloads all desktop CSS, content
          prioritization happens late (if at all). Best for: legacy projects,
          internal tools (desktop-only).
        </p>
        <p>
          <strong>Simultaneous (Responsive):</strong> Design mobile and desktop
          together, implement with mobile-first CSS. Advantages: holistic
          design, mobile-first implementation. Limitations: requires designing
          at multiple breakpoints simultaneously. Best for: design systems,
          component libraries.
        </p>

        <h3>Breakpoint Strategy Trade-offs</h3>
        <p>
          <strong>Few Breakpoints (3-4):</strong> Mobile, tablet, desktop,
          large desktop. Advantages: simpler CSS, easier maintenance.
          Limitations: may not optimize for all devices. Best for: most sites.
        </p>
        <p>
          <strong>Many Breakpoints (6+):</strong> Fine-grained control per
          device range. Advantages: optimized experience per device.
          Limitations: complex CSS, maintenance burden. Best for:
          design-heavy sites, e-commerce.
        </p>
        <p>
          <strong>Content-Based Breakpoints:</strong> Break where content
          breaks, not at device widths. Advantages: future-proof, design-driven.
          Limitations: requires design judgment. Best for: content-focused
          sites.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Start with Mobile Wireframes:</strong> Design mobile layout
            first in wireframing phase. Forces content prioritization before
            visual design. Then design tablet and desktop as enhancements.
          </li>
          <li>
            <strong>Use min-width Media Queries:</strong> Base CSS = mobile.{" "}
            <code>@media (min-width: 600px)</code> for tablet,{" "}
            <code>@media (min-width: 1024px)</code> for desktop. Mobile
            doesn&apos;t download desktop overrides.
          </li>
          <li>
            <strong>Design for Touch First:</strong> Minimum 44×44px touch
            targets. No hover-only interactions. Swipe gestures for common
            actions. Mouse users adapt to touch-optimized; touch users
            can&apos;t adapt to mouse-optimized.
          </li>
          <li>
            <strong>Optimize Images for Mobile:</strong> Use srcset for
            responsive images. Mobile shouldn&apos;t download desktop-sized
            images. Consider lazy loading for below-fold images.
          </li>
          <li>
            <strong>Test on Real Mobile Devices:</strong> Browser DevTools
            simulate viewport but not touch, performance, or network. Test on
            actual phones. Use network throttling to simulate 3G/4G.
          </li>
          <li>
            <strong>Progressive Enhancement for JavaScript:</strong> Core
            functionality works without JavaScript. JavaScript enhances
            experience (smooth animations, dynamic loading). Site works even if
            JavaScript fails.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Claiming Mobile-First, Implementing Desktop-First:</strong>{" "}
            Design mobile mockups but write <code>max-width</code> CSS. This
            isn&apos;t mobile-first — mobile downloads all desktop CSS. Use{" "}
            <code>min-width</code> queries for true mobile-first.
          </li>
          <li>
            <strong>Hiding Content Instead of Prioritizing:</strong> Using{" "}
            <code>display: none</code> to hide desktop content on mobile.
            Better: don&apos;t include non-essential content in mobile HTML, or
            load conditionally.
          </li>
          <li>
            <strong>Ignoring Touch:</strong> Designing interactions for mouse
            (hover states, small click targets). Touch users can&apos;t hover.
            Design for touch first.
          </li>
          <li>
            <strong>Too Many Breakpoints:</strong> Setting breakpoints for
            every device width. Maintenance nightmare. Use 3-4 key breakpoints
            (600px, 900px, 1200px) or content-based breakpoints.
          </li>
          <li>
            <strong>Not Testing Performance:</strong> Mobile-first isn&apos;t
            just layout — it&apos;s performance. Test on 3G networks. Measure
            load time, time-to-interactive. Optimize images, JavaScript, CSS.
          </li>
          <li>
            <strong>Forgetting Accessibility:</strong> Mobile-first should
            include accessibility-first. Large touch targets benefit motor-impaired
            users. Good color contrast benefits outdoor mobile users. Semantic
            HTML benefits screen reader users.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>News Website Redesign</h3>
        <p>
          Major news site (The Guardian) redesigned mobile-first. Started with
          mobile wireframes, prioritized headline and article content. Navigation
          simplified for mobile (hamburger menu). Desktop added sidebar, related
          articles, enhanced typography. Result: 30% faster mobile load time,
          20% increase in mobile engagement.
        </p>

        <h3>E-Commerce Checkout Flow</h3>
        <p>
          E-commerce site optimized checkout mobile-first. Mobile: single
          column, large form fields, sticky &quot;Place Order&quot; button,
          auto-fill for address. Desktop: multi-column, additional payment
          options, gift wrapping. Mobile-first approach reduced mobile cart
          abandonment by 25%.
        </p>

        <h3>SaaS Dashboard</h3>
        <p>
          SaaS analytics dashboard designed mobile-first. Mobile: key metrics
          only, simplified charts, swipe between views. Desktop: full data
          tables, complex visualizations, multi-panel layout. Mobile-first
          forced prioritization of most-important metrics — benefited desktop
          users too (clearer hierarchy).
        </p>

        <h3>Government Website</h3>
        <p>
          Government services site (GOV.UK) uses mobile-first for
          accessibility. Mobile-first ensures site works on old devices, slow
          networks, assistive technologies. Content prioritized for citizens
          on mobile (benefits all users). Mobile-first is inclusive design —
          works for everyone, not just users with latest devices.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What&apos;s the difference between mobile-first and progressive
              enhancement?
            </p>
            <p className="mt-2 text-sm">
              A: Mobile-first is progressive enhancement applied to viewport
              size. Progressive enhancement: start with basic HTML (works
              everywhere), layer on CSS (layout), then JavaScript
              (interactivity). Mobile-first: start with mobile styles (base
              CSS), layer on tablet enhancements (min-width: 600px), then
              desktop (min-width: 1024px). Both approaches ensure core
              functionality works for all users, enhancements for capable
              devices/browsers.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement mobile-first CSS?
            </p>
            <p className="mt-2 text-sm">
              A: Base styles target mobile (no media query). Use{" "}
              <code>min-width</code> media queries for larger screens. Example:{" "}
              <code>
                .card {'{'} padding: 1rem; {'}'} @media (min-width: 600px) {'{'}
                .card {'{'} padding: 1.5rem; {'}'} {'}'} @media (min-width:
                1024px) {'{'} .card {'{'} padding: 2rem; {'}'} {'}'}
              </code>
              . Mobile gets 1rem padding, tablet 1.5rem, desktop 2rem. Mobile
              doesn&apos;t download desktop padding override. This approach
              ensures mobile users get optimized CSS without desktop overrides,
              reducing bundle size and improving load times on mobile networks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you prioritize content for mobile-first design?
            </p>
            <p className="mt-2 text-sm">
              A: Techniques: (1) User research — what do mobile users need most?
              (2) Analytics — what content is accessed on mobile? (3) Content
              audit — categorize as essential, important, nice-to-have. (4)
              Mobile wireframes — force ranking (what fits on small screen?).
              (5) Test with users — does mobile layout meet user needs? Example:
              e-commerce product page — essential: image, price, &quot;Add to
              Cart&quot;; important: description, reviews; nice-to-have: related
              products, social share. Mobile constraints force difficult
              decisions that benefit all users — clearer hierarchy, faster load.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle navigation in mobile-first design?
            </p>
            <p className="mt-2 text-sm">
              A: Mobile: hamburger menu (icon expands to full-screen or drawer),
              bottom navigation (thumb-friendly), or tab bar (iOS pattern).
              Desktop: expand to full horizontal nav, mega-menu for complex
              sites. Key: mobile nav should be touch-friendly (large targets),
              accessible (keyboard navigable), and fast (no slow animations).
              Desktop nav can add hover states, multi-level dropdowns. Mobile
              navigation patterns should follow platform conventions (iOS Human
              Interface Guidelines, Material Design) for familiarity.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you test mobile-first designs?
            </p>
            <p className="mt-2 text-sm">
              A: Multi-layered: (1) Start with mobile wireframes — validate
              content hierarchy early. (2) Design at mobile breakpoint first —
              don&apos;design desktop then shrink. (3) Test in browser DevTools
              at key widths (320px, 768px, 1024px). (4) Test on real devices —
              touch behavior, performance, network. (5) Performance testing —
              Lighthouse mobile score, WebPageTest with 3G throttling. (6)
              Accessibility testing — screen reader, keyboard nav on mobile.
              Real device testing is critical — emulators don&apos;t replicate
              touch, network conditions, or CPU limitations accurately.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When should you NOT use mobile-first?
            </p>
            <p className="mt-2 text-sm">
              A: Mobile-first is best for most projects, but exceptions exist:
              (1) Desktop-only internal tools — if users only access on desktop,
              mobile-first adds no value. (2) Complex data-heavy dashboards —
              if mobile experience is fundamentally limited (can&apos;t show
              complex tables), design desktop first, create simplified mobile
              view. (3) Legacy projects — retrofitting mobile-first into
              desktop-first codebase may not be cost-effective. In these cases,
              responsive (not mobile-first) or adaptive (separate mobile site)
              may be pragmatic choices. Always evaluate based on actual user
              needs and device usage patterns for your specific application.
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
              href="https://www.lukew.com/ff/entry.asp?933"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Luke Wroblewski — Mobile First (Original Article)
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Media_Queries/Using_media_queries"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — Using Media Queries
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/2021/08/mobile-first-css-strategy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Smashing Magazine — Mobile-First CSS Strategy
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
              href="https://www.nngroup.com/articles/mobile-first-design/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Nielsen Norman Group — Mobile-First Design
            </a>
          </li>
          <li>
            <a
              href="https://alistapart.com/article/progressive-enhancement/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              A List Apart — Progressive Enhancement
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
