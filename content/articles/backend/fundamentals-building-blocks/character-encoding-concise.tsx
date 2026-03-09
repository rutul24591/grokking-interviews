"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-character-encoding-concise",
  title: "Character Encoding",
  description: "Quick overview of Unicode, UTF-8, and encoding pitfalls for backend interviews.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "character-encoding",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "encoding", "utf-8"],
  relatedTopics: ["serialization-formats", "compression", "http-https-protocol"],
};

export default function CharacterEncodingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          Character encoding defines how text maps to bytes. Unicode provides
          code points, and UTF-8 is the dominant byte encoding for the web.
          Encoding mistakes lead to corrupted text (mojibake).
        </p>
        <p>
          Most bugs appear at boundaries: when a database, API, or message queue
          assumes a different encoding. A consistent UTF‑8 pipeline prevents
          corrupted data and subtle search/indexing errors.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Unicode:</strong> Universal character set.</li>
          <li><strong>UTF-8:</strong> Variable-length encoding, backward compatible with ASCII.</li>
          <li><strong>Mojibake:</strong> Garbled text from encoding mismatch.</li>
          <li><strong>Normalization:</strong> NFC/NFD affect string equality.</li>
          <li><strong>Percent-Encoding:</strong> URLs escape non-ASCII bytes.</li>
        </ul>
        <p className="mt-4">
          Think of Unicode as the alphabet and UTF‑8 as the storage format. If
          you mix alphabets and storage rules, text breaks.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Node: encode UTF-8
const buf = Buffer.from('hello 🌍', 'utf8');
console.log(buf.toString('utf8'));`}</code>
        </pre>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Always specify UTF-8 in headers and storage.</li>
          <li>Know the difference between code points and bytes.</li>
          <li>Call out database collation and normalization pitfalls.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is UTF-8 preferred?</p>
            <p className="mt-2 text-sm">A: It supports all Unicode and is ASCII-compatible.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What causes mojibake?</p>
            <p className="mt-2 text-sm">A: Decoding bytes with the wrong character set.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why does normalization matter?</p>
            <p className="mt-2 text-sm">
              A: Different byte sequences can represent the same character, affecting equality checks.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
