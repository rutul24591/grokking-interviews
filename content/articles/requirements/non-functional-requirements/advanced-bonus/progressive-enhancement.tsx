"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-advanced-progressive-enhancement-extensive",
  title: "Progressive Enhancement",
  description: "Comprehensive guide to progressive enhancement and graceful degradation, covering feature detection, layered architecture, and universal design principles for staff/principal engineer interviews.",
  category: "advanced-topics",
  subcategory: "nfr",
  slug: "progressive-enhancement",
  version: "extensive",
  wordCount: 10500,
  readingTime: 42,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "progressive-enhancement", "graceful-degradation", "accessibility", "frontend"],
  relatedTopics: ["accessibility", "cross-browser-compatibility", "device-responsiveness"],
};

export default function ProgressiveEnhancementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Progressive Enhancement</strong> is a web development strategy that prioritizes content and
          functionality above presentation and advanced features. It starts with a solid, semantic HTML foundation
          that works in all browsers, then layers on CSS for presentation and JavaScript for enhanced interactivity.
          Users with limited browser capabilities still receive the core content and functionality, while users
          with modern browsers enjoy an enhanced experience.
        </p>
        <p>
          The concept was coined by Steven Champeon in 2003 as a response to the &quot;browser wars&quot; era,
          where developers often built sites that only worked in specific browsers. Progressive Enhancement
          flips the traditional development approach:
        </p>
        <ul>
          <li>
            <strong>Traditional (Graceful Degradation):</strong> Build the full-featured experience first, then
            add fallbacks for older browsers.
          </li>
          <li>
            <strong>Progressive Enhancement:</strong> Build the baseline experience first, then enhance for
            capable browsers.
          </li>
        </ul>
        <p>
          <strong>Core principles of Progressive Enhancement:</strong>
        </p>
        <ul>
          <li>
            <strong>Content first:</strong> All users should be able to access your content, regardless of
            browser, device, or network conditions.
          </li>
          <li>
            <strong>Semantic HTML:</strong> Use HTML elements for their intended purpose. A button should be
            a <code>{`<button>`}</code>, not a <code>{`<div>`}</code> with click handlers.
          </li>
          <li>
            <strong>Layered architecture:</strong> HTML provides content, CSS provides presentation, JavaScript
            provides behavior. Each layer enhances the previous one.
          </li>
          <li>
            <strong>Feature detection:</strong> Detect browser capabilities, not browser versions. Test for
            features before using them.
          </li>
          <li>
            <strong>Universal usability:</strong> The site should be usable by everyone, including users with
            disabilities, older devices, or slow connections.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Progressive Enhancement Is Not Optional</h3>
          <p>
            Progressive Enhancement is not just about supporting Internet Explorer. It&apos;s about resilience:
            your site should work when JavaScript fails to load, when CSS is blocked, when images don&apos;t
            download, or when users have disabilities that prevent them from using certain features.
          </p>
          <p className="mt-3">
            <strong>Business impact:</strong> Sites built with progressive enhancement have better SEO (search
            engines see your content), better accessibility ( WCAG compliance), better performance (smaller
            initial payload), and better conversion rates (users can always complete core tasks).
          </p>
        </div>

        <p>
          This article covers progressive enhancement principles, feature detection strategies, implementation
          patterns, and the relationship with modern frameworks and server-side rendering.
        </p>
      </section>

      <section>
        <h2>Progressive Enhancement vs Graceful Degradation</h2>
        <p>
          While both approaches aim to support multiple browsers, they differ fundamentally in philosophy and
          implementation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Progressive Enhancement (Bottom-Up)</h3>
        <p>
          Start with the simplest, most compatible implementation, then add enhancements:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Layer 1 - HTML:</strong> Semantic markup that works everywhere. Forms submit, links navigate,
            content is readable.
          </li>
          <li>
            <strong>Layer 2 - CSS:</strong> Visual styling that enhances the experience. Layout, colors,
            typography, animations.
          </li>
          <li>
            <strong>Layer 3 - JavaScript:</strong> Interactive enhancements. AJAX form submission, dynamic
            content loading, client-side validation.
          </li>
        </ol>
        <p>
          <strong>Example — Form Submission:</strong>
        </p>
        <ul>
          <li>
            <strong>Baseline:</strong> Form submits via HTTP POST, server returns new page.
          </li>
          <li>
            <strong>Enhanced:</strong> JavaScript intercepts submit, sends via fetch(), displays response
            without page reload.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Graceful Degradation (Top-Down)</h3>
        <p>
          Build the full-featured experience first, then add fallbacks for limited browsers:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Build full experience:</strong> Use modern APIs (fetch, IntersectionObserver, CSS Grid).
          </li>
          <li>
            <strong>Add polyfills:</strong> Include shims for missing features (fetch polyfill, CSS Grid
            fallback).
          </li>
          <li>
            <strong>Test in older browsers:</strong> Fix critical issues, accept minor differences.
          </li>
        </ol>
        <p>
          <strong>Example — Image Loading:</strong>
        </p>
        <ul>
          <li>
            <strong>Full experience:</strong> Use <code>{`<picture>`}</code> with WebP/AVIF formats.
          </li>
          <li>
            <strong>Fallback:</strong> Include JPEG fallback in <code>{`<picture>`}</code> element.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Which Approach to Use?</h3>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Factor</th>
                <th className="p-2 text-left">Progressive Enhancement</th>
                <th className="p-2 text-left">Graceful Degradation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2"><strong>Best for</strong></td>
                <td className="p-2">Content sites, e-commerce, public-facing apps</td>
                <td className="p-2">Internal tools, dashboards, modern browser targets</td>
              </tr>
              <tr>
                <td className="p-2"><strong>Development effort</strong></td>
                <td className="p-2">Front-loaded (design baseline first)</td>
                <td className="p-2">Back-loaded (fix issues later)</td>
              </tr>
              <tr>
                <td className="p-2"><strong>SEO impact</strong></td>
                <td className="p-2">Excellent (content always accessible)</td>
                <td className="p-2">Variable (depends on JS rendering)</td>
              </tr>
              <tr>
                <td className="p-2"><strong>Accessibility</strong></td>
                <td className="p-2">Built-in (semantic HTML first)</td>
                <td className="p-2">Requires additional effort</td>
              </tr>
              <tr>
                <td className="p-2"><strong>Performance</strong></td>
                <td className="p-2">Better (smaller initial payload)</td>
                <td className="p-2">May include polyfills for all users</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/progressive-enhancement-layers.svg"
          alt="Progressive Enhancement Layers"
          caption="Progressive Enhancement — showing the layered architecture: HTML foundation (works everywhere), CSS enhancement (visual styling), JavaScript enhancement (interactivity)"
        />
      </section>

      <section>
        <h2>Feature Detection Strategies</h2>
        <p>
          Feature detection is the cornerstone of progressive enhancement. Instead of checking browser versions
          (which is unreliable), test for the specific capabilities you need.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Native Feature Detection</h3>
        <p>
          The simplest approach — check if a feature exists before using it:
        </p>
        <ul>
          <li>
            <strong>Check for API existence:</strong> <code>{`if ('fetch' in window) { ... }`}</code>
          </li>
          <li>
            <strong>Check for method:</strong> <code>{`if (element.addEventListener) { ... }`}</code>
          </li>
          <li>
            <strong>Check for CSS support:</strong> <code>{`if ('backdropFilter' in document.body.style) { ... }`}</code>
          </li>
          <li>
            <strong>Try/catch for risky features:</strong> Accessing certain APIs may throw in restricted
            contexts.
          </li>
        </ul>
        <p>
          <strong>Best practices:</strong>
        </p>
        <ul>
          <li>Detect features at the point of use, not globally.</li>
          <li>Cache detection results to avoid repeated checks.</li>
          <li>Provide meaningful fallbacks, not just silent failures.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Modernizr</h3>
        <p>
          Modernizr is a feature detection library that adds CSS classes to the <code>{`<html>`}</code> element
          based on supported features:
        </p>
        <ul>
          <li>
            <strong>Usage:</strong> Include Modernizr in your build. It automatically detects features and adds
            classes like <code>css-grid</code>, <code>no-css-grid</code>, <code>webp</code>, <code>no-webp</code>.
          </li>
          <li>
            <strong>CSS integration:</strong> Use classes for conditional styling:
            <code>{`.gallery { display: grid; } .no-css-grid .gallery { display: flex; }`}</code>
          </li>
          <li>
            <strong>Custom tests:</strong> Add custom feature tests for your specific needs.
          </li>
        </ul>
        <p>
          <strong>Trade-offs:</strong> Modernizr adds bundle size (~7-30KB depending on configuration). For
          simple projects, native detection may be sufficient.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CSS Feature Queries (@supports)</h3>
        <p>
          CSS provides native feature detection via @supports rule. This allows conditional CSS based on browser feature support. For example, you can use CSS Grid with a flexbox fallback for browsers that don't support Grid. The @supports rule checks if a CSS property is supported before applying styles.
        </p>
        <p>
          <strong>Advantages:</strong> No JavaScript required, works even if JS fails to load, clean separation of concerns.
        </p>
        <p>
          <strong>Limitations:</strong> Cannot detect JavaScript APIs, limited to CSS properties.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Polyfills and Shim Libraries</h3>
        <p>
          Polyfills provide modern functionality in older browsers:
        </p>
        <ul>
          <li>
            <strong>When to use:</strong> When a feature is critical and no acceptable fallback exists.
          </li>
          <li>
            <strong>Examples:</strong> fetch polyfill, IntersectionObserver polyfill, CSS Grid polyfill.
          </li>
          <li>
            <strong>Best practice:</strong> Load polyfills conditionally based on feature detection, not for
            all users.
          </li>
        </ul>
        <p>
          <strong>Dynamic polyfill loading:</strong> Load polyfills conditionally using dynamic imports. Check if a feature exists before loading the polyfill. For example, only load the fetch polyfill if the fetch API is not available in the browser.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/feature-detection-strategies.svg"
          alt="Feature Detection Strategies"
          caption="Feature Detection — showing native detection, Modernizr, CSS @supports, and polyfill loading strategies with decision flow"
        />
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <p>
          Progressive enhancement can be applied to every aspect of web development. Here are key patterns for
          common scenarios.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Navigation</h3>
        <p>
          <strong>Baseline:</strong> Standard HTML links and unordered lists. Works without CSS or JavaScript. Users can navigate using semantic nav elements with anchor tags.
        </p>
        <p>
          <strong>Enhanced:</strong> CSS for horizontal layout, hover states, dropdown menus. JavaScript for mobile hamburger menu, smooth scrolling, active state highlighting.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Forms</h3>
        <p>
          <strong>Baseline:</strong> Semantic form elements with proper labels. Server-side validation. Full page reload on submit. Use proper input types (email, password) for native browser validation.
        </p>
        <p>
          <strong>Enhanced:</strong> Client-side validation with immediate feedback. AJAX submission without page reload. Password strength meter. Auto-focus on error fields.
        </p>
        <p>
          <strong>Key principle:</strong> The form must work without JavaScript. Enhancements should improve the experience, not enable core functionality.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Images and Media</h3>
        <p>
          <strong>Baseline:</strong> Standard img element with alt text. Browser loads the specified source. Always provide meaningful alt text for accessibility.
        </p>
        <p>
          <strong>Enhanced:</strong> Responsive images with picture element, lazy loading, modern formats (WebP, AVIF), blur-up placeholders.
        </p>
        <p>
          <strong>Key principle:</strong> Always provide a fallback. The last source or the img src is the fallback for browsers that don't support modern formats.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Interactive Components</h3>
        <p>
          <strong>Baseline:</strong> Use native HTML elements for interactivity. Buttons submit forms or trigger links. Details/summary for accordions. Select for dropdowns. These elements work without JavaScript.
        </p>
        <p>
          <strong>Enhanced:</strong> Custom JavaScript components with animations, keyboard navigation, ARIA attributes for screen readers.
        </p>
        <p>
          <strong>Key principle:</strong> If you replace a native element (like select) with a custom component, ensure the custom version provides equivalent functionality and accessibility.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Loading</h3>
        <p>
          <strong>Baseline:</strong> Server renders content. Links navigate to new pages. Forms submit and
          return new pages.
        </p>
        <p>
          <strong>Enhanced:</strong> Client-side data fetching with fetch/axios. Infinite scroll. Optimistic
          updates. Background sync.
        </p>
        <p>
          <strong>Pattern — Enhanced Links:</strong>
        </p>
        <ul>
          <li>Links work without JavaScript (standard href navigation).</li>
          <li>JavaScript intercepts click events for eligible links.</li>
          <li>Fetch content via AJAX and update page without reload.</li>
          <li>Update browser history with pushState.</li>
          <li>If JavaScript fails, links still work via standard navigation.</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/progressive-enhancement-patterns.svg"
          alt="Progressive Enhancement Implementation Patterns"
          caption="Implementation Patterns — showing baseline HTML and enhanced versions for navigation, forms, images, and interactive components"
        />
      </section>

      <section>
        <h2>Progressive Enhancement in Modern Frameworks</h2>
        <p>
          Modern JavaScript frameworks (React, Vue, Angular) present both opportunities and challenges for
          progressive enhancement.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">The Challenge</h3>
        <p>
          Client-side rendered (CSR) frameworks inherently conflict with progressive enhancement:
        </p>
        <ul>
          <li>
            <strong>Empty HTML:</strong> Initial HTML is often just <code>{`<div id="root"></div>`}</code>.
            Without JavaScript, users see nothing.
          </li>
          <li>
            <strong>JavaScript-dependent:</strong> Core functionality (navigation, form submission) requires
            JavaScript to work.
          </li>
          <li>
            <strong>SEO impact:</strong> Search engines may not execute JavaScript, missing your content.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Server-Side Rendering (SSR)</h3>
        <p>
          SSR addresses the progressive enhancement problem by rendering initial HTML on the server:
        </p>
        <ul>
          <li>
            <strong>How it works:</strong> Server generates HTML for the initial page load. JavaScript hydrates
            the page for interactivity.
          </li>
          <li>
            <strong>Benefits:</strong> Content is visible without JavaScript. Better SEO. Faster perceived
            load time.
          </li>
          <li>
            <strong>Frameworks:</strong> Next.js (React), Nuxt (Vue), Angular Universal.
          </li>
        </ul>
        <p>
          <strong>Pattern:</strong>
        </p>
        <ul>
          <li>Server returns fully-rendered HTML.</li>
          <li>Browser displays content immediately.</li>
          <li>JavaScript loads and &quot;hydrates&quot; the page (attaches event listeners).</li>
          <li>If JavaScript fails, content is still accessible (though interactivity is limited).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Progressive Hydration</h3>
        <p>
          React 18+ and other frameworks support progressive hydration for better performance:
        </p>
        <ul>
          <li>
            <strong>How it works:</strong> Instead of hydrating the entire page at once, hydrate components
            progressively as they become visible or as JavaScript becomes available.
          </li>
          <li>
            <strong>Benefits:</strong> Faster Time to Interactive (TTI). Lower-priority components can wait.
            Better performance on slow devices.
          </li>
          <li>
            <strong>Implementation:</strong> React Suspense, useTransition, and selective hydration APIs.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Islands Architecture</h3>
        <p>
          A pattern popularized by Astro and Fresh that combines static HTML with interactive &quot;islands&quot;:
        </p>
        <ul>
          <li>
            <strong>How it works:</strong> Most of the page is static HTML. Interactive components (&quot;islands&quot;)
            are hydrated independently.
          </li>
          <li>
            <strong>Benefits:</strong> Minimal JavaScript. Each island can be loaded on demand. Non-interactive
            content requires no JavaScript.
          </li>
          <li>
            <strong>Frameworks:</strong> Astro, Fresh, Qwik (with resumability).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enhanced Progressive Enhancement</h3>
        <p>
          Modern frameworks can support progressive enhancement with careful design:
        </p>
        <ul>
          <li>
            <strong>Forms:</strong> Use standard form actions. Enhance with client-side submission after
            hydration.
          </li>
          <li>
            <strong>Navigation:</strong> Standard links work. JavaScript intercepts for client-side routing.
          </li>
          <li>
            <strong>Data loading:</strong> Server loads initial data. Client can refetch for fresh data.
          </li>
          <li>
            <strong>Error handling:</strong> Show error boundaries with retry options. Provide fallback UI.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/framework-progressive-enhancement.svg"
          alt="Progressive Enhancement in Modern Frameworks"
          caption="Framework Approaches — comparing CSR (no PE), SSR (basic PE), Progressive Hydration, and Islands Architecture"
        />
      </section>

      <section>
        <h2>Testing for Progressive Enhancement</h2>
        <p>
          Testing ensures your progressive enhancement implementation works correctly across all scenarios.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Disable JavaScript</h3>
        <p>
          The most important test — can users complete core tasks without JavaScript?
        </p>
        <ul>
          <li>
            <strong>Chrome DevTools:</strong> Open DevTools → Command Menu (Cmd+Shift+P) → Type &quot;Disable
            JavaScript&quot;.
          </li>
          <li>
            <strong>Browser extensions:</strong> Use extensions like Quick JavaScript Switcher.
          </li>
          <li>
            <strong>Test scenarios:</strong> Navigation, form submission, content access, search.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Disable CSS</h3>
        <p>
          Verify content is accessible and logically ordered without styling:
        </p>
        <ul>
          <li>
            <strong>Browser extensions:</strong> Use extensions that disable CSS.
          </li>
          <li>
            <strong>Text browsers:</strong> Test with Lynx or links for pure text experience.
          </li>
          <li>
            <strong>Screen readers:</strong> Test with NVDA, JAWS, or VoiceOver.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Slow Network Testing</h3>
        <p>
          Simulate slow networks to test progressive loading:
        </p>
        <ul>
          <li>
            <strong>Chrome DevTools:</strong> Network tab → Throttling → Select &quot;Slow 3G&quot;.
          </li>
          <li>
            <strong>Test scenarios:</strong> Does content load progressively? Are critical resources prioritized?
            Do fallbacks work when enhanced resources timeout?
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Automated Testing</h3>
        <p>
          Include progressive enhancement checks in your test suite:
        </p>
        <ul>
          <li>
            <strong>HTML validation:</strong> Ensure semantic, valid HTML.
          </li>
          <li>
            <strong>Accessibility testing:</strong> Use axe-core, Lighthouse, WAVE.
          </li>
          <li>
            <strong>SEO testing:</strong> Verify meta tags, structured data, crawlable content.
          </li>
          <li>
            <strong>Visual regression:</strong> Compare rendered output across browsers.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <div className="my-6 rounded-lg border border-warning/30 bg-warning/10 p-6">
          <h3 className="mb-3 font-semibold">1. JavaScript-Only Functionality</h3>
          <p>
            Don&apos;t gate core functionality behind JavaScript. Forms should submit without JS. Links should
            navigate without JS. Content should be accessible without JS.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-warning/30 bg-warning/10 p-6">
          <h3 className="mb-3 font-semibold">2. Div-itis Instead of Semantic HTML</h3>
          <p>
            Using <code>{`<div>`}</code> for everything loses the built-in accessibility and functionality of
            native elements. Use <code>{`<button>`}</code> for buttons, <code>{`<a>`}</code> for links,
            <code>{`<nav>`}</code> for navigation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-warning/30 bg-warning/10 p-6">
          <h3 className="mb-3 font-semibold">3. Assuming JavaScript Will Always Load</h3>
          <p>
            JavaScript can fail to load due to network issues, CSP restrictions, ad blockers, or corporate
            firewalls. Design for failure scenarios.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-warning/30 bg-warning/10 p-6">
          <h3 className="mb-3 font-semibold">4. Ignoring Performance</h3>
          <p>
            Progressive enhancement should improve performance, not add overhead. Don&apos;t ship both baseline
            and enhanced code to all users. Use feature detection to load only what&apos;s needed.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-warning/30 bg-warning/10 p-6">
          <h3 className="mb-3 font-semibold">5. Forgetting About Bots and Crawlers</h3>
          <p>
            Search engines, social media crawlers, and accessibility tools may not execute JavaScript. Ensure
            your content is accessible to non-browser user agents.
          </p>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is progressive enhancement and why is it important?</p>
            <p className="mt-2 text-sm">
              A: Progressive Enhancement is a development strategy that starts with a semantic HTML foundation
              that works everywhere, then layers on CSS for presentation and JavaScript for interactivity. It
              ensures content is accessible to all users regardless of browser capabilities, network conditions,
              or disabilities. Benefits include better SEO, accessibility, performance, and resilience.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does progressive enhancement differ from graceful degradation?</p>
            <p className="mt-2 text-sm">
              A: Progressive Enhancement builds from the baseline up (HTML → CSS → JS), ensuring core functionality
              works everywhere. Graceful Degradation builds the full experience first, then adds fallbacks for
              older browsers. PE is bottom-up (inclusive), GD is top-down (exclusive with fallbacks).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement feature detection?</p>
            <p className="mt-2 text-sm">
              A: Use native detection ({`if ('fetch' in window)`}), CSS @supports queries, or libraries like
              Modernizr. Detect features at point of use, cache results, and provide meaningful fallbacks.
              Avoid browser sniffing — detect capabilities, not browser versions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do modern frameworks support progressive enhancement?</p>
            <p className="mt-2 text-sm">
              A: Through Server-Side Rendering (Next.js, Nuxt), Progressive Hydration (React 18+), and Islands
              Architecture (Astro, Fresh). These approaches render initial HTML on the server, then hydrate
              progressively. Core content is accessible without JavaScript; interactivity enhances the experience.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you test for progressive enhancement?</p>
            <p className="mt-2 text-sm">
              A: Test with JavaScript disabled (core tasks should work), CSS disabled (content should be
              readable), and slow networks (progressive loading). Use screen readers for accessibility. Include
              automated checks for HTML validity, accessibility (axe-core), and SEO (Lighthouse).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When is progressive enhancement most critical?</p>
            <p className="mt-2 text-sm">
              A: Critical for: content sites (news, blogs), e-commerce (conversion depends on accessibility),
              public services (government, healthcare), global audiences (diverse devices/networks), and
              SEO-dependent sites. Less critical for internal tools with controlled browser environments.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://alistapart.com/article/understandingprogressiveenhancement/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              A List Apart — Understanding Progressive Enhancement
            </a>
          </li>
          <li>
            <a href="https://www.smashingmagazine.com/2009/04/progressive-enhancement-what-it-is-and-how-to-use-it/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Smashing Magazine — Progressive Enhancement Guide
            </a>
          </li>
          <li>
            <a href="https://web.dev/progressive-enhancement/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Progressive Enhancement
            </a>
          </li>
          <li>
            <a href="https://modernizr.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Modernizr — Feature Detection Library
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-practices/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WAI-ARIA Authoring Practices
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
