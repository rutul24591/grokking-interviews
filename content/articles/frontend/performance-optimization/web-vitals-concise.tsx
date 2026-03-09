"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-web-vitals-concise",
  title: "Web Vitals (LCP, FID, CLS, TTFB, INP)",
  description: "Quick overview of Core Web Vitals and key performance metrics for frontend optimization.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "web-vitals",
  version: "concise",
  wordCount: 3000,
  readingTime: 12,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "web-vitals", "LCP", "CLS", "INP", "TTFB", "Core Web Vitals"],
  relatedTopics: ["image-optimization", "critical-css", "code-splitting"],
};

export default function WebVitalsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Web Vitals</strong> are a set of metrics defined by Google that quantify real-world user experience
          on the web. The subset called <strong>Core Web Vitals</strong> — currently LCP, INP, and CLS — directly
          affects Google search ranking and represents the three pillars of user experience: loading, interactivity,
          and visual stability.
        </p>
        <p>
          These metrics replaced subjective performance assessments with measurable, user-centric data. Instead of
          asking "is this page fast?", you measure exactly how long users wait to see content (LCP), how responsive
          the page feels when clicked (INP), and how much the layout jumps around during load (CLS).
        </p>
      </section>

      <section>
        <h2>The Core Web Vitals</h2>

        <h3 className="mt-4 font-semibold">LCP — Largest Contentful Paint</h3>
        <p>
          <strong>What:</strong> Time until the largest visible element (image, video, or text block) finishes
          rendering in the viewport.
        </p>
        <table className="w-full border-collapse mt-2 mb-4">
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Good</strong></td>
              <td className="p-3">≤ 2.5 seconds</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Needs Improvement</strong></td>
              <td className="p-3">2.5 – 4.0 seconds</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Poor</strong></td>
              <td className="p-3">&gt; 4.0 seconds</td>
            </tr>
          </tbody>
        </table>
        <p><strong>Common LCP elements:</strong> Hero images, video thumbnails, large text headings, banner images.</p>
        <p><strong>How to improve:</strong></p>
        <ul className="space-y-1">
          <li>Preload the LCP image with <code>fetchPriority="high"</code></li>
          <li>Use modern image formats (WebP/AVIF) and responsive srcset</li>
          <li>Eliminate render-blocking CSS and JS</li>
          <li>Use a CDN to reduce TTFB</li>
          <li>Don't lazy-load the LCP element</li>
        </ul>

        <h3 className="mt-6 font-semibold">INP — Interaction to Next Paint</h3>
        <p>
          <strong>What:</strong> The latency of the worst interaction (click, tap, keyboard) throughout the page's
          lifetime. Replaced FID (First Input Delay) in March 2024 as a Core Web Vital because INP measures
          <em>all</em> interactions, not just the first.
        </p>
        <table className="w-full border-collapse mt-2 mb-4">
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Good</strong></td>
              <td className="p-3">≤ 200 milliseconds</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Needs Improvement</strong></td>
              <td className="p-3">200 – 500 milliseconds</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Poor</strong></td>
              <td className="p-3">&gt; 500 milliseconds</td>
            </tr>
          </tbody>
        </table>
        <p><strong>How to improve:</strong></p>
        <ul className="space-y-1">
          <li>Break up long tasks (&gt;50ms) with <code>scheduler.yield()</code> or <code>setTimeout</code></li>
          <li>Use <code>startTransition</code> for non-urgent state updates</li>
          <li>Reduce JavaScript bundle size and execution time</li>
          <li>Move heavy computation to Web Workers</li>
          <li>Avoid forced synchronous layouts (reading layout, then writing, then reading again)</li>
        </ul>

        <h3 className="mt-6 font-semibold">CLS — Cumulative Layout Shift</h3>
        <p>
          <strong>What:</strong> The sum of all unexpected layout shift scores during the page's lifetime. A layout
          shift occurs when a visible element moves position between two frames without user interaction.
        </p>
        <table className="w-full border-collapse mt-2 mb-4">
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Good</strong></td>
              <td className="p-3">≤ 0.1</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Needs Improvement</strong></td>
              <td className="p-3">0.1 – 0.25</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Poor</strong></td>
              <td className="p-3">&gt; 0.25</td>
            </tr>
          </tbody>
        </table>
        <p><strong>Common CLS causes:</strong></p>
        <ul className="space-y-1">
          <li>Images without width/height attributes</li>
          <li>Ads, embeds, or iframes without reserved space</li>
          <li>Dynamically injected content (banners, cookie notices)</li>
          <li>Web fonts causing FOUT (Flash of Unstyled Text)</li>
          <li>Late-loading CSS that changes element sizes</li>
        </ul>
        <p className="mt-2"><strong>How to improve:</strong></p>
        <ul className="space-y-1">
          <li>Always set <code>width</code> and <code>height</code> on images and videos</li>
          <li>Use CSS <code>aspect-ratio</code> for responsive containers</li>
          <li>Reserve space for dynamic content with min-height</li>
          <li>Use <code>font-display: optional</code> or <code>font-display: swap</code> with size-adjust</li>
          <li>Transform animations instead of layout properties (top/left/width/height)</li>
        </ul>
      </section>

      <section>
        <h2>Additional Important Metrics</h2>

        <h3 className="mt-4 font-semibold">TTFB — Time to First Byte</h3>
        <p>
          Time from the browser's request until the first byte of the response arrives. Measures server
          responsiveness plus network latency. Target: <strong>≤ 800ms</strong>.
        </p>
        <p><strong>Improve with:</strong> CDN, server-side caching, faster backends, HTTP/2, edge computing.</p>

        <h3 className="mt-4 font-semibold">FCP — First Contentful Paint</h3>
        <p>
          Time until the first text or image is painted. Measures how quickly the user sees <em>something</em>.
          Target: <strong>≤ 1.8s</strong>.
        </p>

        <h3 className="mt-4 font-semibold">TBT — Total Blocking Time</h3>
        <p>
          Sum of all "blocking time" from long tasks (tasks &gt; 50ms) between FCP and TTI. A long task of 200ms
          contributes 150ms of blocking time. Target: <strong>≤ 200ms</strong>.
        </p>

        <h3 className="mt-4 font-semibold">TTI — Time to Interactive</h3>
        <p>
          Time until the page is fully interactive (responds to input within 50ms). No longer a Core Web Vital
          but still useful for diagnosing JavaScript-heavy pages.
        </p>
      </section>

      <section>
        <h2>Measuring Web Vitals</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === web-vitals library (Google's official package) ===
// pnpm add web-vitals
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,  // 'good' | 'needs-improvement' | 'poor'
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  });

  // Use sendBeacon for reliability (fires even during page unload)
  navigator.sendBeacon('/api/analytics/vitals', body);
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);

// === Chrome DevTools ===
// Performance tab → record → see LCP, CLS, INP annotations
// Lighthouse tab → run audit → see Core Web Vitals scores

// === Chrome UX Report (CrUX) ===
// Real user data from Chrome browsers (field data)
// Available via PageSpeed Insights, Search Console, BigQuery`}</code>
        </pre>
      </section>

      <section>
        <h2>Lab vs Field Data</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Lab Data</th>
              <th className="p-3 text-left">Field Data (RUM)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Source</strong></td>
              <td className="p-3">Lighthouse, DevTools, WebPageTest</td>
              <td className="p-3">CrUX, web-vitals library, RUM providers</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Environment</strong></td>
              <td className="p-3">Controlled (simulated device/network)</td>
              <td className="p-3">Real users, real devices, real networks</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Reproducible</strong></td>
              <td className="p-3">Yes (same conditions = same result)</td>
              <td className="p-3">No (varies by user, device, network)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>INP</strong></td>
              <td className="p-3">Not measurable (needs real interactions)</td>
              <td className="p-3">Measured from actual user clicks/taps</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Use for</strong></td>
              <td className="p-3">Debugging, CI/CD gates, development</td>
              <td className="p-3">SEO ranking, real-world impact, monitoring</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-2">
          <li>
            Core Web Vitals are three metrics: <strong>LCP</strong> (loading — ≤2.5s), <strong>INP</strong>
            (interactivity — ≤200ms), <strong>CLS</strong> (stability — ≤0.1). They directly affect Google
            search ranking.
          </li>
          <li>
            INP replaced FID in March 2024 because it measures the latency of <em>all</em> interactions, not just
            the first one. A page could pass FID but fail INP if later interactions are slow.
          </li>
          <li>
            LCP is usually an image — optimize with modern formats (AVIF/WebP), preload with <code>fetchPriority="high"</code>,
            and never lazy-load it.
          </li>
          <li>
            CLS is caused by missing dimensions on images, late-loaded content, and font swapping. Fix with explicit
            width/height, aspect-ratio, and <code>font-display: optional</code>.
          </li>
          <li>
            Lab data (Lighthouse) is for debugging; field data (CrUX/RUM) is what Google uses for ranking. Both
            are needed — lab for development, field for monitoring real users.
          </li>
          <li>
            INP improvement strategies: break long tasks with yield points, use <code>startTransition</code> for
            non-urgent updates, move computation to Web Workers, reduce JS bundle size.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
