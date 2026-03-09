import type { ArticleRegistry } from "@/types/article";

/**
 * Article Registry
 *
 * This registry maps article paths to their metadata and dynamic loaders.
 * Format: "{category}/{subcategory}/{topic}-{version}"
 *
 * Example:
 * "frontend/rendering-strategies/client-side-rendering-concise": {
 *   metadata: {
 *     id: "article-frontend-csr-concise",
 *     title: "Client-Side Rendering (CSR)",
 *     description: "Overview of client-side rendering patterns and implementation.",
 *     category: "frontend",
 *     subcategory: "rendering-strategies",
 *     slug: "client-side-rendering",
 *     version: "concise",
 *     wordCount: 2500,
 *     readingTime: 10,
 *     lastUpdated: "2026-03-05",
 *     tags: ["rendering", "CSR", "browser"],
 *     relatedTopics: ["server-side-rendering", "static-site-generation"],
 *   },
 *   loader: () => import("./articles/frontend/rendering-strategies/client-side-rendering-concise"),
 * },
 *
 * Articles will be added to this registry using the generate-article-stub.ts script.
 */
export const articleRegistry: ArticleRegistry = {
  // Articles will be populated here as they are created
  "backend/fundamentals-building-blocks/client-server-architecture-concise": {
    metadata: {
      id: "article-backend-client-server-concise",
      title: "Client-Server Architecture",
      description:
        "Quick overview of client-server architecture for backend interviews and rapid learning.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "client-server-architecture",
      version: "concise",
      wordCount: 1350,
      readingTime: 7,
      lastUpdated: "2026-03-09",
      tags: ["backend", "architecture", "client-server", "fundamentals"],
      relatedTopics: [
        "http-https-protocol",
        "request-response-lifecycle",
        "stateless-vs-stateful-services",
        "api-design-best-practices",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/client-server-architecture-concise"
      ),
  },
  "backend/fundamentals-building-blocks/client-server-architecture-extensive": {
    metadata: {
      id: "article-backend-client-server-extensive",
      title: "Client-Server Architecture",
      description:
        "Comprehensive guide to client-server architecture covering fundamentals, variants, trade-offs, and interview readiness.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "client-server-architecture",
      version: "extensive",
      wordCount: 4300,
      readingTime: 22,
      lastUpdated: "2026-03-09",
      tags: ["backend", "architecture", "client-server", "networking", "scalability"],
      relatedTopics: [
        "http-https-protocol",
        "request-response-lifecycle",
        "stateless-vs-stateful-services",
        "tcp-vs-udp",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/client-server-architecture-extensive"
      ),
  },
  "backend/fundamentals-building-blocks/http-https-protocol-concise": {
    metadata: {
      id: "article-backend-http-https-concise",
      title: "HTTP/HTTPS Protocol",
      description:
        "Quick overview of HTTP and HTTPS fundamentals for backend interviews and rapid learning.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "http-https-protocol",
      version: "concise",
      wordCount: 1350,
      readingTime: 7,
      lastUpdated: "2026-03-09",
      tags: ["backend", "http", "https", "protocols"],
      relatedTopics: [
        "client-server-architecture",
        "request-response-lifecycle",
        "tcp-vs-udp",
        "api-design-best-practices",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/http-https-protocol-concise"
      ),
  },
  "backend/fundamentals-building-blocks/http-https-protocol-extensive": {
    metadata: {
      id: "article-backend-http-https-extensive",
      title: "HTTP/HTTPS Protocol",
      description:
        "Comprehensive guide to HTTP and HTTPS covering methods, status codes, headers, TLS, and performance trade-offs.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "http-https-protocol",
      version: "extensive",
      wordCount: 4400,
      readingTime: 22,
      lastUpdated: "2026-03-09",
      tags: ["backend", "http", "https", "protocols", "networking"],
      relatedTopics: [
        "client-server-architecture",
        "request-response-lifecycle",
        "tcp-vs-udp",
        "serialization-formats",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/http-https-protocol-extensive"
      ),
  },
  "backend/fundamentals-building-blocks/rest-api-design-concise": {
    metadata: {
      id: "article-backend-rest-api-design-concise",
      title: "REST API Design",
      description:
        "Quick overview of REST API design principles for backend interviews and rapid learning.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "rest-api-design",
      version: "concise",
      wordCount: 1350,
      readingTime: 7,
      lastUpdated: "2026-03-09",
      tags: ["backend", "rest", "api", "design"],
      relatedTopics: [
        "http-https-protocol",
        "api-design-best-practices",
        "request-response-lifecycle",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/rest-api-design-concise"
      ),
  },
  "backend/fundamentals-building-blocks/rest-api-design-extensive": {
    metadata: {
      id: "article-backend-rest-api-design-extensive",
      title: "REST API Design",
      description:
        "Comprehensive guide to REST API design, resource modeling, status codes, and real-world trade-offs.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "rest-api-design",
      version: "extensive",
      wordCount: 4400,
      readingTime: 22,
      lastUpdated: "2026-03-09",
      tags: ["backend", "rest", "api", "design", "architecture"],
      relatedTopics: [
        "http-https-protocol",
        "api-design-best-practices",
        "request-response-lifecycle",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/rest-api-design-extensive"
      ),
  },
  "backend/fundamentals-building-blocks/api-design-best-practices-concise": {
    metadata: {
      id: "article-backend-api-design-best-practices-concise",
      title: "API Design Best Practices",
      description:
        "Quick checklist of API design best practices for backend interviews and rapid learning.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "api-design-best-practices",
      version: "concise",
      wordCount: 1400,
      readingTime: 7,
      lastUpdated: "2026-03-09",
      tags: ["backend", "api", "design", "best-practices"],
      relatedTopics: [
        "rest-api-design",
        "http-https-protocol",
        "request-response-lifecycle",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/api-design-best-practices-concise"
      ),
  },
  "backend/fundamentals-building-blocks/api-design-best-practices-extensive": {
    metadata: {
      id: "article-backend-api-design-best-practices-extensive",
      title: "API Design Best Practices",
      description:
        "Comprehensive guide to API design best practices including pagination, filtering, errors, versioning, and reliability.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "api-design-best-practices",
      version: "extensive",
      wordCount: 4500,
      readingTime: 23,
      lastUpdated: "2026-03-09",
      tags: ["backend", "api", "design", "reliability", "standards"],
      relatedTopics: [
        "rest-api-design",
        "http-https-protocol",
        "request-response-lifecycle",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/api-design-best-practices-extensive"
      ),
  },
  "backend/fundamentals-building-blocks/domain-name-system-concise": {
    metadata: {
      id: "article-backend-dns-concise",
      title: "Domain Name System (DNS)",
      description:
        "Quick overview of DNS concepts for backend interviews and rapid learning.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "domain-name-system",
      version: "concise",
      wordCount: 1350,
      readingTime: 7,
      lastUpdated: "2026-03-09",
      tags: ["backend", "dns", "networking", "fundamentals"],
      relatedTopics: [
        "http-https-protocol",
        "ip-addressing",
        "request-response-lifecycle",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/domain-name-system-concise"
      ),
  },
  "backend/fundamentals-building-blocks/domain-name-system-extensive": {
    metadata: {
      id: "article-backend-dns-extensive",
      title: "Domain Name System (DNS)",
      description:
        "Comprehensive guide to DNS resolution, record types, caching, and operational pitfalls.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "domain-name-system",
      version: "extensive",
      wordCount: 4400,
      readingTime: 22,
      lastUpdated: "2026-03-09",
      tags: ["backend", "dns", "networking", "infrastructure"],
      relatedTopics: [
        "http-https-protocol",
        "ip-addressing",
        "networking-fundamentals",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/domain-name-system-extensive"
      ),
  },
  "backend/fundamentals-building-blocks/ip-addressing-concise": {
    metadata: {
      id: "article-backend-ip-addressing-concise",
      title: "IP Addressing",
      description:
        "Quick overview of IPv4, IPv6, and subnetting for backend interviews and rapid learning.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "ip-addressing",
      version: "concise",
      wordCount: 1350,
      readingTime: 7,
      lastUpdated: "2026-03-09",
      tags: ["backend", "ip", "networking", "fundamentals"],
      relatedTopics: [
        "domain-name-system",
        "tcp-vs-udp",
        "networking-fundamentals",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/ip-addressing-concise"
      ),
  },
  "backend/fundamentals-building-blocks/ip-addressing-extensive": {
    metadata: {
      id: "article-backend-ip-addressing-extensive",
      title: "IP Addressing",
      description:
        "Comprehensive guide to IPv4, IPv6, CIDR, and subnetting with practical backend examples.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "ip-addressing",
      version: "extensive",
      wordCount: 4400,
      readingTime: 22,
      lastUpdated: "2026-03-09",
      tags: ["backend", "ip", "networking", "cidr"],
      relatedTopics: [
        "domain-name-system",
        "tcp-vs-udp",
        "networking-fundamentals",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/ip-addressing-extensive"
      ),
  },

  "backend/fundamentals-building-blocks/tcp-vs-udp-concise": {
    metadata: {
      id: "article-backend-tcp-vs-udp-concise",
      title: "TCP vs UDP",
      description: "Quick comparison of TCP and UDP for backend interviews and rapid learning.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "tcp-vs-udp",
      version: "concise",
      wordCount: 1350,
      readingTime: 7,
      lastUpdated: "2026-03-09",
      tags: ["backend", "networking", "tcp", "udp"],
      relatedTopics: [
        "http-https-protocol",
        "request-response-lifecycle",
        "networking-fundamentals",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/tcp-vs-udp-concise"
      ),
  },
  "backend/fundamentals-building-blocks/tcp-vs-udp-extensive": {
    metadata: {
      id: "article-backend-tcp-vs-udp-extensive",
      title: "TCP vs UDP",
      description: "Comprehensive guide to TCP vs UDP, reliability, performance trade-offs, and real-world use cases.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "tcp-vs-udp",
      version: "extensive",
      wordCount: 4400,
      readingTime: 22,
      lastUpdated: "2026-03-09",
      tags: ["backend", "networking", "tcp", "udp"],
      relatedTopics: [
        "http-https-protocol",
        "request-response-lifecycle",
        "networking-fundamentals",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/tcp-vs-udp-extensive"
      ),
  },
  "backend/fundamentals-building-blocks/osi-model-tcp-ip-stack-concise": {
    metadata: {
      id: "article-backend-osi-tcpip-concise",
      title: "OSI Model & TCP/IP Stack",
      description: "Quick overview of OSI layers and the TCP/IP stack for backend interviews.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "osi-model-tcp-ip-stack",
      version: "concise",
      wordCount: 1350,
      readingTime: 7,
      lastUpdated: "2026-03-09",
      tags: ["backend", "networking", "osi", "tcp-ip"],
      relatedTopics: [
        "tcp-vs-udp",
        "networking-fundamentals",
        "request-response-lifecycle",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/osi-model-tcp-ip-stack-concise"
      ),
  },
  "backend/fundamentals-building-blocks/osi-model-tcp-ip-stack-extensive": {
    metadata: {
      id: "article-backend-osi-tcpip-extensive",
      title: "OSI Model & TCP/IP Stack",
      description: "Comprehensive guide to OSI and TCP/IP layering, encapsulation, and debugging network issues.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "osi-model-tcp-ip-stack",
      version: "extensive",
      wordCount: 4400,
      readingTime: 22,
      lastUpdated: "2026-03-09",
      tags: ["backend", "networking", "osi", "tcp-ip"],
      relatedTopics: [
        "tcp-vs-udp",
        "request-response-lifecycle",
        "networking-fundamentals",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/osi-model-tcp-ip-stack-extensive"
      ),
  },
  "backend/fundamentals-building-blocks/networking-fundamentals-concise": {
    metadata: {
      id: "article-backend-networking-fundamentals-concise",
      title: "Networking Fundamentals",
      description: "Quick overview of routing, switching, NAT, firewalls, and VPNs for backend interviews.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "networking-fundamentals",
      version: "concise",
      wordCount: 1350,
      readingTime: 7,
      lastUpdated: "2026-03-09",
      tags: ["backend", "networking", "routing", "firewalls"],
      relatedTopics: [
        "ip-addressing",
        "tcp-vs-udp",
        "request-response-lifecycle",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/networking-fundamentals-concise"
      ),
  },
  "backend/fundamentals-building-blocks/networking-fundamentals-extensive": {
    metadata: {
      id: "article-backend-networking-fundamentals-extensive",
      title: "Networking Fundamentals",
      description: "Comprehensive guide to routing, switching, NAT, firewalls, and VPNs for backend systems.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "networking-fundamentals",
      version: "extensive",
      wordCount: 4400,
      readingTime: 22,
      lastUpdated: "2026-03-09",
      tags: ["backend", "networking", "routing", "security"],
      relatedTopics: [
        "ip-addressing",
        "tcp-vs-udp",
        "request-response-lifecycle",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/networking-fundamentals-extensive"
      ),
  },
  "backend/fundamentals-building-blocks/horizontal-vs-vertical-scaling-concise": {
    metadata: {
      id: "article-backend-horizontal-vertical-concise",
      title: "Horizontal vs Vertical Scaling",
      description: "Quick comparison of scaling up vs scaling out for backend interviews.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "horizontal-vs-vertical-scaling",
      version: "concise",
      wordCount: 1350,
      readingTime: 7,
      lastUpdated: "2026-03-09",
      tags: ["backend", "scaling", "architecture"],
      relatedTopics: [
        "stateless-vs-stateful-services",
        "reliability-fault-tolerance",
        "caching-performance",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/horizontal-vs-vertical-scaling-concise"
      ),
  },
  "backend/fundamentals-building-blocks/horizontal-vs-vertical-scaling-extensive": {
    metadata: {
      id: "article-backend-horizontal-vertical-extensive",
      title: "Horizontal vs Vertical Scaling",
      description: "Comprehensive guide to scaling up vs scaling out, trade-offs, and operational patterns.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "horizontal-vs-vertical-scaling",
      version: "extensive",
      wordCount: 4400,
      readingTime: 22,
      lastUpdated: "2026-03-09",
      tags: ["backend", "scaling", "architecture"],
      relatedTopics: [
        "stateless-vs-stateful-services",
        "caching-performance",
        "load-balancers",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/horizontal-vs-vertical-scaling-extensive"
      ),
  },
  "backend/fundamentals-building-blocks/stateless-vs-stateful-services-concise": {
    metadata: {
      id: "article-backend-stateless-stateful-concise",
      title: "Stateless vs Stateful Services",
      description: "Quick comparison of stateless and stateful services for backend interviews.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "stateless-vs-stateful-services",
      version: "concise",
      wordCount: 1350,
      readingTime: 7,
      lastUpdated: "2026-03-09",
      tags: ["backend", "architecture", "state"],
      relatedTopics: [
        "horizontal-vs-vertical-scaling",
        "request-response-lifecycle",
        "caching-performance",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/stateless-vs-stateful-services-concise"
      ),
  },
  "backend/fundamentals-building-blocks/stateless-vs-stateful-services-extensive": {
    metadata: {
      id: "article-backend-stateless-stateful-extensive",
      title: "Stateless vs Stateful Services",
      description: "Comprehensive guide to stateless and stateful services, trade-offs, and scaling impacts.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "stateless-vs-stateful-services",
      version: "extensive",
      wordCount: 4400,
      readingTime: 22,
      lastUpdated: "2026-03-09",
      tags: ["backend", "architecture", "state"],
      relatedTopics: [
        "horizontal-vs-vertical-scaling",
        "request-response-lifecycle",
        "caching-performance",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/stateless-vs-stateful-services-extensive"
      ),
  },
  "backend/fundamentals-building-blocks/request-response-lifecycle-concise": {
    metadata: {
      id: "article-backend-request-response-concise",
      title: "Request/Response Lifecycle",
      description: "Quick walkthrough of the backend request/response lifecycle for interviews.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "request-response-lifecycle",
      version: "concise",
      wordCount: 1350,
      readingTime: 7,
      lastUpdated: "2026-03-09",
      tags: ["backend", "http", "lifecycle"],
      relatedTopics: [
        "http-https-protocol",
        "client-server-architecture",
        "networking-fundamentals",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/request-response-lifecycle-concise"
      ),
  },
  "backend/fundamentals-building-blocks/request-response-lifecycle-extensive": {
    metadata: {
      id: "article-backend-request-response-extensive",
      title: "Request/Response Lifecycle",
      description: "Comprehensive guide to the end-to-end request lifecycle with latency and middleware considerations.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "request-response-lifecycle",
      version: "extensive",
      wordCount: 4400,
      readingTime: 22,
      lastUpdated: "2026-03-09",
      tags: ["backend", "http", "lifecycle"],
      relatedTopics: [
        "http-https-protocol",
        "client-server-architecture",
        "networking-fundamentals",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/request-response-lifecycle-extensive"
      ),
  },
  "backend/fundamentals-building-blocks/serialization-formats-concise": {
    metadata: {
      id: "article-backend-serialization-formats-concise",
      title: "Serialization Formats",
      description: "Quick overview of JSON, Protobuf, Avro, and other serialization formats.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "serialization-formats",
      version: "concise",
      wordCount: 1350,
      readingTime: 7,
      lastUpdated: "2026-03-09",
      tags: ["backend", "serialization", "formats"],
      relatedTopics: [
        "character-encoding",
        "compression",
        "request-response-lifecycle",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/serialization-formats-concise"
      ),
  },
  "backend/fundamentals-building-blocks/serialization-formats-extensive": {
    metadata: {
      id: "article-backend-serialization-formats-extensive",
      title: "Serialization Formats",
      description: "Comprehensive guide to JSON, Protobuf, Avro, Thrift, and trade-offs in serialization.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "serialization-formats",
      version: "extensive",
      wordCount: 4400,
      readingTime: 22,
      lastUpdated: "2026-03-09",
      tags: ["backend", "serialization", "formats"],
      relatedTopics: [
        "character-encoding",
        "compression",
        "request-response-lifecycle",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/serialization-formats-extensive"
      ),
  },
  "backend/fundamentals-building-blocks/character-encoding-concise": {
    metadata: {
      id: "article-backend-character-encoding-concise",
      title: "Character Encoding",
      description: "Quick overview of Unicode, UTF-8, and encoding pitfalls for backend interviews.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "character-encoding",
      version: "concise",
      wordCount: 1350,
      readingTime: 7,
      lastUpdated: "2026-03-09",
      tags: ["backend", "encoding", "utf-8"],
      relatedTopics: [
        "serialization-formats",
        "compression",
        "http-https-protocol",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/character-encoding-concise"
      ),
  },
  "backend/fundamentals-building-blocks/character-encoding-extensive": {
    metadata: {
      id: "article-backend-character-encoding-extensive",
      title: "Character Encoding",
      description: "Comprehensive guide to Unicode, UTF-8, and common encoding pitfalls in backend systems.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "character-encoding",
      version: "extensive",
      wordCount: 4400,
      readingTime: 22,
      lastUpdated: "2026-03-09",
      tags: ["backend", "encoding", "utf-8"],
      relatedTopics: [
        "serialization-formats",
        "compression",
        "http-https-protocol",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/character-encoding-extensive"
      ),
  },
  "backend/fundamentals-building-blocks/compression-concise": {
    metadata: {
      id: "article-backend-compression-concise",
      title: "Compression",
      description: "Quick overview of compression algorithms and trade-offs for backend interviews.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "compression",
      version: "concise",
      wordCount: 1750,
      readingTime: 8,
      lastUpdated: "2026-03-09",
      tags: ["backend", "compression", "performance"],
      relatedTopics: [
        "serialization-formats",
        "http-https-protocol",
        "caching-performance",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/compression-concise"
      ),
  },
  "backend/fundamentals-building-blocks/compression-extensive": {
    metadata: {
      id: "article-backend-compression-extensive",
      title: "Compression",
      description: "Comprehensive guide to compression algorithms, trade-offs, and HTTP content encoding.",
      category: "backend",
      subcategory: "fundamentals-building-blocks",
      slug: "compression",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "compression", "performance"],
      relatedTopics: [
        "serialization-formats",
        "http-https-protocol",
        "caching-performance",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/fundamentals-building-blocks/compression-extensive"
      ),
  },
  "backend/data-storage-databases/relational-database-design-concise": {
    metadata: {
      id: "article-backend-relational-database-design-concise",
      title: "Relational Database Design",
      description:
        "Quick overview of relational database design principles for backend interviews and rapid learning.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "relational-database-design",
      version: "concise",
      wordCount: 1750,
      readingTime: 8,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "design"],
      relatedTopics: [
        "database-indexes",
        "sql-queries-optimization",
        "transaction-isolation-levels",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/relational-database-design-concise"
      ),
  },
  "backend/data-storage-databases/relational-database-design-extensive": {
    metadata: {
      id: "article-backend-relational-database-design-extensive",
      title: "Relational Database Design",
      description:
        "Comprehensive guide to relational database design, normalization, constraints, and schema trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "relational-database-design",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "design", "modeling"],
      relatedTopics: [
        "acid-properties",
        "database-indexes",
        "transaction-isolation-levels",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/relational-database-design-extensive"
      ),
  },
  "backend/data-storage-databases/acid-properties-concise": {
    metadata: {
      id: "article-backend-acid-properties-concise",
      title: "ACID Properties",
      description:
        "Quick overview of ACID properties for backend interviews and rapid learning.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "acid-properties",
      version: "concise",
      wordCount: 1750,
      readingTime: 8,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "acid"],
      relatedTopics: [
        "transaction-isolation-levels",
        "concurrency-control",
        "database-constraints",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/acid-properties-concise"
      ),
  },
  "backend/data-storage-databases/acid-properties-extensive": {
    metadata: {
      id: "article-backend-acid-properties-extensive",
      title: "ACID Properties",
      description:
        "Comprehensive guide to ACID properties, isolation levels, and transactional guarantees.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "acid-properties",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "acid", "transactions"],
      relatedTopics: [
        "transaction-isolation-levels",
        "concurrency-control",
        "deadlocks",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/acid-properties-extensive"
      ),
  },
  "backend/data-storage-databases/sql-queries-optimization-concise": {
    metadata: {
      id: "article-backend-sql-queries-optimization-concise",
      title: "SQL Queries & Optimization",
      description:
        "Quick overview of SQL query optimization for backend interviews and rapid learning.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "sql-queries-optimization",
      version: "concise",
      wordCount: 1750,
      readingTime: 8,
      lastUpdated: "2026-03-09",
      tags: ["backend", "sql", "databases", "performance"],
      relatedTopics: [
        "database-indexes",
        "query-optimization-techniques",
        "connection-pooling",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/sql-queries-optimization-concise"
      ),
  },
  "backend/data-storage-databases/sql-queries-optimization-extensive": {
    metadata: {
      id: "article-backend-sql-queries-optimization-extensive",
      title: "SQL Queries & Optimization",
      description:
        "Comprehensive guide to SQL query optimization, execution plans, and indexing strategy.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "sql-queries-optimization",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "sql", "databases", "performance", "optimization"],
      relatedTopics: [
        "database-indexes",
        "query-optimization-techniques",
        "connection-pooling",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/sql-queries-optimization-extensive"
      ),
  },
  "backend/data-storage-databases/database-indexes-concise": {
    metadata: {
      id: "article-backend-database-indexes-concise",
      title: "Database Indexes",
      description:
        "Quick overview of database indexes, how they work, and when to use them.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "database-indexes",
      version: "concise",
      wordCount: 1750,
      readingTime: 8,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "indexes", "performance"],
      relatedTopics: [
        "sql-queries-optimization",
        "index-types",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/database-indexes-concise"
      ),
  },
  "backend/data-storage-databases/database-indexes-extensive": {
    metadata: {
      id: "article-backend-database-indexes-extensive",
      title: "Database Indexes",
      description:
        "Comprehensive guide to database indexes, internal structures, and performance trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "database-indexes",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "indexes", "performance"],
      relatedTopics: [
        "sql-queries-optimization",
        "index-types",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/database-indexes-extensive"
      ),
  },
  "backend/data-storage-databases/index-types-concise": {
    metadata: {
      id: "article-backend-index-types-concise",
      title: "Index Types",
      description:
        "Quick overview of primary, unique, composite, partial, and other index types.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "index-types",
      version: "concise",
      wordCount: 1750,
      readingTime: 8,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "indexes", "performance"],
      relatedTopics: [
        "database-indexes",
        "sql-queries-optimization",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/index-types-concise"
      ),
  },
  "backend/data-storage-databases/index-types-extensive": {
    metadata: {
      id: "article-backend-index-types-extensive",
      title: "Index Types",
      description:
        "Comprehensive guide to primary, unique, composite, partial, and other index types.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "index-types",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "indexes", "performance"],
      relatedTopics: [
        "database-indexes",
        "sql-queries-optimization",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/index-types-extensive"
      ),
  },
  "backend/data-storage-databases/query-optimization-techniques-concise": {
    metadata: {
      id: "article-backend-query-optimization-techniques-concise",
      title: "Query Optimization Techniques",
      description:
        "Quick overview of practical SQL query optimization techniques for backend interviews.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "query-optimization-techniques",
      version: "concise",
      wordCount: 1750,
      readingTime: 8,
      lastUpdated: "2026-03-09",
      tags: ["backend", "sql", "databases", "optimization"],
      relatedTopics: [
        "sql-queries-optimization",
        "database-indexes",
        "index-types",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/query-optimization-techniques-concise"
      ),
  },
  "backend/data-storage-databases/query-optimization-techniques-extensive": {
    metadata: {
      id: "article-backend-query-optimization-techniques-extensive",
      title: "Query Optimization Techniques",
      description:
        "Comprehensive guide to SQL query optimization techniques, join strategies, and planner behavior.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "query-optimization-techniques",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "sql", "databases", "optimization", "performance"],
      relatedTopics: [
        "sql-queries-optimization",
        "database-indexes",
        "index-types",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/query-optimization-techniques-extensive"
      ),
  },
  "backend/data-storage-databases/transaction-isolation-levels-concise": {
    metadata: {
      id: "article-backend-transaction-isolation-levels-concise",
      title: "Transaction Isolation Levels",
      description:
        "Quick overview of transaction isolation levels and the anomalies they prevent.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "transaction-isolation-levels",
      version: "concise",
      wordCount: 1750,
      readingTime: 8,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "transactions"],
      relatedTopics: [
        "acid-properties",
        "concurrency-control",
        "deadlocks",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/transaction-isolation-levels-concise"
      ),
  },
  "backend/data-storage-databases/transaction-isolation-levels-extensive": {
    metadata: {
      id: "article-backend-transaction-isolation-levels-extensive",
      title: "Transaction Isolation Levels",
      description:
        "Comprehensive guide to transaction isolation levels, anomalies, and trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "transaction-isolation-levels",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "transactions", "isolation"],
      relatedTopics: [
        "acid-properties",
        "concurrency-control",
        "deadlocks",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/transaction-isolation-levels-extensive"
      ),
  },
  "backend/data-storage-databases/concurrency-control-concise": {
    metadata: {
      id: "article-backend-concurrency-control-concise",
      title: "Concurrency Control",
      description:
        "Quick overview of concurrency control, locking strategies, and MVCC.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "concurrency-control",
      version: "concise",
      wordCount: 1750,
      readingTime: 8,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "concurrency", "transactions"],
      relatedTopics: [
        "transaction-isolation-levels",
        "deadlocks",
        "acid-properties",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/concurrency-control-concise"
      ),
  },
  "backend/data-storage-databases/concurrency-control-extensive": {
    metadata: {
      id: "article-backend-concurrency-control-extensive",
      title: "Concurrency Control",
      description:
        "Comprehensive guide to concurrency control, locking, MVCC, and trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "concurrency-control",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "concurrency", "transactions"],
      relatedTopics: [
        "transaction-isolation-levels",
        "deadlocks",
        "acid-properties",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/concurrency-control-extensive"
      ),
  },
  "backend/data-storage-databases/deadlocks-concise": {
    metadata: {
      id: "article-backend-deadlocks-concise",
      title: "Deadlocks",
      description:
        "Quick overview of deadlocks, detection, and prevention strategies.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "deadlocks",
      version: "concise",
      wordCount: 1750,
      readingTime: 8,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "transactions", "deadlocks"],
      relatedTopics: [
        "concurrency-control",
        "transaction-isolation-levels",
        "acid-properties",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/deadlocks-concise"
      ),
  },
  "backend/data-storage-databases/deadlocks-extensive": {
    metadata: {
      id: "article-backend-deadlocks-extensive",
      title: "Deadlocks",
      description:
        "Comprehensive guide to deadlocks, detection, prevention, and recovery strategies.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "deadlocks",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "transactions", "deadlocks"],
      relatedTopics: [
        "concurrency-control",
        "transaction-isolation-levels",
        "acid-properties",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/deadlocks-extensive"
      ),
  },
  "backend/data-storage-databases/database-partitioning-concise": {
    metadata: {
      id: "article-backend-database-partitioning-concise",
      title: "Database Partitioning",
      description:
        "Concise guide to database partitioning strategies, trade-offs, and interview-ready talking points.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "database-partitioning",
      version: "concise",
      wordCount: 1900,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "partitioning", "scaling"],
      relatedTopics: [
        "read-replicas",
        "database-indexes",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/database-partitioning-concise"
      ),
  },
  "backend/data-storage-databases/database-partitioning-extensive": {
    metadata: {
      id: "article-backend-database-partitioning-extensive",
      title: "Database Partitioning",
      description:
        "Deep guide to database partitioning strategies, shard keys, rebalancing, and operational trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "database-partitioning",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "partitioning", "scaling", "sharding"],
      relatedTopics: [
        "read-replicas",
        "database-indexes",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/database-partitioning-extensive"
      ),
  },
  "backend/data-storage-databases/read-replicas-concise": {
    metadata: {
      id: "article-backend-read-replicas-concise",
      title: "Read Replicas",
      description:
        "Concise guide to read replicas, replication lag, and read scaling for backend interviews.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "read-replicas",
      version: "concise",
      wordCount: 1850,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "replication", "scaling"],
      relatedTopics: [
        "database-partitioning",
        "concurrency-control",
        "transaction-isolation-levels",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/read-replicas-concise"
      ),
  },
  "backend/data-storage-databases/read-replicas-extensive": {
    metadata: {
      id: "article-backend-read-replicas-extensive",
      title: "Read Replicas",
      description:
        "Deep guide to read replicas, replication lag, read routing, and availability trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "read-replicas",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "replication", "availability", "scaling"],
      relatedTopics: [
        "database-partitioning",
        "concurrency-control",
        "transaction-isolation-levels",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/read-replicas-extensive"
      ),
  },
  "backend/data-storage-databases/connection-pooling-concise": {
    metadata: {
      id: "article-backend-connection-pooling-concise",
      title: "Connection Pooling",
      description:
        "Concise guide to database connection pooling, sizing, and troubleshooting for backend interviews.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "connection-pooling",
      version: "concise",
      wordCount: 1900,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "performance", "pooling"],
      relatedTopics: [
        "sql-queries-optimization",
        "concurrency-control",
        "read-replicas",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/connection-pooling-concise"
      ),
  },
  "backend/data-storage-databases/connection-pooling-extensive": {
    metadata: {
      id: "article-backend-connection-pooling-extensive",
      title: "Connection Pooling",
      description:
        "Deep guide to connection pooling mechanics, sizing, failure modes, and operational tuning.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "connection-pooling",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "performance", "pooling"],
      relatedTopics: [
        "sql-queries-optimization",
        "concurrency-control",
        "read-replicas",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/connection-pooling-extensive"
      ),
  },
  "backend/data-storage-databases/stored-procedures-functions-concise": {
    metadata: {
      id: "article-backend-stored-procedures-functions-concise",
      title: "Stored Procedures & Functions",
      description:
        "Concise guide to stored procedures and functions, use cases, and trade-offs for interviews.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "stored-procedures-functions",
      version: "concise",
      wordCount: 1850,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "stored-procedures"],
      relatedTopics: [
        "sql-queries-optimization",
        "transaction-isolation-levels",
        "concurrency-control",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/stored-procedures-functions-concise"
      ),
  },
  "backend/data-storage-databases/stored-procedures-functions-extensive": {
    metadata: {
      id: "article-backend-stored-procedures-functions-extensive",
      title: "Stored Procedures & Functions",
      description:
        "Deep guide to stored procedures and functions, performance impact, and operational trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "stored-procedures-functions",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "stored-procedures"],
      relatedTopics: [
        "sql-queries-optimization",
        "transaction-isolation-levels",
        "concurrency-control",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/stored-procedures-functions-extensive"
      ),
  },
  "backend/data-storage-databases/triggers-concise": {
    metadata: {
      id: "article-backend-triggers-concise",
      title: "Triggers",
      description:
        "Concise guide to database triggers, when to use them, and common trade-offs for interviews.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "triggers",
      version: "concise",
      wordCount: 1850,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "triggers"],
      relatedTopics: [
        "stored-procedures-functions",
        "transaction-isolation-levels",
        "concurrency-control",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/triggers-concise"
      ),
  },
  "backend/data-storage-databases/triggers-extensive": {
    metadata: {
      id: "article-backend-triggers-extensive",
      title: "Triggers",
      description:
        "Deep guide to database triggers, execution order, use cases, and operational trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "triggers",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "triggers"],
      relatedTopics: [
        "stored-procedures-functions",
        "transaction-isolation-levels",
        "concurrency-control",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/triggers-extensive"
      ),
  },
  "backend/data-storage-databases/views-materialized-views-concise": {
    metadata: {
      id: "article-backend-views-materialized-views-concise",
      title: "Views & Materialized Views",
      description:
        "Concise guide to views and materialized views, including trade-offs and interview tips.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "views-materialized-views",
      version: "concise",
      wordCount: 1900,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "views"],
      relatedTopics: [
        "sql-queries-optimization",
        "query-optimization-techniques",
        "read-replicas",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/views-materialized-views-concise"
      ),
  },
  "backend/data-storage-databases/views-materialized-views-extensive": {
    metadata: {
      id: "article-backend-views-materialized-views-extensive",
      title: "Views & Materialized Views",
      description:
        "Deep guide to views and materialized views, performance implications, and refresh strategies.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "views-materialized-views",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "views", "materialized"],
      relatedTopics: [
        "sql-queries-optimization",
        "query-optimization-techniques",
        "read-replicas",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/views-materialized-views-extensive"
      ),
  },
  "backend/data-storage-databases/database-constraints-concise": {
    metadata: {
      id: "article-backend-database-constraints-concise",
      title: "Database Constraints",
      description:
        "Concise guide to database constraints, integrity guarantees, and trade-offs for interviews.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "database-constraints",
      version: "concise",
      wordCount: 1850,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "constraints"],
      relatedTopics: [
        "relational-database-design",
        "transaction-isolation-levels",
        "concurrency-control",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/database-constraints-concise"
      ),
  },
  "backend/data-storage-databases/database-constraints-extensive": {
    metadata: {
      id: "article-backend-database-constraints-extensive",
      title: "Database Constraints",
      description:
        "Deep guide to database constraints, integrity guarantees, and schema-level validation.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "database-constraints",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sql", "constraints"],
      relatedTopics: [
        "relational-database-design",
        "transaction-isolation-levels",
        "concurrency-control",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/database-constraints-extensive"
      ),
  },
  "backend/data-storage-databases/orms-concise": {
    metadata: {
      id: "article-backend-orms-concise",
      title: "ORMs",
      description:
        "Concise guide to ORMs, trade-offs, and interview-ready concepts like N+1 and eager loading.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "orms",
      version: "concise",
      wordCount: 1900,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "orm", "sql"],
      relatedTopics: [
        "sql-queries-optimization",
        "database-indexes",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/orms-concise"
      ),
  },
  "backend/data-storage-databases/orms-extensive": {
    metadata: {
      id: "article-backend-orms-extensive",
      title: "ORMs",
      description:
        "Deep guide to ORMs, performance pitfalls, and design patterns for scalable data access.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "orms",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "orm", "sql"],
      relatedTopics: [
        "sql-queries-optimization",
        "database-indexes",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/orms-extensive"
      ),
  },
  "backend/data-storage-databases/cap-theorem-concise": {
    metadata: {
      id: "article-backend-cap-theorem-concise",
      title: "CAP Theorem",
      description:
        "Concise guide to CAP theorem trade-offs, practical implications, and interview tips.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "cap-theorem",
      version: "concise",
      wordCount: 1850,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "distributed-systems", "databases", "cap"],
      relatedTopics: [
        "base-properties",
        "read-replicas",
        "database-partitioning",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/cap-theorem-concise"
      ),
  },
  "backend/data-storage-databases/cap-theorem-extensive": {
    metadata: {
      id: "article-backend-cap-theorem-extensive",
      title: "CAP Theorem",
      description:
        "Deep guide to CAP theorem, consistency models, and practical system trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "cap-theorem",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "distributed-systems", "databases", "cap"],
      relatedTopics: [
        "base-properties",
        "read-replicas",
        "database-partitioning",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/cap-theorem-extensive"
      ),
  },
  "backend/data-storage-databases/base-properties-concise": {
    metadata: {
      id: "article-backend-base-properties-concise",
      title: "BASE Properties",
      description:
        "Concise guide to BASE properties, eventual consistency, and system trade-offs for interviews.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "base-properties",
      version: "concise",
      wordCount: 1800,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "distributed-systems", "databases", "base"],
      relatedTopics: [
        "cap-theorem",
        "read-replicas",
        "consistency-models",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/base-properties-concise"
      ),
  },
  "backend/data-storage-databases/base-properties-extensive": {
    metadata: {
      id: "article-backend-base-properties-extensive",
      title: "BASE Properties",
      description:
        "Deep guide to BASE properties, eventual consistency patterns, and system design trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "base-properties",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "distributed-systems", "databases", "base"],
      relatedTopics: [
        "cap-theorem",
        "read-replicas",
        "consistency-models",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/base-properties-extensive"
      ),
  },
  "backend/data-storage-databases/document-databases-concise": {
    metadata: {
      id: "article-backend-document-databases-concise",
      title: "Document Databases",
      description:
        "Concise guide to document databases, document modeling, and interview-ready trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "document-databases",
      version: "concise",
      wordCount: 1850,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "nosql", "document"],
      relatedTopics: [
        "cap-theorem",
        "base-properties",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/document-databases-concise"
      ),
  },
  "backend/data-storage-databases/document-databases-extensive": {
    metadata: {
      id: "article-backend-document-databases-extensive",
      title: "Document Databases",
      description:
        "Deep guide to document databases, modeling patterns, and performance trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "document-databases",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "nosql", "document"],
      relatedTopics: [
        "cap-theorem",
        "base-properties",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/document-databases-extensive"
      ),
  },
  "backend/data-storage-databases/key-value-stores-concise": {
    metadata: {
      id: "article-backend-key-value-stores-concise",
      title: "Key-Value Stores",
      description:
        "Concise guide to key-value stores, access patterns, and trade-offs for interviews.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "key-value-stores",
      version: "concise",
      wordCount: 1800,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "nosql", "key-value"],
      relatedTopics: [
        "in-memory-databases",
        "caching-performance",
        "cap-theorem",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/key-value-stores-concise"
      ),
  },
  "backend/data-storage-databases/key-value-stores-extensive": {
    metadata: {
      id: "article-backend-key-value-stores-extensive",
      title: "Key-Value Stores",
      description:
        "Deep guide to key-value stores, access patterns, consistency, and scalability trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "key-value-stores",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "nosql", "key-value"],
      relatedTopics: [
        "in-memory-databases",
        "caching-performance",
        "cap-theorem",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/key-value-stores-extensive"
      ),
  },
  "backend/data-storage-databases/column-family-stores-concise": {
    metadata: {
      id: "article-backend-column-family-stores-concise",
      title: "Column-Family Stores",
      description:
        "Concise guide to column-family databases, data modeling, and interview-ready trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "column-family-stores",
      version: "concise",
      wordCount: 1850,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "nosql", "column-family"],
      relatedTopics: [
        "cap-theorem",
        "base-properties",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/column-family-stores-concise"
      ),
  },
  "backend/data-storage-databases/column-family-stores-extensive": {
    metadata: {
      id: "article-backend-column-family-stores-extensive",
      title: "Column-Family Stores",
      description:
        "Deep guide to wide-column databases, data modeling patterns, and scalability trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "column-family-stores",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "nosql", "column-family"],
      relatedTopics: [
        "cap-theorem",
        "base-properties",
        "query-optimization-techniques",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/column-family-stores-extensive"
      ),
  },
  "backend/data-storage-databases/graph-databases-concise": {
    metadata: {
      id: "article-backend-graph-databases-concise",
      title: "Graph Databases",
      description:
        "Concise guide to graph databases, graph modeling, and interview-ready trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "graph-databases",
      version: "concise",
      wordCount: 1850,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "nosql", "graph"],
      relatedTopics: [
        "query-optimization-techniques",
        "cap-theorem",
        "base-properties",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/graph-databases-concise"
      ),
  },
  "backend/data-storage-databases/graph-databases-extensive": {
    metadata: {
      id: "article-backend-graph-databases-extensive",
      title: "Graph Databases",
      description:
        "Deep guide to graph databases, data modeling, traversal queries, and scalability trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "graph-databases",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "nosql", "graph"],
      relatedTopics: [
        "query-optimization-techniques",
        "cap-theorem",
        "base-properties",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/graph-databases-extensive"
      ),
  },
  "backend/data-storage-databases/time-series-databases-concise": {
    metadata: {
      id: "article-backend-time-series-databases-concise",
      title: "Time-Series Databases",
      description:
        "Concise guide to time-series databases, retention policies, and interview-ready trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "time-series-databases",
      version: "concise",
      wordCount: 1850,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "timeseries", "nosql"],
      relatedTopics: [
        "column-family-stores",
        "query-optimization-techniques",
        "database-partitioning",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/time-series-databases-concise"
      ),
  },
  "backend/data-storage-databases/time-series-databases-extensive": {
    metadata: {
      id: "article-backend-time-series-databases-extensive",
      title: "Time-Series Databases",
      description:
        "Deep guide to time-series databases, data modeling, retention, and performance trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "time-series-databases",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "timeseries", "nosql"],
      relatedTopics: [
        "column-family-stores",
        "query-optimization-techniques",
        "database-partitioning",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/time-series-databases-extensive"
      ),
  },
  "backend/data-storage-databases/search-engines-concise": {
    metadata: {
      id: "article-backend-search-engines-concise",
      title: "Search Engines",
      description:
        "Concise guide to search engines, indexing, and interview-ready trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "search-engines",
      version: "concise",
      wordCount: 1850,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "search", "databases", "indexing"],
      relatedTopics: [
        "query-optimization-techniques",
        "serialization-formats",
        "caching-performance",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/search-engines-concise"
      ),
  },
  "backend/data-storage-databases/search-engines-extensive": {
    metadata: {
      id: "article-backend-search-engines-extensive",
      title: "Search Engines",
      description:
        "Deep guide to search engines, inverted indexes, relevance ranking, and scalability trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "search-engines",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "search", "databases", "indexing"],
      relatedTopics: [
        "query-optimization-techniques",
        "serialization-formats",
        "caching-performance",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/search-engines-extensive"
      ),
  },
  "backend/data-storage-databases/consistency-models-concise": {
    metadata: {
      id: "article-backend-consistency-models-concise",
      title: "Consistency Models",
      description:
        "Concise guide to consistency models, trade-offs, and interview-ready concepts.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "consistency-models",
      version: "concise",
      wordCount: 1850,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "distributed-systems", "databases", "consistency"],
      relatedTopics: [
        "cap-theorem",
        "base-properties",
        "read-replicas",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/consistency-models-concise"
      ),
  },
  "backend/data-storage-databases/consistency-models-extensive": {
    metadata: {
      id: "article-backend-consistency-models-extensive",
      title: "Consistency Models",
      description:
        "Deep guide to consistency models, user-visible guarantees, and system trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "consistency-models",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "distributed-systems", "databases", "consistency"],
      relatedTopics: [
        "cap-theorem",
        "base-properties",
        "read-replicas",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/consistency-models-extensive"
      ),
  },
  "backend/data-storage-databases/data-modeling-in-nosql-concise": {
    metadata: {
      id: "article-backend-data-modeling-nosql-concise",
      title: "Data Modeling in NoSQL",
      description:
        "Concise guide to NoSQL data modeling, denormalization, and interview-ready patterns.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "data-modeling-in-nosql",
      version: "concise",
      wordCount: 1850,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "nosql", "modeling"],
      relatedTopics: [
        "document-databases",
        "key-value-stores",
        "column-family-stores",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/data-modeling-in-nosql-concise"
      ),
  },
  "backend/data-storage-databases/data-modeling-in-nosql-extensive": {
    metadata: {
      id: "article-backend-data-modeling-nosql-extensive",
      title: "Data Modeling in NoSQL",
      description:
        "Deep guide to NoSQL data modeling, denormalization patterns, and scalability trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "data-modeling-in-nosql",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "nosql", "modeling"],
      relatedTopics: [
        "document-databases",
        "key-value-stores",
        "column-family-stores",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/data-modeling-in-nosql-extensive"
      ),
  },
  "backend/data-storage-databases/sharding-strategies-concise": {
    metadata: {
      id: "article-backend-sharding-strategies-concise",
      title: "Sharding Strategies",
      description:
        "Concise guide to sharding strategies, partition keys, and interview-ready trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "sharding-strategies",
      version: "concise",
      wordCount: 1850,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sharding", "scaling"],
      relatedTopics: [
        "database-partitioning",
        "cap-theorem",
        "consistency-models",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/sharding-strategies-concise"
      ),
  },
  "backend/data-storage-databases/sharding-strategies-extensive": {
    metadata: {
      id: "article-backend-sharding-strategies-extensive",
      title: "Sharding Strategies",
      description:
        "Deep guide to sharding strategies, key selection, rebalancing, and operational trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "sharding-strategies",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "sharding", "scaling"],
      relatedTopics: [
        "database-partitioning",
        "cap-theorem",
        "consistency-models",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/sharding-strategies-extensive"
      ),
  },
  "backend/data-storage-databases/replication-in-nosql-concise": {
    metadata: {
      id: "article-backend-replication-in-nosql-concise",
      title: "Replication in NoSQL",
      description:
        "Concise guide to NoSQL replication models, trade-offs, and interview-ready concepts.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "replication-in-nosql",
      version: "concise",
      wordCount: 1850,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "nosql", "replication"],
      relatedTopics: [
        "read-replicas",
        "consistency-models",
        "cap-theorem",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/replication-in-nosql-concise"
      ),
  },
  "backend/data-storage-databases/replication-in-nosql-extensive": {
    metadata: {
      id: "article-backend-replication-in-nosql-extensive",
      title: "Replication in NoSQL",
      description:
        "Deep guide to NoSQL replication models, consistency trade-offs, and conflict resolution.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "replication-in-nosql",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "nosql", "replication"],
      relatedTopics: [
        "read-replicas",
        "consistency-models",
        "cap-theorem",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/replication-in-nosql-extensive"
      ),
  },
  "backend/data-storage-databases/conflict-resolution-concise": {
    metadata: {
      id: "article-backend-conflict-resolution-concise",
      title: "Conflict Resolution",
      description:
        "Concise guide to conflict resolution in distributed systems and interview-ready strategies.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "conflict-resolution",
      version: "concise",
      wordCount: 1800,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "distributed-systems", "consistency", "conflicts"],
      relatedTopics: [
        "replication-in-nosql",
        "consistency-models",
        "cap-theorem",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/conflict-resolution-concise"
      ),
  },
  "backend/data-storage-databases/conflict-resolution-extensive": {
    metadata: {
      id: "article-backend-conflict-resolution-extensive",
      title: "Conflict Resolution",
      description:
        "Deep guide to conflict resolution strategies in distributed systems and their trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "conflict-resolution",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "distributed-systems", "consistency", "conflicts"],
      relatedTopics: [
        "replication-in-nosql",
        "consistency-models",
        "cap-theorem",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/conflict-resolution-extensive"
      ),
  },
  "backend/data-storage-databases/query-patterns-concise": {
    metadata: {
      id: "article-backend-query-patterns-concise",
      title: "Query Patterns",
      description:
        "Concise guide to query patterns, access-driven modeling, and interview-ready trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "query-patterns",
      version: "concise",
      wordCount: 1850,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "modeling", "performance"],
      relatedTopics: [
        "data-modeling-in-nosql",
        "query-optimization-techniques",
        "database-indexes",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/query-patterns-concise"
      ),
  },
  "backend/data-storage-databases/query-patterns-extensive": {
    metadata: {
      id: "article-backend-query-patterns-extensive",
      title: "Query Patterns",
      description:
        "Deep guide to query patterns, modeling for access paths, and performance trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "query-patterns",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "modeling", "performance"],
      relatedTopics: [
        "data-modeling-in-nosql",
        "query-optimization-techniques",
        "database-indexes",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/query-patterns-extensive"
      ),
  },
  "backend/data-storage-databases/object-storage-concise": {
    metadata: {
      id: "article-backend-object-storage-concise",
      title: "Object Storage",
      description:
        "Concise guide to object storage, access patterns, and interview-ready trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "object-storage",
      version: "concise",
      wordCount: 1800,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "storage", "object-storage"],
      relatedTopics: [
        "file-systems",
        "block-storage",
        "data-backups-archival",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/object-storage-concise"
      ),
  },
  "backend/data-storage-databases/object-storage-extensive": {
    metadata: {
      id: "article-backend-object-storage-extensive",
      title: "Object Storage",
      description:
        "Deep guide to object storage, durability models, and operational trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "object-storage",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "storage", "object-storage"],
      relatedTopics: [
        "file-systems",
        "block-storage",
        "data-backups-archival",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/object-storage-extensive"
      ),
  },
  "backend/data-storage-databases/file-systems-concise": {
    metadata: {
      id: "article-backend-file-systems-concise",
      title: "File Systems",
      description:
        "Concise guide to file systems, POSIX semantics, and interview-ready trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "file-systems",
      version: "concise",
      wordCount: 1800,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "storage", "file-systems"],
      relatedTopics: [
        "object-storage",
        "block-storage",
        "data-backups-archival",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/file-systems-concise"
      ),
  },
  "backend/data-storage-databases/file-systems-extensive": {
    metadata: {
      id: "article-backend-file-systems-extensive",
      title: "File Systems",
      description:
        "Deep guide to file systems, POSIX semantics, and distributed file system trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "file-systems",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "storage", "file-systems"],
      relatedTopics: [
        "object-storage",
        "block-storage",
        "data-backups-archival",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/file-systems-extensive"
      ),
  },
  "backend/data-storage-databases/block-storage-concise": {
    metadata: {
      id: "article-backend-block-storage-concise",
      title: "Block Storage",
      description:
        "Concise guide to block storage, performance characteristics, and interview-ready trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "block-storage",
      version: "concise",
      wordCount: 1800,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "storage", "block-storage"],
      relatedTopics: [
        "file-systems",
        "object-storage",
        "data-backups-archival",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/block-storage-concise"
      ),
  },
  "backend/data-storage-databases/block-storage-extensive": {
    metadata: {
      id: "article-backend-block-storage-extensive",
      title: "Block Storage",
      description:
        "Deep guide to block storage, performance characteristics, and operational trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "block-storage",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "storage", "block-storage"],
      relatedTopics: [
        "file-systems",
        "object-storage",
        "data-backups-archival",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/block-storage-extensive"
      ),
  },
  "backend/data-storage-databases/cdn-edge-storage-concise": {
    metadata: {
      id: "article-backend-cdn-edge-storage-concise",
      title: "CDN & Edge Storage",
      description:
        "Concise guide to CDN and edge storage concepts, caching, and interview-ready trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "cdn-edge-storage",
      version: "concise",
      wordCount: 1800,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "cdn", "edge", "storage"],
      relatedTopics: [
        "caching-performance",
        "object-storage",
        "compression",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/cdn-edge-storage-concise"
      ),
  },
  "backend/data-storage-databases/cdn-edge-storage-extensive": {
    metadata: {
      id: "article-backend-cdn-edge-storage-extensive",
      title: "CDN & Edge Storage",
      description:
        "Deep guide to CDN and edge storage, caching strategies, and global performance trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "cdn-edge-storage",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "cdn", "edge", "storage"],
      relatedTopics: [
        "caching-performance",
        "object-storage",
        "compression",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/cdn-edge-storage-extensive"
      ),
  },
  "backend/data-storage-databases/data-lakes-concise": {
    metadata: {
      id: "article-backend-data-lakes-concise",
      title: "Data Lakes",
      description:
        "Concise guide to data lakes, storage formats, and interview-ready trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "data-lakes",
      version: "concise",
      wordCount: 1800,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "data-lake", "analytics", "storage"],
      relatedTopics: [
        "data-warehouses",
        "object-storage",
        "data-serialization",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/data-lakes-concise"
      ),
  },
  "backend/data-storage-databases/data-lakes-extensive": {
    metadata: {
      id: "article-backend-data-lakes-extensive",
      title: "Data Lakes",
      description:
        "Deep guide to data lakes, governance, storage formats, and analytics trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "data-lakes",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "data-lake", "analytics", "storage"],
      relatedTopics: [
        "data-warehouses",
        "object-storage",
        "data-serialization",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/data-lakes-extensive"
      ),
  },
  "backend/data-storage-databases/data-warehouses-concise": {
    metadata: {
      id: "article-backend-data-warehouses-concise",
      title: "Data Warehouses",
      description:
        "Concise guide to data warehouses, OLAP workloads, and interview-ready trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "data-warehouses",
      version: "concise",
      wordCount: 1800,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "data-warehouse", "analytics", "olap"],
      relatedTopics: [
        "data-lakes",
        "query-optimization-techniques",
        "sql-queries-optimization",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/data-warehouses-concise"
      ),
  },
  "backend/data-storage-databases/data-warehouses-extensive": {
    metadata: {
      id: "article-backend-data-warehouses-extensive",
      title: "Data Warehouses",
      description:
        "Deep guide to data warehouses, OLAP modeling, and analytics performance trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "data-warehouses",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "data-warehouse", "analytics", "olap"],
      relatedTopics: [
        "data-lakes",
        "query-optimization-techniques",
        "sql-queries-optimization",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/data-warehouses-extensive"
      ),
  },
  "backend/data-storage-databases/blob-storage-concise": {
    metadata: {
      id: "article-backend-blob-storage-concise",
      title: "Blob Storage",
      description:
        "Concise guide to blob storage, access patterns, and interview-ready trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "blob-storage",
      version: "concise",
      wordCount: 1800,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "storage", "blob-storage"],
      relatedTopics: [
        "object-storage",
        "file-systems",
        "cdn-edge-storage",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/blob-storage-concise"
      ),
  },
  "backend/data-storage-databases/blob-storage-extensive": {
    metadata: {
      id: "article-backend-blob-storage-extensive",
      title: "Blob Storage",
      description:
        "Deep guide to blob storage, durability models, and operational trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "blob-storage",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "storage", "blob-storage"],
      relatedTopics: [
        "object-storage",
        "file-systems",
        "cdn-edge-storage",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/blob-storage-extensive"
      ),
  },
  "backend/data-storage-databases/in-memory-databases-concise": {
    metadata: {
      id: "article-backend-in-memory-databases-concise",
      title: "In-Memory Databases",
      description:
        "Concise guide to in-memory databases, latency benefits, and interview-ready trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "in-memory-databases",
      version: "concise",
      wordCount: 1800,
      readingTime: 9,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "in-memory", "performance"],
      relatedTopics: [
        "caching-performance",
        "key-value-stores",
        "connection-pooling",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/in-memory-databases-concise"
      ),
  },
  "backend/data-storage-databases/in-memory-databases-extensive": {
    metadata: {
      id: "article-backend-in-memory-databases-extensive",
      title: "In-Memory Databases",
      description:
        "Deep guide to in-memory databases, persistence options, and performance trade-offs.",
      category: "backend",
      subcategory: "data-storage-databases",
      slug: "in-memory-databases",
      version: "extensive",
      wordCount: 11000,
      readingTime: 55,
      lastUpdated: "2026-03-09",
      tags: ["backend", "databases", "in-memory", "performance"],
      relatedTopics: [
        "caching-performance",
        "key-value-stores",
        "connection-pooling",
      ],
    },
    loader: () =>
      import(
        "./articles/backend/data-storage-databases/in-memory-databases-extensive"
      ),
  },
  "frontend/rendering-strategies/client-side-rendering-concise": {
    metadata: {
      id: "article-frontend-client-sid-concise",
      title: "Client-Side Rendering (CSR)",
      description: "Comprehensive guide to Client-Side Rendering (CSR) covering concepts, implementation, and best practices.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "client-side-rendering",
      version: "concise",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/client-side-rendering-concise"),
  },
  "frontend/rendering-strategies/client-side-rendering-extensive": {
    metadata: {
      id: "article-frontend-client-sid-extensive",
      title: "Client-Side Rendering (CSR)",
      description: "Comprehensive guide to Client-Side Rendering (CSR) covering concepts, implementation, and best practices.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "client-side-rendering",
      version: "extensive",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/client-side-rendering-extensive"),
  },
  "frontend/rendering-strategies/server-side-rendering-concise": {
    metadata: {
      id: "article-frontend-server-sid-concise",
      title: "Server-Side Rendering (SSR)",
      description: "Comprehensive guide to server-side rendering, covering execution, benefits, trade-offs, and implementation strategies.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "server-side-rendering",
      version: "concise",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering","SSR","performance","SEO"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/server-side-rendering-concise"),
  },
  "frontend/rendering-strategies/server-side-rendering-extensive": {
    metadata: {
      id: "article-frontend-server-sid-extensive",
      title: "Server-Side Rendering (SSR)",
      description: "Comprehensive guide to server-side rendering, covering execution, benefits, trade-offs, and implementation strategies.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "server-side-rendering",
      version: "extensive",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering","SSR","performance","SEO"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/server-side-rendering-extensive"),
  },
  "frontend/rendering-strategies/static-site-generation-concise": {
    metadata: {
      id: "article-frontend-static-sit-concise",
      title: "Static Site Generation (SSG)",
      description: "Deep dive into static site generation, pre-rendering strategies, build-time optimization, and when to use SSG.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "static-site-generation",
      version: "concise",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering","SSG","performance","JAMstack"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/static-site-generation-concise"),
  },
  "frontend/rendering-strategies/static-site-generation-extensive": {
    metadata: {
      id: "article-frontend-static-sit-extensive",
      title: "Static Site Generation (SSG)",
      description: "Deep dive into static site generation, pre-rendering strategies, build-time optimization, and when to use SSG.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "static-site-generation",
      version: "extensive",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering","SSG","performance","JAMstack"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/static-site-generation-extensive"),
  },
  "frontend/rendering-strategies/incremental-static-regeneration-concise": {
    metadata: {
      id: "article-frontend-incrementa-concise",
      title: "Incremental Static Regeneration (ISR)",
      description: "Complete guide to ISR, combining static generation with on-demand revalidation for dynamic content at scale.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "incremental-static-regeneration",
      version: "concise",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering","ISR","Next.js","hybrid"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/incremental-static-regeneration-concise"),
  },
  "frontend/rendering-strategies/incremental-static-regeneration-extensive": {
    metadata: {
      id: "article-frontend-incrementa-extensive",
      title: "Incremental Static Regeneration (ISR)",
      description: "Complete guide to ISR, combining static generation with on-demand revalidation for dynamic content at scale.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "incremental-static-regeneration",
      version: "extensive",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering","ISR","Next.js","hybrid"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/incremental-static-regeneration-extensive"),
  },
  "frontend/rendering-strategies/progressive-hydration-concise": {
    metadata: {
      id: "article-frontend-progressiv-concise",
      title: "Progressive Hydration",
      description: "Learn progressive hydration techniques for optimizing time-to-interactive by gradually activating components based on priority.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "progressive-hydration",
      version: "concise",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering","hydration","performance","interactivity"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/progressive-hydration-concise"),
  },
  "frontend/rendering-strategies/progressive-hydration-extensive": {
    metadata: {
      id: "article-frontend-progressiv-extensive",
      title: "Progressive Hydration",
      description: "Learn progressive hydration techniques for optimizing time-to-interactive by gradually activating components based on priority.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "progressive-hydration",
      version: "extensive",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering","hydration","performance","interactivity"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/progressive-hydration-extensive"),
  },
  "frontend/rendering-strategies/selective-hydration-concise": {
    metadata: {
      id: "article-frontend-selective--concise",
      title: "Selective Hydration",
      description: "Master selective hydration patterns to hydrate only interactive components, reducing JavaScript overhead and improving performance.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "selective-hydration",
      version: "concise",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering","hydration","React","performance"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/selective-hydration-concise"),
  },
  "frontend/rendering-strategies/selective-hydration-extensive": {
    metadata: {
      id: "article-frontend-selective--extensive",
      title: "Selective Hydration",
      description: "Master selective hydration patterns to hydrate only interactive components, reducing JavaScript overhead and improving performance.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "selective-hydration",
      version: "extensive",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering","hydration","React","performance"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/selective-hydration-extensive"),
  },
  "frontend/rendering-strategies/islands-architecture-concise": {
    metadata: {
      id: "article-frontend-islands-ar-concise",
      title: "Islands Architecture",
      description: "Explore islands architecture pattern for building performant web apps with isolated interactive components in a sea of static content.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "islands-architecture",
      version: "concise",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering","architecture","Astro","performance"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/islands-architecture-concise"),
  },
  "frontend/rendering-strategies/islands-architecture-extensive": {
    metadata: {
      id: "article-frontend-islands-ar-extensive",
      title: "Islands Architecture",
      description: "Explore islands architecture pattern for building performant web apps with isolated interactive components in a sea of static content.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "islands-architecture",
      version: "extensive",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering","architecture","Astro","performance"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/islands-architecture-extensive"),
  },
  "frontend/rendering-strategies/streaming-ssr-concise": {
    metadata: {
      id: "article-frontend-streaming--concise",
      title: "Streaming SSR",
      description: "Understand streaming server-side rendering for faster time-to-first-byte and improved perceived performance with progressive content delivery.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "streaming-ssr",
      version: "concise",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering","SSR","streaming","React","performance"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/streaming-ssr-concise"),
  },
  "frontend/rendering-strategies/streaming-ssr-extensive": {
    metadata: {
      id: "article-frontend-streaming--extensive",
      title: "Streaming SSR",
      description: "Understand streaming server-side rendering for faster time-to-first-byte and improved perceived performance with progressive content delivery.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "streaming-ssr",
      version: "extensive",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering","SSR","streaming","React","performance"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/streaming-ssr-extensive"),
  },
  "frontend/rendering-strategies/edge-rendering-concise": {
    metadata: {
      id: "article-frontend-edge-rende-concise",
      title: "Edge Rendering",
      description: "Learn edge rendering strategies for delivering personalized content with minimal latency using edge compute platforms.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "edge-rendering",
      version: "concise",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering","edge","CDN","performance","Vercel"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/edge-rendering-concise"),
  },
  "frontend/rendering-strategies/edge-rendering-extensive": {
    metadata: {
      id: "article-frontend-edge-rende-extensive",
      title: "Edge Rendering",
      description: "Learn edge rendering strategies for delivering personalized content with minimal latency using edge compute platforms.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "edge-rendering",
      version: "extensive",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering","edge","CDN","performance","Vercel"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/edge-rendering-extensive"),
  },
  "frontend/rendering-strategies/partial-hydration-concise": {
    metadata: {
      id: "article-frontend-partial-hy-concise",
      title: "Partial Hydration",
      description: "Discover partial hydration techniques for shipping less JavaScript by hydrating only necessary components on demand.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "partial-hydration",
      version: "concise",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering","hydration","performance","optimization"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/partial-hydration-concise"),
  },
  "frontend/rendering-strategies/partial-hydration-extensive": {
    metadata: {
      id: "article-frontend-partial-hy-extensive",
      title: "Partial Hydration",
      description: "Discover partial hydration techniques for shipping less JavaScript by hydrating only necessary components on demand.",
      category: "frontend",
      subcategory: "rendering-strategies",
      slug: "partial-hydration",
      version: "extensive",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "2026-03-05",
      tags: ["frontend","rendering","hydration","performance","optimization"],
    },
    loader: () => import("./articles/frontend/rendering-strategies/partial-hydration-extensive"),
  },
};
