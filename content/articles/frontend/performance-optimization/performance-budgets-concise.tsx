"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-performance-budgets-concise",
  title: "Performance Budgets",
  description: "Quick overview of performance budgets — setting, enforcing, and maintaining measurable limits for frontend performance metrics.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "performance-budgets",
  version: "concise",
  wordCount: 2800,
  readingTime: 11,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "performance-budgets", "bundle-size", "CI/CD", "Lighthouse", "web-vitals"],
  relatedTopics: ["web-vitals", "bundle-size-optimization", "code-splitting"],
};

export default function PerformanceBudgetsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          A <strong>performance budget</strong> is a set of maximum thresholds for metrics that affect user experience —
          things like JavaScript bundle size, Largest Contentful Paint, Total Blocking Time, or Lighthouse score. When any
          metric exceeds its budget, the team treats it like a failing test: the build breaks, the PR is blocked, or an
          alert fires.
        </p>
        <p>
          Without budgets, performance degrades gradually. Each feature adds a few kilobytes, each new library bumps load
          time by a fraction of a second, and before long the site is measurably slower than it was six months ago. Budgets
          make this invisible creep visible and enforceable. They shift the conversation from "is this fast enough?" to
          "does this exceed our agreed limit?"
        </p>
        <p>
          Performance budgets are not aspirational goals — they are hard limits. A budget of 200KB for JavaScript means
          that a PR adding a 15KB dependency when you are at 195KB will fail CI. The team must then decide: optimize
          existing code, remove something else, or justify an exception.
        </p>
      </section>

      <section>
        <h2>Types of Performance Budgets</h2>

        <h3 className="mt-4 font-semibold">Quantity-Based Budgets</h3>
        <p>
          These set limits on the raw size or count of resources delivered to the browser. They are the simplest to
          measure and enforce because they don't require running a full page load.
        </p>
        <table className="w-full border-collapse mt-2 mb-4">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Metric</th>
              <th className="p-3 text-left">Example Budget</th>
              <th className="p-3 text-left">Why It Matters</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">Total JavaScript (compressed)</td>
              <td className="p-3">≤ 200KB</td>
              <td className="p-3">JS must be parsed, compiled, and executed — the most expensive byte-for-byte asset</td>
            </tr>
            <tr>
              <td className="p-3">Total CSS</td>
              <td className="p-3">≤ 50KB</td>
              <td className="p-3">CSS is render-blocking; large stylesheets delay FCP</td>
            </tr>
            <tr>
              <td className="p-3">Total image weight</td>
              <td className="p-3">≤ 500KB</td>
              <td className="p-3">Images dominate page weight on most sites</td>
            </tr>
            <tr>
              <td className="p-3">Total page weight</td>
              <td className="p-3">≤ 1MB</td>
              <td className="p-3">Users on slow connections feel every extra kilobyte</td>
            </tr>
            <tr>
              <td className="p-3">Number of HTTP requests</td>
              <td className="p-3">≤ 50</td>
              <td className="p-3">Each request has overhead, especially on HTTP/1.1</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-6 font-semibold">Timing-Based Budgets</h3>
        <p>
          These set limits on user-facing performance metrics measured during a real or simulated page load.
        </p>
        <table className="w-full border-collapse mt-2 mb-4">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Metric</th>
              <th className="p-3 text-left">Example Budget</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">Largest Contentful Paint (LCP)</td>
              <td className="p-3">≤ 2.5s</td>
            </tr>
            <tr>
              <td className="p-3">First Contentful Paint (FCP)</td>
              <td className="p-3">≤ 1.8s</td>
            </tr>
            <tr>
              <td className="p-3">Total Blocking Time (TBT)</td>
              <td className="p-3">≤ 200ms</td>
            </tr>
            <tr>
              <td className="p-3">Time to Interactive (TTI)</td>
              <td className="p-3">≤ 3.8s</td>
            </tr>
            <tr>
              <td className="p-3">Cumulative Layout Shift (CLS)</td>
              <td className="p-3">≤ 0.1</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-6 font-semibold">Rule-Based Budgets</h3>
        <p>
          These use scores from auditing tools as the threshold. The most common is a minimum Lighthouse performance
          score (e.g., ≥ 90). Rule-based budgets are easy to communicate to stakeholders but less precise than individual
          metric budgets because the score aggregates multiple factors.
        </p>
      </section>

      <section>
        <h2>Setting Budgets</h2>
        <p>
          Start with your current baseline. Run Lighthouse on your key pages, record actual bundle sizes, and note your
          Core Web Vitals from CrUX or RUM data. Your initial budget should be at or slightly below this baseline —
          the first goal is to stop regression, not achieve perfection.
        </p>
        <p><strong>Practical approach:</strong></p>
        <ol className="space-y-2">
          <li><strong>Measure the baseline:</strong> Run 3-5 Lighthouse audits per page, take the median. Record compressed bundle sizes from the build output.</li>
          <li><strong>Benchmark competitors:</strong> Test 2-3 competing sites on WebPageTest. Your budgets should aim to match or beat them — users compare experiences subconsciously.</li>
          <li><strong>Set the budget at baseline or 20% below:</strong> If your JS bundle is 250KB, set the budget at 200KB. This forces optimization before new features can land.</li>
          <li><strong>Create per-route budgets for critical paths:</strong> The homepage, product page, and checkout page likely have different budgets. A one-size-fits-all budget is less effective.</li>
          <li><strong>Revisit quarterly:</strong> Budgets should tighten over time as you optimize, not loosen as features accumulate.</li>
        </ol>
      </section>

      <section>
        <h2>Enforcing Budgets in CI/CD</h2>

        <h3 className="mt-4 font-semibold">Lighthouse CI</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000', 'http://localhost:3000/products'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'categories:performance': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Bundle Size with size-limit</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// package.json
{
  "size-limit": [
    { "path": ".next/static/chunks/main-*.js", "limit": "100 kB" },
    { "path": ".next/static/chunks/framework-*.js", "limit": "50 kB" },
    { "path": ".next/static/css/*.css", "limit": "30 kB" },
    { "path": "dist/index.js", "limit": "15 kB", "import": "{ Button }" }
  ],
  "scripts": {
    "size": "size-limit",
    "size:check": "size-limit --why"
  }
}

// Run in CI:
// pnpm size  → exits with code 1 if any limit is exceeded`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Webpack Performance Hints</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// webpack.config.js (or next.config.js webpack override)
module.exports = {
  performance: {
    maxAssetSize: 250000,        // 250KB per asset (warning)
    maxEntrypointSize: 300000,   // 300KB per entry point
    hints: 'error',              // 'warning' | 'error' | false
    assetFilter: (assetFilename) => {
      // Only check JS and CSS files
      return /\\.(js|css)$/.test(assetFilename);
    },
  },
};`}</code>
        </pre>
      </section>

      <section>
        <h2>PR Integration & Team Workflow</h2>
        <p>
          The most effective budgets are enforced automatically in pull requests. When a PR pushes a metric over budget,
          the CI check fails and the PR cannot be merged. This creates a natural feedback loop:
        </p>
        <ul className="space-y-2">
          <li><strong>Immediate visibility:</strong> The developer sees the regression before it reaches production, not weeks later in a performance audit.</li>
          <li><strong>Size-limit bot comments:</strong> Tools like <code>size-limit</code> post a comment on the PR showing exactly how much the bundle grew and which files changed.</li>
          <li><strong>Lighthouse CI diff:</strong> Shows before/after for every metric, highlighting regressions in red.</li>
          <li><strong>Budget exception process:</strong> When a budget must be exceeded, require a comment explaining why and a tech-debt ticket to address it later.</li>
        </ul>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`# .github/workflows/budget.yml
name: Performance Budget
on: pull_request

jobs:
  bundle-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: andresz1/size-limit-action@v1
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          # Posts a PR comment with size diff table

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm build && pnpm start &
      - run: npx @lhci/cli autorun`}</code>
        </pre>
      </section>

      <section>
        <h2>When Budgets Are Exceeded</h2>
        <p>
          A budget violation is not a failure — it is a decision point. The team has four options:
        </p>
        <ol className="space-y-2">
          <li><strong>Optimize:</strong> Can you reduce the impact? Tree-shake unused exports, code-split the new feature, compress images further, or replace a heavy library with a lighter alternative.</li>
          <li><strong>Remove:</strong> Is there dead code, an unused dependency, or a feature with low usage that can be dropped to make room?</li>
          <li><strong>Defer:</strong> Can the feature be lazy-loaded so it doesn't affect the critical path? Moving code behind a dynamic import often keeps the initial budget intact.</li>
          <li><strong>Exception:</strong> If the feature is high-value and cannot be optimized further, document the exception, raise the budget for that specific route, and create a ticket to address the regression later.</li>
        </ol>
        <p className="mt-2">
          The worst response is to disable the check or raise budgets silently. This erodes the culture around performance
          and makes budgets meaningless within weeks.
        </p>
      </section>

      <section>
        <h2>Real-World Budget Examples</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Company / Type</th>
              <th className="p-3 text-left">Budget</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">E-commerce homepage</td>
              <td className="p-3">JS ≤ 170KB, LCP ≤ 2.0s, CLS ≤ 0.05, Lighthouse ≥ 90</td>
            </tr>
            <tr>
              <td className="p-3">SaaS dashboard</td>
              <td className="p-3">Initial JS ≤ 300KB, TTI ≤ 4.0s, TBT ≤ 300ms</td>
            </tr>
            <tr>
              <td className="p-3">Marketing landing page</td>
              <td className="p-3">Total page weight ≤ 500KB, LCP ≤ 1.5s, Lighthouse ≥ 95</td>
            </tr>
            <tr>
              <td className="p-3">News / media site</td>
              <td className="p-3">JS ≤ 200KB, FCP ≤ 1.5s, CLS ≤ 0.1, images ≤ 800KB</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-2">
          <li>
            A performance budget is a <strong>hard limit</strong> on metrics like bundle size (≤200KB JS), LCP (≤2.5s),
            TBT (≤200ms), or Lighthouse score (≥90). It prevents the gradual performance degradation that happens when
            every feature adds "just a few kilobytes."
          </li>
          <li>
            There are three types: <strong>quantity-based</strong> (bundle size, image weight, request count),
            <strong> timing-based</strong> (LCP, FCP, TTI, TBT), and <strong>rule-based</strong> (Lighthouse score).
            Effective teams use a mix of all three.
          </li>
          <li>
            Budgets must be <strong>enforced in CI/CD</strong> to be effective. Tools like Lighthouse CI, size-limit, and
            bundlesize integrate with GitHub Actions and post PR comments showing exactly what regressed.
          </li>
          <li>
            When a budget is exceeded, the team has four options: <strong>optimize</strong> existing code, <strong>remove</strong>
            {" "}unused dependencies, <strong>defer</strong> via lazy-loading, or <strong>grant an exception</strong> with a
            documented justification and a follow-up ticket.
          </li>
          <li>
            Webpack's <code>performance.hints</code> setting can fail builds when assets exceed a size threshold.
            For Next.js, tools like <code>size-limit</code> or <code>@next/bundle-analyzer</code> provide similar enforcement.
          </li>
          <li>
            Start budgets at your current baseline or 20% below. The goal is first to <strong>stop regression</strong>,
            then gradually tighten. Benchmark against competitors to ensure your budgets reflect market expectations.
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
        </ul>
      </section>
    </ArticleLayout>
  );
}
