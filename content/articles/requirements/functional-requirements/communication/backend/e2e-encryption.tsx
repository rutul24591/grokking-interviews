"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-backend-e2e-encryption",
  title: "End-to-End Encryption",
  description: "Guide to implementing end-to-end encryption covering key exchange, message encryption, and group encryption.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "end-to-end-encryption",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "communication", "encryption", "security", "backend"],
  relatedTopics: ["messaging", "security", "privacy"],
};

export default function EndToEndEncryptionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>End-to-End Encryption (E2EE)</strong> ensures only communicating 
          users can read messages, not even the service provider. It provides 
          maximum privacy for sensitive communications.
        </p>
      </section>

      <section>
        <h2>Key Exchange</h2>
        <ul className="space-y-3">
          <li><strong>Signal Protocol:</strong> Double ratchet algorithm.</li>
          <li><strong>Key Generation:</strong> Per-device key pairs.</li>
          <li><strong>X3DH:</strong> Extended triple Diffie-Hellman for initial key exchange.</li>
        </ul>
      </section>

      <section>
        <h2>Group Encryption</h2>
        <ul className="space-y-3">
          <li><strong>Sender Keys:</strong> Each member has sender key.</li>
          <li><strong>Distribution:</strong> Encrypt key for each member.</li>
          <li><strong>Rotation:</strong> Rotate keys on member change.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does E2EE affect server functionality?</p>
            <p className="mt-2 text-sm">A: Server can't read messages, limited search/moderation, backup complexity, key management critical.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle key backup?</p>
            <p className="mt-2 text-sm">A: Encrypted backup with user passphrase, trusted contacts recovery, hardware security module.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
