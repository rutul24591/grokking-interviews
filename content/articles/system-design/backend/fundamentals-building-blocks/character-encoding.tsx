"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-character-encoding",
  title: "Character Encoding",
  description: "Comprehensive guide to Unicode, UTF-8, normalization, and encoding pitfalls in backend systems covering database storage, API boundaries, and internationalization challenges.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "character-encoding",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: ["backend", "encoding", "unicode", "utf-8", "normalization", "internationalization", "i18n"],
  relatedTopics: ["serialization-formats", "http-https-protocol", "database-design", "api-design"],
};

export default function CharacterEncodingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Character encoding</strong> defines how characters (letters, digits, symbols, emoji) are represented as bytes for storage and transmission. <strong>Unicode</strong> is the universal character set that assigns a unique code point (e.g., U+0041 for 'A', U+1F600 for 😀) to every character in every writing system. <strong>UTF-8</strong> is the dominant encoding that maps Unicode code points to variable-length byte sequences (1-4 bytes per character), designed for backward compatibility with ASCII and efficient storage of Latin text.
        </p>
        <p>
          For backend engineers, character encoding is not abstract theory — it is a daily operational concern. Encoding mismatches cause data corruption (mojibake — garbled text), search failures (same text doesn't match due to different byte sequences), validation errors (byte-length limits reject valid input), and security vulnerabilities (encoding bypasses input validation). These issues often surface months after deployment, during migrations, internationalization efforts, or when integrating with legacy systems that use different encodings.
        </p>
        <p>
          The key insight is that encoding is a boundary concern. Within a well-designed system, UTF-8 is used end-to-end. Problems arise at boundaries: browser to server (form submissions with different charsets), server to database (driver defaults), service to service (message queues with raw byte payloads), and legacy system integration (ISO-8859-1, Windows-1252). Understanding how to enforce UTF-8 at ingress, normalize text for equality checks, and handle edge cases (emoji, CJK characters, combining diacritics) is essential for building robust, internationalized systems.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Character encoding encompasses several interconnected concepts that govern how text is stored, transmitted, and compared across systems.
        </p>
        <ul>
          <li>
            <strong>Unicode Code Points:</strong> Unicode assigns a unique number (code point) to every character. Code points are written as U+XXXX (e.g., U+0041 = 'A', U+00E9 = 'é', U+1F600 = 😀). The Unicode standard defines over 149,000 characters across 167 scripts. Code points are abstract — they do not specify how characters are stored as bytes. That is the job of encodings like UTF-8, UTF-16, or UTF-32.
          </li>
          <li>
            <strong>UTF-8 Encoding:</strong> UTF-8 encodes Unicode code points as 1-4 byte sequences. ASCII characters (U+0000 to U+007F) use 1 byte (identical to ASCII). Latin-1 Supplement (U+0080 to U+00FF) uses 2 bytes. Most common non-Latin scripts (CJK, Arabic, Cyrillic) use 3 bytes. Emoji and rare characters use 4 bytes. UTF-8 is self-synchronizing (you can find character boundaries without decoding from the start) and backward-compatible with ASCII, which is why it dominates the web (98% of websites use UTF-8).
          </li>
          <li>
            <strong>Normalization (NFC, NFD, NFKC, NFKD):</strong> Unicode allows multiple byte sequences to represent the same visible character. For example, 'é' can be a single code point (U+00E9) or two code points ('e' + combining acute accent: U+0065 U+0301). Normalization converts text to a canonical form. NFC (Canonical Composition) combines characters where possible. NFD (Canonical Decomposition) splits combined characters. NFKC/NFKD (Compatibility Composition/Decomposition) also normalize compatibility characters (e.g., 'ﬁ' ligature → 'fi'). Without normalization, string comparisons fail — two visually identical strings compare unequal because they have different byte sequences.
          </li>
          <li>
            <strong>Grapheme Clusters:</strong> A user-visible "character" (grapheme) can be multiple Unicode code points. Emoji with skin tone modifiers (👨🏿 = man + dark skin tone), flag emoji (🇺🇸 = regional indicator U + regional indicator S), and ZWJ sequences (👨‍👩‍👧 = man + ZWJ + woman + ZWJ + girl) are single graphemes but multiple code points. Backends that count code points instead of graphemes miscalculate string length, truncate mid-grapheme (producing replacement glyphs ), and break validation (username "max 20 characters" rejects valid input).
          </li>
          <li>
            <strong>Byte Length vs Character Length:</strong> UTF-8 strings have two lengths: byte length (number of bytes) and character length (number of code points or graphemes). For ASCII text, these are identical. For emoji or CJK text, byte length can be 3-4× character length. Systems that enforce byte-length limits (VARCHAR(255) in MySQL) reject valid input or silently truncate multi-byte characters. Systems that enforce character-length limits must count graphemes, not code points, to match user expectations.
          </li>
          <li>
            <strong>Collation and Sorting:</strong> Collation determines how strings are compared and sorted. Different collations produce different orderings: case-sensitive vs case-insensitive, accent-sensitive vs accent-insensitive, locale-specific sorting (German 'ß' = 'ss', Swedish 'å' sorts after 'z'). Database collation must match application expectations. Mismatched collations cause search failures (query doesn't match stored data) and inconsistent ordering (same query returns different results on different replicas).
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/unicode-utf8-encoding.svg"
          alt="Unicode to UTF-8 Encoding Diagram"
          caption="Unicode code points are encoded into UTF-8 byte sequences with variable length: ASCII=1 byte, Latin=2 bytes, CJK=3 bytes, Emoji=4 bytes"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Understanding how encoding flows through system architecture is essential for preventing corruption. A typical request traverses multiple boundaries, each with potential encoding mismatches.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/mojibake-encoding-mismatch.svg"
          alt="Mojibake Encoding Mismatch Diagram"
          caption="When UTF-8 encoded text is decoded as Latin-1, each byte is interpreted as a separate character, producing garbled text"
        />

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Encoding Flow Through System Boundaries</h3>
          <ol className="space-y-3">
            <li>
              <strong>Browser → Server (HTTP Request):</strong> Browser sends form data with Content-Type header specifying charset (usually UTF-8). Server must read charset from header and decode bytes accordingly. Mismatch causes mojibake.
            </li>
            <li>
              <strong>Server → Application:</strong> Application framework should automatically decode request body using charset from header. Manual decoding with wrong charset causes corruption.
            </li>
            <li>
              <strong>Application → Database:</strong> Database driver should use UTF-8 by default. Explicitly set charset in connection string (e.g., <code>?charset=utf8mb4</code> for MySQL). Driver converts application strings to database encoding.
            </li>
            <li>
              <strong>Database Storage:</strong> Database stores bytes in table columns. Column charset (e.g., utf8mb4) must support all characters (emoji require 4-byte UTF-8). Collation determines comparison and sorting behavior.
            </li>
            <li>
              <strong>Database → Application:</strong> Driver converts database bytes to application strings using connection charset. Mismatch causes corruption on read.
            </li>
            <li>
              <strong>Application → Response:</strong> Application sets Content-Type header with charset (e.g., <code>Content-Type: application/json; charset=utf-8</code>). Client decodes bytes using specified charset.
            </li>
          </ol>
        </div>

        <p>
          <strong>Normalization Flow:</strong> Normalization should happen at ingress (when data enters the system). Normalize user input to NFC before storage. This ensures consistent byte sequences for equality checks and indexing. Do not normalize on read — normalize once on write, compare normalized values. For search indexes, normalize both indexed terms and search queries to the same form (NFC or NFKC depending on requirements).
        </p>

        <p>
          <strong>Boundary Validation:</strong> Validate encoding at every boundary. Reject invalid UTF-8 byte sequences at ingress (do not attempt to "fix" corrupted input — reject and log). Log byte length and character length for all text fields. Alert when byte/character ratio changes sharply — this signals upstream encoding changes. For legacy system integration, normalize to UTF-8 immediately and track conversion errors.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">UTF-8</th>
              <th className="p-3 text-left">UTF-16</th>
              <th className="p-3 text-left">UTF-32</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Byte Efficiency</strong>
              </td>
              <td className="p-3">
                1-4 bytes per character
                <br />
                Efficient for ASCII/Latin text
                <br />
                Dominant on web (98% adoption)
              </td>
              <td className="p-3">
                2-4 bytes per character
                <br />
                Efficient for CJK text
                <br />
                Used in Java, Windows, JavaScript
              </td>
              <td className="p-3">
                4 bytes per character (fixed)
                <br />
                Inefficient for ASCII/Latin
                <br />
                Rarely used for storage
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Random Access</strong>
              </td>
              <td className="p-3">
                Variable-length encoding
                <br />
                Must decode from start to find character N
                <br />
                Slower for random access
              </td>
              <td className="p-3">
                Variable-length encoding
                <br />
                Must decode from start or use index
                <br />
                Moderate random access
              </td>
              <td className="p-3">
                Fixed-length encoding
                <br />
                Character N is at offset N×4
                <br />
                Fastest for random access
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Compatibility</strong>
              </td>
              <td className="p-3">
                Backward-compatible with ASCII
                <br />
                ASCII text is valid UTF-8
                <br />
                Universal support
              </td>
              <td className="p-3">
                Not ASCII-compatible
                <br />
                ASCII text uses 2 bytes per character
                <br />
                Platform-dependent endianness
              </td>
              <td className="p-3">
                Not ASCII-compatible
                <br />
                ASCII text uses 4 bytes per character
                <br />
                Platform-dependent endianness
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Use Cases</strong>
              </td>
              <td className="p-3">
                Web (HTML, JSON, URLs)
                <br />
                File storage (Linux, macOS)
                <br />
                Databases (MySQL, PostgreSQL)
              </td>
              <td className="p-3">
                Java strings (internally)
                <br />
                Windows APIs
                <br />
                JavaScript strings (internally)
              </td>
              <td className="p-3">
                Unicode processing libraries
                <br />
                Font rendering engines
                <br />
                Rarely used for storage/transmission
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">Normalization Form Trade-offs</h3>
          <p>
            <strong>Use NFC (Canonical Composition) when:</strong> storing user-generated content, comparing strings for equality, or indexing for search. NFC is the default for most systems and produces compact storage (combined characters use fewer bytes).
          </p>
          <p className="mt-3">
            <strong>Use NFD (Canonical Decomposition) when:</strong> implementing text processing that needs to manipulate individual diacritics, or when compatibility with legacy systems that use decomposed forms is required.
          </p>
          <p className="mt-3">
            <strong>Use NFKC/NFKD (Compatibility) when:</strong> implementing search that should match compatibility variants (e.g., 'ﬁ' ligature should match 'fi', superscript '²' should match '2'). NFKC/NFKD lose information (cannot round-trip), so do not use for storage — only for search indexes.
          </p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/normalization-forms.svg"
          alt="Unicode Normalization Forms Diagram"
          caption="NFD (decomposed) uses base character + combining accent while NFC (composed) uses precomposed characters - visually identical but different byte sequences"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Production encoding management requires discipline and operational rigor. These best practices prevent common mistakes and accelerate incident response.
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Enforce UTF-8 End-to-End:</strong> Use UTF-8 at every layer: HTTP headers (<code>Content-Type: application/json; charset=utf-8</code>), database connections (<code>?charset=utf8mb4</code>), database columns (utf8mb4, not utf8), file storage, message queues, and logs. Explicitly set charset in all configurations. Do not rely on defaults — defaults vary by platform and can change between versions.
          </li>
          <li>
            <strong>Normalize on Ingress:</strong> Normalize user input to NFC before storage. This ensures consistent byte sequences for equality checks and indexing. Do not normalize on read — normalize once on write. For search indexes, normalize both indexed terms and search queries to the same form. Document normalization strategy and enforce it in code reviews.
          </li>
          <li>
            <strong>Validate Encoding at Boundaries:</strong> Reject invalid UTF-8 byte sequences at ingress. Do not attempt to "fix" corrupted input — reject and log. Log byte length and character length for all text fields. Alert when byte/character ratio changes sharply — this signals upstream encoding changes. For legacy system integration, normalize to UTF-8 immediately and track conversion errors.
          </li>
          <li>
            <strong>Use Grapheme-Aware String Operations:</strong> For user-facing string operations (length limits, truncation, reversal), use grapheme-aware libraries. Standard string operations count code points, not graphemes. For username "max 20 characters", count graphemes (user-visible characters), not code points. For truncation, truncate at grapheme boundaries to avoid splitting emoji or combining sequences.
          </li>
          <li>
            <strong>Set Explicit Charset in HTTP Responses:</strong> Always include <code>charset=utf-8</code> in Content-Type headers. Browsers can guess charset from content, but guessing is error-prone. Explicit charset prevents mojibake in browsers. For JSON APIs, set <code>Content-Type: application/json; charset=utf-8</code>. For HTML, set <code>Content-Type: text/html; charset=utf-8</code> and include <code>&lt;meta charset="utf-8"&gt;</code> in HTML head.
          </li>
          <li>
            <strong>Test with International Text:</strong> Include non-ASCII characters in test suites: emoji (😀🇺🇸👨‍👩‍👧), CJK characters (中文，日本語，한국어), RTL text (العربية, עברית), combining diacritics (é = e + ́). Test validation (length limits), storage (database columns), search (indexing and querying), and display (rendering in UI). Automated tests catch encoding regressions before production deployment.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Even experienced engineers fall into encoding traps. These pitfalls are common sources of data corruption and search failures.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Double Encoding:</strong> Encoding UTF-8 bytes as UTF-8 again produces mojibake. For example, 'é' (U+00E9, UTF-8: 0xC3 0xA9) encoded again becomes 'Ã©' (UTF-8: 0xC3 0x83 0xC2 0xA9). This happens when frameworks decode bytes to strings, then application code re-encodes as UTF-8. Prevention: decode once at ingress, work with strings internally, encode once at egress. Log byte length at each boundary to detect double encoding.
          </li>
          <li>
            <strong>Byte-Length Limits on Character Data:</strong> VARCHAR(255) in MySQL limits bytes, not characters. A 255-byte limit accepts 255 ASCII characters but only 63 emoji (4 bytes each). Users with international names get rejected or silently truncated. Prevention: use character-length limits (application-side validation), increase column size (VARCHAR(1024) for UTF-8), or use TEXT columns for unlimited length.
          </li>
          <li>
            <strong>Mixing Normalization Forms:</strong> Storing some data as NFC and other data as NFD causes equality checks to fail. Two visually identical strings compare unequal because they have different byte sequences. Prevention: normalize all input to NFC before storage. For existing data, run migration to normalize all text fields. Add database constraints or triggers to enforce normalization.
          </li>
          <li>
            <strong>Database Collation Mismatch:</strong> Application uses case-insensitive search, but database collation is case-sensitive. Queries return no results for lowercase input. Prevention: set database/table/column collation explicitly (e.g., utf8mb4_unicode_ci for case-insensitive). Document collation requirements. Test search behavior with mixed-case input.
          </li>
          <li>
            <strong>Legacy Encoding in Message Queues:</strong> Message queues carry raw byte payloads. If producer uses UTF-8 and consumer assumes Latin-1, text is corrupted. Prevention: include encoding metadata in message schema (e.g., Protobuf, Avro). Standardize on UTF-8 for all string fields. Validate encoding at consumer ingress.
          </li>
        </ul>
      </section>

      <section>
        <h2>Production Case Studies</h2>
        <p>
          Real-world encoding incidents demonstrate how theoretical patterns manifest in production and how systematic debugging accelerates resolution.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Case Study 1: Emoji Corruption in Database</h3>
          <p className="mb-3">
            <strong>Symptom:</strong> User profiles with emoji in bio display as  (replacement glyphs). Database shows 4-byte sequences corrupted to 3-byte sequences.
          </p>
          <p className="mb-3">
            <strong>Debugging Process:</strong> Database schema showed column charset was utf8 (MySQL's old 3-byte UTF-8), not utf8mb4 (full 4-byte UTF-8). Application was sending valid UTF-8, but database truncated 4-byte sequences to 3 bytes.
          </p>
          <p className="mb-3">
            <strong>Root Cause:</strong> MySQL's <code>utf8</code> charset supports only 3-byte UTF-8 (up to U+FFFF). Emoji (U+1F600 and above) require 4 bytes. Database silently truncated 4-byte sequences, producing invalid UTF-8 that rendered as replacement glyphs.
          </p>
          <p className="mb-3">
            <strong>Resolution:</strong> Altered column charset to utf8mb4. Updated connection string to use utf8mb4. Ran migration to re-encode existing data. Emoji rendered correctly within 24 hours.
          </p>
          <p>
            <strong>Lesson:</strong> MySQL's <code>utf8</code> is not full UTF-8. Always use <code>utf8mb4</code> for UTF-8 support including emoji. Test with emoji during schema design, not after production deployment.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Case Study 2: Normalization Mismatch in Search</h3>
          <p className="mb-3">
            <strong>Symptom:</strong> User search for "José" returns no results, but database contains user named "José". Search works for ASCII names.
          </p>
          <p className="mb-3">
            <strong>Debugging Process:</strong> Database query showed stored name was 'José' (NFC: U+00E9), but search query was 'José' (NFD: U+0065 U+0301). Byte sequences differed, so equality check failed.
          </p>
          <p className="mb-3">
            <strong>Root Cause:</strong> User input came from different sources: web form (NFC), mobile app (NFD). Application did not normalize input before storage or search. Search compared raw byte sequences, which differed despite visually identical text.
          </p>
          <p className="mb-3">
            <strong>Resolution:</strong> Implemented NFC normalization on ingress for all user input. Normalized search queries to NFC before database lookup. Ran migration to normalize existing data. Search success rate increased from 70% to 99%.
          </p>
          <p>
            <strong>Lesson:</strong> Unicode allows multiple byte sequences for the same visible text. Normalize on ingress and search to ensure consistent comparisons. Do not assume visually identical text has identical byte sequences.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Case Study 3: URL Encoding Mismatch</h3>
          <p className="mb-3">
            <strong>Symptom:</strong> Search queries with non-ASCII characters return incorrect results. Query "café" returns results for "caf" + garbage characters.
          </p>
          <p className="mb-3">
            <strong>Debugging Process:</strong> URL logs showed query parameter was double-encoded: "café" became "caf%C3%83%C2%A9" instead of "caf%C3%A9". Application decoded once, leaving garbled text.
          </p>
          <p className="mb-3">
            <strong>Root Cause:</strong> Frontend encoded URL parameters manually, then HTTP client library encoded again. Double encoding produced invalid UTF-8 sequences. Backend decoded once, producing garbled text.
          </p>
          <p className="mb-3">
            <strong>Resolution:</strong> Removed manual URL encoding from frontend. Let HTTP client library handle encoding. Added URL decoding validation at backend (reject double-encoded URLs). Search queries worked correctly within 1 hour.
          </p>
          <p>
            <strong>Lesson:</strong> URL encoding should happen exactly once. Manual encoding plus library encoding causes double encoding. Trust HTTP client libraries to handle URL encoding. Validate decoded URLs at backend to detect encoding issues.
          </p>
        </div>
      </section>

      <section>
        <h2>Performance Benchmarks</h2>
        <p>
          Understanding encoding performance characteristics helps set realistic SLOs and identify bottlenecks.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">UTF-8 Byte Length by Character Type</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Character Type</th>
                <th className="p-2 text-left">Code Point Range</th>
                <th className="p-2 text-left">UTF-8 Bytes</th>
                <th className="p-2 text-left">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">ASCII</td>
                <td className="p-2">U+0000 to U+007F</td>
                <td className="p-2">1 byte</td>
                <td className="p-2">A-Z, 0-9, basic punctuation</td>
              </tr>
              <tr>
                <td className="p-2">Latin-1 Supplement</td>
                <td className="p-2">U+0080 to U+00FF</td>
                <td className="p-2">2 bytes</td>
                <td className="p-2">é, ñ, ü, ß</td>
              </tr>
              <tr>
                <td className="p-2">Extended Latin, Greek, Cyrillic</td>
                <td className="p-2">U+0100 to U+07FF</td>
                <td className="p-2">2 bytes</td>
                <td className="p-2">Č, Σ, П</td>
              </tr>
              <tr>
                <td className="p-2">CJK, Arabic, Hebrew</td>
                <td className="p-2">U+0800 to U+FFFF</td>
                <td className="p-2">3 bytes</td>
                <td className="p-2">中文，العربية, עברית</td>
              </tr>
              <tr>
                <td className="p-2">Emoji, Rare Characters</td>
                <td className="p-2">U+10000 to U+10FFFF</td>
                <td className="p-2">4 bytes</td>
                <td className="p-2">😀🇺🇸👨‍👩‍👧</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Normalization Overhead</h3>
          <ul className="space-y-2">
            <li>
              <strong>NFC Normalization:</strong> ~10-50ns per character. Negligible for short strings (&lt;1KB). measurable for long strings (&gt;100KB).
            </li>
            <li>
              <strong>NFKC Normalization:</strong> ~2-3× slower than NFC due to compatibility decomposition. Use only when compatibility matching is required.
            </li>
            <li>
              <strong>Recommendation:</strong> Normalize on ingress (once per write), not on read. Cache normalized values for frequently compared strings.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Cost Analysis</h2>
        <p>
          Encoding decisions directly impact storage and bandwidth costs. Understanding cost drivers helps optimize architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Storage Cost by Encoding</h3>
          <ul className="space-y-2">
            <li>
              <strong>UTF-8 (ASCII text):</strong> 1 byte per character. Most efficient for English/Latin text.
            </li>
            <li>
              <strong>UTF-8 (CJK text):</strong> 3 bytes per character. 3× storage cost vs ASCII.
            </li>
            <li>
              <strong>UTF-16 (CJK text):</strong> 2 bytes per character. More efficient than UTF-8 for CJK-heavy datasets.
            </li>
            <li>
              <strong>Impact:</strong> For multilingual datasets, UTF-8 storage can be 2-3× larger than ASCII-only datasets. Plan storage capacity accordingly.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Bandwidth Cost</h3>
          <ul className="space-y-2">
            <li>
              <strong>Compression:</strong> gzip/Brotli compress UTF-8 efficiently (50-80% reduction). Compression mitigates UTF-8 bandwidth overhead.
            </li>
            <li>
              <strong>API Design:</strong> For high-volume APIs, consider field selection (return only requested fields) to reduce payload size.
            </li>
            <li>
              <strong>Recommendation:</strong> Enable compression for all text responses. Monitor compressed payload size, not raw size.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is UTF-8 preferred over other encodings?</p>
            <p className="mt-2 text-sm">
              A: UTF-8 supports all Unicode characters (149,000+ characters across 167 scripts), is backward-compatible with ASCII (ASCII text is valid UTF-8), and is self-synchronizing (you can find character boundaries without decoding from the start). UTF-8 dominates the web (98% adoption) because it efficiently stores ASCII/Latin text (1 byte per character) while supporting all languages. UTF-16 and UTF-32 are used internally by some platforms (Java, JavaScript, Windows) but are less efficient for storage and transmission.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What causes mojibake (garbled text)?</p>
            <p className="mt-2 text-sm">
              A: Mojibake occurs when bytes encoded in one charset are decoded using a different charset. For example, UTF-8 bytes for 'é' (0xC3 0xA9) decoded as Latin-1 produce 'Ã©'. Common causes: missing charset in HTTP headers, database connection using wrong charset, legacy systems using ISO-8859-1, double encoding (encoding UTF-8 bytes as UTF-8 again). Prevention: enforce UTF-8 end-to-end, set explicit charset in all configurations, validate encoding at boundaries.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why does normalization matter?</p>
            <p className="mt-2 text-sm">
              A: Unicode allows multiple byte sequences to represent the same visible character. For example, 'é' can be a single code point (U+00E9, NFC) or two code points ('e' + combining acute accent: U+0065 U+0301, NFD). Without normalization, string comparisons fail — two visually identical strings compare unequal because they have different byte sequences. Normalization converts text to a canonical form (NFC, NFD, NFKC, NFKD) so that visually identical text has identical byte sequences.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between byte length and character length?</p>
            <p className="mt-2 text-sm">
              A: UTF-8 strings have two lengths: byte length (number of bytes) and character length (number of code points or graphemes). For ASCII text, these are identical (1 byte = 1 character). For emoji or CJK text, byte length can be 3-4× character length (emoji use 4 bytes, CJK uses 3 bytes). Systems that enforce byte-length limits (VARCHAR(255) in MySQL) reject valid input or silently truncate multi-byte characters. Systems that enforce character-length limits must count graphemes, not code points, to match user expectations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle emoji in backend systems?</p>
            <p className="mt-2 text-sm">
              A: Emoji require 4-byte UTF-8 (utf8mb4 in MySQL, not utf8). Ensure database columns, connection strings, and application encoding all support 4-byte UTF-8. For string operations (length limits, truncation), use grapheme-aware libraries — emoji can be multiple code points (👨‍👩‍👧 = man + ZWJ + woman + ZWJ + girl). Test with emoji during development, not after production deployment. Common failure: MySQL utf8 columns truncate emoji to 3 bytes, producing invalid UTF-8.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between NFC and NFKC normalization?</p>
            <p className="mt-2 text-sm">
              A: NFC (Canonical Composition) combines characters where possible (e + ́ → é). NFKC (Compatibility Composition) also normalizes compatibility characters (e.g., 'ﬁ' ligature → 'fi', superscript '²' → '2'). NFC preserves information (can round-trip), while NFKC loses information (cannot round-trip). Use NFC for storage and equality checks. Use NFKC only for search indexes where compatibility matching is required (user searching for 'fi' should find 'ﬁ'). Never use NFKC for storage — you lose the original text.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.unicode.org/versions/latest/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unicode Standard - Official Specification
            </a>
          </li>
          <li>
            <a
              href="https://www.unicode.org/reports/tr15/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unicode Normalization Forms (UAX #15)
            </a>
          </li>
          <li>
            <a
              href="https://www.unicode.org/reports/tr29/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unicode Text Segmentation (UAX #29) - Grapheme Clusters
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Glossary/UTF-8"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN Web Docs - UTF-8 Encoding
            </a>
          </li>
          <li>
            <a
              href="https://mysqlserverteam.com/mysql-utf8mb4-the-utf-8-that-supports-4-byte-utf8-fully/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MySQL Team - utf8mb4: The UTF-8 That Supports 4-Byte UTF-8 Fully
            </a>
          </li>
          <li>
            <a
              href="https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Joel Spolsky - The Absolute Minimum Every Software Developer Must Know About Unicode
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
