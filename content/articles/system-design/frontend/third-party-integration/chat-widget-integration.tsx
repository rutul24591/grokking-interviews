"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-third-party-integration-chat-widget-integration",
  title: "Chat Widget Integration",
  description:
    "Staff-level chat widget integration: isolation strategies, identity handoff with HMAC verification, performance budgets, privacy controls, and operational kill switches for third-party support chat in SPAs.",
  category: "frontend",
  subcategory: "third-party-integration",
  slug: "chat-widget-integration",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: [
    "frontend",
    "chat",
    "third-party",
    "widgets",
    "privacy",
    "performance",
    "reliability",
    "identity",
  ],
  relatedTopics: [
    "widget-embedding",
    "oauth-integration",
    "script-loading-strategies",
    "security-authentication",
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
          <strong>Chat widget integration</strong> is the embedding of a
          third-party customer support or sales chat capability into your
          application. Chat widgets are commonly used because they reduce
          operational overhead (vendor handles agents, UI, and infrastructure),
          but they come with significant runtime and privacy implications.
        </p>
        <p>
          Chat widgets are usually long-lived, high-privilege scripts: they
          attach global listeners, open connections, collect context, and often
          run throughout the session. This makes them one of the most common
          sources of frontend performance regressions and data exposure,
          especially in enterprise products where customer trust and compliance
          expectations are high.
        </p>
        <p>
          For staff-level engineers, chat widget integration focuses on: making
          chat optional, constraining what data the widget can access, ensuring
          the widget doesn't degrade core performance, and having operational
          controls to disable the widget if it causes issues.
        </p>
        <p>The business impact of chat widget decisions is significant:</p>
        <ul className="space-y-2">
          <li>
            <strong>Customer Support:</strong> Chat is often the primary support
            channel. Widget failures mean support tickets go unanswered.
          </li>
          <li>
            <strong>Conversion:</strong> Sales chat can increase conversion by
            10-30%. But heavy widgets slow page load, reducing conversion.
          </li>
          <li>
            <strong>Privacy:</strong> Chat widgets collect user data (pages
            visited, actions taken). GDPR/CCPA require consent and data handling
            compliance.
          </li>
          <li>
            <strong>Performance:</strong> Chat widgets can add 200-500KB and
            multiple requests. Unoptimized widgets slow page load significantly.
          </li>
        </ul>
        <p>
          In system design interviews, chat widget integration demonstrates
          understanding of third-party isolation, identity handoff security,
          performance optimization, and operational risk management. It shows
          you think about production realities, not just feature implementation.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/chat-widget-isolation.svg"
          alt="Chat widget isolation comparison: without isolation (same DOM, full access to app data) vs with iframe isolation (separate context, postMessage communication only)"
          caption="Chat widget isolation — iframes prevent widget from accessing app data; communication happens via controlled postMessage channel"
        />

        <h3>Widget Isolation</h3>
        <p>
          Chat widgets must be isolated from your application to prevent
          security and stability issues:
        </p>

        <h4>Isolation Level 1: Iframe (Recommended)</h4>
        <ul className="space-y-2">
          <li>
            <strong>Security:</strong> Widget runs in separate browsing context.
            Cannot access parent DOM, cookies, or JavaScript variables.
          </li>
          <li>
            <strong>CSS:</strong> Widget styles cannot conflict with parent app
            styles.
          </li>
          <li>
            <strong>Performance:</strong> Widget has separate rendering
            pipeline. Heavy widget doesn't block parent app rendering.
          </li>
          <li>
            <strong>Communication:</strong> Use postMessage for parent-widget
            communication. Validate origins on both sides.
          </li>
        </ul>

        <h4>Isolation Level 2: Shadow DOM</h4>
        <ul className="space-y-2">
          <li>
            <strong>Security:</strong> Widget can still access parent JavaScript
            context. Less secure than iframe.
          </li>
          <li>
            <strong>CSS:</strong> Widget styles are scoped to shadow root. No
            conflicts.
          </li>
          <li>
            <strong>Performance:</strong> Lighter weight than iframe. No
            separate rendering pipeline.
          </li>
          <li>
            <strong>Communication:</strong> Direct JavaScript access. No
            postMessage needed.
          </li>
        </ul>
        <p>
          <strong>Recommendation:</strong> Use iframe for third-party chat
          widgets. Shadow DOM only for trusted internal widgets.
        </p>

        <h3>Identity Handoff</h3>
        <p>
          Chat widgets need user identity to provide personalized support (chat
          history, account context). The identity handoff must be secure:
        </p>

        <h4>Secure Identity Handoff Pattern</h4>
        <ul className="space-y-2">
          <li>
            <strong>Generate HMAC:</strong> On your backend, generate HMAC hash
            of user_id using shared secret with chat vendor.
          </li>
          <li>
            <strong>Pass to Widget:</strong> Send user_id + HMAC hash to widget.
            Never pass session tokens or API keys.
          </li>
          <li>
            <strong>Vendor Verifies:</strong> Chat vendor's backend verifies
            HMAC matches user_id. Confirms identity hasn't been tampered with.
          </li>
          <li>
            <strong>Minimal Data:</strong> Only pass necessary data (user_id,
            email, name). Don't pass sensitive data.
          </li>
        </ul>
        <p>
          <strong>Why HMAC:</strong> Prevents attackers from impersonating
          users. Even if attacker intercepts identity, they can't generate valid
          HMAC without shared secret.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/chat-identity-handoff.svg"
          alt="Chat identity handoff flow showing app generating HMAC hash, sending to chat widget, widget backend verifying hash, and loading conversation history"
          caption="Identity handoff — HMAC verification prevents impersonation; only pass minimal user data; never pass raw tokens"
        />

        <h3>Performance Budget</h3>
        <p>
          Chat widgets must meet performance budgets to avoid degrading core
          experience:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Load Time:</strong> Widget should load in &lt;2 seconds.
            Measure from load trigger to widget ready.
          </li>
          <li>
            <strong>Bundle Size:</strong> Widget bundle should be &lt;150KB
            gzipped. Larger bundles slow initial load.
          </li>
          <li>
            <strong>Memory:</strong> Widget should use &lt;50MB memory. Monitor
            memory before and after widget load.
          </li>
          <li>
            <strong>CPU:</strong> Widget should use &lt;5% main thread time.
            Heavy widgets cause jank.
          </li>
        </ul>
        <p>
          <strong>Monitoring:</strong> Track these metrics in production. Alert
          if widget exceeds budgets.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/chat-performance-budget.svg"
          alt="Chat widget performance budget dashboard showing load time target (&lt;2s), bundle size (&lt;150KB), memory (&lt;50MB), and CPU (&lt;5%) with monitoring alerts"
          caption="Performance budgets — set targets for load time, bundle size, memory, CPU; monitor continuously; alert on violations"
        />

        <h3>Loading Patterns</h3>
        <p>How you load the chat widget significantly impacts performance:</p>

        <h4>Pattern 1: Eager Load (Not Recommended)</h4>
        <ul className="space-y-2">
          <li>Load widget on page load.</li>
          <li>
            <strong>Pros:</strong> Widget immediately available.
          </li>
          <li>
            <strong>Cons:</strong> Impacts initial page load. Wastes bandwidth
            if user never opens chat.
          </li>
          <li>
            <strong>Use Case:</strong> Avoid unless chat is core functionality
            (support-first products).
          </li>
        </ul>

        <h4>Pattern 2: Lazy Load on Interaction (Recommended)</h4>
        <ul className="space-y-2">
          <li>
            Show chat button initially. Load widget when user clicks button.
          </li>
          <li>
            <strong>Pros:</strong> Zero impact on page load. Only users who need
            chat pay the cost.
          </li>
          <li>
            <strong>Cons:</strong> Slight delay when user first opens chat.
          </li>
          <li>
            <strong>Use Case:</strong> Most sites. Best balance of performance
            and UX.
          </li>
        </ul>

        <h4>Pattern 3: Preload on Delay</h4>
        <ul className="space-y-2">
          <li>Load widget after page load completes (e.g., 3 second delay).</li>
          <li>
            <strong>Pros:</strong> Doesn't block initial load. Widget ready when
            user opens.
          </li>
          <li>
            <strong>Cons:</strong> Still loads for all users. Wastes bandwidth
            if never used.
          </li>
          <li>
            <strong>Use Case:</strong> High chat usage sites where most users
            open chat.
          </li>
        </ul>
        <p>
          <strong>Recommendation:</strong> Lazy load on interaction for most
          sites. Preload on delay only if chat usage is &gt;50%.
        </p>

        <h3>Privacy and Consent</h3>
        <p>
          Chat widgets collect user data (pages visited, actions taken,
          conversation history). GDPR/CCPA require consent:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Consent Check:</strong> Before loading chat widget, check if
            user consented to data collection.
          </li>
          <li>
            <strong>Data Minimization:</strong> Only pass necessary data to chat
            widget. Don't pass sensitive data.
          </li>
          <li>
            <strong>Right to Delete:</strong> Have process to delete chat
            history when user requests data deletion.
          </li>
          <li>
            <strong>Data Processing Agreement:</strong> Sign DPA with chat
            vendor. Ensure they comply with GDPR/CCPA.
          </li>
        </ul>
        <p>
          <strong>Implementation:</strong> Check consent status before
          initializing chat. If no consent, show message: "Enable chat to
          contact support" with consent button.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          A robust chat widget architecture treats the widget as an{" "}
          <strong>untrusted micro-frontend</strong> that must be isolated,
          monitored, and controlled.
        </p>

        <h3>Widget Lifecycle</h3>
        <p>Chat widgets have a lifecycle that must be managed:</p>
        <ul className="space-y-2">
          <li>
            <strong>Load:</strong> Inject script, initialize SDK, create iframe
            container.
          </li>
          <li>
            <strong>Mount:</strong> Render widget UI, attach event listeners,
            open connection.
          </li>
          <li>
            <strong>Active:</strong> Handle user messages, agent responses,
            typing indicators.
          </li>
          <li>
            <strong>Unmount:</strong> Close connection, detach listeners, remove
            iframe, nullify references.
          </li>
        </ul>
        <p>
          <strong>Teardown is critical:</strong> Chat widgets often keep
          connections open. Failing to close connections causes memory leaks and
          continued data collection after user leaves page.
        </p>

        <h3>Error Handling</h3>
        <p>Chat widgets can fail. Handle errors gracefully:</p>
        <ul className="space-y-2">
          <li>
            <strong>Load Failure:</strong> If widget fails to load, show
            fallback: "Chat unavailable. Email us at support@..."
          </li>
          <li>
            <strong>Connection Lost:</strong> If connection drops during chat,
            show: "Connection lost. Reconnecting..."
          </li>
          <li>
            <strong>Timeout:</strong> If widget takes &gt;5 seconds to load,
            abort and show fallback.
          </li>
          <li>
            <strong>Agent Unavailable:</strong> If no agents available, show:
            "Agents offline. Leave a message."
          </li>
        </ul>

        <h3>Monitoring</h3>
        <p>Monitor chat widget in production:</p>
        <ul className="space-y-2">
          <li>
            <strong>Load Time:</strong> Track time from load trigger to widget
            ready. Alert if &gt;3 seconds.
          </li>
          <li>
            <strong>Error Rate:</strong> Track widget errors. Alert on elevated
            error rates.
          </li>
          <li>
            <strong>Connection Rate:</strong> Track successful connections vs
            failures.
          </li>
          <li>
            <strong>Response Time:</strong> Track time to first agent response.
            Alert if degrading.
          </li>
          <li>
            <strong>Kill Switch:</strong> Implement remote kill switch to
            disable widget if issues detected.
          </li>
        </ul>

        <h3>Kill Switch</h3>
        <p>
          Implement a kill switch to disable chat widget if it causes issues:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Remote Config:</strong> Fetch chat enabled/disabled from
            remote config service.
          </li>
          <li>
            <strong>Feature Flag:</strong> Wrap widget initialization in feature
            flag.
          </li>
          <li>
            <strong>Automatic Disable:</strong> Auto-disable if error rate
            exceeds threshold.
          </li>
          <li>
            <strong>Manual Override:</strong> Allow support team to disable
            widget during incidents.
          </li>
        </ul>
        <p>
          <strong>Why critical:</strong> Chat widget failures can block support
          entirely. Kill switch allows quick mitigation while investigating root
          cause.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Chat widget integration involves trade-offs between functionality,
          performance, and privacy.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Loading Pattern</th>
              <th className="p-3 text-left">Performance</th>
              <th className="p-3 text-left">UX</th>
              <th className="p-3 text-left">Bandwidth</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Eager Load</td>
              <td className="p-3">Poor</td>
              <td className="p-3">Best (immediate)</td>
              <td className="p-3">Waste (all users)</td>
              <td className="p-3">Support-first products</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Lazy Load</td>
              <td className="p-3">Best</td>
              <td className="p-3">Good (small delay)</td>
              <td className="p-3">Efficient (only users who open)</td>
              <td className="p-3">Most sites</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Preload on Delay</td>
              <td className="p-3">Fair</td>
              <td className="p-3">Best (ready when needed)</td>
              <td className="p-3">Waste (all users)</td>
              <td className="p-3">High chat usage (&gt;50%)</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level insight is that{" "}
          <strong>lazy load on interaction</strong> is the default choice. The
          small delay when first opening chat is acceptable trade-off for zero
          impact on page load.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Iframe Isolation:</strong> Always isolate chat widget in
            iframe. Never render directly in your DOM.
          </li>
          <li>
            <strong>Lazy Load Widget:</strong> Load widget only when user clicks
            chat button. Don't load on page load.
          </li>
          <li>
            <strong>Use HMAC for Identity:</strong> Never pass raw tokens. Use
            HMAC verification for secure identity handoff.
          </li>
          <li>
            <strong>Set Performance Budgets:</strong> Define maximum load time,
            bundle size, memory usage. Monitor and alert.
          </li>
          <li>
            <strong>Implement Kill Switch:</strong> Have remote kill switch to
            disable widget if it causes issues.
          </li>
          <li>
            <strong>Respect Consent:</strong> Don't load chat until user
            consents to data collection.
          </li>
          <li>
            <strong>Proper Teardown:</strong> Close connections and detach
            listeners on unmount. Prevent memory leaks.
          </li>
          <li>
            <strong>Error Fallback:</strong> Show fallback (email, contact form)
            if chat fails to load.
          </li>
          <li>
            <strong>Monitor Metrics:</strong> Track load time, error rate,
            connection rate, response time.
          </li>
          <li>
            <strong>Minimal Data:</strong> Only pass necessary data to chat
            widget. Don't pass sensitive data.
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
            <strong>No Iframe Isolation:</strong> Rendering widget directly in
            DOM allows it to access your data.
          </li>
          <li>
            <strong>Eager Loading:</strong> Loading widget on page load wastes
            bandwidth and slows page load.
          </li>
          <li>
            <strong>Passing Raw Tokens:</strong> Passing session tokens gives
            widget full backend access.
          </li>
          <li>
            <strong>No Teardown:</strong> Not closing connections causes memory
            leaks and continued data collection.
          </li>
          <li>
            <strong>No Consent Check:</strong> Loading chat without consent
            violates GDPR/CCPA.
          </li>
          <li>
            <strong>No Monitoring:</strong> Without monitoring, you won't know
            when chat breaks.
          </li>
          <li>
            <strong>No Kill Switch:</strong> Can't disable widget during
            incidents.
          </li>
          <li>
            <strong>Passing Sensitive Data:</strong> Passing PII or sensitive
            data to chat vendor without DPA.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>SaaS: Secure Identity Handoff</h3>
        <p>
          <strong>Problem:</strong> SaaS company wanted chat widget to show user
          identity and account context without compromising security.
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

        <h3>E-Commerce: Performance Optimization</h3>
        <p>
          <strong>Problem:</strong> E-commerce site's chat widget slowed page
          load, impacting conversion.
        </p>
        <p>
          <strong>Solution:</strong> Implemented lazy loading on chat button
          click. Set performance budgets (load time &lt;2s, bundle &lt;150KB).
          Monitored and alerted on violations.
        </p>
        <p>
          <strong>Results:</strong> Page load time improved 1.8s. Conversion
          rate increased 12%. Chat usage unchanged (users still opened chat when
          needed).
        </p>

        <h3>Financial Services: Privacy Compliance</h3>
        <p>
          <strong>Problem:</strong> Financial services company needed chat but
          had strict privacy requirements.
        </p>
        <p>
          <strong>Solution:</strong> Implemented consent gating. Don't load chat
          until user consents. Signed DPA with chat vendor. Implemented data
          deletion process.
        </p>
        <p>
          <strong>Results:</strong> Achieved GDPR/CCPA compliance. 70% of users
          consented to chat. Zero compliance incidents.
        </p>

        <h3>Healthcare: Kill Switch Implementation</h3>
        <p>
          <strong>Problem:</strong> Healthcare company's chat widget caused
          issues during peak hours but couldn't disable quickly.
        </p>
        <p>
          <strong>Solution:</strong> Implemented remote kill switch via feature
          flag. Added automatic disable on elevated error rates. Created
          fallback (phone, email) for chat outages.
        </p>
        <p>
          <strong>Results:</strong> During chat vendor outage, disabled widget
          in 2 minutes. Fallback channels handled support. Zero customer impact.
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
              Question 1: How do you securely pass user identity to a chat
              widget?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Never Pass Raw Tokens:</strong> Don't pass session
                tokens or API keys. This gives widget full backend access.
              </li>
              <li>
                <strong>Use HMAC Verification:</strong> Generate HMAC hash of
                user_id using shared secret between your backend and chat vendor
                backend. Chat vendor verifies hash to confirm identity hasn't
                been tampered with.
              </li>
              <li>
                <strong>Minimal Data:</strong> Only pass necessary data
                (user_id, email, name). Don't pass sensitive data.
              </li>
              <li>
                <strong>Consent Check:</strong> Only pass identity if user has
                consented to data sharing.
              </li>
            </ul>
            <p>
              HMAC verification is industry standard pattern used by Intercom,
              Drift, Zendesk, and other chat vendors for secure identity
              handoff.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 2: Why should you use iframe for chat widget isolation?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Security:</strong> Iframe creates separate browsing
                context. Widget cannot access parent DOM, cookies, localStorage,
                or JavaScript variables.
              </li>
              <li>
                <strong>CSS Isolation:</strong> Widget styles cannot conflict
                with parent app styles.
              </li>
              <li>
                <strong>Performance:</strong> Widget has separate rendering
                pipeline. Heavy widget doesn't block parent app rendering.
              </li>
              <li>
                <strong>Sandbox:</strong> Can further restrict iframe
                capabilities using sandbox attribute.
              </li>
            </ul>
            <p>
              Shadow DOM provides CSS isolation but not JavaScript isolation.
              Only use iframe for third-party widgets.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 3: What are best practices for loading chat widgets?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Lazy Load:</strong> Load widget when user clicks chat
                button, not on page load. Zero impact on initial page load.
              </li>
              <li>
                <strong>Show Placeholder:</strong> Show chat button initially.
                Load widget on click.
              </li>
              <li>
                <strong>Preload Option:</strong> For high chat usage sites
                (&gt;50%), preload after page load completes (3 second delay).
              </li>
              <li>
                <strong>Avoid Eager Load:</strong> Don't load on page load
                unless chat is core functionality.
              </li>
            </ul>
            <p>
              Lazy loading is recommended for most sites. The small delay when
              first opening chat is acceptable trade-off for zero page load
              impact.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 4: How do you handle chat widget teardown?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Close Connection:</strong> Close websocket/connection to
                chat server.
              </li>
              <li>
                <strong>Detach Listeners:</strong> Remove all event listeners
                attached by widget.
              </li>
              <li>
                <strong>Clear Timers:</strong> Clear any setTimeout/setInterval
                timers.
              </li>
              <li>
                <strong>Remove DOM:</strong> Remove widget iframe/container from
                DOM.
              </li>
              <li>
                <strong>Nullify References:</strong> Set widget references to
                null to allow GC.
              </li>
            </ul>
            <p>
              Teardown is critical because chat widgets keep connections open.
              Failing to close connections causes memory leaks and continued
              data collection after user leaves page.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 5: How do you monitor chat widget in production?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Load Time:</strong> Track time from load trigger to
                widget ready. Alert if &gt;3 seconds.
              </li>
              <li>
                <strong>Error Rate:</strong> Track widget errors. Alert on
                elevated error rates.
              </li>
              <li>
                <strong>Connection Rate:</strong> Track successful connections
                vs failures.
              </li>
              <li>
                <strong>Response Time:</strong> Track time to first agent
                response. Alert if degrading.
              </li>
              <li>
                <strong>Memory Usage:</strong> Track memory before and after
                widget load. Alert if increase &gt;50MB.
              </li>
              <li>
                <strong>Kill Switch:</strong> Implement remote kill switch to
                disable widget if issues detected.
              </li>
            </ul>
            <p>
              Monitoring is critical because chat widget is outside your
              control. You need to know when it breaks before customers
              complain.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 6: How do you handle GDPR/CCPA compliance for chat
              widgets?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Consent Before Loading:</strong> Don't load chat widget
                until user consents to data collection.
              </li>
              <li>
                <strong>Data Minimization:</strong> Only pass necessary data to
                chat widget. Don't pass sensitive data.
              </li>
              <li>
                <strong>Data Processing Agreement:</strong> Sign DPA with chat
                vendor. Ensure they comply with GDPR/CCPA.
              </li>
              <li>
                <strong>Right to Delete:</strong> Have process to delete chat
                history when user requests data deletion.
              </li>
              <li>
                <strong>Privacy Policy:</strong> Disclose chat data collection
                in privacy policy.
              </li>
            </ul>
            <p>
              Non-compliance can result in fines up to 4% of global revenue
              under GDPR. Consent gating is critical.
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
              href="https://www.intercom.com/help/en/articles/189-turn-on-identity-verification-for-your-inbox"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Intercom: Identity Verification
            </a>{" "}
            — Example of HMAC-based identity verification for chat widgets.
          </li>
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
              href="https://web.dev/third-party-facades/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev: Third-Party Facades
            </a>{" "}
            — Pattern for lazy loading third-party embeds.
          </li>
          <li>
            <a
              href="https://gdpr.eu/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GDPR.eu
            </a>{" "}
            — GDPR compliance guide for businesses.
          </li>
          <li>
            <a
              href="https://www.drift.com/help/integrations/identity-verification/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Drift: Identity Verification
            </a>{" "}
            — Another example of secure identity handoff.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
