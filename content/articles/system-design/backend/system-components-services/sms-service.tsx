"use client";

import { ArticleImage } from "@/components/articles/ArticleImage";
import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-sms-service-extensive",
  title: "SMS Service",
  description:
    "Send SMS safely and reliably: opt-in policy, template controls, provider routing, throughput management, and guardrails to prevent cost explosions and abuse.",
  category: "backend",
  subcategory: "system-components-services",
  slug: "sms-service",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-14",
  tags: ["backend", "services", "messaging", "compliance"],
  relatedTopics: ["notification-service", "authentication-service", "rate-limiting-service"],
};

export default function SmsServiceConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What an SMS Service Does</h2>
        <p>
          An <strong>SMS service</strong> sends text messages reliably through carriers and messaging providers. It is
          commonly used for multi-factor authentication, account recovery, delivery updates, and time-sensitive alerts.
          It also carries higher compliance and cost risk than many channels.
        </p>
        <p>
          Unlike email, SMS is constrained by carrier policies, regional regulations, throughput limits, and strict
          expectations around opt-in and quiet hours. A production SMS service must behave like a policy enforcement
          layer that keeps the product safe under abuse and under provider degradation.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/system-components-services/sms-service-diagram-1.svg"
          alt="SMS service architecture showing message requests, policy checks, provider routing, and delivery receipts"
          caption="SMS delivery depends on external networks with strict policies. A good SMS platform centralizes compliance, routing, and delivery tracking."
        />
      </section>

      <section>
        <h2>Policy and Compliance: Opt-In Is Part of Correctness</h2>
        <p>
          SMS is heavily regulated in many regions. Users must often opt in, and the system must honor opt-out. Even for
          transactional messages, sending outside policy can lead to carrier blocks and legal risk. The SMS service
          should enforce policy centrally rather than relying on each product team to implement compliance correctly.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Practical Policy Controls</h3>
          <ul className="space-y-2">
            <li>
              <strong>Opt-in and opt-out tracking:</strong> per phone number, with audit trails for changes.
            </li>
            <li>
              <strong>Message classes:</strong> security, transactional, and marketing with distinct rules and rate caps.
            </li>
            <li>
              <strong>Quiet hours:</strong> enforce send windows per region when required.
            </li>
            <li>
              <strong>Template controls:</strong> restrict dynamic content to prevent injection and to keep messaging consistent.
            </li>
          </ul>
        </div>
        <p>
          Compliance enforcement should be observable. When a message is blocked by policy, the system should record why
          and provide tooling that helps product teams fix the root cause without trial-and-error.
        </p>
      </section>

      <section>
        <h2>Throughput, Routing, and Delivery Receipts</h2>
        <p>
          SMS throughput is constrained. Providers and carriers throttle aggressively, and message delivery can be
          delayed during peak periods. The service should pace sends and queue messages with clear TTL semantics for
          time-sensitive classes like one-time passcodes.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/system-components-services/sms-service-diagram-2.svg"
          alt="SMS control points: pacing, queueing, provider failover, and receipt processing"
          caption="SMS reliability is operational: pacing avoids throttling, provider routing improves availability, and receipts enable delivery visibility and debugging."
        />
        <p>
          Routing is also important. Many organizations use multiple providers for redundancy and cost. Routing decisions
          can be based on region, message class, or real-time provider health. Without careful routing, a provider outage
          can become a global messaging incident.
        </p>
        <p>
          Delivery receipts are useful but not always reliable. The service should treat receipts as best-effort signals
          rather than as a strict guarantee, and it should provide product-level semantics that do not depend on perfect
          receipt behavior.
        </p>
      </section>

      <section>
        <h2>Abuse and Cost Risk</h2>
        <p>
          SMS can be abused directly: attackers can trigger message floods to harass users or to drive up costs. OTP
          flows are a common target. A robust SMS service therefore includes strict rate limits, anomaly detection, and
          safeguards that prevent runaway sends.
        </p>
        <p>
          The system should also defend against internal failure modes: bugs that trigger infinite loops, retry storms
          that multiply costs, and misconfigured campaigns that spam large audiences.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <p>
          SMS failures become incidents quickly because users depend on it for access recovery and security. Mitigation
          requires careful isolation of critical message classes and explicit fallback behavior when delivery is
          degraded.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/system-components-services/sms-service-diagram-3.svg"
          alt="SMS failure modes: provider throttling, cost explosions, opt-out violations, and OTP delays"
          caption="SMS incidents are often provider and policy incidents: throttling, delays, and compliance violations. Isolation and guardrails keep failures contained."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">OTP delays</h3>
            <p className="mt-2 text-sm text-muted">
              One-time passcodes arrive late due to throttling or queue backlog, making sign-in unreliable.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> priority queues, aggressive TTL, and pacing that reserves capacity for security messages.
              </li>
              <li>
                <strong>Signal:</strong> increased OTP delivery latency and elevated login failure rates.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Cost spikes</h3>
            <p className="mt-2 text-sm text-muted">
              Retries or abuse trigger a large number of sends, creating unexpected spend and potential carrier blocks.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> budgets and alerts, strict rate limits per identity, and anomaly detection on send volume.
              </li>
              <li>
                <strong>Signal:</strong> send volume diverges from product traffic and spikes in retry attempts.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Provider throttling and outages</h3>
            <p className="mt-2 text-sm text-muted">
              Providers degrade or throttle, and naive retry loops amplify load and delay.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> circuit breakers, backoff with jitter, provider failover, and clear dead-letter processing.
              </li>
              <li>
                <strong>Signal:</strong> rising provider error rates and increasing queue lag.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Opt-out violations</h3>
            <p className="mt-2 text-sm text-muted">
              Messages are sent to numbers that opted out, creating compliance risk and user trust damage.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> central policy enforcement and auditing of all sends with clear denial reasons.
              </li>
              <li>
                <strong>Signal:</strong> opt-out numbers receiving messages or elevated complaint and support signals.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <p>
          SMS operations should prioritize security and user trust. During incidents, the goal is to restore OTP
          reliability and prevent spam or cost spikes, even if that means pausing non-critical messaging temporarily.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Class-based isolation:</strong> security messages have priority and reserved capacity.
          </li>
          <li>
            <strong>Routing controls:</strong> route by region and provider health, and maintain tested failover paths.
          </li>
          <li>
            <strong>Guardrails:</strong> budgets, anomaly detection, and strict rate limits for abuse-prone triggers.
          </li>
          <li>
            <strong>Compliance auditing:</strong> opt-in and opt-out enforcement is measurable and reviewed.
          </li>
          <li>
            <strong>Incident knobs:</strong> fast ability to pause non-critical message classes during provider degradation.
          </li>
        </ul>
      </section>

      <section>
        <h2>Scenario: Provider Degradation During Peak Sign-In</h2>
        <p>
          During a peak event, the SMS provider starts throttling. OTP delivery latency rises and login failures increase.
          A robust system shifts to a backup provider if possible, slows send pace to avoid hard blocks, and prioritizes
          OTP messages above marketing or informational texts.
        </p>
        <p>
          If failover is not available, the platform should degrade gracefully: reduce OTP resends, apply backoff, and
          provide product-level alternatives where possible. The operational goal is not perfect SMS delivery; it is
          restoring account access with a controlled blast radius.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Opt-in and opt-out enforcement is centralized, auditable, and consistent across product features.
          </li>
          <li>
            Security messages are isolated with priority queues, strict TTL, and reserved capacity.
          </li>
          <li>
            Routing supports provider failover and pacing to avoid throttling and hard blocks.
          </li>
          <li>
            Anti-abuse controls prevent harassment and cost explosions under retries or attacks.
          </li>
          <li>
            Observability covers delivery latency, provider errors, send volume, and compliance denials.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is SMS reliability harder than it looks?</p>
            <p className="mt-2 text-sm text-muted">
              A: It depends on external carrier networks and strict policies. Throughput limits, delays, and provider throttling require pacing, prioritization, and failover planning.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are the biggest operational risks for SMS?</p>
            <p className="mt-2 text-sm text-muted">
              A: OTP delays that break sign-in, compliance violations around opt-in and opt-out, and cost spikes from abuse or retry loops.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you protect SMS systems from abuse?</p>
            <p className="mt-2 text-sm text-muted">
              A: Strong rate limiting per identity and IP, anomaly detection on send volume, strict template controls, and incident knobs that can pause non-critical classes quickly.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

