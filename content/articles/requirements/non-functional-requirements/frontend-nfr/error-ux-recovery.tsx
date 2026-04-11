"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-error-ux-recovery",
  title: "Error UX & Recovery",
  description:
    "Comprehensive guide to error handling UX, error boundaries, user-friendly error messages, retry patterns, and recovery flows for resilient frontend applications.",
  category: "frontend",
  subcategory: "nfr",
  slug: "error-ux-recovery",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-11",
  tags: [
    "frontend",
    "nfr",
    "error-handling",
    "ux",
    "resilience",
    "error-boundaries",
    "recovery",
  ],
  relatedTopics: [
    "error-states",
    "loading-states",
    "frontend-observability",
    "offline-support",
  ],
};

export default function ErrorUXRecoveryArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Error UX &amp; Recovery</strong> encompasses how applications
          handle, display, and help users recover from errors across the entire
          user journey. This includes network failures, API errors (HTTP 4xx and
          5xx responses), validation errors, application crashes (JavaScript
          exceptions), and unexpected application states. Good error UX
          transforms frustrating failures into manageable setbacks that users
          can understand and overcome. Poor error UX — cryptic messages,
          unhandled exceptions, blank screens, and lost user work — erodes
          trust, generates support tickets, and directly impacts revenue through
          abandoned tasks and lost conversions.
        </p>
        <p>
          For staff engineers, error handling is a critical quality attribute
          that distinguishes professional applications from amateur ones. All
          systems fail eventually — networks are unreliable, APIs return errors,
          databases experience outages, and bugs reach production despite
          testing. The difference is not whether errors occur but how gracefully
          the application handles them. A resilient application degrades
          gracefully, preserves user work, provides clear recovery paths, and
          surfaces errors to monitoring systems for investigation and resolution.
        </p>
        <p>
          Error handling spans multiple layers of the application architecture.
          At the component level, React Error Boundaries catch rendering errors
          and display fallback UI instead of crashing the entire application. At
          the network level, HTTP interceptors catch API errors and implement
          retry logic with exponential backoff. At the user experience level,
          error messages are crafted to be clear, actionable, and empathetic. At
          the monitoring level, errors are captured with full context (user ID,
          session, browser, stack trace) and sent to error tracking services
          like Sentry for aggregation and alerting.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Error classification is the foundation of appropriate error handling.
          Errors can be categorized by their source: network errors (connection
          failures, timeouts, DNS resolution failures, offline state) are often
          transient and recoverable with retry. API errors include HTTP status
          codes — 400 Bad Request indicates invalid input that the user can fix,
          401 Unauthorized means the session has expired and requires
          re-authentication, 403 Forbidden indicates insufficient permissions,
          404 Not Found means the resource does not exist, and 5xx codes
          indicate server-side problems that the user cannot fix. Validation
          errors are user-fixable with clear guidance on what is wrong and how
          to correct it. Application errors (JavaScript exceptions) often
          indicate bugs and may require a page reload or support contact.
        </p>
        <p>
          Errors can also be classified by recoverability. Transient errors
          (network timeouts, 503 Service Unavailable, rate limiting with
          Retry-After header) are automatically recoverable — the application
          should retry with exponential backoff without user involvement.
          User-fixable errors (validation failures, missing required fields)
          require clear error messages with specific fix instructions. Errors
          requiring intervention (authentication expiry, payment failure,
          account lockout) need guided recovery flows that walk the user through
          resolution. Terminal errors (resource deleted, account banned, fatal
          application errors) cannot be resolved by the user and should
          acknowledge the situation, provide next steps (contact support, return
          home), and log the incident for investigation.
        </p>
        <p>
          Error severity determines the appropriate user-facing response. Info
          severity (non-blocking notifications like &quot;Changes saved&quot;)
          is dismissible and does not block workflow. Warning severity
          (&quot;Unsaved changes will be lost&quot;) allows the user to proceed
          or cancel. Error severity (&quot;Failed to upload file&quot;) blocks
          the specific operation but the application remains functional. Critical
          severity (&quot;Unable to connect to server&quot;) blocks the entire
          workflow and requires immediate user action. Each severity level maps
          to a specific UI pattern — toast notifications for info, confirmation
          dialogs for warnings, inline error messages for operation errors, and
          full-page error states for critical failures.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/error-classification.svg"
          alt="Error Classification Matrix"
          caption="Error classification by source, recoverability, and severity — mapping each category to appropriate handling strategies and UX patterns"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          React Error Boundaries provide a component-level safety net that
          catches JavaScript errors during rendering, lifecycle methods, and
          constructors of the child component tree. When an error is caught,
          the boundary renders a fallback UI instead of the crashed component
          tree, logs the error to a monitoring service, and allows the rest of
          the application to continue functioning. Error boundaries do not catch
          errors in event handlers, asynchronous code (setTimeout, Promise
          rejections), server-side rendering, or errors thrown within the
          boundary itself — these require separate handling mechanisms. The
          recommended approach is to use libraries like react-error-boundary
          that provide a clean API with retry capability and FallbackComponent
          customization.
        </p>
        <p>
          Error boundary placement strategy determines the granularity of error
          isolation. An app-level boundary provides a last line of defense — if
          any unhandled error bubbles up, the user sees a &quot;something went
          wrong&quot; message with a reload option. Route-level boundaries
          isolate errors to individual routes — a crash in the settings page
          does not affect the dashboard. Component-level boundaries protect
          individual widgets — a crashed comments section does not break the
          article page. The recommended architecture uses all three layers:
          component-level for critical widgets (comments, recommendations, user
          profile), route-level for major sections, and app-level as the final
          safety net.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/error-boundary-hierarchy.svg"
          alt="Error Boundary Hierarchy"
          caption="Error boundary placement strategy — app-level (last defense), route-level (section isolation), and component-level (widget protection) for graceful degradation"
        />

        <p>
          Retry patterns handle transient errors automatically without user
          involvement. Exponential backoff progressively increases the delay
          between retry attempts (1 second, 2 seconds, 4 seconds, 8 seconds, 16
          seconds) to avoid overwhelming servers during outages. Jitter
          (randomness added to each delay) prevents the thundering herd problem
          where many clients retry simultaneously. Retry should only be
          attempted for transient errors — network timeouts, 502 Bad Gateway,
          503 Service Unavailable, 504 Gateway Timeout, and 429 Too Many
          Requests (respecting the Retry-After header). Retrying 4xx client
          errors (400, 401, 403, 404) is futile because the error will persist
          until the user changes their request.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/error-recovery-flows.svg"
          alt="Error Recovery Flow Diagram"
          caption="Common error recovery flows — authentication recovery (session expiry, token refresh), network recovery (offline detection, reconnection, conflict handling), and form recovery (auto-save, input preservation)"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Automatic retry versus user-controlled retry presents a UX trade-off.
          Automatic retry with exponential backoff provides the best user
          experience for transient errors — the user never sees the error
          because it resolves transparently. However, automatic retry can mask
          persistent problems (the server is down for hours) by continuously
          retrying in the background, consuming bandwidth and battery. The
          compromise is automatic retry with a maximum attempt limit (3-5
          attempts) and a user-visible retry option after the limit is reached.
          Show &quot;Retrying...&quot; with a cancel button so the user can stop
          retries and take manual action.
        </p>
        <p>
          Optimistic UI updates (updating the interface immediately before
          server confirmation) create the perception of instant response but
          introduce rollback complexity. When the server rejects the operation,
          the application must revert the UI change, show an error, and offer
          retry. This works well for operations with high success rates (liking
          posts, adding items to cart, following users) where the rollback
          scenario is rare. It is inappropriate for critical operations
          (payments, form submissions, irreversible actions) where server
          confirmation is required before showing success. The trade-off is
          perceived speed versus data consistency — optimistic UI feels instant
          but requires robust rollback logic.
        </p>
        <p>
          Error boundary scope affects both user experience and debugging
          capability. Fine-grained boundaries (per-component) provide the best
          user experience — a crashed widget does not affect the rest of the
          page — but make it harder to detect systemic problems because errors
          are silently caught and handled locally. Coarse-grained boundaries
          (per-route or per-app) make errors more visible to users and
          developers but provide a worse experience because a single component
          crash takes down the entire page. The layered approach (component,
          route, and app boundaries) balances both concerns — component
          boundaries handle expected failures gracefully, route boundaries catch
          unexpected section-level crashes, and the app boundary catches truly
          catastrophic errors.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Craft error messages that are clear, specific, and actionable. State
          the problem in plain language (&quot;Unable to save document&quot;
          rather than &quot;Error 500&quot;), explain why it happened when
          helpful (&quot;The file is too large — maximum size is 10MB&quot;),
          and provide specific guidance on how to fix it (&quot;Try reducing
          file size or compressing the image&quot;). Include recovery options —
          buttons for &quot;Retry,&quot; &quot;Upload smaller file,&quot; or
          &quot;Contact support&quot; — so the user always has a next step. Use
          an empathetic tone that does not blame the user (&quot;We could not
          complete your request&quot; rather than &quot;You entered invalid
          data&quot;).
        </p>
        <p>
          Preserve user work whenever possible. Form inputs should not be
          cleared on submission errors — display the error next to the
          problematic field and let the user fix and resubmit. Implement
          auto-save drafts to localStorage so that if the browser crashes or the
          user navigates away, their work is recoverable. For file uploads,
          preserve the selected file reference so the user does not have to
          re-select it on retry. For multi-step forms, save progress after each
          step so users can resume from where they left off. The principle is
          that errors should never cost the user their work.
        </p>
        <p>
          Implement comprehensive error monitoring with context-rich reporting.
          Every error should be captured with the error message, stack trace,
          user identifier (anonymized), session ID, page URL, browser and OS
          information, network status, recent user actions, and application
          state snapshot. Group similar errors together to identify trends and
          avoid alert fatigue. Ignore known or benign errors (network timeouts
          during brief connectivity loss) while alerting on new error types or
          spikes in error frequency. Use tools like Sentry, LogRocket, or
          DataDog RUM for aggregation, grouping, and alerting.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Displaying technical error messages to users is one of the most common
          and frustrating UX mistakes. Error messages like
          &quot;NullPointerException at line 234&quot; or &quot;Error
          0x80070005&quot; mean nothing to users and provide no guidance on
          what to do next. Even generic messages like &quot;Something went
          wrong&quot; are unhelpful because they do not tell the user whether
          the problem is on their end, whether it is temporary, or what action
          they should take. Every error displayed to users should answer three
          questions: what happened, why did it happen (if helpful), and what can
          I do about it.
        </p>
        <p>
          Swallowing errors silently is equally problematic. When an API call
          fails and the application shows no error indication, the user assumes
          the operation succeeded — leading to confusion when expected results
          do not appear. Console-only errors are invisible to users and
          unactionable because the user cannot report what they cannot see. The
          minimum error handling requirement is that every user-initiated
          operation provides visible feedback on both success and failure. For
          non-critical operations (loading a comments widget, fetching
          recommendations), a subtle inline error is sufficient. For critical
          operations (form submission, payment processing), a prominent error
          message with retry options is required.
        </p>
        <p>
          Failing to handle errors in React event handlers is a subtle bug that
          Error Boundaries do not catch. Error Boundaries only catch errors
          during rendering, lifecycle methods, and constructors — errors thrown
          inside onClick handlers, form submit handlers, or event callbacks
          propagate differently. These errors must be caught with try/catch
          blocks within the handler itself, or by wrapping the handler in an
          error-catching utility. Similarly, Promise rejections from async
          operations (fetch calls, database queries) must be caught with
          try/catch in async functions or .catch() handlers on Promise chains.
          Unhandled Promise rejections are a common source of silent failures.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Financial applications handle errors with the highest level of care
          because mistakes have real monetary consequences. Payment processing
          errors display specific decline reasons (&quot;Insufficient
          funds&quot; versus &quot;Card expired&quot;), offer alternative
          payment methods, preserve the cart and billing information for retry,
          and provide a &quot;Pay later&quot; option for persistent issues.
          Transaction failures are logged with full context for audit purposes,
          and users receive email notifications of failed transactions with
          resolution instructions. The error UX must balance urgency (the user
          needs to know the payment failed) with reassurance (their money is
          safe, no duplicate charges occurred).
        </p>
        <p>
          Social media applications handle errors at massive scale with
          millions of concurrent operations. Twitter and Instagram use
          optimistic UI for likes, follows, and retweets — the interface updates
          instantly and rolls back silently if the server rejects the operation
          (which is rare for these operations). For less common operations
          (posting a tweet, uploading a photo), they show explicit loading
          states and error messages with retry options. Network errors during
          feed loading show a &quot;Tap to retry&quot; banner while preserving
          the previously loaded content. This approach handles the high volume
          of common operations gracefully while providing clear recovery paths
          for less frequent failures.
        </p>
        <p>
          Offline-capable applications face the most complex error scenarios
          because errors may not surface until hours or days after the user
          performs an action. When a user creates a document offline and the
          sync fails because of a conflict with a server-side change, the
          application must present the conflict with clear attribution (what you
          changed, what changed on the server, when each change occurred) and
          intuitive resolution options (keep yours, keep theirs, merge both).
          Google Docs, Notion, and Dropbox Paper all implement sophisticated
          conflict resolution UX that makes a technically complex situation feel
          manageable to non-technical users.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do React Error Boundaries work and what do they not catch?
            </p>
            <p className="mt-2 text-sm">
              A: Error Boundaries are React components that catch JavaScript
              errors during rendering, lifecycle methods, and constructors of
              their child component tree. When an error is caught, they render a
              fallback UI instead of the crashed tree and log the error. They do
              NOT catch errors in event handlers (use try/catch in the handler),
              asynchronous code like setTimeout or Promise rejections (use
              .catch() or try/catch in async functions), server-side rendering,
              or errors thrown within the boundary itself. Use libraries like
              react-error-boundary for a clean API with retry support.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is your retry strategy for failed API calls?
            </p>
            <p className="mt-2 text-sm">
              A: Use exponential backoff with jitter — retry at 1s, 2s, 4s, 8s
              intervals with a maximum of 3-5 attempts. Only retry transient
              errors: network timeouts, 502/503/504 server errors, and 429 rate
              limiting (respect the Retry-After header). Never retry 4xx client
              errors (400, 401, 403, 404) because they will persist until the
              user changes their request. Show a &quot;Retrying...&quot;
              indicator with a cancel option. After exhausting retries, show a
              user-friendly error message with a manual retry button.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you design user-friendly error messages?
            </p>
            <p className="mt-2 text-sm">
              A: State the problem in plain language, not technical jargon.
              Explain why it happened when it helps the user understand. Provide
              specific, actionable guidance on how to fix it. Include recovery
              options (Retry, alternative actions, contact support). Use an
              empathetic tone that does not blame the user. Answer three
              questions: what happened, why did it happen, and what can I do
              about it. Never show error codes without context, technical stack
              traces, or vague messages like &quot;Something went wrong.&quot;
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle form submission errors?
            </p>
            <p className="mt-2 text-sm">
              A: Never clear form inputs on error — preserve all user input so
              they can fix and resubmit. Show inline error messages next to the
              problematic fields, not just at the top of the form. Implement
              auto-save drafts to localStorage so work is recoverable if the
              browser crashes. For multi-step forms, save progress after each
              step. If the error is a network failure, offer retry without
              losing the filled data. For validation errors, use real-time
              inline validation to catch issues before submission.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle offline and reconnection scenarios?
            </p>
            <p className="mt-2 text-sm">
              A: Detect offline state with navigator.onLine and the offline
              event. Show an offline banner and disable actions that require
              network connectivity. Queue user actions locally for later
              submission. When connectivity returns (online event),
              automatically process the queued actions with retry logic. If
              actions fail during sync, show conflict resolution UI if the data
              changed on the server while offline. Notify the user of
              successful sync or remaining issues. Preserve all queued actions
              across page refreshes using localStorage or IndexedDB.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Documentation — Error Boundaries
            </a>
          </li>
          <li>
            <a
              href="https://github.com/bvaughn/react-error-boundary"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              react-error-boundary — Simple Reusable Error Boundary Component
            </a>
          </li>
          <li>
            <a
              href="https://sentry.io/welcome/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sentry — Error Tracking and Performance Monitoring
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/error-messages/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Guidelines for Error Messages
            </a>
          </li>
          <li>
            <a
              href="https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS Builders Library — Timeouts, Retries, and Backoff with Jitter
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
