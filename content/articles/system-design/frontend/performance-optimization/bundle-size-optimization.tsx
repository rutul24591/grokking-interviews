"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-bundle-size-optimization",
  title: "Bundle Size Optimization",
  description: "Comprehensive guide to analyzing, reducing, and monitoring JavaScript bundle sizes through dependency optimization, code splitting, and build configuration.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "bundle-size-optimization",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "performance", "bundle-size", "webpack", "vite", "optimization", "code-splitting"],
  relatedTopics: ["tree-shaking", "code-splitting", "lazy-loading", "performance-budgets"],
};

export default function BundleSizeOptimizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Bundle size optimization</strong> is the systematic practice of minimizing the amount of 
          JavaScript, CSS, and other assets shipped to the browser. Every kilobyte matters: large bundles 
          increase download time, parsing time, compilation time, and memory usage — directly impacting Time 
          to Interactive (TTI) and Core Web Vitals.
        </p>
        <p>
          A typical unoptimized React application can easily ship 2-5 megabytes of JavaScript when including 
          framework code, third-party libraries, and application code. On a fast broadband connection (100 
          Mbps), this might add only 1-2 seconds to load time. However, on a typical 3G mobile connection 
          (1.5 Mbps), downloading 3 megabytes takes 16+ seconds — and that&apos;s before parsing and execution, 
          which can add another 5-10 seconds on mid-tier mobile devices.
        </p>
        <p>
          Bundle size optimization is not about a single technique but a systematic approach involving:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Measurement:</strong> Understanding what&apos;s in your bundle through visualization tools 
            and size analysis.
          </li>
          <li>
            <strong>Dependency Optimization:</strong> Replacing heavy libraries with lighter alternatives or 
            native APIs.
          </li>
          <li>
            <strong>Code Splitting:</strong> Breaking the bundle into smaller chunks loaded on demand.
          </li>
          <li>
            <strong>Build Configuration:</strong> Tuning bundler settings for optimal output.
          </li>
          <li>
            <strong>Monitoring:</strong> Setting performance budgets to prevent regression.
          </li>
        </ul>
        <p>
          The business impact of bundle size optimization is well-documented:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Amazon:</strong> Every 100ms of latency cost them 1% in sales.
          </li>
          <li>
            <strong>Google:</strong> A 500ms increase in search result display time reduced traffic by 20%.
          </li>
          <li>
            <strong>Pinterest:</strong> Reducing perceived wait times by 40% increased search engine traffic 
            by 15%.
          </li>
          <li>
            <strong>COOK:</strong> Reducing load time by 0.85 seconds increased conversions by 7%.
          </li>
        </ul>
        <p>
          In system design interviews, bundle size optimization demonstrates understanding of the browser 
          rendering pipeline, network constraints, build tooling, and the trade-offs between developer 
          experience and production performance.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/bundle-size-composition.svg"
          alt="Treemap visualization showing typical JavaScript bundle composition with application code, React, third-party libraries, router, and utilities"
          caption="Typical bundle composition before optimization: third-party libraries often account for 50%+ of bundle size"
        />

        <h3>Why Bundle Size Matters</h3>
        <p>
          Bundle size impacts performance through multiple mechanisms:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Download Time:</strong> The time to transfer bytes over the network. On 3G, each 100 KB 
            adds approximately 0.5 seconds. On slower connections (2G, emerging markets), this multiplier 
            increases significantly.
          </li>
          <li>
            <strong>Parse Time:</strong> JavaScript must be parsed before execution. Modern JavaScript engines 
            are fast, but parsing 1 MB of JavaScript still takes 100-300ms on mobile devices.
          </li>
          <li>
            <strong>Compile Time:</strong> After parsing, JavaScript is compiled to bytecode. This is CPU-intensive 
            and blocks the main thread.
          </li>
          <li>
            <strong>Execution Time:</strong> Module initialization code runs, setting up the application. More 
            code means more execution time.
          </li>
          <li>
            <strong>Memory Usage:</strong> Larger bundles consume more memory, which is especially constrained 
            on mobile devices. This can trigger garbage collection pauses or even tab crashes.
          </li>
        </ul>

        <h3>Bundle Composition Analysis</h3>
        <p>
          Understanding what&apos;s in your bundle is the first step to optimization. A typical React application 
          bundle consists of:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Framework Code (25-35%):</strong> React, ReactDOM, and related packages. This is typically 
            ~130 KB for React 18.
          </li>
          <li>
            <strong>Third-party Libraries (30-50%):</strong> Date libraries, utility libraries, chart libraries, 
            UI component libraries. This is often the largest and most optimizable category.
          </li>
          <li>
            <strong>Router (5-10%):</strong> React Router, Vue Router, or similar. Typically 30-80 KB.
          </li>
          <li>
            <strong>Application Code (20-40%):</strong> Your actual business logic, components, and styles. 
            This varies widely by application complexity.
          </li>
        </ul>
        <p>
          The key insight: <strong>third-party libraries often account for more than half of bundle size</strong>, 
          yet they receive less scrutiny than application code during development.
        </p>

        <h3>Compression vs Uncompressed Size</h3>
        <p>
          Bundle size is typically discussed in two contexts:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Uncompressed Size:</strong> The raw size of the JavaScript file. This affects parse time, 
            compile time, and memory usage.
          </li>
          <li>
            <strong>Compressed Size (gzip/Brotli):</strong> The size transferred over the network. Modern servers 
            compress text assets, typically achieving 60-75% reduction.
          </li>
        </ul>
        <p>
          Both metrics matter: compressed size affects network transfer time, while uncompressed size affects 
          client-side processing. A bundle that is 500 KB uncompressed might be 150 KB over the wire with Brotli 
          compression, but the browser still needs to parse and execute 500 KB of JavaScript.
        </p>

        <h3>Key Metrics for Bundle Analysis</h3>
        <ul className="space-y-2">
          <li>
            <strong>Total Bundle Size:</strong> Sum of all JavaScript files. Target: &lt;500 KB uncompressed 
            for initial load.
          </li>
          <li>
            <strong>Initial Bundle Size:</strong> JavaScript required for first paint. Target: &lt;200 KB 
            uncompressed.
          </li>
          <li>
            <strong>Chunk Count:</strong> Number of separate JavaScript files. Target: 5-15 chunks total.
          </li>
          <li>
            <strong>Largest Chunk:</strong> Size of the biggest individual file. Target: &lt;150 KB uncompressed.
          </li>
          <li>
            <strong>Vendor Bundle Size:</strong> Third-party library code. Target: &lt;300 KB with tree shaking.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/bundle-size-optimization-steps.svg"
          alt="Step-by-step diagram showing bundle size reduction from 2.4 MB through tree shaking, code splitting, library replacement, and compression to final 120 KB"
          caption="Bundle optimization pipeline: systematic approach achieving 95% total reduction"
        />

        <h3>Bundle Optimization Pipeline</h3>
        <p>
          Effective bundle optimization follows a systematic pipeline:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Baseline Measurement:</strong> Run bundle analysis on the current build to understand 
            composition. Use webpack-bundle-analyzer, source-map-explorer, or rollup-plugin-visualizer.
          </li>
          <li>
            <strong>Identify Optimization Targets:</strong> Look for the largest modules, duplicate dependencies, 
            and opportunities for tree shaking.
          </li>
          <li>
            <strong>Dependency Audit:</strong> Review each third-party library. Can it be replaced with a 
            lighter alternative? Can it be tree-shaken more effectively?
          </li>
          <li>
            <strong>Code Splitting Implementation:</strong> Add dynamic imports for routes and heavy components. 
            Configure vendor chunk splitting.
          </li>
          <li>
            <strong>Build Configuration:</strong> Tune bundler settings for optimal output (minification, 
            tree shaking, scope hoisting).
          </li>
          <li>
            <strong>Verification:</strong> Re-run bundle analysis to confirm improvements. Compare before/after 
            sizes.
          </li>
          <li>
            <strong>Performance Budget:</strong> Set limits in CI/CD to prevent regression.
          </li>
        </ol>

        <h3>Dependency Replacement Strategy</h3>
        <p>
          The highest-ROI optimization is often replacing heavy libraries:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>moment.js → date-fns:</strong> 300 KB → ~3 KB per function. date-fns is tree-shakeable 
            and uses ES modules.
          </li>
          <li>
            <strong>lodash → lodash-es:</strong> 70 KB → ~2 KB per function. Named imports enable tree shaking.
          </li>
          <li>
            <strong>numeral.js → Intl.NumberFormat:</strong> 30 KB → 0 KB. Native browser API with no bundle 
            impact.
          </li>
          <li>
            <strong>uuid → crypto.randomUUID():</strong> 12 KB → 0 KB. Modern browsers provide this natively.
          </li>
          <li>
            <strong>querystring → URLSearchParams:</strong> 8 KB → 0 KB. Native URL API handles most use cases.
          </li>
        </ul>

        <h3>Code Splitting Architecture</h3>
        <p>
          Code splitting transforms a monolithic bundle into multiple chunks:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Entry Chunk:</strong> Contains application entry point and critical dependencies. Loaded 
            immediately.
          </li>
          <li>
            <strong>Vendor Chunk:</strong> Contains third-party libraries that change infrequently. Cached 
            separately from application code.
          </li>
          <li>
            <strong>Route Chunks:</strong> Each route becomes a separate chunk. Loaded on navigation.
          </li>
          <li>
            <strong>Component Chunks:</strong> Heavy components (editors, charts) loaded on demand.
          </li>
        </ul>
        <p>
          The goal is to minimize the entry chunk while ensuring smooth user experience during navigation.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>

        <h3>Optimization Techniques Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Technique</th>
                <th className="p-3 text-left">Effort</th>
                <th className="p-3 text-left">Impact</th>
                <th className="p-3 text-left">Risk</th>
                <th className="p-3 text-left">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">Replace Heavy Libraries</td>
                <td className="p-3">Medium</td>
                <td className="p-3">High (50-80% reduction)</td>
                <td className="p-3">Low</td>
                <td className="p-3">Large third-party dependencies</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Tree Shaking</td>
                <td className="p-3">Low</td>
                <td className="p-3">High (60-90% per library)</td>
                <td className="p-3">Low</td>
                <td className="p-3">ES module libraries</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Code Splitting</td>
                <td className="p-3">Medium</td>
                <td className="p-3">High (70-85% initial load)</td>
                <td className="p-3">Medium</td>
                <td className="p-3">Multi-page applications</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Use Native APIs</td>
                <td className="p-3">Low-Medium</td>
                <td className="p-3">Medium (10-30 KB each)</td>
                <td className="p-3">Low</td>
                <td className="p-3">Utility functions</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Remove Unused Dependencies</td>
                <td className="p-3">Low</td>
                <td className="p-3">Variable</td>
                <td className="p-3">Low</td>
                <td className="p-3">All projects</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">CDN Loading</td>
                <td className="p-3">Low</td>
                <td className="p-3">Medium (cache benefits)</td>
                <td className="p-3">Medium</td>
                <td className="p-3">Common libraries (React, lodash)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>When Optimization Isn&apos;t Worth It</h3>
        <ul className="space-y-2">
          <li>
            <strong>Small Applications:</strong> If your total bundle is already &lt;200 KB, aggressive 
            optimization may not be worth the engineering time.
          </li>
          <li>
            <strong>Internal Tools:</strong> For internal dashboards used on corporate networks, load time 
            may not impact business metrics significantly.
          </li>
          <li>
            <strong>Early Stage Products:</strong> In the validation phase, development speed often matters 
            more than optimal performance.
          </li>
          <li>
            <strong>Diminishing Returns:</strong> Going from 2 MB to 500 KB has huge impact. Going from 500 KB 
            to 400 KB may not be noticeable to users.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/bundle-size-analyzer.svg"
          alt="Bundle analyzer treemap showing visual breakdown of modules by size with React, lodash, app code, router, and utilities"
          caption="Bundle analyzer visualization: identify largest modules for targeted optimization"
        />

        <h3>Measure Before Optimizing</h3>
        <p>
          Never optimize blindly. Always start with measurement:
        </p>
        <ul className="space-y-1">
          <li>• Run webpack-bundle-analyzer or source-map-explorer</li>
          <li>• Identify the top 5 largest modules</li>
          <li>• Check for duplicate dependencies with <code>pnpm dedupe</code> or <code>yarn why</code></li>
          <li>• Document baseline metrics before making changes</li>
        </ul>

        <h3>Set Performance Budgets</h3>
        <p>
          Define hard limits for bundle sizes and enforce them in CI/CD:
        </p>
        <ul className="space-y-1">
          <li>• Initial JavaScript: &lt;200 KB uncompressed</li>
          <li>• Total JavaScript: &lt;500 KB uncompressed</li>
          <li>• Largest chunk: &lt;150 KB uncompressed</li>
          <li>• Use size-limit, bundlesize, or webpack performance hints</li>
        </ul>

        <h3>Regular Dependency Audits</h3>
        <p>
          Schedule quarterly reviews of dependencies:
        </p>
        <ul className="space-y-1">
          <li>• Remove unused dependencies</li>
          <li>• Update to newer, smaller versions</li>
          <li>• Replace heavy libraries with lighter alternatives</li>
          <li>• Check for tree-shaking support</li>
        </ul>

        <h3>Use Production Builds for Testing</h3>
        <p>
          Always analyze production builds, not development builds:
        </p>
        <ul className="space-y-1">
          <li>• Development builds include debug code and source maps</li>
          <li>• Production builds have minification and tree shaking</li>
          <li>• Test with compression enabled (gzip/Brotli)</li>
        </ul>

        <h3>Monitor in Production</h3>
        <p>
          Use Real User Monitoring (RUM) to track actual bundle performance:
        </p>
        <ul className="space-y-1">
          <li>• Track JavaScript download time by connection type</li>
          <li>• Monitor parse/execute time via Performance API</li>
          <li>• Set up alerts for bundle size regressions</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3>Not Analyzing the Bundle</h3>
        <p>
          Optimizing without understanding bundle composition leads to wasted effort. You might spend hours 
          optimizing application code when a single library replacement would save 10x more.
        </p>
        <p>
          <strong>Solution:</strong> Always run bundle analysis first. Focus optimization efforts on the 
          largest contributors.
        </p>

        <h3>Ignoring Transitive Dependencies</h3>
        <p>
          A small library might pull in large transitive dependencies. A 5 KB library could indirectly add 
          100 KB through its dependencies.
        </p>
        <p>
          <strong>Solution:</strong> Use tools like <code>npm ls</code>, <code>yarn why</code>, or 
          bundle analyzers to see the full dependency tree.
        </p>

        <h3>Over-Splitting Chunks</h3>
        <p>
          Creating too many tiny chunks introduces HTTP request overhead and can hurt caching. Each chunk 
          requires a separate request, and many small files may be evicted from cache more aggressively.
        </p>
        <p>
          <strong>Solution:</strong> Aim for 5-15 chunks total. Group related code into logical chunks of 
          50-150 KB each.
        </p>

        <h3>Not Testing on Slow Networks</h3>
        <p>
          Optimizations that look good on broadband may not help users on 3G. A 300 KB bundle loads instantly 
          on fiber but takes 2+ seconds on 3G.
        </p>
        <p>
          <strong>Solution:</strong> Test with Chrome DevTools Network throttling (Slow 3G preset). Use 
          WebPageTest with real mobile devices.
        </p>

        <h3>Forgetting About Compression</h3>
        <p>
          Optimizing uncompressed size without considering compression can lead to suboptimal decisions. 
          Some code patterns compress better than others.
        </p>
        <p>
          <strong>Solution:</strong> Always check both compressed and uncompressed sizes. Use Brotli for 
          static assets.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Site: 2 MB to 400 KB</h3>
        <p>
          An e-commerce site had a 2 MB initial JavaScript bundle. Analysis revealed:
        </p>
        <ul className="space-y-1">
          <li>• moment.js: 300 KB (replaced with date-fns: 15 KB)</li>
          <li>• lodash: 70 KB (replaced with lodash-es: 8 KB)</li>
          <li>• Unused UI components: 200 KB (removed via tree shaking)</li>
          <li>• No code splitting: 1400 KB (implemented route splitting: 350 KB initial)</li>
        </ul>
        <p>
          Results: 2 MB → 400 KB initial load (80% reduction). Mobile conversion rate increased 22%.
        </p>

        <h3>SaaS Dashboard: Vendor Optimization</h3>
        <p>
          A B2B SaaS dashboard&apos;s vendor bundle was 800 KB. Optimization steps:
        </p>
        <ul className="space-y-1">
          <li>• Separated vendor chunk for independent caching</li>
          <li>• Replaced chart.js (200 KB) with lightweight-charts (40 KB)</li>
          <li>• Lazy-loaded admin features (150 KB) for non-admin users</li>
        </ul>
        <p>
          Results: Vendor bundle 800 KB → 300 KB. Time to Interactive improved from 6.2s to 2.8s on 3G.
        </p>

        <h3>Content Site: Native API Migration</h3>
        <p>
          A content publishing site replaced utility libraries with native APIs:
        </p>
        <ul className="space-y-1">
          <li>• numeral.js → Intl.NumberFormat (30 KB saved)</li>
          <li>• uuid → crypto.randomUUID() (12 KB saved)</li>
          <li>• querystring → URLSearchParams (8 KB saved)</li>
          <li>• object.assign → native spread syntax (5 KB saved)</li>
        </ul>
        <p>
          Results: 55 KB reduction with zero dependencies. Improved long-term maintainability.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: How would you approach reducing a 3 MB JavaScript bundle?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              I would follow a systematic approach:
            </p>
            <ol className="space-y-2">
              <li>
                <strong>Measure:</strong> Run webpack-bundle-analyzer to understand bundle composition. 
                Identify the top 5 largest modules.
              </li>
              <li>
                <strong>Dependency Audit:</strong> Check for heavy libraries (moment.js, full lodash, 
                chart libraries). Replace with lighter alternatives (date-fns, lodash-es, lightweight charts).
              </li>
              <li>
                <strong>Tree Shaking:</strong> Ensure ES module imports and sideEffects: false configuration. 
                Verify unused exports are eliminated.
              </li>
              <li>
                <strong>Code Splitting:</strong> Implement route-based splitting. Each page should be its 
                own chunk. Lazy-load heavy components.
              </li>
              <li>
                <strong>Verify:</strong> Re-run analysis to confirm improvements. Set performance budgets 
                to prevent regression.
              </li>
            </ol>
            <p className="mt-3">
              Typical result: 3 MB → 500-700 KB (75-85% reduction).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What native browser APIs can replace common utility libraries?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Several native APIs can replace utility libraries:
            </p>
            <ul className="space-y-1">
              <li>• <strong>Intl.NumberFormat:</strong> Replaces numeral.js for number formatting</li>
              <li>• <strong>Intl.DateTimeFormat:</strong> Replaces moment.js for date formatting</li>
              <li>• <strong>crypto.randomUUID():</strong> Replaces uuid package</li>
              <li>• <strong>URLSearchParams:</strong> Replaces querystring library</li>
              <li>• <strong>Object.groupBy():</strong> Replaces lodash groupBy (newer browsers)</li>
              <li>• <strong>structuredClone():</strong> Replaces lodash cloneDeep</li>
              <li>• <strong>Array methods:</strong> map, filter, reduce, find, some, every replace many lodash utilities</li>
            </ul>
            <p className="mt-3">
              These provide zero-bundle-size alternatives with good browser support.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you prevent bundle size regression over time?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              I would implement multiple safeguards:
            </p>
            <ul className="space-y-1">
              <li>• <strong>Performance Budgets in CI/CD:</strong> Use size-limit or bundlesize to fail 
              builds when bundles exceed thresholds.</li>
              <li>• <strong>PR Comments:</strong> Configure size-limit-action to post bundle size changes 
              on pull requests.</li>
              <li>• <strong>Regular Audits:</strong> Schedule quarterly dependency reviews to remove unused 
              packages and check for lighter alternatives.</li>
              <li>• <strong>Monitoring:</strong> Track bundle sizes in production with RUM. Alert on 
              significant increases.</li>
              <li>• <strong>Documentation:</strong> Document approved libraries and size guidelines for 
              the team.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What is the difference between compressed and uncompressed bundle size?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              <strong>Uncompressed size</strong> is the raw JavaScript file size. This affects:
            </p>
            <ul className="space-y-1">
              <li>• Parse time (browser must parse every byte)</li>
              <li>• Compile time (JavaScript engine compiles to bytecode)</li>
              <li>• Memory usage (entire file lives in memory)</li>
            </ul>
            <p className="mb-3">
              <strong>Compressed size</strong> (gzip/Brotli) is the size transferred over the network. 
              This affects:
            </p>
            <ul className="space-y-1">
              <li>• Download time (network transfer)</li>
              <li>• CDN costs (based on bytes transferred)</li>
            </ul>
            <p className="mt-3">
              Both matter: a 500 KB file compressed to 150 KB still takes 500 KB of parse time. Optimizations 
              should target uncompressed size, while ensuring compression is enabled on the server.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: When would you load a library from CDN instead of bundling it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Loading from CDN makes sense when:
            </p>
            <ul className="space-y-1">
              <li>• <strong>Common Library:</strong> React, jQuery, or lodash that users may already have 
              cached from other sites.</li>
              <li>• <strong>Large Library:</strong> Libraries &gt;100 KB that don&apos;t change often.</li>
              <li>• <strong>Global Audience:</strong> CDNs have better geographic distribution than your 
              origin server.</li>
            </ul>
            <p className="mb-3">
              Trade-offs to consider:
            </p>
            <ul className="space-y-1">
              <li>• <strong>Privacy:</strong> CDN providers can track users across sites.</li>
              <li>• <strong>Control:</strong> You depend on CDN availability and versioning.</li>
              <li>• <strong>Security:</strong> Supply chain risk if CDN is compromised.</li>
              <li>• <strong>HTTP/2:</strong> With HTTP/2, bundling may be faster than multiple CDN requests.</li>
            </ul>
            <p className="mt-3">
              For most modern applications, bundling with proper caching is preferred over CDN loading.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How does tree shaking reduce bundle size?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Tree shaking eliminates unused exports from ES modules:
            </p>
            <ol className="space-y-2">
              <li>
                <strong>Static Analysis:</strong> Bundler parses import/export statements at build time.
              </li>
              <li>
                <strong>Dependency Graph:</strong> Builds a graph of which exports are actually used.
              </li>
              <li>
                <strong>Elimination:</strong> Unused exports are removed during minification.
              </li>
            </ol>
            <p className="mb-3">
              Example: Importing <code>{`{ map }`}</code> from lodash-es includes only the <code>map</code> 
              function (~2 KB) instead of the entire library (~70 KB).
            </p>
            <p className="mt-3">
              Requirements: ES module syntax, <code>sideEffects: false</code> in package.json, and production 
              build mode.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References</h2>
        <ul className="space-y-3">
          <li>
            <a 
              href="https://web.dev/reduce-javascript-payloads-with-code-splitting/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              web.dev — Reduce JavaScript Payloads
            </a>
            <p className="text-sm text-muted mt-1">
              Google&apos;s guide on code splitting and bundle optimization strategies.
            </p>
          </li>
          <li>
            <a 
              href="https://webpack.js.org/configuration/performance/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Webpack — Performance Configuration
            </a>
            <p className="text-sm text-muted mt-1">
              Official documentation on webpack performance hints and optimization settings.
            </p>
          </li>
          <li>
            <a 
              href="https://bundlephobia.com/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Bundlephobia
            </a>
            <p className="text-sm text-muted mt-1">
              Tool to check the size impact of npm packages before adding them.
            </p>
          </li>
          <li>
            <a 
              href="https://github.com/ai/size-limit" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              size-limit
            </a>
            <p className="text-sm text-muted mt-1">
              Tool for setting performance budgets and preventing bundle size regression.
            </p>
          </li>
          <li>
            <a 
              href="https://vitejs.dev/guide/build.html" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Vite — Building for Production
            </a>
            <p className="text-sm text-muted mt-1">
              Vite production build optimization and configuration.
            </p>
          </li>
          <li>
            <a 
              href="https://www.smashingmagazine.com/2021/05/reducing-bundle-size-webpack/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Smashing Magazine — Reducing Bundle Size
            </a>
            <p className="text-sm text-muted mt-1">
              Practical guide to webpack bundle optimization techniques.
            </p>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
