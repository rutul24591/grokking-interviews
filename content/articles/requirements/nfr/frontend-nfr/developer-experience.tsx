"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-developer-experience",
  title: "Developer Experience (DX)",
  description: "Comprehensive guide to frontend developer experience: tooling, workflows, documentation, onboarding, and creating productive development environments.",
  category: "non-functional-requirements",
  subcategory: "frontend-non-functional-requirements",
  slug: "developer-experience",
  version: "extensive",
  wordCount: 8500,
  readingTime: 34,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "dx", "tooling", "workflow", "documentation", "productivity"],
  relatedTopics: ["frontend-testing-strategy", "build-optimization", "frontend-deployment-strategy"],
};

export default function DeveloperExperienceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Developer Experience (DX)</strong> encompasses the tools, workflows, documentation,
          and environment that enable developers to be productive, happy, and effective. Good DX
          reduces cognitive load, minimizes friction, and accelerates development velocity. For
          staff engineers, DX is a force multiplier — investing in developer productivity compounds
          across the entire team.
        </p>
        <p>
          DX impacts hiring (developers prefer good DX), retention (frustrated developers leave),
          and output quality (happy developers write better code). Measuring DX requires both
          quantitative metrics (build times, test feedback loops) and qualitative feedback
          (developer surveys, frustration tracking).
        </p>
        <p>
          <strong>DX dimensions:</strong>
        </p>
        <ul>
          <li><strong>Tooling:</strong> IDE, linters, formatters, debuggers</li>
          <li><strong>Feedback loops:</strong> Build times, test execution, hot reload</li>
          <li><strong>Documentation:</strong> Onboarding, APIs, architecture decisions</li>
          <li><strong>Workflow:</strong> Git workflow, CI/CD, code review process</li>
          <li><strong>Environment:</strong> Local setup, staging environments, dev tools</li>
        </ul>
      </section>

      <section>
        <h2>Development Environment</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Local Setup</h3>
        <ul className="space-y-2">
          <li>One-command setup (<code>pnpm install</code>, <code>pnpm dev</code>)</li>
          <li>Document prerequisites (Node version, pnpm version)</li>
          <li>Use <code>.nvmrc</code> or <code>.tool-versions</code> for version management</li>
          <li>Provide seed data for local development</li>
          <li>Mock external services for offline development</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">IDE Configuration</h3>
        <ul className="space-y-2">
          <li>Share VS Code settings (<code>.vscode/settings.json</code>)</li>
          <li>Recommend extensions (ESLint, Prettier, TypeScript)</li>
          <li>Configure workspace settings for consistency</li>
          <li>Set up debug configurations</li>
          <li>Enable IntelliSense for better autocomplete</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Hot Module Replacement</h3>
        <ul className="space-y-2">
          <li>Enable HMR for instant feedback</li>
          <li>Configure fast refresh for React/Vue</li>
          <li>Preserve state across reloads when possible</li>
          <li>Target sub-second update times</li>
          <li>Monitor HMR performance (slow HMR kills productivity)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Environment Management</h3>
        <ul className="space-y-2">
          <li>Use <code>.env</code> files for environment variables</li>
          <li>Provide <code>.env.example</code> with required variables</li>
          <li>Never commit secrets</li>
          <li>Use different configs for dev, staging, production</li>
          <li>Validate environment variables on startup</li>
        </ul>
      </section>

      <section>
        <h2>Code Quality Tooling</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Linting</h3>
        <ul className="space-y-2">
          <li>ESLint for JavaScript/TypeScript</li>
          <li>Shareable configs for consistency</li>
          <li>Auto-fix on save (VS Code settings)</li>
          <li>Run in CI as gate</li>
          <li>Balance strictness with pragmatism</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Formatting</h3>
        <ul className="space-y-2">
          <li>Prettier for consistent formatting</li>
          <li>Format on save (remove bikeshedding)</li>
          <li>Configure organization-wide defaults</li>
          <li>Run in CI to enforce</li>
          <li>Don&apos;t over-configure (defaults are good)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Type Safety</h3>
        <ul className="space-y-2">
          <li>TypeScript for type safety</li>
          <li>Strict mode enabled</li>
          <li>Type checking in CI</li>
          <li>Generate types from APIs (OpenAPI, GraphQL)</li>
          <li>Balance type safety with velocity</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pre-commit Hooks</h3>
        <ul className="space-y-2">
          <li>Husky for Git hooks</li>
          <li>lint-staged for staged file linting</li>
          <li>Format and lint before commit</li>
          <li>Run type check on staged files</li>
          <li>Keep hooks fast (don&apos;t block workflow)</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/dx-tooling-stack.svg"
          alt="DX Tooling Stack"
          caption="Developer experience tooling stack — IDE, linters, formatters, type safety, pre-commit hooks, and debugging tools"
        />
      </section>

      <section>
        <h2>Feedback Loops</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Build Performance</h3>
        <ul className="space-y-2">
          <li>Target &lt;5s dev server start</li>
          <li>Target &lt;1s HMR updates</li>
          <li>Monitor build times over time</li>
          <li>Use build analysis tools (webpack-bundle-analyzer)</li>
          <li>Implement code splitting for faster builds</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Test Feedback</h3>
        <ul className="space-y-2">
          <li>Fast unit tests (&lt;100ms per test)</li>
          <li>Run tests on save for changed files</li>
          <li>Parallelize test execution</li>
          <li>Flaky test detection and quarantine</li>
          <li>Clear test output (what failed, why, how to fix)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CI/CD Performance</h3>
        <ul className="space-y-2">
          <li>Target &lt;10min CI pipeline</li>
          <li>Run jobs in parallel</li>
          <li>Cache dependencies between runs</li>
          <li>Skip irrelevant jobs (docs change → skip tests)</li>
          <li>Provide clear failure messages</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Messages</h3>
        <ul className="space-y-2">
          <li>Clear, actionable error messages</li>
          <li>Link to documentation</li>
          <li>Suggest fixes</li>
          <li>Avoid cryptic stack traces for common errors</li>
          <li>Custom error pages for common issues</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/dx-feedback-loops.svg"
          alt="DX Feedback Loops"
          caption="Developer experience feedback loops — build times, test execution, and CI/CD pipeline with target timings"
        />
      </section>

      <section>
        <h2>Documentation</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Onboarding Documentation</h3>
        <ul className="space-y-2">
          <li>README with quick start</li>
          <li>Setup guide (prerequisites, installation)</li>
          <li>Architecture overview</li>
          <li>Common tasks (add feature, fix bug, deploy)</li>
          <li>Troubleshooting guide</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">API Documentation</h3>
        <ul className="space-y-2">
          <li>Auto-generated from types (TypeDoc, Storybook)</li>
          <li>Examples for common use cases</li>
          <li>Keep docs close to code (JSDoc comments)</li>
          <li>Document edge cases and gotchas</li>
          <li>Version documentation with code</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Architecture Decision Records (ADRs)</h3>
        <ul className="space-y-2">
          <li>Document significant decisions</li>
          <li>Include context, options considered, decision, consequences</li>
          <li>Store in repository (<code>docs/adr/</code>)</li>
          <li>Reference in code comments</li>
          <li>Review and update as decisions evolve</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Component Documentation</h3>
        <ul className="space-y-2">
          <li>Storybook for component catalog</li>
          <li>Props documentation with examples</li>
          <li>Interactive playground</li>
          <li>Usage guidelines and best practices</li>
          <li>Accessibility documentation</li>
        </ul>
      </section>

      <section>
        <h2>Measuring DX</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Quantitative Metrics</h3>
        <ul className="space-y-2">
          <li>Build times (dev and production)</li>
          <li>Test execution time</li>
          <li>CI pipeline duration</li>
          <li>Time to first commit for new developers</li>
          <li>Deployment frequency</li>
          <li>Lead time for changes</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Qualitative Feedback</h3>
        <ul className="space-y-2">
          <li>Developer satisfaction surveys (quarterly)</li>
          <li>Friction logs (document pain points)</li>
          <li>Onboarding feedback from new hires</li>
          <li>Exit interviews (why developers leave)</li>
          <li>Regular retrospectives</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SPACE Framework</h3>
        <ul className="space-y-2">
          <li><strong>Satisfaction:</strong> Developer happiness and well-being</li>
          <li><strong>Performance:</strong> Output and quality</li>
          <li><strong>Activity:</strong> Actions performed (commits, PRs, reviews)</li>
          <li><strong>Communication:</strong> Collaboration and knowledge sharing</li>
          <li><strong>Efficiency:</strong> Flow state, uninterrupted time</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Acting on Feedback</h3>
        <ul className="space-y-2">
          <li>Prioritize DX improvements in sprint planning</li>
          <li>Assign DX owner/champion</li>
          <li>Track DX metrics alongside product metrics</li>
          <li>Celebrate DX wins (faster builds, better tools)</li>
          <li>Make DX part of engineering culture</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/dx-metrics-framework.svg"
          alt="SPACE Framework for DX Metrics"
          caption="SPACE framework for measuring developer experience — Satisfaction, Performance, Activity, Communication, and Efficiency"
        />
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What makes good developer experience?</p>
            <p className="mt-2 text-sm">
              A: Fast feedback loops (builds, tests), clear error messages, good documentation,
              consistent tooling (linters, formatters), easy onboarding, and reliable CI/CD.
              Measure both quantitative (build times, test duration) and qualitative (developer
              surveys, friction logs). Invest in DX as force multiplier for team productivity.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you improve build performance?</p>
            <p className="mt-2 text-sm">
              A: Profile builds to identify bottlenecks. Use caching (dependency, build cache).
              Implement code splitting. Upgrade to faster tools (Vite vs webpack, esbuild vs Babel).
              Monitor build times over time. Target &lt;5s dev server start, &lt;1s HMR. Parallelize
              where possible.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What documentation is essential for a frontend project?</p>
            <p className="mt-2 text-sm">
              A: README with quick start, setup guide with prerequisites, architecture overview,
              API documentation (auto-generated), ADRs for significant decisions, component
              documentation (Storybook), troubleshooting guide. Keep docs close to code, update
              with changes, make searchable.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you measure developer productivity?</p>
            <p className="mt-2 text-sm">
              A: Use SPACE framework — Satisfaction, Performance, Activity, Communication, Efficiency.
              Quantitative: build times, test duration, deployment frequency, lead time. Qualitative:
              developer surveys, friction logs, onboarding feedback. Avoid vanity metrics (lines of
              code, commits). Focus on outcomes, not output.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s your approach to code quality tooling?</p>
            <p className="mt-2 text-sm">
              A: ESLint for linting, Prettier for formatting (format on save), TypeScript for type
              safety. Pre-commit hooks with lint-staged for fast feedback. Run in CI as gate.
              Balance strictness with pragmatism — too many rules frustrate developers. Share
              configs across projects for consistency.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://github.com/github/space-framework" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              SPACE Framework for Developer Productivity
            </a>
          </li>
          <li>
            <a href="https://developerexperience.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Developer Experience Resources
            </a>
          </li>
          <li>
            <a href="https://www.atlassian.com/engineering/measuring-developer-productivity" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Atlassian — Measuring Developer Productivity
            </a>
          </li>
          <li>
            <a href="https://storybook.js.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Storybook — Component Documentation
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
