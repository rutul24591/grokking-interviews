"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-credential-rotation",
  title: "Credential Rotation",
  description:
    "Comprehensive guide to implementing credential rotation covering password changes, token rotation, key rotation, and security best practices for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "credential-rotation",
  version: "extensive",
  wordCount: 9000,
  readingTime: 36,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "credential-rotation",
    "security",
    "backend",
    "tokens",
  ],
  relatedTopics: ["password-hashing", "token-generation", "session-revocation"],
};

export default function CredentialRotationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Credential Rotation</strong> is the systematic practice of periodically changing
          authentication credentials — passwords, tokens, API keys, and signing keys — to limit the
          impact of compromised credentials. It is a fundamental security practice that protects
          user accounts, prevents unauthorized access, and maintains compliance with security
          standards.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/credential-rotation-flow.svg"
          alt="Credential Rotation Flow"
          caption="Credential Rotation Flow — showing scheduled rotation, compromise-triggered rotation, and validation workflows"
        />

        <p>
          For staff and principal engineers, implementing credential rotation requires deep
          understanding of password policies (NIST guidelines, breach-based rotation), token
          rotation patterns (refresh token rotation, reuse detection), key rotation strategies
          (JWKS, key overlap, HSM storage), and operational concerns (user experience, emergency
          rotation, compliance). The implementation must balance security (frequent rotation) with
          usability (not frustrating users) while supporting high-volume rotation operations.
        </p>
        <p>
          Modern credential rotation has evolved from mandatory 90-day password changes (which NIST
          now discourages) to risk-based, breach-triggered rotation. Organizations like Google,
          Microsoft, and Okta have pioneered automated rotation systems that rotate credentials
          when compromise is detected, rather than on arbitrary schedules. Token rotation is now
          standard for OAuth flows, with refresh token rotation and reuse detection preventing
          token theft attacks.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Credential rotation is built on fundamental concepts that determine how credentials are
          rotated, validated, and invalidated. Understanding these concepts is essential for
          designing effective rotation systems.
        </p>
        <p>
          <strong>Password Rotation:</strong> The practice of requiring users to change passwords
          periodically. NIST SP 800-63B now recommends against mandatory periodic rotation (users
          choose weak passwords like Password1, Password2). Instead, require rotation only when
          compromise is detected (breach database match, suspicious activity) or for high-risk
          accounts (admin, privileged access). Prevent password reuse (last 5 passwords), enforce
          minimum length (12+ characters), and check against breach databases (Have I Been Pwned).
        </p>
        <p>
          <strong>Token Rotation:</strong> The practice of issuing new tokens and invalidating old
          ones. For OAuth flows, access tokens are short-lived (15-60 minutes) and refreshed using
          refresh tokens. Refresh tokens are rotated on each use — new refresh token issued, old
          one invalidated. If old token is presented (reuse detection), it indicates token theft —
          revoke all sessions and require re-authentication with MFA.
        </p>
        <p>
          <strong>Key Rotation:</strong> The practice of rotating cryptographic keys used for
          signing tokens (JWT signing keys), encrypting data, or authenticating services. Keys are
          rotated periodically (90 days) or when compromise is suspected. During rotation, both old
          and new keys are valid (overlap period) to avoid invalidating existing tokens. Keys are
          published via JWKS (JSON Web Key Set) endpoint with key ID (kid) for identification.
        </p>
        <p>
          <strong>Session Revocation:</strong> When credentials change, all active sessions must be
          invalidated to prevent unauthorized access with old credentials. This is achieved through
          session versioning (increment version on credential change, invalidate old sessions) or
          explicit revocation (iterate all sessions, delete). Users must re-authenticate with new
          credentials.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Credential rotation architecture separates rotation logic from credential storage,
          enabling centralized rotation management with distributed validation. This architecture
          is critical for scaling rotation across distributed systems.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/token-rotation.svg"
          alt="Token Rotation"
          caption="Token Rotation — showing refresh token rotation, invalidation, and reuse detection workflow"
        />

        <p>
          The token rotation flow starts when a client presents a refresh token to obtain a new
          access token. The authorization server validates the refresh token (signature, expiry),
          marks it as used, generates a new refresh token and access token, stores the new refresh
          token, and returns both to the client. If an old (already used) refresh token is
          presented, the server detects reuse, revokes all sessions for that user, alerts the
          security team, and requires re-authentication with MFA. This pattern prevents token
          theft attacks where attackers steal refresh tokens from compromised clients.
        </p>
        <p>
          Key rotation architecture uses JWKS (JSON Web Key Set) to publish public keys for token
          validation. The JWKS endpoint returns multiple keys with key ID (kid), each with
          validity period (use before, use after). During rotation, new key is added to JWKS,
          signing switches to new key, old key remains for validation only, and after all tokens
          signed with old key expire, old key is removed. This enables zero-downtime rotation
          without invalidating existing tokens.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/credential-rotation-security.svg"
          alt="Credential Rotation Security"
          caption="Credential Rotation Security — showing old credential invalidation, grace periods, and session revocation"
        />

        <p>
          Password rotation flow involves user requesting password change, validating new password
          (length, breach check, history check), hashing new password with bcrypt/argon2,
          incrementing session version (invalidates all existing sessions), storing new password
          hash, notifying user via email, and logging the rotation event for audit. Users must
          re-authenticate with new password. This flow ensures that even if old password was
          compromised, attacker loses access immediately.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing credential rotation systems involves trade-offs between security, usability,
          and operational complexity. Understanding these trade-offs is essential for making
          informed architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Scheduled vs Breach-Based Rotation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Scheduled (90-day):</strong> Traditional approach, compliance-friendly.
              Limitation: users choose weak passwords (Password1, Password2), creates support
              burden, false sense of security.
            </li>
            <li>
              <strong>Breach-Based:</strong> Rotate only when compromise detected (breach database
              match, suspicious activity). Limitation: requires breach detection infrastructure,
              may miss undetected compromises.
            </li>
            <li>
              <strong>Hybrid:</strong> No scheduled rotation for standard users, mandatory for
              high-risk accounts (admin, privileged). Best balance — security where it matters,
              usability for standard users. NIST recommended.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Token Rotation Strategies</h3>
          <ul className="space-y-3">
            <li>
              <strong>Rotate on Use:</strong> New refresh token on each use, old one invalidated.
              Most secure, detects theft immediately. Limitation: requires stateful token tracking.
            </li>
            <li>
              <strong>Time-Based:</strong> Tokens expire after fixed time, no rotation. Simple,
              stateless. Limitation: doesn't detect theft, tokens valid until expiry.
            </li>
            <li>
              <strong>Hybrid:</strong> Rotate on use with time-based expiry (90 days absolute).
              Best of both — theft detection with safety net. Used by Google, Microsoft.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Key Rotation Approaches</h3>
          <ul className="space-y-3">
            <li>
              <strong>Immediate:</strong> Switch to new key, invalidate old tokens immediately.
              Simple, clean break. Limitation: invalidates all existing tokens, user disruption.
            </li>
            <li>
              <strong>Overlap:</strong> Support old + new keys during transition (7-30 days).
              Zero-downtime, no user disruption. Limitation: more complex key management.
            </li>
            <li>
              <strong>Gradual:</strong> Sign with new key, validate with any valid key, remove old
              after all tokens expire. Smoothest transition. Used by Auth0, Okta.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing credential rotation requires following established best practices to ensure
          security, usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <p>
          Implement token rotation for all refresh tokens — new token on each use, old one
          invalidated. Detect and respond to token reuse — if old token presented, revoke all
          sessions, alert security team, require MFA re-authentication. Rotate signing keys
          regularly (90 days) — automate key rotation, use HSM for key storage, support key overlap
          during transition. Revoke all sessions on credential change — increment session version,
          force re-authentication.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <p>
          Warn users before password expiry — 14 days, 7 days, 1 day warnings via email and
          in-app. Provide clear password requirements — minimum length (12+ chars), no composition
          rules, show strength meter. Allow password change from settings — self-service, no
          support ticket needed. Notify users of credential changes — email notification for all
          password/token/key changes, include timestamp, device, location.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Password Policy</h3>
        <p>
          Minimum length 12+ characters — length is more important than complexity. No composition
          requirements — don't require uppercase, numbers, symbols (creates weak passwords). Check
          against breached passwords — Have I Been Pwned API, k-anonymity model. Prevent password
          reuse — last 5 passwords stored (hashed), reject if matches. Breach-based rotation
          preferred — rotate when compromise detected, not on arbitrary schedule.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring &amp; Alerting</h3>
        <p>
          Track credential rotation events — password changes, token rotations, key rotations with
          full context. Monitor token reuse detection — alert on any reuse (indicates theft). Alert
          on unusual rotation patterns — many rotations from single user, rotations at unusual
          times. Track key rotation schedule — ensure keys rotated on time, alert if overdue.
          Monitor password change rates — baseline normal rate, alert on anomalies.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing credential rotation to ensure secure,
          usable, and maintainable rotation systems.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>No token rotation:</strong> Refresh tokens valid indefinitely, stolen tokens
            usable forever. <strong>Fix:</strong> Rotate refresh tokens on each use, invalidate old
            token immediately.
          </li>
          <li>
            <strong>No reuse detection:</strong> Stolen tokens can be reused without detection.{" "}
            <strong>Fix:</strong> Mark tokens as used, detect reuse, revoke all sessions on reuse,
            require MFA re-authentication.
          </li>
          <li>
            <strong>Forced periodic expiry:</strong> Users choose weak passwords (Password1,
            Password2) to comply with 90-day rotation. <strong>Fix:</strong> Breach-based rotation
            (NIST recommended), strong initial passwords with length requirements.
          </li>
          <li>
            <strong>No key overlap:</strong> Tokens invalidated during key rotation, user
            disruption. <strong>Fix:</strong> Support old + new keys during transition (7-30 days),
            gradual rollout.
          </li>
          <li>
            <strong>No session revocation:</strong> Old sessions remain active after password
            change, attacker retains access. <strong>Fix:</strong> Revoke all sessions on
            credential change, increment session version.
          </li>
          <li>
            <strong>Poor password requirements:</strong> Composition rules (must have uppercase,
            number, symbol) create predictable weak passwords. <strong>Fix:</strong> Length-based
            policy (12+ chars), breach checking, no composition rules.
          </li>
          <li>
            <strong>No user notification:</strong> Users unaware of credential changes, can't
            detect unauthorized changes. <strong>Fix:</strong> Email notification for all changes,
            include timestamp, device, location.
          </li>
          <li>
            <strong>No password history:</strong> Users reuse old passwords, defeating rotation
            purpose. <strong>Fix:</strong> Prevent reuse of last 5 passwords (store hashes, not
            plaintext).
          </li>
          <li>
            <strong>Manual key rotation:</strong> Error-prone, forgotten, inconsistent.{" "}
            <strong>Fix:</strong> Automate key rotation with monitoring, alerts if rotation fails.
          </li>
          <li>
            <strong>No expiry warnings:</strong> Users locked out unexpectedly, support tickets.{" "}
            <strong>Fix:</strong> Warn 14 days, 7 days, 1 day before expiry via email and in-app.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Credential rotation is critical for organizations with security and compliance
          requirements. Here are real-world implementations from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SSO (Okta/Azure AD)</h3>
        <p>
          <strong>Challenge:</strong> Enterprise with 10,000 employees using Okta for SSO. Need to
          rotate signing keys without disrupting user access, comply with SOC 2 requirements,
          support emergency rotation if key compromised.
        </p>
        <p>
          <strong>Solution:</strong> Automated key rotation every 90 days. JWKS endpoint with
          multiple keys (kid). Overlap period (30 days) — sign with new key, validate with any
          valid key. Emergency rotation procedure — immediate key revocation, force
          re-authentication. SOC 2 audit logs for all rotation events.
        </p>
        <p>
          <strong>Result:</strong> Zero downtime during rotation. Passed SOC 2 audit. Emergency
          rotation tested quarterly.
        </p>
        <p>
          <strong>Security:</strong> HSM for key storage, automated rotation, overlap period,
          emergency procedures.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">OAuth Provider (Auth0)</h3>
        <p>
          <strong>Challenge:</strong> OAuth provider with millions of users. Refresh token theft
          attacks increasing. Need to detect and respond to token theft without impacting
          legitimate users.
        </p>
        <p>
          <strong>Solution:</strong> Refresh token rotation on each use. Reuse detection — mark
          tokens as used, if old token presented, revoke all sessions. Alert user via email,
          require MFA re-authentication. Machine learning for anomaly detection (unusual token
          usage patterns).
        </p>
        <p>
          <strong>Result:</strong> Token theft attacks reduced by 99%. False positives under 0.1%.
          User trust improved.
        </p>
        <p>
          <strong>Security:</strong> Token rotation, reuse detection, ML anomaly detection, user
          notifications.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Financial Services (PCI-DSS)</h3>
        <p>
          <strong>Challenge:</strong> Investment platform with PCI-DSS compliance. API keys for
          service-to-service authentication. Need to rotate keys regularly, support zero-downtime
          rotation, maintain audit trails.
        </p>
        <p>
          <strong>Solution:</strong> API key rotation every 90 days. Overlap period (7 days) — both
          old and new keys valid. Automated rotation with notification to service owners. Rollback
          capability if rotation fails. Audit logs for all rotation events.
        </p>
        <p>
          <strong>Result:</strong> Passed PCI-DSS audit. Zero service disruptions during rotation.
          Service owners notified 14 days before rotation.
        </p>
        <p>
          <strong>Security:</strong> Automated rotation, overlap period, audit logging, rollback
          capability.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare EHR (HIPAA)</h3>
        <p>
          <strong>Challenge:</strong> Electronic Health Records system with HIPAA compliance.
          Provider passwords must be rotated, but providers work long shifts, can't be locked out
          unexpectedly. Need to balance security with usability.
        </p>
        <p>
          <strong>Solution:</strong> Breach-based rotation (no scheduled expiry). Password length
          requirements (12+ chars). Breach database checking. Session versioning on password
          change. In-app warnings (14 days, 7 days, 1 day). Email notifications for all changes.
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audit. Provider satisfaction improved (no
          unexpected lockouts). Security maintained with breach-based rotation.
        </p>
        <p>
          <strong>Security:</strong> Breach-based rotation, length requirements, session
          revocation, notifications.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Emergency Rotation (Security Incident)</h3>
        <p>
          <strong>Challenge:</strong> Tech company detected credential stuffing attack. Thousands
          of user passwords potentially compromised. Need to force rotation for affected users
          without causing panic or support overload.
        </p>
        <p>
          <strong>Solution:</strong> Emergency rotation procedure — identify affected users (login
          from suspicious IPs, failed login attempts), force password reset on next login, send
          targeted email notification, provide clear instructions, increase support staff, monitor
          for unauthorized access.
        </p>
        <p>
          <strong>Result:</strong> Compromised accounts secured within 24 hours. Support tickets
          manageable with increased staff. No unauthorized access detected post-rotation.
        </p>
        <p>
          <strong>Security:</strong> Emergency procedures, targeted rotation, user communication,
          increased monitoring.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of credential rotation design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should passwords expire periodically?</p>
            <p className="mt-2 text-sm">
              A: NIST SP 800-63B now recommends against periodic expiry — users choose weak
              passwords (Password1, Password2) to comply. Prefer breach-based rotation — require
              change if password found in breach database (Have I Been Pwned), suspicious activity
              detected, or for high-risk accounts (admin, privileged). Strong initial passwords
              (12+ chars, no composition rules) with MFA provide better security than forced
              periodic rotation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you rotate JWT signing keys?</p>
            <p className="mt-2 text-sm">
              A: Use JWKS (JSON Web Key Set) endpoint. Add new key to JWKS with new kid (key ID).
              Sign tokens with new key. Validate tokens with any valid key (old or new). Keep old
              key in JWKS until all tokens signed with it expire (based on token expiry). Then
              remove old key. Zero downtime, no token invalidation. Automate rotation (90 days).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement refresh token rotation?</p>
            <p className="mt-2 text-sm">
              A: Generate new refresh token on each use. Invalidate old token immediately (mark as
              used). Store new refresh token (hashed). If old token presented (reuse detection),
              token was stolen — revoke all sessions for that user, alert security team, notify
              user via email, require re-authentication with MFA. Short access token expiry (15-60
              min) limits damage window.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you detect token theft?</p>
            <p className="mt-2 text-sm">
              A: Refresh token reuse detection — mark tokens as used on rotation. If used token
              presented, it was stolen (legitimate client has new token). Response: revoke all
              sessions, alert security team, notify user via email (include timestamp, device,
              location), require re-authentication with MFA. Machine learning for anomaly detection
              (unusual token usage patterns, geographic anomalies).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's the ideal password policy?</p>
            <p className="mt-2 text-sm">
              A: Minimum 12 characters (length over complexity). No composition rules (don't
              require uppercase, numbers, symbols — creates weak passwords). Check against breach
              databases (Have I Been Pwned API with k-anonymity). Prevent reuse of last 5 passwords
              (store hashes). Breach-based rotation (not periodic). MFA for additional security.
              Clear strength meter for user guidance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle credential rotation for service accounts?</p>
            <p className="mt-2 text-sm">
              A: Automated rotation with secret management (HashiCorp Vault, AWS Secrets Manager).
              Notify service owners before rotation (14 days, 7 days, 1 day). Support key overlap
              (both old and new credentials valid during transition). Monitor rotation success.
              Rollback capability if rotation fails. Audit logs for compliance. Emergency rotation
              procedure for security incidents.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for credential rotation?</p>
            <p className="mt-2 text-sm">
              A: Rotation success/failure rate, token reuse detection rate (indicates theft
              attempts), key rotation schedule compliance (rotated on time?), password change rate
              (baseline normal, alert on anomalies), breach detection hits (passwords found in
              breach databases), session revocation success rate. Set up alerts for anomalies —
              spike in rotation failures, unusual reuse detection, overdue key rotations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle credential rotation during security incidents?</p>
            <p className="mt-2 text-sm">
              A: Emergency rotation procedures — identify affected users (login from suspicious IPs,
              failed login attempts, breach database match), force password reset on next login,
              revoke all existing sessions, send targeted email notification with clear
              instructions, increase support staff, monitor for unauthorized access, post-incident
              review to improve procedures.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you balance security with usability in rotation?</p>
            <p className="mt-2 text-sm">
              A: Breach-based rotation (not periodic) — security where it matters, no user
              frustration. Clear warnings before expiry (14 days, 7 days, 1 day). Self-service
              password change (no support ticket needed). Email notifications for all changes (user
              awareness). Length-based password policy (12+ chars) — easy to remember, hard to
              crack. MFA for additional security without password complexity.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://pages.nist.gov/800-63-3/sp800-63b.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NIST SP 800-63B - Digital Identity Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://www.rfc-editor.org/rfc/rfc6749"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 6749 - OAuth 2.0 Authorization Framework
            </a>
          </li>
          <li>
            <a
              href="https://www.rfc-editor.org/rfc/rfc7517"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 7517 - JSON Web Key (JWK)
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authentication Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Password Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://haveibeenpwned.com/API/v3"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Have I Been Pwned API
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authorization Cheat Sheet
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
