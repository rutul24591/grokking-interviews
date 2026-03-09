"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { MermaidDiagram } from "@/components/articles/MermaidDiagram";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-performance-budgets-extensive",
  title: "Performance Budgets",
  description: "Comprehensive guide to performance budgets — types, strategies for setting thresholds, CI/CD enforcement, build tool integration, team culture, and real-world examples.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "performance-budgets",
  version: "extensive",
  wordCount: 10500,
  readingTime: 42,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "performance-budgets", "bundle-size", "CI/CD", "Lighthouse", "web-vitals"],
  relatedTopics: ["web-vitals", "bundle-size-optimization", "code-splitting"],
};

export default function PerformanceBudgetsExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          A <strong>performance budget</strong> is a quantifiable constraint on one or more performance metrics that a
          web application must not exceed. Like a financial budget that limits spending, a performance budget limits how
          much "performance cost" a team is allowed to incur — measured in kilobytes of JavaScript, milliseconds of load
          time, Lighthouse score points, or any other user-facing metric.
        </p>
        <p>
          The concept was popularized by performance engineers like Tim Kadlec and Steve Souders in the mid-2010s, but it
          became critical as web applications grew heavier. The median page weight crossed 2MB by 2020, and JavaScript
          bundles routinely shipped 500KB+ of compressed code. Without explicit limits, teams found that performance
          degraded imperceptibly with each sprint — a phenomenon known as <strong>performance regression creep</strong>.
        </p>
        <p>
          Performance budgets solve this by making the invisible visible. Instead of discovering six months later that
          the site is 40% slower, the team gets immediate feedback in CI when a single PR pushes any metric past its
          limit. This shifts performance from a reactive "fix it when users complain" approach to a proactive "prevent
          regressions before they ship" discipline.
        </p>
        <p>
          Critically, performance budgets are <strong>not aspirational targets</strong>. A target says "we'd like to get
          to 200KB." A budget says "the build fails at 201KB." This distinction matters because targets are routinely
          deprioritized under feature pressure, while automated enforcement is harder to ignore.
        </p>
      </section>

      <section>
        <h2>Why Performance Budgets Matter</h2>
        <MermaidDiagram
          chart={`flowchart TD
    A[No Performance Budget] --> B[Each PR adds small overhead]
    B --> C[+5KB JS here, +10KB there]
    C --> D[No single PR looks bad]
    D --> E[6 months later: 400KB → 800KB JS]
    E --> F[LCP: 1.8s → 4.2s]
    F --> G[Bounce rate increases 30%]
    G --> H[Revenue drops, SEO tanks]

    I[Performance Budget in Place] --> J[PR adds 15KB JS]
    J --> K{Budget exceeded?}
    K -->|Yes| L[CI fails, PR blocked]
    L --> M[Developer optimizes or removes dead code]
    M --> N[PR passes within budget]
    K -->|No| N
    N --> O[Performance stays stable over time]`}
          caption="The difference between teams with and without performance budgets — without enforcement, regression is inevitable"
        />
        <p>
          The business case for performance budgets is well-documented. Studies from Google, Amazon, and Walmart
          consistently show that every 100ms of additional load time reduces conversion rates by 1-2%. For an
          e-commerce site doing $10M/year, a 500ms regression could cost $500K-$1M annually. Performance budgets
          prevent these regressions from reaching production.
        </p>
        <p>
          Beyond revenue, performance budgets improve developer experience. When a team knows its limits, it makes
          more intentional decisions about dependencies. Instead of casually adding a 50KB charting library, developers
          evaluate lightweight alternatives or defer loading. This leads to cleaner, leaner codebases that are easier
          to maintain.
        </p>
      </section>

      <section>
        <h2>Types of Performance Budgets</h2>

        <h3 className="mt-4 font-semibold">1. Quantity-Based Budgets</h3>
        <p>
          Quantity-based budgets set limits on the size or count of resources. They are the simplest to measure because
          they require only a build step, not a full browser page load. They catch regressions early — often before the
          code even reaches a staging environment.
        </p>
        <table className="w-full border-collapse mt-2 mb-4">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Metric</th>
              <th className="p-3 text-left">Typical Budget</th>
              <th className="p-3 text-left">Why It Matters</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">Total JavaScript (compressed)</td>
              <td className="p-3">≤ 200KB</td>
              <td className="p-3">JS is the most expensive asset: it must be downloaded, parsed, compiled, and executed. 200KB compressed is roughly 600-800KB uncompressed — enough to keep a mid-range phone busy for 2-3 seconds.</td>
            </tr>
            <tr>
              <td className="p-3">Total CSS (compressed)</td>
              <td className="p-3">≤ 50KB</td>
              <td className="p-3">All CSS is render-blocking by default. Large stylesheets delay First Contentful Paint.</td>
            </tr>
            <tr>
              <td className="p-3">Total image weight</td>
              <td className="p-3">≤ 500KB</td>
              <td className="p-3">Images typically account for 50-70% of page weight. Modern formats (AVIF, WebP) and responsive srcset help.</td>
            </tr>
            <tr>
              <td className="p-3">Total page weight</td>
              <td className="p-3">≤ 1MB</td>
              <td className="p-3">A holistic cap that accounts for all resource types combined.</td>
            </tr>
            <tr>
              <td className="p-3">Number of HTTP requests</td>
              <td className="p-3">≤ 50</td>
              <td className="p-3">Each request has latency overhead, especially on HTTP/1.1. Even with HTTP/2 multiplexing, excessive requests compete for bandwidth.</td>
            </tr>
            <tr>
              <td className="p-3">Third-party script weight</td>
              <td className="p-3">≤ 50KB</td>
              <td className="p-3">Third-party scripts (analytics, ads, chat) are often the largest uncontrolled performance cost.</td>
            </tr>
            <tr>
              <td className="p-3">Web font weight</td>
              <td className="p-3">≤ 100KB</td>
              <td className="p-3">Fonts block text rendering and cause CLS via FOUT/FOIT. Subset and limit to 2-3 weights.</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-6 font-semibold">2. Timing-Based Budgets</h3>
        <p>
          Timing-based budgets set limits on user-facing metrics measured during a simulated or real page load. They
          correlate directly with user experience but are harder to enforce because they depend on network conditions,
          device speed, and page content.
        </p>
        <table className="w-full border-collapse mt-2 mb-4">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Metric</th>
              <th className="p-3 text-left">Budget</th>
              <th className="p-3 text-left">What It Measures</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">Largest Contentful Paint (LCP)</td>
              <td className="p-3">≤ 2.5s</td>
              <td className="p-3">When the main content is visible — the moment users feel the page has "loaded"</td>
            </tr>
            <tr>
              <td className="p-3">First Contentful Paint (FCP)</td>
              <td className="p-3">≤ 1.8s</td>
              <td className="p-3">When the first text or image appears — confirms the page is responding</td>
            </tr>
            <tr>
              <td className="p-3">Total Blocking Time (TBT)</td>
              <td className="p-3">≤ 200ms</td>
              <td className="p-3">Sum of blocking time from long tasks between FCP and TTI — correlates with INP</td>
            </tr>
            <tr>
              <td className="p-3">Time to Interactive (TTI)</td>
              <td className="p-3">≤ 3.8s</td>
              <td className="p-3">When the page reliably responds to input within 50ms</td>
            </tr>
            <tr>
              <td className="p-3">Cumulative Layout Shift (CLS)</td>
              <td className="p-3">≤ 0.1</td>
              <td className="p-3">Visual stability — how much the layout jumps during load</td>
            </tr>
            <tr>
              <td className="p-3">Time to First Byte (TTFB)</td>
              <td className="p-3">≤ 800ms</td>
              <td className="p-3">Server responsiveness — everything downstream depends on TTFB</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-6 font-semibold">3. Rule-Based Budgets</h3>
        <p>
          Rule-based budgets use aggregate scores from auditing tools as the threshold. They are the easiest to
          communicate to non-technical stakeholders.
        </p>
        <table className="w-full border-collapse mt-2 mb-4">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Tool</th>
              <th className="p-3 text-left">Budget</th>
              <th className="p-3 text-left">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">Lighthouse Performance Score</td>
              <td className="p-3">≥ 90</td>
              <td className="p-3">Weighted aggregate of FCP, LCP, TBT, CLS, Speed Index. Easy to track but hides individual metric regressions.</td>
            </tr>
            <tr>
              <td className="p-3">Lighthouse Accessibility Score</td>
              <td className="p-3">≥ 95</td>
              <td className="p-3">Not a performance metric per se, but often tracked alongside performance budgets.</td>
            </tr>
            <tr>
              <td className="p-3">WebPageTest SpeedIndex</td>
              <td className="p-3">≤ 3000</td>
              <td className="p-3">How quickly the visible content of the page is populated.</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2">
          <strong>Best practice:</strong> Use a combination of all three types. Quantity-based budgets catch regressions
          fast (just check build output). Timing-based budgets catch real user-experience regressions. Rule-based budgets
          provide a high-level health check that's easy to report to leadership.
        </p>
      </section>

      <section>
        <h2>Budget Allocation Strategy</h2>
        <MermaidDiagram
          chart={`pie title Typical JS Budget Allocation (200KB total)
    "Application code" : 80
    "Framework (React)" : 45
    "State management" : 15
    "Routing" : 10
    "UI library" : 30
    "Analytics & monitoring" : 10
    "Utilities (date, validation)" : 10`}
          caption="How a 200KB JavaScript budget might be allocated across different concerns"
        />
        <p>
          Breaking a total budget into per-category allocations helps teams make informed trade-offs. If the UI library
          consumes 30KB and a proposed replacement takes 60KB, the team immediately sees that it must find 30KB of savings
          elsewhere.
        </p>

        <h3 className="mt-6 font-semibold">Per-Route Budgets</h3>
        <p>
          Not all pages have the same performance requirements. A marketing landing page needs to be extremely fast
          (LCP &lt; 1.5s) because it is the user's first impression. A complex dashboard can afford a larger initial
          load (TTI &lt; 4s) because the user is already committed to the product.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Per-route budget configuration (Lighthouse CI)
// .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/pricing',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/products/1',
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertMatrix: [
        {
          // Strict budgets for marketing pages
          matchingUrlPattern: 'http://localhost:3000/(pricing)?$',
          assertions: {
            'largest-contentful-paint': ['error', { maxNumericValue: 1500 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
            'total-blocking-time': ['error', { maxNumericValue: 150 }],
            'categories:performance': ['error', { minScore: 0.95 }],
          },
        },
        {
          // Relaxed budgets for app pages
          matchingUrlPattern: 'http://localhost:3000/(dashboard|products)',
          assertions: {
            'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
            'total-blocking-time': ['error', { maxNumericValue: 300 }],
            'categories:performance': ['error', { minScore: 0.85 }],
          },
        },
      ],
    },
  },
};`}</code>
        </pre>
      </section>

      <section>
        <h2>Setting Budgets: A Step-by-Step Process</h2>

        <h3 className="mt-4 font-semibold">Step 1: Establish the Baseline</h3>
        <p>
          Before setting any limits, you need to know where you stand. Measure your current performance across all
          key pages using both lab and field data.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Automated baseline collection script
// scripts/collect-baseline.js
const { execSync } = require('child_process');
const fs = require('fs');

const pages = [
  { name: 'Homepage', url: 'http://localhost:3000' },
  { name: 'Product List', url: 'http://localhost:3000/products' },
  { name: 'Product Detail', url: 'http://localhost:3000/products/1' },
  { name: 'Dashboard', url: 'http://localhost:3000/dashboard' },
];

const results = {};

pages.forEach(({ name, url }) => {
  console.log(\`Auditing \${name}...\`);

  // Run Lighthouse 5 times and collect results
  const runs = [];
  for (let i = 0; i < 5; i++) {
    const output = execSync(
      \`npx lighthouse \${url} --output=json --quiet --chrome-flags="--headless"\`,
      { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 }
    );
    const report = JSON.parse(output);
    runs.push({
      lcp: report.audits['largest-contentful-paint'].numericValue,
      fcp: report.audits['first-contentful-paint'].numericValue,
      tbt: report.audits['total-blocking-time'].numericValue,
      cls: report.audits['cumulative-layout-shift'].numericValue,
      score: report.categories.performance.score * 100,
    });
  }

  // Use median of 5 runs
  const median = (arr) => {
    const sorted = [...arr].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  };

  results[name] = {
    lcp: median(runs.map(r => r.lcp)),
    fcp: median(runs.map(r => r.fcp)),
    tbt: median(runs.map(r => r.tbt)),
    cls: median(runs.map(r => r.cls)),
    score: median(runs.map(r => r.score)),
  };
});

fs.writeFileSync(
  'performance-baseline.json',
  JSON.stringify(results, null, 2)
);
console.log('Baseline saved to performance-baseline.json');`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Step 2: Benchmark Competitors</h3>
        <p>
          Run WebPageTest or Lighthouse on 2-3 competitor sites. Users don't evaluate your performance in isolation —
          they compare it to alternatives. If your competitor loads in 1.5s and you load in 3.5s, users notice even
          if your absolute numbers are "acceptable."
        </p>
        <p>
          Record competitor metrics in a comparison table. Your budget should aim to match or beat the fastest
          competitor on each key metric.
        </p>

        <h3 className="mt-6 font-semibold">Step 3: Set Initial Budgets</h3>
        <p>
          For each metric, set the budget at your current baseline or 20% below it. This approach is pragmatic:
        </p>
        <ul className="space-y-2">
          <li><strong>If you're already fast:</strong> Set the budget at your current level. The goal is to prevent regression.</li>
          <li><strong>If you're slow:</strong> Set the budget 20% below your current level. This creates immediate pressure to optimize before new features can land.</li>
          <li><strong>If competitors are faster:</strong> Set the budget at the competitor's level. This creates a clear optimization target.</li>
        </ul>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Example: deriving budgets from baseline
const baseline = {
  homepage: { lcp: 2800, fcp: 1600, tbt: 250, cls: 0.08, jsSize: 245000 },
  productPage: { lcp: 3200, fcp: 1900, tbt: 320, cls: 0.12, jsSize: 310000 },
};

const competitor = {
  homepage: { lcp: 2100, fcp: 1200, tbt: 180, cls: 0.03 },
};

// Budget = min(baseline * 0.8, competitor value, Google's "good" threshold)
const budgets = {
  homepage: {
    lcp: Math.min(2800 * 0.8, 2100, 2500),  // → 2100 (competitor)
    fcp: Math.min(1600 * 0.8, 1200, 1800),  // → 1200 (competitor)
    tbt: Math.min(250 * 0.8, 180, 200),     // → 180 (competitor)
    cls: Math.min(0.08, 0.03, 0.1),         // → 0.03 (competitor)
    jsSize: 245000 * 0.8,                   // → 196KB
  },
};`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Step 4: Implement Enforcement</h3>
        <p>
          Budgets that aren't enforced aren't budgets — they're wishes. Enforcement should happen at multiple levels:
          the build tool (webpack hints), the CI pipeline (Lighthouse CI, size-limit), and the monitoring system (RUM
          alerts for field data regression).
        </p>

        <h3 className="mt-6 font-semibold">Step 5: Review and Tighten Quarterly</h3>
        <p>
          Performance budgets should tighten over time, never loosen. Each quarter, review actual metrics and lower
          budgets toward the new baseline. If the team optimized JS from 200KB to 160KB, the new budget becomes 170KB —
          not 200KB, which would allow regression back to the old level.
        </p>
      </section>

      <section>
        <h2>Enforcing Budgets in CI/CD</h2>
        <MermaidDiagram
          chart={`flowchart LR
    A[Developer pushes PR] --> B[CI Pipeline Triggers]
    B --> C[Build Step]
    C --> D{Webpack perf hints}
    D -->|Fail| E[PR blocked: asset too large]
    D -->|Pass| F[size-limit check]
    F -->|Fail| G[PR blocked: bundle over budget]
    F -->|Pass| H[Deploy preview]
    H --> I[Lighthouse CI audit]
    I -->|Fail| J[PR blocked: metrics over budget]
    I -->|Pass| K[All checks pass]
    K --> L[PR ready for review]

    style E fill:#fee,stroke:#f66
    style G fill:#fee,stroke:#f66
    style J fill:#fee,stroke:#f66
    style K fill:#efe,stroke:#6f6`}
          caption="Multi-layer budget enforcement in a typical CI/CD pipeline"
        />

        <h3 className="mt-4 font-semibold">Layer 1: Build-Time — Webpack Performance Hints</h3>
        <p>
          Webpack can warn or error when any single asset or entry point exceeds a size threshold. This is the
          fastest check because it runs during the build itself, before any deployment.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// webpack.config.js
module.exports = {
  performance: {
    // Thresholds in bytes
    maxAssetSize: 250000,       // 250KB per individual asset
    maxEntrypointSize: 300000,  // 300KB for entry point (all initial chunks)

    // 'warning' logs but doesn't fail the build
    // 'error' fails the build
    hints: 'error',

    // Only check JS and CSS (skip images, fonts, source maps)
    assetFilter: (assetFilename) => {
      return !/\\.(map|png|jpe?g|gif|svg|woff2?)$/.test(assetFilename);
    },
  },
};

// For Next.js, add via next.config.js:
// module.exports = {
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       config.performance = {
//         maxAssetSize: 250000,
//         maxEntrypointSize: 300000,
//         hints: 'error',
//       };
//     }
//     return config;
//   },
// };`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Layer 2: Post-Build — size-limit</h3>
        <p>
          <code>size-limit</code> checks the final bundle sizes after the build completes. It supports gzip and brotli
          measurement, per-file limits, and even import cost analysis (measuring the cost of importing specific exports).
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// package.json — size-limit configuration
{
  "size-limit": [
    {
      "name": "Main JS bundle",
      "path": ".next/static/chunks/main-*.js",
      "limit": "100 kB"
    },
    {
      "name": "Framework bundle",
      "path": ".next/static/chunks/framework-*.js",
      "limit": "50 kB"
    },
    {
      "name": "CSS bundle",
      "path": ".next/static/css/*.css",
      "limit": "30 kB"
    },
    {
      "name": "Homepage JS",
      "path": ".next/static/chunks/pages/index-*.js",
      "limit": "25 kB"
    },
    {
      "name": "Button component",
      "path": "dist/index.js",
      "import": "{ Button }",
      "limit": "5 kB"
    }
  ],
  "scripts": {
    "size": "size-limit",
    "size:why": "size-limit --why"
  }
}

// CLI output example:
//  Main JS bundle      98.2 kB (limit: 100 kB)  ✅
//  Framework bundle    42.1 kB (limit: 50 kB)    ✅
//  CSS bundle          27.8 kB (limit: 30 kB)    ✅
//  Homepage JS         23.4 kB (limit: 25 kB)    ✅
//  Button component     3.1 kB (limit: 5 kB)     ✅`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Layer 3: Runtime — Lighthouse CI</h3>
        <p>
          Lighthouse CI runs a full browser audit against a deployed preview URL. It catches timing-based regressions
          that size checks cannot — such as a render-blocking script, a missing image preload, or a layout shift
          caused by a new component.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// .lighthouserc.js — full configuration
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/products',
        'http://localhost:3000/products/1',
        'http://localhost:3000/checkout',
      ],
      numberOfRuns: 3,               // Median of 3 runs reduces noise
      startServerCommand: 'pnpm start',
      startServerReadyPattern: 'ready on',
      startServerReadyTimeout: 30000,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Timing budgets
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'speed-index': ['warn', { maxNumericValue: 3400 }],

        // Rule-based budgets
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.95 }],

        // Resource budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 200000 }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 50000 }],
        'resource-summary:third-party:count': ['warn', { maxNumericValue: 5 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
      // Or use Lighthouse CI Server for historical tracking:
      // target: 'lhci',
      // serverBaseUrl: 'https://lhci.your-domain.com',
    },
  },
};`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Layer 4: bundlesize (Alternative to size-limit)</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// bundlesize.config.json
{
  "files": [
    {
      "path": ".next/static/chunks/main-*.js",
      "maxSize": "100 kB",
      "compression": "gzip"
    },
    {
      "path": ".next/static/chunks/framework-*.js",
      "maxSize": "50 kB",
      "compression": "gzip"
    },
    {
      "path": ".next/static/css/*.css",
      "maxSize": "30 kB",
      "compression": "gzip"
    }
  ]
}

// bundlesize integrates with GitHub and posts pass/fail status checks
// on PRs — no extra GitHub Actions configuration needed`}</code>
        </pre>
      </section>

      <section>
        <h2>GitHub Actions Integration</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`# .github/workflows/performance-budget.yml
name: Performance Budget

on:
  pull_request:
    branches: [main]

jobs:
  # Fast check: bundle size (runs in ~30 seconds)
  bundle-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      # size-limit with PR comment
      - uses: andresz1/size-limit-action@v1
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          # Posts a table showing size diff for each bundle

  # Full check: Lighthouse audit (runs in ~2-3 minutes)
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      - name: Run Lighthouse CI
        run: |
          pnpm start &
          sleep 5
          npx @lhci/cli autorun
        env:
          LHCI_GITHUB_APP_TOKEN: \${{ secrets.LHCI_GITHUB_APP_TOKEN }}

  # Optional: track bundle composition
  bundle-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: ANALYZE=true pnpm build
      - uses: actions/upload-artifact@v4
        with:
          name: bundle-report
          path: .next/analyze/`}</code>
        </pre>
      </section>

      <section>
        <h2>Tracking Bundle Size Over Time</h2>
        <MermaidDiagram
          chart={`xychart-beta
    title "JS Bundle Size Over 6 Months"
    x-axis [Jan, Feb, Mar, Apr, May, Jun]
    y-axis "Size (KB)" 0 --> 300
    bar [195, 198, 188, 192, 185, 182]
    line [200, 200, 200, 200, 200, 200]`}
          caption="Bundle size trending downward over time as the team optimizes, with the 200KB budget line holding firm"
        />
        <p>
          Historical tracking reveals trends that point-in-time checks miss. A bundle that's been steadily growing at
          5KB/month will hit the budget in a predictable timeframe — giving the team advance warning to plan optimization
          work.
        </p>

        <h3 className="mt-4 font-semibold">Lighthouse CI Server for Historical Data</h3>
        <p>
          Lighthouse CI Server provides a dashboard that stores every audit result, visualizes trends over time, and
          highlights when regressions occurred. This is invaluable for correlating performance changes with specific
          deployments.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Setting up Lighthouse CI Server for historical tracking

// 1. Deploy the server (Docker)
// docker run -p 9001:9001 patrickhulce/lhci-server

// 2. Configure your project to upload to it
// .lighthouserc.js
module.exports = {
  ci: {
    upload: {
      target: 'lhci',
      serverBaseUrl: 'https://lhci.your-company.com',
      token: process.env.LHCI_BUILD_TOKEN,
    },
  },
};

// 3. The server stores every run and provides:
// - Trend graphs for each metric over time
// - Comparison between branches
// - Identification of which commit caused regressions
// - Diff view showing before/after for any two builds`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Custom Bundle Tracking with Next.js</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// scripts/track-bundle-size.js
// Run after each build to record bundle sizes
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function getBundleSizes() {
  const buildDir = path.join(process.cwd(), '.next/static');
  const sizes = {};

  // Measure JS chunks
  const jsFiles = glob.sync('chunks/**/*.js', { cwd: buildDir });
  sizes.totalJS = jsFiles.reduce((sum, file) => {
    return sum + fs.statSync(path.join(buildDir, file)).size;
  }, 0);

  // Measure CSS
  const cssFiles = glob.sync('css/**/*.css', { cwd: buildDir });
  sizes.totalCSS = cssFiles.reduce((sum, file) => {
    return sum + fs.statSync(path.join(buildDir, file)).size;
  }, 0);

  // Record timestamp and git commit
  const { execSync } = require('child_process');
  const commit = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();

  return {
    timestamp: new Date().toISOString(),
    commit,
    totalJS: Math.round(sizes.totalJS / 1024),  // KB
    totalCSS: Math.round(sizes.totalCSS / 1024), // KB
    totalSize: Math.round((sizes.totalJS + sizes.totalCSS) / 1024),
  };
}

// Append to tracking file
const historyFile = 'bundle-history.json';
const history = fs.existsSync(historyFile)
  ? JSON.parse(fs.readFileSync(historyFile, 'utf-8'))
  : [];

history.push(getBundleSizes());
fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
console.log('Bundle size recorded:', history[history.length - 1]);`}</code>
        </pre>
      </section>

      <section>
        <h2>Team Culture Around Performance Budgets</h2>
        <p>
          Tools enforce budgets, but culture sustains them. Without buy-in from the team and leadership, budgets become
          "that annoying CI check people work around." Building a healthy performance culture requires deliberate effort.
        </p>

        <h3 className="mt-4 font-semibold">1. Performance Budget Reviews</h3>
        <p>
          Schedule a monthly or quarterly performance review meeting. Review current metrics vs budgets, identify
          trends, celebrate improvements, and plan optimization work for the next cycle. Make this a regular
          engineering ritual, not an ad-hoc response to complaints.
        </p>

        <h3 className="mt-4 font-semibold">2. Performance Champions</h3>
        <p>
          Assign rotating "performance champion" roles within the team. The champion reviews PRs with a performance
          lens, monitors dashboards, and raises awareness when metrics trend upward. This distributes knowledge and
          prevents performance from being one person's problem.
        </p>

        <h3 className="mt-4 font-semibold">3. Handling Budget Exceptions</h3>
        <p>
          When a legitimate feature cannot fit within the budget, the team should follow a structured exception process:
        </p>
        <ol className="space-y-2">
          <li><strong>Document the impact:</strong> Exactly how much does the feature exceed the budget? Which metric? By how much?</li>
          <li><strong>Explore alternatives:</strong> Can the feature be lazy-loaded? Can a lighter library be used? Can existing code be optimized to make room?</li>
          <li><strong>Get explicit approval:</strong> The tech lead or engineering manager signs off on the exception — not just the individual developer.</li>
          <li><strong>Create a follow-up ticket:</strong> The exception comes with a concrete plan and timeline to bring the metric back within budget.</li>
          <li><strong>Temporarily adjust the budget:</strong> Raise the limit for the specific route/metric, not globally. Add a comment explaining why and when it will be reverted.</li>
        </ol>

        <h3 className="mt-4 font-semibold">4. Making Performance Visible</h3>
        <p>
          Put a performance dashboard on a team screen. Include it in sprint demos. Share monthly trend reports with
          product leadership. When performance is visible, it stays a priority. When it's hidden in CI logs, it gets
          ignored.
        </p>

        <h3 className="mt-4 font-semibold">5. Onboarding and Documentation</h3>
        <p>
          New team members should understand the performance budgets within their first week. Document what the budgets
          are, why they exist, how to check them locally, and what to do when they fail. Include this in the engineering
          onboarding guide.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Developer workflow for checking budgets locally

// 1. Check bundle size before pushing
// pnpm build && pnpm size
// This runs size-limit and shows pass/fail for each budget

// 2. Run Lighthouse locally for timing budgets
// pnpm build && pnpm start
// npx lighthouse http://localhost:3000 --view

// 3. Analyze what's in your bundle
// pnpm size:why
// Opens a treemap visualization of your bundle contents

// 4. If a budget is exceeded:
//    a) Run \`pnpm size:why\` to see what's consuming space
//    b) Check for unused dependencies: npx depcheck
//    c) Look for large imports: npx import-cost
//    d) Consider code-splitting: dynamic(() => import('./HeavyComponent'))
//    e) If all else fails, follow the exception process`}</code>
        </pre>
      </section>

      <section>
        <h2>What to Do When Budgets Are Exceeded</h2>
        <MermaidDiagram
          chart={`flowchart TD
    A[Budget Exceeded in CI] --> B{Can you optimize?}
    B -->|Yes| C[Tree-shake, code-split, compress]
    C --> D[Re-run budget check]
    D -->|Pass| E[PR approved]
    D -->|Fail| B

    B -->|No more optimization possible| F{Can you remove something?}
    F -->|Yes| G[Remove unused deps, dead code, low-value features]
    G --> D

    F -->|No| H{Can you defer loading?}
    H -->|Yes| I[Dynamic import, lazy-load, route-based split]
    I --> D

    H -->|No| J[Request budget exception]
    J --> K[Document justification]
    K --> L[Tech lead approval]
    L --> M[Create follow-up optimization ticket]
    M --> N[Temporarily raise budget for this route]
    N --> E

    style E fill:#efe,stroke:#6f6
    style J fill:#ffeedd,stroke:#f90`}
          caption="Decision tree when a performance budget is exceeded — optimize first, exception last"
        />

        <h3 className="mt-4 font-semibold">Optimization Strategies</h3>
        <p>
          When the JS budget is exceeded, these are the most effective strategies ordered by typical impact:
        </p>
        <ol className="space-y-2">
          <li><strong>Replace heavy dependencies:</strong> Switch <code>moment.js</code> (67KB) to <code>date-fns</code> (tree-shakeable, 2-5KB typical). Replace <code>lodash</code> (72KB) with native methods or <code>lodash-es</code> with tree-shaking.</li>
          <li><strong>Code-split aggressively:</strong> Any component not visible on initial load should be behind <code>dynamic(() =&gt; import(...))</code>. Modals, dropdowns, tabs, charts, and admin panels are all candidates.</li>
          <li><strong>Remove unused exports:</strong> Run <code>npx depcheck</code> to find unused dependencies. Use <code>npx knip</code> to find unused files and exports. Dead code accumulates fast in large projects.</li>
          <li><strong>Audit third-party scripts:</strong> Move analytics and monitoring to async loading. Use facades for chat widgets and video embeds. Defer non-critical scripts to after page load.</li>
          <li><strong>Optimize images:</strong> Convert to AVIF/WebP, use responsive srcset, implement blur-up placeholders. Images often offer the most bytes saved for the least effort.</li>
        </ol>

        <h3 className="mt-6 font-semibold">Anti-Patterns to Avoid</h3>
        <ul className="space-y-2">
          <li><strong>Raising the budget without justification:</strong> This is the most common way budgets die. Once you raise the limit once, the precedent is set and it becomes easier to raise it again.</li>
          <li><strong>Disabling the CI check "temporarily":</strong> Temporary disabling becomes permanent in practice. If the check is too flaky, fix the flakiness — don't disable it.</li>
          <li><strong>Setting budgets too loose:</strong> A budget that never fails is not providing value. If you haven't hit the budget in 6 months, it's too generous — tighten it.</li>
          <li><strong>Only budgeting total size:</strong> A team can stay under a total JS budget while one critical page has a massive bundle. Use per-route budgets for important pages.</li>
          <li><strong>Ignoring third-party scripts:</strong> Your budget should include everything the user downloads, including third-party scripts. Excluding them creates a blind spot.</li>
        </ul>
      </section>

      <section>
        <h2>Real-World Budget Examples</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Site Type</th>
              <th className="p-3 text-left">JS Budget</th>
              <th className="p-3 text-left">LCP Budget</th>
              <th className="p-3 text-left">TBT Budget</th>
              <th className="p-3 text-left">CLS Budget</th>
              <th className="p-3 text-left">Lighthouse</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">E-commerce homepage</td>
              <td className="p-3">≤ 170KB</td>
              <td className="p-3">≤ 2.0s</td>
              <td className="p-3">≤ 150ms</td>
              <td className="p-3">≤ 0.05</td>
              <td className="p-3">≥ 90</td>
            </tr>
            <tr>
              <td className="p-3">E-commerce product page</td>
              <td className="p-3">≤ 200KB</td>
              <td className="p-3">≤ 2.5s</td>
              <td className="p-3">≤ 200ms</td>
              <td className="p-3">≤ 0.1</td>
              <td className="p-3">≥ 85</td>
            </tr>
            <tr>
              <td className="p-3">SaaS dashboard</td>
              <td className="p-3">≤ 300KB</td>
              <td className="p-3">≤ 3.0s</td>
              <td className="p-3">≤ 300ms</td>
              <td className="p-3">≤ 0.1</td>
              <td className="p-3">≥ 80</td>
            </tr>
            <tr>
              <td className="p-3">Marketing landing page</td>
              <td className="p-3">≤ 100KB</td>
              <td className="p-3">≤ 1.5s</td>
              <td className="p-3">≤ 100ms</td>
              <td className="p-3">≤ 0.05</td>
              <td className="p-3">≥ 95</td>
            </tr>
            <tr>
              <td className="p-3">News / media site</td>
              <td className="p-3">≤ 200KB</td>
              <td className="p-3">≤ 2.5s</td>
              <td className="p-3">≤ 200ms</td>
              <td className="p-3">≤ 0.1</td>
              <td className="p-3">≥ 85</td>
            </tr>
            <tr>
              <td className="p-3">Blog / documentation</td>
              <td className="p-3">≤ 80KB</td>
              <td className="p-3">≤ 1.5s</td>
              <td className="p-3">≤ 100ms</td>
              <td className="p-3">≤ 0.05</td>
              <td className="p-3">≥ 95</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2">
          These budgets assume compressed (gzip/brotli) sizes for quantity metrics and Lighthouse mobile emulation
          (Moto G Power on 4G) for timing metrics. Adjust based on your actual user demographics — if your audience is
          primarily on desktop with fast connections, your timing budgets can be stricter.
        </p>
      </section>

      <section>
        <h2>Advanced: Custom Budget Tooling</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// scripts/check-budgets.js
// Custom budget checker that combines multiple sources
const fs = require('fs');
const { execSync } = require('child_process');

const budgets = {
  'Total JS (gzip)': { max: 200, unit: 'KB' },
  'Total CSS (gzip)': { max: 50, unit: 'KB' },
  'Largest chunk': { max: 80, unit: 'KB' },
  'Number of chunks': { max: 15, unit: 'count' },
  'Third-party JS': { max: 50, unit: 'KB' },
};

function getActualSizes() {
  const buildManifest = JSON.parse(
    fs.readFileSync('.next/build-manifest.json', 'utf-8')
  );

  // Calculate actual sizes from build output
  const sizes = {};
  let totalJS = 0;
  let totalCSS = 0;
  let largestChunk = 0;
  let chunkCount = 0;

  const staticDir = '.next/static';
  const chunks = fs.readdirSync(\`\${staticDir}/chunks\`);

  chunks.forEach(file => {
    if (file.endsWith('.js')) {
      const size = fs.statSync(\`\${staticDir}/chunks/\${file}\`).size;
      totalJS += size;
      largestChunk = Math.max(largestChunk, size);
      chunkCount++;
    }
  });

  const cssFiles = fs.readdirSync(\`\${staticDir}/css\`);
  cssFiles.forEach(file => {
    if (file.endsWith('.css')) {
      totalCSS += fs.statSync(\`\${staticDir}/css/\${file}\`).size;
    }
  });

  return {
    'Total JS (gzip)': Math.round(totalJS / 1024 * 0.3),  // ~30% gzip ratio
    'Total CSS (gzip)': Math.round(totalCSS / 1024 * 0.2), // ~20% gzip ratio
    'Largest chunk': Math.round(largestChunk / 1024 * 0.3),
    'Number of chunks': chunkCount,
  };
}

const actual = getActualSizes();
let failed = false;

console.log('\\nPerformance Budget Report');
console.log('========================\\n');

Object.entries(budgets).forEach(([metric, { max, unit }]) => {
  const value = actual[metric];
  if (value === undefined) return;

  const status = value <= max ? '✅' : '❌';
  const percentage = Math.round((value / max) * 100);

  console.log(\`\${status} \${metric}: \${value}\${unit} / \${max}\${unit} (\${percentage}%)\`);

  if (value > max) {
    failed = true;
    console.log(\`   ↳ Over budget by \${value - max}\${unit}\`);
  }
});

if (failed) {
  console.log('\\n❌ Budget exceeded! Fix before merging.\\n');
  process.exit(1);
} else {
  console.log('\\n✅ All budgets passed.\\n');
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Integration with Build Tools</h2>

        <h3 className="mt-4 font-semibold">Next.js Bundle Analyzer</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... other config
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.performance = {
        maxAssetSize: 250000,
        maxEntrypointSize: 300000,
        hints: process.env.NODE_ENV === 'production' ? 'error' : 'warning',
      };
    }
    return config;
  },
});

// Usage:
// ANALYZE=true pnpm build
// Opens a treemap in the browser showing every module's size`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Import Cost Awareness</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// ESLint rule to warn about heavy imports
// .eslintrc.js (using eslint-plugin-import)
module.exports = {
  rules: {
    'no-restricted-imports': ['error', {
      paths: [
        {
          name: 'moment',
          message: 'Use date-fns instead (67KB → 2KB tree-shaken).',
        },
        {
          name: 'lodash',
          message: 'Use lodash-es for tree-shaking, or native methods.',
        },
      ],
      patterns: [
        {
          group: ['@mui/icons-material'],
          message: 'Import specific icons: @mui/icons-material/Search',
        },
      ],
    }],
  },
};`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Vite Performance Reporting</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// vite.config.js — build size reporting
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  build: {
    // Report compressed sizes in build output
    reportCompressedSize: true,

    // Warn when chunks exceed this size
    chunkSizeWarningLimit: 250, // KB

    rollupOptions: {
      output: {
        // Manual chunk splitting for budget control
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-tooltip'],
        },
      },
    },
  },
  plugins: [
    // Generate bundle visualization
    visualizer({
      filename: 'dist/bundle-stats.html',
      open: false,
      gzipSize: true,
    }),
  ],
});`}</code>
        </pre>
      </section>

      <section>
        <h2>Monitoring Field Data Against Budgets</h2>
        <p>
          CI/CD enforcement catches regressions in lab conditions, but field data (Real User Monitoring) is what actually
          matters. A page might pass Lighthouse CI on a fast CI server but fail for real users on slow devices and
          congested networks.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Real User Monitoring (RUM) budget alerting
// lib/performance-monitor.js
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';

const BUDGETS = {
  LCP: 2500,   // ms
  FCP: 1800,   // ms
  INP: 200,    // ms
  CLS: 0.1,    // score
  TTFB: 800,   // ms
};

function reportMetric(metric) {
  const budget = BUDGETS[metric.name];
  const overBudget = budget && metric.value > budget;

  // Send to analytics backend
  fetch('/api/analytics/vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      url: window.location.pathname,
      overBudget,
      budgetAmount: budget,
      overage: overBudget ? metric.value - budget : 0,
      // Device and connection info for segmentation
      connection: navigator.connection?.effectiveType || 'unknown',
      deviceMemory: navigator.deviceMemory || 'unknown',
      timestamp: Date.now(),
    }),
    keepalive: true,
  });
}

onLCP(reportMetric);
onINP(reportMetric);
onCLS(reportMetric);
onFCP(reportMetric);
onTTFB(reportMetric);

// Server-side: alert when P75 of any metric exceeds budget for 24 hours
// This catches regressions that lab tests miss (e.g., slow API responses,
// CDN misconfigurations, third-party script degradation)`}</code>
        </pre>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Setting budgets without enforcement:</strong> A spreadsheet that says "JS should be under 200KB" is
            not a budget. Unless CI fails when the limit is exceeded, the number has no teeth and will be ignored under
            feature pressure.
          </li>
          <li>
            <strong>One-size-fits-all budgets:</strong> The homepage, product page, and admin dashboard have fundamentally
            different performance requirements. Per-route budgets are more effective than global limits.
          </li>
          <li>
            <strong>Excluding third-party scripts:</strong> If your 200KB JS budget only counts first-party code, but
            third-party scripts add another 300KB, your users still download 500KB. Budget everything the user pays for.
          </li>
          <li>
            <strong>Only measuring compressed size:</strong> A 200KB gzip file might decompress to 800KB. The browser
            still has to parse, compile, and execute the uncompressed code. Consider budgeting both compressed (transfer)
            and uncompressed (parse) sizes.
          </li>
          <li>
            <strong>Ignoring the long tail:</strong> Your P50 might be great while P95 is terrible. Budget against
            P75 field data (what Google uses) and investigate P95 to understand worst-case user experience.
          </li>
          <li>
            <strong>Treating Lighthouse score as the only budget:</strong> The Lighthouse score is a weighted aggregate
            that can mask individual metric regressions. A 5-point LCP regression might be offset by a CLS improvement,
            keeping the overall score stable while load times worsen.
          </li>
          <li>
            <strong>Not budgeting for growth:</strong> If you set the budget at exactly your current size with no room,
            the next small feature will exceed it, forcing an exception. Set budgets slightly below current baseline to
            create room for small additions while still preventing significant regression.
          </li>
        </ul>
      </section>

      <section>
        <h2>Best Practices Summary</h2>
        <ol className="space-y-3">
          <li>
            <strong>Use all three budget types:</strong> Quantity-based for fast build-time checks, timing-based for
            user-experience accuracy, rule-based for stakeholder communication.
          </li>
          <li>
            <strong>Enforce in CI/CD at multiple layers:</strong> Webpack hints during build, size-limit post-build,
            Lighthouse CI against a preview deployment. Each layer catches different types of regressions.
          </li>
          <li>
            <strong>Set per-route budgets:</strong> Critical user-facing pages (homepage, product, checkout) get
            stricter budgets than internal tools or complex dashboards.
          </li>
          <li>
            <strong>Track trends over time:</strong> Use Lighthouse CI Server or a custom tracking script to visualize
            how metrics change across deployments and months.
          </li>
          <li>
            <strong>Budget third-party scripts separately:</strong> They are often the largest and least controlled
            performance cost. Limit their count and total size explicitly.
          </li>
          <li>
            <strong>Create a structured exception process:</strong> Exceptions should require documentation, tech lead
            approval, and a follow-up ticket. Never silently raise budgets or disable checks.
          </li>
          <li>
            <strong>Make performance visible:</strong> Dashboards, sprint demos, monthly reports. What gets measured
            and displayed gets managed.
          </li>
          <li>
            <strong>Tighten budgets quarterly:</strong> As the team optimizes, lower budgets to the new baseline.
            Budgets should trend downward over time, not upward.
          </li>
          <li>
            <strong>Monitor field data, not just lab:</strong> CI catches many regressions, but real user monitoring
            catches server-side issues, CDN problems, and third-party script degradation that lab tests miss.
          </li>
          <li>
            <strong>Onboard new developers:</strong> Document what budgets exist, how to check them locally, and what
            to do when they fail. Performance awareness starts on day one.
          </li>
        </ol>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-3">
          <li>
            A performance budget is a <strong>hard, enforceable limit</strong> on metrics like JS bundle size (≤200KB),
            LCP (≤2.5s), TBT (≤200ms), or Lighthouse score (≥90). It prevents the gradual regression that happens
            when every feature adds "just a few kilobytes" — death by a thousand cuts.
          </li>
          <li>
            There are three types: <strong>quantity-based</strong> (bundle size, image weight, request count),
            <strong> timing-based</strong> (LCP, FCP, TTI, TBT, CLS), and <strong>rule-based</strong> (Lighthouse
            score, WebPageTest SpeedIndex). Effective teams use a mix of all three.
          </li>
          <li>
            Budgets are set by measuring the <strong>current baseline</strong>, benchmarking competitors, and choosing
            the stricter of "20% below baseline" or "match the fastest competitor." Initial budgets prevent regression;
            quarterly reviews tighten them.
          </li>
          <li>
            Enforcement happens at multiple CI/CD layers: <strong>Webpack performance hints</strong> at build time,
            <strong> size-limit</strong> post-build for bundle size, and <strong>Lighthouse CI</strong> against a preview
            deployment for timing metrics. Each layer catches different regressions.
          </li>
          <li>
            When a budget is exceeded, the team follows a priority: <strong>optimize</strong> (tree-shake, code-split,
            compress), <strong>remove</strong> (dead code, unused deps), <strong>defer</strong> (lazy-load, dynamic import),
            or as a last resort, <strong>grant an exception</strong> with documentation and a follow-up ticket.
          </li>
          <li>
            <strong>Per-route budgets</strong> are more effective than global limits. A marketing landing page might budget
            100KB JS and 1.5s LCP, while a SaaS dashboard allows 300KB JS and 3.0s LCP.
          </li>
          <li>
            Culture matters as much as tooling. Budget reviews, performance champions, visible dashboards, structured
            exception processes, and developer onboarding all contribute to <strong>sustained performance discipline</strong>
            rather than one-time optimization.
          </li>
          <li>
            Field data monitoring (RUM) catches regressions that lab tests miss: slow API responses, CDN misconfigurations,
            and third-party script degradation. CI budgets protect against code regressions; RUM budgets protect against
            infrastructure regressions.
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://web.dev/performance-budgets-101/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Performance Budgets 101
            </a>
          </li>
          <li>
            <a href="https://web.dev/your-first-performance-budget/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Your First Performance Budget
            </a>
          </li>
          <li>
            <a href="https://web.dev/incorporate-performance-budgets-into-your-build-tools/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Incorporate Performance Budgets Into Your Build Process
            </a>
          </li>
          <li>
            <a href="https://github.com/ai/size-limit" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub — size-limit
            </a>
          </li>
          <li>
            <a href="https://github.com/GoogleChrome/lighthouse-ci" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub — Lighthouse CI
            </a>
          </li>
          <li>
            <a href="https://webpack.js.org/configuration/performance/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Webpack — Performance Configuration
            </a>
          </li>
          <li>
            <a href="https://timkadlec.com/remembers/2019-03-07-performance-budgets-that-stick/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Tim Kadlec — Performance Budgets That Stick
            </a>
          </li>
          <li>
            <a href="https://addyosmani.com/blog/performance-budgets/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Addy Osmani — Start Performance Budgeting
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
