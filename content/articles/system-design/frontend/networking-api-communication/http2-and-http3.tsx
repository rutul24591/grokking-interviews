"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-http2-and-http3-concise",
  title: "HTTP/2 and HTTP/3",
  description:
    "Deep dive into HTTP/2 and HTTP/3 from the frontend perspective covering multiplexing, server push, header compression, QUIC protocol, and how these impact frontend performance optimization strategies.",
  category: "frontend",
  subcategory: "networking-api-communication",
  slug: "http2-and-http3",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-14",
  tags: [
    "frontend",
    "HTTP/2",
    "HTTP/3",
    "QUIC",
    "multiplexing",
    "server-push",
    "HPACK",
  ],
  relatedTopics: [
    "rest-api-design",
    "request-batching",
    "server-sent-events",
    "chunked-transfer-encoding",
  ],
};

export default function Http2AndHttp3ConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>HTTP/2</strong> (RFC 7540, standardized in 2015) introduced
          binary framing, multiplexing, header compression via HPACK, and server
          push over a single TCP connection. <strong>HTTP/3</strong> (RFC 9114,
          standardized in 2022) replaces TCP entirely with QUIC, a UDP-based
          transport protocol that integrates TLS 1.3 natively, eliminates
          transport-layer head-of-line blocking, and supports 0-RTT connection
          resumption.
        </p>
        <p>
          From a frontend architecture perspective, these protocol evolutions
          fundamentally changed how we think about resource delivery. HTTP/1.1
          forced the industry into workarounds: domain sharding (spreading
          assets across 4-6 subdomains to circumvent the 6-connections-per-host
          browser limit), CSS sprite sheets (combining dozens of images into a
          single file to reduce requests), aggressive concatenation of
          JavaScript and CSS files, and inlining small resources directly into
          HTML. HTTP/2 made every one of these techniques obsolete or
          counterproductive by allowing hundreds of concurrent streams over a
          single connection.
        </p>
        <p>
          Server push, one of HTTP/2's headline features, allowed servers to
          proactively send resources the client hadn't requested yet. In theory,
          the server could push critical CSS or JS alongside the HTML response,
          eliminating a round trip. In practice, it proved problematic: browsers
          had no reliable way to signal which resources were already cached,
          leading to wasted bandwidth. Chrome formally removed server push
          support in 2022, and the industry shifted toward 103 Early Hints as a
          more effective alternative.
        </p>
        <p>
          HTTP/3's QUIC protocol addresses the most fundamental limitation of
          HTTP/2: TCP-level head-of-line blocking. When HTTP/2 multiplexes
          streams over a single TCP connection and a packet is lost, TCP stalls
          all streams until that packet is retransmitted. QUIC solves this by
          implementing independent streams at the transport layer, so a lost
          packet in one stream doesn't block others. For mobile users, QUIC
          provides connection migration: when a device moves from Wi-Fi to
          cellular, the connection persists using connection IDs instead of the
          traditional 4-tuple (source IP, source port, destination IP,
          destination port) that TCP relies on. This eliminates the full TLS
          handshake penalty users experience during network transitions.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding the protocol evolution requires grasping six
          foundational mechanisms that differentiate HTTP/2 and HTTP/3 from
          their predecessor:
        </p>
        <ul>
          <li>
            <strong>Binary Framing Layer:</strong> HTTP/2 replaced HTTP/1.1's
            text-based protocol with a binary framing layer. Messages are
            decomposed into frames (HEADERS, DATA, PRIORITY, RST_STREAM,
            SETTINGS, PUSH_PROMISE, PING, GOAWAY, WINDOW_UPDATE, CONTINUATION),
            which belong to streams, which compose messages. A single TCP
            connection carries multiple streams simultaneously. This binary
            encoding is more compact, less error-prone to parse, and enables
            multiplexing. Critically, the semantics of HTTP (methods, status
            codes, headers) remain unchanged; only the wire format changed.
          </li>
          <li>
            <strong>Multiplexing:</strong> HTTP/1.1's pipelining allowed sending
            multiple requests without waiting for responses, but responses had
            to arrive in order (head-of-line blocking at the application layer).
            HTTP/2 multiplexing fully interleaves request and response frames on
            a single connection. Stream IDs (odd for client-initiated, even for
            server-initiated) allow the receiver to reassemble frames into
            complete messages. This means a large image download no longer
            blocks a small CSS file. However, because HTTP/2 runs over TCP, a
            lost TCP segment still stalls all streams until retransmission
            completes.
          </li>
          <li>
            <strong>Header Compression:</strong> HTTP/1.1 headers are sent as
            uncompressed plaintext on every request, often repeating cookies,
            user-agent strings, and other headers that don't change between
            requests. A typical header block is 500-800 bytes, and with cookies
            can exceed 2KB per request. HTTP/2 uses HPACK compression, which
            maintains a dynamic table of previously sent headers and uses
            Huffman encoding. Subsequent requests only send differences. HTTP/3
            uses QPACK, which adapts HPACK for QUIC's out-of-order delivery by
            introducing a separate unidirectional stream for table updates,
            avoiding the head-of-line blocking problem that would occur if table
            updates were lost.
          </li>
          <li>
            <strong>Stream Prioritization:</strong> HTTP/2 allows clients to
            assign priority weights and dependencies to streams, signaling which
            resources matter most. Browsers use this to prioritize HTML and CSS
            over images. However, the original prioritization scheme (weighted
            dependency trees) proved too complex and was inconsistently
            implemented across servers. The newer Extensible Priorities
            mechanism (RFC 9218) simplifies this with urgency values (0-7) and
            an incremental flag, and works across both HTTP/2 and HTTP/3.
            Frontend developers can influence this via the fetchpriority
            attribute on link, img, script, and fetch() calls.
          </li>
          <li>
            <strong>QUIC Protocol:</strong> QUIC replaces TCP as the transport
            for HTTP/3. It runs over UDP but implements its own reliability,
            congestion control, and flow control. Key properties: connection
            establishment combines the transport and TLS handshakes into a
            single round trip (1-RTT), compared to TCP's 2-3 round trips (SYN,
            SYN-ACK, TLS handshake). QUIC encrypts nearly all header metadata,
            preventing middlebox interference that plagued TCP evolution for
            decades. Connection migration uses connection IDs rather than
            IP/port tuples, so connections survive network changes. Each QUIC
            stream has independent flow control, meaning packet loss on one
            stream doesn't affect others.
          </li>
          <li>
            <strong>0-RTT Resumption:</strong> When a client reconnects to a
            server it has previously communicated with, QUIC can send
            application data in the very first packet using cached cryptographic
            parameters. This eliminates the latency of connection establishment
            entirely. The trade-off is a replay attack vector: 0-RTT data can
            potentially be replayed by an attacker. Servers must ensure 0-RTT
            requests are idempotent (safe for GET, risky for POST). Browsers
            handle this automatically, but backend engineers must configure
            their servers to only accept safe methods in 0-RTT.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          The connection model is the most consequential difference between HTTP
          versions. HTTP/1.1 uses up to 6 parallel TCP connections per origin,
          each carrying one request at a time (or pipelining, which was rarely
          used in practice due to head-of-line blocking). HTTP/2 collapses this
          to a single TCP connection with multiplexed streams, dramatically
          reducing connection overhead but introducing TCP-level head-of-line
          blocking. HTTP/3 replaces TCP with QUIC, maintaining the
          single-connection model but with independent streams that are immune
          to cross-stream blocking.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/http-version-comparison.svg"
          alt="HTTP/1.1 vs HTTP/2 vs HTTP/3 connection model comparison"
          caption="Connection model evolution: HTTP/1.1 requires multiple TCP connections with sequential requests, HTTP/2 multiplexes streams over one TCP connection (but TCP-level HOL blocking remains), HTTP/3 uses QUIC with truly independent streams"
        />

        <p>
          The multiplexing model in HTTP/2 fundamentally changes how resources
          flow from server to client. Instead of opening separate connections
          for each resource, the browser negotiates a single connection during
          the TLS handshake using ALPN (Application-Layer Protocol Negotiation).
          All subsequent requests share this connection. Frames from different
          streams are interleaved on the wire, allowing the server to send
          high-priority resources (CSS, critical JS) ahead of lower-priority
          ones (images, analytics scripts) without requiring separate
          connections.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/http2-multiplexing.svg"
          alt="HTTP/2 multiplexing showing interleaved streams"
          caption="HTTP/2 multiplexing: multiple streams carry different resources simultaneously over a single connection, with frames interleaved on the wire"
        />

        <p>
          From a frontend performance perspective, the connection setup latency
          is particularly important. On a typical 4G mobile connection with
          100ms RTT, HTTP/1.1 with TLS 1.2 requires 3 round trips (TCP SYN, TLS
          handshake) before any data flows, totaling 300ms per connection.
          HTTP/2 reduces this to 2 round trips for a single connection. HTTP/3
          with QUIC achieves 1-RTT for new connections and 0-RTT for resumed
          connections, meaning data can flow in as little as 0ms of additional
          latency for returning visitors. On high-latency satellite connections
          (600ms+ RTT), this difference translates to seconds of saved time.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">HTTP/1.1</th>
              <th className="p-3 text-left">HTTP/2</th>
              <th className="p-3 text-left">HTTP/3</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Connection Setup</strong>
              </td>
              <td className="p-3">
                2-3 RTT per connection (TCP + TLS). Up to 6 connections per
                origin means 12-18 RTT total overhead.
              </td>
              <td className="p-3">
                2 RTT for single connection (TCP + TLS via ALPN). All requests
                share this one connection.
              </td>
              <td className="p-3">
                1 RTT new connection (QUIC integrates TLS 1.3). 0-RTT for
                resumed connections.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Multiplexing</strong>
              </td>
              <td className="p-3">
                None. One request per connection at a time (pipelining
                unreliable). Workaround: domain sharding.
              </td>
              <td className="p-3">
                Full multiplexing with stream prioritization. Hundreds of
                concurrent streams on one connection.
              </td>
              <td className="p-3">
                Full multiplexing with independent stream flow control. Lost
                packets don't block other streams.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Head-of-Line Blocking</strong>
              </td>
              <td className="p-3">
                Application-layer HOL blocking. Each connection processes one
                request at a time sequentially.
              </td>
              <td className="p-3">
                Eliminated at HTTP layer, but TCP-layer HOL blocking persists.
                One lost packet stalls all streams.
              </td>
              <td className="p-3">
                Eliminated at both layers. QUIC streams are independent; packet
                loss is isolated per-stream.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Header Size</strong>
              </td>
              <td className="p-3">
                Uncompressed text headers on every request. 500-2000+ bytes per
                request with cookies.
              </td>
              <td className="p-3">
                HPACK compression with dynamic table. Repeated headers sent as
                indices. 85-90% reduction typical.
              </td>
              <td className="p-3">
                QPACK compression adapted for out-of-order delivery. Similar
                compression ratios to HPACK.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Server Push</strong>
              </td>
              <td className="p-3">
                Not supported. Resources require explicit client requests.
              </td>
              <td className="p-3">
                Supported but deprecated in practice. Chrome removed support in
                2022. 103 Early Hints preferred.
              </td>
              <td className="p-3">
                Specified but rarely implemented. Industry consensus favors
                Early Hints over push.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Mobile Performance</strong>
              </td>
              <td className="p-3">
                Poor. Multiple connections drain battery. Network changes break
                all connections. High latency penalty.
              </td>
              <td className="p-3">
                Better. Single connection saves battery. But network changes
                still require full reconnection.
              </td>
              <td className="p-3">
                Best. Connection migration survives Wi-Fi to cellular
                transitions. 0-RTT benefits high-latency networks.
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/http3-quic-architecture.svg"
          alt="Protocol stack comparison: HTTP/1.1 vs HTTP/2 vs HTTP/3"
          caption="Protocol stack evolution: HTTP/3 replaces TCP with QUIC (which runs over UDP and integrates TLS 1.3), eliminating the transport-layer head-of-line blocking that limited HTTP/2"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Modern frontend optimization strategies must account for the protocol
          version your users negotiate. These practices assume HTTP/2+ as the
          baseline:
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Stop Domain Sharding:</strong> With HTTP/2+, spreading
            assets across multiple subdomains (cdn1.example.com,
            cdn2.example.com) is actively harmful. Each domain requires a
            separate TCP connection and TLS handshake, negating multiplexing
            benefits. Consolidate assets to a single origin. If you must use a
            CDN on a different domain, ensure it supports connection coalescing
            (HTTP/2 feature where connections can be reused across domains
            sharing a TLS certificate and IP address).
          </li>
          <li>
            <strong>Rethink Bundling Strategy:</strong> HTTP/1.1 rewarded large
            bundles (fewer requests). HTTP/2 changes the calculus: many smaller
            files multiplex efficiently and enable better caching granularity.
            Instead of one massive vendor.js, split into logical chunks
            (react.js, lodash.js, your-app.js). When one library updates, only
            that chunk is invalidated. However, don't go to the extreme of
            shipping hundreds of tiny modules; there's still per-stream overhead
            and compression efficiency favors some bundling. The sweet spot is
            typically 5-15 chunks per page.
          </li>
          <li>
            <strong>Use Resource Hints Effectively:</strong> With multiplexing,
            preload and prefetch hints are more effective because they don't
            consume connection slots. Use preload for critical above-the-fold
            resources (fonts, hero images, critical CSS). Use prefetch for
            likely next-page resources. Use preconnect to warm up connections to
            third-party origins (analytics, fonts, APIs). With HTTP/3,
            preconnect is even cheaper due to faster connection establishment.
          </li>
          <li>
            <strong>Stop Inlining Small Resources:</strong> HTTP/1.1 encouraged
            inlining small CSS and base64 encoding small images to reduce
            requests. With HTTP/2, this is counterproductive: inlined resources
            can't be cached independently, they bloat the HTML document, and
            multiplexing handles small requests efficiently. Serve small
            resources as separate files with long cache lifetimes instead.
          </li>
          <li>
            <strong>Adopt 103 Early Hints:</strong> Instead of server push
            (deprecated), use 103 Early Hints to inform the browser about
            critical resources before the final response is ready. The server
            sends a 103 status with Link headers while generating the 200
            response. The browser can start fetching linked resources
            immediately. This is particularly powerful for dynamic pages where
            server processing takes time.
          </li>
          <li>
            <strong>Enable HTTP/3 on Your CDN:</strong> Major CDNs (Cloudflare,
            AWS CloudFront, Fastly, Akamai) support HTTP/3. Enable it and ensure
            your server advertises HTTP/3 availability via the Alt-Svc response
            header. Browsers will automatically upgrade to HTTP/3 on subsequent
            requests. Monitor the adoption rate in your analytics to track the
            percentage of users benefiting from QUIC.
          </li>
          <li>
            <strong>Use Fetch Priority API:</strong> The fetchpriority attribute
            (high, low, auto) lets you signal resource importance to the
            browser's prioritization engine. Set fetchpriority="high" on hero
            images, critical scripts, and above-the-fold resources. Set
            fetchpriority="low" on below-the-fold images and analytics scripts.
            This works hand-in-hand with HTTP/2's stream prioritization.
          </li>
          <li>
            <strong>Monitor Protocol Negotiation:</strong> Use Chrome DevTools
            Network panel (Protocol column) to verify which protocol each
            request uses. Check the "h2" (HTTP/2) or "h3" (HTTP/3) indicators.
            Use the Performance API (nextHopProtocol property on
            PerformanceResourceTiming entries) to collect protocol usage metrics
            in production. Track what percentage of your users successfully
            negotiate HTTP/2 and HTTP/3.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          These mistakes are frequently encountered, even in production systems
          built by experienced teams:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Still Bundling Everything Into One File:</strong> Teams that
            learned HTTP/1.1 optimization often produce a single 2MB bundle.
            With HTTP/2, this defeats multiplexing, ruins cache granularity (any
            change invalidates the entire bundle), and prevents parallel
            processing. Split into logical chunks, but don't over-split; aim for
            chunks between 20KB and 150KB compressed.
          </li>
          <li>
            <strong>Assuming Server Push Is Useful:</strong> Server push sounded
            revolutionary but failed in practice. Browsers couldn't reliably
            cancel pushes for cached resources, leading to wasted bandwidth. The
            push cache had inconsistent behavior across browsers. Chrome removed
            support entirely. If you find server push configuration in your
            infrastructure, replace it with 103 Early Hints or preload headers.
          </li>
          <li>
            <strong>Not Testing Under Realistic Network Conditions:</strong>{" "}
            HTTP/2's advantages are most pronounced on high-latency connections
            where reducing round trips matters. Testing only on localhost or
            fast office networks misses the real-world gains. Use Chrome
            DevTools throttling with custom profiles (150ms RTT, 1.5Mbps) or
            WebPageTest from geographically distributed locations. HTTP/3's
            benefits are even more latency-dependent; test with packet loss
            simulation (1-5%) to see QUIC's advantage over TCP.
          </li>
          <li>
            <strong>Ignoring HTTP/3 Fallback Mechanics:</strong> HTTP/3
            discovery uses the Alt-Svc header. The first request to a new origin
            always goes over HTTP/2 (or HTTP/1.1), and the server responds with
            an Alt-Svc header advertising QUIC support. The browser attempts
            HTTP/3 on subsequent requests and races it against HTTP/2 (QUIC
            connection racing). If your Alt-Svc header is misconfigured or your
            firewall blocks UDP port 443, users silently fall back to HTTP/2.
            Monitor this with PerformanceResourceTiming.nextHopProtocol to catch
            silent fallbacks.
          </li>
          <li>
            <strong>TCP Tuning Assumptions Breaking With QUIC:</strong>{" "}
            Infrastructure teams that spent years tuning TCP parameters (initial
            congestion window, receive buffer sizes, BBR congestion control)
            find that none of these apply to QUIC, which implements its own
            congestion control in userspace. QUIC servers need separate tuning.
            Additionally, some corporate firewalls and network middleboxes block
            or throttle UDP traffic, degrading HTTP/3 performance. Always ensure
            graceful fallback to HTTP/2.
          </li>
          <li>
            <strong>Not Using HTTPS:</strong> HTTP/2 requires TLS in all
            browsers (the spec allows cleartext h2c, but no browser implements
            it). HTTP/3 requires TLS 1.3 by design (it's built into QUIC). If
            any part of your asset pipeline serves over HTTP, those resources
            fall back to HTTP/1.1, creating a mixed-protocol situation that
            undermines performance.
          </li>
          <li>
            <strong>Assuming All CDNs Support HTTP/3:</strong> While major CDN
            providers support HTTP/3, support varies by configuration tier,
            region, and feature set. Some CDNs support HTTP/3 for static assets
            but not for dynamic (proxied) requests. Others support QUIC but
            haven't implemented 0-RTT. Verify your specific CDN configuration
            supports the features you expect, and always ensure HTTP/2 works as
            a reliable fallback.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          The adoption of HTTP/2 and HTTP/3 has been driven by the largest
          internet companies, who stood to gain the most from protocol
          improvements at scale:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Google (HTTP/3 Pioneer):</strong> Google developed QUIC
            internally starting in 2012, deploying it in Chrome and across
            Google services years before standardization. By 2020, over 30% of
            Google's traffic used QUIC. Google's motivation was YouTube and
            Search: reducing connection latency on mobile networks directly
            improved engagement metrics. YouTube's time-to-first-byte improved
            by 8% with QUIC on lossy mobile networks. Google Search measured a
            measurable reduction in search abandonment on high-latency
            connections after QUIC deployment.
          </li>
          <li>
            <strong>Cloudflare (Early HTTP/3 Adopter):</strong> Cloudflare
            enabled HTTP/3 support across their entire network in 2019 (before
            standardization). Their data showed HTTP/3 reduced
            time-to-first-byte by 12.4% compared to HTTP/2 for users with packet
            loss. For mobile users transitioning between networks, HTTP/3
            eliminated the 1-3 second stall that TCP connection re-establishment
            caused. Cloudflare also observed that HTTP/3 adoption was fastest in
            regions with less reliable networks (parts of Asia, Africa, South
            America), where QUIC's loss resilience provided the greatest
            benefit.
          </li>
          <li>
            <strong>Akamai (HTTP/2 Push Experiments):</strong> Akamai conducted
            extensive experiments with HTTP/2 server push across their CDN.
            Their published results showed that push improved page load times by
            only 1-4% on average, while increasing bandwidth usage by 5-10% due
            to pushing resources already in browser cache. This data was
            instrumental in the industry's decision to deprecate push in favor
            of 103 Early Hints. Akamai now recommends preload headers and Early
            Hints as more predictable alternatives.
          </li>
          <li>
            <strong>Mobile Applications (Connection Migration):</strong>{" "}
            Ride-sharing apps (Uber, Lyft), mapping applications (Google Maps,
            Waze), and messaging platforms (WhatsApp, Signal) benefit enormously
            from QUIC's connection migration. Users moving through urban
            environments frequently switch between Wi-Fi hotspots and cellular
            networks. With TCP, each switch required a full reconnection (1-3
            seconds). With QUIC, the connection migrates seamlessly using
            connection IDs, maintaining ongoing data transfers without
            interruption. This is particularly critical for real-time
            applications where even brief connection drops degrade user
            experience.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does HTTP/2 multiplexing change frontend optimization
              strategies?
            </p>
            <p className="mt-2 text-sm">
              A: HTTP/2 multiplexing eliminates the need for most HTTP/1.1
              workarounds. Domain sharding becomes harmful because it forces
              multiple connections instead of leveraging one multiplexed
              connection. Sprite sheets and icon fonts become unnecessary
              because individual image requests are cheap with multiplexing.
              Concatenating all JS/CSS into one bundle becomes suboptimal
              because smaller, granular files offer better cache invalidation
              (changing one library doesn't bust the entire cache) and allow
              parallel processing. However, the pendulum shouldn't swing to the
              extreme: there's still per-stream overhead, and compression works
              better on larger files. The optimal strategy is logical chunking
              (5-15 bundles per page, grouped by change frequency and logical
              module). Resource hints (preload, prefetch) become more powerful
              because they don't consume scarce connection slots. The
              fetchpriority API lets developers communicate resource importance
              directly to the browser's stream scheduler.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What problem does HTTP/3's QUIC solve that HTTP/2 couldn't?
            </p>
            <p className="mt-2 text-sm">
              A: HTTP/2 multiplexes multiple streams over a single TCP
              connection, but TCP treats the entire connection as one ordered
              byte stream. When a TCP packet is lost, TCP's reliability
              mechanism stalls the entire connection until retransmission
              succeeds, blocking all multiplexed streams even though only one
              stream's data was affected. This is TCP-level head-of-line
              blocking, and it's particularly damaging on lossy networks
              (mobile, Wi-Fi). QUIC implements streams at the transport layer
              with independent ordering, so a lost packet in stream 3 doesn't
              block streams 1, 5, or 7. Additionally, TCP can't evolve because
              middleboxes (firewalls, NATs) inspect and modify TCP headers; any
              new TCP extensions get stripped. QUIC encrypts nearly all its
              metadata, making it resistant to middlebox interference. QUIC also
              integrates TLS 1.3 directly, saving a round trip on connection
              setup, and supports connection migration via connection IDs so
              connections survive network changes (critical for mobile).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Should you still bundle JavaScript with HTTP/2?
            </p>
            <p className="mt-2 text-sm">
              A: Yes, but differently. The myth that "HTTP/2 means no bundling"
              is dangerous. While multiplexing makes many small requests cheap,
              there are still reasons to bundle: compression algorithms (Brotli,
              gzip) work better on larger files due to dictionary building;
              there's per-stream overhead in HTTP/2 (headers, priority
              metadata); deeply nested import chains create sequential round
              trips even with multiplexing (module A imports B which imports C);
              and the browser's JavaScript parser benefits from fewer, larger
              files for compilation efficiency. The correct approach is granular
              bundling: split by route, split vendor code from application code,
              group by change frequency, and aim for chunks between 20KB-150KB
              compressed. Tools like webpack's splitChunks, Rollup, and Vite
              handle this automatically. The key insight is that HTTP/2 changed
              the optimal bundle count from 1 to roughly 5-15 per page, not from
              1 to 200.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.rfc-editor.org/rfc/rfc9114"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 9114 - HTTP/3 (IETF)
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/performance-http2/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Introduction to HTTP/2 - web.dev
            </a>
          </li>
          <li>
            <a
              href="https://blog.cloudflare.com/http3-the-past-present-and-future/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              HTTP/3: The Past, Present, and Future - Cloudflare Blog
            </a>
          </li>
          <li>
            <a
              href="https://developer.chrome.com/blog/removing-push/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Intent to Remove: HTTP/2 Push - Chrome Developers
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/2021/08/http3-core-concepts-part1/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              HTTP/3: Core Concepts - Smashing Magazine
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
