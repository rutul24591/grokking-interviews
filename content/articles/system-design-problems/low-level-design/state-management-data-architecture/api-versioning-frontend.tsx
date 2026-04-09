"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-api-versioning-frontend",
  title: "API Versioning & Contract Management on Frontend",
  description:
    "Production-grade API versioning strategy — versioned adapters, schema validation with Zod, backward compatibility, graceful degradation, and breaking change migration.",
  category: "low-level-design",
  subcategory: "state-management-data-architecture",
  slug: "api-versioning-frontend",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-04-08",
  tags: ["lld", "api-versioning", "adapters", "zod", "backward-compatibility", "schema-validation"],
  relatedTopics: ["monorepo-store-boundaries", "client-side-data-normalization"],
};

export default function APIVersioningFrontendArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          Backend API evolves independently of the frontend. New API versions
          introduce field renames, type changes, and endpoint restructuring. The
          frontend must support multiple API versions simultaneously (some users
          on old version, some on new), gracefully handle breaking changes, and
          migrate without downtime. We need an API versioning strategy with
          versioned adapters, schema validation, backward compatibility layers,
          and automated breaking change detection.
        </p>
        <p><strong>Assumptions:</strong> React 19+, REST/GraphQL APIs, backend deploys independently.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Version Detection:</strong> Detect API version from response headers. Route to correct adapter based on version.</li>
          <li><strong>Versioned Adapters:</strong> Each API version has an adapter transforming response to canonical frontend schema.</li>
          <li><strong>Schema Validation:</strong> Zod schemas validate every API response. Invalid responses logged and handled gracefully.</li>
          <li><strong>Graceful Degradation:</strong> Missing optional fields use defaults. Missing required fields show error UI, not crash.</li>
          <li><strong>Breaking Change Detection:</strong> CI compares current API schema with previous version. Alerts on breaking changes (field removal, type change).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Backend deploys v2 but some users still hit v1 (CDN cache). Both versions must work simultaneously.</li>
          <li>API returns v3 response but frontend only supports v1-v2. Fallback to v1 adapter with warnings.</li>
          <li>Field renamed mid-response (some items have old field name, some have new). Adapter handles both.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          API responses include version header (X-API-Version: 2.1). Response
          passes through version detection middleware → routes to correct adapter
          (v1 adapter, v2 adapter) → adapter transforms to canonical schema →
          Zod validates → frontend consumes canonical data. Adapters for old
          versions maintained alongside new ones during transition period
          (2 deployment cycles). Breaking change detection in CI compares
          OpenAPI specs between versions.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules</h3>
        <p>Six modules:</p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Version Detector (<code>lib/api-version-detector.ts</code>)</h4>
          <p>Extracts API version from response headers. Maps version string to adapter. Falls back to oldest supported version if unrecognized.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Adapter Registry (<code>lib/adapter-registry.ts</code>)</h4>
          <p>Maps API versions to adapters. Register v1, v2, v3 adapters. Lookup by version returns correct adapter. Deprecation warnings for old versions.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Versioned Adapters (lib/adapters/vN/)</h4>
          <p>Per-version adapter transforms API response to canonical schema. Handles field renames, type coercions, missing field defaults. Pure functions.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Schema Validator (<code>lib/api-schema-validator.ts</code>)</h4>
          <p>Zod schemas for canonical data. Validates adapter output. Logs validation errors with field-level details. Invalid data triggers graceful degradation.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Breaking Change Detector (<code>tools/breaking-change-detector.ts</code>)</h4>
          <p>CI tool compares OpenAPI specs between versions. Detects field removals, type changes, required field additions. Blocks deployment on breaking changes without migration.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. React Integration (<code>hooks/useVersionedApi.ts</code>)</h4>
          <p>Hook that fetches via versioned pipeline. Returns data, API version, and deprecation status. Shows deprecation warning when API version is old.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/api-versioning-frontend-architecture.svg"
          alt="API versioning pipeline showing version detection, adapter routing, schema validation, and canonical data flow"
          caption="API Versioning Pipeline Architecture"
        />
      </section>

      <section>
        <h2>Data Flow</h2>
        <p>API response → version detector extracts version → adapter registry routes to correct adapter → adapter transforms to canonical schema → Zod validates → component consumes canonical data. On validation failure: log error, use defaults, show degraded UI.</p>
      </section>

      <section>
        <h2>Implementation</h2>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>Complete implementation: version detector, adapter registry, v1/v2 adapters, Zod schemas, breaking change detector, and React hook.</p>
        </div>
      </section>

      <section>
        <h2>Performance</h2>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">Version detection</td><td className="p-2">O(1) — header read</td></tr>
              <tr><td className="p-2">Adapter transform</td><td className="p-2">O(f) — f fields transformed</td></tr>
              <tr><td className="p-2">Zod validation</td><td className="p-2">O(f) — f fields validated</td></tr>
              <tr><td className="p-2">Breaking change detection</td><td className="p-2">O(n) — n API endpoints compared</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Security & Testing</h2>
        <p>All API responses validated against Zod schemas — no unvalidated data reaches components. Invalid responses logged with full context for debugging. Test: each adapter transforms correctly, Zod validation catches all schema violations, breaking change detector identifies field removals, fallback works for unsupported versions.</p>
      </section>

      <section>
        <h2>Interview Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>Coupling frontend to specific API version:</strong> Frontend assumes v2, backend returns v1 — crash. Fix: version detection + adapter pipeline.</li>
          <li><strong>No schema validation:</strong> API changes silently break frontend. Fix: Zod validation at API boundary, fail fast with clear errors.</li>
          <li><strong>Removing old adapters too early:</strong> Backend deprecates v1, frontend still has users on v1 CDN cache. Fix: maintain adapters for 2 deployment cycles after deprecation.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you coordinate frontend and backend deployments for breaking API changes?</p>
            <p className="mt-2 text-sm">
              A: Deploy backend first with backward compatibility (supports v1 and v2).
              Deploy frontend with v2 adapter. Monitor — when all traffic on v2,
              deprecate v1 on backend. This is a two-phase deploy: backend adds
              support for new version, frontend adopts it, backend removes old
              version. Never break old version until frontend migration is confirmed
              complete (analytics shows 0% on old version).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://zod.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Zod — TypeScript Schema Validation</a></li>
          <li><a href="https://swagger.io/specification/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OpenAPI Specification</a></li>
          <li><a href="https://semver.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Semantic Versioning 2.0</a></li>
          <li><a href="https://martinfowler.com/articles/breaking-changes.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Martin Fowler — Breaking Changes</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
