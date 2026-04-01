"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-admin-backend-audit-logging",
  title: "Audit Logging",
  description:
    "Comprehensive guide to implementing audit logging covering event capture, immutable storage, compliance requirements (SOX, GDPR, HIPAA), log retention, search and analysis, and security for regulatory compliance and forensic investigation.",
  category: "functional-requirements",
  subcategory: "admin-moderation",
  slug: "audit-logging",
  version: "extensive",
  wordCount: 6100,
  readingTime: 24,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "admin",
    "audit-logging",
    "compliance",
    "backend",
    "security",
    "forensics",
  ],
  relatedTopics: ["compliance-tools", "security", "monitoring-tools", "data-governance"],
};

export default function AuditLoggingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Audit logging captures all administrative and security-relevant events for compliance, forensics, and accountability. The audit log is the primary record of who did what, when, and why in the system. For staff and principal engineers, audit logging involves event capture (what events to log), immutable storage (append-only storage, tamper-proof), compliance requirements (SOX, GDPR, HIPAA, PCI DSS), log retention (how long to keep logs), search and analysis (search logs, analyze patterns), and security (protect logs from tampering, unauthorized access).
        </p>
        <p>
          The complexity of audit logging extends beyond simple event logging. Events must be captured comprehensively (all admin actions, auth events, data access, config changes). Storage must be immutable (append-only, tamper-proof, write-once). Compliance requirements vary by regulation (SOX requires 7 years, GDPR requires data minimization, HIPAA requires healthcare data protection). Log retention must balance compliance (keep long enough) with cost (storage cost). Search and analysis must enable forensic investigation (search logs, analyze patterns, detect anomalies). Security must protect logs from tampering (hash chaining, write-once storage, access control).
        </p>
        <p>
          For staff and principal engineers, audit logging architecture involves event capture (event sources, event schema), log storage (immutable storage, write-once), compliance management (compliance requirements, retention policies), search and analysis (log search, pattern analysis, anomaly detection), and security (access control, encryption, tamper-proofing). The system must support multiple event sources (admin actions, auth events, data access, config changes), multiple storage backends (database, file system, dedicated audit log service), and multiple compliance requirements (SOX, GDPR, HIPAA, PCI DSS). Performance is important—logging must not impact application performance.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Event Capture</h3>
        <p>
          Admin actions log all administrative operations. User management (create user, delete user, change role, reset password). Content moderation (approve content, remove content, ban user). System configuration (change config, enable/disable feature). Data export (export data, download reports). Permission changes (grant permission, revoke permission).
        </p>
        <p>
          Auth events log authentication and authorization events. Login events (successful login, failed login, logout). Permission changes (role change, permission grant/revoke). Session events (session created, session expired, session terminated). MFA events (MFA enabled, MFA disabled, MFA challenge).
        </p>
        <p>
          Data access logs access to sensitive data. Data read (read sensitive data, view PII). Data write (modify sensitive data, delete data). Data export (export data, download data). Bulk operations (bulk update, bulk delete).
        </p>
        <p>
          Config changes log system configuration changes. Feature flags (enable/disable feature, change rollout). System config (change system settings, change thresholds). Integration config (add/remove integration, change integration settings).
        </p>

        <h3 className="mt-6">Immutable Storage</h3>
        <p>
          Append-only storage ensures logs can&apos;t be modified. Write-once storage (write once, never modify). Append-only logs (append new entries, never modify existing). Immutable storage (storage that can&apos;t be modified). Tamper-proof storage (storage with tamper detection).
        </p>
        <p>
          Hash chaining ensures log integrity. Hash each entry (hash of entry content). Chain hashes (hash includes previous hash). Tamper detection (if entry modified, hash doesn&apos;t match). Integrity verification (verify chain integrity).
        </p>
        <p>
          Write-once storage prevents modification. WORM storage (Write Once Read Many). Immutable storage (storage that can&apos;t be modified). Compliance storage (storage for compliance requirements). Audit storage (storage for audit logs).
        </p>

        <h3 className="mt-6">Compliance Requirements</h3>
        <p>
          SOX (Sarbanes-Oxley) requires financial audit logging. Admin actions (who did what, when). Financial data access (who accessed financial data). Config changes (who changed financial config). Retention (7+ years for SOX compliance).
        </p>
        <p>
          GDPR (General Data Protection Regulation) requires data protection logging. Data access (who accessed personal data). Data modification (who modified personal data). Data export (who exported personal data). Data deletion (who deleted personal data). Retention (as long as needed, then delete).
        </p>
        <p>
          HIPAA (Health Insurance Portability and Accountability Act) requires healthcare data logging. PHI access (who accessed protected health information). PHI modification (who modified PHI). PHI export (who exported PHI). Retention (6+ years for HIPAA compliance).
        </p>
        <p>
          PCI DSS (Payment Card Industry Data Security Standard) requires payment data logging. Card data access (who accessed card data). Payment processing (who processed payments). Refund processing (who processed refunds). Retention (1+ year for PCI DSS compliance).
        </p>

        <h3 className="mt-6">Log Retention</h3>
        <p>
          Retention policies define how long to keep logs. Compliance retention (keep for compliance period). Operational retention (keep for operational needs). Legal retention (keep for legal requirements). Cost retention (keep based on storage cost).
        </p>
        <p>
          Tiered storage stores logs in tiers. Hot storage (recent logs, fast access). Warm storage (older logs, slower access). Cold storage (old logs, slowest access, cheapest). Archive storage (archived logs, very slow access, very cheap).
        </p>
        <p>
          Automated retention automates log retention. Retention policies (define retention per log type). Automated deletion (delete logs when retention expires). Compliance verification (verify compliance with retention).
        </p>

        <h3 className="mt-6">Search and Analysis</h3>
        <p>
          Log search enables searching logs. Search by user (search by user ID, user email). Search by action (search by action type). Search by time (search by time range). Search by resource (search by resource accessed).
        </p>
        <p>
          Pattern analysis analyzes log patterns. User behavior (analyze user behavior patterns). Anomaly detection (detect anomalous behavior). Trend analysis (analyze trends over time). Risk analysis (analyze risk patterns).
        </p>
        <p>
          Forensic investigation enables forensic investigation. Timeline reconstruction (reconstruct timeline of events). User activity (reconstruct user activity). Incident investigation (investigate security incidents). Compliance audit (audit for compliance).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Audit logging architecture spans event capture, log storage, compliance management, and search/analysis. Event capture captures events from multiple sources. Log storage stores logs immutably. Compliance management manages compliance requirements. Search/analysis enables log search and analysis.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/audit-logging/audit-logging-architecture.svg"
          alt="Audit Logging Architecture"
          caption="Figure 1: Audit Logging Architecture — Event capture, immutable storage, compliance, and search"
          width={1000}
          height={500}
        />

        <h3>Event Capture</h3>
        <p>
          Event sources capture events from multiple sources. Application events (admin actions, user actions). System events (auth events, config changes). Database events (data access, data modification). Integration events (integration actions, API calls).
        </p>
        <p>
          Event schema defines event structure. Event ID (unique event identifier). Timestamp (when event occurred). User ID (who performed action). Action type (what action performed). Resource (what resource accessed). Details (event details, metadata).
        </p>
        <p>
          Event capture captures events synchronously. Synchronous capture (capture event before action). Asynchronous capture (capture event after action). Buffered capture (buffer events, batch capture).
        </p>

        <h3 className="mt-6">Immutable Storage</h3>
        <p>
          Write-once storage stores logs immutably. Append-only logs (append new entries). Immutable storage (can&apos;t modify existing entries). Tamper-proof storage (tamper detection). Compliance storage (compliance-compliant storage).
        </p>
        <p>
          Hash chaining ensures integrity. Hash each entry (hash of entry content). Chain hashes (hash includes previous hash). Tamper detection (if modified, hash doesn&apos;t match). Integrity verification (verify chain integrity).
        </p>
        <p>
          Tiered storage optimizes cost. Hot storage (recent logs, fast access). Warm storage (older logs, slower access). Cold storage (old logs, cheapest). Archive storage (archived logs, very cheap).
        </p>

        <h3 className="mt-6">Compliance Management</h3>
        <p>
          Compliance policies define compliance requirements. SOX policies (SOX compliance requirements). GDPR policies (GDPR compliance requirements). HIPAA policies (HIPAA compliance requirements). PCI DSS policies (PCI DSS compliance requirements).
        </p>
        <p>
          Retention management manages log retention. Retention policies (define retention per log type). Automated deletion (delete when retention expires). Compliance verification (verify compliance). Retention reporting (report on retention).
        </p>
        <p>
          Compliance reporting generates compliance reports. Compliance reports (generate compliance reports). Audit reports (generate audit reports). Retention reports (report on retention). Compliance verification (verify compliance).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/audit-logging/immutable-storage.svg"
          alt="Immutable Storage with Hash Chaining"
          caption="Figure 2: Immutable Storage with Hash Chaining — Append-only logs with hash chaining for integrity"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Search and Analysis</h3>
        <p>
          Log search enables searching logs. Search interface (search logs by criteria). Search results (display search results). Result filtering (filter search results). Result export (export search results).
        </p>
        <p>
          Pattern analysis analyzes log patterns. Behavior analysis (analyze user behavior). Anomaly detection (detect anomalies). Trend analysis (analyze trends). Risk analysis (analyze risk).
        </p>
        <p>
          Forensic investigation enables investigation. Timeline reconstruction (reconstruct timeline). User activity (reconstruct user activity). Incident investigation (investigate incidents). Compliance audit (audit for compliance).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/audit-logging/compliance-requirements.svg"
          alt="Compliance Requirements"
          caption="Figure 3: Compliance Requirements — SOX, GDPR, HIPAA, PCI DSS requirements"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Audit logging design involves trade-offs between comprehensiveness and performance, security and usability, and retention and cost. Understanding these trade-offs enables informed decisions aligned with compliance needs and technical constraints.
        </p>

        <h3>Event Capture: Synchronous vs. Asynchronous</h3>
        <p>
          Synchronous capture (capture before action). Pros: Complete (capture all events), accurate (capture before action). Cons: Performance impact (synchronous capture), latency (add latency to actions). Best for: Critical events (admin actions, security events).
        </p>
        <p>
          Asynchronous capture (capture after action). Pros: No performance impact (asynchronous), no latency. Cons: May miss events (if action fails), less accurate. Best for: Non-critical events (user actions, non-security events).
        </p>
        <p>
          Hybrid: synchronous for critical, asynchronous for non-critical. Pros: Best of both (complete for critical, fast for non-critical). Cons: Complexity (two capture modes). Best for: Most production systems.
        </p>

        <h3>Storage: Database vs. File System vs. Dedicated Service</h3>
        <p>
          Database storage (store in database). Pros: Queryable (SQL queries), structured (structured data). Cons: Cost (database cost), performance (database performance). Best for: Structured logs, query-intensive.
        </p>
        <p>
          File system storage (store in files). Pros: Cheap (file system cost), simple (simple storage). Cons: Not queryable (can&apos;t query files), unstructured (unstructured data). Best for: Unstructured logs, archive storage.
        </p>
        <p>
          Dedicated service (dedicated audit log service). Pros: Optimized (optimized for audit logs), compliant (compliance-compliant). Cons: Cost (service cost), dependency (service dependency). Best for: Compliance-intensive, high-volume.
        </p>

        <h3>Retention: Long vs. Short</h3>
        <p>
          Long retention (keep logs for long time). Pros: Compliance (compliant with long retention), forensic (enable long-term forensics). Cons: Cost (storage cost), management (manage long retention). Best for: Compliance-intensive (SOX, HIPAA).
        </p>
        <p>
          Short retention (keep logs for short time). Pros: Cheap (low storage cost), simple (simple management). Cons: Non-compliant (not compliant with long retention), limited forensics. Best for: Non-compliance, low-risk.
        </p>
        <p>
          Tiered retention (tiered retention). Pros: Best of both (compliant for recent, cheap for old). Cons: Complexity (tiered management). Best for: Most production systems.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/audit-logging/storage-comparison.svg"
          alt="Storage Comparison"
          caption="Figure 4: Storage Comparison — Database vs. file system vs. dedicated service"
          width={1000}
          height={450}
        />

        <h3>Security: High vs. Low</h3>
        <p>
          High security (high security for logs). Pros: Secure (logs protected), compliant (compliance-compliant). Cons: Cost (security cost), complexity (security complexity). Best for: Compliance-intensive, high-risk.
        </p>
        <p>
          Low security (low security for logs). Pros: Cheap (low security cost), simple (simple security). Cons: Insecure (logs not protected), non-compliant. Best for: Non-compliance, low-risk.
        </p>
        <p>
          Hybrid: high security for critical, low for non-critical. Pros: Best of both (secure for critical, cheap for non-critical). Cons: Complexity (two security levels). Best for: Most production systems.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Capture comprehensive events:</strong> Admin actions, auth events, data access, config changes. Comprehensive event capture.
          </li>
          <li>
            <strong>Use immutable storage:</strong> Append-only storage, hash chaining, tamper-proof storage. Immutable log storage.
          </li>
          <li>
            <strong>Implement compliance management:</strong> Compliance policies, retention management, compliance reporting. Compliance-compliant logging.
          </li>
          <li>
            <strong>Enable log search:</strong> Search interface, search results, result filtering, result export. Log search capability.
          </li>
          <li>
            <strong>Implement pattern analysis:</strong> Behavior analysis, anomaly detection, trend analysis, risk analysis. Log pattern analysis.
          </li>
          <li>
            <strong>Enable forensic investigation:</strong> Timeline reconstruction, user activity reconstruction, incident investigation. Forensic investigation capability.
          </li>
          <li>
            <strong>Implement tiered storage:</strong> Hot storage, warm storage, cold storage, archive storage. Tiered log storage.
          </li>
          <li>
            <strong>Implement automated retention:</strong> Retention policies, automated deletion, compliance verification. Automated log retention.
          </li>
          <li>
            <strong>Secure logs:</strong> Access control, encryption, tamper-proofing. Log security.
          </li>
          <li>
            <strong>Monitor logging:</strong> Monitor logging performance, monitor log storage, monitor compliance. Logging monitoring.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Incomplete event capture:</strong> Don&apos;t capture all events. Solution: Comprehensive event capture (admin, auth, data, config).
          </li>
          <li>
            <strong>Mutable storage:</strong> Logs can be modified. Solution: Immutable storage (append-only, hash chaining).
          </li>
          <li>
            <strong>No compliance management:</strong> Not compliant with regulations. Solution: Compliance policies, retention management, compliance reporting.
          </li>
          <li>
            <strong>No log search:</strong> Can&apos;t search logs. Solution: Search interface, search results, filtering, export.
          </li>
          <li>
            <strong>No pattern analysis:</strong> Can&apos;t analyze patterns. Solution: Behavior analysis, anomaly detection, trend analysis.
          </li>
          <li>
            <strong>No forensic capability:</strong> Can&apos;t investigate incidents. Solution: Timeline reconstruction, user activity reconstruction.
          </li>
          <li>
            <strong>Poor storage management:</strong> Expensive storage, poor management. Solution: Tiered storage, automated retention.
          </li>
          <li>
            <strong>Insecure logs:</strong> Logs not secure. Solution: Access control, encryption, tamper-proofing.
          </li>
          <li>
            <strong>No monitoring:</strong> Don&apos;t know logging status. Solution: Monitor logging performance, storage, compliance.
          </li>
          <li>
            <strong>Poor performance:</strong> Logging impacts performance. Solution: Asynchronous capture, buffered capture, optimized storage.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>SOX Compliance Logging</h3>
        <p>
          SOX compliance logging for financial companies. Admin actions (who did what, when). Financial data access (who accessed financial data). Config changes (who changed financial config). Retention (7+ years for SOX). Immutable storage (append-only, hash chaining). Compliance reporting (generate SOX reports).
        </p>

        <h3 className="mt-6">GDPR Compliance Logging</h3>
        <p>
          GDPR compliance logging for EU companies. Data access (who accessed personal data). Data modification (who modified personal data). Data export (who exported data). Data deletion (who deleted data). Retention (as long as needed). Privacy-compliant logging.
        </p>

        <h3 className="mt-6">HIPAA Compliance Logging</h3>
        <p>
          HIPAA compliance logging for healthcare. PHI access (who accessed protected health information). PHI modification (who modified PHI). PHI export (who exported PHI). Retention (6+ years for HIPAA). Healthcare-compliant logging.
        </p>

        <h3 className="mt-6">PCI DSS Compliance Logging</h3>
        <p>
          PCI DSS compliance logging for payment companies. Card data access (who accessed card data). Payment processing (who processed payments). Refund processing (who processed refunds). Retention (1+ year for PCI DSS). Payment-compliant logging.
        </p>

        <h3 className="mt-6">Forensic Investigation</h3>
        <p>
          Forensic investigation for security incidents. Timeline reconstruction (reconstruct timeline of events). User activity (reconstruct user activity). Incident investigation (investigate security incidents). Compliance audit (audit for compliance). Forensic analysis.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure audit log integrity and prevent tampering in high-security environments?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement hash chaining where each log entry includes hash of previous entry—any modification breaks the chain and is detectable. Use write-once storage (WORM—Write Once Read Many) that physically prevents modifications. Implement tamper-proof storage with separate credentials from application—audit log admins shouldn&apos;t have app access and vice versa. Regularly verify chain integrity with automated checks. For highest security: use external audit log service or blockchain-based logging where entries are cryptographically signed and distributed. The key principle: make tampering detectable even if not preventable. Implement alerting on integrity check failures—this is a security incident. Maintain chain of custody documentation for compliance audits.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle PII in audit logs while balancing compliance requirements with privacy regulations like GDPR?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Follow data minimization principle—only log PII that&apos;s necessary for audit purposes. Often user ID is sufficient without name, email, or other identifying information. For required PII: encrypt sensitive fields at rest with separate key management, implement strict access controls (only compliance team can view full logs), and apply retention policies that delete PII when no longer needed. Consider pseudonymization—replace direct identifiers with tokens that can be reversed only with separate key. The critical balance: GDPR&apos;s right to erasure vs. compliance requirements to retain audit logs. Solution: separate PII from audit events—store PII mapping separately with shorter retention, allowing you to delete PII while retaining audit trail. Document your PII handling in data processing agreements.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement compliance retention policies that satisfy multiple regulations (SOX, GDPR, HIPAA, PCI DSS) simultaneously?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement tiered retention based on log type and regulatory requirements. SOX requires 7+ years for financial audit logs. HIPAA requires 6+ years for healthcare logs. PCI DSS requires 1+ year for payment logs with 3 months immediately available. GDPR requires data minimization—retain only as long as necessary. Define retention policies per log category, not individual logs. Implement automated deletion when retention expires—with approval workflow for logs under legal hold. Use tiered storage: hot storage (immediate access, expensive) for recent logs, warm storage (seconds to access) for 3-12 month logs, cold storage (minutes to hours) for older logs, archive storage (very cheap, very slow) for compliance retention. Critical: maintain retention compliance reports showing what was deleted when for auditors.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you enable efficient log search across billions of log entries while maintaining sub-second query performance?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement dedicated log search infrastructure—don&apos;t query raw log storage directly. Use Elasticsearch, Splunk, or similar search-optimized databases with proper indexing strategy. Index high-cardinality fields (user ID, action type, timestamp) but avoid over-indexing (slows writes). Implement search interface with filters (date range, user, action type, result), full-text search for free-text fields, and result pagination. For very large result sets: implement streaming export rather than loading all results. Optimize common queries with pre-computed aggregations (count by action type, count by user). The key trade-off: search flexibility vs. performance—define supported query patterns and optimize for those. Implement query timeouts to prevent expensive queries from degrading search performance for all users.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you support forensic investigation and incident response with audit logs?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Design logs for investigation workflows. Enable timeline reconstruction—query all actions by user or session within time range to understand sequence of events. Support user activity reconstruction—all actions by specific user across time. Implement correlation capabilities—link related events (login → data access → data export). For incident response: provide rapid search (compromised account investigation), export capabilities (evidence preservation), and chain of custody tracking. Critical: ensure logs capture sufficient context (IP address, user agent, session ID, affected resources) to answer investigation questions. Implement investigation-specific views: "show me everything this user did in the last 24 hours" or "show all access to this sensitive resource." Train security team on log analysis tools before incidents occur.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure logging doesn&apos;t impact application performance, especially during high-traffic periods?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement asynchronous logging—capture log events asynchronously without blocking request processing. Use buffered capture—batch log events and write in bulk rather than one-at-a-time. Implement backpressure handling—when log storage is slow, buffer in memory with bounded queue size, then drop oldest events if queue fills (better to lose logs than crash application). Use tiered storage strategy—write critical logs synchronously (security events, financial transactions), non-critical logs asynchronously. Monitor logging performance—track log write latency, queue depth, drop rate. The key insight: logging is important but shouldn&apos;t take down the application. Implement circuit breaker for logging—if log storage is consistently failing, temporarily reduce logging verbosity rather than cascading failures. Test logging under load to identify bottlenecks before production incidents.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.sox-online.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SOX Online — Sarbanes-Oxley Resources
            </a>
          </li>
          <li>
            <a
              href="https://gdpr.eu/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GDPR.eu — GDPR Resources
            </a>
          </li>
          <li>
            <a
              href="https://www.hhs.gov/hipaa/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              HHS — HIPAA Resources
            </a>
          </li>
          <li>
            <a
              href="https://www.pcisecuritystandards.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PCI Security Standards Council — PCI DSS
            </a>
          </li>
          <li>
            <a
              href="https://www.nist.gov/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NIST — Security Standards
            </a>
          </li>
          <li>
            <a
              href="https://www.isaca.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ISACA — Audit/Control Resources
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
