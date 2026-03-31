"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-backend-email-delivery-services",
  title: "Email Delivery Services",
  description:
    "Comprehensive guide to implementing email delivery services covering SMTP integration, email providers (SendGrid, SES, Postmark), template management, delivery tracking, spam prevention, and email queue management for reliable notification delivery.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "email-delivery-services",
  version: "extensive",
  wordCount: 6100,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: [
    "requirements",
    "functional",
    "communication",
    "email",
    "smtp",
    "backend",
    "notifications",
    "delivery-tracking",
  ],
  relatedTopics: ["notification-delivery", "push-notification-service", "sms-gateways", "template-management"],
};

export default function EmailDeliveryServicesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Email delivery services handle sending transactional and marketing emails reliably at scale. Transactional emails include password resets, order confirmations, notifications, and alerts. Marketing emails include newsletters, promotions, and campaigns. The service must handle high volume (millions per day), ensure deliverability (avoid spam folders), track engagement (opens, clicks, bounces), and comply with regulations (CAN-SPAM, GDPR).
        </p>
        <p>
          The complexity of email delivery stems from inbox provider variations (Gmail, Outlook, Yahoo each have different filtering), reputation management (sender score affects deliverability), bounce handling (hard vs soft bounces), and compliance requirements (unsubscribe links, physical address). Email providers (SendGrid, SES, Postmark) handle infrastructure but require proper integration for optimal deliverability.
        </p>
        <p>
          For staff and principal engineers, email delivery implementation involves infrastructure and compliance challenges. Queue management handles traffic spikes (password reset storms). Template management supports dynamic content and localization. Delivery tracking captures opens (tracking pixel), clicks (link rewriting), bounces (webhook callbacks). Spam prevention includes authentication (SPF, DKIM, DMARC), list hygiene, and complaint monitoring. The architecture must balance cost (per-email pricing) with reliability.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Email Providers</h3>
        <p>
          SendGrid (Twilio): Full-featured email API. Pros: Good deliverability, analytics, templates, marketing features. Cons: Higher cost at scale. Pricing: $15/month for 40K emails, then tiered. Best for: Startups to enterprise.
        </p>
        <p>
          Amazon SES (Simple Email Service): AWS native email service. Pros: Lowest cost, integrates with AWS. Cons: Basic features, manual reputation management. Pricing: $0.10 per 1000 emails. Best for: AWS users, high volume.
        </p>
        <p>
          Postmark: Transactional email focused. Pros: Excellent deliverability, fast delivery, great support. Cons: Higher cost, no marketing emails. Pricing: $15/month for 10K emails. Best for: Transactional emails only.
        </p>
        <p>
          Mailgun: Developer-focused email API. Pros: Good API, email validation, routing. Cons: Deliverability varies. Pricing: $35/month for 50K emails. Best for: Developers, email routing.
        </p>

        <h3 className="mt-6">SMTP vs API</h3>
        <p>
          SMTP (Simple Mail Transfer Protocol): Traditional email protocol. Pros: Universal support, works with any email library. Cons: Slower, less features, no tracking built-in. Best for: Legacy systems, simple sending.
        </p>
        <p>
          REST API: Modern provider APIs. Pros: Faster, tracking built-in, templates, attachments, batching. Cons: Provider-specific integration. Best for: Modern applications, full features.
        </p>
        <p>
          Hybrid: API for features, SMTP fallback. Pros: Best of both. Cons: More complex. Best for: High availability requirements.
        </p>

        <h3 className="mt-6">Email Templates</h3>
        <p>
          Server-side templates: Render HTML on server before sending. Pros: Full control, dynamic content. Cons: Requires server rendering. Tools: Handlebars, Pug, EJS. Best for: Dynamic transactional emails.
        </p>
        <p>
          Provider templates: Store templates in email provider. Pros: No server rendering, marketer-friendly. Cons: Less flexible, vendor lock-in. Best for: Marketing emails, non-technical teams.
        </p>
        <p>
          Template variables: Replace placeholders with dynamic content. Example: (user.name), (order.total). Support conditionals, loops, formatting. Version templates for updates.
        </p>

        <h3 className="mt-6">Delivery Tracking</h3>
        <p>
          Open tracking: Embed invisible tracking pixel (1x1 image). When email loads image, open recorded. Pros: Simple, universal. Cons: Blocked by some clients (Apple Mail privacy), images disabled. Open rate typically 15-25%.
        </p>
        <p>
          Click tracking: Rewrite links through tracking domain. Click redirects through tracker, then to destination. Pros: Accurate, per-link tracking. Cons: Links look suspicious, may trigger spam filters. Click rate typically 2-5%.
        </p>
        <p>
          Bounce handling: Hard bounce (permanent, invalid email) vs soft bounce (temporary, full inbox). Hard bounces: remove from list immediately. Soft bounces: retry 2-3 times, then suppress. Bounce rate should be &lt;2%.
        </p>
        <p>
          Complaint tracking: Users mark email as spam. Provider sends webhook notification. Immediately suppress complainer. Complaint rate should be &lt;0.1% (1 per 1000 emails).
        </p>

        <h3 className="mt-6">Spam Prevention</h3>
        <p>
          Authentication: SPF (Sender Policy Framework) DNS record lists authorized senders. DKIM (DomainKeys Identified Mail) signs emails cryptographically. DMARC (Domain-based Message Authentication) policy tells receivers what to do if SPF/DKIM fail. All three essential for deliverability.
        </p>
        <p>
          Sender reputation: IP and domain reputation affects inbox placement. Build reputation gradually (warm up new IPs). Maintain low bounce (&lt;2%) and complaint (&lt;0.1%) rates. Monitor sender score (0-100, aim for 90+).
        </p>
        <p>
          Content filtering: Avoid spam trigger words ("FREE", "BUY NOW", excessive punctuation!!!). Balance text-to-image ratio (not image-only). Include unsubscribe link (required by law). Include physical address (CAN-SPAM requirement).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Email delivery architecture spans queue management, template rendering, provider integration, and tracking. Emails queued for async processing. Templates rendered with dynamic content. Provider API sends email. Webhooks handle delivery events (sent, delivered, opened, clicked, bounced, complained).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/email-delivery-services/email-architecture.svg"
          alt="Email Delivery Architecture"
          caption="Figure 1: Email Delivery Architecture — Queue, template rendering, provider integration, and webhook tracking"
          width={1000}
          height={500}
        />

        <h3>Queue Management</h3>
        <p>
          Email queue decouples request from sending. Queue emails (Redis, SQS, RabbitMQ). Workers process queue at controlled rate (avoid provider rate limits). Priority queues for urgent emails (password reset vs newsletter). Retry logic for transient failures.
        </p>
        <p>
          Rate limiting: Respect provider limits (SendGrid: 100/sec, SES: varies). Implement backpressure (slow down if queue grows). Batch emails when possible (multiple recipients in single API call). Cost optimization (batching reduces API calls).
        </p>
        <p>
          Scheduling: Send emails at specific times (scheduled newsletters). Timezone-aware scheduling (send at 9 AM recipient time). Throttle sending (spread sends over time to avoid spikes).
        </p>

        <h3 className="mt-6">Template Rendering</h3>
        <p>
          Template storage: Store templates in database or version control. Include HTML version, plain-text version (required for deliverability). Store template metadata (name, version, variables).
        </p>
        <p>
          Rendering pipeline: Fetch template, merge with data (user name, order details), inline CSS (some email clients block external stylesheets), remove scripts (security), minify HTML (reduce size). Output: final HTML and plain-text.
        </p>
        <p>
          Localization: Support multiple languages. Store translations per template. Detect user language (profile preference, browser). Render template in user language. Fallback to default language if translation missing.
        </p>

        <h3 className="mt-6">Provider Integration</h3>
        <p>
          API client: Use provider SDK or direct HTTP API. Authenticate with API key. Handle rate limits (429 response, retry after). Implement circuit breaker (stop sending if provider down). Log all API calls for debugging.
        </p>
        <p>
          Multi-provider failover: Primary provider (SendGrid), backup provider (SES). If primary fails (5xx errors), switch to backup. Track provider health (error rates). DNS failover for webhook endpoints.
        </p>
        <p>
          Attachment handling: Upload attachments to provider or provide URLs. Size limits (SendGrid: 30MB total). Virus scan attachments before sending. Convert to PDF for consistency.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/email-delivery-services/tracking-flow.svg"
          alt="Email Tracking Flow"
          caption="Figure 2: Email Tracking Flow — Open tracking pixel, click tracking links, and webhook callbacks"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Webhook Handling</h3>
        <p>
          Webhook events: sent, delivered, opened, clicked, bounced, complained, unsubscribed. Provider POSTs events to your endpoint. Verify webhook signature (prevent spoofing). Process events asynchronously (queue for processing).
        </p>
        <p>
          Event processing: Update email status in database. Track engagement (opens, clicks per user). Handle bounces (suppress hard bounces immediately). Handle complaints (suppress immediately, investigate). Update user preferences (unsubscribe).
        </p>
        <p>
          Idempotency: Webhooks may deliver duplicate events. Use event ID for deduplication. Store processed event IDs with TTL. Process each event once even if delivered multiple times.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/email-delivery-services/spam-prevention.svg"
          alt="Spam Prevention"
          caption="Figure 3: Spam Prevention — SPF, DKIM, DMARC authentication and reputation management"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Email delivery design involves trade-offs between cost, deliverability, features, and complexity. Understanding these trade-offs enables informed decisions aligned with email volume and requirements.
        </p>

        <h3>Provider Selection: Cost vs Features</h3>
        <p>
          Low cost (SES): $0.10 per 1000 emails. Pros: Cheapest at scale. Cons: Basic features, manual reputation management, AWS-only. Best for: High volume, AWS users, budget-conscious.
        </p>
        <p>
          Balanced (SendGrid, Mailgun): $0.30-0.70 per 1000 emails. Pros: Good features, analytics, support. Cons: Higher cost. Best for: Most applications, balanced needs.
        </p>
        <p>
          Premium (Postmark): $1.50 per 1000 emails. Pros: Best deliverability, fastest delivery, excellent support. Cons: Highest cost, transactional only. Best for: Critical transactional emails, deliverability-focused.
        </p>

        <h3>Tracking: Privacy vs Analytics</h3>
        <p>
          Full tracking: Opens, clicks, device, location. Pros: Rich analytics, engagement insights. Cons: Privacy concerns, may trigger spam filters, blocked by privacy features (Apple Mail Privacy Protection). Best for: Marketing emails, analytics-focused.
        </p>
        <p>
          Minimal tracking: Only bounces, complaints. Pros: Privacy-friendly, better deliverability. Cons: Limited analytics. Best for: Transactional emails, privacy-focused apps.
        </p>
        <p>
          Opt-in tracking: Users choose tracking level. Pros: Respects privacy, compliant. Cons: Complex implementation, partial data. Best for: GDPR compliance, user-centric apps.
        </p>

        <h3>Template Management: Flexibility vs Simplicity</h3>
        <p>
          Code-based templates: Templates in codebase, rendered server-side. Pros: Full control, version control, testing. Cons: Requires deployment for changes, developer-dependent. Best for: Transactional emails, technical teams.
        </p>
        <p>
          Provider templates: Templates in provider UI. Pros: No deployment, marketer-friendly, A/B testing. Cons: Vendor lock-in, less flexible. Best for: Marketing emails, non-technical teams.
        </p>
        <p>
          Hybrid: Transactional in code, marketing in provider. Pros: Best of both. Cons: Two systems to manage. Best for: Most applications.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/email-delivery-services/provider-comparison.svg"
          alt="Provider Comparison"
          caption="Figure 4: Provider Comparison — Cost, features, and deliverability comparison"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use dedicated domain:</strong> Send from dedicated subdomain (notifications.yourapp.com). Isolate reputation from main domain. Easier to monitor and protect.
          </li>
          <li>
            <strong>Implement authentication:</strong> Set up SPF, DKIM, DMARC records. Verify with provider tools. Monitor DMARC reports. Essential for deliverability.
          </li>
          <li>
            <strong>Warm up IPs:</strong> Gradually increase volume on new IPs (100/day → 1000/day → 10000/day over 2-4 weeks). Builds reputation gradually. Prevents spam classification.
          </li>
          <li>
            <strong>Handle bounces properly:</strong> Hard bounces: suppress immediately. Soft bounces: retry 2-3 times over 24 hours, then suppress. Monitor bounce rate (&lt;2%).
          </li>
          <li>
            <strong>Process complaints immediately:</strong> Webhook → suppress within seconds. Complaint rate &lt;0.1%. Investigate high complaint sources.
          </li>
          <li>
            <strong>Include unsubscribe link:</strong> Required by law (CAN-SPAM, GDPR). One-click unsubscribe preferred. Honor within 10 days (legal requirement).
          </li>
          <li>
            <strong>Send plain-text version:</strong> Required for deliverability. Some clients prefer plain-text. Improves spam score.
          </li>
          <li>
            <strong>Test before sending:</strong> Use inbox testing tools (Litmus, Email on Acid). Test across clients (Gmail, Outlook, Apple Mail). Check spam score.
          </li>
          <li>
            <strong>Monitor sender reputation:</strong> Track sender score (senderScore.org). Monitor blacklist status (mxtoolbox.com). Alert on reputation drops.
          </li>
          <li>
            <strong>Segment email types:</strong> Separate transactional (password reset) from marketing (newsletter). Different IPs/domains. Transactional has higher deliverability.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No authentication:</strong> Missing SPF/DKIM/DMARC. Solution: Set up all three before sending. Verify with provider tools.
          </li>
          <li>
            <strong>Sending from shared IP:</strong> Reputation affected by other senders. Solution: Use dedicated IP for high volume (&gt;100K/month).
          </li>
          <li>
            <strong>Ignoring bounces:</strong> Continue sending to invalid emails. Solution: Process bounce webhooks, suppress hard bounces immediately.
          </li>
          <li>
            <strong>No unsubscribe link:</strong> Legal violation, increases complaints. Solution: Always include one-click unsubscribe.
          </li>
          <li>
            <strong>HTML-only emails:</strong> Some clients block HTML. Solution: Always include plain-text alternative.
          </li>
          <li>
            <strong>Large images:</strong> Slow load, blocked by clients. Solution: Optimize images, use text-to-image ratio 60:40.
          </li>
          <li>
            <strong>No testing:</strong> Emails render differently across clients. Solution: Test with Litmus or Email on Acid before sending.
          </li>
          <li>
            <strong>Mixing email types:</strong> Transactional and marketing from same domain. Solution: Separate domains/IPs for each type.
          </li>
          <li>
            <strong>Ignoring engagement:</strong> Sending to inactive users hurts reputation. Solution: Re-engagement campaigns, suppress inactive users.
          </li>
          <li>
            <strong>No monitoring:</strong> Don't know deliverability issues. Solution: Monitor delivery rate, open rate, bounce rate, complaints daily.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Password Reset Flow</h3>
        <p>
          User requests reset → generate token → queue email → render template with token → send via provider → track delivery. Token expires in 1 hour. Email includes security notice (location, time). High priority queue. Delivery time target: &lt;1 minute.
        </p>

        <h3 className="mt-6">Order Confirmation</h3>
        <p>
          Order placed → queue confirmation email → render template with order details, items, total → send → track opens/clicks (tracking link to order status). Include plain-text version. Attach PDF invoice. Transactional (high deliverability).
        </p>

        <h3 className="mt-6">Newsletter Campaign</h3>
        <p>
          Marketing team creates content → schedule send time → segment audience (active users, preferences) → throttle sending (spread over hours) → track opens/clicks/unsubscribes → A/B test subject lines. Marketing email (separate domain/IP).
        </p>

        <h3 className="mt-6">Notification Digest</h3>
        <p>
          Accumulate notifications over 24 hours → render digest template with top notifications → send daily at user's preferred time → track engagement. Reduces email volume vs individual notifications. User controls frequency (daily, weekly, never).
        </p>

        <h3 className="mt-6">Re-engagement Campaign</h3>
        <p>
          Identify inactive users (no opens in 90 days) → send re-engagement email ("We miss you") → track opens/clicks → if no engagement, suppress from future sends. Improves sender reputation by removing inactive subscribers.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure email deliverability?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement SPF, DKIM, DMARC authentication. Use dedicated domain/IP. Warm up new IPs gradually. Maintain low bounce rate (&lt;2%) and complaint rate (&lt;0.1%). Monitor sender score. Segment transactional vs marketing. Include unsubscribe link. Send plain-text version. Test with inbox placement tools.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle email bounces?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Webhook receives bounce event. Classify as hard (permanent, invalid email) or soft (temporary, full inbox). Hard bounce: suppress email immediately, mark user as invalid. Soft bounce: retry 2-3 times over 24 hours, then suppress if continues. Log bounce reason for analysis.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you track email opens and clicks?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Opens: embed 1x1 tracking pixel (unique URL per email). When pixel loads, record open with timestamp, device, location. Clicks: rewrite links through tracking domain, redirect to destination after recording click. Handle privacy features (Apple Mail Privacy Protection preloads pixels, inflates open rates).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle email templates at scale?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Store templates in version control (Git). Use template engine (Handlebars, EJS) for rendering. Support variables, conditionals, loops. Inline CSS for email client compatibility. Maintain HTML and plain-text versions. Localize templates for multiple languages. Test templates across email clients before deployment.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you manage email queue at high volume?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Queue emails in Redis/SQS. Workers process at controlled rate (respect provider limits). Priority queues (password reset before newsletter). Retry logic with exponential backoff. Dead letter queue for permanent failures. Monitor queue depth, alert on backlog. Scale workers based on queue size.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle spam complaints?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Webhook receives complaint event. Immediately suppress email from all future sends. Log complaint with user, email, campaign. Investigate source (which campaign, list, content). Complaint rate &lt;0.1% required. High complaint rate triggers provider review, potential suspension.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://sendgrid.com/docs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SendGrid — Documentation
            </a>
          </li>
          <li>
            <a
              href="https://docs.aws.amazon.com/ses/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS — SES Documentation
            </a>
          </li>
          <li>
            <a
              href="https://postmarkapp.com/developer"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Postmark — API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://dmarc.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              DMARC.org — Email Authentication Standards
            </a>
          </li>
          <li>
            <a
              href="https://www.caniemail.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Can I email — Email Client Support Reference
            </a>
          </li>
          <li>
            <a
              href="https://www.mailgun.com/blog/email-deliverability/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mailgun — Email Deliverability Best Practices
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
