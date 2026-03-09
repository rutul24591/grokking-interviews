"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-character-encoding-extensive",
  title: "Character Encoding",
  description: "Comprehensive guide to Unicode, UTF-8, and common encoding pitfalls in backend systems.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "character-encoding",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "encoding", "utf-8"],
  relatedTopics: ["serialization-formats", "compression", "http-https-protocol"],
};

export default function CharacterEncodingExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          Encoding defines how characters become bytes. Unicode defines code
          points, and UTF-8 maps those code points to variable-length byte
          sequences used across the web.
        </p>
      </section>

      <section>
        <h2>Encoding Concepts</h2>
        <ArticleImage
          src="/diagrams/backend/fundamentals-building-blocks/encoding-unicode-utf8.svg"
          alt="Unicode and UTF-8"
          caption="Unicode code points are encoded into UTF-8 bytes"
        />
        <ArticleImage
          src="/diagrams/backend/fundamentals-building-blocks/mojibake.svg"
          alt="Mojibake example"
          caption="Encoding mismatches cause corrupted text"
        />
        <ArticleImage
          src="/diagrams/backend/fundamentals-building-blocks/byte-order.svg"
          alt="Byte representation"
          caption="Text is ultimately stored and transferred as bytes"
        />
      </section>

      <section>
        <h2>Implementation Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Node: enforce UTF-8
res.set('Content-Type', 'text/plain; charset=utf-8');
const buf = Buffer.from('hello 🌍', 'utf8');`}</code>
        </pre>
      </section>
    
      <section>
        <h2>Encoding in APIs</h2>
        <p>
          Always set charset in Content-Type headers and ensure databases use
          UTF-8 or UTF-8 MB4 where required. Encoding issues often appear during
          migrations or when mixing legacy systems.
        </p>
      </section>

      <section>
        <h2>Database Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Example: MySQL UTF-8 MB4
ALTER DATABASE app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`}</code>
        </pre>
      </section>

      <section>
        <h2>Deep Dive: Encoding at Boundaries</h2>
        <p>
          Encoding problems often occur at system boundaries: database drivers, legacy APIs, or
          message queues. Normalize to UTF-8 at ingress and enforce it throughout the pipeline.
        </p>
      </section>

      <section>
        <h2>Deep Dive: Emoji and Multibyte Characters</h2>
        <p>
          Emoji and CJK characters require 4-byte storage. Systems that only support 3-byte UTF-8
          will corrupt these characters. Plan schema and storage accordingly.
        </p>
      </section>

      <section>
        <h2>Deep Dive: Encoding in Logs and Observability</h2>
        <p>
          Logs can corrupt text if encoding is inconsistent between application
          and log pipeline. Ensure logging agents and storage systems preserve
          UTF-8 end-to-end to avoid losing critical debugging signals.
        </p>
      </section>

      <section>
        <h2>Deep Dive: Cross-System Integration</h2>
        <p>
          Legacy systems may still use ISO-8859-1 or Windows-1252. When
          integrating, normalize inputs to UTF-8 and track conversion errors.
        </p>
      </section>

      <section>
        <h2>Normalization and Equality</h2>
        <p>
          Unicode supports multiple representations of the same visible text.
          For example, “é” can be a single code point or two code points. Without
          normalization (NFC/NFD), string comparisons and indexing can behave
          unexpectedly across systems.
        </p>
      </section>

      <section>
        <h2>Grapheme Clusters vs Code Points</h2>
        <p>
          A user-visible “character” can be multiple code points (emoji sequences,
          skin tone modifiers, flags). Backends should avoid naive length limits
          based on code points when enforcing validation or storage limits.
        </p>
      </section>

      <section>
        <h2>URL and Form Encoding</h2>
        <p>
          URLs use percent-encoding for non-ASCII bytes. HTML forms may use
          <span className="ml-1">application/x-www-form-urlencoded</span>, which
          replaces spaces with <span className="ml-1">+</span> and percent-encodes
          special characters. Mismatches here cause subtle bugs in query parsing.
        </p>
      </section>

      <section>
        <h2>Operational Checklist</h2>
        <ul className="space-y-2">
          <li>Ensure UTF-8 at ingress and storage layers.</li>
          <li>Normalize for search indexes and equality checks.</li>
          <li>Test with emoji and non-Latin scripts.</li>
          <li>Set explicit charset in HTTP responses.</li>
        </ul>
      </section>

      <section>
        <h2>Unicode vs UTF-8 (Practical Distinction)</h2>
        <p>
          Unicode defines abstract code points. UTF-8 is a specific encoding
          that maps those code points to bytes. Confusing these leads to subtle
          bugs, such as counting bytes instead of characters or truncating multi-
          byte characters.
        </p>
        <p>
          A clear rule: always treat strings as Unicode, but store and transmit
          them as UTF-8. Any deviation should be explicit and localized.
        </p>
      </section>

      <section>
        <h2>Byte Length vs Character Length</h2>
        <p>
          Many systems impose length limits. If you limit by bytes but users
          expect characters, you can reject valid input or silently truncate it.
          This is especially common with emoji and CJK characters.
        </p>
        <p>
          When enforcing limits, decide whether they are byte limits (storage
          constraints) or character limits (UX constraints). Apply the correct
          measurement consistently.
        </p>
      </section>

      <section>
        <h2>Database Collation and Sorting</h2>
        <p>
          Collation determines how strings are compared and sorted. Two visually
          identical strings can sort differently if normalization is inconsistent.
          This affects user search, uniqueness constraints, and ordering.
        </p>
        <p>
          Choose a collation that matches your product requirements and document
          it. Changing collation after launch is painful and risky.
        </p>
      </section>

      <section>
        <h2>Encoding in Message Queues</h2>
        <p>
          Message queues often carry raw byte payloads. If producers and consumers
          disagree on encoding, data corruption is silent. Standardize UTF‑8 for
          all string fields and include schemas or contracts where possible.
        </p>
        <p>
          For binary payloads, include explicit metadata so downstream systems
          can decode reliably.
        </p>
      </section>

      <section>
        <h2>Normalization Strategy</h2>
        <p>
          Normalization (NFC vs NFD) affects equality checks. For example, the
          same visible string can be represented with different code point
          sequences. This causes duplicate records, failed lookups, or broken
          deduplication logic if not handled.
        </p>
        <p>
          A common practice is to normalize on ingest and store normalized
          values. This ensures comparisons and indexing remain consistent.
        </p>
      </section>

      <section>
        <h2>URL Encoding and Query Parsing</h2>
        <p>
          URLs are ASCII-based, so non-ASCII characters must be percent-encoded.
          Spaces become <span className="ml-1">+</span> or <span className="ml-1">%20</span>,
          depending on the encoding style. Mismatches here cause subtle bugs in
          search and query parsing.
        </p>
        <p>
          Always decode with the expected charset. If you accept user input in
          URLs, test with non-Latin characters and emoji.
        </p>
      </section>

      <section>
        <h2>Operational Checklist (Expanded)</h2>
        <ul className="space-y-2">
          <li>Decide and document a normalization strategy.</li>
          <li>Use UTF‑8 end‑to‑end in APIs and databases.</li>
          <li>Test byte-length vs character-length limits.</li>
          <li>Standardize encoding in message queues.</li>
          <li>Validate URL encoding/decoding paths.</li>
        </ul>
      </section>
</ArticleLayout>
  );
}
