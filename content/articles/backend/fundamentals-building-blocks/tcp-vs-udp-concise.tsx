"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-tcp-vs-udp-concise",
  title: "TCP vs UDP",
  description: "Quick comparison of TCP and UDP for backend interviews and rapid learning.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "tcp-vs-udp",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "networking", "tcp", "udp"],
  relatedTopics: ["http-https-protocol", "request-response-lifecycle", "networking-fundamentals"],
};

export default function TcpVsUdpConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>TCP</strong> is connection-oriented and guarantees delivery, ordering,
          and congestion control. <strong>UDP</strong> is connectionless and best-effort,
          trading reliability for low latency and minimal overhead.
        </p>
        <p>
          Use TCP when correctness matters (APIs, databases, file transfer). Use UDP
          when speed and tolerance for loss matter (streaming, gaming, DNS).
        </p>
        <p>
          The trade-off is explicit: TCP pays extra latency to guarantee delivery,
          while UDP gives you raw speed but pushes reliability into the application.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>TCP:</strong> Handshake, retransmission, ordered bytes.</li>
          <li><strong>UDP:</strong> No handshake, no ordering, low overhead.</li>
          <li><strong>Reliability:</strong> TCP ACKs + retransmit; UDP is best-effort.</li>
          <li><strong>Flow vs Congestion:</strong> TCP controls receiver and network pressure.</li>
          <li><strong>Latency:</strong> UDP is typically faster for small payloads.</li>
          <li><strong>Throughput:</strong> TCP adapts to congestion to avoid collapse.</li>
          <li><strong>Head-of-Line Blocking:</strong> TCP can block later packets until loss recovers.</li>
        </ul>
        <p className="mt-4">
          Think of TCP as a reliable stream and UDP as individual postcards. TCP
          handles ordering and retransmission for you; UDP gives you raw delivery
          with no guarantees.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// TCP client (Node)
import net from 'node:net';
const socket = net.createConnection(8888, 'localhost');
socket.write('hello');

// UDP client (Node)
import dgram from 'node:dgram';
const udp = dgram.createSocket('udp4');
udp.send(Buffer.from('ping'), 9999, 'localhost');`}</code>
        </pre>
      </section>

      <section>
        <h2>Pros & Cons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">TCP</th>
              <th className="p-3 text-left">UDP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                ✓ Reliable delivery<br />
                ✓ Ordered data<br />
                ✓ Congestion control<br />
                ✗ Higher latency
              </td>
              <td className="p-3">
                ✓ Low latency<br />
                ✓ Minimal overhead<br />
                ✓ Good for real-time<br />
                ✗ No reliability
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>TCP:</strong> Web APIs, databases, payments, file transfer.</p>
        <p><strong>UDP:</strong> DNS, VoIP, gaming, live streaming, telemetry.</p>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain reliability vs latency trade-off.</li>
          <li>Mention TCP handshake and retransmissions.</li>
          <li>Discuss UDP use cases like DNS and streaming.</li>
          <li>Call out head-of-line blocking and why QUIC matters.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is UDP used for DNS?</p>
            <p className="mt-2 text-sm">
              A: DNS queries are small and benefit from low latency; retries handle loss.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What problems does TCP solve?</p>
            <p className="mt-2 text-sm">
              A: Reliable, ordered delivery with congestion control and flow control.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would UDP be a bad choice?</p>
            <p className="mt-2 text-sm">
              A: For payments, file uploads, or any system requiring correctness.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is flow vs congestion control?</p>
            <p className="mt-2 text-sm">
              A: Flow control protects the receiver; congestion control protects the network.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
