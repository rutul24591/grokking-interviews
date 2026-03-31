"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-backend-sms-gateways",
  title: "SMS Gateways",
  description:
    "Comprehensive guide to implementing SMS gateways covering SMS providers (Twilio, Vonage, AWS SNS), two-way messaging, delivery receipts, short codes vs long codes, international SMS, and rate limiting for reliable text message delivery.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "sms-gateways",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: [
    "requirements",
    "functional",
    "communication",
    "sms",
    "messaging",
    "backend",
    "twilio",
    "notifications",
  ],
  relatedTopics: ["email-delivery-services", "push-notification-service", "notification-delivery", "two-factor-authentication"],
};

export default function SMSGatewaysArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          SMS gateways enable sending and receiving text messages programmatically via SMS providers. Use cases include two-factor authentication (2FA), appointment reminders, order notifications, alerts, and marketing campaigns. SMS has 98% open rate (vs 20% for email) and 45% response rate, making it ideal for time-sensitive, high-priority communications. However, SMS costs per message ($0.005-$0.05 per message) and has strict regulations (TCPA, GDPR).
        </p>
        <p>
          The complexity of SMS delivery stems from carrier variations (AT&amp;T, Verizon, T-Mobile each have different filtering), phone number formats (international E.164 standard), delivery tracking (delivery receipts vary by carrier), and compliance (opt-in requirements, quiet hours). SMS providers (Twilio, Vonage, AWS SNS) handle carrier relationships but require proper integration for optimal deliverability.
        </p>
        <p>
          For staff and principal engineers, SMS gateway implementation involves infrastructure and compliance challenges. Queue management handles traffic spikes (2FA storms). Two-way messaging requires webhook handling for incoming messages. Delivery tracking captures delivery receipts (delivered, failed, undeliverable). Compliance includes opt-in management, STOP keyword handling, and quiet hours enforcement. The architecture must balance cost (per-message pricing) with reliability and compliance.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>SMS Providers</h3>
        <p>
          Twilio: Full-featured communications platform. Pros: Best documentation, global coverage, voice + SMS + WhatsApp. Cons: Higher cost at scale. Pricing: $0.0075 per message (US). Best for: Startups to enterprise, all use cases.
        </p>
        <p>
          Vonage (Nexmo): Communications API platform. Pros: Good coverage, competitive pricing. Cons: Documentation not as good as Twilio. Pricing: $0.0065 per message (US). Best for: Cost-conscious, international.
        </p>
        <p>
          AWS SNS (Simple Notification Service): AWS native SMS service. Pros: AWS integration, lowest cost. Cons: Basic features, limited two-way. Pricing: $0.00645 per message (US). Best for: AWS users, one-way notifications.
        </p>
        <p>
          Plivo: Developer-focused SMS/Voice. Pros: Good pricing, simple API. Cons: Smaller ecosystem. Pricing: $0.0055 per message (US). Best for: Cost-focused, developers.
        </p>

        <h3 className="mt-6">Phone Number Types</h3>
        <p>
          Long codes: Standard 10-digit phone numbers. Pros: Support voice + SMS, cheap, easy to get. Cons: Low throughput (1 message/second), carrier filtering. Best for: Two-way messaging, low volume (&lt;1000/day).
        </p>
        <p>
          Short codes: 5-6 digit numbers (e.g., 12345). Pros: High throughput (100+ messages/second), better deliverability, vanity options (1-800-FLOWERS). Cons: Expensive ($500-1000/month), approval process (8-12 weeks). Best for: High volume marketing, alerts.
        </p>
        <p>
          Toll-free numbers: 1-800, 1-888, etc. Pros: Support voice + SMS, recognizable, moderate throughput (3 messages/second). Cons: Approval required. Best for: Customer support, moderate volume.
        </p>
        <p>
          10DLC (10-Digit Long Code): Registered long codes for A2P (Application-to-Person). Pros: Better deliverability than unregistered, moderate throughput (30-100 messages/second), cheaper than short codes. Cons: Registration required. Best for: Business messaging, most use cases.
        </p>

        <h3 className="mt-6">Two-Way Messaging</h3>
        <p>
          Incoming messages: Provider webhooks incoming SMS to your endpoint. Parse message body, sender number, timestamp. Handle keywords (STOP, HELP, START). Store in database for conversation history. Response time SLA (for customer support).
        </p>
        <p>
          Conversation threads: Group messages by phone number. Display conversation chronologically. Support media (MMS) in conversation. Handle multiple concurrent conversations (support team).
        </p>
        <p>
          Auto-responses: Keyword-based responses (HELP → help text). Business hours auto-reply. Out-of-office messages. Escalation to human agent.
        </p>

        <h3 className="mt-6">Delivery Tracking</h3>
        <p>
          Delivery receipts: Provider sends webhook when message delivered. Statuses: sent (to carrier), delivered (to phone), failed (undeliverable), undeliverable (invalid number). Track latency (send → deliver). Delivery rate typically 95-98%.
        </p>
        <p>
          Failure handling: Invalid numbers (remove from list). Carrier violations (review content). Temporary failures (retry). Permanent failures (suppress number). Log failure reasons for analysis.
        </p>
        <p>
          Engagement tracking: Track replies (two-way engagement). Opt-out rate (STOP keywords). Click tracking (shortened links in SMS). Response time (for support SMS).
        </p>

        <h3 className="mt-6">Compliance</h3>
        <p>
          TCPA (US): Requires explicit opt-in for marketing SMS. Quiet hours (9 PM - 8 AM local time). STOP keyword must opt-out immediately. HELP keyword must provide help text. Fines: $500-$1500 per violation.
        </p>
        <p>
          GDPR (EU): Requires explicit consent. Right to deletion (remove number on request). Data minimization (only store necessary data). Privacy policy disclosure.
        </p>
        <p>
          Carrier filtering: Carriers filter spam/scam messages. Register 10DLC numbers. Avoid spam trigger words (FREE, WIN, CASH). Include opt-out instructions. Monitor delivery rates for filtering signs.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          SMS gateway architecture spans queue management, provider integration, webhook handling, and compliance. SMS queued for async processing. Provider API sends message. Webhooks handle delivery receipts and incoming messages. Compliance layer enforces opt-in, quiet hours, STOP handling.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/sms-gateways/sms-architecture.svg"
          alt="SMS Gateway Architecture"
          caption="Figure 1: SMS Gateway Architecture — Queue, provider integration, webhooks, and compliance"
          width={1000}
          height={500}
        />

        <h3>Queue Management</h3>
        <p>
          SMS queue decouples request from sending. Queue messages (Redis, SQS). Workers process at controlled rate (respect provider/carrier limits). Priority queues (2FA before marketing). Retry logic for transient failures (carrier downtime).
        </p>
        <p>
          Rate limiting: Provider limits (Twilio: 100 messages/second). Carrier limits (varies by number type). Implement backpressure (slow down if queue grows). Throttle by destination (avoid carrier filtering).
        </p>
        <p>
          Scheduling: Send messages at specific times. Timezone-aware scheduling (respect recipient local time). Quiet hours enforcement (no marketing 9 PM - 8 AM). Throttle sending (spread sends to avoid bursts).
        </p>

        <h3 className="mt-6">Provider Integration</h3>
        <p>
          API client: Use provider SDK or direct HTTP API. Authenticate with API key/secret. Handle rate limits (429 response, retry after). Implement circuit breaker (stop sending if provider down). Log all API calls for debugging.
        </p>
        <p>
          Multi-provider failover: Primary provider (Twilio), backup provider (Vonage). If primary fails (5xx errors), switch to backup. Track provider health (error rates). DNS failover for webhook endpoints.
        </p>
        <p>
          Number management: Pool of phone numbers. Round-robin assignment (distribute load). Number rotation (avoid carrier filtering). Reserve numbers for two-way (support).
        </p>

        <h3 className="mt-6">Webhook Handling</h3>
        <p>
          Delivery receipt webhooks: Provider POSTs delivery status to your endpoint. Verify webhook signature (prevent spoofing). Update message status in database. Handle statuses: sent, delivered, failed, undeliverable. Process events asynchronously (queue for processing).
        </p>
        <p>
          Incoming message webhooks: Provider POSTs incoming SMS to your endpoint. Parse message body, sender number, timestamp. Handle keywords (STOP → opt-out, HELP → help text). Store in database for conversation history. Trigger auto-responses or route to support.
        </p>
        <p>
          Idempotency: Webhooks may deliver duplicate events. Use event ID for deduplication. Store processed event IDs with TTL. Process each event once even if delivered multiple times.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/sms-gateways/compliance-flow.svg"
          alt="Compliance Flow"
          caption="Figure 2: Compliance Flow — Opt-in management, STOP handling, and quiet hours enforcement"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Compliance Layer</h3>
        <p>
          Opt-in management: Store opt-in status per number. Track opt-in source (web form, keyword, support). Double opt-in for marketing (confirm subscription). Opt-in timestamp (for compliance proof).
        </p>
        <p>
          STOP handling: Incoming STOP keyword → immediately opt-out. Suppress from all future marketing messages. Confirmation message ("You are unsubscribed"). Store opt-out timestamp. Honor within seconds (legal requirement).
        </p>
        <p>
          Quiet hours enforcement: Check recipient timezone. Block marketing messages 9 PM - 8 AM local time. Transactional messages (2FA, alerts) exempt. Queue marketing messages for morning delivery.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/sms-gateways/number-types.svg"
          alt="Phone Number Types"
          caption="Figure 3: Phone Number Types — Long codes, short codes, toll-free, and 10DLC comparison"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          SMS gateway design involves trade-offs between cost, throughput, deliverability, and compliance. Understanding these trade-offs enables informed decisions aligned with use case and volume.
        </p>

        <h3>Number Type: Cost vs Throughput</h3>
        <p>
          Long codes: $0/month, 1 message/second. Pros: Cheapest, easy to get. Cons: Low throughput, carrier filtering. Best for: Two-way messaging, low volume (&lt;1000/day).
        </p>
        <p>
          10DLC: $2-5/month, 30-100 messages/second. Pros: Good throughput, better deliverability. Cons: Registration required. Best for: Business messaging, most use cases.
        </p>
        <p>
          Toll-free: $2-5/month, 3 messages/second. Pros: Recognizable, voice + SMS. Cons: Approval required. Best for: Customer support, moderate volume.
        </p>
        <p>
          Short codes: $500-1000/month, 100+ messages/second. Pros: Highest throughput, best deliverability. Cons: Expensive, 8-12 week approval. Best for: High volume marketing (&gt;100K/month).
        </p>

        <h3>Provider Selection: Features vs Cost</h3>
        <p>
          Premium (Twilio): $0.0075 per message. Pros: Best features, documentation, support. Cons: Highest cost. Best for: Most applications, reliability-focused.
        </p>
        <p>
          Balanced (Vonage, Plivo): $0.0055-0.0065 per message. Pros: Good features, lower cost. Cons: Smaller ecosystem. Best for: Cost-conscious, international.
        </p>
        <p>
          Low cost (AWS SNS): $0.00645 per message. Pros: AWS integration, cheap. Cons: Basic features, limited two-way. Best for: AWS users, one-way notifications.
        </p>

        <h3>Compliance: Strict vs Lenient</h3>
        <p>
          Strict compliance: Double opt-in, explicit consent, quiet hours enforced. Pros: Legal protection, lower complaint rate. Cons: Lower conversion, more friction. Best for: Marketing SMS, regulated industries.
        </p>
        <p>
          Lenient compliance: Single opt-in, implied consent. Pros: Higher conversion, less friction. Cons: Legal risk, higher complaint rate. Best for: Transactional SMS only.
        </p>
        <p>
          Recommended: Strict for marketing, lenient for transactional. Separate lists, separate compliance rules. Best for: Most applications.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/sms-gateways/provider-comparison.svg"
          alt="Provider Comparison"
          caption="Figure 4: Provider Comparison — Cost, features, and coverage comparison"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use 10DLC for business:</strong> Register long codes for A2P messaging. Better deliverability, higher throughput. Required for US business messaging.
          </li>
          <li>
            <strong>Implement opt-in management:</strong> Store opt-in status per number. Track opt-in source. Double opt-in for marketing. Proof of consent for compliance.
          </li>
          <li>
            <strong>Handle STOP immediately:</strong> Webhook → opt-out within seconds. Suppress from all marketing. Send confirmation. Legal requirement (TCPA).
          </li>
          <li>
            <strong>Enforce quiet hours:</strong> Check recipient timezone. Block marketing 9 PM - 8 AM local. Transactional exempt. Queue marketing for morning.
          </li>
          <li>
            <strong>Track delivery receipts:</strong> Webhook for delivery status. Update message status. Monitor delivery rate (target 95%+). Alert on drops.
          </li>
          <li>
            <strong>Use queue for sending:</strong> Decouple request from sending. Rate limit to respect carrier limits. Retry transient failures. Priority queues for 2FA.
          </li>
          <li>
            <strong>Include opt-out instructions:</strong> "Reply STOP to unsubscribe" in every marketing message. Legal requirement. Reduces complaints.
          </li>
          <li>
            <strong>Monitor carrier filtering:</strong> Track delivery rate by carrier. Sudden drops indicate filtering. Rotate numbers if filtered. Register 10DLC.
          </li>
          <li>
            <strong>Keep messages short:</strong> 160 characters (1 segment). Longer messages cost more (multiple segments). Put important info first.
          </li>
          <li>
            <strong>Test before sending:</strong> Test with internal numbers first. Check formatting, links, opt-out. Test across carriers (AT&amp;T, Verizon, T-Mobile).
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No opt-in management:</strong> Sending without consent. Solution: Implement opt-in tracking, double opt-in for marketing.
          </li>
          <li>
            <strong>Ignoring STOP requests:</strong> Continue sending after STOP. Solution: Process STOP webhooks immediately, suppress within seconds.
          </li>
          <li>
            <strong>No quiet hours:</strong> Sending marketing at night. Solution: Check timezone, enforce 9 PM - 8 AM block.
          </li>
          <li>
            <strong>Using long codes for high volume:</strong> Carrier filtering, low throughput. Solution: Use 10DLC or short codes for high volume.
          </li>
          <li>
            <strong>No delivery tracking:</strong> Don't know if messages delivered. Solution: Handle delivery receipt webhooks, monitor delivery rate.
          </li>
          <li>
            <strong>Long messages:</strong> Multiple segments cost more. Solution: Keep under 160 characters, put important info first.
          </li>
          <li>
            <strong>Spam trigger words:</strong> FREE, WIN, CASH trigger filtering. Solution: Avoid spam words, register 10DLC.
          </li>
          <li>
            <strong>No webhook verification:</strong> Spoofed webhooks. Solution: Verify webhook signature from provider.
          </li>
          <li>
            <strong>Mixing transactional and marketing:</strong> Same number for both. Solution: Separate numbers for transactional vs marketing.
          </li>
          <li>
            <strong>No compliance logging:</strong> Can't prove opt-in. Solution: Log opt-in source, timestamp, IP address.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Two-Factor Authentication (2FA)</h3>
        <p>
          User requests login → generate 6-digit code → queue SMS (high priority) → send via provider → track delivery → code expires in 5 minutes. Delivery time target: &lt;10 seconds. High deliverability critical.
        </p>

        <h3 className="mt-6">Appointment Reminders</h3>
        <p>
          Schedule reminder 24 hours before appointment → check timezone → queue SMS → send during business hours → track delivery → handle replies (CONFIRM, RESCHEDULE). Reduces no-show rate by 30-50%.
        </p>

        <h3 className="mt-6">Order Notifications</h3>
        <p>
          Order placed → queue confirmation SMS. Order shipped → queue tracking SMS. Out for delivery → queue delivery SMS. Transactional (high deliverability). Include tracking link.
        </p>

        <h3 className="mt-6">Marketing Campaigns</h3>
        <p>
          Segment audience (opted-in, engaged) → check quiet hours → queue campaign → throttle sending (avoid carrier filtering) → track delivery, replies, opt-outs. Compliance critical (TCPA).
        </p>

        <h3 className="mt-6">Customer Support SMS</h3>
        <p>
          Customer texts support number → webhook routes to support system → agent responds → two-way conversation. Dedicated number for support. Response time SLA. Conversation history stored.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle SMS delivery tracking?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Provider sends webhook for each status change: sent (to carrier), delivered (to phone), failed (undeliverable). Webhook includes message ID, status, timestamp, error code. Update message status in database. Monitor delivery rate (target 95%+). Alert on drops (carrier filtering).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle STOP/opt-out requests?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Incoming STOP keyword triggers webhook. Immediately mark number as opted-out in database. Suppress from all future marketing messages. Send confirmation ("You are unsubscribed"). Must happen within seconds (legal requirement). Log opt-out timestamp for compliance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you enforce quiet hours?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Store recipient timezone (profile or lookup by number). Before sending marketing SMS, check local time. Block if 9 PM - 8 AM. Queue message for morning delivery. Transactional SMS (2FA, alerts) exempt. Use library (moment-timezone) for timezone conversion.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you choose phone number type?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Volume &lt;1000/day: Long code. Volume 1K-100K/day: 10DLC (register for A2P). Volume &gt;100K/day: Short code. Two-way support: Long code or toll-free. Marketing: 10DLC or short code (better deliverability). Transactional: Long code or 10DLC.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle SMS compliance?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Opt-in: Store consent per number, double opt-in for marketing. STOP: Process immediately, suppress within seconds. Quiet hours: Block marketing 9 PM - 8 AM local. Opt-out instructions: Include in every message. Logging: Store opt-in source, timestamp, IP for compliance proof.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle carrier filtering?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Register 10DLC numbers (required for US business). Avoid spam trigger words (FREE, WIN, CASH). Monitor delivery rate by carrier. Sudden drops indicate filtering. Rotate numbers if filtered. Use multiple numbers (round-robin). Register message content (campaign registration).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.twilio.com/docs/sms"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twilio — SMS Documentation
            </a>
          </li>
          <li>
            <a
              href="https://developers.vonage.com/en/messages/sms-api/overview"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vonage — SMS API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://docs.aws.amazon.com/sns/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS — SNS Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.ctia.org/the-basics/10dlc"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CTIA — 10DLC Registration
            </a>
          </li>
          <li>
            <a
              href="https://www.fcc.gov/consumers/guides/telephone-consumer-protection-act"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              FCC — TCPA Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://www.plivo.com/blog/sms-compliance-guide/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Plivo — SMS Compliance Guide
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
