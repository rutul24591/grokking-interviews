"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

const BASE_PATH = "/diagrams/system-design-concepts/backend/network-communication";

export const metadata: ArticleMetadata = {
  id: "article-backend-service-discovery",
  title: "Service Discovery",
  description:
    "Comprehensive guide to service discovery covering client-side versus server-side resolution, Consul/etcd/ZooKeeper architectures, health checking strategies, DNS-based discovery, and production scaling patterns for distributed systems.",
  category: "backend",
  subcategory: "network-communication",
  slug: "service-discovery",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-07",
  tags: [
    "backend",
    "network",
    "service-discovery",
    "consul",
    "etcd",
    "distributed-systems",
  ],
  relatedTopics: [
    "load-balancers",
    "service-mesh",
    "api-gateway-pattern",
    "consensus-algorithms",
  ],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Service discovery is the mechanism by which services in a distributed
          system locate each other dynamically at runtime, without relying on
          hardcoded endpoints or static configuration files. In a monolithic
          architecture, component-to-component communication happens through
          in-process function calls, and the location of each component is
          resolved at compile time. In a microservice architecture, services are
          independently deployed, scaled, and versioned. Each service may have
          multiple instances running across different hosts, availability zones,
          or regions. Instances come and go due to autoscaling, rolling
          deployments, hardware failures, and operational interventions. Service
          discovery maintains a real-time registry of which service instances
          are running, where they are located (IP address and port), and whether
          they are healthy enough to receive traffic.
        </p>
        <p>
          The problem that service discovery solves is the dynamic addressing
          problem in distributed systems. Without service discovery, service A
          would need to know the IP addresses and ports of all instances of
          service B, and this information would need to be updated every time
          service B scales up or down, deploys a new version, or loses an
          instance to a failure. In a system with hundreds of services, each
          with multiple instances, this creates a configuration management
          nightmare that is error-prone, slow to update, and fragile under
          change. Service discovery automates this by maintaining a centralized
          registry that services update automatically as their topology changes.
        </p>
        <p>
          Service discovery is not a standalone concern; it is tightly coupled
          with load balancing, health checking, and routing. The registry tells
          you where the instances are; the health checker tells you which ones
          are fit to serve traffic; the load balancer distributes requests
          across the healthy instances; and the router determines which path a
          request should take through the service graph. In modern
          architectures, these concerns are often bundled together in a service
          mesh (Istio, Linkerd) or a platform-level system (Kubernetes with
          CoreDNS), but understanding the underlying mechanisms of service
          discovery is essential for designing reliable distributed systems and
          for debugging them when they fail.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          The service registry is the central data store that maps service names
          to their running instances. Each instance registers itself with the
          registry when it starts, providing its service name, IP address, port,
          and optional metadata (version, availability zone, tags). When an
          instance shuts down, it deregisters itself. The registry is queried by
          clients (or by load balancers) to obtain the current list of healthy
          instances for a given service name. The registry must be highly
          available and consistent enough to prevent routing traffic to dead
          instances, while being fast enough that lookups do not add significant
          latency to the request path.
        </p>
        <p>
          Health checking is the mechanism by which the registry determines
          whether a registered instance is actually capable of serving traffic.
          Without health checking, the registry would only know which instances
          have registered, not which ones are actually functioning. There are
          two primary health check models: active and passive. Active health
          checks involve the registry (or a dedicated health checker)
          periodically probing each instance with a request (typically an HTTP
          GET to a /health endpoint, a TCP connection attempt, or a script
          execution) and marking the instance as unhealthy if the check fails
          consecutively for a configured number of times. Passive health checks
          observe actual traffic: if an instance fails to respond to real
          requests (returning errors or timing out), the observer marks it as
          unhealthy. Active checks are more proactive but add load proportional
          to the number of instances; passive checks are zero-overhead but can
          only detect failures after they have already affected traffic.
        </p>
        <p>
          The distinction between client-side and server-side service discovery
          is architectural and determines where the resolution logic lives. In
          client-side discovery, the calling service queries the registry
          directly to obtain the list of healthy instances for the target
          service, then applies a load-balancing algorithm (round-robin,
          least-connections, random with weighted selection) to choose an
          instance and sends the request directly to it. The client is
          responsible for handling the case where the chosen instance fails
          mid-request and retrying with another instance. In server-side
          discovery, the calling service sends the request to a load balancer or
          proxy, which queries the registry and routes the request to a healthy
          instance. The calling service does not know or care about the
          topology of the target service. Client-side discovery eliminates the
          load balancer as a potential bottleneck and single point of failure,
          but it requires every service to implement discovery logic. Server-side
          discovery centralizes the logic in the load balancer, making services
          simpler but introducing a dependency on the load balancer&apos;s
          availability and performance.
        </p>
        <p>
          The liveness versus readiness distinction is critical for correct
          health checking. A liveness check determines whether the process is
          running (is the process alive?). A readiness check determines whether
          the instance is ready to accept traffic (has it finished startup, does
          it have sufficient resources, are its dependencies available?). An
          instance may be live but not ready: for example, it is still warming
          up its caches, waiting for a database migration to complete, or
          temporarily overloaded and unable to accept new connections. Service
          discovery systems that only support liveness checks will route traffic
          to instances that are running but not yet ready, causing cascading
          failures during deployments. The registry should support both check
          types and only include instances in the healthy pool when both liveness
          and readiness checks pass.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The service discovery architecture consists of four components: the
          registration agent (running on each service instance, responsible for
          registering and deregistering with the registry), the registry itself
          (the data store that maps service names to instance addresses and
          health status), the resolver (the component that queries the registry
          to obtain the current instance list — this can be the client itself, a
          sidecar proxy, or a load balancer), and the health checker (the
          component that probes instances and updates their health status in the
          registry).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/consul-service-discovery-registration.svg`}
          alt="Service discovery architecture showing registration, registry, health checking, and client resolution flow"
          caption="Service discovery flow — instances register with the catalog, health checks maintain status, and clients resolve service names to healthy instance lists"
        />

        <p>
          The registration process follows one of two patterns: self-registration
          or third-party registration. In self-registration, the service instance
          registers itself with the registry upon startup, typically through a
          library or SDK that communicates with the registry API. This is simple
          and direct, but it couples the service to the registry implementation
          and means that if the service crashes before deregistering, the
          registry will retain a stale entry until the health checker detects the
          failure. In third-party registration, a separate process (an agent, a
          sidecar, or an orchestrator like Kubernetes) handles registration and
          deregistration on behalf of the service. The service is unaware of the
          registry. This decouples the service from the discovery mechanism and
          enables cleaner lifecycle management: when the orchestrator kills a
          container, it also deregisters the service. The downside is that it
          introduces an additional component that must be deployed and managed.
        </p>

        <p>
          The choice of registry technology is driven by the consistency and
          availability requirements of the system. Consul, developed by HashiCorp,
          uses a gossip protocol (Serf) for inter-node communication and a
          consensus algorithm (Raft) for its key-value store that holds service
          registrations. Consul supports both HTTP and DNS interfaces for service
          lookups, making it compatible with legacy systems that expect DNS-based
          resolution. etcd, developed by CoreOS and now a CNCF project, uses the
          Raft consensus algorithm and provides a strongly consistent key-value
          store with a watch mechanism that notifies clients of changes. etcd is
          the backing store for Kubernetes and is optimized for consistency over
          availability. ZooKeeper, the oldest of the three (developed at Yahoo),
          uses a variant of the Paxos consensus algorithm (ZooKeeper Atomic
          Broadcast) and provides a hierarchical namespace with sequential and
          ephemeral nodes. Ephemeral nodes are automatically deleted when the
          client session expires, making them ideal for service registration.
          Eureka, developed by Netflix, takes a different approach: it is an
          AP system in the CAP theorem sense, prioritizing availability over
          consistency. Eureka allows stale reads and does not guarantee that all
          nodes see the same registry state simultaneously, but it remains
          operational even during network partitions.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/consul-service-discovery-query.svg`}
          alt="Comparison of client-side and server-side service discovery patterns with their respective data flows"
          caption="Client-side versus server-side discovery — client-side queries the registry directly while server-side delegates to a load balancer or proxy"
        />

        <p>
          DNS-based service discovery is an alternative that leverages the
          existing DNS infrastructure rather than a dedicated registry. In this
          model, each service is assigned a DNS name (such as
          orderservice.production.internal), and the DNS server returns the IP
          addresses of the healthy instances for that name. The DNS records are
          updated dynamically by the orchestration platform (Kubernetes
          automatically creates DNS entries for services) or by a DNS server
          that integrates with the service registry (Consul can serve DNS
          records based on its catalog). DNS-based discovery has the advantage
          of universal compatibility: every programming language and framework
          knows how to resolve a DNS name. It has two significant disadvantages:
          DNS caching and TTL. DNS resolvers at every level (OS resolver, local
          DNS server, recursive resolver) cache records for the duration of the
          TTL. If an instance is removed but its DNS record is still cached,
          clients will continue to route traffic to the dead instance until the
          TTL expires. The minimum practical TTL is around 30 seconds (some
          resolvers ignore lower values), which means DNS-based discovery has a
          minimum detection window of 30 seconds for topology changes. For
          systems that require faster convergence (sub-5 seconds), DNS-based
          discovery is insufficient and a direct registry API must be used.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/consul-service-discovery-catalog.svg`}
          alt="Health checking strategies showing active HTTP/TCP checks, passive observation, and liveness versus readiness differentiation"
          caption="Health checking — active probes detect failures before they affect traffic while passive observation has zero overhead but detects failures only after impact"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          The selection of a service discovery technology and pattern is driven
          by the CAP theorem trade-offs, the operational complexity your team
          can sustain, and the convergence speed your system requires. There is
          no universally correct answer; each option optimizes for different
          failure modes.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">System</th>
              <th className="p-3 text-left">Consistency Model</th>
              <th className="p-3 text-left">Strengths</th>
              <th className="p-3 text-left">Weaknesses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Consul</strong>
              </td>
              <td className="p-3">
                CP (Raft consensus for KV, AP for gossip health checks)
              </td>
              <td className="p-3">
                Multi-datacenter support, DNS and HTTP interfaces, built-in health
                checking, service segmentation via tags, integrated with
                HashiCorp ecosystem.
              </td>
              <td className="p-3">
                Operational complexity (managing Raft cluster, gossip rings),
                convergence time depends on gossip interval, can split-brain if
                Raft quorum is lost.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>etcd</strong>
              </td>
              <td className="p-3">CP (Raft consensus)</td>
              <td className="p-3">
                Strongly consistent, watch mechanism for real-time change
                notifications, minimal API surface, proven at scale (Kubernetes
                backing store).
              </td>
              <td className="p-3">
                No built-in health checking (must be implemented externally),
                write throughput limited by Raft consensus, no native DNS
                interface.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>ZooKeeper</strong>
              </td>
              <td className="p-3">CP (ZAB consensus)</td>
              <td className="p-3">
                Ephemeral nodes for automatic deregistration, hierarchical
                namespace, sequential nodes for leader election, battle-tested
                at scale.
              </td>
              <td className="p-3">
                Complex operational model, Java dependency, performance degrades
                under heavy write load, aging API design.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Eureka</strong>
              </td>
              <td className="p-3">AP (eventual consistency)</td>
              <td className="p-3">
                Available during network partitions, simple to operate,
                peer-to-peer replication, good Netflix ecosystem integration.
              </td>
              <td className="p-3">
                Stale reads possible during partitions, no strong consistency
                guarantees, Netflix no longer actively develops new features.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Kubernetes DNS</strong>
              </td>
              <td className="p-3">
                Eventually consistent (DNS TTL-based)
              </td>
              <td className="p-3">
                Zero configuration (built into Kubernetes), universal
                compatibility, automatic service endpoint updates, no additional
                infrastructure needed.
              </td>
              <td className="p-3">
                DNS caching delays convergence (minimum 30-second TTL), no
                health-check integration beyond Kubernetes readiness probes,
                limited metadata support.
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          The client-side versus server-side discovery decision is similarly
          contextual. Client-side discovery is preferred in environments where
          the client is intelligent enough to implement load balancing and
          failover (such as Java services using Ribbon or Go services using
          custom balancers), where eliminating the load balancer reduces latency
          and removes a single point of failure, and where the service mesh
          pattern (sidecar proxies) makes the client-side logic transparent to
          the application code. Server-side discovery is preferred when the
          client is a browser or mobile app (which cannot implement client-side
          discovery), when the organization wants to centralize routing logic
          for easier management, and when the load balancer already provides
          additional capabilities (SSL termination, rate limiting, WAF) that
          would otherwise need to be implemented in each service.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Always deploy the service registry as a clustered, fault-tolerant
          system with an odd number of nodes (3 or 5 for Raft-based systems) to
          maintain quorum during node failures. The registry is a critical
          dependency: if it becomes unavailable, services cannot discover each
          other, and the system degrades. For Raft-based registries (Consul,
          etcd), understand that losing quorum (more than half of the nodes
          fail) makes the registry read-only or entirely unavailable, depending
          on the implementation. Plan your deployment topology so that a single
          failure domain (rack, availability zone) cannot take out a majority of
          the registry nodes.
        </p>
        <p>
          Implement both active and passive health checking with appropriate
          intervals and thresholds. Active health checks should run at intervals
          of 10-30 seconds, with a failure threshold of 2-3 consecutive failures
          before marking an instance as unhealthy. Passive health checks should
          monitor error rates and latency percentiles, marking instances as
          unhealthy when the error rate exceeds a threshold (such as 5% of
          requests returning 5xx errors over a 30-second window). The
          combination provides the proactive detection of active checks with the
          real-world validation of passive checks. Ensure that the health check
          endpoint is lightweight (returns a simple 200 OK with minimal
          processing) and that it validates the instance&apos;s critical
          dependencies (database connectivity, cache availability, downstream
          service reachability).
        </p>
        <p>
          Use client-side caching of registry lookups with aggressive TTLs to
          reduce load on the registry and improve lookup latency. The client
          should cache the instance list for a short duration (5-10 seconds) and
          use the cached result for subsequent requests to the same service. This
          prevents every request from hitting the registry, which could become a
          bottleneck under high request rates. However, the cache TTL must be
          short enough that the client does not continue routing traffic to
          instances that have been removed. The watch mechanism (available in
          etcd and Consul) allows the client to receive real-time notifications
          when the registry changes, enabling the client to invalidate its cache
          immediately rather than waiting for the TTL to expire.
        </p>
        <p>
          Design for graceful degradation when the registry is unavailable. The
          client should continue using its cached instance list when the registry
          cannot be reached, rather than failing all requests. The cached list
          may contain stale entries, but it is better to attempt to reach a
          potentially dead instance (and fail fast with a connection error) than
          to fail immediately without trying. Implement a circuit breaker around
          the registry lookup so that repeated failures trigger a fallback to
          cached data and an alert to the operations team.
        </p>
        <p>
          Segment your service registry by environment (production, staging,
          development) and by datacenter or region. Cross-environment pollution
          (a staging service registering in the production registry) is a common
          cause of production incidents. Use namespace isolation (Consul
          supports namespaces and partitions, etcd supports key prefixes) to
          enforce separation. For multi-region deployments, use a registry that
          supports federation or multi-datacenter replication (Consul supports
          WAN gossip and cross-datacenter replication, etcd requires a custom
          replication layer). Understand that cross-region service discovery
          introduces latency in both the replication of registry state and the
          routing of requests, and design accordingly.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Stale registry entries are the most common failure mode in service
          discovery systems. When an instance crashes without deregistering (a
          hard crash, a killed process, a terminated VM), the registry retains
          its entry until the health checker detects the failure. During this
          window (typically 30-90 seconds, depending on the health check
          interval and failure threshold), clients will route traffic to the
          dead instance and experience connection errors. The mitigation is to
          use third-party registration through an orchestrator (Kubernetes,
          Nomad) that can deregister the instance immediately when it detects
          the container or VM has terminated, and to use short health check
          intervals with low failure thresholds to minimize the detection window.
        </p>
        <p>
          The thundering herd problem occurs when a large number of clients
          simultaneously query the registry for the same service, either because
          they all started at the same time (such as after a cluster restart) or
          because their cache TTLs expired simultaneously. This creates a sudden
          spike in registry load that can overwhelm the registry and cause it to
          become unresponsive. The solution is to jitter the cache TTLs so that
          clients expire their caches at different times, and to use the watch
          mechanism to push registry changes to clients rather than having clients
          poll for updates.
        </p>
        <p>
          Over-reliance on DNS-based discovery without understanding its
          limitations is a pitfall that catches many teams. DNS caching means
          that topology changes (new instances added, old instances removed) are
          not visible to clients until the TTL expires and the cache is
          refreshed. During a rolling deployment, this means that clients will
          continue to send traffic to old instances (which may be in the process
          of shutting down) for the duration of the TTL. The result is increased
          error rates during deployments. Teams that are unaware of this
          mechanism often blame the deployment process when the root cause is
          DNS caching. The fix is to either use a direct registry API (bypassing
          DNS) or to implement a connection drain period that is longer than the
          DNS TTL, ensuring that old instances continue to serve traffic until
          all clients have refreshed their DNS caches.
        </p>
        <p>
          Running a single registry instance without redundancy is an
          operational anti-pattern that is surprisingly common in early-stage
          deployments. A single registry instance is a single point of failure:
          if it crashes, no new service registrations can occur, and clients
          cannot resolve service names to instances. Even with client-side
          caching, the cache will eventually expire, and the system will
          degrade. Always deploy the registry as a clustered system with
          automatic failover, and test the failover regularly through chaos
          engineering exercises.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Netflix uses Eureka as its service discovery system within its AWS
          infrastructure. Eureka&apos;s AP design (prioritizing availability over
          consistency) aligns with Netflix&apos;s operational philosophy: it is
          better for clients to have slightly stale registry data than to have no
          data at all during a network partition. Eureka is deployed in each AWS
          region with peer-to-peer replication, and Netflix&apos;s Ribbon
          client-side load balancer queries Eureka to obtain the list of
          available instances. Netflix also uses a layered approach where Eureka
          provides instance discovery and a separate system (Zuul) provides
          edge routing and load balancing for external traffic.
        </p>
        <p>
          Airbnb uses Consul for service discovery across its microservice
          ecosystem, leveraging Consul&apos;s health checking, DNS interface, and
          key-value store. Airbnb&apos;s infrastructure team built a custom
          integration where services register with Consul through a sidecar agent
          (third-party registration), and clients resolve service names through
          Consul&apos;s DNS interface or its HTTP API. The DNS interface allows
          legacy services that cannot use the Consul SDK to participate in the
          discovery system, providing a migration path for gradual adoption.
        </p>
        <p>
          Kubernetes provides service discovery as a first-class primitive. When
          a Service resource is created in Kubernetes, the control plane assigns
          it a stable DNS name (servicename.namespace.svc.cluster.local) and
          automatically updates the DNS records as pods are added or removed.
          Kubernetes also provides environment variable injection, where the IP
          and port of each service are exposed as environment variables in every
          pod. The combination of DNS-based discovery (for services that resolve
          names at request time) and environment variables (for services that
          need static configuration at startup) covers the majority of service
          discovery use cases within a Kubernetes cluster.
        </p>
        <p>
          Spotify uses a custom service discovery system built on top of etcd,
          leveraging etcd&apos;s watch mechanism for real-time topology updates
          and its strong consistency guarantees for correct service resolution.
          Spotify&apos;s system also integrates with their deployment pipeline
          to automatically register and deregister services during rolling
          deployments, and their health checking is integrated with their
          monitoring system (Prometheus) to provide a unified view of service
          health.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">
              Q: Explain the difference between client-side and server-side
              service discovery, and when you would choose each.
            </p>
            <p className="mt-2 text-sm">
              A: In client-side discovery, the client queries the service registry
              to get the list of healthy instances and then applies a load-balancing
              algorithm to select one. The client sends the request directly to
              the chosen instance. This eliminates the load balancer as a
              bottleneck and a single point of failure, but requires every client
              to implement discovery logic. In server-side discovery, the client
              sends the request to a load balancer, which queries the registry and
              routes the request. The client is unaware of the topology. This
              simplifies the client but introduces a dependency on the load
              balancer. Choose client-side when you control the clients, need
              maximum performance, and can implement the logic (or use a sidecar
              proxy). Choose server-side when clients are browsers/mobile apps,
              when you want centralized routing control, or when the load balancer
              provides additional capabilities (SSL termination, rate limiting,
              WAF).
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">
              Q: How do you handle the stale registry problem when instances
              crash without deregistering?
            </p>
            <p className="mt-2 text-sm">
              A: There are multiple strategies, and production systems typically
              use several in combination. First, use third-party registration
              through an orchestrator (Kubernetes, Nomad) that deregisters the
              instance when it detects the container or VM has terminated, rather
              than relying on the instance to deregister itself. Second, use active
              health checks with short intervals (10 seconds) and low failure
              thresholds (2-3 consecutive failures) to detect dead instances
              quickly. Third, use session-based registration (ZooKeeper ephemeral
              nodes, etcd leases with TTL) where the registry automatically
              removes the registration when the client session expires or the lease
              is not renewed. Fourth, implement a connection timeout on the client
              side so that attempts to reach dead instances fail fast rather than
              hanging.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">
              Q: Why is DNS-based service discovery insufficient for systems
              that require fast convergence, and what is the alternative?
            </p>
            <p className="mt-2 text-sm">
              A: DNS resolvers at every level cache records for the duration of
              the TTL, and the minimum practical TTL is around 30 seconds (many
              resolvers ignore lower values or enforce their own minimums). This
              means that when an instance is added or removed, clients will not
              see the change for at least 30 seconds. For systems that require
              sub-5-second convergence (such as high-availability financial
              trading systems or real-time gaming backends), this delay is
              unacceptable. The alternative is to use a direct registry API (such
              as Consul&apos;s HTTP API, etcd&apos;s watch mechanism, or
              Kubernetes&apos; endpoint API) that provides real-time or near-real-time
              notifications of topology changes. The client subscribes to changes
              via a watch/long-poll mechanism and updates its local instance list
              immediately when the registry changes.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">
              Q: Compare the CAP theorem trade-offs between Consul, etcd, and
              Eureka for service discovery.
            </p>
            <p className="mt-2 text-sm">
              A: Consul and etcd are both CP systems: they prioritize consistency
              over availability. They use Raft consensus to ensure that all nodes
              agree on the registry state. During a network partition that splits
              the cluster, the minority partition becomes unavailable (it cannot
              accept writes or, in some cases, reads), but the majority partition
              continues to operate with consistent data. This is correct for
              service discovery because routing traffic based on stale data is
              worse than temporarily being unable to resolve new services. Eureka
              is an AP system: it prioritizes availability over consistency.
              During a network partition, all nodes continue to serve requests,
              but they may return stale data (instances that have been removed or
              are no longer healthy). This is acceptable if your client-side
              load balancer implements circuit breakers and retry logic, because
              attempting to reach a stale instance and failing is better than
              failing immediately. The choice depends on your failure tolerance:
              CP for correctness-critical systems, AP for availability-critical
              systems with compensating client-side logic.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">
              Q: How do you prevent the thundering herd problem in service
              discovery?
            </p>
            <p className="mt-2 text-sm">
              A: The thundering herd occurs when many clients simultaneously query
              the registry, typically after a cache expiration or a cluster
              restart. Prevention strategies include: (1) Jitter the cache TTL on
              each client so that caches expire at different times rather than all
              at once. Add a random offset (plus or minus 20%) to the base TTL.
              (2) Use the watch mechanism (available in etcd, Consul, and
              ZooKeeper) to push registry changes to clients rather than having
              clients poll. This eliminates the need for periodic queries
              entirely. (3) Implement client-side load shedding on the registry
              so that if the registry is under heavy load, it returns cached or
              approximate results rather than blocking or failing. (4) Deploy the
              registry with sufficient capacity to handle the expected query load,
              and monitor query rates to detect herd behavior early.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.consul.io/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Consul — Service Networking Across Any Runtime Platform
            </a>
          </li>
          <li>
            <a
              href="https://etcd.io/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              etcd — Distributed Reliable Key-Value Store for Critical Data
            </a>
          </li>
          <li>
            <a
              href="https://zookeeper.apache.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apache ZooKeeper — Distributed Coordination Service
            </a>
          </li>
          <li>
            <a
              href="https://kubernetes.io/docs/concepts/services-networking/service/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kubernetes — Services and Service Discovery
            </a>
          </li>
          <li>
            <a
              href="https://netflixtechblog.com/ribbon-a-client-side-load-balancer-238177e40653"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Netflix Tech Blog — Ribbon: Client-Side Load Balancer
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
