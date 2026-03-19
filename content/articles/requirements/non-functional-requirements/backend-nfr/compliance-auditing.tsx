"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-compliance-auditing-extensive",
  title: "Compliance & Auditing",
  description: "Comprehensive guide to compliance and auditing, covering GDPR, HIPAA, SOC 2, PCI DSS, audit trails, and compliance implementation patterns for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "compliance-auditing",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "compliance", "auditing", "gdpr", "hipaa", "soc2", "security"],
  relatedTopics: ["secrets-management", "authorization-model", "centralized-logging", "data-retention"],
};

export default function ComplianceAuditingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Compliance</strong> means adhering to laws, regulations, and standards relevant to your
          business. <strong>Auditing</strong> is the systematic examination of systems and processes to
          verify compliance and detect issues.
        </p>
        <p>
          Compliance is not optional — violations result in fines, legal liability, and reputational damage.
          For staff/principal engineers, understanding compliance requirements is essential for designing
          systems that meet regulatory obligations.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Compliance by Design</h3>
          <p>
            Retrofitting compliance is expensive and error-prone. Build compliance into your system from
            the start: data classification, access controls, audit logging, and retention policies should
            be foundational, not afterthoughts.
          </p>
        </div>
      </section>

      <section>
        <h2>Major Regulations</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/compliance-framework.svg"
          alt="Compliance Framework Overview"
          caption="Compliance Framework — showing key regulations (GDPR, HIPAA, SOC 2, PCI DSS, CCPA) and audit trail requirements"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">GDPR (General Data Protection Regulation)</h3>
        <p>
          <strong>Scope:</strong> EU residents&apos; personal data (applies globally if you process EU data).
        </p>
        <p>
          <strong>Key requirements:</strong>
        </p>
        <ul>
          <li>
            <strong>Consent:</strong> Explicit, informed consent for data processing.
          </li>
          <li>
            <strong>Right to access:</strong> Users can request their data.
          </li>
          <li>
            <strong>Right to erasure:</strong> &quot;Right to be forgotten&quot; — delete user data on request.
          </li>
          <li>
            <strong>Data portability:</strong> Users can export their data in machine-readable format.
          </li>
          <li>
            <strong>Breach notification:</strong> Report breaches within 72 hours.
          </li>
        </ul>
        <p>
          <strong>Penalties:</strong> Up to €20M or 4% of global annual revenue (whichever is higher).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">HIPAA (Health Insurance Portability and Accountability Act)</h3>
        <p>
          <strong>Scope:</strong> Protected Health Information (PHI) in the US healthcare system.
        </p>
        <p>
          <strong>Key requirements:</strong>
        </p>
        <ul>
          <li>
            <strong>Access controls:</strong> Limit access to PHI to authorized personnel.
          </li>
          <li>
            <strong>Audit controls:</strong> Log access to PHI.
          </li>
          <li>
            <strong>Encryption:</strong> Encrypt PHI at rest and in transit.
          </li>
          <li>
            <strong>Business Associate Agreements:</strong> Contracts with vendors who handle PHI.
          </li>
        </ul>
        <p>
          <strong>Penalties:</strong> Up to $1.5M per violation category per year.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SOC 2 (Service Organization Control 2)</h3>
        <p>
          <strong>Scope:</strong> Service organizations handling customer data.
        </p>
        <p>
          <strong>Trust Services Criteria:</strong>
        </p>
        <ul>
          <li>
            <strong>Security:</strong> Protection against unauthorized access (required).
          </li>
          <li>
            <strong>Availability:</strong> System availability for operation and use.
          </li>
          <li>
            <strong>Processing Integrity:</strong> Complete, accurate, timely processing.
          </li>
          <li>
            <strong>Confidentiality:</strong> Protection of confidential information.
          </li>
          <li>
            <strong>Privacy:</strong> Collection, use, retention, disclosure of personal information.
          </li>
        </ul>
        <p>
          <strong>Type I:</strong> Point-in-time assessment. <strong>Type II:</strong> Over period of time (6-12 months).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">PCI DSS (Payment Card Industry Data Security Standard)</h3>
        <p>
          <strong>Scope:</strong> Organizations handling credit card data.
        </p>
        <p>
          <strong>Key requirements:</strong>
        </p>
        <ul>
          <li>Secure network (firewalls, no vendor defaults).</li>
          <li>Protect cardholder data (encryption, masking).</li>
          <li>Vulnerability management (antivirus, secure systems).</li>
          <li>Access control (need-to-know, unique IDs).</li>
          <li>Monitoring and testing (logs, security testing).</li>
          <li>Information security policy.</li>
        </ul>
      </section>

      <section>
        <h2>Audit Trail Implementation</h2>
        <p>
          Audit trails are required by most compliance frameworks:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">What to Audit</h3>
        <ul>
          <li>User authentication (login, logout, failed attempts).</li>
          <li>Data access (read, write, delete operations).</li>
          <li>Permission changes (role assignments, privilege escalation).</li>
          <li>System configuration changes.</li>
          <li>Data exports and bulk operations.</li>
          <li>Failed operations and errors.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Audit Log Requirements</h3>
        <ul>
          <li>
            <strong>Timestamp:</strong> UTC, synchronized across systems (NTP).
          </li>
          <li>
            <strong>User ID:</strong> Who performed the action.
          </li>
          <li>
            <strong>Action:</strong> What was done.
          </li>
          <li>
            <strong>Resource:</strong> What was affected.
          </li>
          <li>
            <strong>Result:</strong> Success or failure.
          </li>
          <li>
            <strong>IP address:</strong> Where the request originated.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Audit Log Protection</h3>
        <ul>
          <li>Write-only access (append-only, no modifications).</li>
          <li>Separate storage from application data.</li>
          <li>Encryption at rest.</li>
          <li>Regular backup and retention.</li>
          <li>Alerting on suspicious patterns.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design a system that must be GDPR compliant. What features do you implement?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Consent management:</strong> Explicit opt-in for data processing. Granular consent (marketing, analytics, etc.). Easy to withdraw.</li>
                <li><strong>Data subject access:</strong> Users can request export of all their data (machine-readable format like JSON/CSV).</li>
                <li><strong>Right to erasure:</strong> Users can request deletion. Delete from active systems, crypto-shred backups.</li>
                <li><strong>Data portability:</strong> Export data in standard format. Transfer to another provider on request.</li>
                <li><strong>Breach notification:</strong> Detect breaches, notify authorities within 72 hours, notify affected users.</li>
                <li><strong>Data minimization:</strong> Only collect necessary data. Automatic deletion after retention period.</li>
                <li><strong>Privacy by design:</strong> Encrypt data at rest and in transit. Pseudonymize where possible.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. What is an audit trail? What events should be logged for compliance?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Audit trail:</strong> Chronological record of who did what, when, and from where. Immutable (append-only).</li>
                <li><strong>Authentication events:</strong> Login, logout, failed login, password change, MFA enable/disable.</li>
                <li><strong>Authorization events:</strong> Permission grants, role changes, access denials.</li>
                <li><strong>Data access:</strong> Read/write/delete of sensitive data (PII, PHI, financial).</li>
                <li><strong>Administrative actions:</strong> Config changes, user creation/deletion, policy changes.</li>
                <li><strong>Required fields:</strong> Timestamp, user_id, action, resource, outcome, IP address, user agent.</li>
                <li><strong>Retention:</strong> HIPAA = 6 years, SOX = 7 years, PCI DSS = 1 year minimum.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. Compare GDPR, HIPAA, and SOC 2. When does each apply?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>GDPR:</strong> EU data protection law. Applies to any company processing EU citizen data. Key: consent, right to erasure, 72-hour breach notification, data portability. Fines up to 4% of global revenue.</li>
                <li><strong>HIPAA:</strong> US healthcare law. Applies to healthcare providers and business associates. Key: PHI protection, access controls, audit logging, 6-year retention. Fines up to $1.5M per violation.</li>
                <li><strong>SOC 2:</strong> Voluntary audit standard. Required for B2B SaaS. Key: Security, availability, processing integrity, confidentiality, privacy. No legal fines but required for enterprise customers.</li>
                <li><strong>When each applies:</strong> GDPR (EU users), HIPAA (healthcare data), SOC 2 (enterprise customers demand it).</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. How do you implement &quot;right to be forgotten&quot; in a system with backups and data replication?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Data inventory:</strong> Catalog all systems storing user data (databases, caches, backups, logs, analytics, third-party).</li>
                <li><strong>Active systems:</strong> Delete user data from all databases, caches, search indices. Propagate deletion event via message queue.</li>
                <li><strong>Backups:</strong> Can&apos;t modify backups without breaking integrity. Use crypto-shredding (delete encryption key for user data).</li>
                <li><strong>Logs:</strong> Anonymize user data in logs (replace user_id with hash). Keep audit trail but remove PII.</li>
                <li><strong>Third-party:</strong> Notify all third-party processors (analytics, email, CRM) to delete user data.</li>
                <li><strong>Verification:</strong> Audit deletion completion. Generate compliance report for user.</li>
                <li><strong>Exceptions:</strong> Legal hold, regulatory requirements (financial/medical records) override deletion requests.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. Design audit logging for a healthcare application handling PHI.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>What to log:</strong> All PHI access (who viewed what record), authentication events, data modifications, administrative actions.</li>
                <li><strong>Log format:</strong> Structured JSON with: timestamp, user_id, action, resource (patient_id, record_type), outcome, ip_address, user_agent.</li>
                <li><strong>Storage:</strong> Immutable storage (WORM - Write Once Read Many). Separate from application data. Encrypt at rest.</li>
                <li><strong>Retention:</strong> HIPAA requires 6 years minimum. Store in compliant archive (S3 Glacier with compliance mode).</li>
                <li><strong>Access:</strong> Audit team can query. Alert on unusual patterns (accessing records outside normal duties).</li>
                <li><strong>Protection:</strong> Separate duties (developers can&apos;t delete logs). Regular audit log reviews.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. How do you prepare for a SOC 2 audit? What evidence do auditors need?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Preparation:</strong> (1) Define scope (which systems, which trust principles). (2) Implement controls. (3) Document policies and procedures. (4) Train employees.</li>
                <li><strong>Evidence:</strong> (1) Access control logs (who accessed what). (2) Change management records (code reviews, deployments). (3) Incident response logs. (4) Backup/restore tests. (5) Security training records. (6) Vendor risk assessments.</li>
                <li><strong>Continuous compliance:</strong> Automated evidence collection (Vanta, Drata). Don&apos;t scramble before audit.</li>
                <li><strong>Common gaps:</strong> Missing documentation, inconsistent processes, lack of monitoring, insufficient access reviews.</li>
                <li><strong>Timeline:</strong> SOC 2 Type I (point in time): 2-3 months prep. Type II (period of time): 6-12 months of evidence.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Compliance Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Identified applicable regulations (GDPR, HIPAA, SOC 2, PCI DSS)</li>
          <li>✓ Data classification implemented (PII, PHI, sensitive)</li>
          <li>✓ Consent management for data processing</li>
          <li>✓ Access controls and least privilege enforced</li>
          <li>✓ Audit logging for all required events</li>
          <li>✓ Encryption at rest and in transit</li>
          <li>✓ Data retention policies implemented</li>
          <li>✓ User data export functionality</li>
          <li>✓ User data deletion functionality</li>
          <li>✓ Breach notification procedures documented</li>
          <li>✓ Regular compliance audits scheduled</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
