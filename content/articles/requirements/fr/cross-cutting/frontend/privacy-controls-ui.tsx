"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-frontend-privacy-controls",
  title: "Privacy Controls UI",
  description: "Guide to implementing privacy controls covering visibility settings, data sharing preferences, and privacy dashboard.",
  category: "functional-requirements",
  subcategory: "cross-cutting",
  slug: "privacy-controls-ui",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "cross-cutting", "privacy", "settings", "frontend"],
  relatedTopics: ["gdpr", "data-governance", "security-settings"],
};

export default function PrivacyControlsUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Privacy Controls UI</strong> enables users to manage their privacy 
          settings including profile visibility, data sharing, and communication 
          preferences.
        </p>
      </section>

      <section>
        <h2>Privacy Settings</h2>
        <ul className="space-y-3">
          <li><strong>Profile:</strong> Public, followers only, private.</li>
          <li><strong>Activity:</strong> Hide online status, read receipts.</li>
          <li><strong>Data:</strong> Data sharing with third parties.</li>
        </ul>
      </section>

      <section>
        <h2>Privacy Dashboard</h2>
        <ul className="space-y-3">
          <li><strong>Overview:</strong> Current privacy status.</li>
          <li><strong>Recommendations:</strong> Privacy improvement suggestions.</li>
          <li><strong>Export:</strong> Download privacy settings.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you make privacy settings discoverable?</p>
            <p className="mt-2 text-sm">A: Centralized privacy hub, contextual prompts, onboarding flow, periodic privacy checkups.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle privacy defaults?</p>
            <p className="mt-2 text-sm">A: Privacy by default (most restrictive), clear explanations, easy to adjust, respect regional requirements.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
