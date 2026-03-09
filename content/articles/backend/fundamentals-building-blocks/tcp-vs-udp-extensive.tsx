"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-tcp-vs-udp-extensive",
  title: "TCP vs UDP",
  description: "Comprehensive guide to TCP vs UDP, reliability, performance trade-offs, and real-world use cases.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "tcp-vs-udp",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "networking", "tcp", "udp"],
  relatedTopics: ["http-https-protocol", "request-response-lifecycle", "networking-fundamentals"],
};

export default function TcpVsUdpExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          TCP provides reliable, ordered, byte-stream delivery with congestion control.
          UDP provides connectionless, best-effort datagrams with minimal overhead.
          Backend systems choose between them based on correctness versus latency.
        </p>
      </section>

      <section>
        <h2>Core Differences</h2>
        <ArticleImage
          src="/diagrams/backend/fundamentals-building-blocks/tcp-vs-udp-comparison.svg"
          alt="TCP vs UDP comparison"
          caption="TCP emphasizes reliability; UDP emphasizes low latency"
        />
        <ArticleImage
          src="/diagrams/backend/fundamentals-building-blocks/tcp-handshake-flow.svg"
          alt="TCP handshake flow"
          caption="TCP three-step handshake establishes a connection"
        />
        <ArticleImage
          src="/diagrams/backend/fundamentals-building-blocks/udp-datagram-flow.svg"
          alt="UDP datagram flow"
          caption="UDP sends independent datagrams without a handshake"
        />
      </section>

      <section>
        <h2>Implementation Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// UDP server (Node)
import dgram from 'node:dgram';
const server = dgram.createSocket('udp4');
server.on('message', (msg, rinfo) => {
  console.log('udp message', msg.toString(), rinfo.address);
});
server.bind(9999);

// TCP server (Node)
import net from 'node:net';
const tcp = net.createServer((socket) => {
  socket.on('data', (data) => {
    socket.write('ack');
  });
});
tcp.listen(8888);`}</code>
        </pre>
      </section>

      <section>
        <h2>Trade-offs and Use Cases</h2>
        <p>
          TCP is ideal for HTTP APIs, databases, and file transfers where correctness
          is non-negotiable. UDP is best for real-time media, gaming, and telemetry
          where late data is worse than lost data.
        </p>
      </section>

      <section>
        <h2>Operational Considerations</h2>
        <ul className="space-y-2">
          <li>TCP handles congestion and backpressure automatically.</li>
          <li>UDP requires application-level retries, ordering, and loss handling.</li>
          <li>Firewalls may block UDP more aggressively than TCP.</li>
        </ul>
      </section>
    
      <section>
        <h2>Congestion and Flow Control</h2>
        <p>
          TCP implements congestion control (slow start, congestion avoidance)
          and flow control (window size) to prevent overwhelming networks and
          receivers. UDP has none of these features, so applications must manage
          congestion explicitly if needed.
        </p>
      </section>

      <section>
        <h2>Operational Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Example: UDP retry strategy
function sendWithRetry(socket, msg, retries = 3) {
  for (let i = 0; i < retries; i++) {
    socket.send(msg);
  }
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Deep Dive: Reliability Patterns Over UDP</h2>
        <p>
          When building on UDP, reliability is often implemented at the application layer. This
          includes sequence numbers, acknowledgments, and retransmissions. QUIC is a modern example
          that provides reliability over UDP while avoiding some TCP limitations.
        </p>
      </section>

      <section>
        <h2>Deep Dive: MTU and Fragmentation</h2>
        <p>
          UDP packets larger than MTU get fragmented, increasing loss probability. TCP avoids this
          with segmentation and retransmission. For UDP-based protocols, keep payloads small or
          implement fragmentation control at the application layer.
        </p>
      </section>

      <section>
        <h2>Deep Dive: Real-Time Media</h2>
        <p>
          Real-time media protocols often run over UDP with adaptive bitrate and
          forward error correction. The system prioritizes fresh data over
          perfect delivery, since late packets are effectively useless.
        </p>
      </section>

      <section>
        <h2>Deep Dive: QUIC as a Hybrid</h2>
        <p>
          QUIC provides reliability and congestion control over UDP. It reduces
          handshake latency and avoids TCP head-of-line blocking. HTTP/3 builds
          on QUIC to improve performance in lossy networks.
        </p>
      </section>

      <section>
        <h2>Flow Control vs Congestion Control</h2>
        <p>
          Flow control protects the receiver from being overwhelmed, while
          congestion control protects the network from overload. TCP implements
          both with window sizing and adaptive algorithms. UDP has neither, so
          applications must design their own backpressure.
        </p>
      </section>

      <section>
        <h2>Head-of-Line Blocking</h2>
        <p>
          TCP delivers a byte stream in order. If a packet is lost, later packets
          are withheld until the missing data is retransmitted, which can add
          latency for independent requests. This is a core motivation for QUIC’s
          multiplexed streams.
        </p>
      </section>

      <section>
        <h2>NAT Traversal and Keepalives</h2>
        <p>
          UDP often requires NAT keepalives to preserve mappings. Firewalls and
          NATs can expire idle UDP flows quickly, causing intermittent issues.
          TCP keepalives exist too, but stateful middleboxes handle TCP more
          consistently.
        </p>
      </section>

      <section>
        <h2>Protocol Examples in Production</h2>
        <ul className="space-y-2">
          <li>HTTP/1.1, HTTP/2: TCP transport.</li>
          <li>DNS: UDP by default, TCP for large responses.</li>
          <li>QUIC/HTTP/3: UDP with reliability and stream multiplexing.</li>
          <li>VoIP/WebRTC: UDP with jitter buffers and FEC.</li>
        </ul>
      </section>

      <section>
        <h2>Connection Establishment: 3-Way Handshake vs None</h2>
        <p>
          TCP requires a handshake (SYN, SYN-ACK, ACK) to establish a reliable
          connection. This adds latency but also sets up sequence numbers,
          window sizes, and negotiated options. UDP skips this entirely, which
          is why it is faster but also why it provides no delivery guarantees.
        </p>
        <p>
          The handshake is not just overhead; it is the foundation for
          reliability. It synchronizes state between client and server. Without
          it, UDP cannot offer ordered delivery or retransmissions without
          implementing them at the application layer.
        </p>
      </section>

      <section>
        <h2>Sequence Numbers, ACKs, and Retransmissions</h2>
        <p>
          TCP uses sequence numbers to order bytes and detect loss. Receivers
          acknowledge data, and senders retransmit missing segments. This makes
          TCP resilient to loss but can introduce latency when packets are dropped.
        </p>
        <p>
          UDP has no sequencing or acknowledgments. If a UDP packet is lost,
          it is simply gone unless the application adds its own reliability.
          This is acceptable for real-time workloads where old data is useless.
        </p>
      </section>

      <section>
        <h2>Backpressure and Buffering</h2>
        <p>
          TCP provides built-in backpressure through flow control. If a receiver
          is slow, it advertises a smaller window size, and the sender reduces
          its sending rate. This prevents buffer overflows and stabilizes traffic.
        </p>
        <p>
          UDP has no such mechanism. Applications must implement their own
          backpressure. Without it, UDP traffic can overwhelm receivers and
          cause packet loss or downstream instability.
        </p>
      </section>

      <section>
        <h2>Packet Loss Behavior and Latency</h2>
        <p>
          TCP treats packet loss as congestion. This triggers congestion control
          algorithms that reduce send rates, which can slow throughput. Loss
          also causes head-of-line blocking, since TCP delivers in order.
        </p>
        <p>
          UDP ignores loss. This makes it ideal for workloads where timeliness
          is more important than reliability, such as voice or video. However,
          loss rates must be monitored to avoid unacceptable quality degradation.
        </p>
      </section>

      <section>
        <h2>DNS Over UDP vs TCP</h2>
        <p>
          DNS uses UDP for speed. Most DNS responses fit in a single datagram,
          and clients can retry if a response is lost. When responses are large
          (DNSSEC, large TXT records), DNS falls back to TCP for reliability.
        </p>
        <p>
          This hybrid approach illustrates the design trade-off: speed first,
          reliability when necessary. Many real systems follow a similar pattern.
        </p>
      </section>

      <section>
        <h2>QUIC: Reliability Over UDP</h2>
        <p>
          QUIC provides ordered streams, retransmissions, and congestion control
          on top of UDP. It avoids TCP head-of-line blocking by multiplexing
          independent streams within one connection. HTTP/3 builds on QUIC.
        </p>
        <p>
          The cost is complexity. QUIC is harder to debug because it encrypts
          transport headers. It also requires support from clients, servers, and
          proxies to realize its benefits.
        </p>
      </section>

      <section>
        <h2>Operational Tuning and Monitoring</h2>
        <p>
          TCP systems should monitor retransmission rates, RTT, and congestion
          window behavior. High retransmissions indicate loss or congestion.
          UDP systems should monitor packet loss, jitter, and reordering, since
          these directly affect user experience.
        </p>
        <p>
          For production reliability, set timeouts and retry budgets. For UDP,
          implement application-level ACKs if data correctness matters. For TCP,
          tune keepalive settings to avoid stale connections through NATs.
        </p>
      </section>

      <section>
        <h2>Security Implications</h2>
        <p>
          TCP is connection-oriented, which makes it easier to protect with
          stateful firewalls. UDP is stateless, so it is more commonly blocked
          or rate-limited. This can affect reachability in enterprise networks.
        </p>
        <p>
          UDP is also a common vector for reflection and amplification attacks
          (e.g., DNS amplification). Systems that expose UDP services should
          implement strict rate limits and validation to prevent abuse.
        </p>
      </section>

      <section>
        <h2>Operational Checklist</h2>
        <ul className="space-y-2">
          <li>Use TCP for correctness; UDP for low-latency tolerance of loss.</li>
          <li>Monitor RTT, loss, and retransmission metrics.</li>
          <li>Implement app-level retries or ACKs for UDP when needed.</li>
          <li>Watch NAT timeouts and keepalives for UDP flows.</li>
          <li>Guard UDP services against amplification abuse.</li>
        </ul>
      </section>
</ArticleLayout>
  );
}
