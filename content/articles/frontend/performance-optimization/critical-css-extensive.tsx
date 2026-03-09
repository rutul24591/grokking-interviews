"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { MermaidDiagram } from "@/components/articles/MermaidDiagram";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-critical-css-extensive",
  title: "Critical CSS",
  description: "Comprehensive guide to critical CSS extraction, render-blocking elimination, font loading strategies, and measuring performance impact for production applications.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "critical-css",
  version: "extensive",
  wordCount: 10500,
  readingTime: 42,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "critical-css", "render-blocking", "css-optimization", "web-vitals"],
  relatedTopics: ["code-splitting", "lazy-loading", "server-side-rendering"],
};

export default function CriticalCssExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Critical CSS</strong> refers to the minimum set of CSS rules required to render the above-the-fold
          content of a web page — the portion visible in the user's viewport without scrolling. The technique involves
          extracting these essential styles, inlining them directly in the HTML document's <code>{'<head>'}</code>,
          and deferring the loading of the complete stylesheet so it no longer blocks the browser's initial render.
        </p>
        <p>
          The concept emerged from a fundamental constraint in how browsers render web pages. When a browser encounters
          a <code>{'<link rel="stylesheet">'}</code> tag, it halts all rendering until that stylesheet is fully
          downloaded and parsed. This is intentional — rendering HTML without CSS would produce a Flash of Unstyled
          Content (FOUC), which is a poor user experience. However, this means a 200KB stylesheet on a slow 3G
          connection can delay the first paint by 2-4 seconds, even if only 15KB of those styles are relevant to
          what the user initially sees.
        </p>
        <p>
          Critical CSS was popularized around 2014 when Google began emphasizing render-blocking resources as a key
          performance bottleneck. Tools like Penthouse and the <code>critical</code> npm package emerged to automate
          the extraction process. Today, the technique is baked into frameworks — Next.js uses Critters internally
          for CSS optimization, and CSS-in-JS solutions like styled-components and Emotion perform automatic critical
          CSS extraction during server-side rendering. Understanding the underlying mechanics remains essential for
          system design interviews, performance audits, and debugging render performance issues.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Before diving into implementation, you need to understand the foundational concepts that make critical CSS
          both necessary and effective:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Render-Blocking Resources:</strong> Any resource that prevents the browser from rendering pixels
            to the screen. CSS is render-blocking by default. JavaScript is parser-blocking (and render-blocking unless
            marked <code>async</code> or <code>defer</code>). Critical CSS targets the CSS half of this equation.
          </li>
          <li>
            <strong>CSSOM (CSS Object Model):</strong> The browser builds the CSSOM from all stylesheets before it can
            construct the render tree. No CSSOM means no render tree, which means no paint. By inlining critical CSS,
            you provide the CSSOM data immediately — no network request required.
          </li>
          <li>
            <strong>Above-the-Fold:</strong> A term borrowed from newspaper publishing. In web context, it means the
            content visible in the viewport without scrolling. The exact pixel boundary varies by device — a phone at
            375x667 shows different content than a desktop at 1920x1080. Critical CSS tools test against multiple
            viewport sizes.
          </li>
          <li>
            <strong>TCP Slow Start:</strong> New TCP connections start with a small congestion window (typically 14KB).
            The first round-trip can only transfer about 14KB of data. If your inlined critical CSS plus HTML fits
            within this 14KB window, the browser can render the first paint in a single network round-trip — the
            theoretical minimum.
          </li>
          <li>
            <strong>First Contentful Paint (FCP):</strong> The moment the browser renders the first piece of DOM
            content (text, image, SVG, non-white canvas). Critical CSS directly reduces FCP by eliminating the
            stylesheet download from the critical path.
          </li>
          <li>
            <strong>Largest Contentful Paint (LCP):</strong> The moment the largest visible element finishes rendering.
            If the LCP element requires CSS for layout (which it almost always does), render-blocking CSS directly
            delays LCP. Critical CSS ensures LCP styles are available immediately.
          </li>
        </ul>
      </section>

      <section>
        <h2>How CSS Blocks Rendering</h2>
        <p>
          To understand why critical CSS is so impactful, you need to see exactly where CSS fits in the browser's
          rendering pipeline. The following diagram shows the critical rendering path — the sequence of steps between
          receiving the HTML response and painting pixels to the screen.
        </p>

        <MermaidDiagram
          chart={`sequenceDiagram
    participant S as Server
    participant B as Browser
    participant R as Render Engine

    S->>B: HTML Response
    B->>B: Parse HTML, build DOM
    B->>B: Discover <link> stylesheet
    B->>S: Request styles.css (BLOCKS RENDER)
    Note over B,R: ⏳ Browser waits...<br/>No pixels painted
    S-->>B: styles.css (200KB)
    B->>B: Parse CSS, build CSSOM
    B->>R: DOM + CSSOM → Render Tree
    R->>R: Layout → Paint → Composite
    Note over R: First paint! (delayed by CSS download)`}
          caption="Default behavior — CSS download blocks rendering entirely until the full stylesheet arrives"
        />

        <p>
          Now compare this with the critical CSS approach, where essential styles are inlined and the full stylesheet
          loads asynchronously:
        </p>

        <MermaidDiagram
          chart={`sequenceDiagram
    participant S as Server
    participant B as Browser
    participant R as Render Engine

    S->>B: HTML Response (with inlined critical CSS)
    B->>B: Parse HTML + inline CSS, build DOM + CSSOM
    B->>R: DOM + CSSOM → Render Tree
    R->>R: Layout → Paint → Composite
    Note over R: First paint! (immediate ⚡)
    B->>S: Async load full styles.css (non-blocking)
    S-->>B: styles.css (200KB)
    B->>B: Apply remaining styles
    Note over R: Below-fold content styled`}
          caption="With critical CSS — first paint happens immediately from inlined styles, full CSS loads in background"
        />

        <p>
          The difference is clear: in the default flow, the browser waits for the entire stylesheet before painting
          anything. With critical CSS, the browser paints immediately using the inlined styles while the full
          stylesheet downloads in parallel. On a 3G connection, this can save 1-3 seconds of blank screen time.
        </p>
      </section>

      <section>
        <h2>Extracting Critical CSS</h2>
        <p>
          The core challenge is determining which CSS rules are "critical" — needed for the above-the-fold content.
          There are two fundamental approaches: browser-based extraction (more accurate) and static analysis (faster).
        </p>

        <h3 className="mt-6 font-semibold">Browser-Based Extraction with critical</h3>
        <p>
          The <code>critical</code> npm package launches a headless Chromium instance, loads your page at specified
          viewport dimensions, and identifies which CSS rules are applied to visible elements. This is the most
          accurate approach because it accounts for JavaScript-rendered content, media queries, and dynamic layouts.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Build script using 'critical' ===
// Install: pnpm add -D critical

const critical = require('critical');
const fs = require('fs');
const path = require('path');

async function generateCriticalCSS() {
  // Process multiple pages
  const pages = [
    { url: 'https://mysite.com/', output: 'index.html' },
    { url: 'https://mysite.com/about', output: 'about.html' },
    { url: 'https://mysite.com/blog', output: 'blog.html' },
    { url: 'https://mysite.com/pricing', output: 'pricing.html' },
  ];

  for (const page of pages) {
    console.log(\`Processing: \${page.url}\`);

    const { html, css, uncritical } = await critical.generate({
      src: page.url,

      // Test multiple viewport sizes
      dimensions: [
        { width: 375, height: 667 },   // iPhone SE
        { width: 414, height: 896 },   // iPhone XR
        { width: 768, height: 1024 },  // iPad
        { width: 1280, height: 800 },  // Laptop
        { width: 1920, height: 1080 }, // Desktop
      ],

      // Inline critical CSS into the HTML
      inline: {
        strategy: 'media',    // Preserve media queries in inlined CSS
        preload: true,        // Add <link rel="preload"> for full CSS
        noscript: true,       // Add <noscript> fallback
      },

      // Extract and separate critical from non-critical
      extract: true,

      // Minify output
      minify: true,

      // Ignore certain CSS patterns
      ignore: {
        atrule: ['@font-face'], // Handle fonts separately
        decl: [/transition/, /animation/], // Skip animations
      },

      // Timeout for page rendering (ms)
      timeout: 30000,

      // Penthouse options (underlying engine)
      penthouse: {
        blockJSRequests: false, // Allow JS to run for SPA content
        puppeteer: {
          args: ['--no-sandbox'],
        },
      },
    });

    // Write the processed HTML with inlined critical CSS
    const outputPath = path.join('./dist', page.output);
    fs.writeFileSync(outputPath, html);

    console.log(\`  Critical CSS: \${css.length} bytes\`);
    console.log(\`  Non-critical CSS: \${uncritical.length} bytes\`);
  }
}

generateCriticalCSS().catch(console.error);`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Static Analysis with Critters</h3>
        <p>
          <strong>Critters</strong> takes a different approach. Instead of launching a browser, it parses the HTML
          output from your build and matches CSS selectors against the HTML elements present in the document.
          It inlines all matching rules as "critical." This is significantly faster (no browser overhead) but less
          accurate — it can't determine what's "above the fold" because it doesn't render the page.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Webpack integration with Critters ===
// Install: pnpm add -D critters-webpack-plugin
const Critters = require('critters-webpack-plugin');

module.exports = {
  plugins: [
    new Critters({
      // Strategy for loading non-critical CSS
      preload: 'swap',
      // Options: 'body' | 'media' | 'swap' | 'js' | 'js-lazy'
      //   'swap': <link rel="stylesheet" media="print" onload="this.media='all'">
      //   'media': preserves original media queries
      //   'js': uses JavaScript to load async CSS

      // Don't inline @font-face rules (handle separately)
      inlineFonts: false,

      // Don't remove original CSS file
      pruneSource: false,

      // Merge all <style> tags into one
      mergeStylesheets: true,

      // Additional CSS to always consider critical
      additionalStylesheets: ['./src/critical-overrides.css'],

      // Reduce inlined CSS size by compressing
      compress: true,

      // Log what was inlined
      logLevel: 'info',
    }),
  ],
};

// === Vite integration ===
// Install: pnpm add -D vite-plugin-critical
import criticalPlugin from 'vite-plugin-critical';

export default defineConfig({
  plugins: [
    criticalPlugin({
      criticalUrl: 'http://localhost:3000',
      criticalBase: './dist',
      criticalPages: [
        { uri: '/', template: 'index' },
        { uri: '/about', template: 'about' },
      ],
      criticalConfig: {
        dimensions: [
          { width: 375, height: 667 },
          { width: 1280, height: 800 },
        ],
      },
    }),
  ],
});`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Manual Critical CSS Extraction</h3>
        <p>
          For small or highly controlled pages (landing pages, marketing sites), you can manually extract critical
          CSS using Chrome DevTools Coverage tab:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Manual extraction workflow:
//
// 1. Open Chrome DevTools → Sources → Coverage (Cmd+Shift+P → "Coverage")
// 2. Click "Start instrumenting coverage and reload page"
// 3. DON'T scroll — only above-the-fold content should render
// 4. Check CSS files — red bars = unused rules, blue bars = used rules
// 5. Click on a CSS file to see per-line coverage
// 6. Copy the "used" rules into your critical CSS
//
// Alternatively, use the Coverage API programmatically:

const puppeteer = require('puppeteer');

async function extractCriticalCSS(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set viewport
  await page.setViewport({ width: 1280, height: 800 });

  // Start CSS coverage
  await page.coverage.startCSSCoverage();

  // Navigate to page
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Get coverage data
  const coverage = await page.coverage.stopCSSCoverage();

  let criticalCSS = '';
  for (const entry of coverage) {
    for (const range of entry.ranges) {
      criticalCSS += entry.text.slice(range.start, range.end);
    }
  }

  await browser.close();

  console.log(\`Critical CSS: \${criticalCSS.length} bytes\`);
  return criticalCSS;
}

extractCriticalCSS('https://mysite.com');`}</code>
        </pre>
      </section>

      <section>
        <h2>Async Loading Patterns</h2>
        <p>
          Once you've extracted and inlined critical CSS, the full stylesheet must load asynchronously to avoid
          blocking render. There are several patterns for this, each with different trade-offs.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- === Pattern 1: preload + onload (Recommended) === -->
<!-- Preload tells browser to start downloading immediately at high priority -->
<!-- onload switches it from preload to an applied stylesheet -->
<link rel="preload" href="/styles.css" as="style"
      onload="this.onload=null;this.rel='stylesheet'">
<noscript>
  <link rel="stylesheet" href="/styles.css">
</noscript>

<!-- === Pattern 2: print media trick === -->
<!-- media="print" makes it non-render-blocking -->
<!-- onload switches media to "all" to apply styles -->
<link rel="stylesheet" href="/styles.css"
      media="print" onload="this.media='all'">
<noscript>
  <link rel="stylesheet" href="/styles.css">
</noscript>

<!-- === Pattern 3: JavaScript-based loading === -->
<script>
  // Create link element after page renders
  function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  // Load after first paint
  if (window.requestAnimationFrame) {
    requestAnimationFrame(() => {
      setTimeout(loadCSS.bind(null, '/styles.css'), 0);
    });
  } else {
    window.addEventListener('load', () => {
      loadCSS('/styles.css');
    });
  }
</script>

<!-- === Pattern 4: Media query splitting === -->
<!-- Only matching media queries block render -->
<link rel="stylesheet" href="/base.css">
<link rel="stylesheet" href="/tablet.css"
      media="(min-width: 768px)">
<link rel="stylesheet" href="/desktop.css"
      media="(min-width: 1024px)">
<link rel="stylesheet" href="/print.css" media="print">
<!-- On a 375px phone, only base.css blocks rendering -->`}</code>
        </pre>
      </section>

      <section>
        <h2>Framework Integration</h2>

        <h3 className="mt-4 font-semibold">Next.js</h3>
        <p>
          Next.js provides several layers of automatic CSS optimization. Understanding what happens under the hood
          helps you make informed decisions about additional optimization.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Next.js CSS Optimization (Automatic) ===

// 1. CSS Module code-splitting: each page only loads its own CSS
// app/page.module.css → only loaded for the home page
// app/dashboard/page.module.css → only loaded for /dashboard

// 2. next/font: automatic font optimization
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',         // font-display: swap
  preload: true,            // <link rel="preload"> for font files
  adjustFontFallback: true, // Auto size-adjust for fallback font
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}

// 3. Enable experimental CSS optimization
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true, // Critters integration for critical CSS inlining
  },
};

// 4. Custom critical CSS for specific pages
// You can manually inline critical styles using <style> in head
import Head from 'next/head';

export default function LandingPage() {
  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{
          __html: \`
            .hero { min-height: 100vh; display: grid; place-items: center; }
            .hero h1 { font-size: clamp(2rem, 5vw, 4rem); }
            .cta { padding: 1rem 2rem; background: #3b82f6; color: white; }
          \`
        }} />
      </Head>
      <section className="hero">
        <h1>Welcome</h1>
        <button className="cta">Get Started</button>
      </section>
    </>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">CSS-in-JS Automatic Critical CSS</h3>
        <p>
          CSS-in-JS libraries like styled-components and Emotion have a unique advantage: during server-side
          rendering, they only serialize CSS for components that actually render. This is effectively automatic
          critical CSS — no above-the-fold detection needed because only rendered styles are included.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === styled-components SSR critical CSS ===
// The server collects styles from rendered components only
import { ServerStyleSheet } from 'styled-components';
import { renderToString } from 'react-dom/server';

function handleRequest(req, res) {
  const sheet = new ServerStyleSheet();

  try {
    // Collect styles from components that actually render
    const html = renderToString(
      sheet.collectStyles(<App />)
    );

    // Get only the CSS for rendered components
    const styleTags = sheet.getStyleTags();
    // Result: <style data-styled="abc123">
    //   .header-xyz { background: #1a1a2e; }
    //   .hero-abc { min-height: 60vh; }
    //   /* Only styles for components in the render tree */
    // </style>

    res.send(\`
      <!DOCTYPE html>
      <html>
        <head>
          \${styleTags}  <!-- Critical CSS automatically! -->
        </head>
        <body>
          <div id="root">\${html}</div>
        </body>
      </html>
    \`);
  } finally {
    sheet.seal();
  }
}

// === Emotion SSR critical CSS ===
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';

function handleRequest(req, res) {
  const cache = createCache({ key: 'css' });
  const { extractCriticalToChunks, constructStyleTagsFromChunks }
    = createEmotionServer(cache);

  const html = renderToString(
    <CacheProvider value={cache}>
      <App />
    </CacheProvider>
  );

  // Extract only the CSS used by rendered components
  const chunks = extractCriticalToChunks(html);
  const styles = constructStyleTagsFromChunks(chunks);

  res.send(\`
    <!DOCTYPE html>
    <html>
      <head>\${styles}</head>
      <body><div id="root">\${html}</div></body>
    </html>
  \`);
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Tailwind CSS Optimization</h3>
        <p>
          Tailwind CSS uses a content-based purging approach that removes unused utility classes at build time. This
          dramatically reduces CSS file size (from ~3MB to 10-30KB), but you can still benefit from critical CSS
          inlining for the remaining output.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// tailwind.config.js
module.exports = {
  // Tailwind scans these files and only generates classes that are used
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // Output CSS is already small (10-30KB), but can still benefit
  // from critical CSS inlining for the above-the-fold subset
};

// === PostCSS pipeline with critical CSS ===
// postcss.config.js
module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'cssnano': {
      preset: ['default', {
        // Aggressive minification for production
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
      }],
    },
  },
};

// After Tailwind purging:
// - Full CSS: ~25KB (compressed ~6KB)
// - Critical CSS: ~8KB (compressed ~2KB)
// - Combined with inlining, first paint needs only ~2KB of CSS`}</code>
        </pre>
      </section>

      <section>
        <h2>Font Loading Strategies</h2>
        <p>
          Web fonts are intimately connected with critical CSS. Even with perfectly inlined critical CSS, a slow
          font download can make text invisible (FOIT — Flash of Invisible Text) or cause jarring layout shifts
          when the font swaps in (FOUT — Flash of Unstyled Text). A complete critical CSS strategy must address
          font loading.
        </p>

        <MermaidDiagram
          chart={`flowchart TD
    A[Browser encounters @font-face] --> B{Font cached?}
    B -->|Yes| C[Apply font immediately]
    B -->|No| D[Start font download]
    D --> E{font-display value?}
    E -->|auto/block| F[FOIT: Hide text up to 3s]
    E -->|swap| G[FOUT: Show fallback immediately]
    E -->|fallback| H[100ms invisible then fallback]
    E -->|optional| I[Use font only if cached]
    F --> J{Font loaded in time?}
    J -->|Yes| K[Swap to custom font]
    J -->|No| L[Show fallback font]
    G --> M[Swap when font arrives]
    H --> N{Font loaded within 3s?}
    N -->|Yes| O[Swap to custom font]
    N -->|No| P[Keep fallback for this page load]
    I --> Q{Font in cache?}
    Q -->|Yes| R[Use custom font]
    Q -->|No| S[Use fallback forever for this load]`}
          caption="font-display behavior — how different values handle the period between request and font arrival"
        />

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`/* === Font-display strategies === */

/* SWAP: Best for body text — always show content immediately */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-display: swap;
  font-weight: 100 900;
}

/* OPTIONAL: Best for non-essential display fonts */
/* Uses font only if already cached — zero layout shift on first visit */
@font-face {
  font-family: 'DisplayFont';
  src: url('/fonts/display.woff2') format('woff2');
  font-display: optional;
}

/* FALLBACK: Compromise — brief invisible period, then fallback */
@font-face {
  font-family: 'HeadingFont';
  src: url('/fonts/heading.woff2') format('woff2');
  font-display: fallback;
}

/* === Size-adjusted fallback to minimize layout shift === */
/* When the custom font swaps in, text reflows because fonts have
   different metrics. Size-adjust compensates for this. */

@font-face {
  font-family: 'Inter-Fallback';
  src: local('Arial');
  size-adjust: 107.64%;
  ascent-override: 90.49%;
  descent-override: 22.48%;
  line-gap-override: 0%;
}

body {
  /* Browser uses Inter-Fallback until Inter loads */
  /* size-adjust makes them take up nearly identical space */
  font-family: 'Inter', 'Inter-Fallback', system-ui, sans-serif;
}

/* === Self-host and subset fonts for performance === */
/* Instead of loading all 900+ characters, subset to what you need */

@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-latin.woff2') format('woff2');
  font-display: swap;
  /* Only include Latin characters — reduces file from 300KB to 20KB */
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC,
                 U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
                 U+2000-206F, U+2074, U+20AC, U+2122, U+2191,
                 U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}`}</code>
        </pre>

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- === Preload critical fonts in HTML head === -->
<!-- Place BEFORE the <style> tag so the browser discovers them early -->
<head>
  <!-- Preload the most important font file -->
  <link rel="preload" href="/fonts/inter-latin.woff2"
        as="font" type="font/woff2" crossorigin>

  <!-- Critical CSS (includes @font-face with font-display: swap) -->
  <style>
    @font-face {
      font-family: 'Inter';
      src: url('/fonts/inter-latin.woff2') format('woff2');
      font-display: swap;
    }
    body { font-family: 'Inter', system-ui, sans-serif; }
    /* ... rest of critical CSS ... */
  </style>

  <!-- Full stylesheet async -->
  <link rel="preload" href="/styles.css" as="style"
        onload="this.onload=null;this.rel='stylesheet'">
</head>

<!-- === Next.js next/font (automatic optimization) === -->
<!--
  next/font automatically:
  1. Self-hosts Google Fonts (no external requests)
  2. Applies font-display: swap
  3. Generates <link rel="preload"> for font files
  4. Creates size-adjusted fallback fonts
  5. Subsets fonts to only used character ranges

  Result: zero layout shift, no external font requests,
  font available in first paint
-->`}</code>
        </pre>
      </section>

      <section>
        <h2>Advanced Patterns</h2>

        <h3 className="mt-4 font-semibold">Cookie-Based Critical CSS</h3>
        <p>
          Inlined CSS cannot be cached by the browser — it's re-downloaded with every HTML page. For sites with
          many repeat visitors, this is wasteful. A cookie-based approach inlines critical CSS on the first visit
          and uses the cached external stylesheet on subsequent visits.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Express middleware for cookie-based critical CSS
function criticalCSSMiddleware(req, res, next) {
  const hasVisitedBefore = req.cookies['css-cached'];

  if (hasVisitedBefore) {
    // Repeat visitor: external stylesheet is cached
    // Use normal <link> tag (will be served from browser cache)
    res.locals.cssStrategy = 'external';
  } else {
    // First visitor: inline critical CSS, async-load full CSS
    res.locals.cssStrategy = 'inline';

    // Set cookie so next visit uses cached stylesheet
    // Max-age matches the stylesheet's cache duration
    res.cookie('css-cached', '1', {
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  next();
}

// In your template/rendering:
function renderHead(cssStrategy) {
  if (cssStrategy === 'inline') {
    return \`
      <style>\${criticalCSS}</style>
      <link rel="preload" href="/styles.css" as="style"
            onload="this.onload=null;this.rel='stylesheet'">
      <noscript><link rel="stylesheet" href="/styles.css"></noscript>
    \`;
  }

  // Cached visitor — normal stylesheet link
  return '<link rel="stylesheet" href="/styles.css">';
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Per-Route Critical CSS</h3>
        <p>
          Different pages have different above-the-fold content. A homepage hero section requires different critical
          CSS than a dashboard data table. Generating per-route critical CSS maximizes efficiency.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Build script: generate critical CSS per route
const critical = require('critical');
const fs = require('fs');

const routes = [
  { path: '/', name: 'home' },
  { path: '/pricing', name: 'pricing' },
  { path: '/blog', name: 'blog' },
  { path: '/dashboard', name: 'dashboard' },
  { path: '/login', name: 'login' },
];

async function generatePerRoute() {
  const criticalCSSMap = {};

  for (const route of routes) {
    const { css } = await critical.generate({
      src: \`http://localhost:3000\${route.path}\`,
      dimensions: [
        { width: 375, height: 667 },
        { width: 1280, height: 800 },
      ],
      minify: true,
    });

    criticalCSSMap[route.name] = css;
    console.log(\`\${route.name}: \${css.length} bytes\`);
  }

  // Write map for server to use at runtime
  fs.writeFileSync(
    './dist/critical-css-map.json',
    JSON.stringify(criticalCSSMap)
  );
}

// Server reads the map and injects per-route critical CSS
const criticalCSSMap = require('./dist/critical-css-map.json');

app.get('*', (req, res) => {
  const routeName = mapPathToRoute(req.path);
  const criticalCSS = criticalCSSMap[routeName] || criticalCSSMap['home'];

  res.send(renderHTML({ criticalCSS, route: req.path }));
});`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Streaming Critical CSS with React 18</h3>
        <p>
          React 18's streaming SSR can send critical CSS incrementally as each Suspense boundary resolves,
          combining critical CSS with progressive rendering.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// React 18 streaming SSR with progressive CSS delivery
import { renderToPipeableStream } from 'react-dom/server';

app.get('*', (req, res) => {
  // Base critical CSS sent in the shell
  const shellCSS = \`
    body { margin: 0; font-family: system-ui, sans-serif; }
    .header { background: #1a1a2e; color: white; padding: 1rem; }
    .loading { display: flex; justify-content: center; padding: 2rem; }
  \`;

  const { pipe } = renderToPipeableStream(
    <html>
      <head>
        <style dangerouslySetInnerHTML={{ __html: shellCSS }} />
      </head>
      <body>
        <Header />
        {/* Each Suspense boundary can include its own CSS */}
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <DashboardContent />
          {/* When this resolves, React streams replacement HTML
              which can include additional <style> tags */}
        </Suspense>
      </body>
    </html>,
    {
      bootstrapScripts: ['/main.js'],
      onShellReady() {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        pipe(res);
        // Shell HTML + critical CSS sent immediately
        // Suspense content streams in as it resolves
      },
    }
  );
});`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Service Worker CSS Caching</h3>
        <p>
          Use a service worker to cache the full stylesheet after the first visit, ensuring instant CSS delivery
          on subsequent navigations — even when offline.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// service-worker.js
const CSS_CACHE = 'css-v1';
const CSS_FILES = ['/styles.css', '/fonts/inter-latin.woff2'];

// Pre-cache CSS during service worker install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CSS_CACHE).then((cache) => cache.addAll(CSS_FILES))
  );
});

// Serve CSS from cache, falling back to network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.endsWith('.css') || url.pathname.endsWith('.woff2')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;

        return fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CSS_CACHE).then((cache) => {
            cache.put(event.request, clone);
          });
          return response;
        });
      })
    );
  }
});`}</code>
        </pre>
      </section>

      <section>
        <h2>Measuring Impact</h2>
        <p>
          Critical CSS optimization should always be validated with measurements. Here are the key metrics to track
          and realistic improvements you can expect:
        </p>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Metric</th>
              <th className="p-3 text-left">Without Critical CSS</th>
              <th className="p-3 text-left">With Critical CSS</th>
              <th className="p-3 text-left">Improvement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>First Contentful Paint</strong></td>
              <td className="p-3">2.1s</td>
              <td className="p-3">0.8s</td>
              <td className="p-3">~60% faster</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Largest Contentful Paint</strong></td>
              <td className="p-3">3.2s</td>
              <td className="p-3">1.5s</td>
              <td className="p-3">~53% faster</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Render-Blocking Time</strong></td>
              <td className="p-3">1.8s</td>
              <td className="p-3">0ms</td>
              <td className="p-3">Eliminated</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Speed Index</strong></td>
              <td className="p-3">3.5s</td>
              <td className="p-3">1.2s</td>
              <td className="p-3">~66% faster</td>
            </tr>
            <tr>
              <td className="p-3"><strong>HTML Size (initial)</strong></td>
              <td className="p-3">15KB</td>
              <td className="p-3">28KB (with inlined CSS)</td>
              <td className="p-3">+13KB (trade-off)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Lighthouse Performance Score</strong></td>
              <td className="p-3">65-75</td>
              <td className="p-3">90-100</td>
              <td className="p-3">+20-30 points</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4">
          <em>Note: These numbers are based on typical results for a content-heavy site tested on simulated 3G
          (1.6Mbps, 150ms RTT). Results vary significantly by page size, CSS complexity, and network conditions.
          Always measure your own site.</em>
        </p>

        <h3 className="mt-6 font-semibold">Measurement Tools and Techniques</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Lighthouse CLI for automated auditing ===
// Install: pnpm add -g lighthouse
// Run: lighthouse https://mysite.com --output=json --output-path=report.json

// Key audits to check:
// - "render-blocking-resources" — should show 0 blocking CSS
// - "first-contentful-paint" — target < 1.8s
// - "largest-contentful-paint" — target < 2.5s
// - "unused-css-rules" — percentage of CSS that's unused

// === WebPageTest for real-device testing ===
// https://webpagetest.org
// - Run tests from different locations and devices
// - Filmstrip view shows exactly when content appears
// - Waterfall chart shows CSS blocking behavior
// - Compare before/after with visual regression

// === Performance Observer API for real user monitoring ===
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(\`\${entry.name}: \${entry.startTime}ms\`);

    // Send to analytics
    sendToAnalytics({
      metric: entry.name,
      value: entry.startTime,
      page: window.location.pathname,
    });
  }
});

// Monitor paint timings
observer.observe({ type: 'paint', buffered: true });
// Logs: "first-contentful-paint: 823ms"

// Monitor LCP
observer.observe({ type: 'largest-contentful-paint', buffered: true });
// Logs: "largest-contentful-paint: 1450ms"

// === Chrome DevTools Performance Panel ===
// 1. Open DevTools → Performance
// 2. Enable "Screenshots" and "Web Vitals"
// 3. Set CPU throttling to 4x and Network to "Slow 3G"
// 4. Click Record → Reload page → Stop
// 5. Look at the "Timings" row for FCP and LCP markers
// 6. In the "Network" section, verify CSS is not in the
//    critical path (should load after first paint)`}</code>
        </pre>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Inlining too much CSS:</strong> The entire point of critical CSS is to inline only what's
            needed for the first viewport. If you inline 80KB of CSS, you've traded one problem (render-blocking
            download) for another (massive HTML document). Target 14KB or less to fit within the first TCP round-trip.
            Anything over 30KB is likely over-inlined.
          </li>
          <li>
            <strong>Missing below-the-fold styles:</strong> If the async stylesheet fails to load (network error,
            CDN outage) or loads very late, content below the fold appears completely unstyled. Always include a
            <code>{'<noscript>'}</code> fallback and implement retry logic for the async CSS load.
          </li>
          <li>
            <strong>Flash of Unstyled Content (FOUC):</strong> If critical CSS extraction misses styles for visible
            elements (often due to JavaScript-rendered content not present during extraction), users see a brief flash
            of unstyled content before the full stylesheet applies. Test extraction with real content and all viewport
            sizes.
          </li>
          <li>
            <strong>Dynamic content not covered:</strong> Critical CSS tools extract styles based on a snapshot of
            the page. If above-the-fold content varies (logged-in vs logged-out, A/B tests, personalized content),
            a single extraction may miss variants. Generate critical CSS for each significant layout variation.
          </li>
          <li>
            <strong>CSS specificity conflicts:</strong> Inlined styles appear before the async-loaded stylesheet.
            If the full stylesheet uses higher specificity selectors or <code>!important</code> declarations that
            override inlined critical CSS, you get a visual flash when the full CSS applies. Keep your CSS specificity
            consistent.
          </li>
          <li>
            <strong>Duplicate CSS in the page:</strong> The inlined critical CSS is a subset of the full stylesheet.
            Users download these rules twice — once in the HTML, once in the async CSS file. For most sites, this
            10-30KB duplication is negligible compared to the render performance gain. For bandwidth-constrained
            environments, consider extracting critical CSS from the main stylesheet (removing inlined rules from
            the async file).
          </li>
          <li>
            <strong>Not handling fonts:</strong> Perfectly inlined critical CSS means nothing if the browser hides
            text for 3 seconds waiting for a font download. Always use <code>font-display: swap</code> or
            <code>font-display: optional</code>, preload critical fonts, and use size-adjusted fallback fonts.
          </li>
          <li>
            <strong>Build pipeline complexity:</strong> Adding critical CSS extraction to your build pipeline
            introduces complexity — headless browser dependencies, increased build time, and another potential
            failure point. Evaluate whether your framework already handles this (Next.js, Gatsby) before adding
            custom tooling.
          </li>
          <li>
            <strong>Ignoring HTTP/2 Server Push:</strong> With HTTP/2, you can push the CSS file alongside the
            HTML response, eliminating the round-trip delay without inlining. However, Server Push has been deprecated
            in Chrome (as of Chrome 106) due to low adoption and complexity. Stick with preload + inline.
          </li>
          <li>
            <strong>Third-party CSS blocking render:</strong> Even if your CSS is optimized, third-party stylesheets
            (analytics, widgets, consent banners) can still block rendering if they use synchronous
            <code>{'<link>'}</code> tags. Audit all external CSS and defer non-critical third-party styles.
          </li>
        </ul>
      </section>

      <section>
        <h2>Best Practices Summary</h2>
        <ol className="space-y-3">
          <li>
            <strong>Inline critical CSS in the HTML head:</strong> Extract the minimum CSS needed for above-the-fold
            content and place it in a <code>{'<style>'}</code> tag. Keep it under 14KB (compressed) to fit within
            the first TCP round-trip.
          </li>
          <li>
            <strong>Async-load the full stylesheet:</strong> Use <code>{'<link rel="preload" as="style">'}</code>
            with an <code>onload</code> handler to load remaining CSS without blocking render. Always include a
            <code>{'<noscript>'}</code> fallback.
          </li>
          <li>
            <strong>Automate extraction in your build pipeline:</strong> Use <code>critical</code> (browser-based, more
            accurate) or <code>critters</code> (static analysis, faster) to extract critical CSS during the build.
            Don't maintain critical CSS manually — it will drift out of sync.
          </li>
          <li>
            <strong>Use framework-level optimizations first:</strong> Next.js, Gatsby, and other frameworks have
            built-in CSS optimization. Enable experimental features (like <code>optimizeCss</code> in Next.js) before
            adding custom tooling.
          </li>
          <li>
            <strong>Optimize font loading:</strong> Use <code>font-display: swap</code> for body text,
            <code>font-display: optional</code> for decorative fonts. Preload critical font files. Create
            size-adjusted fallback fonts to minimize layout shift.
          </li>
          <li>
            <strong>Split CSS by media query:</strong> Separate print, tablet, and desktop CSS into distinct files with
            appropriate <code>media</code> attributes. Only matching media queries block rendering.
          </li>
          <li>
            <strong>Remove unused CSS:</strong> Use PurgeCSS, Tailwind's content-based purging, or Chrome Coverage
            to identify and remove CSS that's never used. Less CSS means less to extract and inline.
          </li>
          <li>
            <strong>Generate per-route critical CSS:</strong> Different pages have different above-the-fold content.
            Extract critical CSS per route for maximum efficiency.
          </li>
          <li>
            <strong>Measure before and after:</strong> Use Lighthouse, WebPageTest, and real user monitoring to verify
            improvements. Track FCP, LCP, and Speed Index. Set performance budgets.
          </li>
          <li>
            <strong>Test on real devices and slow networks:</strong> Simulate 3G in DevTools. Test on mid-range phones.
            Critical CSS has the biggest impact on slow connections — that's exactly where you need to test.
          </li>
        </ol>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-3">
          <li>
            Critical CSS is the minimum CSS needed for above-the-fold content, inlined in the HTML
            <code>{'<head>'}</code> to eliminate CSS as a render-blocking resource. This directly improves FCP and
            LCP by letting the browser paint without waiting for external stylesheet downloads.
          </li>
          <li>
            Browsers block rendering on all synchronous <code>{'<link>'}</code> stylesheets by design (to prevent
            FOUC). Critical CSS breaks this bottleneck by providing essential styles inline while loading the full
            stylesheet asynchronously via <code>{'<link rel="preload" as="style">'}</code>.
          </li>
          <li>
            The ideal critical CSS size is under 14KB (compressed) to fit within the first TCP congestion window,
            enabling first paint in a single network round-trip from the server.
          </li>
          <li>
            There are two extraction approaches: browser-based tools (<code>critical</code>, <code>penthouse</code>)
            that render the page and identify visible styles (more accurate), and static analyzers
            (<code>critters</code>) that match CSS selectors against HTML elements (faster but less precise).
          </li>
          <li>
            CSS-in-JS libraries (styled-components, Emotion) provide automatic critical CSS during SSR — they only
            serialize CSS for components that actually render, which is inherently the critical CSS for that page.
          </li>
          <li>
            Font loading is a critical companion strategy — <code>font-display: swap</code> prevents invisible text,
            font preloading eliminates discovery delay, and <code>size-adjust</code> on fallback fonts minimizes
            Cumulative Layout Shift when the custom font swaps in.
          </li>
          <li>
            Media query splitting makes non-matching stylesheets non-render-blocking. A mobile user won't block on
            <code>{'media="(min-width: 1024px)"'}</code> desktop styles — the browser downloads them but at low priority.
          </li>
          <li>
            The main trade-off is that inlined CSS cannot be cached independently by the browser. For sites with high
            repeat-visitor rates, a cookie-based approach can inline critical CSS only on the first visit and rely on
            the cached external stylesheet for subsequent visits.
          </li>
          <li>
            Frameworks like Next.js handle much of this automatically — CSS module code-splitting per page, font
            optimization via <code>next/font</code>, and optional Critters integration for critical CSS inlining.
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://web.dev/articles/extract-critical-css" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Extract Critical CSS
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/defer-non-critical-css" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Defer Non-Critical CSS
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/font-display" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Controlling Font Performance with font-display
            </a>
          </li>
          <li>
            <a href="https://github.com/addyosmani/critical" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub — critical: Extract & Inline Critical-path CSS
            </a>
          </li>
          <li>
            <a href="https://github.com/GoogleChromeLabs/critters" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub — Critters: Inline Critical CSS Plugin
            </a>
          </li>
          <li>
            <a href="https://nextjs.org/docs/app/building-your-application/optimizing/fonts" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Next.js — Font Optimization
            </a>
          </li>
          <li>
            <a href="https://developer.chrome.com/docs/devtools/coverage" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Chrome DevTools — CSS Coverage
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
