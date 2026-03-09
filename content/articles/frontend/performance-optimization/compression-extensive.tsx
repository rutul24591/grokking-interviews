"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { MermaidDiagram } from "@/components/articles/MermaidDiagram";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-compression-extensive",
  title: "Compression (Gzip, Brotli)",
  description: "Comprehensive guide to HTTP compression including Gzip, Brotli, and Zstandard — covering content-encoding negotiation, server configuration, pre-compression at build time, dynamic vs static compression strategies, and measuring compression effectiveness for production applications.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "compression",
  version: "extensive",
  wordCount: 10500,
  readingTime: 42,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "compression", "gzip", "brotli", "zstandard", "content-encoding", "transfer-size"],
  relatedTopics: ["bundle-size-optimization", "code-splitting", "critical-css", "resource-hints"],
};

export default function CompressionExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>HTTP compression</strong> is the process of reducing the size of textual resources (HTML, CSS, JavaScript,
          JSON, SVG) before they are transferred from server to client. The browser and server negotiate a compression
          algorithm via HTTP headers, the server compresses the response body, and the browser transparently decompresses
          it before parsing. The user sees no difference — the same bytes arrive — but the transfer happens significantly
          faster because fewer bytes travel over the wire.
        </p>
        <p>
          Web compression has a long history. The <code>Content-Encoding</code> header was formalized in HTTP/1.0 (RFC 1945,
          1996), and Gzip support shipped in every major browser by the early 2000s. Despite being one of the oldest
          performance optimizations available, compression remains one of the highest-impact, lowest-effort wins in web
          performance. A typical JavaScript bundle compresses by 60-80% with Gzip and 65-85% with Brotli — meaning a 500KB
          bundle might transfer as only 100-175KB.
        </p>
        <p>
          Brotli was developed by Google and published as RFC 7932 in 2016. It was specifically designed for HTTP compression
          and includes a built-in static dictionary of common web content patterns (HTML tags, CSS properties, JavaScript
          keywords), giving it a significant advantage over Gzip for web assets. As of 2025, Brotli is supported by over
          97% of browsers globally and has become the preferred compression algorithm for modern web applications. A newer
          contender, Zstandard (Zstd), offers exciting possibilities with its tunable compression levels and dictionary
          training capabilities, though browser support is still emerging.
        </p>
        <p>
          Understanding compression deeply matters for system design interviews because it sits at the intersection of
          networking, algorithms, and infrastructure. You need to know not just that compression exists, but when to apply
          it dynamically vs statically, how to configure it across different server environments, which content types benefit
          from it, and how to measure its effectiveness. These are the details that distinguish a senior engineer from
          someone who just knows "turn on Gzip."
        </p>
      </section>

      <section>
        <h2>How Compression Works</h2>
        <p>
          Before examining specific algorithms, it helps to understand the two fundamental techniques that underpin nearly
          all lossless compression used on the web: LZ77 and Huffman coding. Both Gzip and Brotli build on these foundations,
          though Brotli adds significant enhancements.
        </p>

        <h3 className="mt-6 font-semibold">LZ77 — Eliminating Repetition</h3>
        <p>
          LZ77 (Lempel-Ziv 1977) works by replacing repeated sequences of bytes with back-references. Instead of storing
          the same string twice, the compressor stores a pointer that says "go back X positions and copy Y bytes." Text
          content is highly repetitive — HTML has recurring tags, CSS has repeated property names, and JavaScript has
          repeated variable names and syntax patterns. LZ77 exploits this repetition aggressively.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Original string (simplified example):
"the cat sat on the mat near the cat"

// After LZ77-style encoding (conceptual):
"the cat sat on [back 18, copy 4]mat near [back 22, copy 8]"

// The repeated phrases "the " and "the cat" are replaced with
// back-references, reducing total byte count.

// In real web content, repetition is everywhere:
// HTML: <div class="card"><div class="card"><div class="card">
// CSS: margin: 0; padding: 0; margin: 0; padding: 0;
// JS: function handleClick() { ... } function handleSubmit() { ... }`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Huffman Coding — Optimizing Byte Representation</h3>
        <p>
          Huffman coding assigns shorter bit sequences to more frequently occurring bytes and longer sequences to rare bytes.
          In standard ASCII, every character takes 8 bits. But if the letter "e" appears 1000 times and the letter "z"
          appears once, it makes sense to represent "e" with fewer bits. Huffman coding builds a binary tree based on
          frequency analysis of the input, producing an optimal prefix-free code.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Simplified Huffman coding example:
// Standard ASCII: every character = 8 bits

// Frequency analysis of a CSS file:
// ':' appears 500 times  → Huffman code: 00      (2 bits)
// ';' appears 480 times  → Huffman code: 01      (2 bits)
// ' ' appears 450 times  → Huffman code: 10      (2 bits)
// 'o' appears 200 times  → Huffman code: 110     (3 bits)
// 'Q' appears 1 time     → Huffman code: 1110101 (7 bits)

// The most common characters shrink from 8 bits to 2-3 bits.
// Rare characters may expand, but the net savings are large
// because common characters dominate the content.`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Putting It Together: The Compression Pipeline</h3>
        <p>
          Both Gzip and Brotli apply these techniques in sequence: first LZ77 finds repeated sequences and replaces them
          with back-references, then Huffman coding (or a variant) encodes the resulting symbols with variable-length codes.
          The compressor can tune how much effort it spends searching for matches (the "compression level"), trading CPU
          time for better compression ratios. Higher levels search larger windows and try more match combinations.
        </p>

        <MermaidDiagram
          chart={`flowchart LR
    A[Raw Text\n500 KB] --> B[LZ77\nDuplicate Elimination]
    B --> C[Huffman Coding\nBit Optimization]
    C --> D[Compressed\n~120 KB]

    style A fill:#ef4444,color:#fff
    style B fill:#f59e0b,color:#000
    style C fill:#3b82f6,color:#fff
    style D fill:#22c55e,color:#fff`}
          caption="Two-stage compression pipeline: LZ77 eliminates repeated sequences, Huffman coding optimizes bit representation"
        />
      </section>

      <section>
        <h2>Content-Encoding Negotiation</h2>
        <p>
          HTTP compression relies on a negotiation mechanism between browser and server. The browser advertises which
          compression algorithms it supports, and the server selects the best one it can provide. This happens transparently
          on every request — the browser and server agree on encoding without any JavaScript or application-level code.
        </p>

        <MermaidDiagram
          chart={`sequenceDiagram
    participant B as Browser
    participant S as Server / CDN

    B->>S: GET /bundle.js<br/>Accept-Encoding: gzip, deflate, br
    Note over S: Server checks:<br/>1. Does client support br?<br/>2. Is Brotli available?<br/>3. Is content compressible?
    S-->>B: 200 OK<br/>Content-Encoding: br<br/>Content-Type: application/javascript<br/>Content-Length: 94521<br/>[compressed body]
    Note over B: Browser detects Content-Encoding: br<br/>Decompresses with Brotli<br/>Passes raw JS to parser

    B->>S: GET /hero.webp<br/>Accept-Encoding: gzip, deflate, br
    Note over S: Image is already compressed<br/>No additional compression needed
    S-->>B: 200 OK<br/>(no Content-Encoding header)<br/>Content-Type: image/webp<br/>[raw image bytes]`}
          caption="Content-Encoding negotiation — the browser advertises supported algorithms, the server picks the best match"
        />

        <p>
          Key details about the negotiation process:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Accept-Encoding header:</strong> Sent by the browser on every request. The value <code>gzip, deflate, br</code> means
            "I support Gzip, Deflate, and Brotli." Modern browsers also send quality values like <code>br;q=1.0, gzip;q=0.8</code> to
            indicate preference order.
          </li>
          <li>
            <strong>Content-Encoding header:</strong> Sent by the server in the response. Tells the browser which algorithm
            was used so it knows how to decompress. If absent, the response body is uncompressed.
          </li>
          <li>
            <strong>Vary: Accept-Encoding:</strong> The server should include this header so that caches (CDNs, proxies)
            store separate versions for different encodings. Without it, a cache might serve a Brotli-compressed response
            to a client that only supports Gzip.
          </li>
          <li>
            <strong>Transfer-Encoding vs Content-Encoding:</strong> These are often confused. <code>Content-Encoding</code> is
            an end-to-end header — the content is compressed and the client decompresses it. <code>Transfer-Encoding</code> is
            hop-by-hop — applied between adjacent nodes in the network (e.g., chunked transfer). Compression uses
            <code>Content-Encoding</code>.
          </li>
          <li>
            <strong>Transparent to application code:</strong> Neither the server-side framework nor the client-side
            JavaScript needs to handle compression/decompression. The HTTP layer handles it. A <code>fetch()</code> call
            receives the fully decompressed response — <code>response.text()</code> returns the original string.
          </li>
        </ul>
      </section>

      <section>
        <h2>Gzip Deep Dive</h2>
        <p>
          Gzip has been the workhorse of web compression since the late 1990s. It uses the DEFLATE algorithm (RFC 1951),
          which combines LZ77 with Huffman coding, wrapped in a Gzip container format (RFC 1952) that adds a header with
          metadata (timestamp, OS type) and a CRC32 checksum for integrity verification.
        </p>

        <h3 className="mt-6 font-semibold">Compression Levels</h3>
        <p>
          Gzip offers compression levels from 1 (fastest, least compression) to 9 (slowest, best compression). The default
          is typically level 6, which provides a good balance. The difference between levels 6 and 9 is often only 2-5%
          smaller output but 2-3x slower compression. For dynamic (on-the-fly) compression, levels 4-6 are recommended.
          For pre-compressed static assets, level 9 is fine since the compression cost is paid once at build time.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Gzip compression levels — typical results for a 500KB JS bundle:
//
// Level 1:  ~165 KB  (67% reduction)  — 5ms compression time
// Level 4:  ~140 KB  (72% reduction)  — 15ms compression time
// Level 6:  ~132 KB  (74% reduction)  — 30ms compression time  [default]
// Level 9:  ~128 KB  (74.4% reduction) — 90ms compression time
//
// Notice: Level 6→9 saves only ~4KB but triples compression time.
// For dynamic compression, the CPU cost of level 9 is rarely justified.`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Gzip Window Size</h3>
        <p>
          Gzip uses a sliding window of up to 32KB for LZ77 back-references. This means it can only reference duplicates
          within the last 32KB of uncompressed data. For large files, this limits compression effectiveness — a pattern
          that repeats every 50KB would be missed. Brotli's larger window (up to 16MB) is one reason it achieves better
          ratios on larger files.
        </p>

        <h3 className="mt-6 font-semibold">Strengths and Limitations</h3>
        <ul className="space-y-2">
          <li>
            <strong>Universal support:</strong> Every browser, server, CDN, proxy, and HTTP library supports Gzip. It is
            the safest default when you need maximum compatibility.
          </li>
          <li>
            <strong>Fast decompression:</strong> Gzip decompresses very quickly, which matters on low-powered mobile
            devices. The decompression speed is comparable to Brotli at equivalent compression ratios.
          </li>
          <li>
            <strong>Fast compression at low levels:</strong> Gzip at level 1-4 is extremely fast, making it suitable for
            compressing dynamic API responses where latency matters.
          </li>
          <li>
            <strong>No HTTPS requirement:</strong> Unlike Brotli, Gzip works over plain HTTP connections. This matters
            for internal services, development environments, and legacy systems.
          </li>
          <li>
            <strong>Lower compression ratio:</strong> On web content, Gzip typically achieves 60-75% reduction, while
            Brotli achieves 65-85%. The gap is most pronounced on HTML and CSS where Brotli's static dictionary shines.
          </li>
        </ul>
      </section>

      <section>
        <h2>Brotli Deep Dive</h2>
        <p>
          Brotli (RFC 7932) was developed by Google engineers Jyrki Alakuijala and Zoltan Szabadka, released in 2015.
          The name comes from a Swiss German word for a type of bread roll. Brotli was designed specifically for HTTP
          compression and improves on Gzip in three major ways: a larger sliding window, context modeling, and a built-in
          static dictionary.
        </p>

        <h3 className="mt-6 font-semibold">Static Dictionary</h3>
        <p>
          Brotli's most distinctive feature is its 120KB built-in dictionary of common web strings. This dictionary
          contains frequent HTML tags (<code>{'<div class="'}</code>, <code>{'<script src="'}</code>),
          CSS properties (<code>font-family:</code>, <code>background-color:</code>), JavaScript tokens
          (<code>function</code>, <code>return</code>, <code>undefined</code>), and common English words. When
          compressing web content, Brotli can reference these dictionary entries instead of encoding them from scratch.
          This is why Brotli's advantage over Gzip is most pronounced on HTML, CSS, and JavaScript — precisely the
          content the dictionary was designed for.
        </p>

        <h3 className="mt-6 font-semibold">Compression Levels</h3>
        <p>
          Brotli offers levels 0-11. Levels 0-4 are comparable in speed to Gzip but produce slightly better output.
          Levels 5-9 progressively trade speed for ratio. Levels 10-11 are extremely slow (10-100x slower than
          Gzip 9) but produce the smallest possible output. These highest levels are only suitable for pre-compression
          of static assets where the compression cost is paid once.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Brotli compression levels — typical results for a 500KB JS bundle:
//
// Level 0:   ~155 KB  (69% reduction)  — 3ms compression time
// Level 4:   ~128 KB  (74% reduction)  — 20ms compression time
// Level 6:   ~118 KB  (76% reduction)  — 50ms compression time
// Level 9:   ~112 KB  (78% reduction)  — 200ms compression time
// Level 11:  ~105 KB  (79% reduction)  — 2500ms compression time
//
// For dynamic compression: use levels 4-6 (competitive with Gzip speed)
// For static pre-compression: use level 11 (pay the cost once at build time)
// Level 11 is ~20KB smaller than Gzip 9 on the same file — significant
// when multiplied across millions of requests.`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">HTTPS-Only Requirement</h3>
        <p>
          Browsers only accept Brotli over HTTPS connections. This is not a limitation of the algorithm itself but a
          deliberate decision to prevent issues with broken intermediary proxies. Some older proxies and firewalls
          do not understand the <code>br</code> content encoding and would corrupt the response or return errors.
          Since HTTPS encrypts the payload, intermediaries cannot inspect or modify the Content-Encoding, making Brotli
          safe to use. In practice, this is rarely a limitation since HTTPS is now the standard for production web
          applications — but it means Brotli will not activate on <code>http://localhost</code> during development unless
          you configure a local HTTPS certificate.
        </p>

        <h3 className="mt-6 font-semibold">Larger Sliding Window</h3>
        <p>
          Brotli supports a sliding window of up to 16MB (compared to Gzip's 32KB). This means it can find and reference
          duplicate patterns across much larger spans of content. For large JavaScript bundles (1MB+), this larger window
          allows Brotli to find repetitions that Gzip completely misses, contributing to its superior compression ratios
          on larger files. The window size is configurable and scales with the compression level.
        </p>

        <h3 className="mt-6 font-semibold">Context Modeling</h3>
        <p>
          Brotli uses context modeling to predict the probability of the next byte based on the preceding bytes. For
          example, after seeing <code>{'<div c'}</code>, the probability that the next characters are <code>lass=</code> is
          very high in HTML. Brotli uses separate probability models for different contexts (literals after different
          character types), allowing it to encode predictable sequences with fewer bits. This is more sophisticated than
          Gzip's static Huffman coding approach.
        </p>
      </section>

      <section>
        <h2>Comparison Table</h2>
        <p>
          The following table compares Gzip, Brotli, and the emerging Zstandard algorithm across key dimensions that
          matter for production web applications:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-3 text-left">Dimension</th>
                <th className="p-3 text-left">Gzip</th>
                <th className="p-3 text-left">Brotli</th>
                <th className="p-3 text-left">Zstandard (Zstd)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3">RFC / Specification</td>
                <td className="p-3">RFC 1952 (1996)</td>
                <td className="p-3">RFC 7932 (2016)</td>
                <td className="p-3">RFC 8478 (2018)</td>
              </tr>
              <tr>
                <td className="p-3">Underlying algorithm</td>
                <td className="p-3">DEFLATE (LZ77 + Huffman)</td>
                <td className="p-3">LZ77 + Huffman + static dictionary + context modeling</td>
                <td className="p-3">LZ77 + Huffman + FSE (Finite State Entropy) + dictionary</td>
              </tr>
              <tr>
                <td className="p-3">Compression levels</td>
                <td className="p-3">1-9</td>
                <td className="p-3">0-11</td>
                <td className="p-3">1-22 (negative levels for ultra-fast)</td>
              </tr>
              <tr>
                <td className="p-3">Typical ratio (JS bundle)</td>
                <td className="p-3">60-75% reduction</td>
                <td className="p-3">65-85% reduction</td>
                <td className="p-3">65-80% reduction</td>
              </tr>
              <tr>
                <td className="p-3">Compression speed</td>
                <td className="p-3">Fast (levels 1-6)</td>
                <td className="p-3">Slow at high levels (10-11), fast at low (0-4)</td>
                <td className="p-3">Very fast at all levels</td>
              </tr>
              <tr>
                <td className="p-3">Decompression speed</td>
                <td className="p-3">Fast</td>
                <td className="p-3">Fast (comparable to Gzip)</td>
                <td className="p-3">Very fast (faster than Gzip)</td>
              </tr>
              <tr>
                <td className="p-3">Sliding window</td>
                <td className="p-3">32 KB</td>
                <td className="p-3">Up to 16 MB</td>
                <td className="p-3">Up to 128 MB</td>
              </tr>
              <tr>
                <td className="p-3">Static dictionary</td>
                <td className="p-3">No</td>
                <td className="p-3">Yes (120KB, web-optimized)</td>
                <td className="p-3">Trainable custom dictionaries</td>
              </tr>
              <tr>
                <td className="p-3">Browser support</td>
                <td className="p-3">100%</td>
                <td className="p-3">97%+ (all modern browsers)</td>
                <td className="p-3">Limited (Chrome 123+, partial)</td>
              </tr>
              <tr>
                <td className="p-3">HTTPS required</td>
                <td className="p-3">No</td>
                <td className="p-3">Yes (browser enforcement)</td>
                <td className="p-3">Yes (browser enforcement)</td>
              </tr>
              <tr>
                <td className="p-3">Content-Encoding value</td>
                <td className="p-3"><code>gzip</code></td>
                <td className="p-3"><code>br</code></td>
                <td className="p-3"><code>zstd</code></td>
              </tr>
              <tr>
                <td className="p-3">Best for</td>
                <td className="p-3">Dynamic compression, legacy compatibility</td>
                <td className="p-3">Static pre-compression, modern web</td>
                <td className="p-3">High-throughput APIs, real-time compression</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Server Configuration</h2>
        <p>
          Configuring compression correctly varies by server environment. Below are production-ready configurations for
          the most common setups in the JavaScript/React ecosystem.
        </p>

        <h3 className="mt-6 font-semibold">Nginx</h3>
        <p>
          Nginx is the most common reverse proxy for Node.js applications. It handles compression efficiently at the
          proxy layer, offloading CPU work from your application server.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`# /etc/nginx/conf.d/compression.conf

# === Gzip Configuration ===
gzip on;
gzip_vary on;                    # Add Vary: Accept-Encoding header
gzip_proxied any;                # Compress responses from upstream proxies too
gzip_comp_level 6;               # Level 6 — good ratio/speed balance
gzip_min_length 256;             # Don't compress tiny responses (<256 bytes)
gzip_buffers 16 8k;              # Buffer allocation for compression

# MIME types to compress — all text-based content
gzip_types
  text/plain
  text/css
  text/javascript
  application/javascript
  application/json
  application/xml
  application/rss+xml
  application/atom+xml
  image/svg+xml
  font/woff2
  application/wasm;

# === Brotli Configuration ===
# Requires ngx_brotli module (not included by default)
# Install: https://github.com/google/ngx_brotli

brotli on;                       # Enable dynamic Brotli compression
brotli_comp_level 6;             # Level 6 for dynamic responses
brotli_static on;                # Serve pre-compressed .br files if available
brotli_min_length 256;

brotli_types
  text/plain
  text/css
  text/javascript
  application/javascript
  application/json
  application/xml
  image/svg+xml
  font/woff2
  application/wasm;

# === Serving Pre-Compressed Files ===
# If bundle.js.br exists, Nginx serves it directly without compressing on-the-fly.
# If bundle.js.gz exists but no .br, serve the .gz version.
# Falls back to dynamic compression if no pre-compressed file exists.
#
# This is the ideal setup: build-time compression at max level,
# zero runtime CPU cost for compression.`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Express / Node.js</h3>
        <p>
          For Node.js applications without a reverse proxy (or during development), the <code>compression</code> middleware
          handles Gzip. For Brotli support, use <code>shrink-ray-current</code> or handle it manually with Node's built-in
          <code>zlib</code> module.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Express with Gzip compression ===
// pnpm add compression

const express = require('express');
const compression = require('compression');

const app = express();

// Basic Gzip setup — handles most cases
app.use(compression({
  level: 6,                       // Compression level (1-9)
  threshold: 1024,                // Only compress responses > 1KB
  filter: (req, res) => {
    // Don't compress server-sent events
    if (req.headers['accept'] === 'text/event-stream') {
      return false;
    }
    // Use default filter (checks Content-Type against compressible types)
    return compression.filter(req, res);
  },
}));

// === Express with Brotli + Gzip via shrink-ray-current ===
// pnpm add shrink-ray-current

const shrinkRay = require('shrink-ray-current');

app.use(shrinkRay({
  brotli: {
    quality: 4,                   // Brotli level 4 for dynamic responses
  },
  zlib: {
    level: 6,                     // Gzip fallback at level 6
  },
  threshold: 1024,
  filter: (req, res) => {
    return shrinkRay.filter(req, res);
  },
}));

// === Manual Brotli with Node.js zlib (built-in since Node 10.16) ===
const zlib = require('zlib');
const { promisify } = require('util');
const brotliCompress = promisify(zlib.brotliCompress);

app.get('/api/data', async (req, res) => {
  const data = JSON.stringify(await fetchLargeDataset());
  const acceptEncoding = req.headers['accept-encoding'] || '';

  if (acceptEncoding.includes('br')) {
    const compressed = await brotliCompress(Buffer.from(data), {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
      },
    });
    res.set('Content-Encoding', 'br');
    res.set('Content-Type', 'application/json');
    res.set('Vary', 'Accept-Encoding');
    res.send(compressed);
  } else if (acceptEncoding.includes('gzip')) {
    const gzipCompress = promisify(zlib.gzip);
    const compressed = await gzipCompress(Buffer.from(data));
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'application/json');
    res.set('Vary', 'Accept-Encoding');
    res.send(compressed);
  } else {
    res.json(JSON.parse(data));
  }
});

app.listen(3000);`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Next.js</h3>
        <p>
          Next.js enables Gzip compression by default in production. You can configure compression behavior in
          <code>next.config.js</code>. However, for production deployments behind a CDN or reverse proxy, it is common
          to disable Next.js built-in compression and let the infrastructure layer handle it more efficiently.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js Gzip compression is ON by default.
  // Disable it when your CDN / reverse proxy handles compression:
  compress: false,

  // If using output: 'standalone', compression is also handled
  // by the standalone server — disable if behind Nginx/CDN.
  output: 'standalone',
};

module.exports = nextConfig;

// Why disable built-in compression?
// 1. Nginx/CDN compress more efficiently (native C code vs Node.js)
// 2. CDN can serve pre-compressed files (.br, .gz) with zero CPU cost
// 3. Avoids double-compression if both Node.js and proxy compress
// 4. CDN handles Brotli natively — Next.js only does Gzip by default`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">CDN Configuration</h3>
        <p>
          Major CDNs (Cloudflare, AWS CloudFront, Fastly, Vercel Edge Network) handle compression automatically but
          offer important configuration options. The CDN approach is ideal because compression happens at the edge,
          close to the user, and CDNs can cache compressed versions separately.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Cloudflare ===
// Brotli: Enabled by default on all plans (toggle in Speed → Optimization)
// Gzip: Always enabled as fallback
// Cloudflare automatically handles Accept-Encoding negotiation
// Pre-compressed files: Upload .br/.gz to origin, Cloudflare passes through

// === AWS CloudFront ===
// CloudFront configuration via behavior settings:
{
  "CacheBehavior": {
    "Compress": true,          // Enable automatic compression
    "CachedMethods": ["GET", "HEAD"],
    "ForwardedValues": {
      "Headers": ["Accept-Encoding"]  // Vary cache by encoding
    }
  }
}
// CloudFront supports Gzip and Brotli (added 2020)
// It compresses at the edge if origin sends uncompressed
// If origin sends pre-compressed, CloudFront passes through

// === Vercel (for Next.js deployments) ===
// Brotli and Gzip are handled automatically
// Static assets are pre-compressed at deploy time (Brotli 11, Gzip 9)
// Dynamic responses (API routes, SSR) compressed on-the-fly
// No configuration needed — it just works`}</code>
        </pre>
      </section>

      <section>
        <h2>Pre-Compression at Build Time</h2>
        <p>
          Dynamic compression (compressing on every request) wastes CPU cycles because the same file produces the same
          compressed output every time. Pre-compression generates <code>.gz</code> and <code>.br</code> files at build time,
          using maximum compression levels that would be too slow for real-time use. The server then serves these
          pre-compressed files directly, with zero compression CPU cost at request time.
        </p>

        <h3 className="mt-6 font-semibold">Webpack Configuration</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// webpack.config.js
// pnpm add -D compression-webpack-plugin

const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');

module.exports = {
  // ... other config
  plugins: [
    // Generate .gz files (Gzip level 9)
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\\.(js|css|html|svg|json|wasm)$/,
      threshold: 1024,             // Only compress files > 1KB
      minRatio: 0.8,               // Only keep if 20%+ smaller
      compressionOptions: {
        level: 9,                  // Maximum Gzip compression
      },
    }),

    // Generate .br files (Brotli level 11)
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\\.(js|css|html|svg|json|wasm)$/,
      threshold: 1024,
      minRatio: 0.8,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,  // Maximum Brotli
        },
      },
    }),
  ],
};

// Build output:
// dist/
//   bundle.js        (500 KB)  — original
//   bundle.js.gz     (128 KB)  — Gzip 9
//   bundle.js.br     (105 KB)  — Brotli 11
//   styles.css       (80 KB)
//   styles.css.gz    (18 KB)
//   styles.css.br    (14 KB)`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Vite Configuration</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// vite.config.js
// pnpm add -D vite-plugin-compression

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),

    // Gzip pre-compression
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      compressionOptions: { level: 9 },
    }),

    // Brotli pre-compression
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      compressionOptions: {
        params: { 0: 11 },        // BROTLI_PARAM_QUALITY = 11
      },
    }),
  ],
});`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Custom Build Script</h3>
        <p>
          For build systems that don't have a plugin, or when you want full control, a Node.js script can compress all
          static assets after the build completes:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// scripts/compress-assets.js
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { promisify } = require('util');
const glob = require('glob');

const gzip = promisify(zlib.gzip);
const brotli = promisify(zlib.brotliCompress);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const COMPRESSIBLE = /\\.(js|css|html|svg|json|xml|txt|wasm|map)$/;
const MIN_SIZE = 1024; // 1KB minimum

async function compressFile(filePath) {
  const content = await readFile(filePath);
  if (content.length < MIN_SIZE) return;

  const [gzipped, brotlied] = await Promise.all([
    gzip(content, { level: 9 }),
    brotli(content, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        [zlib.constants.BROTLI_PARAM_SIZE_HINT]: content.length,
      },
    }),
  ]);

  await Promise.all([
    writeFile(filePath + '.gz', gzipped),
    writeFile(filePath + '.br', brotlied),
  ]);

  const gzRatio = ((1 - gzipped.length / content.length) * 100).toFixed(1);
  const brRatio = ((1 - brotlied.length / content.length) * 100).toFixed(1);
  console.log(
    \`\${path.basename(filePath)}: \${content.length}B → gz:\${gzipped.length}B (-\${gzRatio}%) br:\${brotlied.length}B (-\${brRatio}%)\`
  );
}

async function main() {
  const files = glob.sync('dist/**/*').filter(f => COMPRESSIBLE.test(f));
  console.log(\`Compressing \${files.length} files...\\n\`);
  await Promise.all(files.map(compressFile));
  console.log('\\nDone! Pre-compressed .gz and .br files generated.');
}

main().catch(console.error);

// Usage in package.json:
// "scripts": {
//   "build": "next build && node scripts/compress-assets.js"
// }`}</code>
        </pre>
      </section>

      <section>
        <h2>Dynamic vs Static Compression</h2>
        <p>
          One of the most important architectural decisions around compression is choosing between dynamic (on-the-fly)
          and static (pre-compressed) compression — or more commonly, a combination of both. The following flowchart
          illustrates the decision process a well-configured server follows when serving a request:
        </p>

        <MermaidDiagram
          chart={`flowchart TD
    A[Incoming Request] --> B{Is it a static asset?<br/>JS, CSS, HTML, SVG}
    B -->|Yes| C{Pre-compressed file exists?<br/>.br or .gz}
    B -->|No| D{Is response compressible?<br/>JSON, XML, text}

    C -->|.br exists + client supports br| E[Serve .br file<br/>Zero CPU cost<br/>Best ratio]
    C -->|.gz exists + no br support| F[Serve .gz file<br/>Zero CPU cost<br/>Good ratio]
    C -->|No pre-compressed file| G[Dynamic Brotli 4-6<br/>Moderate CPU<br/>Good ratio]

    D -->|Yes| H[Dynamic Gzip 4-6<br/>or Brotli 4<br/>Low CPU overhead]
    D -->|No| I[Serve uncompressed<br/>Images, video, binaries]

    style E fill:#22c55e,color:#fff
    style F fill:#3b82f6,color:#fff
    style G fill:#f59e0b,color:#000
    style H fill:#f59e0b,color:#000
    style I fill:#6b7280,color:#fff`}
          caption="Server decision tree for compression — pre-compressed static assets are served with zero CPU cost, dynamic responses are compressed on-the-fly at moderate levels"
        />

        <h3 className="mt-6 font-semibold">When to Use Static Pre-Compression</h3>
        <ul className="space-y-2">
          <li>
            <strong>JavaScript bundles:</strong> These are the most impactful targets. A single app bundle may be requested
            millions of times per day. Pre-compressing at Brotli 11 once saves thousands of CPU-hours compared to
            compressing dynamically on every request.
          </li>
          <li>
            <strong>CSS files:</strong> Same logic as JavaScript. CSS is highly compressible due to repetitive property names,
            and the compressed output never changes until the next deployment.
          </li>
          <li>
            <strong>HTML for static pages:</strong> If you use Static Site Generation (SSG), the HTML output is known at
            build time and can be pre-compressed. Server-rendered (SSR) pages must be compressed dynamically since the HTML
            varies per request.
          </li>
          <li>
            <strong>SVG assets, JSON data files, WASM modules:</strong> Any file that is deployed as a static asset and
            served unchanged to every user.
          </li>
        </ul>

        <h3 className="mt-6 font-semibold">When to Use Dynamic Compression</h3>
        <ul className="space-y-2">
          <li>
            <strong>API responses:</strong> JSON from REST or GraphQL endpoints changes per request, so it must be compressed
            dynamically. Use Gzip 4-6 or Brotli 3-4 for low latency.
          </li>
          <li>
            <strong>Server-rendered HTML:</strong> SSR pages are unique per request (user-specific content, session data),
            requiring dynamic compression.
          </li>
          <li>
            <strong>Real-time data:</strong> WebSocket messages, Server-Sent Events, and streaming responses need per-message
            compression. WebSockets have their own <code>permessage-deflate</code> extension for this purpose.
          </li>
        </ul>

        <h3 className="mt-6 font-semibold">The Hybrid Approach (Recommended)</h3>
        <p>
          Production systems should use both: pre-compress all static assets at maximum level during CI/CD, and configure
          the server for dynamic compression at moderate levels as a fallback for API responses and SSR pages. The server
          checks for pre-compressed files first, then falls back to dynamic compression, then serves uncompressed as a
          last resort.
        </p>
      </section>

      <section>
        <h2>What to Compress</h2>
        <p>
          Not all content benefits from compression. Text-based formats are highly compressible, but binary formats that
          are already compressed (images, video, archives) will not shrink further and may even grow slightly due to
          compression overhead. Compressing already-compressed content wastes CPU cycles.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-3 text-left">Content Type</th>
                <th className="p-3 text-left">MIME Type</th>
                <th className="p-3 text-left">Compress?</th>
                <th className="p-3 text-left">Typical Reduction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3">JavaScript</td>
                <td className="p-3"><code>application/javascript</code></td>
                <td className="p-3">Yes</td>
                <td className="p-3">65-80%</td>
              </tr>
              <tr>
                <td className="p-3">CSS</td>
                <td className="p-3"><code>text/css</code></td>
                <td className="p-3">Yes</td>
                <td className="p-3">70-85%</td>
              </tr>
              <tr>
                <td className="p-3">HTML</td>
                <td className="p-3"><code>text/html</code></td>
                <td className="p-3">Yes</td>
                <td className="p-3">60-80%</td>
              </tr>
              <tr>
                <td className="p-3">JSON</td>
                <td className="p-3"><code>application/json</code></td>
                <td className="p-3">Yes</td>
                <td className="p-3">70-90%</td>
              </tr>
              <tr>
                <td className="p-3">SVG</td>
                <td className="p-3"><code>image/svg+xml</code></td>
                <td className="p-3">Yes</td>
                <td className="p-3">50-75%</td>
              </tr>
              <tr>
                <td className="p-3">XML / RSS</td>
                <td className="p-3"><code>application/xml</code></td>
                <td className="p-3">Yes</td>
                <td className="p-3">65-85%</td>
              </tr>
              <tr>
                <td className="p-3">Plain text</td>
                <td className="p-3"><code>text/plain</code></td>
                <td className="p-3">Yes</td>
                <td className="p-3">50-70%</td>
              </tr>
              <tr>
                <td className="p-3">WebAssembly</td>
                <td className="p-3"><code>application/wasm</code></td>
                <td className="p-3">Yes</td>
                <td className="p-3">20-50%</td>
              </tr>
              <tr>
                <td className="p-3">Source maps</td>
                <td className="p-3"><code>application/json</code></td>
                <td className="p-3">Yes</td>
                <td className="p-3">80-92%</td>
              </tr>
              <tr>
                <td className="p-3">JPEG / WebP / AVIF</td>
                <td className="p-3"><code>image/jpeg</code></td>
                <td className="p-3">No</td>
                <td className="p-3">0-2% (already compressed)</td>
              </tr>
              <tr>
                <td className="p-3">PNG</td>
                <td className="p-3"><code>image/png</code></td>
                <td className="p-3">No</td>
                <td className="p-3">0-5% (uses DEFLATE internally)</td>
              </tr>
              <tr>
                <td className="p-3">Video (MP4, WebM)</td>
                <td className="p-3"><code>video/mp4</code></td>
                <td className="p-3">No</td>
                <td className="p-3">0% (already compressed)</td>
              </tr>
              <tr>
                <td className="p-3">WOFF2 fonts</td>
                <td className="p-3"><code>font/woff2</code></td>
                <td className="p-3">No</td>
                <td className="p-3">0-1% (uses Brotli internally)</td>
              </tr>
              <tr>
                <td className="p-3">ZIP / tar.gz</td>
                <td className="p-3"><code>application/zip</code></td>
                <td className="p-3">No</td>
                <td className="p-3">0% (already compressed)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          A useful rule of thumb: if a file format already uses compression internally (JPEG, PNG, WOFF2, ZIP, MP4),
          do not apply HTTP compression. The bytes are already entropy-coded, and a second pass cannot find additional
          redundancy. Configure your server to skip these MIME types — compressing them wastes CPU and adds latency
          without reducing transfer size.
        </p>
      </section>

      <section>
        <h2>Zstandard (Zstd) — Emerging Alternative</h2>
        <p>
          Zstandard (Zstd) was developed by Yann Collet at Facebook and published as RFC 8478 in 2018. While it has been
          widely adopted for server-side use cases (database compression, log storage, package distribution), browser
          support for HTTP content-encoding is still nascent. Chrome added experimental <code>zstd</code> content-encoding
          support in version 123 (March 2024), and other browsers are evaluating it.
        </p>

        <h3 className="mt-6 font-semibold">Why Zstd Matters</h3>
        <ul className="space-y-2">
          <li>
            <strong>Speed/ratio balance:</strong> Zstd at level 3 compresses as well as Gzip 9 but 5-10x faster. At level
            19, it matches Brotli 11 quality but decompresses 3-5x faster. This makes it exceptional for dynamic
            compression where CPU cost matters.
          </li>
          <li>
            <strong>Trainable dictionaries:</strong> Unlike Brotli's fixed dictionary, Zstd can be trained on your specific
            data. Feed it 1000 sample API responses, and it learns patterns unique to your data format. This is especially
            powerful for small payloads (under 1KB) where traditional compressors struggle.
          </li>
          <li>
            <strong>Negative compression levels:</strong> Zstd supports levels from -7 to 22. Negative levels are faster
            than memcpy for some workloads — they sacrifice compression ratio for extreme speed, useful for real-time
            compression of ephemeral data.
          </li>
          <li>
            <strong>Streaming:</strong> Zstd has excellent streaming support, making it ideal for compressing chunked
            responses, Server-Sent Events, or large dataset downloads.
          </li>
        </ul>

        <h3 className="mt-6 font-semibold">Using Zstd in Node.js</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// pnpm add @aspect-build/zstd  (or similar binding)

const { compress, decompress, train } = require('@aspect-build/zstd');

// Basic compression
const input = Buffer.from(JSON.stringify(largeApiResponse));
const compressed = compress(input, 3);  // Level 3 — fast, good ratio

console.log(\`\${input.length} → \${compressed.length} (\${((1 - compressed.length/input.length) * 100).toFixed(1)}% reduction)\`);

// Dictionary training — powerful for small, repetitive payloads
const samples = apiResponses.map(r => Buffer.from(JSON.stringify(r)));
const dictionary = train(samples, { dictSize: 32768 });  // 32KB dict

// Compression with trained dictionary — much better for small payloads
const withDict = compress(input, 3, dictionary);
console.log(\`With dictionary: \${input.length} → \${withDict.length}\`);
// For small JSON payloads (<1KB), dictionaries can improve ratio by 40-60%`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Current Status for Web</h3>
        <p>
          As of early 2026, Zstd is not yet a standard compression choice for web assets. The recommendation is:
          use Brotli for static assets and Gzip as fallback today. Monitor Zstd browser support — once it reaches 90%+
          adoption, it may become the preferred dynamic compression algorithm due to its superior speed/ratio trade-offs.
          For server-to-server communication (microservices, internal APIs), Zstd is already an excellent choice since
          you control both endpoints.
        </p>
      </section>

      <section>
        <h2>Measuring Compression</h2>
        <p>
          You cannot improve what you do not measure. Verifying that compression is active, checking compression ratios,
          and identifying uncompressed resources are essential debugging skills.
        </p>

        <h3 className="mt-6 font-semibold">Chrome DevTools — Network Panel</h3>
        <p>
          The Network panel shows both the transfer size (compressed) and the actual size (decompressed) for every
          resource. The ratio between these two values tells you how effective compression is.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// In Chrome DevTools → Network tab:
//
// 1. Enable "Use large request rows" (right-click column headers)
// 2. Look at the Size column — shows two values:
//    - Top number: transfer size (compressed bytes over the wire)
//    - Bottom number: actual size (decompressed resource size)
//
// Example:
//    bundle.js
//    105 KB (transferred)    ← compressed size (Brotli)
//    487 KB (resource)       ← actual size
//    Compression ratio: 78% reduction
//
// 3. Click a request → Headers tab → Response Headers:
//    Content-Encoding: br           ← Brotli is active
//    Content-Length: 107,253        ← compressed size in bytes
//    Content-Type: application/javascript
//    Vary: Accept-Encoding          ← caching is encoding-aware
//
// Red flag: If transfer size ≈ resource size for JS/CSS/HTML,
// compression is NOT active — investigate server configuration.`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Using curl to Verify Compression</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`# Check if Brotli compression is active
curl -I -H "Accept-Encoding: br, gzip" https://example.com/bundle.js
# Look for: Content-Encoding: br

# Check Gzip specifically
curl -I -H "Accept-Encoding: gzip" https://example.com/bundle.js
# Look for: Content-Encoding: gzip

# Compare compressed vs uncompressed size
# Compressed:
curl -s -o /dev/null -w "%{size_download}" \\
  -H "Accept-Encoding: br, gzip" https://example.com/bundle.js
# Output: 107253

# Uncompressed:
curl -s -o /dev/null -w "%{size_download}" \\
  -H "Accept-Encoding: identity" https://example.com/bundle.js
# Output: 498712

# Calculate ratio: 1 - (107253 / 498712) = 78.5% reduction

# Download and decompress to verify integrity
curl -s -H "Accept-Encoding: br" https://example.com/bundle.js \\
  --compressed -o bundle-test.js
# --compressed flag tells curl to decompress automatically
# If the file is valid JS, compression is working correctly`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Programmatic Compression Analysis</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// scripts/analyze-compression.js
// Analyze compression ratios across all static assets

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { promisify } = require('util');
const glob = require('glob');

const gzip = promisify(zlib.gzip);
const brotli = promisify(zlib.brotliCompress);

async function analyze(filePath) {
  const content = await fs.promises.readFile(filePath);
  const [gz, br] = await Promise.all([
    gzip(content, { level: 9 }),
    brotli(content, {
      params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
    }),
  ]);

  return {
    file: path.basename(filePath),
    original: content.length,
    gzip: gz.length,
    brotli: br.length,
    gzipRatio: ((1 - gz.length / content.length) * 100).toFixed(1),
    brotliRatio: ((1 - br.length / content.length) * 100).toFixed(1),
    savings: content.length - br.length,
  };
}

async function main() {
  const files = glob.sync('dist/**/*.{js,css,html,json,svg}');
  const results = await Promise.all(files.map(analyze));

  // Sort by savings (highest first)
  results.sort((a, b) => b.savings - a.savings);

  console.table(results);

  const totalOriginal = results.reduce((s, r) => s + r.original, 0);
  const totalBrotli = results.reduce((s, r) => s + r.brotli, 0);
  console.log(\`\\nTotal: \${(totalOriginal/1024).toFixed(0)}KB → \${(totalBrotli/1024).toFixed(0)}KB (Brotli 11)\`);
  console.log(\`Overall reduction: \${((1 - totalBrotli/totalOriginal) * 100).toFixed(1)}%\`);
}

main();`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Content-Length Analysis</h3>
        <p>
          A quick way to audit compression across an entire site is to compare <code>Content-Length</code> headers.
          If a JavaScript response has a <code>Content-Length</code> of 450,000 and no <code>Content-Encoding</code>
          header, those 450KB are being transferred uncompressed. With Brotli, the same file should have a
          <code>Content-Length</code> around 90,000-120,000. Watch for these red flags in your monitoring:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>No Content-Encoding header</strong> on text responses — compression is disabled or misconfigured.
          </li>
          <li>
            <strong>Content-Encoding: gzip when br is expected</strong> — Brotli may not be configured on the server, or
            the <code>ngx_brotli</code> module is not installed.
          </li>
          <li>
            <strong>Transfer size equals resource size in DevTools</strong> — same issue, no compression is being applied.
          </li>
          <li>
            <strong>Content-Encoding on images/video</strong> — wasting CPU compressing already-compressed content. Check
            your MIME type filters.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Despite being a straightforward optimization, compression is frequently misconfigured in production. Here are
          the most common issues and how to avoid them:
        </p>

        <h3 className="mt-6 font-semibold">1. Double Compression</h3>
        <p>
          When both the application server (Express) and the reverse proxy (Nginx) have compression enabled, responses
          can be compressed twice. The browser decompresses once, gets garbage bytes, and fails to parse the resource.
          This manifests as <code>ERR_CONTENT_DECODING_FAILED</code> errors in Chrome.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Problem: Both Express and Nginx compress
// Express: compression() middleware → compresses response
// Nginx: gzip on → compresses again
// Browser: decompresses once → gets Gzip stream instead of JS → error

// Solution: Pick ONE compression layer
// Option A: Let Nginx handle it (recommended)
// - Disable in Express: remove compression() middleware
// - Enable in Nginx: gzip on; brotli on;

// Option B: Let Express handle it
// - Disable in Nginx: gzip off; (in the server/location block)
// - Keep compression() middleware in Express

// Detection: curl with verbose headers
// curl -v -H "Accept-Encoding: gzip" https://yoursite.com/bundle.js
// If you see Content-Encoding: gzip, gzip — that's double compression`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">2. Missing Vary Header</h3>
        <p>
          Without <code>Vary: Accept-Encoding</code>, a CDN or proxy cache might store the Brotli version and serve it
          to a client that only supports Gzip. Or worse, store the uncompressed version and serve it to everyone. Always
          include the Vary header when compression is active.
        </p>

        <h3 className="mt-6 font-semibold">3. Compressing Tiny Responses</h3>
        <p>
          The Gzip and Brotli output formats have overhead — headers, checksums, dictionary tables. For very small
          responses (under 150-200 bytes), the compressed output can be larger than the original. Set a minimum
          threshold: 256 bytes for Nginx (<code>gzip_min_length 256</code>), 1024 bytes as a conservative default.
        </p>

        <h3 className="mt-6 font-semibold">4. Compressing Already-Compressed Formats</h3>
        <p>
          Adding JPEG, PNG, WOFF2, MP4, or ZIP to your compressible MIME types wastes CPU and adds latency without
          reducing transfer size. These formats are already compressed internally. Some servers include image MIME types
          in their default Gzip configuration — audit and remove them.
        </p>

        <h3 className="mt-6 font-semibold">5. High Dynamic Compression Levels</h3>
        <p>
          Using Brotli level 11 for dynamic (per-request) compression is a critical mistake. Level 11 can take 2-5
          seconds to compress a 500KB response, adding unacceptable latency. Use level 4-6 for dynamic compression.
          Reserve level 11 for pre-compression at build time where the cost is paid once.
        </p>

        <h3 className="mt-6 font-semibold">6. Not Handling Mixed HTTP/HTTPS</h3>
        <p>
          If your site redirects HTTP to HTTPS, Brotli will not be negotiated on the initial HTTP request — only Gzip.
          The redirect itself is small, so this is rarely impactful, but it means your Gzip configuration must also work
          correctly as a fallback. Do not assume all clients receive Brotli.
        </p>

        <h3 className="mt-6 font-semibold">7. Forgetting API Responses</h3>
        <p>
          Teams often configure compression for static assets but forget about API routes. Large JSON responses from REST
          APIs or GraphQL endpoints benefit enormously from compression — a 200KB JSON payload might compress to 20KB.
          Ensure your <code>application/json</code> and <code>application/graphql+json</code> MIME types are included in
          the compressible types list.
        </p>

        <h3 className="mt-6 font-semibold">8. ETag Mismatches with Compression</h3>
        <p>
          Some servers generate ETags based on the compressed content. If the compression algorithm or level changes
          (e.g., Nginx upgrade changes Gzip output), all ETags become invalid, and caches refetch everything. Use
          weak ETags (<code>W/"abc123"</code>) that represent the uncompressed content identity, or ensure your ETag
          generation is compression-independent.
        </p>
      </section>

      <section>
        <h2>Best Practices Summary</h2>
        <ul className="space-y-3">
          <li>
            <strong>Enable Brotli as primary, Gzip as fallback.</strong> Brotli achieves 15-25% better compression than
            Gzip on web content. All modern browsers support it. Keep Gzip enabled for the ~3% of clients that do not
            support Brotli and for non-HTTPS connections.
          </li>
          <li>
            <strong>Pre-compress static assets at build time.</strong> Use Brotli level 11 and Gzip level 9 during your
            CI/CD build. Configure Nginx <code>brotli_static on</code> and <code>gzip_static on</code> to serve these
            pre-compressed files with zero runtime CPU cost.
          </li>
          <li>
            <strong>Use moderate levels for dynamic compression.</strong> Brotli 4-6 or Gzip 4-6 for server-rendered
            pages and API responses. The marginal ratio improvement from higher levels is not worth the latency cost.
          </li>
          <li>
            <strong>Set a minimum size threshold.</strong> Do not compress responses smaller than 256-1024 bytes. The
            compression overhead can make small responses larger.
          </li>
          <li>
            <strong>Compress only text-based content.</strong> JavaScript, CSS, HTML, JSON, SVG, XML, WASM. Never
            compress JPEG, PNG, WebP, MP4, WOFF2, or ZIP — they are already compressed.
          </li>
          <li>
            <strong>Always include Vary: Accept-Encoding.</strong> This ensures CDNs and proxies cache separate versions
            for different encodings, preventing mismatched content-encoding responses.
          </li>
          <li>
            <strong>Compress at one layer only.</strong> Choose either the application server (Express) or the reverse
            proxy (Nginx) — never both. Double compression causes decode failures.
          </li>
          <li>
            <strong>Include API responses.</strong> JSON payloads from REST and GraphQL endpoints are highly compressible
            (70-90% reduction). Ensure <code>application/json</code> is in your compressible types.
          </li>
          <li>
            <strong>Monitor compression in production.</strong> Use RUM (Real User Monitoring) data and synthetic checks
            to verify compression is active. A single misconfiguration can silently disable compression for all users.
          </li>
          <li>
            <strong>Combine with minification.</strong> Minification reduces the original file size; compression reduces
            the transfer size. They are complementary — minified code still contains plenty of redundancy that
            compression exploits effectively.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-3">
          <li>
            HTTP compression reduces transfer size of text-based resources by 60-85% using algorithms like Gzip and
            Brotli. The browser and server negotiate the algorithm via <code>Accept-Encoding</code> and
            <code>Content-Encoding</code> headers — this is transparent to application code, requiring no changes to
            <code>fetch()</code> calls or response handling.
          </li>
          <li>
            Brotli achieves 15-25% better compression than Gzip on web content because of three innovations: a 120KB
            static dictionary of common web strings (HTML tags, CSS properties, JavaScript keywords), a larger sliding
            window (16MB vs 32KB), and context-aware modeling that predicts likely next bytes. Browsers require HTTPS for
            Brotli to prevent issues with intermediary proxies that don't understand the <code>br</code> encoding.
          </li>
          <li>
            The critical architectural decision is dynamic vs static compression. Static assets (JS, CSS) should be
            pre-compressed at build time using Brotli 11 and Gzip 9 — maximum compression, zero runtime CPU cost. Dynamic
            responses (API JSON, SSR HTML) must be compressed on-the-fly using Brotli 4-6, balancing ratio against latency.
          </li>
          <li>
            Both Gzip and Brotli are built on LZ77 (replacing repeated byte sequences with back-references) and
            Huffman coding (assigning shorter bit codes to more frequent symbols). Higher compression levels search
            harder for optimal matches, trading CPU time for smaller output. Level 6 is the sweet spot for dynamic
            compression; max levels are for build-time only.
          </li>
          <li>
            Never compress already-compressed formats: JPEG, PNG, WebP, MP4, WOFF2, ZIP. These formats use internal
            compression — a second pass finds no additional redundancy and wastes CPU. A common pitfall is including
            image MIME types in the server's Gzip configuration.
          </li>
          <li>
            Double compression is a frequent production bug: if both Express middleware and Nginx enable Gzip, responses
            are compressed twice. The browser decompresses once and gets a Gzip stream instead of valid content,
            resulting in <code>ERR_CONTENT_DECODING_FAILED</code>. Always compress at exactly one layer.
          </li>
          <li>
            The <code>Vary: Accept-Encoding</code> header is essential for CDN correctness. Without it, a CDN might cache
            the Brotli-compressed response and serve it to a Gzip-only client. This header tells caches to store separate
            entries per encoding.
          </li>
          <li>
            Zstandard (Zstd) is an emerging algorithm with superior speed/ratio trade-offs and trainable dictionaries
            that can be optimized for your specific data patterns. Browser support is still early-stage, but Zstd is
            already excellent for server-to-server compression where you control both endpoints.
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://web.dev/articles/reduce-network-payloads-using-text-compression" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Reduce Network Payloads Using Text Compression
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/codelab-text-compression-brotli" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Codelab: Text Compression with Brotli
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Content-Encoding Header
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Accept-Encoding Header
            </a>
          </li>
          <li>
            <a href="https://datatracker.ietf.org/doc/html/rfc7932" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 7932 — Brotli Compressed Data Format
            </a>
          </li>
          <li>
            <a href="https://github.com/google/brotli" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub — google/brotli
            </a>
          </li>
          <li>
            <a href="https://github.com/google/ngx_brotli" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub — google/ngx_brotli (Nginx Module)
            </a>
          </li>
          <li>
            <a href="https://facebook.github.io/zstd/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Zstandard — Fast Real-Time Compression Algorithm
            </a>
          </li>
          <li>
            <a href="https://datatracker.ietf.org/doc/html/rfc8478" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 8478 — Zstandard Compression and the application/zstd Media Type
            </a>
          </li>
          <li>
            <a href="https://nginx.org/en/docs/http/ngx_http_gzip_module.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Nginx — ngx_http_gzip_module Documentation
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
