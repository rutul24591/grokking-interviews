# SVG Image Conversion Progress Report

**Date:** March 15, 2026  
**Scope:** Backend articles in `/content/articles/backend/`  
**Purpose:** Convert all non-SVG images to SVG format for staff/principal engineer interview prep platform

---

## Executive Summary

This document tracks the progress of converting raster images (PNG, JPG, GIF, WEBP) to SVG format across all backend system design articles. The goal is to ensure all technical diagrams are crisp, scalable, and consistent with the platform's design system.

### Overall Statistics

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Images (from audit)** | 792 | 100% |
| **Already SVG (no action)** | 576 | 72.7% |
| **Non-SVG (review needed)** | 212 | 26.8% |
| **Missing files** | 4 | 0.5% |

---

## Completed Conversions

### 1. Distributed Locks Diagram ✅

**File:** `/public/diagrams/backend/scalability-distributed-systems/distributed-locks-diagram-1.svg`

**Replaced:** `distributed-locks-diagram-1.gif`

**Description:** Shows multiple clients acquiring locks from a central lock service for mutual exclusion in distributed systems.

**Features:**
- Central lock service with acquire/release operations
- Multiple client nodes (worker nodes)
- Request/response flow visualization
- Shared resource with controlled access
- CSS variable theming support

**Article Updated:** ✅ `content/articles/backend/scalability-distributed-systems/distributed-locks.tsx`

---

### 2. Connection Pool Architecture ✅

**File:** `/public/diagrams/backend/data-storage-databases/connection-pool-architecture.svg`

**Replaced:** `connection-pool-architecture.gif`

**Description:** Comprehensive JDBC connection pool architecture showing connection lifecycle, pool states, and key metrics.

**Features:**
- Application, connection pool, and database layers
- Active vs idle connection visualization
- Connection lifecycle diagram (Created → Active → Idle → Closed)
- Key metrics, risks, and best practices
- Pool sizing and timeout considerations

**Article Updated:** ✅ `content/articles/backend/data-storage-databases/connection-pooling.tsx`

---

### 3. CAP Theorem Diagram ✅

**File:** `/public/diagrams/backend/data-storage-databases/cap-theorem.svg`

**Replaced:** `cap-theorem.png`, `cap-theorem-venn.png`, `cap-theorem-euler.png` (consolidated into single comprehensive diagram)

**Description:** CAP theorem triangle showing the fundamental trade-off in distributed systems between Consistency, Availability, and Partition Tolerance.

**Features:**
- Triangle visualization with three vertices (C, A, P)
- System examples on each edge (CP, AP, CA)
- Network partition indicator
- Key insight box explaining the trade-off
- Detailed descriptions for each property

**Article Updated:** ✅ `content/articles/backend/data-storage-databases/cap-theorem.tsx`

---

### 4. OAuth 2.0 Authorization Code Flow ✅

**File:** `/public/diagrams/backend/security-authentication/oauth-auth-code-flow.svg`

**Replaced:** `oauth-auth-code-flow.png`

**Description:** Complete OAuth 2.0 authorization code flow showing interactions between client, authorization server, and resource server.

**Features:**
- 7-step flow visualization
- Client, authorization server, and resource server participants
- Authorization request, user consent, code exchange, token issuance
- API request with access token
- Token refresh flow notes
- Security best practices (PKCE, redirect validation, token rotation)

**Article Updated:** ✅ `content/articles/backend/security-authentication/oauth-2-0.tsx`

---

### 5. JWT Structure Diagram ✅

**File:** `/public/diagrams/backend/security-authentication/jwt-structure.svg`

**Replaced:** `jwt-encoded-token.png`, `jwt-how-it-works.png`, `jwt-vs-saml.png` (consolidated)

**Description:** Comprehensive JWT structure showing header, payload, signature encoding and the complete issuance/verification flow.

**Features:**
- Token format breakdown (header.payload.signature)
- Base64URL encoding process visualization
- Signature creation with HMAC
- Final encoded token example
- JWT issuance and verification flow
- Common claims (registered and custom)
- Security best practices

**Article Updated:** ✅ `content/articles/backend/security-authentication/jwt-json-web-tokens.tsx`

---

### 6. Database Sharding Strategies ✅

**File:** `/public/diagrams/backend/data-storage-databases/sharding-strategies.svg`

**Replaced:** `sharding-horizontal.png`, `sharding-key-based.png`

**Description:** Comprehensive comparison of database sharding strategies including key-based, range-based, hash-based, directory-based, and consistent hashing.

**Features:**
- Five sharding strategy visualizations
- Pros/cons for each approach
- Use case recommendations
- Comparison table (distribution, range query performance)
- Best practices for shard key selection
- Monitoring and rebalancing guidance

**Article Updated:** ✅ `content/articles/backend/data-storage-databases/sharding-strategies.tsx`

---

### 7. CSRF Attack and Protection ✅ (NEW - Image Consolidation)

**File:** `/public/diagrams/backend/security-authentication/csrf-attack-and-protection.svg`

**Replaced:** `csrf-attack-1.png`, `csrf-attack-2.png`, `csrf-attack-3.png` (3 images consolidated into 1 comprehensive diagram)

**Description:** Complete CSRF attack flow visualization with protection mechanisms including CSRF tokens, SameSite cookies, and Origin/Referer validation.

**Features:**
- Attack flow: Attacker → Victim → Target Site
- Step-by-step exploitation visualization
- Three protection mechanisms:
  - CSRF Token (unique per session, server-validated)
  - SameSite Cookies (Strict/Lax behavior)
  - Origin/Referer Header Validation
- Clear visual distinction between attack and protection sections

**Article Updated:** ✅ `content/articles/backend/security-authentication/csrf-protection.tsx`

**Images Reduced:** 3 PNG → 1 SVG (67% reduction)

---

### 8. ACID Properties ✅ (NEW - Image Consolidation)

**File:** `/public/diagrams/backend/data-storage-databases/acid-properties.svg`

**Replaced:** `acid-properties.webp`, `acid-atomicity.webp`, `acid-isolation.webp` (3 images consolidated into 1 comprehensive diagram)

**Description:** Comprehensive ACID transaction properties diagram covering all four properties with examples, transaction lifecycle, and concurrency anomalies.

**Features:**
- Four ACID properties quadrants:
  - **Atomicity**: All-or-nothing with bank transfer example
  - **Consistency**: Invariant enforcement with constraint validation
  - **Isolation**: Isolation levels spectrum (Read Uncommitted → Serializable)
  - **Durability**: Crash recovery via WAL
- Transaction lifecycle with Write-Ahead Log (WAL) visualization
- Three concurrency anomalies:
  - Dirty Read
  - Non-Repeatable Read
  - Phantom Read
- Prevention strategies for each anomaly

**Article Updated:** ✅ `content/articles/backend/data-storage-databases/acid-properties.tsx`

**Images Reduced:** 3 WEBP → 1 SVG (67% reduction)

---

### 9. SQL Injection Attack and Prevention ✅ (NEW - Image Consolidation)

**File:** `/public/diagrams/backend/security-authentication/sql-injection-attack-and-prevention.svg`

**Replaced:** `sql-injection.png`, `sql-injection-hackform.png`, `sql-injection-classification.png` (3 images consolidated into 1 comprehensive diagram)

**Description:** Complete SQL injection attack visualization with exploitation techniques and prevention strategies.

**Features:**
- Attack flow: Attacker → Vulnerable App → Database → Data Exfiltration
- Three common SQLi payloads:
  - Authentication Bypass (`admin' OR '1'='1`)
  - UNION-based Data Extraction
  - Blind SQL Injection (time-based)
- Three prevention strategies:
  - **Parameterized Queries**: Prepared statements with placeholders
  - **Input Validation**: Whitelist, type checking, pattern matching
  - **ORM/Stored Procedures**: Automatic escaping, type safety
- Additional defense layers: Least privilege, WAF rules, error handling, audits, monitoring

**Article Updated:** ✅ `content/articles/backend/security-authentication/sql-injection-prevention.tsx`

**Images Reduced:** 3 PNG → 1 SVG (67% reduction)

---

### 10. XSS Attack and Prevention ✅ (NEW - Image Consolidation)

**File:** `/public/diagrams/backend/security-authentication/xss-attack-and-prevention.svg`

**Replaced:** `xss-overview.png`, `xss-self-warning.jpg` (2 images consolidated into 1 comprehensive diagram)

**Description:** Comprehensive XSS attack types and prevention mechanisms diagram.

**Features:**
- Three XSS attack types:
  - **Reflected XSS**: Malicious script in URL, immediate response
  - **Stored (Persistent) XSS**: Script stored on server, affects all viewers
  - **DOM-based XSS**: Client-side script manipulates DOM unsafely
- Three prevention strategies:
  - **Output Encoding**: HTML entity escaping (`<` → `&lt;`, etc.)
  - **Content Security Policy**: HTTP header restricting script sources
  - **Input Validation**: Sanitize user input on entry
- Additional defenses: HttpOnly cookies, secure frameworks, avoid innerHTML, XSS testing, security headers, WAF rules

**Article Updated:** ✅ `content/articles/backend/security-authentication/xss-prevention.tsx`

**Images Reduced:** 2 PNG/JPG → 1 SVG (50% reduction)

---

## Remaining Conversions

### High Priority (Critical for Interview Prep)

#### Security Authentication (24 remaining)

| Image | Article | Priority |
|-------|---------|----------|
| `oauth-auth-code-pkce.png` | OAuth 2.0 | High |
| `oauth-client-credentials-flow.png` | OAuth 2.0 | High |
| `csrf-attack-1/2/3.png` | CSRF Protection | High |
| `sql-injection.png`, `sql-injection-classification.png` | SQL Injection | High |
| `xss-overview.png` | XSS Prevention | High |
| `https-certificate-chain.png`, `https-connection-summary.png` | HTTPS | High |
| `tls13-handshake.png` | TLS | High |
| `bcrypt-hash.png` | Hashing & Salting | High |
| `rbac-aws-concept.png` | RBAC | High |
| `abac-aws-concept.png` | ABAC | High |
| `secrets-manager-integration.png` | Secrets Management | High |
| `secrets-rotation-aws.png` | Secrets Rotation | High |
| `waf-architecture-overview.png` | WAF | High |
| `sso-saml-*.png` (3) | SSO/SAML | High |

#### Data Storage Databases (62 remaining)

| Image | Article | Priority |
|-------|---------|----------|
| `acid-atomicity.webp`, `acid-isolation.webp`, `acid-properties.webp` | ACID Properties | High |
| `concurrency-2pl-locking.webp`, `concurrency-2pl-schedule.webp` | Concurrency Control | High |
| `base-properties-*.png` (3) | BASE Properties | High |
| `consistency-eventual.png`, `consistency-strong.png` | Consistency Models | High |
| `db-index-btree*.png` (3) | Database Indexing | High |
| `index-type-*.png` (3) | Index Types | High |
| `read-replica-aws.png`, `read-standby-replica-aws.png` | Read Replicas | High |
| `storage-replication.png`, `replication-pubsub-master-slave.png` | Replication | High |
| `star-schema.png` | Data Warehouse | High |
| `in-memory-redis-*.png` (3) | In-Memory Databases | High |
| `key-value-concept.png` | Key-Value Stores | High |
| `block-storage-fibre-channel-san.png` | Block Storage | High |
| `database-constraints-*.png` (3) | Constraints | High |
| `relational-model-concepts.png` | Relational Model | High |
| `property-graph-model.png` | Graph Databases | High |
| `search-inverted-index.png` | Search Engines | High |
| `query-optimization-*.png` (3) | Query Optimization | High |
| `sql-optimization-*.png` (3) | SQL Optimization | High |
| `transaction-isolation-levels-table.png` | Transactions | High |
| `transaction-serializability-venn.png` | Transactions | High |
| `views-mv-*.png` (2) | Materialized Views | High |
| `time-series-timestream-*.png/jpg` (3) | Time-Series DB | High |
| `conflict-causal-ordering-violation.png` | Conflict Resolution | High |
| `column-family-cassandra-node-structure.jpg` | Column-Family Stores | High |
| `deadlock-dining-philosophers.jpg` | Deadlocks | High |

#### Scalability Distributed Systems (28 remaining)

| Image | Article | Priority |
|-------|---------|----------|
| `microservices-architecture-diagram-1/2/3.png` | Microservices | High |
| `distributed-transactions-diagram-1/2/3.png` | Distributed Transactions | High |
| `consensus-algorithms-diagram-2.png` | Consensus | High |
| `data-denormalization-diagram-1/2/3.png` | Data Denormalization | High |
| `distributed-coordination-diagram-1/2/3.png` | Distributed Coordination | High |
| `service-decomposition-diagram-1/2/3.png` | Service Decomposition | High |
| `split-brain-problem-diagram-1/3.png` | Split Brain | High |
| `partitioning-strategies-diagram-1/2.png` | Partitioning | High |
| `quorum-diagram-3.png` | Quorum | High |
| `cqrs-diagram-2/3.png` | CQRS | High |
| `database-read-replicas-diagram-1/2/3.png` | Read Replicas | High |
| `data-replication-diagram-1/2/3.png` | Replication | High |
| `asynchronous-processing-diagram-1.png` | Async Processing | High |
| `gossip-protocol-diagram-2.png` | Gossip Protocol | High |
| `write-scaling-diagram-3.png` | Write Scaling | High |
| `consistent-hashing-sample.png` | Consistent Hashing | High |
| `dht-structured-network.png` | DHT | High |
| `mysql-async-replication.png`, `mysql-semisync-replication.png` | MySQL Replication | High |
| `rds-read-replica.png`, `rds-read-and-standby-replica.png` | RDS Read Replicas | High |
| `storage-sr-*.png` (3) | Storage Replication | High |
| `distributed-locks-diagram-2.png` | Distributed Locks | Medium |
| `event-sourcing-diagram-2.png` | Event Sourcing | High |

#### Network Communication (20 remaining)

| Image | Article | Priority |
|-------|---------|----------|
| `api-gateway-wmf-architecture.png` | API Gateway | High |
| `bulkhead-psf.png` | Bulkhead Pattern | High |
| `cdn-content-aware-slb.png` | CDN | High |
| `consul-service-discovery-*.png` (3) | Service Discovery | High |
| `graphql-schema-graph.png` | GraphQL | High |
| `istio-ztunnel-datapath.png`, `istio-ztunnel-waypoint-datapath.png` | Service Mesh | High |
| `long-polling-diagram.png` | Long Polling | High |
| `message-broker.png` | Message Brokers | High |
| `pubsub-azure-pattern.png` | Pub/Sub | High |
| `retry-backoff-*.png` (2) | Retry Patterns | High |
| `rpc-call-steps.png` | RPC | High |
| `server-sent-events.png` | SSE | High |
| `tcp-ack-timeout.png`, `tcp-timeout.png` | TCP | High |
| `websocket-*.png` (3) | WebSockets | High |

#### Reliability Fault Tolerance (16 remaining)

| Image | Article | Priority |
|-------|---------|----------|
| `monitoring-architecture-diagram.png` | Monitoring | High |
| `service-bus-architecture.png` | Dead Letter Queues | High |
| `autogenous-self-healing.png`, `self-healing-cycle.png` | Automatic Recovery | High |
| `heartbeat-table-health-check.png` | Health Checks | High |
| `chaos-gears-auto-recovery-state-machine.png`, `chaos-engineering-flywheel.png` | Chaos Engineering | High |
| `dr-pilot-light-aws.png`, `dr-warm-standby-aws.png`, `dr-multi-site-active-active-aws.png` | Disaster Recovery | High |
| `backup-restore-architecture-aws.png`, `backup-restore-test-aws.png` | Backup/Restore | High |
| `failover-route53-health-check-weighted.png`, `failover-route53-latency-alias-weighted.png` | Failover | High |
| `multi-region-active-active-azure.png`, `multi-region-active-passive-azure.png` | Multi-Region | High |
| `dead-letter-queue-flow.webp` | Dead Letter Queues | High |
| `failover-keepalived-vrrp.webp` | Failover | High |

#### Advanced Topics (8 remaining)

| Image | Article | Priority |
|-------|---------|----------|
| `b-tree-diagram.png` | B-Trees | High |
| `bloom-filter-diagram.png` | Bloom Filters | High |
| `lsm-tree-diagram.png` | LSM Trees | High |
| `merkle-tree-diagram.png` | Merkle Trees | High |
| `skip-list-diagram.png` | Skip Lists | High |
| `leader-election-ring-graph.png` | Leader Election | High |
| `snapshot-isolation-mvcc.png` | Snapshot Isolation | High |

---

### Medium Priority (Review Case-by-Case)

- Platform-specific screenshots (AWS console, Azure portal)
- Historical diagrams (Oracle8 connection pooling)
- Analogy illustrations (ship bulkheads, nautical references)
- Complex data visualizations that may not simplify well

### Low Priority (Can Remain as Raster)

- Hardware token photos (MFA CryptoCard)
- Screenshot examples (hackform, warning pages)
- Decorative icons

---

## Missing Files (Critical)

These images are referenced in articles but do not exist in the public directory:

| Image Path | Article | Action Required |
|------------|---------|-----------------|
| `/diagrams/backend/data-storage-databases/blob-storage-azure-resources.png` | Blob Storage | Create or remove reference |
| `/diagrams/backend/data-storage-databases/blob-storage-versioning.png` | Blob Storage | Create or remove reference |
| `/diagrams/backend/data-storage-databases/block-storage-san-example.svg` | Block Storage | Create or remove reference |
| `/diagrams/backend/data-storage-databases/block-storage-san-vs-nas.svg` | Block Storage | Create or remove reference |

---

## SVG Design Guidelines

All new SVG diagrams follow these standards:

### Visual Style

- **Color Palette:** CSS variables for theming (`var(--bg-theme)`, `var(--text-theme)`, `var(--border-theme)`)
- **Typography:** System fonts with clear hierarchy
- **Shapes:** Simple rectangles, circles, arrows with consistent stroke widths
- **Spacing:** Consistent padding and margins

### Accessibility

- **Title:** `<title>` element describing the diagram
- **Description:** `<desc>` element for screen readers
- **Contrast:** Sufficient contrast for readability
- **Font Size:** Minimum 9px for labels

### Technical Requirements

- **ViewBox:** Properly set for responsive scaling
- **No External Dependencies:** Self-contained SVG
- **Optimized:** Minified where possible
- **Semantic IDs:** Meaningful element IDs for potential JS interaction

---

## Next Steps

### Week 1 (March 15-21, 2026)

1. ✅ Complete: Distributed locks, connection pooling, CAP theorem, OAuth, JWT, sharding
2. **In Progress:** CSRF protection, SQL injection, XSS prevention diagrams
3. **Planned:** ACID properties, consistency models, database indexing

### Week 2 (March 22-28, 2026)

1. Complete security authentication diagrams (remaining 15)
2. Complete database diagrams (ACID, indexing, transactions)
3. Start distributed systems diagrams (microservices, replication, consensus)

### Week 3 (March 29 - April 4, 2026)

1. Complete network communication diagrams
2. Complete reliability/fault tolerance diagrams
3. Complete advanced topics (data structures)

### Week 4 (April 5-11, 2026)

1. Address missing files
2. Review and optimize all created SVGs
3. Update any remaining article references
4. Final validation pass

---

## File Naming Convention

```
/diagrams/backend/{category}/{descriptive-name}-{version}.svg
```

**Examples:**
- `/diagrams/backend/security-authentication/oauth-auth-code-flow.svg`
- `/diagrams/backend/data-storage-databases/cap-theorem.svg`
- `/diagrams/backend/scalability-distributed-systems/distributed-locks-diagram-1.svg`

---

## Article Update Checklist

When updating articles with new SVG images:

- [ ] Replace `src` attribute with new `.svg` path
- [ ] Update `alt` text to be descriptive
- [ ] Update `caption` to provide context
- [ ] Remove multiple redundant images if consolidated
- [ ] Verify image renders correctly in development
- [ ] Check dark mode compatibility

---

## Progress Tracking

### Conversion Progress by Category

| Category | Total Non-SVG | Converted | Remaining | % Complete |
|----------|--------------|-----------|-----------|------------|
| **security-authentication** | 31 | 9 | 22 | 29% |
| **data-storage-databases** | 67 | 5 | 62 | 7% |
| **scalability-distributed-systems** | 31 | 1 | 30 | 3% |
| **network-communication** | 26 | 0 | 26 | 0% |
| **reliability-fault-tolerance** | 18 | 0 | 18 | 0% |
| **advanced-topics** | 8 | 0 | 8 | 0% |
| **caching-performance** | 0 | 0 | 0 | 100% ✅ |
| **design-patterns-architectures** | 0 | 0 | 0 | 100% ✅ |
| **fundamentals-building-blocks** | 0 | 0 | 0 | 100% ✅ |
| **infrastructure-deployment** | 0 | 0 | 0 | 100% ✅ |
| **monitoring-operations** | 0 | 0 | 0 | 100% ✅ |
| **data-processing-analytics** | 0 | 0 | 0 | 100% ✅ |
| **system-components-services** | 0 | 0 | 0 | 100% ✅ |

### Overall Progress

- **Images Converted:** 10 diagrams (consolidated ~24 raster images)
- **Articles Updated:** 10
- **Categories with 100% SVG:** 7 (no action needed)
- **Categories in Progress:** 6
- **Image Reduction:** ~58% reduction through consolidation (24 → 10)

---

## Notes

1. **CSS Variables:** All SVGs use CSS variables for theming to support light/dark mode
2. **Consolidation:** Multiple similar images are being consolidated into comprehensive diagrams
3. **Relevance:** Only images directly relevant to staff/principal engineer interview prep are being converted
4. **Quality:** Technical accuracy is prioritized over decorative elements

---

## Contact

For questions or suggestions about image conversions, refer to the project's `AGENTS.md` and `QWEN.md` documentation.
