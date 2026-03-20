"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-account-verification",
  title: "Account Verification",
  description: "Guide to implementing account verification covering email verification, phone verification, manual review, and verification workflows.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "account-verification",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "verification", "account", "backend"],
  relatedTopics: ["email-verification", "phone-verification", "user-registration-service"],
};

export default function AccountVerificationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Account Verification</strong> is the process of confirming user identity through 
          email, phone, or manual review. It prevents fake accounts, enables account recovery,
          and ensures reliable communication channels.
        </p>
        <p>
          For staff and principal engineers, implementing account verification requires
          understanding verification methods, token generation, and security patterns.
          The implementation must balance security with user experience.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-verification-flow.svg"
          alt="Account Verification Flow"
          caption="Account Verification — showing email, phone, document, and manual verification"
        />
      </section>

      <section>
        <h2>Verification Methods</h2>
        <ul className="space-y-3">
          <li><strong>Email:</strong> Verification link or code sent to email.</li>
          <li><strong>Phone:</strong> SMS OTP or voice call.</li>
          <li><strong>Document:</strong> ID upload for high-security (KYC).</li>
          <li><strong>Manual:</strong> Support team review for enterprise.</li>
        </ul>
      </section>

      <section>
        <h2>Verification Flow</h2>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/verification-token-flow.svg"
          alt="Verification Token Flow"
          caption="Verification Flow — showing token generation, delivery, validation, and confirmation"
        />

        <ul className="space-y-3">
          <li><strong>Generate Token:</strong> Random token with expiry.</li>
          <li><strong>Send:</strong> Email/SMS with verification link/code.</li>
          <li><strong>Validate:</strong> Verify token on submission.</li>
          <li><strong>Mark Verified:</strong> Set verified_at timestamp.</li>
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
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Authentication Cheat Sheet
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-verification-security.svg"
          alt="Account Verification Security"
          caption="Security — showing token expiry, rate limiting, and fraud prevention"
        />

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How long should verification tokens be valid?</p>
            <p className="mt-2 text-sm">A: Email: 24-72 hours. Phone: 5-10 minutes. Balance convenience vs security.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should unverified accounts have access?</p>
            <p className="mt-2 text-sm">A: Limited access yes, sensitive actions no. Require verification for payments, data export.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
