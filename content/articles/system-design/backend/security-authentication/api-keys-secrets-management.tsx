"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-api-keys-secrets-management-extensive",
  title: "API Keys & Secrets Management",
  description:
    "Staff-level deep dive into API key lifecycle, secrets storage patterns, rotation strategies, and the operational practice of managing credentials at scale.",
  category: "backend",
  subcategory: "security-authentication",
  slug: "api-keys-secrets-management",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "security", "api-keys", "secrets", "vault", "kms"],
  relatedTopics: ["secrets-rotation", "encryption", "authentication-vs-authorization", "api-security"],
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
          <strong>API keys</strong> are credentials used to authenticate applications (not users) to APIs and services.
          Unlike passwords, which authenticate human users, API keys authenticate software — they identify the calling
          application and authorize it to access specific resources with specific permissions. API keys are the
          foundation of service-to-service authentication, third-party API access, and cloud platform authentication
          (AWS access keys, GCP service account keys, Stripe API keys).
        </p>
        <p>
          <strong>Secrets management</strong> is the practice of securely storing, distributing, rotating, and
          revoking sensitive credentials — API keys, database passwords, TLS private keys, OAuth client secrets, and
          signing keys. Secrets must be protected at rest (encrypted in storage), in transit (transmitted over
          encrypted channels), and in use (accessible only to authorized applications). Poor secrets management is
          the leading cause of cloud security breaches — API keys and credentials committed to public repositories,
          stored in plaintext configuration files, or shared insecurely are routinely discovered and exploited by
          attackers.
        </p>
        <p>
          The evolution of secrets management has progressed from plaintext configuration files (credentials stored
          in .env files, hardcoded in source code) to environment variables (credentials injected at runtime) to
          centralized secrets managers (HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager) that encrypt
          secrets at rest, control access through policies, audit all access, and automate rotation. The centralized
          approach is now the industry standard for production systems, while plaintext and environment variable
          approaches are acceptable only for local development.
        </p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-5">
          <h3 className="text-lg font-semibold mb-3">The API Key Lifecycle</h3>
          <p className="text-muted mb-3">
            <strong>Generation:</strong> API keys are generated using a cryptographically secure random number generator (CSPRNG) with high entropy (256 bits minimum). Keys should include a prefix that identifies the key type and environment (e.g., sk_live_xxx, pk_test_yyy).
          </p>
          <p className="text-muted mb-3">
            <strong>Distribution:</strong> API keys are distributed to applications through secure channels — secrets managers, environment variables injected at deploy time, or secure configuration APIs. Keys should never be committed to version control, shared via email, or exposed in client-side code.
          </p>
          <p className="text-muted mb-3">
            <strong>Usage:</strong> Applications present API keys with each request (typically in the Authorization header or as a query parameter). The server validates the key, enforces scope and rate limits, and logs the request for audit.
          </p>
          <p className="text-muted mb-3">
            <strong>Rotation:</strong> API keys are rotated periodically (every 90 days) or on demand (compromise detection, employee departure). Rotation generates a new key, distributes it to applications, and disables the old key after an overlap period.
          </p>
          <p>
            <strong>Revocation:</strong> API keys are revoked immediately when compromised, no longer needed, or when the associated application is decommissioned. Revocation is immediate — the key is invalidated, and all requests using it are rejected.
          </p>
        </div>
        <p>
          API key security is a shared responsibility — the platform generating the keys must implement secure
          generation, storage, rotation, and revocation, while the applications using the keys must store them
          securely, rotate them on schedule, and report compromise immediately. Breaches occur when either side
          fails — when the platform stores keys insecurely, or when the application exposes them in client-side code
          or public repositories.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          API key generation must use a cryptographically secure random number generator (CSPRNG) with at least
          256 bits of entropy. API keys must be unpredictable — if an attacker can guess or brute force valid API
          keys, the authentication mechanism is broken. API keys should include a prefix that identifies the key
          type (sk for secret key, pk for public key, ak for API key) and the environment (live, test, prod, dev).
          Prefixes enable quick identification of key type and environment in logs, error messages, and security
          alerts. Stripe&apos;s key format (sk_live_xxx, pk_test_yyy) is the industry standard for prefix design.
        </p>
        <p>
          Secrets storage is the mechanism by which API keys and other credentials are stored securely. There are
          three patterns: plaintext files (.env files, configuration files — acceptable only for local development),
          environment variables (injected at runtime — acceptable for simple deployments but not for distributed
          systems), and secrets managers (HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager — the industry
          standard for production systems). Secrets managers encrypt secrets at rest (AES-256), control access
          through policies (which applications can access which secrets), audit all access (who accessed which secret
          when), and automate rotation (generating new secrets and distributing them to applications).
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/api-keys-secrets-management-diagram-1.svg"
          alt="API key lifecycle showing generation, distribution, usage, rotation, and revocation with security best practices"
          caption="API key lifecycle: keys are generated with high entropy, distributed securely, used with rate limiting and auditing, rotated regularly with overlap period, and revoked immediately on compromise."
        />
        <p>
          Scope enforcement is the practice of limiting what each API key can do. API keys should be scoped to
          specific permissions (read:orders, write:users, admin:settings) rather than granted full access. Scope
          enforcement is evaluated by the API gateway or resource server on each request — if the API key does not
          have the required scope for the requested action, the request is denied. Scope enforcement follows the
          principle of least privilege — each key has only the permissions necessary for its function.
        </p>
        <p>
          Key rotation is the process of replacing an existing API key with a new one. Rotation should be automated
          — the secrets manager generates a new key, distributes it to applications, and disables the old key after
          an overlap period (typically 24-48 hours). The overlap period ensures that applications still using the
          old key can continue to function while they update to the new key. Zero-downtime rotation requires that
          both the old and new keys are valid during the overlap period, and that applications can update their
          stored key without restarting.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/api-keys-secrets-management-diagram-2.svg"
          alt="Secrets management architecture showing centralized vault with applications, CI/CD pipelines, and developer tools accessing secrets"
          caption="Secrets management architecture: centralized vault (HashiCorp Vault, AWS Secrets Manager) stores encrypted secrets, applications retrieve secrets via API at startup, CI/CD pipelines inject secrets at deploy time, and developers access secrets via CLI with authentication."
        />
        <p>
          Access control for secrets is critical — not all applications should have access to all secrets. The
          secrets manager should enforce access policies — application A can access database credentials but not
          payment API keys, application B can access payment API keys but not database credentials. Access policies
          should be based on the principle of least privilege — each application has access to only the secrets it
          needs. Access policies should be audited regularly to ensure they are correct and to remove unused access.
        </p>
        <p>
          Audit logging is essential for secrets management — every access to a secret should be logged (who
          accessed which secret, when, from which application). Audit logs enable detection of anomalous access
          patterns (an application accessing secrets it does not normally access, access from unusual IP addresses,
          bulk secret retrieval) that may indicate compromise. Audit logs should be immutable (written to a
          write-once store) and monitored for anomalies.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture and Flow
          ============================================================ */}
      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The secrets management architecture consists of the secrets manager (which stores, encrypts, and controls
          access to secrets), the applications (which retrieve secrets at startup and use them for authentication),
          and the administrators (who manage secrets, configure access policies, and monitor audit logs). The
          secrets manager is the single source of truth for all secrets — applications do not store secrets locally,
          they retrieve them from the secrets manager at startup and cache them in memory.
        </p>
        <p>
          The secret retrieval flow begins with the application starting up. The application authenticates to the
          secrets manager (using its own credentials — instance IAM role, service account, or bootstrap token),
          retrieves the secrets it needs (database credentials, API keys, signing keys), and stores them in memory.
          The application uses the secrets for authentication (presenting API keys with API requests, using database
          credentials to connect to the database). The application does not write secrets to disk or log them — they
          remain in memory for the lifetime of the application.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/api-keys-secrets-management-diagram-3.svg"
          alt="Zero-downtime key rotation showing overlap period and gradual cutover from old key to new key"
          caption="Zero-downtime rotation: new key is generated and distributed during an overlap period where both old and new keys are valid. Applications update to the new key during the overlap period, and the old key is disabled after all applications have updated."
        />
        <p>
          The rotation flow begins with the secrets manager generating a new secret (API key, database password)
          using a CSPRNG. The new secret is stored in the secrets manager alongside the old secret (both are valid
          during the overlap period). The secrets manager notifies applications of the new secret (via webhook,
          polling, or push notification). Applications retrieve the new secret and update their in-memory copy.
          After the overlap period (24-48 hours), the secrets manager disables the old secret, and all requests
          using the old secret are rejected.
        </p>
        <p>
          Emergency rotation is triggered when a secret is compromised — the secrets manager immediately revokes
          the old secret (all requests using it are rejected), generates a new secret, and distributes it to
          applications. Emergency rotation may cause brief service disruption — applications still using the old
          secret will fail until they update to the new secret. The secrets manager should support emergency rotation
          with minimal disruption — the new secret should be available immediately, and applications should be able
          to retrieve it without restarting.
        </p>
        <p>
          Database credential rotation is a special case — unlike API keys (which are used by applications to
          authenticate to external APIs), database credentials are used by applications to authenticate to databases.
          Database credential rotation requires coordination between the secrets manager and the database — the
          secrets manager generates a new credential, the database creates the new user or updates the password, and
          the application updates its connection string. Some databases (AWS RDS, PostgreSQL) support automatic
          credential rotation through integration with secrets managers.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs and Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          Secrets manager versus environment variables is the primary trade-off in secrets storage. Secrets managers
          (HashiCorp Vault, AWS Secrets Manager) encrypt secrets at rest, control access through policies, audit all
          access, and automate rotation — they are the industry standard for production systems. However, they
          introduce a dependency — applications must authenticate to the secrets manager at startup, and if the
          secrets manager is unavailable, applications cannot start. Environment variables are simpler — secrets are
          injected at deploy time, and applications read them from the environment. However, environment variables
          are not encrypted at rest, do not support access policies, do not audit access, and do not automate
          rotation.
        </p>
        <p>
          Automated rotation versus manual rotation is a trade-off between operational complexity and security.
          Automated rotation generates new secrets, distributes them to applications, and disables old secrets
          without human intervention — this eliminates the risk of forgotten rotation and ensures secrets are
          rotated on schedule. However, automated rotation is complex to implement — it requires coordination between
          the secrets manager, applications, and the services that accept the secrets (APIs, databases). Manual
          rotation is simpler — an administrator generates a new secret, distributes it to applications, and disables
          the old secret. However, manual rotation is error-prone — administrators may forget to rotate, or may
          rotate incorrectly, causing service disruption.
        </p>
        <p>
          Short-lived versus long-lived API keys is a trade-off between security and operational overhead.
          Short-lived API keys (hours to days) limit the window of opportunity if a key is compromised — the
          attacker&apos;s access is limited to the key&apos;s short lifetime. However, short-lived keys require frequent
          rotation, which adds operational overhead. Long-lived API keys (months to years) reduce rotation overhead
          but increase the risk — if a key is compromised, the attacker has access for the key&apos;s entire lifetime.
          The recommended approach is short-lived API keys (90 days) with automated rotation — this limits the
          attacker&apos;s window while minimizing operational overhead through automation.
        </p>
        <p>
          Centralized versus decentralized secrets management is a trade-off between control and resilience.
          Centralized secrets management (single secrets manager for all secrets) provides centralized control — all
          secrets are stored, accessed, and audited through a single system. However, it introduces a single point of
          failure — if the secrets manager is unavailable, all applications that depend on it cannot start.
          Decentralized secrets management (each team or application manages its own secrets) eliminates the single
          point of failure but makes it difficult to enforce consistent security practices, audit access, and rotate
          secrets across the organization.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Use a centralized secrets manager (HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager) for all
          production secrets. Secrets managers encrypt secrets at rest, control access through policies, audit all
          access, and automate rotation. Do not store secrets in plaintext files, environment variables, or version
          control — these are insecure and do not support access control, auditing, or rotation.
        </p>
        <p>
          Generate API keys using a CSPRNG with at least 256 bits of entropy. API keys must be unpredictable — if
          an attacker can guess or brute force valid API keys, the authentication mechanism is broken. Include a
          prefix that identifies the key type and environment (sk_live_xxx, pk_test_yyy) for easy identification in
          logs and security alerts.
        </p>
        <p>
          Enforce least-privilege scopes for each API key. Each key should have only the permissions necessary for
          its function — read:orders, write:users, admin:settings — rather than broad permissions (full_access).
          Scope enforcement is evaluated by the API gateway or resource server on each request — if the key does
          not have the required scope, the request is denied.
        </p>
        <p>
          Rotate API keys regularly (every 90 days) using automated rotation. Automated rotation generates new
          keys, distributes them to applications, and disables old keys after an overlap period (24-48 hours).
          Automated rotation eliminates the risk of forgotten rotation and ensures keys are rotated on schedule.
        </p>
        <p>
          Monitor secrets access and alert on anomalous patterns — applications accessing secrets they do not
          normally access, access from unusual IP addresses, bulk secret retrieval, and failed authentication
          attempts to the secrets manager. These patterns indicate compromise or misconfiguration.
        </p>
        <p>
          Implement rate limiting and quotas per API key — this prevents abuse and limits the blast radius if a key
          is compromised. If a key is compromised, the rate limit limits the damage the attacker can do before the
          key is detected and revoked.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Committing API keys to version control is the most common secrets management failure. API keys committed
          to public repositories (GitHub, GitLab) are discovered by attackers within minutes and exploited. The fix
          is to use secrets managers — applications retrieve secrets at startup, and secrets are never stored in
          version control. Additionally, use pre-commit hooks and CI/CD scanning (git-secrets, truffleHog) to
          detect and prevent secrets from being committed.
        </p>
        <p>
          Not rotating API keys is a common operational pitfall. If API keys are never rotated, a compromised key
          remains valid indefinitely, giving the attacker persistent access. The fix is to automate rotation — the
          secrets manager generates new keys, distributes them to applications, and disables old keys on a regular
          schedule (every 90 days).
        </p>
        <p>
          Granting overly broad scopes (full_access) to API keys violates the principle of least privilege and
          increases the blast radius if a key is compromised. The fix is to define granular scopes (read:orders,
          write:users, admin:settings) and assign only the scopes necessary for each key&apos;s function.
        </p>
        <p>
          Not monitoring secrets access is a common security pitfall. Without monitoring, compromised keys go
          undetected — the attacker can use the key for months before it is discovered. The fix is to log all
          secrets access and alert on anomalous patterns (unusual IP addresses, bulk retrieval, access to secrets
          the application does not normally access).
        </p>
        <p>
          Storing secrets in environment variables in production is a common pitfall. Environment variables are not
          encrypted at rest, are visible to any process running on the same machine, and are often logged
          inadvertently (in error messages, stack traces, debug output). The fix is to use secrets managers —
          applications retrieve secrets via authenticated API calls, and secrets are encrypted at rest and in
          transit.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-world Use Cases
          ============================================================ */}
      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform uses AWS Secrets Manager for all production secrets — database credentials,
          Stripe API keys, SendGrid API keys, and signing keys. Applications retrieve secrets at startup using IAM
          roles (no credentials needed — the instance role authenticates to Secrets Manager). Secrets are rotated
          automatically every 90 days, and the platform monitors secrets access and alerts on anomalous patterns.
          The platform has had zero secrets-related breaches since migrating from environment variables to Secrets
          Manager.
        </p>
        <p>
          A financial services company uses HashiCorp Vault for secrets management — API keys, database credentials,
          TLS certificates, and signing keys are all stored in Vault. Vault enforces access policies (application A
          can access database credentials but not payment API keys), audits all access, and automates rotation.
          Database credentials are rotated automatically — Vault generates new credentials, updates the database,
          and notifies applications. The company uses Vault&apos;s dynamic secrets feature — database credentials are
          generated on-demand and expire after 24 hours, eliminating the need for rotation.
        </p>
        <p>
          A SaaS platform uses GCP Secret Manager for secrets management — API keys, OAuth client secrets, and
          signing keys are stored in Secret Manager. Applications retrieve secrets at startup using service account
          authentication. The platform enforces least-privilege scopes for each API key (read:documents,
          write:documents, admin:settings) and monitors API key usage for anomalous patterns. The platform rotates
          API keys every 90 days using automated rotation — new keys are generated, distributed to applications, and
          old keys are disabled after a 48-hour overlap period.
        </p>
        <p>
          A technology company uses a hybrid approach — AWS Secrets Manager for production secrets, environment
          variables for local development, and Vault for dynamic database credentials. Production applications
          retrieve secrets from Secrets Manager using IAM roles, local development uses .env files (which are
          gitignored and never committed), and database credentials are generated dynamically by Vault and expire
          after 24 hours. The company monitors secrets access across all environments and alerts on anomalous
          patterns.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions
          ============================================================ */}
      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-5">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: How do you rotate API keys without causing service disruption?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use zero-downtime rotation with an overlap period. Generate a new key, store it alongside the old key (both are valid), distribute the new key to applications, and after the overlap period (24-48 hours), disable the old key. During the overlap period, both keys are valid, so applications still using the old key can continue to function while they update to the new key.
            </p>
            <p>
              Automated rotation is essential — the secrets manager generates the new key, notifies applications (via webhook, polling, or push notification), applications retrieve the new key and update their in-memory copy, and the secrets manager disables the old key after the overlap period. This ensures rotation happens on schedule without human intervention.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is the difference between a secrets manager and a key management service (KMS)?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              A secrets manager (HashiCorp Vault, AWS Secrets Manager) stores and manages secrets — API keys, database passwords, OAuth client secrets. It encrypts secrets at rest, controls access through policies, audits all access, and automates rotation. Applications retrieve secrets from the secrets manager at startup.
            </p>
            <p>
              A KMS (AWS KMS, GCP Cloud KMS) manages cryptographic keys — encryption keys used to encrypt and decrypt data. KMS does not store secrets (API keys, passwords) — it stores encryption keys and provides cryptographic operations (encrypt, decrypt, sign, verify). Secrets managers use KMS to encrypt secrets at rest — the secrets manager stores the encrypted secret, and the KMS manages the encryption key used to encrypt and decrypt it.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you handle secrets for local development?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              For local development, use .env files (gitignored, never committed to version control) with dummy or scoped-down credentials. Developers should not have access to production secrets — use separate development environments with separate secrets. Alternatively, use a development secrets manager (local Vault instance, Docker-based Secrets Manager) that provides secrets to local applications via the same API as production.
            </p>
            <p>
              For CI/CD pipelines, inject secrets at deploy time using the CI/CD platform&apos;s secrets management (GitHub Actions secrets, GitLab CI variables, Jenkins credentials). Secrets should be injected as environment variables during the deployment process and should not be stored in the CI/CD configuration or logs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What are dynamic secrets, and when should you use them?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Dynamic secrets are credentials generated on-demand by the secrets manager and expire after a defined period (e.g., 24 hours). For example, Vault can generate a database credential on-demand when an application needs to connect to the database, and the credential expires after 24 hours. Dynamic secrets eliminate the need for rotation — the credential expires automatically, and the application requests a new credential when needed.
            </p>
            <p>
              Dynamic secrets are ideal for database credentials, cloud IAM roles, and short-lived API keys. They are less suitable for long-lived API keys (third-party API access) and signing keys (JWT signing, TLS certificates), which require stable, long-term credentials.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you detect and respond to a compromised API key?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Detection: Monitor API key usage for anomalous patterns — unusual IP addresses, spike in request volume, access to resources the key does not normally access, scope escalation, and failed authentication attempts. Set up alerts for these patterns and investigate immediately.
            </p>
            <p>
              Response: Immediately revoke the compromised key (all requests using it are rejected), generate a new key, distribute it to applications, and investigate the scope of the compromise (what did the attacker access, what data was exposed, what actions were taken). After the investigation, rotate all potentially compromised keys, not just the one that was detected as compromised.
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
            <a href="https://developer.hashicorp.com/vault/docs" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              HashiCorp Vault Documentation
            </a> — Comprehensive secrets management and dynamic secrets.
          </li>
          <li>
            <a href="https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              AWS Secrets Manager Documentation
            </a> — AWS-native secrets management and rotation.
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Secrets Management Cheat Sheet
            </a> — Best practices for secrets management.
          </li>
          <li>
            <a href="https://stripe.com/docs/keys" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Stripe: Secure API Keys
            </a> — Stripe&apos;s API key design with prefixes and scoping.
          </li>
          <li>
            <a href="https://cloud.google.com/secret-manager/docs" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GCP Secret Manager Documentation
            </a> — Google Cloud&apos;s secrets management service.
          </li>
          <li>
            <a href="https://www.vaultproject.io/docs/secrets/databases" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Vault Dynamic Database Secrets
            </a> — On-demand credential generation with automatic expiration.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}