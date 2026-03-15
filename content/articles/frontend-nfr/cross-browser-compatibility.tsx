"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-cross-browser-compatibility",
  title: "Cross-Browser Compatibility",
  description: "Comprehensive guide to ensuring web applications work consistently across browsers. Covers feature detection, polyfills, testing strategies, and graceful degradation.",
  category: "frontend",
  subcategory: "nfr",
  slug: "cross-browser-compatibility",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "compatibility", "browsers", "polyfills", "testing"],
  relatedTopics: ["web-standards", "accessibility", "progressive-enhancement"],
};

export default function CrossBrowserCompatibilityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Cross-Browser Compatibility</strong> ensures web applications function correctly across
          different browsers (Chrome, Firefox, Safari, Edge) and versions. Despite web standards,
          browsers implement features differently and at different times.
        </p>
        <p>
          The challenge has evolved:
        </p>
        <ul>
          <li><strong>2010s:</strong> IE6-11 compatibility was major concern</li>
          <li><strong>2020s:</strong> Evergreen browsers auto-update, but Safari lags</li>
          <li><strong>Today:</strong> Feature support varies, not just bugs</li>
        </ul>
        <p>
          For staff engineers, compatibility decisions balance user reach vs development cost.
          Supporting old browsers requires polyfills, workarounds, and testing overhead.
        </p>
      </section>

      <section>
        <h2>Browser Market Share</h2>
        <ArticleImage
          src="/diagrams/frontend-nfr/browser-market-share.svg"
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
            Safari on iOS is the new &quot;IE&quot;—it&apos;s the browser you need to support that lags
            behind on features. All iOS browsers use WebKit (Safari engine), so Safari determines iOS
            web capabilities.
          </p>
        </div>
      </section>

      <section>
        <h2>Feature Detection</h2>
        <ArticleImage
          src="/diagrams/frontend-nfr/feature-detection.svg"
          alt="Feature Detection Pattern"
          caption="Feature detection vs browser detection — testing for capabilities instead of browser versions"
        />
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Why Feature Detection?</h3>
        <p>
          Don&apos;t detect browsers—detect features. Browser detection is fragile; features are reliable.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Detection Patterns</h3>
        <pre className="my-4 overflow-x-auto rounded-lg bg-panel-soft p-4 text-sm">
          <code>{`// Good: Feature detection
if ('fetch' in window) {
  // Use fetch API
} else {
  // Fallback to XMLHttpRequest
}

// Bad: Browser detection
if (navigator.userAgent.includes('Chrome')) {
  // Fragile and error-prone
}`}</code>
        </pre>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Modernizr</h3>
        <p>
          Library for feature detection. Adds classes to <code>&lt;html&gt;</code>:
        </p>
        <pre className="my-4 overflow-x-auto rounded-lg bg-panel-soft p-4 text-sm">
          <code>{`<html class="flexbox cssgrid no-webp">
  <!-- Style based on support -->
</html>`}</code>
        </pre>
      </section>

      <section>
        <h2>Polyfills & Transpilation</h2>
        <ArticleImage
          src="/diagrams/frontend-nfr/polyfills-transpilation.svg"
          alt="Polyfills and Transpilation"
          caption="Polyfill strategy — transpilation, polyfill services, and progressive enhancement"
        />
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Transpilation (Babel)</h3>
        <p>
          Convert modern JavaScript to older syntax:
        </p>
        <ul>
          <li>ES2022 → ES5 for older browsers</li>
          <li>JSX → JavaScript</li>
          <li>TypeScript → JavaScript</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Polyfills</h3>
        <p>
          Add missing features:
        </p>
        <ul>
          <li><code>core-js</code>: JavaScript features (Promise, Array methods)</li>
          <li><code>whatwg-fetch</code>: Fetch API</li>
          <li><code>intersection-observer</code>: IntersectionObserver API</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Polyfill Services</h3>
        <p>
          Serve polyfills based on browser:
        </p>
        <ul>
          <li><code>polyfill.io</code>: Automatic based on User-Agent</li>
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
        <p>
          When features aren&apos;t supported, provide fallback:
        </p>
        <ul>
          <li>CSS Grid → Flexbox → Float layout</li>
          <li>WebP → JPEG fallback</li>
          <li>Modern APIs → Polyfill or reduced functionality</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Progressive Enhancement</h3>
        <p>
          Start with baseline, enhance for capable browsers:
        </p>
        <ul>
          <li>Basic HTML works everywhere</li>
          <li>CSS enhances visual experience</li>
          <li>JavaScript adds interactivity</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you decide which browsers to support?</p>
            <p className="mt-2 text-sm">
              A: Based on user analytics, business requirements, and support cost. Check analytics for
              actual browser usage. Consider market share for new products. Factor in testing and
              polyfill overhead. Document in a &quot;browser support policy&quot; that stakeholders approve.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s your approach to CSS compatibility?</p>
            <p className="mt-2 text-sm">
              A: Use Autoprefixer for vendor prefixes. Test layouts in Safari (often lags). Use feature
              queries (@supports) for progressive enhancement. Have fallback layouts for critical paths.
              Avoid cutting-edge CSS in production without fallbacks.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
