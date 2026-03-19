"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-frontend-accessibility",
  title: "Accessibility (A11y)",
  description: "Guide to implementing accessibility covering WCAG compliance, screen reader support, and keyboard navigation.",
  category: "functional-requirements",
  subcategory: "cross-cutting",
  slug: "accessibility",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "cross-cutting", "accessibility", "a11y", "frontend"],
  relatedTopics: ["wcag", "inclusive-design", "compliance"],
};

export default function AccessibilityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Accessibility</strong> ensures products are usable by people with 
          disabilities, covering visual, auditory, motor, and cognitive impairments.
        </p>
      </section>

      <section>
        <h2>WCAG Guidelines</h2>
        <ul className="space-y-3">
          <li><strong>Perceivable:</strong> Text alternatives, captions, adaptable content.</li>
          <li><strong>Operable:</strong> Keyboard navigation, sufficient time, no seizures.</li>
          <li><strong>Understandable:</strong> Readable, predictable, input assistance.</li>
          <li><strong>Robust:</strong> Compatible with assistive technologies.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <ul className="space-y-3">
          <li><strong>Semantic HTML:</strong> Proper headings, landmarks, labels.</li>
          <li><strong>ARIA:</strong> Roles, states, properties for dynamic content.</li>
          <li><strong>Testing:</strong> Screen reader testing, keyboard-only testing.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you test accessibility?</p>
            <p className="mt-2 text-sm">A: Automated tools (axe, Lighthouse), manual testing, screen reader testing, user testing with disabled users.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle dynamic content?</p>
            <p className="mt-2 text-sm">A: ARIA live regions, focus management, announce changes to screen readers, keyboard accessible.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
