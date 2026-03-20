"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-credential-rotation",
  title: "Credential Rotation",
  description: "Guide to implementing credential rotation covering password changes, token rotation, key rotation, and security best practices.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "credential-rotation",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "credential-rotation", "security", "backend"],
  relatedTopics: ["password-hashing", "token-generation", "session-revocation"],
};

export default function CredentialRotationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Credential Rotation</strong> is the practice of periodically changing 
          authentication credentials (passwords, tokens, keys) to limit the impact of 
          compromised credentials. It is a fundamental security practice for protecting
          user accounts and system access.
        </p>
        <p>
          For staff and principal engineers, implementing credential rotation requires
          understanding password policies, token rotation, key rotation, and security
          best practices. The implementation must balance security with usability.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/credential-rotation-flow.svg"
          alt="Credential Rotation Flow"
          caption="Credential Rotation — showing password, token, and key rotation patterns"
        />
      </section>

      <section>
        <h2>Password Rotation</h2>
        <ul className="space-y-3">
          <li><strong>Policy:</strong> Require change every 90 days (or breach-based).</li>
          <li><strong>History:</strong> Prevent reuse of last N passwords.</li>
          <li><strong>Notification:</strong> Warn before expiry (14 days).</li>
          <li><strong>Session Handling:</strong> Revoke all sessions on change.</li>
        </ul>
      </section>

      <section>
        <h2>Token Rotation</h2>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/token-rotation.svg"
          alt="Token Rotation"
          caption="Token Rotation — showing refresh token rotation, reuse detection, and family revocation"
        />

        <ul className="space-y-3">
          <li><strong>Refresh Tokens:</strong> New token on each use.</li>
          <li><strong>Reuse Detection:</strong> If old token used, revoke all.</li>
          <li><strong>Access Tokens:</strong> Short expiry, silent refresh.</li>
        </ul>
      </section>

      <section>
        <h2>Key Rotation</h2>
        <ul className="space-y-3">
          <li><strong>Signing Keys:</strong> Rotate every 90 days.</li>
          <li><strong>Overlap:</strong> Support old + new keys during transition.</li>
          <li><strong>JWKS:</strong> Publish multiple keys with kid.</li>
        </ul>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              NIST SP 800-63B - Digital Identity Guidelines
            </a>
          </li>
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc6749" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 6749 - OAuth 2.0 Authorization Framework
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/credential-rotation-security.svg"
          alt="Credential Rotation Security"
          caption="Security — showing rotation policies, expiry handling, and compromise detection"
        />

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should passwords expire?</p>
            <p className="mt-2 text-sm">A: NIST now recommends against periodic expiry (users choose weak passwords). Prefer breach-based rotation.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you rotate JWT signing keys?</p>
            <p className="mt-2 text-sm">A: Add new key to JWKS, sign with new key, validate with any valid key, remove old after all tokens expire.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
