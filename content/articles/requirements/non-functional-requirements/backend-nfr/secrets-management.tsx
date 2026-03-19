"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-secrets-management-extensive",
  title: "Secrets Management",
  description: "Comprehensive guide to secrets management, covering secret storage, rotation, encryption, vault integration, and security best practices for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "secrets-management",
  version: "extensive",
  wordCount: 9000,
  readingTime: 36,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "security", "secrets", "encryption", "vault", "key-management"],
  relatedTopics: ["authentication-infrastructure", "authorization-model", "rate-limiting", "compliance-auditing"],
};

export default function SecretsManagementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Secrets</strong> are sensitive credentials that grant access to systems: API keys,
          database passwords, encryption keys, OAuth tokens, and certificates. <strong>Secrets Management</strong>
          is the practice of securely storing, accessing, rotating, and auditing these credentials.
        </p>
        <p>
          Poor secrets management leads to breaches. Hardcoded credentials in source code, shared via
          chat, or stored in plaintext are common attack vectors.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Secrets Should Never Be Static</h3>
          <p>
            Long-lived secrets are compromised secrets. Implement automatic rotation, short-lived credentials,
            and just-in-time access to minimize blast radius of any single compromise.
          </p>
        </div>
      </section>

      <section>
        <h2>Secrets Lifecycle Management</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/secrets-lifecycle.svg"
          alt="Secrets Lifecycle"
          caption="Secrets Lifecycle — showing generation, storage, distribution, and rotation cycle, anti-patterns to avoid, secret types, and management tools comparison"
        />
        <p>
          Proper secrets management follows a lifecycle approach:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Generation</h3>
        <p>
          Use cryptographically secure random generation:
        </p>
        <ul>
          <li>256-bit keys for symmetric encryption.</li>
          <li>2048-bit minimum for RSA keys.</li>
          <li>Use /dev/urandom or equivalent.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Storage</h3>
        <p>
          Store secrets encrypted at rest:
        </p>
        <ul>
          <li>Use dedicated secrets manager.</li>
          <li>Encrypt with KMS-managed keys.</li>
          <li>Access controlled via IAM.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Distribution</h3>
        <p>
          Distribute secrets securely to applications:
        </p>
        <ul>
          <li>Use TLS/mTLS for transport.</li>
          <li>Inject at runtime, not build time.</li>
          <li>Minimize secret scope per service.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rotation</h3>
        <p>
          Rotate secrets regularly:
        </p>
        <ul>
          <li>Every 90 days for standard secrets.</li>
          <li>Immediately on suspected compromise.</li>
          <li>Use overlapping validity periods.</li>
        </ul>
      </section>

      <section>
        <h2>Secrets Storage</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/secrets-management.svg"
          alt="Secrets Management Architecture"
          caption="Secrets Management — showing secrets retrieval flow, rotation strategy with overlap period, best practices, and types of secrets"
        />
        <p>
          Where and how to store secrets:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Secrets Management Services</h3>
        <p>
          <strong>Examples:</strong> HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, GCP Secret Manager.
        </p>
        <p>
          <strong>Features:</strong>
        </p>
        <ul>
          <li>Encrypted storage with access controls.</li>
          <li>Audit logging of all access.</li>
          <li>Automatic rotation.</li>
          <li>Short-lived dynamic credentials.</li>
          <li>Integration with cloud IAM.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Environment Variables</h3>
        <p>
          Store secrets in environment variables, injected at deployment time.
        </p>
        <p>
          <strong>Pros:</strong> Simple, widely supported, not in code.
        </p>
        <p>
          <strong>Cons:</strong> Hard to rotate, visible in process listings, no audit trail.
        </p>
        <p>
          <strong>Best practice:</strong> Use for non-critical secrets, combine with secrets manager for rotation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">What NOT to Do</h3>
        <ul>
          <li>✗ Never commit secrets to version control.</li>
          <li>✗ Never store secrets in plaintext config files.</li>
          <li>✗ Never share secrets via chat or email.</li>
          <li>✗ Never log secrets (even accidentally).</li>
          <li>✗ Never use default credentials.</li>
        </ul>
      </section>

      <section>
        <h2>Secrets Management Deep Dive</h2>
        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/secrets-management-deep-dive.svg"
          alt="Secrets Management Deep Dive"
          caption="Secrets Management Deep Dive — showing storage options, rotation strategies, access control best practices"
        />
        <p>
          Advanced secrets management concepts:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Secrets Storage Options Comparison</h3>
        <p>
          Different approaches to storing secrets, ranked by security:
        </p>
        <ul>
          <li>
            <strong>Dedicated Secrets Managers (Best):</strong> HashiCorp Vault, AWS Secrets Manager,
            Azure Key Vault, GCP Secret Manager. Provide encryption, access control, audit logging,
            and automatic rotation.
          </li>
          <li>
            <strong>Environment Variables (Common):</strong> Injected at runtime via Kubernetes secrets,
            Docker secrets, or orchestration tools. Simple but lacks audit trail and rotation support.
          </li>
          <li>
            <strong>Encrypted Config Files (Good for GitOps):</strong> SOPS, git-crypt, age-encryption.
            Secrets stored encrypted in version control, decrypted at deployment time.
          </li>
          <li>
            <strong>KMS Encryption (Foundation):</strong> Use cloud KMS to encrypt secrets at rest.
            Application decrypts using IAM roles. Requires secure key management.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Secret Rotation Strategies</h3>
        <p>
          Different approaches to rotating secrets:
        </p>
        <ul>
          <li>
            <strong>Time-Based Rotation:</strong> Rotate every N days (typically 90 days for standard
            secrets, 30 days for high-security). Automated via scheduled jobs or secrets manager.
          </li>
          <li>
            <strong>Event-Based Rotation:</strong> Rotate on specific events: suspected compromise,
            employee departure, security incident, compliance audit.
          </li>
          <li>
            <strong>Dynamic Secrets:</strong> Short-lived credentials generated on-demand.
            Vault database secrets, AWS STS temporary credentials. Auto-expire, no rotation needed.
          </li>
          <li>
            <strong>Rolling Rotation:</strong> Overlap validity periods. Old secret remains valid
            while new secret is deployed. Zero downtime rotation.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Secrets Access Control</h3>
        <p>
          Best practices for controlling access to secrets:
        </p>
        <ul>
          <li>
            <strong>Least Privilege:</strong> Services only access secrets they need.
            Use service-specific secrets, not shared credentials.
          </li>
          <li>
            <strong>Audit Logging:</strong> Log all secret access: who, what, when.
            Alert on unusual access patterns.
          </li>
          <li>
            <strong>Service Accounts:</strong> Each service has its own identity and secrets.
            Enables granular access control and audit trails.
          </li>
          <li>
            <strong>Secret Scanning:</strong> Scan code repositories, CI/CD logs, container images
            for accidentally committed secrets. Use tools like git-secrets, truffleHog.
          </li>
        </ul>
      </section>

      <section>
        <h2>Secret Rotation</h2>
        <p>
          Regular rotation limits the window of opportunity if a secret is compromised.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rotation Strategies</h3>
        <p>
          <strong>Scheduled rotation:</strong> Rotate every N days automatically.
        </p>
        <p>
          <strong>On-demand rotation:</strong> Rotate when compromise suspected.
        </p>
        <p>
          <strong>Per-deployment rotation:</strong> Generate new secrets for each deployment.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rotation Without Downtime</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Generate new secret.</li>
          <li>Store both old and new secrets (overlap period).</li>
          <li>Update clients to use new secret.</li>
          <li>After overlap period, remove old secret.</li>
        </ol>
        <p>
          <strong>Key insight:</strong> Support multiple valid secrets during transition.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design a secrets management system for a microservices architecture with 50 services. How do you handle rotation?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Storage:</strong> Use dedicated secrets manager (HashiCorp Vault, AWS Secrets Manager). Each service has its own identity.</li>
                <li><strong>Access:</strong> IAM policies control which secrets each service can access. Least privilege principle.</li>
                <li><strong>Rotation:</strong> (1) Automated rotation every 90 days. (2) Generate new secret, store alongside old. (3) Notify services via webhook. (4) Services fetch new secret. (5) Revoke old secret after grace period.</li>
                <li><strong>Database credentials:</strong> Use dynamic secrets (Vault database backend). Short-lived credentials (1 hour TTL). Auto-revoke on lease expiry.</li>
                <li><strong>Audit:</strong> Log all secret access. Alert on unusual access patterns.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Compare HashiCorp Vault, AWS Secrets Manager, and environment variables. When would you use each?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>HashiCorp Vault:</strong> ✓ Open source, multi-cloud, dynamic secrets, encryption as a service. ✗ Operational complexity, self-managed.</li>
                <li><strong>AWS Secrets Manager:</strong> ✓ Managed service, automatic RDS rotation, IAM integration. ✗ AWS-only, cost per secret.</li>
                <li><strong>Environment variables:</strong> ✓ Simple, no dependencies. ✗ No audit trail, hard to rotate, visible in process list.</li>
                <li><strong>Use Vault when:</strong> Multi-cloud, need dynamic secrets, encryption as a service.</li>
                <li><strong>Use AWS SM when:</strong> All-in on AWS, want managed service, use RDS.</li>
                <li><strong>Use env vars when:</strong> Non-sensitive config, local development only.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. Your database password was committed to GitHub. What is your incident response?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Immediate (within minutes):</strong> (1) Rotate database password immediately. (2) Update all services with new password. (3) Revoke any active sessions using old password.</li>
                <li><strong>Assessment:</strong> (1) Check database audit logs for unauthorized access. (2) Determine exposure window. (3) Identify what data was accessible.</li>
                <li><strong>Remediation:</strong> (1) Remove secret from git history (BFG Repo-Cleaner). (2) Force push to overwrite history. (3) Notify GitHub to scan for leaked secrets.</li>
                <li><strong>Prevention:</strong> (1) Pre-commit hooks (git-secrets). (2) GitHub secret scanning. (3) CI/CD secret scanning.</li>
                <li><strong>Documentation:</strong> Write incident report. Document lessons learned. Update runbooks.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. How do you implement automatic secret rotation without downtime?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Overlap period:</strong> Store both old and new secrets. Accept both during transition (24-48 hours).</li>
                <li><strong>Rotation process:</strong> (1) Generate new secret. (2) Store in secrets manager. (3) Notify services via webhook/pub-sub. (4) Services fetch new secret on next request. (5) After overlap, revoke old secret.</li>
                <li><strong>Database credentials:</strong> Use connection pooling with credential refresh. Pool fetches new credentials before old expire.</li>
                <li><strong>TLS certificates:</strong> Mount both old and new certificates. Services reload on SIGHUP. Use service mesh for automatic mTLS rotation.</li>
                <li><strong>Monitoring:</strong> Alert on rotation failures. Track secret age, alert before expiry.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. Design a system for short-lived database credentials. What are the benefits and challenges?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Implementation:</strong> Vault database secrets engine. Generates unique DB user per service with TTL (1 hour).</li>
                <li><strong>Benefits:</strong> (1) Automatic credential rotation. (2) Limited blast radius (compromised credential expires quickly). (3) Audit trail (which service accessed when). (4) No long-lived credentials to manage.</li>
                <li><strong>Challenges:</strong> (1) Database must support many users (connection limits). (2) Latency overhead (fetch credential before first query). (3) Credential caching needed for performance.</li>
                <li><strong>Solution:</strong> Cache credentials in memory with TTL. Refresh before expiry. Use connection pooling with credential refresh.</li>
                <li><strong>Best for:</strong> Microservices with many database users, high-security environments.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. How do you audit and monitor secrets access? What alerts do you configure?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Audit logging:</strong> Log all secret access (who, what, when, from where). Store in immutable audit log.</li>
                <li><strong>Alerts:</strong> (1) Unusual access patterns (service accessing secrets it doesn&apos;t normally use). (2) Access from unusual IP/location. (3) High volume of secret reads. (4) Failed access attempts.</li>
                <li><strong>Monitoring:</strong> Dashboard showing secret access by service, by secret type. Track secret age, alert before expiry.</li>
                <li><strong>Regular audits:</strong> Quarterly review of secret access patterns. Identify unused secrets, revoke. Verify least privilege.</li>
                <li><strong>Compliance:</strong> Generate compliance reports (SOC 2, HIPAA). Show who accessed what secrets and when.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Secrets Management Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Using dedicated secrets manager (Vault, AWS Secrets Manager)</li>
          <li>✓ No secrets in source code or config files</li>
          <li>✓ Automatic rotation configured</li>
          <li>✓ Access logging and auditing enabled</li>
          <li>✓ Least privilege access (services only access their secrets)</li>
          <li>✓ Encryption at rest and in transit</li>
          <li>✓ Short-lived credentials where possible</li>
          <li>✓ Incident response plan for compromised secrets</li>
          <li>✓ Regular secret audits (unused, old secrets)</li>
          <li>✓ Developer training on secrets handling</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
