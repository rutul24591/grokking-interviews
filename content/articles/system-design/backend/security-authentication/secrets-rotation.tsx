"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-secrets-rotation-extensive",
  title: "Secrets Rotation",
  description:
    "Staff-level deep dive into automated secrets rotation, zero-downtime rotation strategies, database credential rotation, API key rotation, TLS certificate rotation, and the operational practice of managing secrets lifecycle at scale.",
  category: "backend",
  subcategory: "security-authentication",
  slug: "secrets-rotation",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "security", "secrets", "rotation", "vault", "kms", "credentials"],
  relatedTopics: ["api-keys-secrets-management", "encryption", "tls-ssl", "hashing-salting"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition and Context
          ============================================================ */}
      <section>
        <h2>Definition and Context</h2>
        <p>
          <strong>Secrets rotation</strong> is the practice of periodically replacing secrets (API keys, database
          passwords, TLS certificates, signing keys) with new values — it limits the window of opportunity if a
          secret is compromised. If a secret is stolen, the attacker can only use it until the secret is rotated —
          after rotation, the old secret is revoked and the attacker&apos;s access is terminated.
        </p>
        <p>
          Secrets rotation is required by major compliance standards (PCI-DSS requires 90-day rotation for all
          credentials, SOC 2 requires regular rotation with audit trail, HIPAA requires access logging and
          rotation policies). Beyond compliance, secrets rotation is a fundamental security practice — it limits
          the blast radius of a breach and ensures that secrets do not remain valid indefinitely.
        </p>
        <p>
          The challenge of secrets rotation is doing it without service disruption — if a secret is rotated
          abruptly (old secret revoked before applications update to the new secret), applications that use the
          old secret will fail (database connection failures, API authentication errors, TLS handshake failures).
          Zero-downtime rotation requires an overlap period where both the old and new secrets are valid —
          applications migrate to the new secret during the overlap period, and the old secret is revoked after
          all applications have migrated.
        </p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-5">
          <h3 className="text-lg font-semibold mb-3">Secret Types and Rotation Frequency</h3>
          <p className="text-muted mb-3">
            <strong>API Keys:</strong> Rotate every 90 days. Generate new key, activate alongside old, migrate clients, revoke old.
          </p>
          <p className="text-muted mb-3">
            <strong>Database Passwords:</strong> Rotate every 90 days. Use ALTER USER with overlap period, or IAM database authentication (no passwords).
          </p>
          <p className="text-muted mb-3">
            <strong>TLS Certificates:</strong> Rotate before expiration (every 90 days for Let&apos;s Encrypt). Install new cert alongside old, wait for propagation, retire old.
          </p>
          <p>
            <strong>Signing Keys (JWT):</strong> Rotate every 90 days. Publish new public key, sign with new key, accept both old and new until old tokens expire, retire old key.
          </p>
        </div>
        <p>
          The evolution of secrets rotation has been shaped by the need for automation — manual rotation is
          error-prone (administrators forget to rotate, rotate incorrectly, or cause service disruption). Modern
          secrets rotation is automated — secrets managers (HashiCorp Vault, AWS Secrets Manager, GCP Secret
          Manager) generate new secrets, distribute them to applications, and retire old secrets on a schedule,
          without human intervention.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          The secrets rotation lifecycle consists of four phases: (1) Old Secret Active — only the old secret is
          valid, applications use the old secret. (2) New Secret Generated — the secrets manager generates a new
          secret and stores it alongside the old secret. Both secrets are valid. (3) Migration — applications
          migrate to the new secret. During the overlap period (typically 7-14 days), both secrets remain valid
          so that applications that have not yet migrated can continue to use the old secret. (4) Old Secret
          Retired — after the overlap period, the old secret is revoked. Only the new secret is valid.
        </p>
        <p>
          Zero-downtime rotation is the practice of rotating secrets without disrupting active applications. It
          requires an overlap period where both the old and new secrets are valid — applications migrate to the
          new secret during the overlap period, and the old secret is revoked after all applications have
          migrated. Zero-downtime rotation is essential for production systems — abrupt rotation (revoking the
          old secret before applications migrate) causes service disruption (database connection failures, API
          authentication errors, TLS handshake failures).
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/secrets-rotation-diagram-1.svg"
          alt="Secrets rotation lifecycle showing old secret active, new secret generation, migration overlap period, and old secret retirement"
          caption="Secrets rotation lifecycle: old secret active → new secret generated (both valid) → migration period (applications update to new secret) → old secret retired (only new secret valid)."
        />
        <p>
          Emergency rotation is the practice of rotating secrets immediately when a compromise is detected —
          unlike scheduled rotation (which uses an overlap period), emergency rotation revokes the old secret
          immediately and generates a new secret. Emergency rotation may cause brief service disruption
          (applications using the old secret will fail until they update to the new secret), but it is necessary
          to terminate the attacker&apos;s access immediately. Emergency rotation is triggered by security incidents
          (secret leaked in logs, secret committed to public repository, secret accessed by unauthorized user).
        </p>
        <p>
          Database credential rotation is a specialized form of secrets rotation — it requires coordinating the
          database password change with application connection string updates. The rotation process is: (1)
          Generate a new database password. (2) ALTER USER to add the new password (keeping the old password
          active — most databases support multiple passwords per user). (3) Notify applications to update their
          connection strings. (4) Wait for the overlap period (all applications have migrated to the new
          password). (5) ALTER USER to remove the old password. (6) Audit the rotation event.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/secrets-rotation-diagram-2.svg"
          alt="Automated secrets rotation architecture showing secrets manager generating, distributing, and retiring secrets across applications"
          caption="Automated secrets rotation: secrets manager generates new secrets, notifies applications via webhook or polling, applications fetch new secret during overlap period, and old secret is retired after all applications have migrated."
        />
        <p>
          API key rotation requires generating a new API key, activating it alongside the old key, notifying
          clients to update to the new key, and revoking the old key after the overlap period. API key rotation
          is simpler than database credential rotation because API keys are not tied to active connections —
          clients can update to the new key at their convenience during the overlap period. However, API key
          rotation requires client cooperation — if clients do not update to the new key during the overlap
          period, they will fail when the old key is revoked.
        </p>
        <p>
          TLS certificate rotation requires installing the new certificate alongside the old certificate, waiting
          for the new certificate to propagate (DNS, CDN, load balancer), and retiring the old certificate after
          it expires. TLS certificate rotation is typically automated using ACME protocol (Let&apos;s Encrypt,
          cert-manager) — the ACME client requests a new certificate, installs it, and schedules renewal before
          the new certificate expires.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture and Flow
          ============================================================ */}
      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The secrets rotation architecture consists of the secrets manager (which generates, stores, and rotates
          secrets), the notification system (which notifies applications of new secrets), the application secret
          cache (which stores the current secret in memory), and the audit logger (which logs all rotation
          events). The secrets manager is the core component — it generates new secrets, stores them alongside
          old secrets, notifies applications, and retires old secrets after the overlap period.
        </p>
        <p>
          The secrets rotation flow begins with the secrets manager generating a new secret (using a CSPRNG) and
          storing it alongside the old secret. The secrets manager notifies applications of the new secret (via
          webhook or polling). Applications fetch the new secret from the secrets manager and update their
          in-memory secret cache. During the overlap period, both the old and new secrets are valid —
          applications that have not yet migrated can continue to use the old secret. After the overlap period,
          the secrets manager revokes the old secret — only the new secret is valid.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/secrets-rotation-diagram-3.svg"
          alt="Database credential rotation showing automatic password rotation with overlap period for zero-downtime migration"
          caption="Database password rotation: generate new password, add it to database user (keeping old password active), notify applications to update connection strings, wait for overlap period, then remove old password."
        />
        <p>
          Application secret caching is essential for performance — applications cache the current secret in
          memory to avoid fetching it from the secrets manager on every request. The cache is invalidated when
          the secrets manager notifies the application of a new secret — the application fetches the new secret
          and updates its cache. Cache invalidation must be reliable — if the cache is not invalidated, the
          application will continue to use the old secret, which will fail after the old secret is revoked.
        </p>
        <p>
          Secrets rotation monitoring is essential for detecting rotation failures — track the rotation success
          rate (percentage of successful rotations), the secret usage rate (percentage of requests using old vs
          new secret), and the stale secret usage rate (applications still using the old secret after the
          overlap period). Alert on rotation failures (secret generation failed, notification failed, application
          failed to migrate), stale secret usage (applications using old secret after overlap period), and
          unauthorized secret access (secret accessed from unexpected IP or application).
        </p>
        <p>
          Secrets rotation auditing is essential for compliance — log all rotation events (secret generated,
          secret activated, secret retired), including the timestamp, the secret type, the rotation reason
          (scheduled, emergency), and the applications notified. Audit logs enable auditors to verify that
          secrets are rotated on schedule and that rotation events are properly executed. Audit logs should be
          immutable (written to a write-once store) and retained for the compliance period (typically 1-7 years).
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs and Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          Scheduled rotation versus event-driven rotation is a trade-off between predictability and responsiveness.
          Scheduled rotation (rotate every 90 days) is predictable — it occurs on a fixed schedule, making it
          easy to plan and audit. However, scheduled rotation does not respond to compromise — if a secret is
          compromised between scheduled rotations, the attacker has access until the next scheduled rotation.
          Event-driven rotation (rotate when a compromise is detected) is responsive — it terminates the
          attacker&apos;s access immediately. However, event-driven rotation is unpredictable — it may occur at any
          time, and it may cause service disruption (if applications have not migrated to the new secret). The
          recommended approach is both — scheduled rotation for regular rotation, event-driven rotation for
          emergency rotation when compromise is detected.
        </p>
        <p>
          Overlap period versus immediate rotation is a trade-off between availability and security. Overlap
          period (both old and new secrets are valid for a period) ensures zero-downtime rotation — applications
          can migrate to the new secret at their convenience. However, overlap period increases the attack
          surface — if the old secret is compromised during the overlap period, the attacker has access until the
          old secret is revoked. Immediate rotation (revoking the old secret immediately) minimizes the attack
          surface — the attacker&apos;s access is terminated immediately. However, immediate rotation may cause
          service disruption (applications using the old secret will fail). The recommended approach is overlap
          period for scheduled rotation and immediate rotation for emergency rotation.
        </p>
        <p>
          Manual rotation versus automated rotation is a trade-off between control and reliability. Manual
          rotation (administrators rotate secrets manually) provides full control — administrators can review
          each rotation event and ensure that applications are ready for the new secret. However, manual rotation
          is error-prone — administrators may forget to rotate, rotate incorrectly, or cause service disruption.
          Automated rotation (secrets manager rotates secrets automatically) is reliable — it occurs on schedule,
          without human intervention. However, automated rotation requires proper configuration — if the
          configuration is incorrect, automated rotation may cause service disruption. The recommended approach
          is automated rotation for most secrets, with manual rotation for critical secrets (signing keys, root
          database credentials) that require additional review.
        </p>
        <p>
          Static secrets versus dynamic secrets is a trade-off between simplicity and security. Static secrets
          (secrets that are rotated on a schedule) are simple to understand and implement — they are generated
          once and rotated on a fixed schedule. However, static secrets have a long lifetime — if compromised,
          the attacker has access until the next rotation. Dynamic secrets (secrets that are generated on-demand
          and expire after a short period) are more secure — they have a short lifetime, limiting the attacker&apos;s
          access window. However, dynamic secrets are complex to implement — they require a secrets manager that
          can generate secrets on-demand and integrate with the application to fetch secrets dynamically. The
          recommended approach is static secrets for most secrets (API keys, database passwords) with dynamic
          secrets for high-security secrets (temporary database credentials, session tokens).
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Automate secrets rotation — use a secrets manager (HashiCorp Vault, AWS Secrets Manager, GCP Secret
          Manager) to generate, distribute, and retire secrets automatically. Automated rotation eliminates
          human error (forgotten rotations, incorrect rotations) and ensures that secrets are rotated on schedule.
        </p>
        <p>
          Use an overlap period for zero-downtime rotation — generate the new secret, activate it alongside the
          old secret, notify applications to migrate to the new secret, and revoke the old secret after the
          overlap period (7-14 days). Overlap period ensures that applications that have not yet migrated can
          continue to use the old secret, preventing service disruption.
        </p>
        <p>
          Monitor rotation events — track the rotation success rate, secret usage rate (old vs new), and stale
          secret usage rate. Alert on rotation failures (secret generation failed, notification failed,
          application failed to migrate), stale secret usage (applications using old secret after overlap
          period), and unauthorized secret access (secret accessed from unexpected IP or application).
        </p>
        <p>
          Audit all rotation events — log secret generation, activation, and retirement, including the
          timestamp, secret type, rotation reason (scheduled, emergency), and applications notified. Audit
          logs should be immutable and retained for the compliance period (1-7 years).
        </p>
        <p>
          Use dynamic secrets for high-security secrets — generate temporary database credentials, session
          tokens, and API keys on-demand with short expiration periods. Dynamic secrets limit the attacker&apos;s
          access window — if compromised, the secret expires quickly, terminating the attacker&apos;s access.
        </p>
        <p>
          Test rotation procedures regularly — simulate rotation events in a staging environment to verify that
          applications migrate to the new secret correctly and that the old secret is revoked without service
          disruption. Regular testing ensures that rotation procedures are correct and that applications are
          ready for rotation.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Rotating secrets without an overlap period is a common pitfall — revoking the old secret before
          applications migrate to the new secret causes service disruption (database connection failures, API
          authentication errors, TLS handshake failures). The fix is to use an overlap period — generate the
          new secret, activate it alongside the old secret, notify applications to migrate, and revoke the old
          secret after the overlap period.
        </p>
        <p>
          Not monitoring stale secret usage is a common operational pitfall — applications that do not migrate
          to the new secret during the overlap period will fail when the old secret is revoked. The fix is to
          monitor stale secret usage — track the percentage of requests using the old secret, and alert when
          the percentage exceeds a threshold (e.g., 5 percent of requests still using old secret after 7 days).
          Investigate stale secret usage and notify the application owners to migrate.
        </p>
        <p>
          Not rotating secrets on schedule is a common compliance pitfall — if secrets are not rotated on
          schedule, they remain valid indefinitely, increasing the risk of compromise. The fix is to automate
          rotation — use a secrets manager to rotate secrets on a fixed schedule (every 90 days for most
          secrets). Automated rotation ensures that secrets are rotated on schedule, without human intervention.
        </p>
        <p>
          Rotating signing keys without considering token expiration is a common pitfall — if a signing key is
          rotated, tokens signed with the old key will fail validation after the old key is revoked. The fix is
          to wait until all tokens signed with the old key have expired before revoking the old key. For JWTs,
          this means waiting until the longest-lived JWT (typically 24 hours) has expired before revoking the
          old signing key.
        </p>
        <p>
          Not testing rotation procedures is a common operational pitfall — if rotation procedures are not
          tested, they may fail when executed in production, causing service disruption. The fix is to test
          rotation procedures regularly in a staging environment — simulate rotation events and verify that
          applications migrate to the new secret correctly and that the old secret is revoked without service
          disruption.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-world Use Cases
          ============================================================ */}
      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform uses automated secrets rotation for its API keys — HashiCorp Vault
          generates new API keys every 90 days, activates them alongside the old keys, and notifies clients via
          webhook. Clients migrate to the new keys during a 14-day overlap period, and the old keys are revoked
          after the overlap period. The platform monitors secret usage rate (old vs new) and alerts on stale
          secret usage (clients still using old keys after 7 days). The platform achieves PCI-DSS compliance in
          part due to its secrets rotation controls.
        </p>
        <p>
          A financial services company uses automated database credential rotation — AWS Secrets Manager
          generates new database passwords every 90 days, adds them to the database user (keeping the old
          password active), and notifies applications via Lambda function. Applications update their connection
          strings during a 7-day overlap period, and the old password is removed after the overlap period. The
          company monitors rotation success rate and alerts on rotation failures (password generation failed,
          notification failed, application failed to migrate). The company achieves SOC 2 compliance in part
          due to its secrets rotation controls.
        </p>
        <p>
          A healthcare organization uses automated TLS certificate rotation — cert-manager requests new
          certificates from Let&apos;s Encrypt every 60 days (well before the 90-day expiration), installs them on
          the load balancer, and waits for propagation. The old certificates are retired after they expire. The
          organization monitors certificate expiration and alerts on certificates expiring within 30 days. The
          organization achieves HIPAA compliance in part due to its secrets rotation controls.
        </p>
        <p>
          A SaaS platform uses dynamic secrets for its database credentials — HashiCorp Vault generates
          temporary database credentials on-demand (when the application connects to the database) with a 1-hour
          expiration period. The credentials are automatically revoked after expiration, limiting the attacker&apos;s
          access window. The platform monitors dynamic secret usage and alerts on unauthorized secret access
          (credentials accessed from unexpected IP or application). The platform achieves SOC 2 compliance in
          part due to its secrets rotation controls.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions
          ============================================================ */}
      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-5">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: How do you rotate database passwords without disrupting active connections?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use an overlap period: (1) Generate a new database password. (2) ALTER USER to add the new password (keeping the old password active — most databases support multiple passwords per user). (3) Notify applications to update their connection strings. (4) Wait for the overlap period (all applications have migrated to the new password). (5) ALTER USER to remove the old password.
            </p>
            <p>
              Alternatively, use IAM database authentication (AWS RDS, Google Cloud SQL) — applications authenticate using IAM tokens instead of passwords, and tokens expire automatically (typically 15 minutes). IAM database authentication eliminates the need for password rotation — tokens are generated on-demand and expire automatically, limiting the attacker&apos;s access window.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is the difference between scheduled rotation and emergency rotation?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Scheduled rotation occurs on a fixed schedule (every 90 days) — it uses an overlap period where both old and new secrets are valid, ensuring zero-downtime rotation. Emergency rotation occurs when a compromise is detected — it revokes the old secret immediately and generates a new secret, without an overlap period. Emergency rotation may cause brief service disruption but is necessary to terminate the attacker&apos;s access immediately.
            </p>
            <p>
              The recommended approach is both — scheduled rotation for regular rotation, emergency rotation for compromise events. Scheduled rotation ensures that secrets are rotated on schedule, and emergency rotation ensures that compromised secrets are revoked immediately.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you handle JWT signing key rotation?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              JWT signing key rotation requires careful coordination — when a signing key is rotated, tokens signed with the old key will fail validation after the old key is revoked. The rotation process is: (1) Generate a new signing key pair. (2) Publish the new public key (add it to the JWKS endpoint). (3) Sign new tokens with the new key. (4) Accept tokens signed with both old and new keys. (5) Wait until all tokens signed with the old key have expired (typically 24 hours). (6) Revoke the old key (remove it from the JWKS endpoint).
            </p>
            <p>
              The key insight is to wait until all tokens signed with the old key have expired before revoking the old key — this ensures that valid tokens are not invalidated prematurely.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What are dynamic secrets, and when should you use them?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Dynamic secrets are secrets that are generated on-demand and expire after a short period — for example, temporary database credentials generated when the application connects to the database, with a 1-hour expiration period. Dynamic secrets are more secure than static secrets — if compromised, the secret expires quickly, terminating the attacker&apos;s access.
            </p>
            <p>
              Use dynamic secrets for high-security secrets (temporary database credentials, session tokens, API keys for sensitive operations) — they limit the attacker&apos;s access window and reduce the risk of long-term compromise. Use static secrets for most secrets (API keys, database passwords) — they are simpler to implement and manage.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you monitor secrets rotation for compliance?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Monitor rotation events — track the rotation success rate (percentage of successful rotations), secret usage rate (percentage of requests using old vs new secret), and stale secret usage rate (applications still using old secret after overlap period). Alert on rotation failures, stale secret usage, and unauthorized secret access.
            </p>
            <p>
              Audit all rotation events — log secret generation, activation, and retirement, including timestamp, secret type, rotation reason (scheduled, emergency), and applications notified. Audit logs should be immutable and retained for the compliance period (1-7 years). Regularly review audit logs to verify that secrets are rotated on schedule and that rotation events are properly executed.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.hashicorp.com/vault/docs/secrets" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              HashiCorp Vault: Dynamic Secrets
            </a> — On-demand secret generation and rotation.
          </li>
          <li>
            <a href="https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              AWS Secrets Manager: Rotation
            </a> — Automated secrets rotation with Lambda.
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Secrets Management Cheat Sheet
            </a> — Secrets rotation best practices.
          </li>
          <li>
            <a href="https://www.pcidssguide.com/pci-dss-requirement-3-6-4/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              PCI-DSS Requirement 3.6.4: Key Rotation
            </a> — 90-day rotation requirement.
          </li>
          <li>
            <a href="https://www.vaultproject.io/docs/secrets/databases" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Vault: Database Secrets Engine
            </a> — Dynamic database credential generation.
          </li>
          <li>
            <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              AWS RDS: IAM Database Authentication
            </a> — Passwordless database authentication.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}