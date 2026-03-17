"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { ContentArea } from "@/components/ContentArea";
import { parseHierarchy } from "@/lib/parseHierarchy";
import type { Domain } from "@/features/sidebar/sidebar.store";

type AppLayoutProps = {
  children: React.ReactNode;
};

// Hierarchy data is embedded at build time
const HIERARCHY_DATA = `1.  System Design Concepts
    a.  Frontend-concepts
        1. Rendering Strategies
        • Client-Side Rendering (CSR)
        • Server-Side Rendering (SSR)
        • Static Site Generation (SSG)
        • Incremental Static Regeneration (ISR)
        • Progressive Hydration
        • Selective Hydration
        • Islands Architecture
        • Streaming SSR
        • Edge Rendering
        • Partial Hydration

        2. Performance Optimization
        • Code Splitting
        • Lazy Loading (Images, Components, Routes)
        • Tree Shaking
        • Bundle Size Optimization
        • Critical CSS
        • Resource Hints (prefetch, preload, preconnect, dns-prefetch)
        • Image Optimization (WebP, AVIF, responsive images, srcset)
        • Web Vitals (LCP, FID, CLS, TTFB, INP)
        • Performance Budgets
        • Virtualization/Windowing (for long lists)
        • Memoization and React.memo
        • Debouncing and Throttling
        • Request Deduplication
        • Compression (Gzip, Brotli)
        • Minification and Uglification
        • Above-the-fold optimization

        3. Caching Strategies
        • Browser Caching (HTTP Cache Headers: Cache-Control, ETag, Last-Modified)
        • Service Worker Caching
        • Memory Caching (in-memory cache for API responses)
        • CDN Caching
        • Cache Invalidation Strategies
        • Stale-While-Revalidate
        • Cache-First, Network-First, Network-Only strategies
        • IndexedDB for large data caching
        • Application Cache (deprecated but good to know)

        4. State Management
        • Local Component State
        • Global State Management (Redux, MobX, Zustand, Recoil)
        • Server State Management (React Query, SWR, Apollo Client)
        • URL State/Query Parameters
        • Form State Management
        • State Synchronization across tabs
        • Optimistic Updates
        • State Persistence
        • Derived State
        • State Normalization
        • Immutable State Updates

        5. Data Storage
        • LocalStorage
        • SessionStorage
        • IndexedDB
        • Web SQL (deprecated)
        • Cookies
        • Cache API
        • File System Access API
        • Storage Quotas and Eviction

        6. Networking & API Communication
        • REST API Design
        • GraphQL
        • WebSockets
        • Server-Sent Events (SSE)
        • Short Polling
        • Long Polling
        • HTTP/2 and HTTP/3
        • Request Batching
        • Request Queuing
        • Retry Logic and Exponential Backoff
        • Circuit Breaker Pattern
        • API Rate Limiting (client-side handling)
        • CORS handling
        • Request Cancellation (AbortController)
        • Multipart Upload
        • Chunked Transfer Encoding
        • WebRTC for peer-to-peer

        7. Offline Support
        • Progressive Web Apps (PWA)
        • Service Workers
        • Offline-First Architecture
        • Background Sync
        • Periodic Background Sync
        • Conflict Resolution for offline changes
        • Network Status Detection

        8. Security
        • XSS Prevention
        • CSRF Protection
        • Content Security Policy (CSP)
        • HTTPS/TLS
        • Secure Cookie Attributes (HttpOnly, Secure, SameSite)
        • Input Validation and Sanitization
        • Authentication (JWT, OAuth, Session-based)
        • Authorization and Role-Based Access Control
        • Subresource Integrity (SRI)
        • Clickjacking Prevention (X-Frame-Options)
        • Rate Limiting on client side
        • Secure Storage of Sensitive Data
        • Token Refresh Strategies

    b.  Backend-concepts
        1. Fundamentals & Building Blocks
        • Client-Server Architecture
        • HTTP/HTTPS Protocol
        • REST API Design
        • API Design Best Practices
        • Domain Name System (DNS)
        • IP Addressing
        • TCP vs UDP
        • OSI Model & TCP/IP Stack
        • Networking Fundamentals
        • Horizontal vs Vertical Scaling
        • Stateless vs Stateful Services
        • Request/Response Lifecycle
        • Serialization Formats
        • Character Encoding
        • Compression

        2. Data Storage & Databases
        • SQL Databases
        • NoSQL Databases
        • Database Indexes
        • Query Optimization
        • Transaction Isolation Levels
        • Concurrency Control
        • Database Partitioning
        • Read Replicas
        • Connection Pooling
        • ORMs

        3. Caching & Performance
        • Caching Strategies
        • Cache Eviction Policies
        • Cache Invalidation
        • Distributed Caching
        • CDN Caching
        • Lazy Loading
        • Prefetching

        4. Network & Communication
        • API Gateway Pattern
        • Load Balancers
        • WebSockets
        • Server-Sent Events (SSE)
        • gRPC
        • GraphQL
        • Message Queues
        • Pub/Sub Systems
        • Circuit Breaker Pattern

        5. Scalability & Distributed Systems
        • Consistent Hashing
        • Database Sharding
        • Replication Strategies
        • Distributed Transactions
        • CQRS
        • Event Sourcing
        • Microservices Architecture

        6. Reliability & Fault Tolerance
        • High Availability
        • Disaster Recovery
        • Failover Mechanisms
        • Health Checks
        • Graceful Degradation
        • Idempotency

        7. Security & Authentication
        • OAuth 2.0
        • JWT
        • Session Management
        • Encryption
        • TLS/SSL
        • Rate Limiting

        8. Monitoring & Operations
        • Logging
        • Metrics
        • Tracing
        • APM
        • Alerting

        9. Data Processing & Analytics
        • Batch Processing
        • Stream Processing
        • ETL/ELT Pipelines
        • Apache Kafka
        • Apache Spark

        10. Design Patterns & Architectures
        • Monolithic Architecture
        • Microservices Architecture
        • Serverless Architecture
        • Event-Driven Architecture
        • CQRS Pattern
        • Saga Pattern

        11. Infrastructure & Deployment
        • Containerization
        • Container Orchestration
        • CI/CD Pipelines
        • Blue-Green Deployment
        • Canary Deployment
        • Feature Flags

        12. System Components & Services
        • Authentication Service
        • Authorization Service
        • Notification Service
        • Search Service
        • Payment Processing

        13. Advanced Topics
        • Global Distribution
        • CRDTs
        • Leader Election
        • Bloom Filters
        • Merkle Trees
        • LSM Trees

2.  Requirements
    a.  Functional Requirements
        1. Identity & Access
        • Signup
        • Login
        • Logout
        • Password Reset

    b.  Non-Functional Requirements
        1. Frontend NFR
        • Performance
        • Accessibility
        • SEO

        2. Backend NFR
        • Scalability
        • High Availability
        • Fault Tolerance

3. Languages (Coming soon)
4. Data Structure & Algorithms (Coming soon)
5. Leetcode (Coming soon)
6. AI (Coming soon)
7. Design Patterns (Coming soon)`;

export function AppLayout({ children }: AppLayoutProps) {
  const [domains, setDomains] = useState<Domain[]>([]);

  useEffect(() => {
    // Parse hierarchy data on mount
    const parsed = parseHierarchy(HIERARCHY_DATA);
    setDomains(parsed);
  }, []);

  // Dynamically import Sidebar to avoid SSR issues
  const [Sidebar, setSidebar] = useState<React.ComponentType<{ domains: Domain[] }> | null>(null);

  useEffect(() => {
    import("@/features/sidebar/Sidebar").then((mod) => {
      setSidebar(() => mod.Sidebar);
    });
  }, []);

  return (
    <div className="app-shell flex flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {Sidebar && domains.length > 0 && <Sidebar domains={domains} />}
        <ContentArea>{children}</ContentArea>
      </div>
    </div>
  );
}
