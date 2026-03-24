"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-security-audit-logging",
  title: "Security Audit Logging",
  description:
    "Comprehensive guide to implementing security audit logging covering event schemas (authentication, authorization, account events), immutable storage, compliance requirements (SOC 2, GDPR, HIPAA), real-time alerting, and analysis patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "security-audit-logging",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "audit-logging",
    "security",
    "compliance",
    "backend",
  ],
  relatedTopics: ["authentication-service", "authentication-audit-logs"],
};

export default function SecurityAuditLoggingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Security Audit Logging</strong> is the systematic recording of security-relevant
          events for compliance, forensics, and threat detection. It provides an immutable trail of
          who did what, when, and from where — essential for incident response and regulatory
          compliance (SOC 2, GDPR, HIPAA, PCI-DSS). Without audit logs, you can't investigate
          security incidents, prove compliance, or detect ongoing attacks.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/security-audit-logging.svg"
          alt="Security Audit Logging"
          caption="Security Audit Logging — showing event capture, immutable storage, compliance mapping, and real-time alerting"
        />

        <p>
          For staff and principal engineers, implementing audit logging requires deep understanding
          of event schemas (authentication, authorization, account events), immutable storage
          (write-once, append-only), retention policies (compliance requirements), compliance
          requirements (SOC 2, GDPR, HIPAA), and analysis patterns (real-time alerting, forensic
          analysis). The implementation must capture comprehensive events without impacting
          performance or exposing sensitive data.
        </p>
        <p>
          Modern audit logging has evolved from simple log files to sophisticated SIEM (Security
          Information and Event Management) systems with real-time alerting, machine learning
          anomaly detection, and automated incident response. Organizations like Google, Microsoft,
          and Okta handle billions of audit events daily while maintaining compliance through
          immutable storage, encryption at rest, and strict access controls.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Security audit logging is built on fundamental concepts that determine how events are
          captured, stored, and analyzed. Understanding these concepts is essential for designing
          effective audit systems.
        </p>
        <p>
          <strong>Audit Events:</strong> Authentication events (login success/failure, logout, MFA
          challenge/verify, password reset), account events (account created, email/phone changed,
          password changed, MFA enabled/disabled, account deleted), authorization events (role
          assigned/removed, permission granted/revoked, access denied, privileged action). Each
          event includes: timestamp, user_id, actor_id (who performed action), action, resource,
          outcome, IP address, device info.
        </p>
        <p>
          <strong>Immutable Storage:</strong> Write-once, append-only storage (can't modify/delete
          events). Encryption at rest (AES-256). Access controls (only security team can read).
          Retention policies (7 years for financial, 6 years for healthcare). Compliance requires
          immutability — can't tamper with evidence.
        </p>
        <p>
          <strong>Compliance Requirements:</strong> SOC 2 (audit trails for access control, change
          management), GDPR (log personal data access, right to audit), HIPAA (log PHI access, 6
          year retention), PCI-DSS (log cardholder data access, 1 year retention). Each regulation
          has specific requirements — implement superset to cover all.
        </p>
        <p>
          <strong>Real-time Alerting:</strong> Detect suspicious patterns (many failed logins,
          access from unusual location, privilege escalation). Alert security team immediately.
          Automated response (lock account, revoke sessions). Machine learning for anomaly
          detection (baseline normal behavior, detect deviations).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Audit logging architecture separates event capture from storage, enabling high-throughput
          logging with durable storage. This architecture is critical for compliance and security
          monitoring.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/audit-event-schema.svg"
          alt="Audit Event Schema"
          caption="Audit Event Schema — showing standardized event structure with timestamp, user, actor, action, resource, outcome, and context fields"
        />

        <p>
          Audit flow: Security-relevant event occurs (login, password change, role assignment).
          Application captures event (standardized schema), publishes to message queue (Kafka —
          durable, high-throughput). Audit service consumes events, validates schema, enriches with
          context (geolocation from IP, device info), writes to immutable storage (S3 with
          object lock, write-once database). Real-time alerting: stream to SIEM (Splunk, Datadog),
          detect patterns, alert security team.
        </p>
        <p>
          Storage architecture includes: hot storage (recent events in Elasticsearch — fast
          queries, 30 days), warm storage (older events in S3 — cheaper, 1 year), cold storage
          (archived events in Glacier — cheapest, 7 years). This architecture enables fast recent
          queries with cost-effective long-term retention.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/audit-compliance.svg"
          alt="Audit Compliance"
          caption="Audit Compliance — showing SOC 2, ISO 27001, GDPR, HIPAA, PCI-DSS compliance mapping with retention requirements"
        />

        <p>
          Compliance architecture includes: immutable storage (can't modify/delete), encryption at
          rest (AES-256), access controls (only security team can read), retention policies
          (automated deletion after retention period), audit trail for audit log access (who
          accessed logs, when). This architecture enables compliance — auditors can verify logs
          haven't been tampered with.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing audit logging involves trade-offs between completeness, performance, and cost.
          Understanding these trade-offs is essential for making informed architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Synchronous vs Asynchronous Logging</h3>
          <ul className="space-y-3">
            <li>
              <strong>Synchronous:</strong> Log before responding to user. Guaranteed durability.
              Limitation: impacts latency (wait for log write).
            </li>
            <li>
              <strong>Asynchronous:</strong> Log after responding (via message queue). No latency
              impact. Limitation: potential log loss if crash before write.
            </li>
            <li>
              <strong>Recommendation:</strong> Asynchronous for most events (login, page view).
              Synchronous for critical events (password change, role assignment) — can't afford to
              lose.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Structured vs Unstructured Logs</h3>
          <ul className="space-y-3">
            <li>
              <strong>Structured (JSON):</strong> Easy to query, parse, analyze. Limitation:
              larger size, more CPU for serialization.
            </li>
            <li>
              <strong>Unstructured (text):</strong> Smaller size, faster. Limitation: hard to
              query, parse, analyze.
            </li>
            <li>
              <strong>Recommendation:</strong> Structured (JSON) for audit logs — essential for
              compliance queries, analysis. Unstructured for debug logs.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Hot vs Warm vs Cold Storage</h3>
          <ul className="space-y-3">
            <li>
              <strong>Hot (Elasticsearch):</strong> Fast queries, real-time analysis. Limitation:
              expensive, limited retention (30 days).
            </li>
            <li>
              <strong>Warm (S3):</strong> Cheaper, good for recent history. Limitation: slower
              queries.
            </li>
            <li>
              <strong>Cold (Glacier):</strong> Cheapest, long-term retention. Limitation: very
              slow queries (hours to restore).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing audit logging requires following established best practices to ensure
          compliance, security, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Event Schema</h3>
        <p>
          Use standardized schema — timestamp (ISO 8601), user_id (who the event is about),
          actor_id (who performed action — may be same as user_id), action (what happened),
          resource (what was accessed/modified), outcome (success/failure), IP address, device info
          (user agent, device fingerprint). Include context (request_id, session_id) for tracing.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Immutable Storage</h3>
        <p>
          Write-once, append-only storage — can't modify/delete events. Encryption at rest
          (AES-256). Access controls (only security team can read). Retention policies (automated
          deletion after retention period). Compliance requires immutability — can't tamper with
          evidence.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Compliance</h3>
        <p>
          Implement superset of requirements — cover SOC 2, GDPR, HIPAA, PCI-DSS. Retention
          policies (7 years for financial, 6 years for healthcare, 1 year for PCI). Audit trail for
          audit log access (who accessed logs, when). Regular compliance audits — verify logs meet
          requirements.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Real-time Alerting</h3>
        <p>
          Detect suspicious patterns — many failed logins, access from unusual location, privilege
          escalation. Alert security team immediately (PagerDuty, Slack). Automated response (lock
          account, revoke sessions). Machine learning for anomaly detection (baseline normal
          behavior, detect deviations).
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing audit logging to ensure compliant, secure,
          and maintainable audit systems.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Logging sensitive data:</strong> Passwords, tokens, PII in logs, compliance
            violation. <strong>Fix:</strong> Never log passwords, tokens. Mask PII (show last 4
            digits only).
          </li>
          <li>
            <strong>Mutable logs:</strong> Logs can be modified/deleted, can't trust for
            forensics. <strong>Fix:</strong> Write-once, append-only storage. Object lock (S3).
          </li>
          <li>
            <strong>No retention policy:</strong> Logs accumulate forever, cost explosion,
            compliance risk. <strong>Fix:</strong> Automated deletion after retention period (7
            years for financial).
          </li>
          <li>
            <strong>Synchronous logging for all events:</strong> High latency, performance impact.{" "}
            <strong>Fix:</strong> Asynchronous for most events (via Kafka). Synchronous only for
            critical events.
          </li>
          <li>
            <strong>Inconsistent schema:</strong> Different event formats, hard to query/analyze.{" "}
            <strong>Fix:</strong> Standardized schema for all events. Validate schema on ingest.
          </li>
          <li>
            <strong>No access controls:</strong> Anyone can read audit logs, privacy/security risk.{" "}
            <strong>Fix:</strong> Access controls (only security team can read). Audit log access
            (log who accessed logs).
          </li>
          <li>
            <strong>No real-time alerting:</strong> Attacks detected too late, damage done.{" "}
            <strong>Fix:</strong> Stream to SIEM, detect patterns, alert immediately.
          </li>
          <li>
            <strong>Insufficient context:</strong> Can't trace events, hard to investigate.{" "}
            <strong>Fix:</strong> Include request_id, session_id, correlation_id for tracing.
          </li>
          <li>
            <strong>No log integrity verification:</strong> Can't prove logs haven't been tampered
            with. <strong>Fix:</strong> Hash chain (each event includes hash of previous),
            cryptographic signatures.
          </li>
          <li>
            <strong>Logging to same system:</strong> Attacker can delete logs to cover tracks.{" "}
            <strong>Fix:</strong> Ship logs to separate system immediately. Can't delete what you
            don't control.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Security audit logging is critical for compliance and security. Here are real-world
          implementations from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS (Salesforce)</h3>
        <p>
          <strong>Challenge:</strong> SOC 2 compliance requires comprehensive audit trails.
          Enterprise customers need audit reports. High-volume logging (billions of events/day).
        </p>
        <p>
          <strong>Solution:</strong> Standardized event schema. Kafka for high-throughput. S3 with
          object lock for immutable storage. Elasticsearch for recent queries. Automated compliance
          reports.
        </p>
        <p>
          <strong>Result:</strong> Passed SOC 2 audit. Enterprise customers can generate audit
          reports. High-volume logging handled efficiently.
        </p>
        <p>
          <strong>Security:</strong> Immutable storage, access controls, compliance reports.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Application (Chase)</h3>
        <p>
          <strong>Challenge:</strong> FFIEC, SOX compliance requires audit trails. Financial
          transactions must be logged. 7-year retention required.
        </p>
        <p>
          <strong>Solution:</strong> Synchronous logging for transactions (can't lose). S3 with
          object lock (immutable). Glacier for cold storage (7 years). Real-time fraud detection.
        </p>
        <p>
          <strong>Result:</strong> Passed FFIEC, SOX audits. Fraud detected in real-time. 7-year
          retention maintained.
        </p>
        <p>
          <strong>Security:</strong> Immutable storage, 7-year retention, real-time detection.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Platform (Epic)</h3>
        <p>
          <strong>Challenge:</strong> HIPAA compliance requires PHI access logging. 6-year
          retention. Patient privacy critical.
        </p>
        <p>
          <strong>Solution:</strong> Log all PHI access (who, what, when). Mask patient data in
          logs. S3 with object lock. Automated retention (6 years). Audit log access logged.
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audits. PHI access tracked. Patient privacy
          maintained.
        </p>
        <p>
          <strong>Security:</strong> PHI logging, masking, 6-year retention.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Platform (Amazon)</h3>
        <p>
          <strong>Challenge:</strong> PCI-DSS compliance requires cardholder data access logging.
          High-volume logging (millions of transactions/hour). Fraud detection critical.
        </p>
        <p>
          <strong>Solution:</strong> Log all cardholder data access. Real-time fraud detection
          (machine learning). S3 for immutable storage. 1-year retention (PCI requirement).
        </p>
        <p>
          <strong>Result:</strong> Passed PCI-DSS audit. Fraud detected in real-time. Cardholder
          data protected.
        </p>
        <p>
          <strong>Security:</strong> Cardholder logging, fraud detection, 1-year retention.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cloud Platform (AWS)</h3>
        <p>
          <strong>Challenge:</strong> Multiple compliance requirements (SOC 2, HIPAA, PCI).
          CloudTrail for API logging. Billions of events/day. Customer audit access.
        </p>
        <p>
          <strong>Solution:</strong> CloudTrail for API logging. S3 with object lock. Athena for
          queries. Real-time alerting (CloudWatch). Customer access to their audit logs.
        </p>
        <p>
          <strong>Result:</strong> Multiple compliance certifications. Customer audit access.
          High-volume logging handled.
        </p>
        <p>
          <strong>Security:</strong> API logging, immutable storage, customer access.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of audit logging design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What events should you audit?</p>
            <p className="mt-2 text-sm">
              A: Authentication (login success/failure, logout, MFA), account (created, email
              changed, password changed, MFA enabled/disabled, deleted), authorization (role
              assigned/removed, permission granted/revoked, access denied), privileged actions
              (admin actions, config changes). Include: timestamp, user_id, actor_id, action,
              resource, outcome, IP, device.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure log immutability?</p>
            <p className="mt-2 text-sm">
              A: Write-once, append-only storage (S3 with object lock, write-once database).
              Encryption at rest (AES-256). Access controls (only security team can read). Hash
              chain (each event includes hash of previous) — detect tampering. Ship logs to
              separate system immediately — can't delete what you don't control.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are retention requirements?</p>
            <p className="mt-2 text-sm">
              A: SOC 2 (no specific requirement, typically 7 years), GDPR (as long as necessary,
              typically 3-7 years), HIPAA (6 years), PCI-DSS (1 year). Implement superset — 7 years
              covers most requirements. Automated deletion after retention period.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle sensitive data in logs?</p>
            <p className="mt-2 text-sm">
              A: Never log passwords, tokens, full credit card numbers. Mask PII (show last 4
              digits only). Use field-level encryption for sensitive fields. Comply with
              regulations (GDPR — minimize personal data in logs). Regular audit of log contents.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement real-time alerting?</p>
            <p className="mt-2 text-sm">
              A: Stream logs to SIEM (Splunk, Datadog). Define detection rules (many failed logins,
              access from unusual location, privilege escalation). Alert security team immediately
              (PagerDuty, Slack). Automated response (lock account, revoke sessions). Machine
              learning for anomaly detection.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle high-volume logging?</p>
            <p className="mt-2 text-sm">
              A: Asynchronous logging via message queue (Kafka — durable, high-throughput). Batch
              writes to storage. Hot/warm/cold storage tiering (Elasticsearch for recent, S3 for
              older, Glacier for archived). Compression for storage efficiency.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you verify log integrity?</p>
            <p className="mt-2 text-sm">
              A: Hash chain (each event includes hash of previous event) — detect tampering.
              Cryptographic signatures (sign batches of events). Regular integrity checks (verify
              hash chain). Third-party audit (verify logs haven't been modified).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle audit log access?</p>
            <p className="mt-2 text-sm">
              A: Access controls (only security team can read). Audit log access (log who accessed
              logs, when, why). Multi-party approval for sensitive access (two-person rule).
              Time-limited access (access expires after investigation).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for audit logging?</p>
            <p className="mt-2 text-sm">
              A: Event volume (events/day), storage growth, query latency, alert rate, false
              positive rate. Compliance: retention compliance, access control violations. Security:
              suspicious patterns detected, incidents responded to.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Logging Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Audit_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Audit Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Session Management Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OAuth 2.1 Security Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Security/Practical_security_guides/Authentication"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Authentication Security
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Multifactor Authentication
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Access Control Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authorization Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Forgot Password Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Credential Stuffing Prevention
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
