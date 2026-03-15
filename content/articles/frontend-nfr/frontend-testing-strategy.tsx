"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-frontend-testing-strategy",
  title: "Frontend Testing Strategy",
  description: "Comprehensive guide to frontend testing: unit tests, integration tests, E2E tests, visual regression, accessibility testing, and testing pyramid for modern web applications.",
  category: "frontend",
  subcategory: "nfr",
  slug: "frontend-testing-strategy",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "testing", "unit-tests", "integration-tests", "e2e", "accessibility"],
  relatedTopics: ["error-ux-recovery", "accessibility", "developer-experience"],
};

export default function FrontendTestingStrategyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Frontend Testing Strategy</strong> encompasses the approaches, tools, and practices
          for verifying frontend applications work correctly. This includes unit tests for components
          and utilities, integration tests for component interactions, E2E tests for user flows,
          visual regression tests for UI consistency, and accessibility tests for inclusive design.
        </p>
        <p>
          For staff engineers, testing strategy balances confidence with velocity. Too little testing
          leads to production bugs and regression fear. Too much testing slows development and creates
          maintenance burden. The right strategy depends on application criticality, team size, and
          release frequency.
        </p>
        <p>
          <strong>Testing pyramid for frontend:</strong>
        </p>
        <ul>
          <li><strong>Unit tests (base):</strong> Fast, isolated, many tests</li>
          <li><strong>Integration tests (middle):</strong> Component interactions, fewer tests</li>
          <li><strong>E2E tests (top):</strong> Full user flows, few critical paths</li>
          <li><strong>Visual/accessibility (cross-cutting):</strong> UI consistency, inclusive design</li>
        </ul>
      </section>

      <section>
        <h2>Unit Testing</h2>
        <p>
          Unit tests verify individual components and functions in isolation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">What to Test</h3>
        <ul className="space-y-2">
          <li><strong>Utility functions:</strong> Pure functions with clear inputs/outputs</li>
          <li><strong>Component rendering:</strong> Component renders with given props</li>
          <li><strong>User interactions:</strong> Clicks, inputs, form submissions</li>
          <li><strong>State changes:</strong> Component state updates correctly</li>
          <li><strong>Edge cases:</strong> Empty states, error states, boundary conditions</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Testing Libraries</h3>
        <ul className="space-y-2">
          <li><strong>Jest:</strong> Test runner, assertions, mocking</li>
          <li><strong>Vitest:</strong> Fast alternative, Vite-native</li>
          <li><strong>React Testing Library:</strong> Component testing, user-centric queries</li>
          <li><strong>Vue Test Utils:</strong> Vue component testing</li>
          <li><strong>Angular Testing:</strong> Built-in testing utilities</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Best Practices</h3>
        <ul className="space-y-2">
          <li>Test behavior, not implementation</li>
          <li>Use user-centric queries (getByText, getByRole)</li>
          <li>Mock external dependencies (APIs, timers)</li>
          <li>Keep tests fast and isolated</li>
          <li>Test one thing per test case</li>
          <li>Use describe blocks for organization</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">What NOT to Test</h3>
        <ul className="space-y-2">
          <li>Third-party library internals</li>
          <li>Implementation details (class names, DOM structure)</li>
          <li>Everything — focus on critical paths</li>
          <li>Trivial code (single-line getters)</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/testing-pyramid.svg"
          alt="Testing Pyramid"
          caption="Frontend testing pyramid — unit tests at base, integration in middle, E2E at top"
        />
      </section>

      <section>
        <h2>Integration Testing</h2>
        <p>
          Integration tests verify components work together correctly.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">What to Test</h3>
        <ul className="space-y-2">
          <li><strong>Component composition:</strong> Parent-child component interaction</li>
          <li><strong>State management:</strong> Redux/Zustand integration</li>
          <li><strong>API integration:</strong> Component with mocked API responses</li>
          <li><strong>Form flows:</strong> Multi-field form validation and submission</li>
          <li><strong>Routing:</strong> Navigation between pages/components</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Testing Approach</h3>
        <ul className="space-y-2">
          <li>Render component trees, not isolated components</li>
          <li>Mock external services (APIs, auth)</li>
          <li>Test realistic user scenarios</li>
          <li>Verify component communication</li>
          <li>Check state propagation across components</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Tools</h3>
        <ul className="space-y-2">
          <li><strong>React Testing Library:</strong> render, screen, user-event</li>
          <li><strong>MSW (Mock Service Worker):</strong> API mocking</li>
          <li><strong>Testing Library User Event:</strong> Realistic user interactions</li>
          <li><strong>Redux Mock Store:</strong> Redux state mocking</li>
        </ul>
      </section>

      <section>
        <h2>End-to-End (E2E) Testing</h2>
        <p>
          E2E tests verify complete user flows in a real browser environment.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">What to Test</h3>
        <ul className="space-y-2">
          <li><strong>Critical user flows:</strong> Login, checkout, signup</li>
          <li><strong>Happy paths:</strong> Primary use cases</li>
          <li><strong>Error flows:</strong> Failed login, payment errors</li>
          <li><strong>Cross-browser:</strong> Chrome, Firefox, Safari</li>
          <li><strong>Mobile:</strong> Responsive behavior on mobile viewports</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E2E Tools</h3>
        <ul className="space-y-2">
          <li><strong>Cypress:</strong> Popular, developer-friendly, good DX</li>
          <li><strong>Playwright:</strong> Microsoft, multi-browser, auto-wait</li>
          <li><strong>Puppeteer:</strong> Chrome-focused, lower-level</li>
          <li><strong>WebdriverIO:</strong> Selenium-based, enterprise</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Best Practices</h3>
        <ul className="space-y-2">
          <li>Test critical paths only (slow, expensive)</li>
          <li>Use data-testid attributes for selectors</li>
          <li>Mock external services (payment, email)</li>
          <li>Run in CI/CD pipeline</li>
          <li>Parallelize test execution</li>
          <li>Capture screenshots/videos on failure</li>
          <li>Seed test data before tests</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E2E Anti-Patterns</h3>
        <ul className="space-y-2">
          <li>Testing every possible flow (too slow)</li>
          <li>Brittle selectors (CSS classes, DOM structure)</li>
          <li>Flaky tests (timing issues, race conditions)</li>
          <li>Testing third-party functionality</li>
          <li>No test data management</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/e2e-testing-flow.svg"
          alt="E2E Testing Flow"
          caption="E2E testing workflow — test execution, assertions, screenshots on failure, and CI/CD integration"
        />
      </section>

      <section>
        <h2>Visual Regression Testing</h2>
        <p>
          Visual regression tests catch unintended UI changes.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">How It Works</h3>
        <ul className="space-y-2">
          <li>Capture baseline screenshots of components/pages</li>
          <li>On each change, capture new screenshots</li>
          <li>Compare pixel-by-pixel</li>
          <li>Flag differences for review</li>
          <li>Approve/reject changes</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Tools</h3>
        <ul className="space-y-2">
          <li><strong>Chromatic:</strong> Storybook integration, cloud-based</li>
          <li><strong>Percy:</strong> Visual review platform</li>
          <li><strong>Playwright screenshots:</strong> Built-in visual comparison</li>
          <li><strong>BackstopJS:</strong> Open-source option</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Best Practices</h3>
        <ul className="space-y-2">
          <li>Test component variants (Storybook stories)</li>
          <li>Test critical pages (homepage, checkout)</li>
          <li>Use consistent viewport sizes</li>
          <li>Ignore dynamic content (timestamps, animations)</li>
          <li>Review changes in context (not just diff)</li>
        </ul>
      </section>

      <section>
        <h2>Accessibility Testing</h2>
        <p>
          Accessibility tests ensure applications are usable by people with disabilities.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Automated Testing</h3>
        <ul className="space-y-2">
          <li><strong>axe-core:</strong> Accessibility engine</li>
          <li><strong>jest-axe:</strong> Jest integration</li>
          <li><strong>cypress-axe:</strong> Cypress integration</li>
          <li><strong>eslint-plugin-jsx-a11y:</strong> Linting for a11y issues</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">What Automated Tests Catch</h3>
        <ul className="space-y-2">
          <li>Missing alt text on images</li>
          <li>Missing form labels</li>
          <li>Invalid ARIA attributes</li>
          <li>Color contrast issues (some)</li>
          <li>Missing heading hierarchy</li>
          <li>Keyboard trap detection</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">What Requires Manual Testing</h3>
        <ul className="space-y-2">
          <li>Screen reader experience</li>
          <li>Keyboard navigation flow</li>
          <li>Focus order logic</li>
          <li>Meaningful alt text quality</li>
          <li>Cognitive accessibility</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Testing Strategy</h3>
        <ul className="space-y-2">
          <li>Run axe-core in unit tests for components</li>
          <li>Run accessibility checks in E2E tests</li>
          <li>Include a11y linting in CI</li>
          <li>Manual screen reader testing before major releases</li>
          <li>User testing with disabled users periodically</li>
        </ul>
      </section>

      <section>
        <h2>Testing in CI/CD</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pipeline Integration</h3>
        <ul className="space-y-2">
          <li>Run unit tests on every commit</li>
          <li>Run integration tests on PRs</li>
          <li>Run E2E tests on staging before deploy</li>
          <li>Run visual regression on UI changes</li>
          <li>Block deploys on test failures</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Test Optimization</h3>
        <ul className="space-y-2">
          <li>Parallelize test execution</li>
          <li>Cache dependencies between runs</li>
          <li>Run affected tests only (test impact analysis)</li>
          <li>Use test sharding for large suites</li>
          <li>Fail fast on critical test failures</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Flaky Test Management</h3>
        <ul className="space-y-2">
          <li>Identify and quarantine flaky tests</li>
          <li>Add retry logic for known flaky tests</li>
          <li>Fix root causes (timing, race conditions)</li>
          <li>Monitor flaky test rate over time</li>
          <li>Don&apos;t ignore flaky tests — they erode confidence</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/ci-cd-testing-pipeline.svg"
          alt="CI/CD Testing Pipeline"
          caption="CI/CD testing pipeline — unit tests on commit, integration on PR, E2E on staging, visual regression on UI changes"
        />
      </section>

      <section>
        <h2>Test Coverage</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Coverage Metrics</h3>
        <ul className="space-y-2">
          <li><strong>Line coverage:</strong> Percentage of lines executed</li>
          <li><strong>Branch coverage:</strong> Percentage of branches taken</li>
          <li><strong>Function coverage:</strong> Percentage of functions called</li>
          <li><strong>Statement coverage:</strong> Percentage of statements executed</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Coverage Goals</h3>
        <ul className="space-y-2">
          <li>80%+ line coverage for critical code</li>
          <li>Focus on critical paths, not 100%</li>
          <li>Coverage is a guide, not a goal</li>
          <li>High coverage doesn&apos;t mean good tests</li>
          <li>Test important logic, not getters/setters</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Coverage Tools</h3>
        <ul className="space-y-2">
          <li><strong>Istanbul/nyc:</strong> JavaScript coverage</li>
          <li><strong>Jest coverage:</strong> Built-in coverage</li>
          <li><strong>Vitest coverage:</strong> Vite-native coverage</li>
          <li><strong>Cypress coverage:</strong> E2E coverage</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s your testing strategy for a React application?</p>
            <p className="mt-2 text-sm">
              A: Testing pyramid approach. Unit tests with Jest + React Testing Library for components
              and utilities. Integration tests for component interactions with mocked APIs. E2E tests
              with Cypress/Playwright for critical user flows (login, checkout). Visual regression
              with Chromatic for UI components. Accessibility tests with axe-core in CI. Run unit
              tests on every commit, E2E on staging before deploy.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between unit, integration, and E2E tests?</p>
            <p className="mt-2 text-sm">
              A: Unit tests verify isolated components/functions — fast, many tests. Integration tests
              verify component interactions — medium speed, fewer tests. E2E tests verify complete
              user flows in real browser — slow, few critical paths only. Follow testing pyramid:
              more unit tests, fewer E2E tests.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you test accessibility?</p>
            <p className="mt-2 text-sm">
              A: Automated: eslint-plugin-jsx-a11y for linting, axe-core in unit tests, cypress-axe
              in E2E tests. Manual: Screen reader testing (NVDA, VoiceOver), keyboard navigation
              testing, user testing with disabled users. Automated catches ~30% of issues — manual
              testing required for comprehensive coverage.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle flaky tests?</p>
            <p className="mt-2 text-sm">
              A: Identify flaky tests (fail intermittently). Quarantine them so they don&apos;t block
              deploys. Add retry logic as temporary measure. Fix root causes — usually timing issues,
              race conditions, or external dependencies. Monitor flaky test rate. Don&apos;t ignore
              flaky tests — they erode team confidence in the test suite.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What code coverage target do you recommend?</p>
            <p className="mt-2 text-sm">
              A: 80%+ line coverage for critical code, but coverage is a guide not a goal. Focus on
              testing important logic, not chasing 100%. High coverage doesn&apos;t mean good tests —
              you can have 100% coverage and still miss critical bugs. Test critical paths, edge
              cases, and business logic. Don&apos;t waste time testing trivial code (getters,
              re-exports).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://testing-library.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Testing Library — User-Centric Testing
            </a>
          </li>
          <li>
            <a href="https://www.cypress.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Cypress — E2E Testing
            </a>
          </li>
          <li>
            <a href="https://playwright.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Playwright — Cross-Browser E2E
            </a>
          </li>
          <li>
            <a href="https://www.deque.com/axe/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              axe-core — Accessibility Testing
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
