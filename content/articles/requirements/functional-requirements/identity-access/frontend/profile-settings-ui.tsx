"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-profile-settings",
  title: "Profile Settings UI",
  description: "Comprehensive guide to implementing profile settings interfaces covering editable fields, validation, optimistic updates, avatar management, privacy controls, and UX patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "profile-settings-ui",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "profile", "settings", "frontend", "ux"],
  relatedTopics: ["account-settings-ui", "security-settings", "privacy-controls", "content-management"],
};

export default function ProfileSettingsUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Profile Settings UI</strong> allows users to manage their public-facing 
          profile information including display name, bio, avatar, and other personal 
          details. It is one of the most frequently accessed settings pages and must 
          provide a seamless editing experience while maintaining data integrity.
        </p>
        <p>
          For staff and principal engineers, implementing profile settings requires 
          understanding form design, validation, optimistic updates, image upload 
          handling, concurrent modification, and privacy controls. The implementation 
          must balance ease of editing with data quality and abuse prevention.
        </p>
      </section>

      <section>
        <h2>Profile Fields</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Common Profile Fields</h3>
          <ul className="space-y-3">
            <li>
              <strong>Display Name:</strong> Public name shown to other users. 
              Editable, validated (length, profanity filter).
            </li>
            <li>
              <strong>Username/Handle:</strong> Unique identifier. @mention 
              format. Availability check.
            </li>
            <li>
              <strong>Bio/About:</strong> Short description. Rich text or 
              markdown. Character limit (160-500 chars).
            </li>
            <li>
              <strong>Avatar/Profile Photo:</strong> Image upload with cropping. 
              Multiple sizes generated.
            </li>
            <li>
              <strong>Location:</strong> City, country. Optional, privacy-aware.
            </li>
            <li>
              <strong>Website/Social Links:</strong> Personal website, Twitter, 
              LinkedIn, etc. URL validation.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Field Validation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Real-time Validation:</strong> Check username availability 
              on blur. Show errors inline.
            </li>
            <li>
              <strong>Length Limits:</strong> Min/max characters. Show counter 
              ("120/160").
            </li>
            <li>
              <strong>Format Validation:</strong> URL format for websites, valid 
              username characters.
            </li>
            <li>
              <strong>Profanity Filter:</strong> Block inappropriate names. 
              Warn or reject.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Avatar Management</h2>
        <ul className="space-y-3">
          <li>
            <strong>Upload Flow:</strong> Click avatar → file picker → crop → 
            preview → save. Drag-and-drop support.
          </li>
          <li>
            <strong>Cropping:</strong> Square crop for avatars. Zoom and pan 
            controls. Aspect ratio lock.
          </li>
          <li>
            <strong>Validation:</strong> File type (image only), size limit 
            (5MB), dimensions (min 200x200).
          </li>
          <li>
            <strong>Processing:</strong> Generate multiple sizes (thumbnail, 
            medium, large). Optimize file size.
          </li>
          <li>
            <strong>Default Avatar:</strong> Generate initials or identicon 
            if no avatar uploaded.
          </li>
        </ul>
      </section>

      <section>
        <h2>Update Patterns</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Optimistic Updates</h3>
          <ul className="space-y-3">
            <li>
              <strong>Pattern:</strong> Update UI immediately, sync to server 
              in background.
            </li>
            <li>
              <strong>Rollback:</strong> Revert on error, show error message. 
              Preserve user's changes.
            </li>
            <li>
              <strong>Use Case:</strong> Simple field updates (name, bio). Not 
              for critical changes (email, username).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Save Button Pattern</h3>
          <ul className="space-y-3">
            <li>
              <strong>Pattern:</strong> Enable save button on changes. Show 
              "Save" or auto-save indicator.
            </li>
            <li>
              <strong>Validation:</strong> Validate on save, show errors before 
              submitting.
            </li>
            <li>
              <strong>Feedback:</strong> "Changes saved" toast on success.
            </li>
            <li>
              <strong>Use Case:</strong> Critical changes (email, username), 
              complex forms.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Auto-Save Pattern</h3>
          <ul className="space-y-3">
            <li>
              <strong>Pattern:</strong> Save on blur or after debounce (1-2 
              seconds).
            </li>
            <li>
              <strong>Indicator:</strong> Show "Saving...", "Saved" status.
            </li>
            <li>
              <strong>Conflict:</strong> Handle concurrent edits with version 
              checking.
            </li>
            <li>
              <strong>Use Case:</strong> Rich text editors, long forms, 
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Privacy Controls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Field-Level Privacy:</strong> Per-field visibility 
            (public, followers, only me).
          </li>
          <li>
            <strong>Preview:</strong> "View as" feature to see public profile.
          </li>
          <li>
            <strong>Search Visibility:</strong> Option to hide from search 
            engines.
          </li>
          <li>
            <strong>Profile Indexing:</strong> Allow/disallow profile in 
            directory.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle concurrent profile edits?</p>
            <p className="mt-2 text-sm">
              A: Optimistic locking with version field. Include version in update 
              request. Fail if version mismatch, show conflict UI, let user resolve 
              (their changes vs server changes).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle username changes?</p>
            <p className="mt-2 text-sm">
              A: Check availability in real-time. Warn about impact (broken links, 
              mentions). Optionally reserve old username for 30 days (redirect to 
              new). Rate limit changes (once per 30 days) to prevent abuse.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize avatar uploads?</p>
            <p className="mt-2 text-sm">
              A: Client-side compression before upload, crop to square, generate 
              multiple sizes server-side, use CDN for delivery, lazy load avatars 
              in lists, use blur-up placeholder technique.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should profile changes require confirmation?</p>
            <p className="mt-2 text-sm">
              A: Simple changes (bio, name): no, auto-save or one-click save. 
              Critical changes (username, email): yes, confirmation dialog 
              explaining impact. irreversible changes: strong confirmation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle profile data export?</p>
            <p className="mt-2 text-sm">
              A: Include all profile fields, avatar images, change history. 
              Machine-readable format (JSON) + human-readable (HTML). GDPR 
              requirement—provide within 30 days of request.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent profile abuse?</p>
            <p className="mt-2 text-sm">
              A: Profanity filter on names/bio, image moderation for avatars, 
              rate limit profile changes, report mechanism for inappropriate 
              profiles, manual review queue for flagged content.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
