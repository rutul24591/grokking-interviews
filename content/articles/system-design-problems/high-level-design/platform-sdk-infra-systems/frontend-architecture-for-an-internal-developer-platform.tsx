"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-frontend-architecture-for-an-internal-developer-platform",
  title: "Design a Frontend Architecture for an Internal Developer Platform",
  description:
    "Architecture for an internal developer platform frontend: service catalog, self-service provisioning, deployment pipeline visibility, scaffolding, and plugin extensibility.",
  category: "high-level-design",
  subcategory: "platform-sdk-infra-systems",
  slug: "frontend-architecture-for-an-internal-developer-platform",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-10",
  tags: ["hld", "developer-platform", "idp", "backstage", "service-catalog", "scaffolding"],
  relatedTopics: ["multi-app-monorepo-management-dashboard", "frontend-hosting-platform-dashboard-like-vercel"],
};

export default function FrontendArchitectureForAnInternalDeveloperPlatformArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>An internal developer platform (IDP) is a self-service portal that enables software engineers to discover, create, deploy, and operate services without requiring manual intervention from platform or DevOps teams. The goal is developer autonomy: an engineer should be able to spin up a new service, configure its infrastructure, deploy it, and monitor it—all within the IDP UI—without opening a ticket or waiting for a platform engineer to execute commands on their behalf. The platform team builds and maintains the IDP; product engineering teams are its primary users.</p>
        <HighlightBlock as="p" tier="crucial">The frontend of an IDP has several distinct surface areas: a service catalog (discovery of all services, their ownership, dependencies, health, and documentation), a scaffolding wizard (create a new service from a template with the correct structure, CI configuration, and infrastructure boilerplate), a deployment pipeline dashboard (visibility into CI/CD pipeline status, environment promotions, rollbacks), and self-service provisioning workflows (request a database, an S3 bucket, a Kafka topic—triggering the underlying infrastructure automation without manual approval for standard resource types). Each surface area integrates with different backend systems (GitHub, Kubernetes, Terraform, PagerDuty, Datadog) via a unified IDP backend that acts as a BFF (Backend for Frontend) aggregating data from these systems.</HighlightBlock>
        <p><strong>Explicit assumptions:</strong> The platform serves 500–5,000 engineers. The IDP is inspired by Backstage (Spotify's open-source IDP framework). The service catalog is the central data model. Services are registered via YAML files in their own repositories (entity files checked into source control). The plugin architecture allows product teams to extend the IDP with domain-specific functionality without modifying the platform team's codebase. Authentication uses the company's internal SSO (Okta, Google Workspace).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Service catalog:</strong> Engineers can discover all services in the organization, filter by team, technology, domain, and lifecycle status. Each service has a detail page showing ownership, documentation, API specs, deployment status, and dependency graph.</li>
          <li><strong>Scaffolding:</strong> Engineers can create a new service by selecting a template (e.g., Node.js REST API, Python gRPC service, React SPA), filling in metadata (service name, team ownership, description), and triggering automated repository creation with correct structure, CI configuration, and infrastructure boilerplate.</li>
          <li><strong>Deployment visibility:</strong> Engineers can see their service's deployment pipelines, current deployment status per environment (dev, staging, production), recent deployments with commit SHAs and change diffs, and can trigger rollbacks to previous deployments.</li>
          <li><strong>Self-service provisioning:</strong> Engineers can request infrastructure resources (databases, queues, buckets) via forms. Standard requests are auto-approved and provisioned automatically. Non-standard requests enter an approval workflow.</li>
          <li><strong>Plugin extensibility:</strong> Product teams can add domain-specific pages and widgets to the IDP (a custom cost tracking widget, a data platform provisioner) by registering a plugin without modifying the core IDP codebase.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Discoverability:</strong> Engineers can find any service within 2 search queries. The search index is updated within 5 minutes of a service's catalog entry being updated.</li>
          <li><strong>Integration reliability:</strong> The IDP must gracefully degrade when an integrated system (GitHub, Kubernetes) is unavailable. Service catalog data is cached and displayed even when the source system is down.</li>
          <li><strong>Plugin safety:</strong> A plugin crash must not bring down the core IDP. Plugins are isolated from the core application's error boundary.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="crucial">The IDP frontend is a React application built on the Backstage framework (or a custom equivalent). The architecture has four layers: the core IDP shell (authentication, navigation, plugin host, error boundaries), the service catalog (the central data model and its UI surfaces), the workflow engines (scaffolding wizard, provisioning forms, deployment controls), and the plugin registry (first-party and third-party plugin modules loaded dynamically). A BFF layer aggregates data from GitHub, Kubernetes, Terraform Cloud, PagerDuty, and Datadog into IDP-specific API endpoints that the frontend consumes.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/frontend-architecture-for-an-internal-developer-platform-architecture.svg"
          alt="Internal developer platform architecture showing IDP shell (authentication via SSO, navigation, plugin host, global error boundary), service catalog (YAML entity files in repos → catalog ingestion service → catalog API → catalog UI with search, filters, entity detail pages), workflow engines (scaffolding wizard: template selection → metadata form → GitHub repo creation + CI setup; provisioning: resource request form → auto-approval policy → Terraform Cloud trigger), deployment dashboard (Kubernetes pod status, pipeline runs from CI/CD API), and plugin registry (dynamic module federation loading, plugin error boundary isolation)."
          caption="IDP architecture: SSO shell hosts service catalog (YAML ingestion), scaffolding wizard, provisioning workflows, deployment dashboard, and dynamically loaded plugins"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Service Catalog Data Model and Ingestion</h3>
        <HighlightBlock as="p" tier="important">The service catalog is a queryable database of all software entities in the organization: services, libraries, APIs, teams, and infrastructure components. Each entity is described by a YAML catalog file (catalog-info.yaml) checked into the entity's own repository. The catalog ingestion service polls GitHub for these files (triggered by webhooks on push events and by a periodic full scan) and ingests them into the catalog database. The YAML schema follows the Backstage entity model: apiVersion, kind (Component, API, Group, User, Resource), metadata (name, description, tags, annotations), and spec (type, lifecycle, owner, system, dependsOn).</HighlightBlock>
        <HighlightBlock as="p" tier="important">The dependsOn field creates the dependency graph between entities. A service's detail page renders this graph as an interactive dependency diagram showing upstream and downstream dependencies, colored by their health status (green: healthy, yellow: degraded, red: down). The graph data is computed at query time by traversing the dependsOn relationships in the catalog database. For large catalogs (thousands of services), the dependency graph traversal is limited to 3 hops (direct dependencies, their dependencies, and one more level) to prevent unbounded graph queries that could time out.</HighlightBlock>
        <p>Annotations: catalog entries can include annotations that link to external systems. kubernetes.io/deployment: my-service-deployment links the catalog entry to a specific Kubernetes deployment; pagerduty.com/service-id: PXXXXX links to a PagerDuty service. The IDP backend resolves these annotations to live data at query time: when a service's detail page loads, the backend fetches the linked Kubernetes pod status and PagerDuty on-call rotation and includes them in the entity response. This annotation system allows the IDP to aggregate data from any system without requiring centralized knowledge of every service's infrastructure details—the service team annotates their own catalog entry with the links, and the IDP follows the links.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Scaffolding Wizard</h3>
        <HighlightBlock as="p" tier="important">The scaffolding wizard is a multi-step form that guides the engineer through creating a new service. Step 1: select a template from the template catalog (templates are also registered as catalog entities with a kind: Template schema). Step 2: fill in template parameters (service name, team owner, database required, deployment region). Step 3: preview the files that will be created (the template engine renders the template with the provided parameters into a file tree preview). Step 4: confirm and trigger the scaffolding action.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The scaffolding action is executed by the Scaffolding Service (a backend job runner). The service creates a GitHub repository using the GitHub API, pushes the rendered template files, creates the necessary GitHub Actions workflow files (CI pipeline), registers the service in the team's infrastructure-as-code repository (adding a Terraform module for the service's basic infrastructure), and creates the initial catalog-info.yaml. The scaffolding job runs asynchronously (it takes 30–60 seconds); the wizard UI polls for job status via SSE or WebSocket and shows progress indicators for each step. On completion, the wizard provides a link to the new repository and the service's catalog entry (which appears within 5 minutes of the catalog ingestion scan).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Template authoring: templates are Nunjucks (or Handlebars) templates with a schema definition specifying the input parameters and their types. Template authors can test their templates via a preview API that renders the template without actually creating any resources. Templates are versioned (stored in Git) and can be promoted through a review process before being made available in the template catalog. The template catalog includes both platform team-maintained templates (the canonical Node.js service template) and team-contributed templates (a data engineering team's Spark job template).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Deployment Pipeline Dashboard</h3>
        <p>The deployment dashboard for a service shows the current state of all environments (dev, staging, production) in a parallel swimlane view. Each swimlane shows: the current deployed version (commit SHA, author, and message), deployment timestamp, deployment status (deploying, healthy, degraded, rolled back), and Kubernetes pod status (running pod count vs desired). The dashboard also shows the pipeline run history: the last 10 CI/CD pipeline runs with their status, trigger (push, manual, schedule), and links to individual build logs.</p>
        <HighlightBlock as="p" tier="important">Data aggregation: the IDP backend aggregates data from multiple sources to populate this view. Deployment status comes from the CD system (ArgoCD or Spinnaker). Kubernetes pod status comes from the Kubernetes API (proxied through the IDP backend—engineers do not have direct kubectl access; they interact with the cluster only through the IDP). Pipeline run history comes from the CI system (GitHub Actions, CircleCI, or Jenkins). The BFF aggregates these three sources into a unified response per service, caching each source independently (Kubernetes pod status cached for 10 seconds, pipeline history cached for 60 seconds, deployment status cached for 30 seconds) so that a slow GitHub Actions API does not block the rendering of Kubernetes status.</HighlightBlock>
        <p>Rollback: the rollback action allows engineers to redeploy a previous version of their service. The dashboard shows the last 20 successful deployments as rollback targets. Triggering a rollback fires an API call to the CD system to deploy the selected version. Rollbacks require the engineer to be a member of the service's owning team (verified by checking the team membership in the catalog database). The rollback action is audit-logged.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Plugin Architecture</h3>
        <p>The plugin system allows teams to extend the IDP with custom pages and widgets without modifying the core IDP codebase. Plugins are React components registered via a plugin manifest (a JSON file declaring the plugin's name, version, routes, sidebar navigation entry, and the URL of the plugin's JavaScript bundle). The IDP shell loads plugins at startup using Webpack Module Federation (or a custom dynamic import mechanism): the plugin's JavaScript bundle is fetched from a CDN URL specified in the manifest and executed in the shell's JavaScript context.</p>
        <HighlightBlock as="p" tier="important">Plugin isolation: each plugin is wrapped in an error boundary. If a plugin's React component throws an error, the error boundary catches it and renders a fallback (an error card with the plugin name and an error message) without crashing the surrounding IDP shell. This ensures a buggy plugin from one team does not break the IDP for all engineers. Plugins run in the same JavaScript context as the shell (not in an iframe), which is the correct choice for performance (no postMessage overhead) and UX (plugins can use the shell's navigation, authentication, and design system components). The security risk (a plugin can access the shell's JavaScript objects) is acceptable for an internal platform where all plugin authors are vetted engineers within the organization.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Plugin API: the shell provides a plugin API—a set of React hooks and components that plugins use to integrate with the shell. The API includes: useEntity() (access the current entity context when the plugin is on an entity detail page), useSsoToken() (access the authenticated user's SSO token for making API calls), useNavigate() (navigate to other IDP pages), and the design system component library. The plugin API is versioned; breaking changes require a major version bump with a migration period. Plugins declare which API version they depend on in their manifest, and the shell validates compatibility at plugin load time.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/frontend-architecture-for-an-internal-developer-platform-plugins.svg"
          alt="IDP plugin system showing plugin manifest (name, version, routes, sidebar entry, bundle URL), Webpack Module Federation loading at startup, error boundary isolation (plugin crash → error card, shell unaffected), plugin API (useEntity, useSsoToken, useNavigate, design system components), and plugin development workflow (local development server with hot reload, plugin registry submission, platform team review for public catalog listing)."
          caption="IDP plugin system: Module Federation loading, error boundary isolation, versioned plugin API (useEntity/useSsoToken/useNavigate), and local dev server for plugin authors"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Build your own IDP versus Backstage: Spotify's open-source Backstage is the de facto IDP framework, with a large plugin ecosystem and an active community. Building on Backstage provides the service catalog, plugin architecture, and many integrations out of the box, at the cost of adopting Backstage's architectural opinions (TypeScript, React, specific plugin API patterns) and dependency on the Backstage release cadence. Building a custom IDP from scratch provides complete flexibility but requires significant investment to reach feature parity. For most organizations, adopting Backstage (and customizing it via plugins) is the correct choice; a custom IDP is only justified for organizations with very specific architectural requirements or resources to maintain a custom platform long-term.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Self-service versus approval workflows: full self-service (all resource requests auto-approved and provisioned immediately) maximizes developer autonomy but requires robust guardrails (cost limits, resource quotas, compliance policy enforcement) automated into the provisioning pipeline. Without guardrails, self-service leads to resource sprawl and unexpected cost overruns. The recommended approach: define a set of standard resource types with pre-approved configurations (e.g., a small PostgreSQL instance with standard backup settings) that are auto-approved and provisioned immediately. Non-standard configurations (large instances, extended retention, cross-region replication) enter an approval workflow. This captures 80% of requests as self-service while providing a safety valve for unusual requirements.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Catalog staleness: if the catalog ingestion service fails or falls behind, the catalog shows stale data (outdated ownership, missing services). The staleness risk is mitigated by GitHub webhooks (push events trigger immediate re-ingestion of changed catalog files, rather than waiting for the periodic scan), by surfacing the "last updated" timestamp prominently on entity pages, and by showing a warning banner when the catalog has not been ingested in more than 30 minutes. Stale catalog data is generally better than no data (the old ownership information is still useful for routing questions), so the UI should show cached data with staleness indicators rather than error states.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">An internal developer platform frontend is a plugin-extensible React shell (built on Backstage or a custom equivalent) with four primary surfaces: service catalog (YAML entity files ingested from GitHub via webhooks → catalog database → searchable entity pages with annotation-driven live data aggregation), scaffolding wizard (template selection → parameter form → rendered file tree preview → async GitHub repo creation job with SSE progress), deployment dashboard (BFF aggregating Kubernetes pod status + CD deployment state + CI pipeline history, each independently cached), and self-service provisioning (standard resources auto-approved → Terraform Cloud trigger; non-standard → approval workflow). The plugin system uses Webpack Module Federation to load external plugin bundles at startup, wrapping each plugin in an error boundary to prevent plugin crashes from affecting the shell. The plugin API provides hooks (useEntity, useSsoToken, useNavigate) and design system components for plugin authors. The catalog ingestion's annotation system (kubernetes.io/deployment, pagerduty.com/service-id) allows any external system to be linked without centralized IDP knowledge—each team annotates their own catalog entry. The fundamental design goal is reducing time-to-autonomous-service from days (opening tickets) to minutes (self-service workflows).</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
