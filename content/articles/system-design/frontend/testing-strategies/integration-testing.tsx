"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-integration-testing",
  title: "Integration Testing",
  description:
    "Comprehensive guide to frontend integration testing covering component integration, API mocking, database testing, test boundaries, contract testing, and production implementation patterns.",
  category: "frontend",
  subcategory: "testing-strategies",
  slug: "integration-testing",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-03",
  tags: [
    "frontend",
    "integration testing",
    "component integration",
    "API testing",
    "contract testing",
    "MSW",
  ],
  relatedTopics: [
    "unit-testing",
    "e2e-testing",
    "ci-cd-pipelines",
  ],
};

export default function IntegrationTestingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Integration testing</strong> verifies that multiple units work together correctly — it tests the interactions between components, modules, or services. Unlike unit testing (which tests individual units in isolation), integration testing tests how units communicate: does a component correctly receive data from an API and render it? Does a form correctly submit data to a backend and handle the response? Does a state management library correctly propagate state changes to subscribed components? Integration tests catch bugs that unit tests cannot — bugs in the interfaces between units, where individual units work correctly but their interaction fails.
        </p>
        <p>
          For staff-level engineers, integration testing is the bridge between unit testing and end-to-end testing. Unit tests provide confidence in individual code, E2E tests provide confidence in the full system, and integration tests provide confidence in the connections between units. Integration tests are slower than unit tests (they involve more code, more dependencies, more setup) but faster than E2E tests (they do not require a full browser, real APIs, or full system setup). The optimal testing strategy uses many unit tests (fast, isolated), fewer integration tests (moderate speed, combined), and few E2E tests (slow, full system) — the testing pyramid.
        </p>
        <p>
          Frontend integration testing involves several technical considerations. Component integration (testing how multiple components work together — parent-child communication, context providers, state propagation), API integration (testing how the frontend interacts with backend APIs — request formatting, response parsing, error handling, retry logic), test boundaries (deciding what to mock and what to test with real implementations — mock external APIs, test internal component interactions with real implementations), contract testing (verifying that the frontend and backend agree on API contracts — request format, response format, error codes), and test performance (integration tests are slower than unit tests — optimize by mocking only external dependencies, using real implementations for internal modules).
        </p>
        <p>
          The business case for integration testing is catching interface bugs before they reach production. Interface bugs are among the most common and costly production issues — individual units work correctly, but their interaction fails (a component sends data in the wrong format, an API returns unexpected data, a state change does not propagate correctly). Integration tests catch these bugs early, before they are deployed. For organizations practicing continuous deployment, integration testing is essential for maintaining release velocity while managing the risk of interface bugs.
        </p>
        <p>
          Modern frontend integration testing leverages tools like Testing Library (rendering components with real child components, testing user-facing behavior), MSW (Mock Service Worker — intercepting API requests at the network level, providing realistic API mocking), and Vitest or Jest (test execution, assertions, coverage). These tools enable integration tests that resemble real user behavior while maintaining test isolation (external APIs are mocked, but internal component interactions are real).
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Component Integration:</strong> Testing how multiple components work together. Render a parent component with its child components (real implementations, not mocks), simulate user interactions, and verify the rendered output. Component integration tests verify that parent-child communication works correctly (props are passed, events are emitted, state is shared), context providers work correctly (values are provided, consumed, updated), and state propagation works correctly (state changes in one component trigger re-renders in subscribed components).
          </li>
          <li>
            <strong>API Integration:</strong> Testing how the frontend interacts with backend APIs. Mock API responses at the network level (using MSW or similar tools), render the component, and verify that the component correctly sends requests (correct URL, method, headers, body) and handles responses (renders data on success, displays error on failure, shows loading state during request). API integration tests verify request formatting, response parsing, error handling, retry logic, and loading states.
          </li>
          <li>
            <strong>Test Boundaries:</strong> Deciding what to mock and what to test with real implementations. The principle is: mock external dependencies (APIs, browser APIs, third-party libraries) that are impractical to test, and use real implementations for internal dependencies (child components, utility functions, state management). This ensures that integration tests are realistic (they test actual component interactions) while remaining isolated (external dependencies are controlled). The boundary between mock and real is the key design decision in integration testing.
          </li>
          <li>
            <strong>Contract Testing:</strong> Verifying that the frontend and backend agree on API contracts (request format, response format, error codes). Contract tests are shared between frontend and backend teams — the frontend defines what it expects from the API, the backend defines what it provides, and contract tests verify that the two agree. Contract tests catch interface mismatches early (before integration), prevent breaking changes (a backend change that breaks the frontend contract is detected), and enable independent team development (frontend and backend teams can develop independently, verified by contract tests).
          </li>
          <li>
            <strong>Mock Service Worker (MSW):</strong> A library that intercepts API requests at the network level (using Service Worker API in the browser, and node request interception in Node.js). MSW provides realistic API mocking — the frontend code makes real fetch calls, MSW intercepts them and returns mocked responses. This is more realistic than mocking the fetch function directly (the frontend code does not know it is being mocked, so the test is closer to real behavior). MSW supports request matching (different responses for different request parameters), response delays (simulating network latency), and error responses (testing error handling).
          </li>
          <li>
            <strong>Test Database:</strong> For integration tests that involve database interactions (full-stack integration tests), use a test database (separate from production and development databases). The test database is set up before tests (seeded with test data), used during tests (API calls interact with the test database), and torn down after tests (data is cleaned). Test databases ensure that integration tests are isolated (tests do not affect each other&apos;s data), deterministic (test data is controlled), and safe (tests do not affect production data).
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/testing-strategies/integration-test-boundaries.svg"
          alt="Integration Test Boundaries showing what is mocked (external APIs) and what is real (internal components) in integration tests"
          caption="Integration test boundaries — external dependencies (APIs, browser APIs) are mocked, internal dependencies (components, utilities) use real implementations"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Integration testing architecture consists of the test framework (Jest, Vitest — executes tests, provides assertions), the rendering engine (Testing Library — renders components with real child components), the mocking layer (MSW — intercepts API requests, returns mocked responses), and the assertion layer (verifying rendered output, API interactions, state changes). The flow begins with setting up the test environment (configuring MSW handlers, seeding test data), rendering the component tree (parent component with real child components), simulating user interactions (clicks, form submissions, navigation), and verifying the result (rendered output, API calls, state changes).
        </p>
        <p>
          For API integration tests, the flow involves the component making a real fetch call, MSW intercepting the call, matching the request against defined handlers, returning a mocked response, and the component handling the response (rendering data, displaying errors, showing loading states). This flow is realistic — the component code is unaware of the mock, so the test verifies actual component behavior, not mock interactions.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/testing-strategies/msw-api-flow.svg"
          alt="MSW API Flow showing component making fetch request, MSW intercepting it, and returning mocked response"
          caption="MSW API flow — component makes real fetch call, MSW intercepts at network level, matches request against handlers, returns mocked response, component handles response"
          width={900}
          height={500}
        />

        <h3>Integration vs. Unit Testing Scope</h3>
        <p>
          <strong>Unit Testing Scope:</strong> Test individual functions, components, or modules in isolation. Mock all dependencies. Verify input-output behavior. Fast (milliseconds), numerous, isolated. Best for: utility functions, pure logic, individual components, hooks.
        </p>
        <p>
          <strong>Integration Testing Scope:</strong> Test how multiple units work together. Mock only external dependencies (APIs, browser APIs). Use real implementations for internal dependencies. Moderate speed (seconds), fewer than unit tests, combined. Best for: component trees, API interactions, state management, form submissions.
        </p>
        <p>
          <strong>Overlap and Gaps:</strong> Unit tests catch bugs in individual units, integration tests catch bugs in unit interactions, E2E tests catch bugs in the full system. Some bugs are only caught by integration tests (component communication failures, API response parsing errors, state propagation issues) — neither unit tests nor E2E tests catch these efficiently. Integration tests fill the gap between unit tests and E2E tests, providing confidence in unit interactions without the cost of full system tests.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/testing-strategies/component-integration.svg"
          alt="Component Integration showing parent component communicating with child components through props, events, and context"
          caption="Component integration — parent component passes props to children, children emit events to parent, context provider shares state across component tree"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Integration testing involves trade-offs between test realism and test isolation, test speed and test coverage, and mocking overhead and test reliability. Understanding these trade-offs is essential for designing effective integration testing strategies.
        </p>

        <h3>Mock External APIs vs. Test with Real APIs</h3>
        <p>
          <strong>Mock External APIs:</strong> Use MSW or similar tools to intercept API requests and return mocked responses. Advantages: tests are isolated (not affected by API availability or data changes), tests are deterministic (mocked responses are predictable), tests are fast (no network latency). Limitations: mocks may not accurately reflect real API behavior (mocked response format may differ from real response, edge cases may not be covered), tests may pass while integration fails (mock is correct, real API is broken). Best for: CI/CD pipelines, frequent test runs, API not yet available.
        </p>
        <p>
          <strong>Test with Real APIs:</strong> Make real API calls to a test backend. Advantages: tests are realistic (they test actual API interactions), tests catch API mismatches (request format errors, response parsing errors). Limitations: tests are slower (network latency), tests are less reliable (API may be unavailable, test data may change), tests require test backend infrastructure. Best for: staging environment validation, contract testing, pre-deployment verification.
        </p>

        <h3>Testing Library vs. Snapshot Testing</h3>
        <p>
          <strong>Testing Library:</strong> Query rendered output by user-facing attributes (text content, roles, labels). Advantages: tests are resilient to implementation changes (DOM structure changes do not break tests, as long as user-facing attributes are unchanged), tests verify actual user experience. Limitations: tests are more verbose (queries require specific selectors), tests may miss visual issues (layout changes are not detected). Best for: component integration tests, user-facing feature tests.
        </p>
        <p>
          <strong>Snapshot Testing:</strong> Capture the rendered output as a snapshot, compare future renders against the snapshot. Advantages: tests are concise (one assertion captures the entire output), tests catch unexpected output changes. Limitations: tests are fragile (any output change breaks the test, even if the change is intentional), tests do not verify behavior (only output, not interactions), snapshot reviews are tedious (large diffs are hard to review). Best for: static components (output rarely changes), regression detection (catching unintended output changes).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/testing-strategies/contract-testing.svg"
          alt="Contract Testing showing frontend and backend agreeing on API contracts with shared contract tests"
          caption="Contract testing — frontend defines expected API contract, backend defines provided contract, shared contract tests verify agreement, catching mismatches early"
          width={900}
          height={500}
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Mock at the Network Layer:</strong> Use MSW to intercept API requests at the network level, not by mocking the fetch function or API client. Network-level mocking is more realistic — the frontend code makes real fetch calls, MSW intercepts them, so the test verifies actual component behavior (including request formatting, error handling, retry logic). Mocking the fetch function directly is less realistic (the frontend code knows it is being mocked, so the test may not catch real-world issues).
          </li>
          <li>
            <strong>Test User Behavior, Not Implementation:</strong> Use Testing Library&apos;s queries (getByText, getByRole, getByLabelText) to find elements by their user-facing attributes, not by implementation details (CSS classes, data attributes). Simulate user interactions (click, type, submit) rather than calling component methods directly. Verify rendered output (text content, element presence) rather than component state. This makes tests resilient to refactoring — changing the component&apos;s internal logic does not break the test, as long as user behavior is unchanged.
          </li>
          <li>
            <strong>Keep Integration Tests Focused:</strong> Each integration test should verify one interaction (one API call, one component communication, one state propagation). Do not test everything in one test — if a test fails, it is hard to identify the root cause. Write multiple focused tests (each testing one interaction) rather than one comprehensive test (testing everything). Focused tests are easier to debug, maintain, and understand.
          </li>
          <li>
            <strong>Use Real Implementations for Internal Dependencies:</strong> Do not mock child components, utility functions, or state management libraries — use their real implementations. Mocking internal dependencies reduces integration tests to unit tests (testing the component in isolation), defeating the purpose of integration testing. Only mock external dependencies (APIs, browser APIs, third-party libraries) that are impractical to test.
          </li>
          <li>
            <strong>Set Up and Tear Down Test Data:</strong> For integration tests that involve databases or persistent state, set up test data before each test (seed the database with known data) and tear down after each test (clean the database). This ensures that tests are isolated (tests do not affect each other&apos;s data) and deterministic (test data is controlled). Use test database fixtures (predefined data sets) for consistent test data.
          </li>
          <li>
            <strong>Run Integration Tests in CI/CD:</strong> Configure your CI/CD pipeline to run integration tests on every pull request. Integration tests catch interface bugs before they are merged, providing confidence that component interactions work correctly. Integration tests are slower than unit tests, so run them after unit tests pass (fail fast — if unit tests fail, skip integration tests). Use parallel test execution to reduce total pipeline duration.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Over-Mocking Internal Dependencies:</strong> Mocking child components, utility functions, or state management libraries. This reduces integration tests to unit tests, defeating the purpose of integration testing. Integration tests should test how units work together — if all dependencies are mocked, there is no integration to test. Only mock external dependencies (APIs, browser APIs, third-party libraries).
          </li>
          <li>
            <strong>Testing Too Much in One Test:</strong> Writing comprehensive integration tests that verify everything (multiple API calls, multiple component interactions, multiple state changes). These tests are slow, difficult to debug (when the test fails, it is hard to identify which interaction failed), and brittle (any change breaks the test). Write focused tests — each test verifies one interaction.
          </li>
          <li>
            <strong>Inaccurate API Mocks:</strong> Mocked API responses that do not match real API behavior (different response format, missing fields, incorrect error codes). This causes tests to pass while integration fails (the component works with the mock, but fails with the real API). Keep API mocks synchronized with real API responses — use contract testing, update mocks when the API changes, and periodically test with real APIs.
          </li>
          <li>
            <strong>Shared Test State:</strong> Tests that share state (database, global variables, module-level state) affecting each other&apos;s results. This causes flaky tests (tests pass or fail depending on execution order) and makes tests difficult to debug. Ensure that each test is isolated — set up test data before each test, clean up after each test, and avoid global state.
          </li>
          <li>
            <strong>Slow Integration Tests:</strong> Integration tests that take minutes to execute. Slow tests discourage frequent test runs, block CI/CD pipelines, and indicate architectural issues (too many real dependencies, inefficient test setup). Optimize by mocking unnecessary external dependencies, using in-memory databases instead of real databases, running tests in parallel, and caching test setup (reuse setup results across tests).
          </li>
          <li>
            <strong>Missing Error Path Testing:</strong> Testing only the happy path (successful API response, valid user input, expected state changes) without testing error paths (API errors, invalid input, unexpected state). Error paths are where most bugs occur — the happy path is well-tested, but error paths are often neglected. Test error paths: API errors (network failure, server error, timeout), invalid input (missing fields, wrong format, boundary values), and unexpected state (null values, empty arrays, missing context).
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Form Submission Integration</h3>
        <p>
          Form submission involves multiple components working together — the form component collects input, the validation component checks input validity, the API component sends data to the backend, and the feedback component displays success or error messages. Integration tests verify that the entire flow works: fill in the form, submit, verify that the API is called with correct data, verify that the success message is displayed. Integration tests also verify error paths: submit invalid data, verify that validation errors are displayed, verify that the API is not called.
        </p>

        <h3>Data Fetching and Rendering</h3>
        <p>
          Components that fetch data from APIs and render it involve integration between the component, the API client, and the rendering logic. Integration tests verify that the component correctly sends the API request (correct URL, method, headers), handles the response (renders data on success, displays error on failure, shows loading state during request), and handles edge cases (empty data, pagination, caching). MSW is used to mock API responses at the network level, ensuring realistic testing.
        </p>

        <h3>State Management Integration</h3>
        <p>
          State management libraries (Redux, Zustand, Context API) propagate state changes across components. Integration tests verify that state changes in one component trigger re-renders in subscribed components, that state is correctly shared across components, and that state updates are atomic (concurrent updates do not cause race conditions). Integration tests render the full component tree (provider, consumers, updaters) and verify that state propagation works correctly.
        </p>

        <h3>Contract Testing Between Frontend and Backend</h3>
        <p>
          Contract tests verify that the frontend and backend agree on API contracts — request format (method, URL, headers, body), response format (status code, headers, body fields), and error codes (error messages, error types). Contract tests are shared between frontend and backend teams — the frontend defines expected contracts, the backend defines provided contracts, and contract tests verify agreement. Contract tests catch interface mismatches early (before integration), prevent breaking changes (a backend change that breaks the frontend contract is detected), and enable independent team development.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between unit testing and integration testing?
            </p>
            <p className="mt-2 text-sm">
              A: Unit testing tests individual functions, components, or modules in isolation — all dependencies are mocked, and the test verifies input-output behavior. Integration testing tests how multiple units work together — only external dependencies are mocked, internal dependencies use real implementations. Unit tests are fast (milliseconds), numerous, and isolated. Integration tests are slower (seconds), fewer, and combined. Unit tests catch bugs in individual units, integration tests catch bugs in unit interactions. Both are essential — unit tests provide confidence in individual code, integration tests provide confidence in code interactions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is MSW and why is it preferred over mocking fetch directly?
            </p>
            <p className="mt-2 text-sm">
              A: MSW (Mock Service Worker) is a library that intercepts API requests at the network level using the Service Worker API (in the browser) or node request interception (in Node.js). MSW is preferred over mocking fetch directly because it is more realistic — the frontend code makes real fetch calls, MSW intercepts them and returns mocked responses, so the frontend code is unaware of the mock. This means the test verifies actual component behavior (including request formatting, error handling, retry logic), not just mock interactions. Mocking fetch directly is less realistic — the frontend code knows it is being mocked (the mock is injected), so the test may not catch real-world issues (request formatting errors, network errors).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is contract testing and when should you use it?
            </p>
            <p className="mt-2 text-sm">
              A: Contract testing verifies that the frontend and backend agree on API contracts — request format (method, URL, headers, body), response format (status code, headers, body fields), and error codes (error messages, error types). Contract tests are shared between frontend and backend teams — the frontend defines expected contracts, the backend defines provided contracts, and contract tests verify agreement. Use contract testing when frontend and backend teams develop independently (to catch interface mismatches before integration), when the API is consumed by multiple clients (web, mobile, third-party) to ensure consistency, and when the API changes frequently (to catch breaking changes early).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you decide what to mock in integration tests?
            </p>
            <p className="mt-2 text-sm">
              A: The principle is: mock external dependencies (APIs, browser APIs, third-party libraries) that are impractical to test, and use real implementations for internal dependencies (child components, utility functions, state management). External dependencies are mocked because they are outside your control (APIs may be unavailable, browser APIs may behave differently across browsers, third-party libraries may change). Internal dependencies use real implementations because integration tests test how units work together — if internal dependencies are mocked, there is no integration to test. The boundary between mock and real is the key design decision in integration testing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle test data in integration tests?
            </p>
            <p className="mt-2 text-sm">
              A: For integration tests that involve databases or persistent state, use a test database (separate from production and development databases). Set up test data before each test (seed the database with known data using fixtures), use the test data during tests (API calls interact with the test database), and tear down after each test (clean the database to ensure isolation). Use test database fixtures (predefined data sets) for consistent test data. Avoid shared test state (tests should not affect each other&apos;s data) — each test should set up its own data and clean up after itself.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you optimize slow integration tests?
            </p>
            <p className="mt-2 text-sm">
              A: Strategies: mock unnecessary external dependencies (only mock what you need, use real implementations for internal dependencies), use in-memory databases instead of real databases (faster setup, no network latency), run tests in parallel (Jest and Vitest support parallel test execution), cache test setup (reuse setup results across tests instead of re-setting up for each test), and use focused tests (each test verifies one interaction, not everything). Monitor test execution time and investigate tests that are slower than average. Slow integration tests discourage frequent test runs and block CI/CD pipelines — optimizing them is essential for maintaining development velocity.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://testing-library.com/docs/react-testing-library/intro/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Testing Library — React Testing Library
            </a>
          </li>
          <li>
            <a
              href="https://mswjs.io/docs/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MSW — Mock Service Worker Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.pact.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Pact — Contract Testing Framework
            </a>
          </li>
          <li>
            <a
              href="https://kentcdodds.com/blog/write-tests"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Kent C. Dodds — Write Tests Guide
            </a>
          </li>
          <li>
            <a
              href="https://martinfowler.com/bliki/IntegrationTest.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Martin Fowler — Integration Test
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
