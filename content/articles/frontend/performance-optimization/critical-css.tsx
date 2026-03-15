"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-critical-css-concise",
  title: "Critical CSS",
  description: "Quick overview of critical CSS extraction, inlining strategies, and eliminating render-blocking stylesheets for faster page loads.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "critical-css",
  version: "concise",
  wordCount: 2800,
  readingTime: 12,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "critical-css", "render-blocking", "css-optimization", "web-vitals"],
  relatedTopics: ["code-splitting", "lazy-loading", "server-side-rendering"],
};

export default function CriticalCssConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Critical CSS</strong> is the minimum set of CSS rules needed to render the above-the-fold content
          of a page. Instead of forcing the browser to download, parse, and apply your entire stylesheet before
          painting anything, you inline critical CSS directly in the HTML <code>{'<head>'}</code> and defer the rest.
          This eliminates CSS as a render-blocking resource, dramatically improving First Contentful Paint (FCP) and
          Largest Contentful Paint (LCP).
        </p>
        <p>
          By default, the browser treats every <code>{'<link rel="stylesheet">'}</code> as render-blocking — it won't
          paint any pixels until all linked stylesheets are downloaded and parsed. For a typical site with 100-300KB
          of CSS, this can add 500ms-2s to the initial render on slower connections. Critical CSS solves this by
          inlining the 10-30KB that matters for the first viewport and loading everything else asynchronously.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Render-Blocking CSS:</strong> Browsers halt rendering until all synchronous stylesheets in the
            <code>{'<head>'}</code> are fully loaded and parsed. This is by design — rendering without styles would
            cause a Flash of Unstyled Content (FOUC). Critical CSS breaks this bottleneck by inlining what's needed
            immediately and deferring the rest.
          </li>
          <li>
            <strong>Above-the-Fold Content:</strong> The portion of the page visible without scrolling. Critical CSS
            targets only the styles needed for this initial viewport. Since viewport sizes vary across devices, tools
            typically test against multiple resolutions (e.g., 1300x900 for desktop, 375x667 for mobile).
          </li>
          <li>
            <strong>CSS Critical Path:</strong> The sequence of steps the browser takes — download HTML, discover CSS
            links, download CSS, build CSSOM, combine with DOM to create the render tree, then paint. Inlining
            critical CSS removes the second network round-trip from this chain.
          </li>
          <li>
            <strong>Async CSS Loading:</strong> Non-critical CSS is loaded without blocking render using techniques
            like <code>{'<link rel="preload" as="style">'}</code> with an <code>onload</code> handler, or the
            print media trick (<code>{'media="print" onload="this.media=\'all\'"'}</code>).
          </li>
          <li>
            <strong>Font Loading:</strong> Web fonts are closely related to critical CSS — they can cause invisible
            text (FOIT) or unstyled text flashes (FOUT). The <code>font-display</code> CSS property and preloading
            font files are part of a complete critical CSS strategy.
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>

        <h3 className="mt-4 font-semibold">1. Inline Critical CSS in the HTML Head</h3>
        <p>
          The core pattern: extract the CSS needed for above-the-fold content and place it in a
          <code>{'<style>'}</code> tag in the document head. Then load the full stylesheet asynchronously.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!DOCTYPE html>
<html>
<head>
  <!-- Critical CSS inlined — no network request needed --&gt;
  <style>
    /* Only styles for above-the-fold content */
    body { margin: 0; font-family: system-ui, sans-serif; }
    .header { background: #1a1a2e; color: white; padding: 1rem; }
    .hero { display: flex; align-items: center; min-height: 60vh; }
    .hero h1 { font-size: 3rem; line-height: 1.2; }
    .nav { display: flex; gap: 1rem; list-style: none; }
    /* ... ~10-30KB of critical rules ... */
  </style>

  <!-- Full stylesheet loaded asynchronously --&gt;
  <link rel="preload" href="/styles.css" as="style"
        onload="this.onload=null;this.rel='stylesheet'">
  <noscript>
    <link rel="stylesheet" href="/styles.css">
  </noscript>
</head>
<body>
  <!-- Above-the-fold content renders immediately --&gt;
  <header class="header">
    <nav class="nav">...</nav>
  </header>
  <section class="hero">
    <h1>Welcome</h1>
  </section>
</body>
</html>`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">2. Extract Critical CSS with Build Tools</h3>
        <p>
          Manually identifying critical CSS is impractical. Use automated tools that render your page in a headless
          browser, determine which CSS rules apply to the visible viewport, and extract them.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Using the 'critical' npm package ===
// Install: pnpm add -D critical

const critical = require('critical');

async function generateCriticalCSS() {
  const { html, css } = await critical.generate({
    // Source HTML (local file or URL)
    src: 'https://mysite.com',
    // OR inline HTML:
    // html: '<html>...</html>',

    // Viewport dimensions to test
    dimensions: [
      { width: 375, height: 667 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1300, height: 900 },  // Desktop
    ],

    // Inline critical CSS into HTML output
    inline: true,

    // Async-load remaining CSS
    extract: true,

    // Minify the inlined CSS
    minify: true,
  });

  console.log('Critical CSS size:', css.length, 'bytes');
  // Typically 10-30KB depending on above-the-fold complexity
}

generateCriticalCSS();`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">3. Critters — Webpack/Framework Integration</h3>
        <p>
          <strong>Critters</strong> is a Webpack plugin (used by Next.js internally) that inlines critical CSS at
          build time without a headless browser. It parses the HTML and CSS statically, which is faster but less
          accurate than browser-based extraction.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Webpack with Critters plugin ===
// Install: pnpm add -D critters-webpack-plugin
const Critters = require('critters-webpack-plugin');

module.exports = {
  plugins: [
    new Critters({
      // Inline critical CSS from all stylesheets
      preload: 'swap',       // Use font-display: swap for fonts
      inlineFonts: false,    // Don't inline font files
      pruneSource: false,    // Keep original CSS file intact
      mergeStylesheets: true,
    }),
  ],
};

// === Next.js — Built-in support ===
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true, // Uses critters under the hood
  },
};

// Next.js also automatically:
// - Inlines critical CSS for Server Components
// - Code-splits CSS per page
// - Preloads fonts with next/font`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">4. Media Query Splitting</h3>
        <p>
          Split CSS into separate files per media query. Browsers download all linked stylesheets, but only
          render-block on stylesheets whose media query matches the current viewport.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Browser only blocks render on matching media queries --&gt;
<link rel="stylesheet" href="/base.css">
<link rel="stylesheet" href="/tablet.css" media="(min-width: 768px)">
<link rel="stylesheet" href="/desktop.css" media="(min-width: 1024px)">
<link rel="stylesheet" href="/print.css" media="print">

<!-- On mobile: only base.css blocks rendering --&gt;
<!-- tablet.css and desktop.css download but don't block paint --&gt;`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">5. Font Loading Optimization</h3>
        <p>
          Web fonts are tightly coupled with critical CSS. Without proper handling, fonts cause either invisible
          text (FOIT) or jarring text reflows (FOUT).
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`/* font-display controls browser behavior while font loads */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
  /* swap: show fallback immediately, swap when font loads (causes FOUT) */
  /* optional: use font only if cached, otherwise use fallback forever */
  /* fallback: brief invisible period, then fallback, then swap */
}

/* Preload critical fonts in HTML head */
/* <link rel="preload" href="/fonts/custom.woff2"
        as="font" type="font/woff2" crossorigin> */

/* Size-adjust to minimize layout shift during font swap */
@font-face {
  font-family: 'CustomFont-Fallback';
  src: local('Arial');
  size-adjust: 105%;
  ascent-override: 95%;
  descent-override: 22%;
  line-gap-override: 0%;
}

body {
  font-family: 'CustomFont', 'CustomFont-Fallback', sans-serif;
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Tools & Automation</h2>
        <ul className="space-y-2">
          <li>
            <strong>critical (npm):</strong> The most popular Node.js tool for critical CSS extraction. Uses Puppeteer
            to render pages and identify above-the-fold styles. Works with any HTML source.
          </li>
          <li>
            <strong>Penthouse:</strong> Another headless-browser-based extractor, focused on generating critical CSS
            from a URL. Lighter than <code>critical</code> but fewer options.
          </li>
          <li>
            <strong>Critters:</strong> Webpack plugin that extracts critical CSS statically (no browser). Faster but
            less accurate — may miss dynamically-rendered content. Used internally by Next.js.
          </li>
          <li>
            <strong>next/font:</strong> Next.js built-in font optimization that automatically generates
            <code>font-display: swap</code>, preloads font files, and creates size-adjusted fallbacks to eliminate
            layout shift.
          </li>
          <li>
            <strong>Chrome DevTools Coverage:</strong> The Coverage tab shows which CSS rules are actually used
            on a page. Red lines indicate unused CSS — candidates for deferral.
          </li>
          <li>
            <strong>PurgeCSS / UnCSS:</strong> Remove unused CSS entirely (different from critical CSS). They
            analyze your HTML/JSX and strip CSS selectors that don't match any elements. Tailwind CSS uses a
            similar content-based purging approach by default.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <li>
            <strong>Missing styles below the fold:</strong> If the async stylesheet fails to load or loads very late,
            below-the-fold content appears unstyled when the user scrolls. Always verify the full stylesheet loads
            reliably and add a <code>{'<noscript>'}</code> fallback.
          </li>
          <li>
            <strong>Overly large critical CSS:</strong> Inlining too much CSS defeats the purpose — it bloats the HTML
            document, which itself becomes slow to download. Keep inlined CSS under 30KB (ideally under 14KB to fit
            in the first TCP round-trip).
          </li>
          <li>
            <strong>Dynamic content mismatch:</strong> If above-the-fold content changes based on user state (logged-in
            header, personalized hero), statically extracted critical CSS may not cover all variations. Generate
            critical CSS for each significant layout variant.
          </li>
          <li>
            <strong>Caching conflicts:</strong> Inlined CSS can't be cached separately by the browser. On repeat
            visits, users re-download inlined CSS with every HTML page. For sites with high return-visitor rates,
            consider a cookie-based approach: inline on first visit, use cached external stylesheet on subsequent visits.
          </li>
          <li>
            <strong>CSS-in-JS false sense of security:</strong> Libraries like styled-components and Emotion
            extract only the CSS for rendered components during SSR, which is effectively automatic critical CSS.
            However, this only works with server-side rendering — client-rendered apps still need manual critical CSS.
          </li>
          <li>
            <strong>Forgetting about fonts:</strong> You can inline all critical CSS perfectly, but if a web font
            blocks text rendering for 3 seconds, the user still sees a blank page. Always pair critical CSS with
            <code>font-display: swap</code> or <code>font-display: optional</code>.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-2">
          <li>
            Critical CSS is the minimum CSS needed to render above-the-fold content, inlined directly in the HTML
            <code>{'<head>'}</code> to eliminate render-blocking stylesheet downloads.
          </li>
          <li>
            It directly improves FCP and LCP by removing CSS from the critical rendering path — the browser can paint
            immediately after parsing the HTML without waiting for external stylesheets.
          </li>
          <li>
            Tools like <code>critical</code> and <code>penthouse</code> use headless browsers to automatically extract
            above-the-fold CSS, while <code>critters</code> does it statically at build time for faster pipelines.
          </li>
          <li>
            The async loading pattern uses <code>{'<link rel="preload" as="style">'}</code> with an <code>onload</code>
            handler to load the full stylesheet without blocking render.
          </li>
          <li>
            Media query splitting makes non-matching stylesheets non-render-blocking — mobile users don't block on
            desktop CSS.
          </li>
          <li>
            Font loading is a critical companion concern — <code>font-display: swap</code> prevents invisible text,
            and <code>size-adjust</code> on fallback fonts minimizes layout shift during font swap.
          </li>
          <li>
            CSS-in-JS solutions like styled-components provide automatic critical CSS during SSR by only serializing
            styles for components that actually render on the server.
          </li>
          <li>
            The main trade-off is that inlined CSS can't be cached independently — for high-traffic sites with many
            repeat visitors, balance inline CSS with caching strategies.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
