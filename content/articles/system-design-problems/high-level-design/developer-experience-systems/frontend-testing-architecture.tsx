"use client";
import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-frontend-testing-architecture",
  title: "Design a Frontend Testing Architecture",
  slug: "frontend-testing-architecture",
  category: "high-level-design",
  subcategory: "developer-experience-systems",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-16",
  difficulty: "advanced",
  tags: [
    "testing",
    "Vitest",
    "Playwright",
    "visual regression",
    "contract testing",
    "CI/CD",
    "coverage",
    "MSW",
  ],
  author: {
    name: "System Design Prep",
    role: "Staff Engineer",
  },
  description:
    "End-to-end architecture for frontend testing at scale: testing pyramid strategy, component and integration testing with RTL and MSW, visual regression, Playwright E2E with POM, contract testing, performance budgets in CI, coverage governance, and flake management.",
};

export default function FrontendTestingArchitectureHLDArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        Designing a frontend testing architecture is not about picking tools —
        it is about defining a strategy that gives teams fast feedback on
        regressions, confidence to refactor, and a CI pipeline that stays green
        without constant maintenance effort. The wrong architecture produces one
        of two failure modes: a sparse test suite that misses real bugs, or an
        over-specified suite of brittle, slow tests that block deploys and are
        routinely skipped because fixing them takes longer than fixing the bug.
      </p>
      <p>
        The right architecture is shaped by the testing pyramid principle, the
        organizational structure (monorepo vs. polyrepo, number of teams, shared
        component library vs. per-app components), the deployment model (static
        site vs. SSR vs. micro-frontends), and the maturity of the existing test
        suite. This article covers the architectural decisions at each level of
        the pyramid and the infrastructure choices that make them work reliably
        at scale.
      </p>

      <h2>Testing Pyramid for Frontend Applications</h2>
      <p>
        The testing pyramid, adapted for frontend, has four layers. The base is
        unit tests — pure functions, utility hooks, state selectors, validation
        logic. These are the fastest and cheapest to write and run, and should
        be most numerous. The second layer is component tests — rendering a single
        component with realistic props and interactions, without full browser or
        server setup. The third layer is integration tests — rendering a page or
        feature slice with real API responses mocked at the network layer, testing
        the full user flow through multiple components. The top of the pyramid is
        E2E tests — a real browser driving a deployed application against a
        staging or preview environment.
      </p>
      <p>
        The pyramid proportions matter as much as the layers. A common anti-
        pattern is an "ice cream cone" — very few unit tests, very few component
        tests, and a massive suite of E2E tests that takes 40 minutes to run. E2E
        tests are the most expensive to write, maintain, and run, and they're the
        most flaky because they depend on network, environment, and timing. They
        should cover critical user journeys (checkout, signup, core feature flows)
        — not every edge case.
      </p>
      <p>
        For a mature product team, a reasonable distribution across 1000 tests:
        400 unit tests (run in under 10 seconds), 400 component/integration tests
        (run in under 60 seconds with Vitest + JSDOM), 150 visual regression
        snapshots (run in parallel in CI), 50 E2E tests (run in 8–12 minutes with
        Playwright parallel workers). This gives high confidence with a total CI
        time of under 15 minutes on a modern CI runner.
      </p>

      <HighlightBlock type="important">
        The metric that matters for test suite health is not code coverage
        percentage — it is mean time to detection of a regression. A 95% coverage
        suite that takes 45 minutes to run will have developers pushing without
        waiting, defeating the purpose. Optimize for fast feedback first, coverage
        second.
      </HighlightBlock>

      <h2>Test Runner Architecture: Vitest in a Monorepo</h2>
      <p>
        Vitest has become the standard test runner for modern frontend monorepos
        because it natively understands Vite's module resolution (no separate
        Jest transform config for TypeScript, CSS modules, or path aliases), runs
        tests in worker threads for true parallelism, and supports hot module
        replacement in watch mode so only affected tests re-run when a file changes.
        In a large monorepo, this makes watch mode tests complete in milliseconds
        rather than seconds.
      </p>
      <p>
        Monorepo test configuration strategy: maintain a root <code>vitest.config.ts</code>{" "}
        that defines the shared environment (JSDOM for browser-like tests), global
        setup files, and path aliases. Each package can extend the root config with
        a local <code>vitest.config.ts</code> that overrides the environment or
        adds package-specific setup (e.g., a component library package uses Happy
        DOM for faster rendering; a Node.js utility package uses the node
        environment).
      </p>
      <p>
        Vitest workspaces allow running all packages' tests in a single command
        (<code>vitest --workspace</code>) with a unified report and shared watch.
        Define the workspace in the root <code>vitest.workspace.ts</code> pointing
        to each package's config. In CI, run workspaces in parallel across multiple
        CI workers using Vitest's shard feature (<code>--shard=1/4</code>,{" "}
        <code>--shard=2/4</code>, etc.) to keep total CI time linear regardless of
        test suite size.
      </p>
      <p>
        For Next.js App Router projects, Vitest requires a separate configuration
        for server components (which run in Node environment) versus client
        components (JSDOM). A common pattern: configure two Vitest projects in the
        workspace config — <code>client</code> (JSDOM, renders components with RTL)
        and <code>server</code> (Node, tests server actions, API routes, data
        fetching functions). Server component tests use a lightweight React server
        rendering API rather than a full browser simulation.
      </p>

      <h2>Component Testing with React Testing Library</h2>
      <p>
        React Testing Library's core philosophy — test behavior, not implementation —
        is an architectural constraint, not just a style preference. It prevents
        tests from coupling to internal state or component hierarchy, which makes
        refactoring safe. A test that queries by <code>role</code> and <code>name</code>{" "}
        will survive a complete rewrite of the component's internals as long as the
        accessible output is the same.
      </p>
      <p>
        At the architectural level, this means enforcing RTL conventions in the
        shared test setup rather than relying on developer discipline. Custom
        render functions (a <code>render</code> wrapper exported from a shared
        test-utils package) ensure every component test has the correct providers
        (React Query, Zustand, theme, router) without boilerplate in each test
        file. The custom render function also sets up MSW handlers consistently,
        so tests don't accidentally make real network requests.
      </p>
      <p>
        Query priority policy: enforce via ESLint rules (<code>testing-library/prefer-screen-queries</code>,
        <code>testing-library/no-node-access</code>) that queries use the RTL
        priority order — getByRole and getByLabelText first, getByText second,
        getByTestId as a last resort only for elements with no accessible role.
        This keeps tests accessible by design: if a component can't be queried by
        role, it has an accessibility problem that needs fixing.
      </p>
      <p>
        Async testing patterns: use <code>findBy</code> queries for elements that
        appear after async operations, and <code>waitFor</code> for asserting
        conditions that require multiple renders to resolve. Never use arbitrary
        timeouts (<code>await new Promise(r =&gt; setTimeout(r, 100))</code>).
        This slows tests and makes them flaky. Use <code>userEvent</code> from
        <code>@testing-library/user-event</code> instead of <code>fireEvent</code>{" "}
        for interactions — it simulates the full user interaction sequence (focus,
        keydown, keyup, change) rather than a synthetic single event, catching bugs
        that only appear with realistic interaction sequences.
      </p>

      <h2>Network Mocking with Mock Service Worker</h2>
      <p>
        MSW (Mock Service Worker) intercepts network requests at the Service Worker
        level in the browser (for E2E and Storybook testing) and at Node's HTTP
        layer in tests (via the Node.js adapter). The key architectural advantage
        over jest.fn() API mocking or axios-mock-adapter is that MSW mocks the
        actual HTTP request — the same handler works regardless of whether the
        component uses fetch, axios, React Query, or SWR. And because the mock
        operates at the network boundary, it tests that the component correctly
        handles the HTTP response format, status codes, and error shapes.
      </p>
      <p>
        Handler organization: define a base set of handlers in a shared
        <code>src/mocks/handlers.ts</code> file that reflects the happy path for
        every API endpoint. Tests that need error states or edge cases call
        <code>server.use()</code> to override specific handlers for the duration
        of that test. This keeps the shared handlers as clean happy-path defaults
        and keeps edge-case overrides local to the tests that need them.
      </p>
      <p>
        In large teams with multiple backend services, maintain handler files per
        service (<code>handlers/auth.ts</code>, <code>handlers/products.ts</code>).
        Use TypeScript types derived from the API's OpenAPI spec to keep handler
        response shapes in sync with the actual API — if the API adds a required
        field, the TypeScript error surfaces in the mock handler immediately,
        alerting the frontend team before the API is deployed to production.
      </p>
      <p>
        For GraphQL APIs, MSW's GraphQL handler supports operation-name-based
        matching. Define a base handler for each query and mutation that returns
        the happy path. Tests override with <code>graphql.query('GetProduct', ...)</code>{" "}
        to return specific data shapes for that test. This is substantially less
        brittle than mocking Apollo Client's internals directly.
      </p>

      <h2>Visual Regression Testing</h2>
      <p>
        Visual regression testing catches unintended UI changes that functional
        tests miss — a CSS specificity change that makes text overflow, a layout
        shift introduced by a dependency update, a color that becomes inaccessible
        against a new background. It compares pixel-level screenshots of rendered
        components or pages against approved baselines.
      </p>
      <p>
        The two main architectural options are Chromatic (a hosted service built
        around Storybook) and Playwright's built-in screenshot comparison. They
        solve different problems and are often used together.
      </p>
      <p>
        Chromatic screenshots every Storybook story on every PR, shows a visual
        diff to reviewers, and requires a human to approve changes before the PR
        can merge. This works well for a component library where designers want
        to review visual changes. The trade-off is that it requires maintaining
        Storybook stories, which is a maintenance burden. Only components with
        stories get tested — components that are only used in full page contexts
        are invisible to Chromatic.
      </p>
      <p>
        Playwright's <code>toHaveScreenshot</code> assertion takes screenshots
        during E2E tests and compares against committed baselines. This covers
        full-page layouts that Storybook can't easily represent. The trade-off is
        that screenshots are sensitive to font rendering differences between
        environments (CI Linux vs developer macOS), which produces false positives.
        Fix this by always running Playwright tests in Docker with a pinned browser
        version, and never comparing screenshots taken on macOS against Linux-
        generated baselines.
      </p>
      <p>
        A combined strategy: Chromatic for component library visual review (catches
        component-level regressions and involves designers in the approval flow),
        Playwright screenshots for full-page smoke tests of critical pages (catches
        integration-level visual regressions like layout collisions between
        components). Run Chromatic on every component library PR; run Playwright
        screenshots on every application PR gated on critical page renders.
      </p>

      <HighlightBlock type="tip">
        Visual regression baseline updates are a constant source of friction.
        Establish a policy: baseline updates require a separate PR from the code
        change, with a comment explaining why the visual change is intentional.
        This prevents developers from silently updating baselines to make failing
        tests pass, which defeats the purpose of visual regression testing.
      </HighlightBlock>

      <h2>End-to-End Testing with Playwright</h2>
      <p>
        Playwright is the current standard for browser automation in frontend
        E2E testing. Its advantages over Cypress include true multi-browser
        support (Chromium, Firefox, WebKit from a single test), support for
        multiple pages and browser contexts in a single test (critical for testing
        real-time collaboration features), parallel test execution with built-in
        worker isolation, and a trace viewer that records full network and DOM
        snapshots for debugging flaky tests.
      </p>
      <p>
        The Page Object Model (POM) is the architectural pattern that keeps E2E
        tests maintainable. Each page or significant UI section is represented by
        a class with methods for interactions and assertions. The test file uses
        POM methods rather than raw Playwright selectors. When a selector changes
        (an element gets renamed or restructured), you update the POM class in
        one place rather than hunting down every test that uses that selector.
      </p>
      <p>
        Selector strategy in POM: use <code>data-testid</code> attributes for
        elements that have no accessible role (e.g., a container div used only as
        a layout wrapper). Use ARIA roles and labels for interactive elements —
        this keeps E2E tests aligned with accessibility requirements. Never use
        CSS class names or element indices as selectors; they change with refactors
        and produce false positives when structure changes but behavior doesn't.
      </p>
      <p>
        Test isolation is the primary reliability mechanism. Each test should
        start from a clean application state: a separate browser context, a
        seeded database (or a consistent mocked API state), and authentication
        via API rather than through the UI (logging in via UI adds 5–10 seconds
        per test and is fragile). Playwright's <code>storageState</code> feature
        lets you save an authenticated session state to a file and reuse it across
        tests, so authentication only happens once per test run.
      </p>
      <p>
        Flake management is an ongoing operational concern for any E2E suite.
        Track flake rate per test over time (Playwright's built-in reporter or
        dedicated platforms like Currents.dev or BuildPulse). Investigate any test
        with a flake rate above 2% — common causes are race conditions on async
        state updates (fix with proper <code>waitFor</code>), environment
        inconsistencies (fix with Docker), timing-dependent assertions (fix with
        retryable assertions), and test interdependence (fix with isolation).
        Mark chronically flaky tests as <code>fixme</code> with a linked ticket
        rather than letting them pollute CI signal.
      </p>

      <h2>Contract Testing for API Boundaries</h2>
      <p>
        In organizations where frontend and backend teams deploy independently,
        contract testing prevents integration failures from reaching production.
        Consumer-driven contract testing (implemented with Pact) lets the frontend
        (consumer) define the API shape it depends on, and the backend (provider)
        verifies that it satisfies those contracts in its own CI pipeline.
      </p>
      <p>
        The workflow: the frontend team writes Pact tests that describe the
        interactions — the request shape and expected response fields. Running
        these tests produces a contract file (a JSON document describing the
        expectations). This file is published to a Pact Broker (a contract
        registry). The backend CI pipeline runs a provider verification step
        that replays the recorded interactions against the real provider API
        and confirms all expectations are met.
      </p>
      <p>
        If the backend changes an API in a way that breaks a consumer's contract,
        the backend's provider verification step fails in CI before the change is
        deployed. This gives the backend team immediate visibility into which
        frontend features would break, and gives the frontend team confidence that
        a backend deploy won't silently break their integration.
      </p>
      <p>
        Contract testing works best for stable, frequently-called APIs (product
        data, user profile, cart). It's overkill for admin-only endpoints or APIs
        in active development where the shape changes weekly. Introduce it
        incrementally: start with the 5 most critical API endpoints and add more
        as the pattern becomes familiar to both teams.
      </p>

      <h2>Performance Budgets in CI</h2>
      <p>
        Performance budgets prevent gradual performance regressions that each
        individually seem small but compound to a poor user experience. Two types
        of budgets belong in CI: bundle size budgets and Lighthouse performance
        budgets.
      </p>
      <p>
        Bundle size budgets use <code>size-limit</code> to assert that each
        JavaScript chunk stays under a defined maximum. Configure per-route budgets
        (homepage bundle must not exceed 150kB gzipped, product detail page bundle
        must not exceed 200kB) rather than a single total budget, because per-route
        budgets catch the case where one route's bundle grows while another's
        shrinks. Run <code>size-limit</code> as a required PR check; PRs that exceed
        the budget require either a code reduction or an explicit budget increase
        with a reviewer's approval.
      </p>
      <p>
        Lighthouse CI budgets use <code>@lhci/cli</code> to run Lighthouse against
        preview deployments and assert metric thresholds. Assert LCP under 2.5s,
        Total Blocking Time under 200ms (the lab proxy for INP), CLS under 0.1,
        and Speed Index under 3.5s for each major page template. Run multiple
        Lighthouse iterations (5 is standard) and take the median to reduce
        variance from the synthetic test environment.
      </p>
      <p>
        A budget that fails CI but has no owner to fix it is useless. Pair every
        budget with an ownership assignment: the team responsible for the route
        is responsible for maintaining its budget. When a budget fails, the PR
        author must either fix the regression or request a budget exception from
        the performance-owning team with justification.
      </p>

      <h2>Coverage Governance</h2>
      <p>
        Code coverage is a useful signal but an easily gamed metric. Teams optimize
        for coverage percentage (by adding trivial tests or by testing implementation
        details) rather than for regression detection. The architectural solution
        is coverage governance based on criticality rather than flat percentage
        thresholds.
      </p>
      <p>
        Critical path coverage: identify the code paths that are most likely to
        cause user-facing failures if broken — checkout flow, authentication,
        payment processing, core data fetching. These must have high branch coverage
        (95%+) enforced in CI. Non-critical utility code (internal formatting
        helpers, developer tools) can have lower or unenforced coverage.
      </p>
      <p>
        Istanbul (used by Vitest) supports per-directory coverage thresholds in
        its configuration. Define thresholds per package: payment-related packages
        require 90% branch coverage; internal dev tooling packages have no
        enforced threshold. This prevents a team from gaming the global coverage
        number by writing tests for easy-to-cover utility functions while leaving
        complex checkout logic uncovered.
      </p>
      <p>
        Mutation testing (using Stryker) goes a step further: it introduces
        artificial bugs (mutations) into the source code and checks whether your
        tests catch them. A test suite with 90% line coverage might have a mutation
        score of 50%, meaning half the artificial bugs are undetected. Mutation
        testing is expensive to run (it re-runs the test suite once per mutation)
        so run it on CI weekly rather than on every PR, focused on the critical
        path modules. Use the results to identify undertested branches, not to
        enforce a score threshold.
      </p>

      <HighlightBlock type="tip">
        Enforce a "no-decrease" coverage rule rather than a fixed threshold:
        coverage on the main branch sets the floor, and PRs cannot reduce coverage.
        This prevents coverage debt from accumulating while not requiring new code
        to be over-tested. Combine with critical-path absolute thresholds for
        the modules where coverage genuinely matters.
      </HighlightBlock>

      <h2>Testing in CI: Pipeline Design</h2>
      <p>
        A frontend test CI pipeline runs multiple job types in parallel to minimize
        wall clock time. A well-structured pipeline: type check (tsc, 60–90s),
        lint (ESLint + Prettier, 30s), unit and component tests (Vitest with
        sharding, 60–120s across 4 workers), visual regression (Chromatic or
        Playwright screenshots, 3–5 min with parallel workers), E2E tests
        (Playwright, 8–12 min with parallel workers against a preview environment),
        bundle size check (size-limit, 30s), and Lighthouse CI (2–3 min per route
        with 5 iterations).
      </p>
      <p>
        Total wall clock time with full parallelism: 12–15 minutes. Without
        parallelism (sequential): 30–45 minutes. The investment in CI
        infrastructure (additional runner capacity, parallelization config) pays
        back in developer productivity within weeks.
      </p>
      <p>
        Test caching is the other major lever. Vitest caches test results by
        content hash — if a file hasn't changed, its tests don't re-run. Combined
        with Turborepo's remote caching (stores CI outputs in a remote cache and
        restores them on cache hits), PRs that touch only a specific package skip
        tests for all other packages. A change to the shared button component
        invalidates all packages that depend on it; a change to a single product
        page component only runs tests for that package.
      </p>
      <p>
        Preview environments are a prerequisite for reliable Playwright and
        Lighthouse CI tests. Vercel, Netlify, and similar platforms create a
        unique preview URL for every PR. Configure Playwright's <code>baseURL</code>
        to point to the preview URL via an environment variable set in CI. This
        ensures E2E tests run against the exact code in the PR rather than against
        a shared staging environment that may have unrelated changes.
      </p>

      <h2>Testing Strategy for Micro-Frontend Architectures</h2>
      <p>
        Micro-frontends introduce a new testing challenge: integration between
        independently deployed remotes. Each remote has its own unit and component
        tests, but the integration of multiple remotes on a shell application is
        not tested at the unit level.
      </p>
      <p>
        The solution is a layered approach: each remote has its own test suite
        covering its own components and logic. The shell application has integration
        tests that mount each remote's exposed component with a mock of the shell's
        context (shared state, routing, auth). E2E tests on the shell application
        use real deployed remotes from staging, testing the full integration.
      </p>
      <p>
        Contract testing between remotes is the micro-frontend equivalent of API
        contract testing: the shell defines the props and events it expects from
        each remote's exposed components, and each remote's CI verifies it
        satisfies those expectations. This prevents the shell team from being
        surprised by a remote team's component API change.
      </p>
      <p>
        Dependency version synchronization is a reliability concern: if the shell
        uses React 18 and a remote bundles its own React 18, singleton resolution
        in Webpack Module Federation should ensure a single React instance. But if
        versions diverge (shell on 18.2.0, remote on 18.3.0), the singleton
        contract breaks and both React instances are loaded. Add a CI check that
        compares shared dependency versions across all remotes and fails if they
        diverge, keeping version bumps coordinated.
      </p>

      <h2>Testing AI-Powered Components</h2>
      <p>
        AI-powered components (streaming chat, AI-generated content, model
        comparison interfaces) present unique testing challenges: responses are
        non-deterministic, streaming responses arrive in chunks, and the latency
        is high. Testing these at the unit/component level requires deterministic
        mock responses.
      </p>
      <p>
        For streaming components, MSW can simulate streaming responses using
        ReadableStream. Define an MSW handler that returns a response with a
        ReadableStream body that yields pre-defined chunks at a defined interval.
        The component test then asserts that each chunk is rendered as it arrives,
        that the "Stop" button cancels the stream, and that errors mid-stream are
        handled correctly. This tests the streaming rendering logic without making
        real LLM API calls.
      </p>
      <p>
        For AI-generated UI components or content, test the rendering and
        validation logic separately from the LLM call. The LLM call is mocked to
        return a fixed JSON component tree. The tests verify that valid JSON is
        rendered correctly, that invalid or unsafe JSON is rejected with the
        correct error state, and that the validation rules are applied consistently.
        The correctness of the LLM output is an evaluation problem, not a unit
        testing problem.
      </p>

      <h2>Interview Questions and Answers</h2>

      <h3>Q: How do you decide how many E2E tests to write versus component tests?</h3>
      <p>
        E2E tests are expensive — slow to run, slow to write, and prone to flakiness
        from environmental factors. They should be reserved for critical user journeys
        where the risk of failure is high and the cost of a missed bug is high:
        signup, login, checkout, core feature completion flows. For everything else,
        prefer component and integration tests with MSW for network mocking — they
        run in milliseconds, are deterministic, and test the same behavior at much
        lower cost. The rule of thumb: if a bug would be caught by a component test,
        don't write an E2E test for it. Only write an E2E test for scenarios that
        require a real browser, real routing, and real (or realistically simulated)
        backend integration.
      </p>

      <h3>Q: Your E2E test suite is 40% flaky. What is your remediation plan?</h3>
      <p>
        First, quantify: generate a flake report by test name over the past 30 days.
        Group by failure type — timeout, selector not found, assertion mismatch on
        async content, environment-specific failure. For timeout/async failures,
        audit the tests for hard-coded waits and replace with proper waitFor
        assertions. For selector failures, check whether tests are using fragile
        selectors (CSS class names, nth-child indices) and migrate to role/testid.
        For environment-specific failures, investigate whether tests share state
        (a test that doesn't clean up leaves dirty state for the next test), and
        enforce isolation with per-test database seeding and clean auth state.
        For structural issues (tests assuming a specific execution order), enforce
        randomized test order in CI. Mark the top 10 most-flaky tests as fixme
        with owners assigned. Ship a flake rate dashboard and set a team goal of
        under 2% flake rate per test within one sprint. Don't try to fix everything
        at once — prioritize by impact on CI reliability.
      </p>

      <h3>Q: How do you keep bundle size under control as the application grows?</h3>
      <p>
        Three layers: CI enforcement with size-limit (PRs that exceed budget fail),
        bundle analysis on every significant PR using bundle-analyzer to visualize
        what's in each chunk, and a quarterly review of third-party dependencies
        using bundlephobia to evaluate the cost of each. Ownership assignment
        matters: the team owning each route owns its bundle budget, so there's
        someone accountable when the budget fails. When a budget increase is needed,
        require it to be documented in the PR with a justification and a plan to
        recover (e.g., "adding this library adds 20kB but we'll remove the two
        legacy polyfills in the next sprint for a net -5kB"). Without this friction,
        bundles grow by default because developers add libraries without removing
        equivalent weight.
      </p>

      <h3>Q: How do you test across a shared component library consumed by multiple applications?</h3>
      <p>
        The component library has its own test suite: unit tests for utility hooks
        and logic, component tests for every exported component (rendering, variants,
        accessibility, keyboard interaction), and visual regression (Chromatic) for
        all stories. Each consuming application also has integration tests that use
        the library components as black boxes — they test behavior from the user's
        perspective, not implementation of the library.
      </p>
      <p>
        The critical coordination point is change notification. When the component
        library ships a new major version, applications need to test against the
        new version before upgrading. A monorepo with Turborepo handles this by
        running affected tests across all packages that depend on the library when
        the library changes. In a polyrepo, maintain a compatibility matrix and
        run each application's test suite against the release candidate version
        of the library before the final publish — a pre-publish testing step that
        catches breaking changes before consumers are affected.
      </p>
    </ArticleLayout>
  );
}
