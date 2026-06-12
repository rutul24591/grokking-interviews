"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-api-playground",
  title: "Design an API Playground (like Postman)",
  description:
    "Principal-level architecture for a browser API playground covering request execution, local-first collections, environment secrets, CORS proxying, response inspection, team sync, governance, and secure extensibility.",
  category: "high-level-design",
  subcategory: "developer-experience-systems",
  slug: "api-playground",
  wordCount: 5600,
  readingTime: 32,
  lastUpdated: "2026-05-22",
  tags: ["hld", "api-playground", "postman", "cors-proxy", "developer-tools"],
  relatedTopics: ["cicd-dashboard", "developer-documentation-system"],
};

export default function ApiPlaygroundArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design an API Playground (like Postman) around system boundary, state ownership, failure handling, scalability, security, and observable recovery. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock>
        <HighlightBlock as="p" tier="important">
          An API playground is an interactive developer tool for composing HTTP requests, resolving environments, applying authentication presets, executing calls, and inspecting responses. Postman, Insomnia, Hoppscotch, Stripe API docs, and internal platform consoles all use this pattern. In a staff or principal interview, the expected answer is not just a request form. The design must explain local-first state, secure handling of credentials, browser CORS limits, server-side proxy risk, collaboration, large response rendering, auditability, and how the tool remains reliable when developers are debugging production incidents.
        </HighlightBlock>
        <p>
          The product sits at the boundary between a browser application and arbitrary customer infrastructure. That boundary makes it unusually sensitive. A normal web app talks to known backends; an API playground may be asked to call any host, with arbitrary headers and sensitive tokens. The browser protects users through CORS, but the product often bypasses that protection with a proxy. The interview signal is whether the candidate treats the proxy as a controlled execution surface, not as a convenient tunnel.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: the design must preserve correctness under latency, concurrency, partial failure, and changing permissions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design an API Playground (like Postman), the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>
        <p>
          The request model should be explicit: method, URL, query parameters, enabled headers, body mode, authentication preset, timeout, redirect behavior, TLS options when supported by the runtime, and active environment. Environments hold named variables such as base URLs and tokens. Secret variables must be masked, excluded from public sharing, excluded from telemetry, and protected from accidental export. The UI should show unresolved variables before execution because sending a request with a literal placeholder is one of the most common developer mistakes.
        </p>
        <p>
          Collections are durable developer knowledge, not just saved requests. A collection contains folders, request definitions, examples, descriptions, generated snippets, and sometimes tests. For team workspaces, the system needs permissions, history, conflict handling, and provenance for edits. Local history is different from shared collections: request history may contain private URLs, tokens in headers, or production payloads, so it should stay local by default and be capped with a clear retention policy.
        </p>
        <p>
          Response inspection has several performance and security concerns. JSON and XML responses need formatting and collapsible navigation, but large responses should be streamed or truncated. HTML responses should be shown as source, not rendered, to avoid executing untrusted content in the tool. Binary responses need metadata, preview limits, and download affordances. Timing should distinguish client-to-proxy latency from proxy-to-target latency so developers can tell whether slowness is in the target service or the playground infrastructure.
        </p>
        <p>
          At principal level, the important distinction is between a developer convenience feature and a controlled execution platform. Once the playground supports arbitrary outbound calls, OAuth token flows, team workspaces, shared examples, and generated snippets, it becomes part of the company&apos;s security boundary. The design needs tenant-aware rate limits, allowlists for enterprise customers, secret redaction at every telemetry boundary, workspace-level audit trails, and explicit data retention rules for history, responses, and exported collections. Interviewers usually push on whether the candidate recognizes that the UI, proxy, sync service, and snippet generator can each leak credentials in different ways.
        </p>
        <p>
          The product also needs clear consistency semantics. Request drafts can be local and eventually synced. Shared collections need revision checks because a teammate changing an authorization header while another teammate changes the body can silently break an incident runbook. Environment values are per-user or per-environment secrets and should not follow the same sync path as collection metadata. Request history should be treated as private operational data with an opt-in export path, not as collaborative content.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: state model, API contracts, cache policy, async workflow, authorization, rollout, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        <p>
          A robust architecture uses a local-first client, a workspace sync service, and a hardened request proxy. The client stores draft requests, environments, and private history in IndexedDB. Shared collections are synced to the backend with workspace permissions and revision metadata. When the user sends a request, the client resolves variables, validates the target, applies auth, and then chooses direct browser execution or proxy execution. Direct execution is lower latency and avoids credential exposure to the proxy, but it only works when the target API allows the browser origin.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/developer-experience-systems/api-playground.svg"
          alt="API playground high level architecture"
          caption="Local-first request workspace with environment resolution, response inspection, collection sync, code generation, and a controlled CORS proxy."
        />
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/developer-experience-systems/api-playground-proxy-security.svg"
          alt="API playground proxy security controls"
          caption="The proxy path needs URL validation, DNS resolution, private network blocking, timeout limits, response caps, no sensitive logging, rate limits, and audit events."
        />
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/developer-experience-systems/api-playground-team-sync.svg"
          alt="API playground team synchronization flow"
          caption="Shared collections use revisioned operations, workspace authorization, conflict review, and selective sync so private secrets and local history do not leak."
        />
        <p>
          The request proxy should never trust client-provided validation. It must parse and normalize the URL server-side, resolve the hostname, reject private and link-local ranges, prevent DNS rebinding by binding validation to the resolved address, enforce redirect policy, cap request and response sizes, and redact sensitive headers from logs. A principal-level design also separates proxy workers from the main API tier so a slow or abusive target cannot exhaust the control plane.
        </p>
        <p>
          A strong architecture has separate hot paths for draft editing, shared collection reads, request execution, and long response handling. Draft editing should never wait on the backend. Collection sync should tolerate temporary disconnects and then reconcile. Request execution should pass through an execution policy service before reaching proxy workers. Large response bodies should avoid the normal API tier and be streamed through bounded buffers or temporary object storage with short-lived access. This prevents one expensive response or a malicious endpoint from consuming memory in the user-facing API process.
        </p>
        <p>
          Enterprise deployments often add a policy-control path that is invisible in small demos. Administrators may require all outbound calls to use a customer-hosted agent, block calls to production except from approved workspaces, enforce mTLS profiles, prevent saving response bodies, or inject approved headers for internal APIs. The playground should evaluate those policies before execution and show a clear reason when a request is denied. Otherwise developers interpret policy failures as network failures and waste time debugging the wrong layer.
        </p>
        <p>
          A principal-ready design also separates control-plane availability from execution-plane availability. Developers should still be able to open collections, inspect examples, edit requests, and review prior responses when the hosted proxy is degraded. Conversely, the proxy should be able to shed load, reject expensive destinations, or temporarily disable unsafe redirect behavior without taking the whole application offline. This means request execution workers need independent autoscaling, circuit breakers by target origin, and a policy cache that fails closed for unknown high-risk destinations while allowing previously approved low-risk direct browser execution.
        </p>
        <p>
          Collaboration history should be explainable during incidents. When a saved request suddenly starts failing, users need to know whether the URL changed, an environment variable changed, a shared auth preset rotated, a workspace policy changed, or a backend service regressed. The collection model should preserve revision history at the field level for method, URL, headers, auth, body, and scripts, with comparison views that redact secrets but still show that a secret reference changed. This is the difference between a toy saved-request feature and an operational runbook surface.
        </p>
        <p>
          Authentication flows need their own architecture path. OAuth authorization code, device flow, client credentials, signed requests, mTLS, and API keys all have different storage, redirect, and replay risks. The playground should store token metadata separately from collection definitions, use short-lived tokens when possible, prevent public sharing of resolved auth state, and make refresh failure distinguishable from target API failure. For enterprise workspaces, administrators may require organization-managed OAuth apps or local agents so user tokens never traverse the SaaS proxy.
        </p>
        <p>
          Execution traces should be shareable without becoming payload archives. A useful trace includes request template, resolved target origin, policy decision, timing breakdown, redirect chain, response metadata, truncation status, and correlation IDs. It should omit bodies and secrets by default. This lets support teams and developers debug reproducibly while keeping the playground from turning into a shadow log store for customer data.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>
        <p>
          Browser direct calls minimize infrastructure cost and keep credentials away from the playground backend, but they fail against most third-party APIs because of CORS. A server proxy works everywhere and enables richer timing, but it creates SSRF, abuse, compliance, and trust risks. A desktop agent or browser extension can bypass CORS with less server exposure, but it increases installation friction and complicates enterprise rollout. A credible answer usually proposes direct-first execution, proxy fallback for authenticated users, and an optional local agent for enterprises that do not want tokens crossing the vendor backend.
        </p>
        <p>
          Local-first storage improves responsiveness and offline editing, but it creates multi-device consistency and data loss concerns. Server-first storage simplifies sync and backup, but it increases the chance of storing secrets and private request history centrally. For a developer tool, the safer default is local-private history plus explicit shared collections. Team features should sync request definitions and documentation while keeping per-user secrets separate.
        </p>
        <p>
          Last-write-wins collection sync is operationally simple and sufficient for most request edits, but it can silently overwrite teammate work. Operation-based collaboration or CRDTs are better for simultaneous rich editing, but most API playground edits are sparse and form-like. A pragmatic design uses revision checks and a conflict dialog for collection items, while reserving CRDT complexity for collaborative documentation fields if the product requires live co-editing.
        </p>
        <p>
          The snippet generator has its own trade-off. Client-side generation is fast, private, and cheap, but it must maintain language templates across SDK changes and auth schemes. Server-side generation centralizes templates and can embed official SDK patterns, but it requires sending more request detail to the backend and creates another place where tokens might be logged. For most playgrounds, the safer default is client-side generation with templates versioned alongside the frontend bundle, plus a server-delivered template registry only for official SDK snippets that need frequent updates.
        </p>
        <p>
          Observability should emphasize policy and reliability rather than payload capture. Teams often ask for full request logging to debug proxy failures, but that conflicts with secret safety. Better telemetry records normalized target origin, policy decision, response size bucket, duration breakdown, retry reason, and failure class. If deeper debugging is needed, it should be a short-lived, user-initiated diagnostic mode with aggressive redaction and clear consent.
        </p>
        <p>
          Extensibility is another important trade-off. Plugin systems for auth helpers, pre-request scripts, response assertions, and custom snippet templates make the product powerful, but they turn the playground into an execution environment for user-authored logic. A safe platform limits script capabilities, isolates execution, prevents arbitrary network access from scripts, exposes a narrow API for variables and request mutation, and clearly separates trusted official templates from community extensions.
        </p>
      </section>

      <section>
        <h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: latency, error rate, fallback rate, conversion, stale-state duration, and rollback success.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>
        <p>
          Treat the proxy like a production egress gateway. Enforce tenant and user quotas, block private networks by resolved address, disallow unrestricted redirects, bound timeouts, stream large responses to object storage or temporary buffers, and redact headers before logging. Keep proxy audit events useful without storing request bodies by recording actor, workspace, target origin, method, status class, duration bucket, and policy decision.
        </p>
        <p>
          Design the UI around safe developer velocity. Show variable resolution previews, make secret masking the default, warn before exporting possible secrets, preserve response tabs across retries, and give clear failure classification: DNS failure, TLS failure, timeout, CORS blocked, proxy policy denied, server error, or client cancellation. These distinctions matter during incident response because they prevent developers from chasing the wrong layer.
        </p>
        <p>
          Use environment and workspace policy as first-class product concepts. Enterprise administrators should be able to disable the hosted proxy, restrict allowed target domains, require a local agent, prevent public collection sharing, and enforce retention limits. Individual developers still get a fast local-first workflow, while the organization controls the high-risk egress and sharing surfaces. That combination is what makes the design credible for large companies rather than only useful for a hobby API client.
        </p>
        <p>
          Treat generated examples and saved responses as reviewable artifacts. A saved response may contain personal data, production identifiers, or sensitive error details. A generated snippet may accidentally inline a resolved token or tenant URL. The UI should preview what will be shared, detect suspicious secrets, and preserve provenance such as who saved the example, which environment was used, and whether sensitive fields were redacted.
        </p>
        <p>
          Design for large response and long-running request workflows explicitly. Some APIs stream events, return multi-gigabyte exports, or take minutes behind an asynchronous job. The playground should support response headers first, streaming preview, cancellation, timeout classification, and handoff from synchronous response inspection to job polling where the API exposes a status URL. It should not pretend every API call is a small JSON response. In a FAANG-style interview, this shows awareness that developer tools must handle real production APIs, not only documentation examples.
        </p>
        <p>
          Add a clear trust model for imported collections. Developers often import OpenAPI specs, cURL snippets, Postman collections, and examples from third parties. Imported material can contain malicious URLs, misleading auth presets, or scripts that exfiltrate variables. The system should sandbox imported scripts, show a review diff before adding secrets, and mark imported collections as untrusted until a workspace owner approves them. This matters because API playgrounds often become the fastest path from copied documentation to production credentials.
        </p>
        <p>
          Support reproducible request sharing without sharing secrets. A teammate should be able to open a failing request with method, URL template, headers, body shape, environment names, response metadata, and timing breakdown while still supplying their own secret values. The product can share redacted execution traces with correlation IDs and policy decisions so teams debug together without pasting tokens into chat.
        </p>
        <p>
          Make unsafe methods and production targets deliberate. The UI should classify requests by method, environment, target domain, and workspace policy. Sending a destructive request to a production base URL may require confirmation, reason capture, or a read-only dry-run mode when the API supports it. This is not only UX polish; it prevents a developer tool from becoming an accidental production mutation surface during debugging.
        </p>
        <p>
          Define retention and compliance boundaries clearly. Private history, shared collection revisions, saved examples, execution traces, and audit events should have different retention policies. Enterprise customers may require no response body storage, regional processing, or customer-managed encryption. Principal-level design should show how the architecture supports those controls without weakening the fast local workflow for ordinary developers.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: stale state, hidden partial failure, unbounded retries, ownership ambiguity, and missing observability.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>
        <p>
          The largest pitfall is building an open proxy. Even authenticated users can abuse a permissive proxy to scan internal networks, attack third-party systems, or exfiltrate metadata services. Another common mistake is logging full request headers and bodies for debugging; that turns the playground into a credential collection system. Teams also underestimate response rendering: placing hundreds of thousands of formatted lines into the DOM will freeze the browser and make the tool unusable exactly when debugging a large failure payload.
        </p>
        <p>
          A subtler pitfall is sharing secrets through collaboration features. Public collection links, workspace exports, and generated snippets must be reviewed for secret expansion. The product should share variable names and request structure by default, not resolved secret values. OAuth flows also need careful origin and redirect handling; otherwise the playground becomes a token interception surface.
        </p>
        <p>
          Another pitfall is allowing imported scripts or generated snippets to inherit too much power. A collection imported from an issue tracker or vendor doc might include pre-request scripts that read variables, mutate headers, or contact external hosts. If those scripts run automatically, the playground becomes an exfiltration tool. Imported collections should be untrusted, script execution should be explicit, and script APIs should be narrow.
        </p>
        <p>
          Teams also blur local agent and hosted proxy semantics. A local agent can reach private networks and may hold stronger credentials, so it needs device registration, workspace policy, update security, and clear connection status. Treating it as just another transport hides the fact that it expands the blast radius from a web app to a developer machine or corporate network.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>
        <p>
          Internal platform teams use API playgrounds to help application teams discover service contracts and debug staging issues without writing custom scripts. Public API companies use them to shorten time to first successful request and convert documentation readers into active integrators. Enterprise support teams use saved collections to reproduce customer issues, but they need strong workspace controls because request examples may contain customer identifiers or production-like payloads.
        </p>
        <p>
          During an outage, developers often use a playground to compare direct service behavior, gateway behavior, and authenticated customer behavior. That makes accurate timing, proxy transparency, request replay, and clear redaction policies more than convenience features. They directly affect diagnosis speed and blast radius control.
        </p>
        <p>
          API platform teams can embed the same playground into documentation and internal service catalogs. The embedded version should inherit the same execution policy, auth isolation, and redaction rules as the full product. Otherwise the company ends up with several inconsistent request runners, each with different logging and secret behavior.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>
        <h3>How would you securely support browser calls to arbitrary third-party APIs?</h3>
        <p>
          I would use direct browser execution when the target supports CORS, then fall back to an authenticated server proxy. The proxy would parse and normalize target URLs, resolve DNS server-side, block private and reserved networks, enforce redirect policy after every hop, cap request and response sizes, apply per-user and per-tenant rate limits, set short timeouts, and avoid logging sensitive headers or bodies. I would isolate proxy workers from the main application tier and emit policy-focused audit events. For enterprises with strict token policies, I would offer a local desktop or network agent so credentials do not traverse the SaaS proxy.
        </p>
        <h3>How should environment secrets work in shared collections?</h3>
        <p>
          Shared collections should contain variable references, not secret values. Each user or workspace can define environment values separately, and secret variables are masked in the UI, excluded from exports, excluded from public links, and redacted from snippets unless the user explicitly opts into a private copy. The system should scan exports for token-like values and warn before sharing. This preserves collaboration without turning the collection store into a secret manager.
        </p>
        <h3>How would you render very large responses without freezing the browser?</h3>
        <p>
          I would stream or incrementally decode the response, keep raw bytes or chunks outside the React render path, and render only a virtualized view of formatted lines or tree nodes. For responses above a threshold, the UI should show metadata and a preview with an option to download or open a dedicated raw view. Pretty-printing should happen in a worker for expensive formats, and HTML should be displayed as source rather than executed.
        </p>
        <h3>How would team sync handle conflicting edits to the same request?</h3>
        <p>
          I would version each collection item and send edits as revisioned operations. If the server sees that the base revision is stale, it can reject the write or create a conflict record. The client then shows a side-by-side diff of local and remote request fields. Last-write-wins is acceptable for low-value metadata, but method, URL, headers, auth, and body changes deserve explicit conflict review because silent overwrites can break shared workflows.
        </p>
        <h3>How would you support OAuth and enterprise token policies?</h3>
        <p>
          I would keep token state separate from collection definitions, use short-lived credentials, store refresh tokens only in approved secure storage, and prevent resolved tokens from entering exports, snippets, telemetry, or shared traces. OAuth redirect handling should use registered origins and state validation. Enterprise administrators should be able to require organization-managed OAuth apps, disable hosted proxy execution for sensitive APIs, or route execution through a local agent. The UI should explain whether a failure is an auth-refresh issue, policy denial, or target API failure.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul>
          <li>OWASP Server-Side Request Forgery Prevention Cheat Sheet.</li>
          <li>MDN Web Docs: Cross-Origin Resource Sharing and Fetch API behavior.</li>
          <li>Postman Learning Center: collections, environments, and workspaces.</li>
          <li>RFC 9110: HTTP Semantics.</li>
          <li>W3C Resource Timing specification.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
