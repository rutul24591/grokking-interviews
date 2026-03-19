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
  wordCount: 11000,
  readingTime: 44,
  lastUpdated: "2026-03-15",
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
        <h2>Definition & Context</h2>
        <p>
          <strong>Error UX & Recovery</strong> encompasses how applications
          handle, display, and help users recover from errors. This includes
          network failures, API errors, validation errors, application crashes,
          and unexpected states. Good error UX transforms frustrating failures
          into manageable setbacks that users can understand and overcome.
        </p>
        <p>
          For staff engineers, error handling is a critical quality attribute.
          Systems will fail — networks are unreliable, APIs return errors,
          databases have outages. The difference between a professional
          application and an amateur one is not whether errors occur, but how
          gracefully the application handles them.
        </p>
        <p>
          <strong>Impact of poor error UX:</strong>
        </p>
        <ul>
          <li>
            <strong>User frustration:</strong> Cryptic error messages leave
            users confused and angry
          </li>
          <li>
            <strong>Abandoned tasks:</strong> Users give up when they don&apos;t
            know how to proceed
          </li>
          <li>
            <strong>Support costs:</strong> Poor error messages generate support
            tickets
          </li>
          <li>
            <strong>Lost revenue:</strong> Checkout errors directly impact
            conversion rates
          </li>
          <li>
            <strong>Trust erosion:</strong> Frequent unhandled errors make users
            question reliability
          </li>
        </ul>
        <p>
          This guide covers error taxonomy, user-friendly messaging, error
          boundaries, retry patterns, recovery flows, and interview-ready
          strategies for building resilient applications.
        </p>
      </section>

      <section>
        <h2>Error Taxonomy</h2>
        <p>
          Understanding error types helps design appropriate handling
          strategies.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">By Source</h3>
        <ul className="space-y-3">
          <li>
            <strong>Network errors:</strong> Connection failures, timeouts, DNS
            errors, offline state. Often transient and recoverable with retry.
          </li>
          <li>
            <strong>API errors:</strong> HTTP status codes (400, 401, 403, 404,
            500, 502, 503). Some are user-fixable (400 validation), some require
            authentication (401, 403), some indicate server problems (5xx).
          </li>
          <li>
            <strong>Validation errors:</strong> Form validation, business rule
            violations. User-fixable with clear guidance on what&apos;s wrong.
          </li>
          <li>
            <strong>Application errors:</strong> JavaScript exceptions, React
            error boundaries, component crashes. Often indicate bugs; may
            require page reload or support contact.
          </li>
          <li>
            <strong>Permission errors:</strong> Access denied, insufficient
            privileges. May require role change, admin approval, or subscription
            upgrade.
          </li>
          <li>
            <strong>Resource errors:</strong> Not found (404), quota exceeded,
            rate limited. May require navigation, waiting, or contacting
            support.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">By Recoverability</h3>
        <ul className="space-y-3">
          <li>
            <strong>Transient (retry-able):</strong> Network timeouts, 503
            Service Unavailable, rate limiting with retry-after. Automatically
            retry with exponential backoff.
          </li>
          <li>
            <strong>User-fixable:</strong> Validation errors, missing required
            fields, invalid formats. Show clear error with specific fix
            instructions.
          </li>
          <li>
            <strong>Requires intervention:</strong> Authentication expired,
            payment failed, account locked. Guide user through recovery flow
            (re-login, update payment, contact support).
          </li>
          <li>
            <strong>Terminal (non-recoverable):</strong> Resource deleted,
            account banned, fatal application error. Acknowledge the situation,
            provide next steps (contact support, return home).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">By Severity</h3>
        <ul className="space-y-3">
          <li>
            <strong>Info:</strong> Non-blocking notifications. &quot;Changes
            saved&quot;, &quot;New version available&quot;. Dismissible,
            doesn&apos;t block workflow.
          </li>
          <li>
            <strong>Warning:</strong> Potential issues that don&apos;t block
            progress. &quot;Unsaved changes will be lost&quot;, &quot;Large file
            may take time&quot;. User can proceed or cancel.
          </li>
          <li>
            <strong>Error:</strong> Operation failed but app is functional.
            &quot;Failed to upload file&quot;, &quot;Could not load
            comments&quot;. Show error, offer retry or alternative.
          </li>
          <li>
            <strong>Critical:</strong> App is broken or unusable. &quot;Unable
            to connect to server&quot;, &quot;Application error&quot;. Block
            workflow, provide recovery options.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/error-classification.svg"
          alt="Error Classification Matrix"
          caption="Error classification by source, recoverability, and severity — helping determine appropriate UX response"
        />
      </section>

      <section>
        <h2>Error Message Design</h2>
        <p>
          Well-crafted error messages reduce user frustration and guide
          recovery.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Anatomy of a Good Error Message
        </h3>
        <ul className="space-y-3">
          <li>
            <strong>Clear statement of the problem:</strong> &quot;Unable to
            save document&quot; not &quot;Error 500&quot;. Use plain language,
            not technical jargon.
          </li>
          <li>
            <strong>Explanation of why (if helpful):</strong> &quot;The file is
            too large (max 10MB)&quot; helps users understand the constraint.
          </li>
          <li>
            <strong>Specific guidance on how to fix:</strong> &quot;Try reducing
            file size or compressing the image&quot; gives actionable next
            steps.
          </li>
          <li>
            <strong>Recovery options:</strong> Provide buttons or links:
            &quot;Retry&quot;, &quot;Upload smaller file&quot;, &quot;Contact
            support&quot;.
          </li>
          <li>
            <strong>Appropriate tone:</strong> Empathetic, not blaming. &quot;We
            couldn&apos;t complete your request&quot; not &quot;You entered
            invalid data&quot;.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Error Message Anti-Patterns
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Technical jargon:</strong> &quot;NullPointerException at
            line 234&quot; — users don&apos;t care
          </li>
          <li>
            <strong>Vague messages:</strong> &quot;Something went wrong&quot; —
            doesn&apos;t help users proceed
          </li>
          <li>
            <strong>Blaming the user:</strong> &quot;Invalid input&quot; — say
            what&apos;s invalid and how to fix
          </li>
          <li>
            <strong>Error codes without context:</strong> &quot;Error
            0x80070005&quot; — meaningless to users
          </li>
          <li>
            <strong>No recovery path:</strong> Just showing the error without
            &quot;what now&quot; options
          </li>
          <li>
            <strong>Hidden errors:</strong> Console-only errors, toast
            notifications that auto-dismiss too quickly
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Error Message Examples
        </h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Scenario</th>
              <th className="p-3 text-left">Bad Message</th>
              <th className="p-3 text-left">Good Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">Network failure</td>
              <td className="p-3">&quot;Network Error&quot;</td>
              <td className="p-3">
                &quot;We couldn&apos;t connect to the server. Check your
                internet connection and try again.&quot;
              </td>
            </tr>
            <tr>
              <td className="p-3">File too large</td>
              <td className="p-3">&quot;Upload failed&quot;</td>
              <td className="p-3">
                &quot;File is too large. Maximum size is 10MB. Your file is
                25MB. Try compressing or using a smaller file.&quot;
              </td>
            </tr>
            <tr>
              <td className="p-3">Session expired</td>
              <td className="p-3">&quot;401 Unauthorized&quot;</td>
              <td className="p-3">
                &quot;Your session has expired. Please sign in again to
                continue.&quot;
              </td>
            </tr>
            <tr>
              <td className="p-3">Form validation</td>
              <td className="p-3">&quot;Invalid email&quot;</td>
              <td className="p-3">
                &quot;Please enter a valid email address (e.g.,
                name@example.com)&quot;
              </td>
            </tr>
            <tr>
              <td className="p-3">Payment failed</td>
              <td className="p-3">&quot;Payment declined&quot;</td>
              <td className="p-3">
                &quot;Your card was declined. Please check with your bank or try
                a different payment method.&quot;
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Error Boundaries (React)</h2>
        <p>
          Error boundaries are React components that catch JavaScript errors in
          their child component tree, log those errors, and display a fallback
          UI instead of crashing the entire app.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          How Error Boundaries Work
        </h3>
        <ul className="space-y-2">
          <li>Wrap component trees with error boundary components</li>
          <li>When a child throws an error, boundary catches it</li>
          <li>Boundary renders fallback UI instead of crashed component</li>
          <li>Error is logged to error reporting service</li>
          <li>Rest of app remains functional</li>
        </ul>
        <p>
          <strong>What error boundaries catch:</strong> Errors during rendering,
          lifecycle methods, and constructors of child components.
        </p>
        <p>
          <strong>What they don&apos;t catch:</strong> Event handlers, async
          code (setTimeout, requestAnimationFrame), server-side rendering,
          errors in the boundary itself.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Error Boundary Implementation Pattern
        </h3>
        <ul className="space-y-2">
          <li>Use class components or libraries like react-error-boundary</li>
          <li>Implement componentDidCatch to log errors</li>
          <li>Implement getDerivedStateFromError to show fallback UI</li>
          <li>Provide retry button that resets error state</li>
          <li>Log errors to monitoring service (Sentry, LogRocket)</li>
          <li>Consider different fallbacks for different error types</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Error Boundary Placement Strategy
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>App-level boundary:</strong> Catches any unhandled error,
            shows &quot;something went wrong&quot; with reload option. Last line
            of defense.
          </li>
          <li>
            <strong>Route-level boundaries:</strong> Each major route has its
            own boundary. One route crashing doesn&apos;t affect others.
          </li>
          <li>
            <strong>Component-level boundaries:</strong> Critical components
            (comments widget, recommendations, user profile) have local
            boundaries. Component failure doesn&apos;t break entire page.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Graceful Degradation Patterns
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Partial functionality:</strong> Comments fail to load? Show
            article with &quot;Comments unavailable&quot; message.
          </li>
          <li>
            <strong>Fallback content:</strong> Recommendations error? Show
            default popular items instead of empty section.
          </li>
          <li>
            <strong>Progressive enhancement:</strong> Advanced features fail?
            Core functionality still works.
          </li>
          <li>
            <strong>Skeleton states:</strong> Loading fails? Show skeleton with
            retry option instead of blank space.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/error-boundary-hierarchy.svg"
          alt="Error Boundary Hierarchy"
          caption="Error boundary placement strategy — app-level, route-level, and component-level boundaries for graceful degradation"
        />
      </section>

      <section>
        <h2>Retry Patterns</h2>
        <p>
          For transient errors, automatic retry with intelligent backoff
          improves success rates without user intervention.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Exponential Backoff</h3>
        <p>
          Wait progressively longer between retries to avoid overwhelming
          servers during outages.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Attempt 1:</strong> Immediate or 1 second delay
          </li>
          <li>
            <strong>Attempt 2:</strong> 2 seconds
          </li>
          <li>
            <strong>Attempt 3:</strong> 4 seconds
          </li>
          <li>
            <strong>Attempt 4:</strong> 8 seconds
          </li>
          <li>
            <strong>Attempt 5:</strong> 16 seconds (then give up)
          </li>
        </ul>
        <p>
          Add jitter (randomness) to prevent thundering herd when many clients
          retry simultaneously.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">When to Retry</h3>
        <ul className="space-y-2">
          <li>
            <strong>Network timeouts:</strong> Connection reset, DNS failures
          </li>
          <li>
            <strong>5xx server errors:</strong> 502 Bad Gateway, 503 Service
            Unavailable, 504 Gateway Timeout
          </li>
          <li>
            <strong>Rate limiting:</strong> 429 Too Many Requests (respect
            Retry-After header)
          </li>
          <li>
            <strong>Transient API errors:</strong> &quot;Database locked&quot;,
            &quot;Service temporarily unavailable&quot;
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">When NOT to Retry</h3>
        <ul className="space-y-2">
          <li>
            <strong>4xx client errors:</strong> 400 Bad Request, 401
            Unauthorized, 403 Forbidden, 404 Not Found
          </li>
          <li>
            <strong>Validation errors:</strong> Retrying won&apos;t fix invalid
            input
          </li>
          <li>
            <strong>Authentication errors:</strong> Need user to
            re-authenticate, not retry
          </li>
          <li>
            <strong>Idempotency concerns:</strong> Non-idempotent operations
            (charges, submissions) need caution
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          User-Controlled Retry
        </h3>
        <p>
          For errors that can&apos;t be auto-retried, provide clear retry
          options:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Inline retry buttons:</strong> Next to failed operations
            (upload, submit, save)
          </li>
          <li>
            <strong>Global retry:</strong> &quot;Reload page&quot; or &quot;Try
            again&quot; for page-level errors
          </li>
          <li>
            <strong>Retry all:</strong> For batch operations with multiple
            failures
          </li>
          <li>
            <strong>Auto-retry indicator:</strong> Show &quot;Retrying in
            5s...&quot; with cancel option
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Optimistic UI with Rollback
        </h3>
        <p>
          For actions that usually succeed, update UI immediately and rollback
          on error:
        </p>
        <ul className="space-y-2">
          <li>User clicks &quot;like&quot; — show liked state immediately</li>
          <li>API call fails — revert to unliked state</li>
          <li>
            Show error toast: &quot;Couldn&apos;t save your like. Try
            again?&quot;
          </li>
          <li>Provide retry button in error notification</li>
        </ul>
        <p>
          Works well for: likes, follows, cart additions, non-critical updates.
          Not suitable for: payments, critical data changes, irreversible
          actions.
        </p>
      </section>

      <section>
        <h2>Recovery Flows</h2>
        <p>
          When errors require user action, guide them through recovery with
          clear steps.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Authentication Recovery
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Session expired:</strong> Show login modal, preserve current
            state, redirect back after login
          </li>
          <li>
            <strong>Token refresh:</strong> Silently refresh tokens before
            expiry, retry failed requests with new token
          </li>
          <li>
            <strong>Permission denied:</strong> Explain what&apos;s needed,
            provide upgrade/request access flow
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Network Recovery</h3>
        <ul className="space-y-2">
          <li>
            <strong>Offline detection:</strong> Show offline banner, disable
            actions that require network
          </li>
          <li>
            <strong>Reconnection:</strong> Auto-retry queued actions when back
            online
          </li>
          <li>
            <strong>Conflict handling:</strong> If data changed while offline,
            show merge UI
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Form Submission Recovery
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Auto-save drafts:</strong> Save form state locally, restore
            on return
          </li>
          <li>
            <strong>Preserve input:</strong> Don&apos;t clear form on error —
            let users fix and resubmit
          </li>
          <li>
            <strong>Inline validation:</strong> Show errors next to fields, not
            just at top
          </li>
          <li>
            <strong>Progressive save:</strong> Save sections independently, mark
            what&apos;s saved
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Payment Recovery</h3>
        <ul className="space-y-2">
          <li>
            <strong>Clear decline reason:</strong> &quot;Insufficient
            funds&quot; vs &quot;Invalid card&quot;
          </li>
          <li>
            <strong>Multiple payment methods:</strong> Offer alternative cards,
            PayPal, etc.
          </li>
          <li>
            <strong>Retry later option:</strong> &quot;Pay later&quot; with cart
            preservation
          </li>
          <li>
            <strong>Support contact:</strong> For persistent issues, provide
            phone/chat support
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/error-recovery-flows.svg"
          alt="Error Recovery Flow Diagram"
          caption="Common recovery flows for authentication, network, form, and payment errors"
        />
      </section>

      <section>
        <h2>Error States UX Patterns</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Empty States with Guidance
        </h3>
        <p>When data fails to load or is unavailable:</p>
        <ul className="space-y-2">
          <li>Show illustration or icon (not just blank space)</li>
          <li>
            Explain what happened (&quot;No results found&quot; vs &quot;Error
            loading data&quot;)
          </li>
          <li>
            Provide next steps (&quot;Try different keywords&quot;, &quot;Check
            back later&quot;)
          </li>
          <li>
            Offer alternative actions (browse categories, contact support)
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Inline Error Indicators
        </h3>
        <p>For form and field-level errors:</p>
        <ul className="space-y-2">
          <li>Highlight the problematic field (red border, icon)</li>
          <li>Show error message near the field (not just at top)</li>
          <li>Keep error visible until fixed</li>
          <li>Clear error on valid input (not on blur)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Toast Notifications</h3>
        <p>For non-blocking errors:</p>
        <ul className="space-y-2">
          <li>Auto-dismiss after reasonable time (5-10 seconds for errors)</li>
          <li>
            Include action button (&quot;Retry&quot;, &quot;Dismiss&quot;,
            &quot;Learn more&quot;)
          </li>
          <li>Stack multiple toasts, don&apos;t overlap</li>
          <li>Use appropriate colors (red for errors, yellow for warnings)</li>
          <li>Don&apos;t auto-dismiss critical errors</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Full-Page Error States
        </h3>
        <p>For critical failures:</p>
        <ul className="space-y-2">
          <li>Clear headline (&quot;Something went wrong&quot;)</li>
          <li>
            Brief explanation (&quot;We&apos;re having trouble loading this
            page&quot;)
          </li>
          <li>Recovery options (Reload, Go Home, Contact Support)</li>
          <li>Error reference code (for support tickets)</li>
          <li>Status page link (for known outages)</li>
        </ul>
      </section>

      <section>
        <h2>Error Monitoring & Observability</h2>
        <p>
          You can&apos;t fix what you don&apos;t measure. Track errors to
          identify patterns and prioritize fixes.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">What to Log</h3>
        <ul className="space-y-2">
          <li>Error message and stack trace</li>
          <li>User context (authenticated, role, tenant)</li>
          <li>Page/route where error occurred</li>
          <li>Browser, OS, device information</li>
          <li>Network status (online/offline, connection type)</li>
          <li>Recent user actions (for reproducing issues)</li>
          <li>Error frequency and affected user count</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Error Tracking Tools
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Sentry:</strong> Popular, good React integration, session
            replay
          </li>
          <li>
            <strong>LogRocket:</strong> Session recording, network logs, Redux
            devtools
          </li>
          <li>
            <strong>DataDog RUM:</strong> Real user monitoring, error tracking,
            performance
          </li>
          <li>
            <strong>New Relic:</strong> Full-stack observability, error
            analytics
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Budgets</h3>
        <p>Define acceptable error rates and alert when exceeded:</p>
        <ul className="space-y-2">
          <li>Track error rate as percentage of total requests</li>
          <li>Set thresholds (e.g., alert if error rate exceeds 1%)</li>
          <li>Segment by error type (5xx vs 4xx vs client errors)</li>
          <li>Create runbooks for common error scenarios</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle errors in a React application?
            </p>
            <p className="mt-2 text-sm">
              A: Multi-layer approach: Error boundaries catch rendering errors
              and show fallback UI. Try-catch for async operations with
              user-friendly error messages. Retry logic with exponential backoff
              for transient failures. Error tracking (Sentry) for monitoring.
              Different strategies for different error types — validation errors
              show inline, network errors offer retry, auth errors redirect to
              login.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What makes a good error message?</p>
            <p className="mt-2 text-sm">
              A: Five elements: (1) Clear problem statement in plain language,
              (2) Brief explanation of why it happened, (3) Specific guidance on
              how to fix, (4) Recovery options (buttons, links), (5) Empathetic
              tone that doesn&apos;t blame the user. Avoid technical jargon,
              error codes without context, and vague messages like
              &quot;something went wrong&quot;.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When should you retry failed requests automatically?
            </p>
            <p className="mt-2 text-sm">
              A: Retry transient errors: network timeouts, 5xx server errors,
              429 rate limiting (respecting Retry-After). Don&apos;t retry: 4xx
              client errors (400, 401, 403, 404), validation errors,
              authentication failures. Use exponential backoff with jitter to
              avoid overwhelming servers. For non-idempotent operations
              (payments, submissions), require user confirmation before retry.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do error boundaries work in React?
            </p>
            <p className="mt-2 text-sm">
              A: Error boundaries are class components that catch errors in
              child component trees. They implement componentDidCatch to log
              errors and getDerivedStateFromError to show fallback UI. They
              catch rendering errors, lifecycle errors, and constructor errors —
              but NOT event handlers or async code. Place boundaries at app,
              route, and component levels for graceful degradation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you design an offline-first error recovery system?
            </p>
            <p className="mt-2 text-sm">
              A: Detect offline state with navigator.onLine and show offline
              banner. Queue actions locally (IndexedDB). Disable
              network-dependent UI. On reconnection, auto-retry queued actions
              with conflict detection. If server data changed while offline,
              show merge UI letting users choose which version to keep. Preserve
              all user input locally so nothing is lost during offline periods.
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
              href="https://sentry.io/welcome/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sentry — Error Tracking
            </a>
          </li>
          <li>
            <a
              href="https://usefulsolutions.com/writing/designing-better-error-messages/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Designing Better Error Messages
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/error-messages-guidelines/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NN/g — Error Message Guidelines
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
