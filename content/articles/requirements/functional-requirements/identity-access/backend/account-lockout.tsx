"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-account-lockout",
  title: "Account Lockout",
  description: "Guide to implementing account lockout covering threshold configuration, lockout duration, unlock mechanisms, and security patterns.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "account-lockout",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "account-lockout", "security", "backend"],
  relatedTopics: ["login-attempt-tracking", "authentication-service", "account-recovery"],
};

export default function AccountLockoutArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Account Lockout</strong> is a security mechanism that temporarily or permanently 
          locks an account after repeated failed authentication attempts. It prevents brute force 
          and credential stuffing attacks by limiting the number of password guesses.
        </p>
      </section>

      <section>
        <h2>Lockout Configuration</h2>
        <ul className="space-y-3">
          <li><strong>Threshold:</strong> 5-10 failed attempts before lockout.</li>
          <li><strong>Duration:</strong> Temporary (15 min - 24 hours) or permanent until reset.</li>
          <li><strong>Scope:</strong> Per account, per IP, or both.</li>
          <li><strong>Escalation:</strong> Increasing lockout duration with repeated lockouts.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <ul className="space-y-3">
          <li><strong>Counter Storage:</strong> Redis with TTL for failed attempt count.</li>
          <li><strong>Lockout Flag:</strong> Set locked_until timestamp on account.</li>
          <li><strong>Progressive Delays:</strong> Increase delay after each failure (1s, 2s, 4s).</li>
          <li><strong>CAPTCHA:</strong> Trigger after 3 failures before full lockout.</li>
        </ul>
      </section>

      <section>
        <h2>Unlock Mechanisms</h2>
        <ul className="space-y-3">
          <li><strong>Automatic:</strong> Unlock after duration expires.</li>
          <li><strong>Email Unlock:</strong> Send unlock link to verified email.</li>
          <li><strong>Support Reset:</strong> Manual unlock by support team.</li>
          <li><strong>MFA Override:</strong> Unlock with verified MFA.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's the ideal lockout threshold?</p>
            <p className="mt-2 text-sm">A: 5-10 attempts balances security vs usability. Too low causes frustration, too high enables attacks.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent DoS via lockout?</p>
            <p className="mt-2 text-sm">A: Lock per IP as well as account, CAPTCHA before lockout, progressive delays, don't reveal lockout status.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
