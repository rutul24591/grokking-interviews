"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

const BASE_PATH = "/diagrams/system-design-concepts/backend/network-communication";

export const metadata: ArticleMetadata = {
  id: "article-backend-rpc",
  title: "Remote Procedure Calls (RPC)",
  description:
    "Comprehensive guide to RPC architecture covering stubs, serialization protocols, error semantics, transport selection, schema evolution, and production trade-offs between gRPC, REST, and async messaging for staff/principal engineers.",
  category: "backend",
  subcategory: "network-communication",
  slug: "rpc",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-07",
  tags: [
    "backend",
    "network",
    "rpc",
    "grpc",
    "serialization",
    "distributed-systems",
  ],
  relatedTopics: [
    "grpc",
    "timeout-strategies",
    "circuit-breaker-pattern",
    "api-gateway-pattern",
  ],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Remote Procedure Call (RPC) is a communication paradigm that allows a
          program executing on one machine to invoke a procedure or function on
          another machine as though it were a local call. The fundamental
          abstraction RPC provides is the illusion of locality: the calling code
          does not need to concern itself with network sockets, byte ordering,
          or message framing. Instead, it calls a function with typed parameters
          and receives a typed return value, while a runtime layer handles all
          the mechanics of crossing the network boundary. This abstraction was
          first formalized by Bruce Jay Nelson in 1984 at Xerox PARC, and it has
          since become one of the most influential patterns in distributed
          systems design.
        </p>
        <p>
          The critical insight that every staff-level engineer must internalize
          is that RPC deliberately obscures the network boundary, and that
          concealment is both its greatest strength and its most dangerous
          liability. When a local function call takes three nanoseconds and an
          RPC call takes three milliseconds, the difference is six orders of
          magnitude. When a local call never fails due to network partitions but
          an RPC call fails unpredictably due to transient network conditions,
          the caller must account for failure semantics that do not exist in
          local invocation. A mature RPC system does not hide these realities;
          it makes them explicit through typed error models, configurable
          timeout budgets, and observable failure boundaries.
        </p>
        <p>
          In modern microservice architectures, RPC manifests in several forms.
          gRPC has become the dominant RPC framework in production environments,
          using Protocol Buffers for interface definition and HTTP/2 as the
          transport layer. Thrift, developed at Facebook and open-sourced, offers
          a similar interface-definition language with support for multiple
          transport protocols. JSON-RPC provides a lightweight alternative using
          JSON over HTTP/1.1. REST over HTTP, while architecturally distinct
          (resource-oriented rather than procedure-oriented), is often used as
          the external-facing API layer while RPC frameworks handle internal
          service-to-service communication. The choice among these is not merely
          technical; it shapes organizational boundaries, deployment strategies,
          and operational complexity.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          At the heart of any RPC system lies the interface definition language
          (IDL), a formal specification that describes the procedures a service
          exposes, their typed parameters, and their return types. The IDL is
          not documentation; it is the single source of truth from which client
          and server stubs are automatically generated. This code generation step
          is what gives RPC its type safety guarantees. In gRPC, the IDL is a
          Protocol Buffer service definition that declares RPC methods with
          request and response message types. In Thrift, the IDL defines
          services, functions, exceptions, and data structures. The generated
          client stub marshals the function arguments into a wire format,
          transmits them over the network, and unmarshals the response. The
          generated server stub performs the inverse operation: it receives the
          wire-format message, unmarshals it, invokes the actual implementation,
          and marshals the result back.
        </p>
        <p>
          Serialization is the process of converting in-memory data structures
          into a byte sequence suitable for transmission and then reconstructing
          them at the destination. The choice of serialization format has
          profound implications for performance, compatibility, and operational
          overhead. Protocol Buffers (protobuf) use a compact binary format with
          field numbering rather than field names, producing payloads that are
          significantly smaller than JSON equivalents. Protobuf also supports
          backward and forward compatibility through field numbering: a client
          compiled against an older schema can communicate with a server running
          a newer schema, provided the schema evolution rules are followed.
          Apache Thrift offers multiple serialization protocols including binary,
          compact, and JSON formats. MessagePack provides a binary
          serialization of JSON-like data. Avro uses a schema-based approach
          where the schema is transmitted alongside the data, enabling dynamic
          schema resolution. The selection criteria should consider payload size,
          serialization/deserialization latency, language ecosystem support, and
          schema evolution guarantees.
        </p>
        <p>
          The transport layer determines how bytes move between client and
          server. gRPC mandates HTTP/2, which provides multiplexed streams over
          a single TCP connection, header compression via HPACK, and native
          support for server push and flow control. This choice eliminates the
          head-of-line blocking problem inherent in HTTP/1.1 and enables gRPC to
          support four communication patterns: unary (single request, single
          response), server streaming (single request, stream of responses),
          client streaming (stream of requests, single response), and bidi
          streaming (independent streams in both directions). Thrift is more
          flexible, supporting raw TCP sockets, HTTP, and even named pipes. The
          HTTP/2 requirement in gRPC is a double-edged sword: it simplifies the
          framework by mandating a single transport, but it also means that gRPC
          cannot operate in environments where HTTP/2 is unavailable or proxied
          through intermediaries that do not understand HTTP/2 semantics.
        </p>
        <p>
          Error handling in RPC is fundamentally different from local exception
          handling because the network introduces failure modes that do not exist
          in single-process execution. A local function either returns a result
          or throws an exception. An RPC call can fail in at least four
          categorically different ways: the request may never reach the server
          (network failure), the request may reach the server but the server may
          crash before responding (server failure), the response may be lost in
          transit (network failure on the return path), or the response may
          arrive after the client&apos;s timeout expires (latency failure).
          Critically, the client cannot distinguish between these cases without
          additional protocol support. This is the &quot;exactly once&quot;
          delivery problem, which is provably unsolvable in the presence of
          network failures. Production RPC systems address this by making error
          semantics explicit: they distinguish retryable errors (transient
          network issues, server overload) from non-retryable errors
          (authentication failure, invalid arguments, resource not found) and
          require the caller to implement idempotency for operations that may be
          retried.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The RPC call lifecycle involves multiple components working in concert
          to bridge the local-remote divide. The process begins at the client
          side, where application code invokes a method on the generated client
          stub. The stub accepts strongly-typed arguments and is responsible for
          serializing them into the wire format. Before transmission, the stub
          applies cross-cutting concerns: it attaches deadlines (timeouts),
          propagates tracing context through request metadata, applies
          authentication credentials, and may apply compression to the payload.
          The serialized message is then handed to the transport layer, which
          manages the connection pool, performs load balancing (either
          client-side or via an external proxy), and transmits the bytes over the
          network.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/rpc-call-steps.svg`}
          alt="RPC architecture showing client stub, network transport, and server stub interaction"
          caption="RPC architecture — client stub marshals the call, the transport carries it across the network, and the server stub unmarshals and dispatches to the implementation"
        />

        <p>
          On the server side, the transport layer receives the bytes and hands
          them to the server stub (sometimes called the skeleton). The stub
          deserializes the message, validates it against the schema, and invokes
          the actual service implementation. The implementation processes the
          request and returns a result, which the stub serializes and transmits
          back through the transport layer. The client stub receives the
          response, deserializes it, and returns the typed result to the calling
          application code. If an error occurs at any point, the stub maps the
          error to a typed status code (such as gRPC&apos;s canonical status
          codes: OK, CANCELLED, UNKNOWN, INVALID_ARGUMENT, DEADLINE_EXCEEDED,
          NOT_FOUND, ALREADY_EXISTS, PERMISSION_DENIED, UNAUTHENTICATED,
          RESOURCE_EXHAUSTED, FAILED_PRECONDITION, ABORTED, OUT_OF_RANGE,
          UNIMPLEMENTED, INTERNAL, UNAVAILABLE, DATA_LOSS) and returns it to the
          caller.
        </p>

        <p>
          The distinction between synchronous and asynchronous RPC is
          architectural rather than merely stylistic. In synchronous RPC, the
          calling thread blocks until the response arrives or the timeout
          expires. This model is simple to reason about but creates tight
          coupling between caller and callee: if the callee is slow or
          unavailable, the caller&apos;s thread pool can be exhausted, creating
          a cascading failure across the system. In asynchronous RPC, the caller
          initiates the request and continues executing other work. The response
          is delivered through a callback, a future/promise, or an event stream.
          This model decouples the caller&apos;s execution from the callee&apos;s
          latency, enabling better resource utilization and graceful degradation
          under load. However, it introduces complexity in error handling,
          debugging, and state management. At production scale, the most robust
          systems combine both patterns: synchronous RPC for low-latency,
          request-path calls where the response is needed immediately, and
          asynchronous messaging (via message queues or event streams) for
          operations that can tolerate eventual consistency.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/traditional-client-server.svg`}
          alt="Comparison diagram showing RPC and REST architectural patterns side by side"
          caption="RPC vs REST — RPC optimizes for operation-oriented, typed contracts while REST optimizes for resource-oriented, hypermedia-driven interfaces"
        />

        <p>
          When comparing RPC with REST, the distinction is not about which is
          universally superior but about which aligns with the communication
          pattern required. REST is resource-oriented: it models the system as a
          collection of resources identified by URIs, manipulated through a
          uniform interface (HTTP verbs: GET, POST, PUT, PATCH, DELETE). REST
          benefits from the maturity of HTTP infrastructure: load balancers,
          caches, CDNs, proxies, and browsers all understand HTTP semantics
          natively. REST responses are cacheable by default for safe methods, and
          the stateless nature of HTTP requests simplifies horizontal scaling.
          RPC, by contrast, is operation-oriented: it models the system as a set
          of procedures or functions, each with specific input and output types.
          RPC excels in internal service-to-service communication where the
          contract is well-defined, type safety matters, and HTTP caching
          semantics are less relevant than serialization efficiency and streaming
          capability.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/recommendation-service-sequence.svg`}
          alt="Serialization and deserialization flow in an RPC system showing protobuf, Thrift, and JSON comparisons"
          caption="Serialization flow — the choice of format determines payload size, parsing speed, and schema evolution flexibility"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          The decision to use RPC over REST, or to use gRPC over Thrift, or to
          use synchronous RPC over asynchronous messaging is not a technical
          preference but an architectural commitment that constrains everything
          from developer experience to operational overhead. Each option carries
          distinct trade-offs that become more pronounced at production scale.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">gRPC (HTTP/2 + Protobuf)</th>
              <th className="p-3 text-left">REST (HTTP/1.1 + JSON)</th>
              <th className="p-3 text-left">Async Messaging</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Contract Rigidity</strong>
              </td>
              <td className="p-3">
                Strict schema via .proto files. Generated code ensures type
                safety but requires recompilation for contract changes. Excellent
                for internal APIs with controlled evolution.
              </td>
              <td className="p-3">
                Loose contracts via OpenAPI/Swagger. JSON is self-describing and
                flexible. Easier for external APIs and rapid iteration.
              </td>
              <td className="p-3">
                Schema-on-read or event schemas. High flexibility but weaker
                compile-time guarantees. Ideal for event-driven architectures.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Performance</strong>
              </td>
              <td className="p-3">
                Protobuf payloads are 3-10x smaller than JSON. HTTP/2
                multiplexing eliminates connection overhead. p99 latencies
                typically 2-5x lower than REST.
              </td>
              <td className="p-3">
                JSON is verbose but human-readable. HTTP/1.1 has connection
                overhead but is universally understood. Higher bandwidth usage
                but simpler debugging.
              </td>
              <td className="p-3">
                No synchronous latency. Throughput-oriented. Message brokers add
                their own overhead but provide durability and decoupling.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Infrastructure Compatibility</strong>
              </td>
              <td className="p-3">
                Requires HTTP/2-aware infrastructure. Many proxies, load
                balancers, and API gateways need specific gRPC support. Browser
                support requires gRPC-Web proxy.
              </td>
              <td className="p-3">
                Universally supported by all infrastructure layers. Browsers,
                CDNs, caches, proxies all understand HTTP natively. No special
                infrastructure needed.
              </td>
              <td className="p-3">
                Requires message broker infrastructure (Kafka, RabbitMQ, SQS).
                Adds operational complexity but provides decoupling guarantees.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Failure Model</strong>
              </td>
              <td className="p-3">
                Synchronous by default. Timeouts and retries must be explicit.
                Circuit breakers needed to prevent cascade failures. Streaming
                modes mitigate some limitations.
              </td>
              <td className="p-3">
                Request-response semantics. HTTP status codes provide error
                semantics. Retries via idempotent methods. Caching absorbs some
                failure scenarios.
              </td>
              <td className="p-3">
                Inherently decoupled. Broker durability provides persistence.
                Consumer handles at-least-once or exactly-once semantics. Natural
                backpressure support.
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          The fundamental tension is between coupling and decoupling. RPC
          creates tight temporal coupling: the caller must be running when the
          callee processes the request. This coupling makes the system simpler to
          reason about (synchronous call stacks are easy to trace) but more
          fragile (a slow service can cascade failures to its callers). Async
          messaging decouples the caller from the callee in time: the caller
          publishes a message and does not wait for a response. This provides
          natural backpressure and fault isolation but makes it harder to reason
          about end-to-end latency and data flow. Production systems at scale
          typically use both: RPC for the request path where a response is needed
          synchronously, and async messaging for background processing, event
          propagation, and cross-domain communication.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Always enforce per-call deadlines (timeouts) with explicit budget
          allocation across the call chain. When a request traverses multiple
          services, each hop consumes a portion of the total deadline budget. The
          caller should propagate the remaining deadline to downstream calls so
          that each service knows how much time it has before the overall request
          will be cancelled by the original caller. gRPC supports deadline
          propagation natively through the grpc-timeout header. Services that
          receive a request with an already-expired deadline should fail fast
          rather than waste resources processing a request that the caller will
          never receive.
        </p>
        <p>
          Design all mutating operations (those that change state) to be
          idempotent or to carry explicit idempotency keys. Since the caller
          cannot distinguish between a lost response and a slow response, it may
          retry a request that the server already processed. Without idempotency,
          the retry creates a duplicate side effect. Idempotency can be achieved
          by including a unique request ID that the server uses to deduplicate
          processing, or by designing the operation itself to be idempotent (for
          example, using PUT semantics instead of POST, or using a database
          upsert instead of an insert).
        </p>
        <p>
          Use code-generated stubs exclusively and never hand-write RPC client
          code. The generated stubs encode the contract, enforce type safety, and
          ensure that contract changes are caught at compile time rather than at
          runtime. Store the IDL files in a version-controlled repository and
          treat contract changes as API changes: they require review, testing,
          and a migration plan. For large organizations, maintain a central
          contract repository where all service definitions are published, and
          run automated compatibility checks (such as buf breaking for protobuf)
          as part of the CI pipeline.
        </p>
        <p>
          Implement structured error handling that distinguishes between
          retryable and non-retryable failures. gRPC&apos;s canonical status
          codes provide a good taxonomy: UNAVAILABLE and RESOURCE_EXHAUSTED are
          typically retryable with exponential backoff, while INVALID_ARGUMENT,
          NOT_FOUND, and PERMISSION_DENIED are not. The retry policy should be
          configurable per method, and the retry budget (the fraction of total
          requests that are retries) should be monitored to detect amplification
          loops where retries create more load, which causes more failures, which
          triggers more retries.
        </p>
        <p>
          Prefer client-side load balancing for internal service-to-service
          communication, where the client receives a list of healthy instances
          from the service discovery layer and distributes requests across them.
          This eliminates the load balancer as a potential bottleneck and a
          single point of failure. For external-facing APIs, use a load balancer
          or API gateway that provides rate limiting, authentication, and
          observability.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is treating RPC calls as if they were local
          function calls. This manifests in several ways: not setting timeouts
          (allowing a slow service to exhaust the caller&apos;s thread pool), not
          handling partial failures (assuming that if the server receives the
          request, it will process it successfully), and not accounting for
          retry storms (retrying failed requests without backoff or budget,
          creating a feedback loop that amplifies the original failure). The fall
          ofacies of distributed computing apply directly to RPC: the network is
          not reliable, latency is not zero, bandwidth is not infinite, and the
          topology does not change.
        </p>
        <p>
          Schema evolution without compatibility guarantees creates silent data
          corruption. When a server adds a new required field to a message type,
          older clients that do not know about this field will send messages
          without it. Depending on the serialization format, the server may
          silently use a default value, reject the request, or interpret the
          bytes incorrectly. Protocol Buffers handle this gracefully by assigning
          default values to missing fields, but this can mask bugs where required
          data is absent. The solution is to enforce schema compatibility rules in
          CI: backward-compatible changes (adding optional fields, removing
          fields) are safe to deploy, while breaking changes (changing field
          types, reusing field numbers, changing field names in ways that affect
          JSON serialization) require a new API version and a migration plan.
        </p>
        <p>
          Exposing internal RPC services directly to external clients creates
          security and versioning liabilities. Internal services often lack
          proper authentication, rate limiting, and input validation because they
          assume a trusted internal network. When these services are exposed
          externally, they become attack surfaces. The standard pattern is to
          maintain an API gateway or BFF (Backend for Frontend) that translates
          external REST or GraphQL requests into internal RPC calls, providing a
          security boundary, rate limiting, and an abstraction layer that allows
          internal services to evolve independently of the external API.
        </p>
        <p>
          Synchronous fan-out, where a single request triggers parallel RPC calls
          to multiple downstream services, creates multiplicative latency and
          cascading failure risk. If service A calls services B, C, and D in
          parallel, and each has a p99 latency of 200ms, the p99 latency of the
          fan-out is 200ms (the maximum of the three). However, the failure
          probability compounds: if each downstream service has a 0.1% failure
          rate, the fan-out has approximately a 0.3% failure rate (roughly 3x
          higher). If any of those services in turn fan out to other services,
          the failure probability compounds exponentially. The mitigation is to
          set strict per-call timeouts, implement circuit breakers that fail fast
          when downstream services are unhealthy, and design fallback paths that
          return partial results rather than failing entirely.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Google uses gRPC extensively across its internal infrastructure, where
          it serves as the primary communication mechanism between microservices
          within a datacenter. Google&apos;s Stubby RPC system, the predecessor
          to gRPC, was designed to handle millions of RPCs per second with
          sub-millisecond latency. The lessons from Stubby directly informed
          gRPC&apos;s design: HTTP/2 transport for multiplexing, Protocol
          Buffers for efficient serialization, and explicit deadline propagation
          for latency budgeting. Google&apos;s production environment operates
          at a scale where even small inefficiencies in RPC handling compound
          into significant resource waste, which is why gRPC&apos;s performance
          characteristics are a primary reason for its adoption.
        </p>
        <p>
          Netflix uses a hybrid approach where internal service-to-service
          communication uses gRPC for low-latency, high-throughput scenarios
          (such as recommendation engine queries and content metadata lookups),
          while external-facing APIs use REST/GraphQL. Netflix open-sourced
          Ribbon, a client-side load balancer that integrates with their service
          discovery system Eureka, and this pattern is replicated across many
          organizations: gRPC for the hot path, REST for the public API, and
          async messaging (via Kafka) for event propagation and stream
          processing.
        </p>
        <p>
          Uber migrated from a REST-based internal API architecture to gRPC to
          reduce latency and improve type safety across their polyglot
          microservice environment. Their services are implemented in Go, Java,
          Python, and Node.js, and the protobuf IDL provides a language-neutral
          contract that eliminates the ambiguity that existed with JSON-based
          REST APIs. Uber also built a custom RPC framework on top of gRPC that
          adds their own concerns: tracing, rate limiting, and service-level
          objective (SLO) enforcement.
        </p>
        <p>
          In the financial services sector, RPC is used for real-time trading
          systems where the latency difference between JSON and protobuf is
          measurable in microseconds. Trading platforms use gRPC or custom binary
          RPC protocols for order routing, market data distribution, and
          position management. The strict typing of protobuf schemas also
          provides an audit trail: every message can be decoded and verified
          against the schema, which is critical for regulatory compliance.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">
              Q: What is the fundamental problem with treating RPC calls like
              local function calls, and how should an RPC framework address it?
            </p>
            <p className="mt-2 text-sm">
              A: The fundamental problem is that RPC calls cross an unreliable
              network boundary, introducing failure modes that local calls do not
              have. A local call either succeeds or throws an exception
              deterministically. An RPC call can fail in multiple indistinguishable
              ways: the request is lost, the server crashes, the response is lost,
              or the timeout expires. The caller cannot know whether the server
              executed the operation. An RPC framework addresses this by (1)
              requiring explicit per-call deadlines so no call can hang
              indefinitely, (2) providing typed error codes that distinguish
              retryable from non-retryable failures, (3) supporting idempotency
              keys for safe retries, (4) exposing observability hooks for tracing
              and metrics, and (5) supporting streaming modes so that partial
              results can be returned even when the full operation cannot complete.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">
              Q: How do you handle schema evolution in an RPC system without
              breaking existing clients?
            </p>
            <p className="mt-2 text-sm">
              A: Protocol Buffers and similar serialization formats support schema
              evolution through field numbering. When you add a new field, you
              assign it a new number that no existing field uses. Older clients
              that do not know about this field simply ignore it during
              deserialization. When you remove a field, you must never reuse its
              number; instead, you reserve the number to prevent accidental reuse.
              The critical rules are: never change the type of an existing field,
              never reuse a field number, never change the semantics of a field,
              and always provide sensible defaults for new fields. For breaking
              changes (such as changing a field type or removing a required
              field), you must create a new API version, deploy it alongside the
              old version, migrate clients gradually, and deprecate the old version
              after all clients have migrated. Tools like buf can enforce these
              rules automatically in CI.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">
              Q: Explain the retry storm problem and how to prevent it in an RPC
              system.
            </p>
            <p className="mt-2 text-sm">
              A: A retry storm occurs when a service experiences elevated latency
              or error rates, causing clients to retry their requests. The retries
              add more load to the already-struggling service, which increases
              latency further, which triggers more retries from more clients,
              creating a positive feedback loop that can take down an entire
              cluster. Prevention requires multiple layers: (1) exponential backoff
              with jitter on retries, so that retries are spread over time rather
              than concentrated at fixed intervals, (2) a retry budget that limits
              retries to a small fraction (typically 10-20%) of total requests, (3)
              circuit breakers that stop sending requests to a service once its
              error rate exceeds a threshold, (4) deadline propagation so that
              requests that have already exceeded their budget are not retried, and
              (5) idempotency guarantees so that retries do not create duplicate
              side effects.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">
              Q: When would you choose gRPC over REST for an API, and vice versa?
            </p>
            <p className="mt-2 text-sm">
              A: Choose gRPC for internal service-to-service communication where
              you control both the client and server, need high throughput and low
              latency, benefit from streaming (especially server streaming for
              real-time data), and can commit to HTTP/2 infrastructure. Choose REST
              for external/public APIs where you need broad client compatibility
              (browsers, third-party integrations), benefit from HTTP caching, need
              simple debugging with human-readable payloads, or operate in
              environments where HTTP/2 is not available. In practice, most large
              systems use both: REST for the public API surface and gRPC for the
              internal service mesh.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">
              Q: How does deadline propagation work in a multi-hop RPC call chain,
              and why is it important?
            </p>
            <p className="mt-2 text-sm">
              A: Deadline propagation means that when service A calls service B
              with a 500ms deadline, service B knows it has at most 500ms to
              respond. If service B then needs to call service C, it should
              propagate a reduced deadline (perhaps 300ms, accounting for its own
              processing time) rather than using its own independent timeout. This
              is implemented via the grpc-timeout header in gRPC, which carries the
              deadline across the wire. It is important because without it, each
              service in the chain uses its own timeout, and the total latency can
              far exceed the original caller&apos;s expectation. Worse, service B
              might continue processing a request after service A has already
              timed out and given up, wasting resources on a response nobody will
              receive. Deadline propagation also enables graceful degradation: if a
              service receives a request with an already-expired deadline, it can
              fail immediately rather than waste resources.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">
              Q: What are the four RPC communication patterns, and when would you
              use each?
            </p>
            <p className="mt-2 text-sm">
              A: The four patterns are: (1) Unary RPC — single request, single
              response. Used for simple request-response operations like fetching a
              user by ID. This is the most common pattern and maps directly to
              traditional function calls. (2) Server streaming RPC — single request,
              stream of responses. Used when the server needs to push multiple
              results to the client, such as streaming search results, real-time
              metrics, or changelog events. (3) Client streaming RPC — stream of
              requests, single response. Used when the client needs to send a large
              amount of data that the server aggregates, such as uploading
              telemetry data or batched sensor readings. (4) Bidirectional
              streaming RPC — independent streams in both directions. Used for
              real-time interactive protocols like chat, collaborative editing, or
              live game state synchronization. Each pattern maps to different
              operational requirements and should be chosen based on the data flow
              characteristics of the use case.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://grpc.io/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              gRPC Official Documentation — High-Performance RPC Framework
            </a>
          </li>
          <li>
            <a
              href="https://protobuf.dev/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Protocol Buffers — Language-neutral, Platform-neutral Extensible
              Mechanism for Structured Data
            </a>
          </li>
          <li>
            <a
              href="https://research.google/pubs/stubby-a-large-scale-low-latency-rpc-system/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Stubby — Large-Scale Low-Latency RPC System (Research
              Paper)
            </a>
          </li>
          <li>
            <a
              href="https://thrift.apache.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apache Thrift — Scalable Cross-Language RPC Framework
            </a>
          </li>
          <li>
            <a
              href="https://buf.build/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buf — Protobuf Schema Management and Compatibility Checking
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
