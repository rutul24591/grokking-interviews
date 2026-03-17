"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-password-hashing",
  title: "Password Hashing and Validation",
  description: "Comprehensive guide to implementing password hashing covering algorithms (bcrypt, argon2), salting, validation patterns, breach detection, and security best practices for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "password-hashing-and-validation",
  version: "extensive",
  wordCount: 7000,
  readingTime: 28,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "password", "hashing", "security", "backend"],
  relatedTopics: ["user-registration-service", "authentication-service", "credential-rotation", "account-recovery"],
};

export default function PasswordHashingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Password Hashing and Validation</strong> is the cryptographic process of 
          securely storing and verifying user passwords. Hashing transforms passwords into 
          irreversible representations, protecting user credentials even if the database is 
          compromised.
        </p>
        <p>
          For staff and principal engineers, implementing password hashing requires 
          understanding hashing algorithms (bcrypt, argon2, scrypt), salt generation, 
          cost factors, timing-safe comparison, breach detection, and migration strategies 
          for algorithm upgrades. The implementation must balance security (strong hashing) 
          with performance (authentication latency).
        </p>
      </section>

      <section>
        <h2>Hashing Algorithms</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">bcrypt (Industry Standard)</h3>
          <ul className="space-y-3">
            <li>
              <strong>Algorithm:</strong> Adaptive hash based on Blowfish cipher.
            </li>
            <li>
              <strong>Cost Factor:</strong> Exponential work factor (2^cost). 
              Recommended: 12-14.
            </li>
            <li>
              <strong>Salt:</strong> Built-in 128-bit salt. Stored with hash.
            </li>
            <li>
              <strong>Output:</strong> 60-character string ($2a$12$...).
            </li>
            <li>
              <strong>Pros:</strong> Battle-tested, wide language support, GPU-resistant.
            </li>
            <li>
              <strong>Cons:</strong> Memory-light (vulnerable to GPU attacks at scale).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">argon2id (Recommended for New Systems)</h3>
          <ul className="space-y-3">
            <li>
              <strong>Algorithm:</strong> Memory-hard function, winner of Password 
              Hashing Competition (2015).
            </li>
            <li>
              <strong>Parameters:</strong> Memory (64MB+), iterations (3+), parallelism (4).
            </li>
            <li>
              <strong>Salt:</strong> 128-bit salt. Stored with hash.
            </li>
            <li>
              <strong>Pros:</strong> GPU-resistant, ASIC-resistant, memory-hard.
            </li>
            <li>
              <strong>Cons:</strong> Newer (less battle-tested), complex tuning.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">scrypt</h3>
          <ul className="space-y-3">
            <li>
              <strong>Algorithm:</strong> Memory-hard function.
            </li>
            <li>
              <strong>Parameters:</strong> N (CPU cost), r (block size), p (parallelism).
            </li>
            <li>
              <strong>Pros:</strong> Memory-hard, GPU-resistant.
            </li>
            <li>
              <strong>Cons:</strong> Complex parameters, less adoption than bcrypt.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Algorithms to Avoid</h3>
          <ul className="space-y-3">
            <li>
              <strong>MD5, SHA1, SHA256:</strong> Too fast, vulnerable to brute force.
            </li>
            <li>
              <strong>Unsalted Hashes:</strong> Rainbow table attacks.
            </li>
            <li>
              <strong>Fast Hashes:</strong> Any hash not designed for passwords 
              (designed for speed, not security).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Implementation Patterns</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Password Registration</h3>
          <ul className="space-y-3">
            <li>
              <strong>Generate Salt:</strong> Automatic with bcrypt/argon2.
            </li>
            <li>
              <strong>Hash Password:</strong> Apply hash function with appropriate 
              cost factor.
            </li>
            <li>
              <strong>Store Hash:</strong> Store complete hash string (includes 
              salt, cost, hash).
            </li>
            <li>
              <strong>Discard Plaintext:</strong> Never log or store original 
              password.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Password Validation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Fetch Hash:</strong> Retrieve stored hash from database.
            </li>
            <li>
              <strong>Constant-Time Compare:</strong> Use crypto.timingSafeEqual 
              or library function.
            </li>
            <li>
              <strong>Timing Attack Prevention:</strong> Same time for match 
              and mismatch.
            </li>
            <li>
              <strong>Rate Limiting:</strong> Limit validation attempts per 
              account/IP.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Breach Detection</h3>
          <ul className="space-y-3">
            <li>
              <strong>Have I Been Pwned:</strong> Check password against breached 
              password database.
            </li>
            <li>
              <strong>k-Anonymity:</strong> Send first 5 chars of SHA1 hash, 
              receive matching suffixes.
            </li>
            <li>
              <strong>Warn User:</strong> If breached, require different password.
            </li>
            <li>
              <strong>Prevent Reuse:</strong> Store hash of recent passwords, 
              prevent reuse.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Security Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Unique Salt:</strong> Different salt per password. Automatic 
            with bcrypt/argon2.
          </li>
          <li>
            <strong>Appropriate Cost:</strong> Hash should take 200-500ms. Adjust 
            cost factor as hardware improves.
          </li>
          <li>
            <strong>Pepper:</strong> Optional server-side secret added before 
            hashing. Stored separately from database.
          </li>
          <li>
            <strong>Algorithm Migration:</strong> Re-hash on login if algorithm 
            outdated. Gradual migration.
          </li>
          <li>
            <strong>Secure Transmission:</strong> Password only over HTTPS. 
            Client-side hashing optional (doesn't replace server-side).
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why not use SHA256 for passwords?</p>
            <p className="mt-2 text-sm">
              A: SHA256 is too fast (millions of hashes/second on GPU). Password 
              hashes should be slow (bcrypt: ~100ms). Fast hashes enable brute 
              force attacks. Use password-specific algorithms (bcrypt, argon2).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What cost factor should you use for bcrypt?</p>
            <p className="mt-2 text-sm">
              A: Target 200-500ms per hash. Currently: cost 12-14. Test on your 
              hardware. Increase cost as hardware improves. Document and review 
              annually.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you migrate to a new hashing algorithm?</p>
            <p className="mt-2 text-sm">
              A: Store algorithm identifier with hash. On login: validate with 
              old algorithm, re-hash with new algorithm, update database. 
              Gradual migration over months. Force reset for inactive users.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you hash passwords client-side?</p>
            <p className="mt-2 text-sm">
              A: Not as replacement for server-side hashing. Client-side adds 
              protection against MITM, but server must still hash. Can use as 
              additional layer (password + client hash), but complexity may 
              not justify benefit.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a pepper and should you use one?</p>
            <p className="mt-2 text-sm">
              A: Pepper is server-side secret added before hashing. Stored 
              separately from database (env var, HSM). Protects against DB 
              leak alone. Adds complexity (key management). Recommended for 
              high-security apps.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent timing attacks in password validation?</p>
            <p className="mt-2 text-sm">
              A: Use constant-time comparison (crypto.timingSafeEqual). Library 
              functions handle this. Never use == or === for hash comparison. 
              Same execution time for match and mismatch.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
