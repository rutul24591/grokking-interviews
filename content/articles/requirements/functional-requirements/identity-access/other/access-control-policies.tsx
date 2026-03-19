"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-other-access-control-policies",
  title: "Access Control Policies",
  description: "Guide to implementing access control policies covering policy definition, evaluation engines, ABAC, and policy management.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "access-control-policies",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "access-control", "policies", "abac", "backend"],
  relatedTopics: ["rbac", "permission-validation", "sso-integrations"],
};

export default function AccessControlPoliciesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Access Control Policies</strong> define the rules that govern who can access 
          what resources under which conditions. Beyond simple RBAC, policies enable fine-grained, 
          context-aware authorization decisions.
        </p>
      </section>

      <section>
        <h2>Policy Types</h2>
        <ul className="space-y-3">
          <li><strong>RBAC:</strong> Role-based (user has role → has permissions).</li>
          <li><strong>ABAC:</strong> Attribute-based (user.department = resource.department).</li>
          <li><strong>ReBAC:</strong> Relationship-based (user is owner of resource).</li>
          <li><strong>PBAC:</strong> Policy-based (complex boolean expressions).</li>
        </ul>
      </section>

      <section>
        <h2>Policy Engines</h2>
        <ul className="space-y-3">
          <li><strong>OPA (Open Policy Agent):</strong> General-purpose policy engine.</li>
          <li><strong>Cedar:</strong> AWS's policy language.</li>
          <li><strong>Custom:</strong> In-house policy evaluation.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: RBAC vs ABAC?</p>
            <p className="mt-2 text-sm">A: RBAC for simple role-based access. ABAC for fine-grained, context-aware decisions. Hybrid approach common.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you manage policy changes?</p>
            <p className="mt-2 text-sm">A: Version policies, test before deploy, gradual rollout, audit all changes.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
