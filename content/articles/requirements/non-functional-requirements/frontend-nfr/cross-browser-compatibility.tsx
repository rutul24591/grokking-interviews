"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-cross-browser-compatibility",
  title: "Cross-Browser Compatibility",
  description:
    "Comprehensive guide to ensuring web applications work consistently across browsers. Covers feature detection, polyfills, CSS @supports, Autoprefixer, testing strategies, and graceful degradation.",
  category: "frontend",
  subcategory: "nfr",
  slug: "cross-browser-compatibility",
  version: "extensive",
  wordCount: 13000,
  readingTime: 52,
  lastUpdated: "2026-03-15",
  tags: [
    "frontend",
    "nfr",
    "compatibility",
    "browsers",
    "polyfills",
    "testing",
    "autoprefixer",
    "css-supports",
  ],
  relatedTopics: ["web-standards", "accessibility", "progressive-enhancement"],
};

export default function CrossBrowserCompatibilityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Cross-Browser Compatibility</strong> ensures web applications
          function correctly across different browsers (Chrome, Firefox, Safari,
          Edge) and versions. Despite web standards, browsers implement features
          differently and at different times.
        </p>
        <p>The challenge has evolved:</p>
        <ul>
          <li>
            <strong>2010s:</strong> IE6-11 compatibility was major concern
          </li>
          <li>
            <strong>2020s:</strong> Evergreen browsers auto-update, but Safari
            lags
          </li>
          <li>
            <strong>Today:</strong> Feature support varies, not just bugs
          </li>
        </ul>
        <p>
          For staff engineers, compatibility decisions balance user reach vs
          development cost. Supporting old browsers requires polyfills,
          workarounds, and testing overhead.
        </p>
      </section>

      <section>
        <h2>Browser Market Share</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/browser-market-share.svg"
          alt="Browser Market Share"
          caption="Global browser market share — Chrome, Safari, Firefox, Edge, and mobile browsers"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Desktop (2026)</h3>
        <ul>
          <li>Chrome: 65%</li>
          <li>Safari: 10%</li>
          <li>Edge: 8%</li>
          <li>Firefox: 5%</li>
          <li>Other: 12%</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Mobile (2026)</h3>
        <ul>
          <li>Chrome (Android): 55%</li>
          <li>Safari (iOS): 35%</li>
          <li>Samsung Internet: 5%</li>
          <li>Other: 5%</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight</h3>
          <p>
            Safari on iOS is the new &quot;IE&quot;—it&apos;s the browser you
            need to support that lags behind on features. All iOS browsers use
            WebKit (Safari engine), so Safari determines iOS web capabilities.
          </p>
        </div>
      </section>

      <section>
        <h2>Feature Detection</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/feature-detection.svg"
          alt="Feature Detection Pattern"
          caption="Feature detection vs browser detection — testing for capabilities instead of browser versions"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Why Feature Detection?
        </h3>
        <p>
          Don&apos;t detect browsers—detect features. Browser detection is
          fragile; features are reliable.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Detection Patterns</h3>
        <p>
          Use feature detection instead of browser detection. Check if a feature exists in the window object before using it. For example, check if 'fetch' is in window before using the fetch API. If not available, fallback to XMLHttpRequest. Browser detection using userAgent strings is fragile and error-prone because user agents can be spoofed and new browser versions constantly change the strings.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Modernizr</h3>
        <p>
          Modernizr is a library for feature detection. It adds classes to the html element indicating which features are supported (like flexbox, cssgrid) and which are not (like no-webp). This allows you to style based on feature support directly in CSS.
        </p>
      </section>

      <section>
        <h2>Polyfills & Transpilation</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/polyfills-transpilation.svg"
          alt="Polyfills and Transpilation"
          caption="Polyfill strategy — transpilation, polyfill services, and progressive enhancement"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Transpilation (Babel)
        </h3>
        <p>Convert modern JavaScript to older syntax:</p>
        <ul>
          <li>ES2022 → ES5 for older browsers</li>
          <li>JSX → JavaScript</li>
          <li>TypeScript → JavaScript</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Polyfills</h3>
        <p>Add missing features:</p>
        <ul>
          <li>
            <code>core-js</code>: JavaScript features (Promise, Array methods)
          </li>
          <li>
            <code>whatwg-fetch</code>: Fetch API
          </li>
          <li>
            <code>intersection-observer</code>: IntersectionObserver API
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Polyfill Services</h3>
        <p>Serve polyfills based on browser:</p>
        <ul>
          <li>
            <code>polyfill.io</code>: Automatic based on User-Agent
          </li>
          <li>Only send needed polyfills</li>
          <li>Reduces bundle size</li>
        </ul>
      </section>

      <section>
        <h2>Testing Strategies</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Tools</th>
              <th className="p-3 text-left">Coverage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">Local browsers</td>
              <td className="p-3">Install Chrome, Firefox, Safari</td>
              <td className="p-3">Limited versions</td>
            </tr>
            <tr>
              <td className="p-3">BrowserStack</td>
              <td className="p-3">Cloud-based testing</td>
              <td className="p-3">All browsers/versions</td>
            </tr>
            <tr>
              <td className="p-3">Sauce Labs</td>
              <td className="p-3">Cloud testing platform</td>
              <td className="p-3">Enterprise scale</td>
            </tr>
            <tr>
              <td className="p-3">Can I use</td>
              <td className="p-3">caniuse.com</td>
              <td className="p-3">Feature support data</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Graceful Degradation</h2>
        <p>When features aren&apos;t supported, provide fallback:</p>
        <ul>
          <li>CSS Grid → Flexbox → Float layout</li>
          <li>WebP → JPEG fallback</li>
          <li>Modern APIs → Polyfill or reduced functionality</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Progressive Enhancement
        </h3>
        <p>Start with baseline, enhance for capable browsers:</p>
        <ul>
          <li>Basic HTML works everywhere</li>
          <li>CSS enhances visual experience</li>
          <li>JavaScript adds interactivity</li>
        </ul>
      </section>

      <section>
        <h2>CSS Feature Queries (@supports)</h2>
        <p>
          The <code>@supports</code> rule (CSS Feature Queries) allows
          conditional CSS based on browser feature support. This is the CSS
          equivalent of feature detection in JavaScript.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Basic Syntax</h3>
        <p>
          Use <code>@supports (property: value)</code> to wrap enhanced CSS.
          Provide fallback styles outside the query. Combine conditions with{" "}
          <code>and</code> or use <code>not</code> for negation. Example:{" "}
          <code>@supports (display: grid)</code> for Grid support,
          <code>@supports not (backdrop-filter: blur(10px))</code> for fallback
          when backdrop-filter is unsupported.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Use Cases</h3>
        <ul className="space-y-2">
          <li>
            <strong>CSS Grid with Flexbox fallback:</strong> Grid for modern
            browsers, flex for older
          </li>
          <li>
            <strong>Custom properties (CSS variables):</strong> Provide
            hardcoded fallback values
          </li>
          <li>
            <strong>Modern layout features:</strong> gap, subgrid, container
            queries with fallbacks
          </li>
          <li>
            <strong>Visual effects:</strong> backdrop-filter, mix-blend-mode
            with solid color fallbacks
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Browser Support</h3>
        <p>
          <code>@supports</code> has excellent support (95%+). Safari 9+, Chrome
          49+, Firefox 49+, Edge 12+. For older browsers, the enhanced CSS is
          simply ignored (which is the correct graceful degradation).
        </p>
      </section>

      <section>
        <h2>Autoprefixer & PostCSS</h2>
        <p>
          Vendor prefixes (<code>-webkit-</code>, <code>-moz-</code>,{" "}
          <code>-ms-</code>) were historically required for experimental CSS
          features. Managing them manually is error-prone. Autoprefixer
          automates this process.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How Autoprefixer Works
        </h3>
        <ul className="space-y-2">
          <li>Parses your CSS for properties that need vendor prefixes</li>
          <li>
            Uses caniuse.com database to determine which prefixes are needed
          </li>
          <li>Adds only the prefixes required for your target browsers</li>
          <li>
            Removes outdated prefixes when browsers add unprefixed support
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Configuration</h3>
        <p>
          Configure target browsers in <code>package.json</code> using the{" "}
          <code>browserslist</code> field. Common config:{" "}
          <code>{"> 1%, last 2 versions, not dead, not ie 11"}</code>. Or use a
          separate
          <code>.browserslistrc</code> file.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration</h3>
        <ul className="space-y-2">
          <li>
            <strong>PostCSS:</strong> Add autoprefixer plugin to PostCSS config
          </li>
          <li>
            <strong>Webpack:</strong> css-loader + postcss-loader + autoprefixer
          </li>
          <li>
            <strong>Vite:</strong> Built-in PostCSS support, configure in
            postcss.config.js
          </li>
          <li>
            <strong>CLI:</strong> Run <code>autoprefixer</code> command with
            browserslist option
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Example Output</h3>
        <p>
          Input <code>backdrop-filter: blur(10px)</code> outputs prefixed
          versions for Safari (<code>-webkit-backdrop-filter</code>) and older
          browsers. Input <code>display: grid</code> outputs
          <code>-ms-grid</code> for IE 10-11. Autoprefixer only adds prefixes
          needed for your target browsers.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Best Practice</h3>
          <p>
            Write clean, unprefixed CSS and let Autoprefixer handle vendor
            prefixes based on your
            <code>browserslist</code> configuration. This keeps your source CSS
            maintainable while ensuring compatibility with your target browsers.
          </p>
        </div>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you decide which browsers to support?
            </p>
            <p className="mt-2 text-sm">
              A: Based on user analytics, business requirements, and support
              cost. Check analytics for actual browser usage. Consider market
              share for new products. Factor in testing and polyfill overhead.
              Document in a &quot;browser support policy&quot; that stakeholders
              approve.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What&apos;s your approach to CSS compatibility?
            </p>
            <p className="mt-2 text-sm">
              A: Use Autoprefixer for vendor prefixes. Test layouts in Safari
              (often lags). Use feature queries (@supports) for progressive
              enhancement. Have fallback layouts for critical paths. Avoid
              cutting-edge CSS in production without fallbacks.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
