"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-secrets-management",
  title: "Secrets Management",
  description: "Comprehensive guide to secrets management — secret storage, rotation, access control, secret injection, audit logging, and secrets testing for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "secrets-management",
  wordCount: 5800,
  readingTime: 25,
  lastUpdated: "2026-04-11",
  tags: ["backend", "nfr", "secrets-management", "vault", "rotation", "access-control", "encryption"],
  relatedTopics: ["authentication-infrastructure", "compliance-auditing", "disaster-recovery-strategy", "schema-governance"],
};

export default function SecretsManagementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Secrets management</strong> is the practice of securely storing, distributing,
          rotating, and auditing access to secrets (passwords, API keys, certificates, encryption
          keys, tokens). Secrets are the credentials that services use to authenticate with each
          other and with external services — if secrets are compromised, attackers can access
          databases, APIs, and infrastructure. Secrets management is a critical non-functional
          requirement for any system that handles sensitive data or integrates with external services.
        </p>
        <p>
          Secrets management involves several challenges — secrets must be stored securely (encrypted
          at rest), distributed securely (encrypted in transit, access-controlled), rotated regularly
          (to limit the impact of compromised secrets), and audited (who accessed which secret, when,
          and why). Traditional secrets management (storing secrets in configuration files, environment
          variables, or source code) is insecure — secrets are exposed to anyone with access to the
          configuration, and rotation is manual and error-prone.
        </p>
        <p>
          For staff and principal engineer candidates, secrets management architecture demonstrates
          understanding of security fundamentals, the ability to design secrets management systems
          that scale with the organization, and the maturity to ensure that secrets are rotated
          regularly and access is audited. Interviewers expect you to design secrets management
          strategies that use dedicated secrets management tools (HashiCorp Vault, AWS Secrets
          Manager, GCP Secret Manager), implement automated secret rotation, enforce least-privilege
          access, and audit secret access for compliance.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Distinction: Secrets vs Configuration</h3>
          <p>
            <strong>Secrets</strong> are sensitive credentials that must be protected (passwords, API keys, certificates, encryption keys). <strong>Configuration</strong> is non-sensitive settings that can be stored in plaintext (feature flags, endpoint URLs, timeouts).
          </p>
          <p className="mt-3">
            Secrets require encryption at rest, access control, rotation, and audit logging. Configuration does not require these protections. Never store secrets in configuration files, environment variables, or source code — use a dedicated secrets management tool.
          </p>
        </div>

        <p>
          A mature secrets management architecture includes: a dedicated secrets management tool
          (Vault, AWS Secrets Manager, GCP Secret Manager) for secure storage and distribution,
          automated secret rotation (to limit the impact of compromised secrets), least-privilege
          access control (services can only access the secrets they need), and audit logging
          (who accessed which secret, when, and why).
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding secrets management requires grasping several foundational concepts about
          secret storage, rotation, access control, and audit logging.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Secret Storage and Encryption</h3>
        <p>
          Secrets must be encrypted at rest (using AES-256 encryption) and in transit (using TLS).
          Dedicated secrets management tools (Vault, AWS Secrets Manager, GCP Secret Manager) encrypt
          secrets at rest using encryption keys managed by a key management service (AWS KMS, GCP KMS,
          HashiCorp Transit). The encryption keys are separate from the secrets — even if the secrets
          storage is compromised, the secrets cannot be decrypted without the encryption keys.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Secret Rotation</h3>
        <p>
          Secret rotation is the process of regularly changing secrets to limit the impact of
          compromised secrets. Rotation frequency depends on the secret type — API keys should be
          rotated every 90 days, database passwords every 30 days, and certificates before they
          expire. Automated secret rotation is essential — manual rotation is error-prone and often
          skipped. Secrets management tools support automated rotation — they generate new secrets,
          update the dependent services, and deactivate the old secrets.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Access Control and Least Privilege</h3>
        <p>
          Access to secrets should be restricted to the minimum necessary — each service should only
          have access to the secrets it needs (least privilege). Access control is enforced through
          policies — a policy defines which secrets a service can access, under what conditions
          (from which IP, at what time), and for how long (short-lived tokens). Short-lived tokens
          (TTL of 1 hour) reduce the impact of compromised tokens — if a token is compromised, it
          expires within an hour.
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Secrets management architecture spans secret storage, secret distribution, secret rotation,
          access control, and audit logging.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/secrets-lifecycle.svg"
          alt="Secrets Management Architecture"
          caption="Secrets Management — showing secret lifecycle, storage, rotation, and access control"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Secret Distribution Flow</h3>
        <p>
          When a service starts, it authenticates with the secrets management tool (using IAM roles,
          service accounts, or authentication tokens) and requests the secrets it needs. The secrets
          management tool verifies the service&apos;s identity, checks the access policy, and returns
          the secrets if the service is authorized. The secrets are delivered over TLS and are stored
          in the service&apos;s memory (not on disk). The secrets are refreshed periodically (before
          they expire) by re-authenticating with the secrets management tool.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Secret Rotation Flow</h3>
        <p>
          Secret rotation is automated — the secrets management tool generates a new secret, updates
          the dependent services (database, API, external service), verifies that the new secret works,
          and deactivates the old secret. The rotation process is atomic — if the new secret does not
          work, the rotation is rolled back and the old secret remains active. The rotation process
          is logged for audit — who rotated the secret, when, and whether it succeeded.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/secrets-management-deep-dive.svg"
          alt="Secrets Management Deep Dive"
          caption="Secrets Deep Dive — showing rotation flow, access control, and audit logging"
        />

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/secret-rotation-workflow.svg"
          alt="Secret Rotation Workflow"
          caption="Secret Rotation — showing automated rotation, verification, and rollback"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-Offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Approach</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Environment Variables</strong></td>
              <td className="p-3">
                Simple to implement. No additional infrastructure. Supported by all platforms.
              </td>
              <td className="p-3">
                Exposed to processes with same user. No rotation. No audit logging. Not secure.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Configuration Files</strong></td>
              <td className="p-3">
                Easy to manage. Version controlled. Human-readable.
              </td>
              <td className="p-3">
                Secrets in version control (if not encrypted). No rotation. No access control.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Secrets Manager (Vault, AWS SM)</strong></td>
              <td className="p-3">
                Encrypted at rest. Access control. Automated rotation. Audit logging. Short-lived tokens.
              </td>
              <td className="p-3">
                Additional infrastructure. Learning curve. Operational overhead. Cost.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>KMS-Encrypted Secrets</strong></td>
              <td className="p-3">
                Encrypted at rest. Key management service integration. Programmatic access.
              </td>
              <td className="p-3">
                Requires custom tooling. No built-in rotation. No access control (without custom implementation).
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Use Dedicated Secrets Management Tools</h3>
        <p>
          Never store secrets in environment variables, configuration files, or source code — use a
          dedicated secrets management tool (HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager).
          Secrets management tools provide encryption at rest, access control, automated rotation,
          and audit logging — features that are essential for secure secrets management and difficult
          to implement correctly from scratch.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rotate Secrets Regularly</h3>
        <p>
          Rotate secrets regularly to limit the impact of compromised secrets — API keys every 90
          days, database passwords every 30 days, certificates before they expire. Automated secret
          rotation is essential — manual rotation is error-prone and often skipped. Secrets management
          tools support automated rotation — they generate new secrets, update the dependent services,
          and deactivate the old secrets.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enforce Least-Privilege Access</h3>
        <p>
          Each service should only have access to the secrets it needs — no more, no less. Enforce
          least-privilege access through policies — a policy defines which secrets a service can
          access, under what conditions, and for how long. Use short-lived tokens (TTL of 1 hour)
          to reduce the impact of compromised tokens — if a token is compromised, it expires within
          an hour.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Audit Secret Access</h3>
        <p>
          Log all secret access — who accessed which secret, when, and from where. Audit logs enable
          detection of unauthorized access (a service accessing secrets it should not have access to)
          and compliance reporting (who accessed production secrets, when). Audit logs should be stored
          in a separate, tamper-evident system to prevent attackers from modifying audit logs.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Secrets in Source Code</h3>
        <p>
          Storing secrets in source code (hardcoded API keys, passwords in configuration files) is
          the most common and dangerous secrets management pitfall — source code is often stored in
          version control systems (GitHub, GitLab) that are accessible to many developers, and secrets
          in source code are difficult to rotate (every occurrence must be updated). Use pre-commit
          hooks to detect secrets in source code (git-secrets, detect-secrets), and use secrets
          management tools to distribute secrets at runtime.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Overly Permissive Access Policies</h3>
        <p>
          Access policies that grant access to all secrets (instead of specific secrets) violate
          least-privilege — if a service is compromised, the attacker has access to all secrets.
          Enforce least-privilege access — each service should only have access to the secrets it
          needs. Use secrets management tools with fine-grained access control (path-based policies,
          role-based access control) to enforce least-privilege access.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Not Rotating Secrets</h3>
        <p>
          Secrets that are never rotated are a security risk — if a secret is compromised, the
          attacker has indefinite access. Rotate secrets regularly — API keys every 90 days, database
          passwords every 30 days, certificates before they expire. Automated secret rotation is
          essential — manual rotation is error-prone and often skipped.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Not Auditing Secret Access</h3>
        <p>
          Without audit logging, unauthorized secret access goes undetected — a compromised service
          can access secrets without anyone knowing. Log all secret access — who accessed which
          secret, when, and from where. Store audit logs in a separate, tamper-evident system to
          prevent attackers from modifying audit logs.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">HashiCorp — Vault Secrets Management</h3>
        <p>
          HashiCorp Vault is the industry-standard secrets management tool — it stores secrets
          encrypted at rest, provides fine-grained access control, supports automated secret
          rotation, and logs all secret access. Vault uses short-lived tokens (TTL of 1 hour) to
          reduce the impact of compromised tokens, and supports dynamic secrets (secrets generated
          on-demand with automatic expiration). Vault is used by thousands of organizations to
          manage secrets at scale.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">AWS — Secrets Manager for Automated Rotation</h3>
        <p>
          AWS Secrets Manager provides automated secret rotation for RDS databases, Redshift
          clusters, and DocumentDB clusters — it generates new passwords, updates the database,
          and deactivates the old password. AWS Secrets Manager supports custom rotation Lambdas
          for applications that need custom rotation logic. AWS Secrets Manager is integrated with
          IAM for access control and CloudTrail for audit logging.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Netflix — Conductor for Secrets Workflow</h3>
        <p>
          Netflix uses Conductor (workflow orchestration) for secrets management workflows —
          secret generation, distribution, rotation, and audit logging are orchestrated as workflow
          steps. Netflix&apos;s secrets management workflow ensures that secrets are rotated regularly,
          distributed securely to dependent services, and audited for compliance. Netflix&apos;s
          secrets management process is fully automated — no manual intervention is required for
          secret rotation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Stripe — Dynamic Database Credentials</h3>
        <p>
          Stripe uses dynamic database credentials — instead of static database passwords, each
          service requests a short-lived database credential from the secrets management tool. The
          credential is valid for 1 hour and is automatically revoked after expiration. Dynamic
          credentials reduce the impact of compromised credentials — if a credential is compromised,
          it expires within an hour. Stripe&apos;s dynamic credentials are managed by Vault with
          database secrets engine.
        </p>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>
        <p>
          Secrets management is a security control — it protects secrets from unauthorized access, but the secrets management system itself must be secured.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Secrets Management Security</h3>
          <ul className="space-y-2">
            <li>
              <strong>Secrets Management Tool Security:</strong> The secrets management tool is a high-value target — if compromised, all secrets are exposed. Mitigation: encrypt secrets at rest with KMS-managed keys, restrict access to the secrets management tool, monitor access patterns, conduct regular security audits, use hardware security modules (HSM) for key management.
            </li>
            <li>
              <strong>Secret Distribution Security:</strong> Secrets are transmitted from the secrets management tool to services — if the transmission is intercepted, secrets are exposed. Mitigation: use TLS for all secret transmissions, use mutual TLS (mTLS) for service-to-service authentication, verify service identity before distributing secrets.
            </li>
            <li>
              <strong>Secret Rotation Security:</strong> Secret rotation must be atomic — if the new secret fails, the old secret must remain active. Mitigation: test new secrets before deactivating old secrets, implement rollback for failed rotations, monitor rotation success rate, alert on rotation failures.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Testing Strategies */}
      <section>
        <h2>Testing Strategies</h2>
        <p>
          Secrets management must be validated through systematic testing — access control, rotation, audit logging, and failure handling must all be tested.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Secrets Management Testing</h3>
          <ul className="space-y-2">
            <li>
              <strong>Access Control Test:</strong> Request a secret with authorized and unauthorized identities. Verify that authorized identities receive the secret and unauthorized identities are rejected. Verify that least-privilege is enforced (services can only access their own secrets).
            </li>
            <li>
              <strong>Rotation Test:</strong> Trigger secret rotation and verify that the new secret is generated, distributed to dependent services, and the old secret is deactivated. Verify that services can authenticate with the new secret and that the old secret no longer works.
            </li>
            <li>
              <strong>Audit Logging Test:</strong> Access a secret and verify that the access is logged with the correct identity, timestamp, and secret path. Verify that audit logs are stored in a tamper-evident system and cannot be modified.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Secrets Management Readiness Checklist</h3>
          <ul className="space-y-2">
            <li>✓ Dedicated secrets management tool deployed (Vault, AWS SM, GCP SM)</li>
            <li>✓ Secrets encrypted at rest with KMS-managed keys</li>
            <li>✓ Access control enforced with least-privilege policies</li>
            <li>✓ Automated secret rotation configured for all secret types</li>
            <li>✓ Short-lived tokens (TTL ≤ 1 hour) for service authentication</li>
            <li>✓ Audit logging enabled for all secret access</li>
            <li>✓ Audit logs stored in tamper-evident system</li>
            <li>✓ No secrets in source code, environment variables, or configuration files</li>
            <li>✓ Pre-commit hooks detect secrets in code changes</li>
            <li>✓ Secrets management testing included in CI/CD pipeline</li>
          </ul>
        </div>
      </section>

      {/* Section 10: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.vaultproject.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              HashiCorp Vault — Secrets Management
            </a>
          </li>
          <li>
            <a href="https://aws.amazon.com/secrets-manager/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              AWS Secrets Manager — Automated Secret Rotation
            </a>
          </li>
          <li>
            <a href="https://cloud.google.com/secret-manager" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GCP Secret Manager — Secrets Management
            </a>
          </li>
          <li>
            <a href="https://netflixtechblog.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Netflix Tech Blog — Secrets Management at Scale
            </a>
          </li>
          <li>
            <a href="https://stripe.com/blog/stripe-infrastructure" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Stripe Engineering — Dynamic Database Credentials
            </a>
          </li>
          <li>
            <a href="https://www.nist.gov/publications/guide-cryptographic-key-management" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              NIST — Cryptographic Key Management Guide
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
