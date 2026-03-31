"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-third-party-integration-widget-embedding",
  title: "Widget Embedding",
  description:
    "Deep dive into embedding third-party widgets (iframes, scripts, web components): isolation strategies, security boundaries, performance optimization, communication contracts, and operational guardrails for large SPAs.",
  category: "frontend",
  subcategory: "third-party-integration",
  slug: "widget-embedding",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: [
    "frontend",
    "third-party",
    "widgets",
    "iframes",
    "security",
    "performance",
    "privacy",
    "postmessage",
  ],
  relatedTopics: [
    "script-loading-strategies",
    "chat-widget-integration",
    "social-media-integration",
    "oauth-integration",
  ],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Widget embedding</strong> is the integration pattern where a
          third-party (or separately-owned internal) UI capability is rendered
          inside your application: chat widgets, support desks, marketing
          personalization, payments, identity providers, maps, scheduling, and
          social embeds.
        </p>
        <p>
          Embedding is deceptively simple at the "hello world" level—paste a
          snippet and a widget appears. At scale, it becomes a{" "}
          <strong>system design problem</strong>: widgets introduce a new trust
          boundary, can affect the critical rendering path, can add long-lived
          listeners and timers, and can expand your data exposure surface. Many
          high-severity frontend incidents (performance regressions, CSP
          breakages, privacy compliance violations) originate from embedded
          widgets.
        </p>
        <p>
          For staff/principal engineers, widget embedding requires balancing
          three competing concerns:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Functionality:</strong> The widget must work correctly and
            provide business value (e.g., customer support via chat, revenue via
            payments).
          </li>
          <li>
            <strong>Isolation:</strong> The widget must not interfere with your
            application (CSS conflicts, JavaScript errors, data access).
          </li>
          <li>
            <strong>Communication:</strong> Your application and the widget must
            communicate for coordination (e.g., user identity handoff, theme
            synchronization, event notifications).
          </li>
        </ul>
        <p>
          The business impact of poor widget embedding decisions is significant:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Performance Degradation:</strong> Widgets load additional
            scripts, stylesheets, and assets. A poorly optimized widget can add
            2-5 seconds to page load time.
          </li>
          <li>
            <strong>Security Vulnerabilities:</strong> Widgets run in your
            origin context (unless isolated). A compromised widget can steal
            user data, session tokens, or inject malicious code.
          </li>
          <li>
            <strong>Privacy Violations:</strong> Widgets often collect user data
            for analytics or advertising. Without proper consent gating, this
            violates GDPR, CCPA, and other regulations.
          </li>
          <li>
            <strong>Brand Damage:</strong> Widgets that break your UI (CSS
            conflicts, layout shifts) create a poor user experience that
            reflects on your brand, not the widget vendor.
          </li>
        </ul>
        <p>
          In system design interviews, widget embedding demonstrates
          understanding of security boundaries, cross-origin communication,
          performance isolation, and operational risk management. It shows you
          think about production realities and the complexities of integrating
          external systems.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/iframe-isolation.svg"
          alt="Comparison of widget embedding without isolation (same DOM, full access) vs with iframe isolation (separate context, postMessage communication)"
          caption="Iframe isolation — widgets in iframes cannot directly access parent app data; communication happens via controlled postMessage channel"
        />

        <h3>Isolation Mechanisms</h3>
        <p>
          There are three primary approaches to isolating third-party widgets,
          each with different security and complexity trade-offs:
        </p>

        <h4>Mechanism 1: Iframe Isolation</h4>
        <p>
          Iframes provide the strongest isolation by creating a separate
          browsing context with its own DOM, JavaScript context, and CSS scope.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Security:</strong> Widgets cannot directly access parent
            DOM, cookies, localStorage, or JavaScript variables. Communication
            must happen via postMessage.
          </li>
          <li>
            <strong>CSS Isolation:</strong> Widget styles cannot leak into
            parent app; parent styles cannot affect widget.
          </li>
          <li>
            <strong>Performance:</strong> Iframes have their own rendering
            pipeline. Heavy widgets don't block parent app rendering.
          </li>
          <li>
            <strong>Sandbox Attribute:</strong> Further restrict iframe
            capabilities (no scripts, no forms, no popups) using the sandbox
            attribute.
          </li>
        </ul>
        <p>
          Iframe is the recommended approach for most third-party widgets,
          especially those from vendors you don't fully trust.
        </p>

        <h4>Mechanism 2: Shadow DOM</h4>
        <p>
          Shadow DOM provides CSS isolation without creating a separate browsing
          context. It's part of the Web Components standard.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Security:</strong> Widgets can still access parent
            JavaScript context, cookies, and localStorage. Less secure than
            iframes.
          </li>
          <li>
            <strong>CSS Isolation:</strong> Widget styles are scoped to shadow
            root. Parent styles don't affect widget.
          </li>
          <li>
            <strong>Performance:</strong> Lighter weight than iframes. No
            separate rendering pipeline.
          </li>
          <li>
            <strong>Communication:</strong> Direct JavaScript access (no
            postMessage needed).
          </li>
        </ul>
        <p>
          Shadow DOM is suitable for trusted internal widgets or when you need
          tight integration with parent app state.
        </p>

        <h4>Mechanism 3: CSS Scoping (No Isolation)</h4>
        <p>
          Widgets rendered directly in parent DOM with CSS scoping via BEM, CSS
          Modules, or CSS-in-JS.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Security:</strong> No isolation. Widget has full access to
            parent app.
          </li>
          <li>
            <strong>CSS Isolation:</strong> Partial. CSS scoping prevents most
            conflicts but determined widgets can escape.
          </li>
          <li>
            <strong>Performance:</strong> No isolation overhead.
          </li>
          <li>
            <strong>Communication:</strong> Direct JavaScript access.
          </li>
        </ul>
        <p>
          This approach is only suitable for fully trusted, first-party widgets.
          Never use for third-party widgets.
        </p>

        <h3>Cross-Origin Communication: postMessage</h3>
        <p>
          When widgets are isolated (especially in iframes), communication must
          happen via the postMessage API. The parent app sends messages to the
          iframe using contentWindow.postMessage with the message object and
          target origin. The iframe receives messages via a message event
          listener and must validate the event.origin before processing any
          message. Messages should include a type field to identify the action,
          and the iframe should only process messages from trusted origins.
        </p>
        <p>Security considerations for postMessage:</p>
        <ul className="space-y-2">
          <li>
            <strong>Always Validate Origin:</strong> Never process messages
            without checking event.origin. Attackers can send messages from any
            origin.
          </li>
          <li>
            <strong>Specify Target Origin:</strong> Never use '*' as
            targetOrigin. Always specify the exact expected origin.
          </li>
          <li>
            <strong>Validate Message Structure:</strong> Check message type and
            data structure before processing.
          </li>
          <li>
            <strong>Acknowledge Messages:</strong> Send acknowledgment back to
            sender for reliable communication.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/postmessage-pattern.svg"
          alt="postMessage communication pattern showing parent app sending message, iframe validating origin, processing request, and sending response back"
          caption="postMessage pattern — always validate event.origin before processing; specify exact targetOrigin when sending; never use '*'"
        />

        <h3>Widget Lifecycle</h3>
        <p>
          Widgets have a lifecycle that must be managed to prevent memory leaks
          and ensure clean teardown:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Load:</strong> Inject script, initialize SDK, create
            container element.
          </li>
          <li>
            <strong>Mount:</strong> Render widget UI, attach event listeners,
            start timers.
          </li>
          <li>
            <strong>Active:</strong> Handle user interactions, API calls, state
            updates.
          </li>
          <li>
            <strong>Unmount:</strong> Remove widget UI, detach event listeners,
            clear timers, nullify references.
          </li>
        </ul>
        <p>
          The unmount phase is critical: failing to clean up event listeners,
          timers, or references causes memory leaks that accumulate over long
          sessions.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/widget-lifecycle.svg"
          alt="Widget lifecycle diagram showing Load → Mount → Active → Unmount stages with cleanup checklist for unmount phase"
          caption="Widget lifecycle — unmount must reverse everything mount did: remove listeners, clear timers, disconnect observers, nullify refs"
        />

        <h3>Identity Handoff</h3>
        <p>
          Many widgets need user identity to provide personalized experiences
          (chat history, saved payment methods, recommendations). The identity
          handoff must be secure:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Never Pass Raw Tokens:</strong> Don't pass session tokens or
            API keys to widgets. This gives widgets full access to your backend.
          </li>
          <li>
            <strong>Use HMAC Verification:</strong> Generate an HMAC hash of
            user_id using a shared secret. Widget backend verifies the hash to
            confirm identity hasn't been tampered with.
          </li>
          <li>
            <strong>Minimal Data:</strong> Only pass data the widget needs
            (user_id, email, name). Don't pass sensitive data (SSN, payment
            info, health data).
          </li>
          <li>
            <strong>Consent Check:</strong> Only pass identity if user has
            consented to data sharing with this widget vendor.
          </li>
        </ul>
        <p>
          Identity handoff is a common source of security vulnerabilities.
          Always validate that the widget vendor has appropriate security
          controls before passing any user data.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          A robust widget embedding architecture treats widgets as{" "}
          <strong>untrusted micro-frontends</strong> that must be isolated,
          monitored, and controlled.
        </p>

        <h3>Isolation Architecture</h3>
        <p>The recommended architecture for third-party widgets:</p>
        <ul className="space-y-2">
          <li>
            <strong>Iframe Container:</strong> Render widget in an iframe with
            sandbox attribute. This provides CSS, JavaScript, and DOM isolation.
          </li>
          <li>
            <strong>Controlled Communication:</strong> Use postMessage with
            origin validation for all parent-widget communication.
          </li>
          <li>
            <strong>Lazy Loading:</strong> Don't load widget until user
            interacts with the feature. Show a placeholder button or preview.
          </li>
          <li>
            <strong>Performance Budget:</strong> Set maximum load time, bundle
            size, and memory usage for widgets. Monitor and alert on violations.
          </li>
        </ul>

        <h3>Loading Patterns</h3>
        <p>Several loading patterns emerge based on widget criticality:</p>

        <h4>Pattern 1: Eager Load (Rare)</h4>
        <p>
          Load widget immediately on page load. Only use for critical widgets
          that provide core functionality.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Example:</strong> Payment widget on checkout page.
          </li>
          <li>
            <strong>Implementation:</strong> Load script with defer, initialize
            on DOM ready.
          </li>
          <li>
            <strong>Risk:</strong> Impacts initial page load time.
          </li>
        </ul>

        <h4>Pattern 2: Lazy Load on Interaction (Recommended)</h4>
        <p>
          Show a placeholder button. Load widget only when user clicks the
          button.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Example:</strong> Chat widget, support desk.
          </li>
          <li>
            <strong>Implementation:</strong> On click, inject script, initialize
            widget, hide placeholder.
          </li>
          <li>
            <strong>Benefit:</strong> Zero impact on initial page load. Only
            users who need the widget pay the cost.
          </li>
        </ul>

        <h4>Pattern 3: Lazy Load on Visibility</h4>
        <p>
          Load widget when it scrolls into viewport using IntersectionObserver.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Example:</strong> Social embeds, comment sections.
          </li>
          <li>
            <strong>Implementation:</strong> Observe container, load widget when
            intersection ratio &gt; 0.
          </li>
          <li>
            <strong>Benefit:</strong> Good balance between UX and performance.
          </li>
        </ul>

        <h4>Pattern 4: Static Fallback (Privacy-Focused)</h4>
        <p>
          Show a static preview (screenshot, server-rendered HTML) with a "Load
          widget" button.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Example:</strong> Twitter embeds, YouTube videos.
          </li>
          <li>
            <strong>Implementation:</strong> Generate static preview at build
            time or on-demand. Load widget only if user clicks.
          </li>
          <li>
            <strong>Benefit:</strong> Maximum privacy (no third-party tracking
            unless user opts in), fastest page load.
          </li>
        </ul>

        <h3>Teardown Architecture</h3>
        <p>
          Proper teardown is critical for preventing memory leaks in long-lived
          SPAs:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Remove Event Listeners:</strong> Every addEventListener must
            have a corresponding removeEventListener.
          </li>
          <li>
            <strong>Clear Timers:</strong> Clear all setTimeout and setInterval
            timers.
          </li>
          <li>
            <strong>Cancel Animation Frames:</strong> Cancel any
            requestAnimationFrame callbacks.
          </li>
          <li>
            <strong>Disconnect Observers:</strong> Disconnect
            IntersectionObserver, ResizeObserver, MutationObserver.
          </li>
          <li>
            <strong>Nullify References:</strong> Set widget references to null
            to allow GC.
          </li>
          <li>
            <strong>Remove DOM:</strong> Remove widget container from DOM.
          </li>
        </ul>
        <p>
          Implement teardown in a cleanup function that's called on component
          unmount. Test teardown by mounting/unmounting widget repeatedly and
          checking for memory growth.
        </p>

        <h3>Monitoring Architecture</h3>
        <p>Monitor widgets in production to detect issues early:</p>
        <ul className="space-y-2">
          <li>
            <strong>Load Time:</strong> Track time from load trigger to widget
            ready. Alert if &gt; 3 seconds.
          </li>
          <li>
            <strong>Error Rate:</strong> Track JavaScript errors from widget.
            Alert on elevated error rates.
          </li>
          <li>
            <strong>Memory Usage:</strong> Track memory before and after widget
            load. Alert if increase &gt; 50MB.
          </li>
          <li>
            <strong>Interaction Success:</strong> Track successful widget
            interactions (messages sent, payments completed). Alert on drop in
            success rate.
          </li>
          <li>
            <strong>Kill Switch:</strong> Implement remote kill switch to
            disable widget if issues detected.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Widget embedding strategies involve trade-offs between security,
          performance, and integration complexity.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Isolation Method</th>
              <th className="p-3 text-left">Security</th>
              <th className="p-3 text-left">Performance</th>
              <th className="p-3 text-left">Integration Complexity</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Iframe</td>
              <td className="p-3">Best (separate context)</td>
              <td className="p-3">Good (separate rendering)</td>
              <td className="p-3">Medium (postMessage)</td>
              <td className="p-3">Third-party widgets</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Shadow DOM</td>
              <td className="p-3">Medium (CSS isolation only)</td>
              <td className="p-3">Best (lightweight)</td>
              <td className="p-3">Low (direct JS access)</td>
              <td className="p-3">Trusted internal widgets</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">CSS Scoping</td>
              <td className="p-3">Worst (no isolation)</td>
              <td className="p-3">Best (no overhead)</td>
              <td className="p-3">Lowest (no barriers)</td>
              <td className="p-3">First-party widgets only</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level insight is that{" "}
          <strong>
            iframes are the default choice for third-party widgets
          </strong>
          . The security benefits far outweigh the minor complexity of
          postMessage communication.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Iframe for Third-Party Widgets:</strong> Always isolate
            third-party widgets in iframes with sandbox attribute. Never render
            them directly in your DOM.
          </li>
          <li>
            <strong>Validate postMessage Origins:</strong> Always check
            event.origin before processing messages. Never use '*' as
            targetOrigin.
          </li>
          <li>
            <strong>Lazy Load Widgets:</strong> Don't load widgets until user
            interacts with the feature. Show a placeholder button.
          </li>
          <li>
            <strong>Implement Proper Teardown:</strong> Remove all listeners,
            timers, and references on unmount. Test for memory leaks.
          </li>
          <li>
            <strong>Use HMAC for Identity:</strong> Never pass raw tokens to
            widgets. Use HMAC verification for secure identity handoff.
          </li>
          <li>
            <strong>Set Performance Budgets:</strong> Define maximum load time,
            bundle size, and memory usage. Monitor and alert on violations.
          </li>
          <li>
            <strong>Implement Kill Switch:</strong> Have a remote kill switch to
            disable widgets if they cause issues.
          </li>
          <li>
            <strong>Respect User Consent:</strong> Don't load tracking widgets
            until user consents. Implement consent gating.
          </li>
          <li>
            <strong>Document Widget Contracts:</strong> Document the postMessage
            API, expected events, and data formats for each widget.
          </li>
          <li>
            <strong>Test on Slow Networks:</strong> Test widget loading on
            3G/slow networks. Implement loading states and timeouts.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No Iframe Isolation:</strong> Rendering third-party widgets
            directly in your DOM allows them to access your data and interfere
            with your app.
          </li>
          <li>
            <strong>Skipping Origin Validation:</strong> Processing postMessage
            without checking event.origin allows attackers to send malicious
            messages.
          </li>
          <li>
            <strong>Passing Raw Tokens:</strong> Passing session tokens or API
            keys to widgets gives them full access to your backend.
          </li>
          <li>
            <strong>No Teardown:</strong> Not cleaning up listeners and timers
            causes memory leaks that accumulate over long sessions.
          </li>
          <li>
            <strong>Eager Loading:</strong> Loading all widgets on page load
            wastes bandwidth and delays interactivity.
          </li>
          <li>
            <strong>No Monitoring:</strong> Not monitoring widget performance
            means you won't know when they break or degrade.
          </li>
          <li>
            <strong>Ignoring Consent:</strong> Loading tracking widgets before
            user consent violates GDPR and CCPA.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce: Payment Widget Integration</h3>
        <p>
          <strong>Problem:</strong> E-commerce site needed to integrate Stripe
          payment widget securely without exposing sensitive payment data.
        </p>
        <p>
          <strong>Solution:</strong> Rendered Stripe Elements in iframe with
          strict CSP. Used token-based authentication (not raw card data).
          Implemented webhook for payment confirmation.
        </p>
        <p>
          <strong>Results:</strong> Achieved PCI SAQ-A compliance (lowest
          scope). Zero security incidents. Payment completion rate increased 12%
          due to trusted Stripe branding.
        </p>

        <h3>SaaS: Chat Widget with Identity Handoff</h3>
        <p>
          <strong>Problem:</strong> SaaS company wanted chat widget to show user
          identity and conversation history without compromising security.
        </p>
        <p>
          <strong>Solution:</strong> Used iframe isolation. Generated HMAC hash
          of user_id for secure identity verification. Lazy loaded chat on user
          click. Implemented proper teardown on logout.
        </p>
        <p>
          <strong>Results:</strong> Secure identity handoff verified by chat
          vendor. Page load impact reduced from 2.5s to 0s (lazy load). Support
          ticket resolution time decreased 25%.
        </p>

        <h3>Media Site: Social Embed Privacy</h3>
        <p>
          <strong>Problem:</strong> Media site embedded Twitter and YouTube
          content but was tracking users without consent, risking GDPR
          violations.
        </p>
        <p>
          <strong>Solution:</strong> Implemented static fallback pattern. Showed
          screenshot preview with "Load tweet" button. Only loaded actual embed
          if user clicked.
        </p>
        <p>
          <strong>Results:</strong> Achieved GDPR compliance. 40% of users chose
          not to load embeds (saving bandwidth). Page load time improved 35%.
        </p>

        <h3>Financial Services: Widget Security Hardening</h3>
        <p>
          <strong>Problem:</strong> Financial services company used multiple
          third-party widgets (chat, scheduling, analytics) and needed to ensure
          they couldn't access sensitive data.
        </p>
        <p>
          <strong>Solution:</strong> Isolated all widgets in iframes with strict
          sandbox attributes. Implemented CSP with nonce for inline scripts.
          Used postMessage with origin validation for all communication.
        </p>
        <p>
          <strong>Results:</strong> Passed security audit with zero findings.
          Widgets cannot access sensitive account data. Security team approved
          third-party widget usage.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 1: What are the security risks of embedding third-party
              widgets and how do you mitigate them?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <p className="mb-3">
              Third-party widgets introduce several security risks:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Data Access:</strong> Widgets can access DOM, cookies,
                localStorage, and in-memory data if not isolated.
              </li>
              <li>
                <strong>XSS Attacks:</strong> Compromised widgets can inject
                malicious scripts into your page.
              </li>
              <li>
                <strong>Tracking:</strong> Widgets can track users across sites
                for advertising without consent.
              </li>
              <li>
                <strong>Supply Chain Attacks:</strong> Widget vendor compromise
                can affect all sites using the widget.
              </li>
            </ul>
            <p className="mb-3">Mitigation strategies:</p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Iframe Isolation:</strong> Render widgets in iframes
                with sandbox attribute to prevent direct access.
              </li>
              <li>
                <strong>CSP:</strong> Use Content Security Policy to restrict
                script sources.
              </li>
              <li>
                <strong>postMessage Validation:</strong> Always validate
                event.origin before processing messages.
              </li>
              <li>
                <strong>Minimal Data:</strong> Only pass data the widget needs.
                Never pass session tokens or API keys.
              </li>
              <li>
                <strong>Vendor Vetting:</strong> Review vendor security
                practices before integration.
              </li>
            </ul>
            <p>
              The key principle is <strong>defense in depth</strong>: use
              multiple layers of protection, not just one.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 2: How does postMessage work and what are the security
              considerations?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <p className="mb-3">
              postMessage is an API for cross-origin communication between
              windows (e.g., parent app and iframe).
            </p>
            <p className="mb-3">Security considerations:</p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Validate Origin:</strong> Always check event.origin
                before processing messages. Attackers can send messages from any
                origin.
              </li>
              <li>
                <strong>Specify Target Origin:</strong> Never use '*' as
                targetOrigin. Always specify the exact expected origin.
              </li>
              <li>
                <strong>Validate Message Structure:</strong> Check message type
                and data structure before processing to prevent injection
                attacks.
              </li>
              <li>
                <strong>Acknowledge Messages:</strong> Send acknowledgment back
                to sender for reliable communication.
              </li>
            </ul>
            <p>
              Example pattern: Parent validates iframe origin before sending;
              iframe validates parent origin before receiving. Both sides use
              explicit origins, never '*'.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 3: How do you securely pass user identity to a
              third-party widget?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Never Pass Raw Tokens:</strong> Don't pass session
                tokens or API keys. This gives widgets full backend access.
              </li>
              <li>
                <strong>Use HMAC Verification:</strong> Generate HMAC hash of
                user_id using a shared secret between your backend and widget
                backend. Widget backend verifies the hash to confirm identity
                hasn't been tampered with.
              </li>
              <li>
                <strong>Minimal Data:</strong> Only pass necessary data
                (user_id, email, name). Don't pass sensitive data.
              </li>
              <li>
                <strong>Consent Check:</strong> Only pass identity if user has
                consented to data sharing.
              </li>
              <li>
                <strong>Short-Lived:</strong> Use short-lived tokens that expire
                quickly to limit damage if intercepted.
              </li>
            </ul>
            <p>
              HMAC verification is the industry standard pattern used by
              Intercom, Drift, Zendesk, and other chat vendors for secure
              identity handoff.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 4: What is the widget lifecycle and why is teardown
              important?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <p className="mb-3">Widget lifecycle has four stages:</p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Load:</strong> Inject script, initialize SDK.
              </li>
              <li>
                <strong>Mount:</strong> Render UI, attach listeners, start
                timers.
              </li>
              <li>
                <strong>Active:</strong> Handle interactions, API calls.
              </li>
              <li>
                <strong>Unmount:</strong> Remove UI, detach listeners, clear
                timers, nullify refs.
              </li>
            </ul>
            <p className="mb-3">Teardown is critical because:</p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Memory Leaks:</strong> Uncleaned listeners and timers
                keep widgets alive after unmount, causing memory to grow over
                time.
              </li>
              <li>
                <strong>Ghost Events:</strong> Listeners from unmounted widgets
                can fire and cause errors or unexpected behavior.
              </li>
              <li>
                <strong>Resource Waste:</strong> Timers continue running,
                consuming CPU and battery.
              </li>
            </ul>
            <p>
              Test teardown by mounting/unmounting widget 50+ times and checking
              for memory growth. Memory should stay stable, not grow.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 5: What are the different widget loading patterns and
              when do you use each?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Eager Load:</strong> Load on page load. Use only for
                critical widgets (payment on checkout). Rarely recommended.
              </li>
              <li>
                <strong>Lazy Load on Interaction:</strong> Show placeholder
                button, load on click. Best for chat widgets, support desks.
                Zero impact on page load.
              </li>
              <li>
                <strong>Lazy Load on Visibility:</strong> Load when scrolled
                into view. Best for embeds, comments. Good UX/performance
                balance.
              </li>
              <li>
                <strong>Static Fallback:</strong> Show static preview with
                "Load" button. Best for privacy-focused sites, social embeds.
                Maximum privacy.
              </li>
            </ul>
            <p>
              The general principle is{" "}
              <strong>load widgets only when needed</strong>. Most widgets
              should use lazy loading, not eager loading.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 6: How do you monitor third-party widgets in production?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Load Time:</strong> Track time from load trigger to
                widget ready. Alert if &gt; 3 seconds.
              </li>
              <li>
                <strong>Error Rate:</strong> Track JavaScript errors from
                widget. Alert on elevated error rates.
              </li>
              <li>
                <strong>Memory Usage:</strong> Track memory before and after
                widget load. Alert if increase &gt; 50MB.
              </li>
              <li>
                <strong>Interaction Success:</strong> Track successful widget
                interactions (messages sent, payments completed). Alert on drop
                in success rate.
              </li>
              <li>
                <strong>Availability:</strong> Track widget uptime. Alert if
                widget fails to load for &gt; 5% of users.
              </li>
              <li>
                <strong>Kill Switch:</strong> Implement remote kill switch to
                disable widget if issues detected.
              </li>
            </ul>
            <p>
              Monitoring is critical because third-party widgets are outside
              your control. You need to know when they break before users
              complain.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN: &lt;iframe&gt; Element
            </a>{" "}
            — Documentation on iframe attributes including sandbox.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN: Window.postMessage()
            </a>{" "}
            — postMessage API documentation and security considerations.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Shadow_DOM"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN: Shadow DOM
            </a>{" "}
            — Shadow DOM documentation for CSS isolation.
          </li>
          <li>
            <a
              href="https://web.dev/third-party-facades/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev: Third-Party Facades
            </a>{" "}
            — Pattern for lazy loading third-party embeds with static fallbacks.
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Scripting_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP: XSS Prevention Cheat Sheet
            </a>{" "}
            — Security guidance for preventing XSS via third-party scripts.
          </li>
          <li>
            <a
              href="https://intercom.com/help/en/articles/189-turn-on-identity-verification-for-your-inbox"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Intercom: Identity Verification
            </a>{" "}
            — Example of HMAC-based identity verification for chat widgets.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
