"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-osi-tcpip-concise",
  title: "OSI Model & TCP/IP Stack",
  description: "Quick overview of OSI layers and the TCP/IP stack for backend interviews.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "osi-model-tcp-ip-stack",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "networking", "osi", "tcp-ip"],
  relatedTopics: ["tcp-vs-udp", "networking-fundamentals", "request-response-lifecycle"],
};

export default function OsiTcpIpConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          The OSI model is a 7-layer conceptual framework for networking.
          The TCP/IP stack is the practical 4-layer model used on the internet.
          Understanding both helps debug and design networked systems.
        </p>
        <p>
          In interviews, the goal isn’t to recite layers — it’s to show you can
          map real protocols to the right layer and reason about failures in a
          structured way.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>OSI:</strong> Application, Presentation, Session, Transport, Network, Data Link, Physical.</li>
          <li><strong>TCP/IP:</strong> Application, Transport, Internet, Link.</li>
          <li><strong>Encapsulation:</strong> Each layer wraps data with headers.</li>
          <li><strong>Examples:</strong> HTTP (App), TLS (between App/Transport), TCP (Transport), IP (Network).</li>
          <li><strong>Devices:</strong> Switches (L2), routers (L3), load balancers (L4/L7).</li>
        </ul>
        <p className="mt-4">
          The TCP/IP stack collapses OSI’s presentation and session layers into
          the application layer. That’s why TLS is often described as “between”
          application and transport in practice.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Mapping a web request
Browser -> HTTPS (HTTP + TLS)
TLS -> runs over TCP (Transport)
TCP -> runs over IP (Network)
IP -> sent on Ethernet/Wi-Fi (Link)`}</code>
        </pre>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Map HTTP to Application, TCP to Transport, IP to Network/Internet.</li>
          <li>Explain encapsulation and where encryption fits (TLS above TCP).</li>
          <li>Use layer-specific troubleshooting (DNS vs TCP vs IP).</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why do we use layers?</p>
            <p className="mt-2 text-sm">A: Layers separate concerns and enable interoperability.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Where does TLS live?</p>
            <p className="mt-2 text-sm">A: Between Application and Transport in practice.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What layer is routing?</p>
            <p className="mt-2 text-sm">A: Network layer in OSI, Internet layer in TCP/IP.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Where do switches and routers live?</p>
            <p className="mt-2 text-sm">A: Switches are L2, routers are L3.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
