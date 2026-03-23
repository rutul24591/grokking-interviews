"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
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

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/profile-settings-flow.svg"
          alt="Profile Settings Flow"
          caption="Profile Settings Flow — showing profile update, avatar management, and privacy settings"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/profile-avatar-management.svg"
          alt="Profile Avatar Management"
          caption="Profile Avatar Management — showing upload, cropping, and CDN delivery"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/profile-privacy.svg"
          alt="Profile Privacy"
          caption="Profile Privacy — showing visibility controls, data sharing, and GDPR compliance"
        />
      
        <p>
          For staff and principal engineers, implementing profile settings requires
          understanding form design, validation, optimistic updates, image upload
          handling, concurrent modification, and privacy controls. The implementation
          must balance ease of editing with data quality and abuse prevention.
        </p>

        

        

        
      </section>

      <section>
        <h2>Core Requirements</h2>
        <p>
          A production-ready profile settings page must provide comprehensive profile management with clear UX.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Profile Fields</h3>
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

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Avatar Management</h3>
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
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Update Patterns</h3>
          <ul className="space-y-3">
            <li>
              <strong>Optimistic Updates:</strong> Update UI immediately, sync to server
              in background.
            </li>
            <li>
              <strong>Rollback:</strong> Revert on error, show error message.
              Preserve user's changes.
            </li>
            <li>
              <strong>Save Button:</strong> Enable save button on changes. Show
              "Save" or auto-save indicator.
            </li>
            <li>
              <strong>Auto-Save:</strong> Save on blur or after debounce (1-2
              seconds).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <ul className="space-y-2">
          <li>Clear field labels and help text</li>
          <li>Real-time validation feedback</li>
          <li>Optimistic updates for responsiveness</li>
          <li>Clear save confirmation</li>
          <li>Easy avatar upload and cropping</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Form Design</h3>
        <ul className="space-y-2">
          <li>Group related fields logically</li>
          <li>Show character counters for text fields</li>
          <li>Clear error messages</li>
          <li>Auto-save for long forms</li>
          <li>Handle concurrent edits gracefully</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Avatar Handling</h3>
        <ul className="space-y-2">
          <li>Support drag-and-drop upload</li>
          <li>Provide cropping tools</li>
          <li>Validate file type and size</li>
          <li>Generate multiple sizes</li>
          <li>Provide default avatar fallback</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Privacy</h3>
        <ul className="space-y-2">
          <li>Field-level privacy controls</li>
          <li>Show "view as" preview</li>
          <li>Support search visibility options</li>
          <li>Allow profile indexing control</li>
          <li>Respect user privacy preferences</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No validation:</strong> Invalid data accepted.
            <br /><strong>Fix:</strong> Real-time validation, clear error messages.
          </li>
          <li>
            <strong>No optimistic updates:</strong> Slow perceived performance.
            <br /><strong>Fix:</strong> Update UI immediately, sync in background.
          </li>
          <li>
            <strong>Poor avatar handling:</strong> Large files, wrong formats.
            <br /><strong>Fix:</strong> Client-side compression, format validation.
          </li>
          <li>
            <strong>No privacy controls:</strong> Users can't control visibility.
            <br /><strong>Fix:</strong> Field-level privacy, "view as" preview.
          </li>
          <li>
            <strong>No conflict handling:</strong> Concurrent edits overwrite each other.
            <br /><strong>Fix:</strong> Optimistic locking, version checking.
          </li>
          <li>
            <strong>Poor error handling:</strong> Lost changes on error.
            <br /><strong>Fix:</strong> Preserve user's changes, show clear errors.
          </li>
          <li>
            <strong>No rate limiting:</strong> Username changes abused.
            <br /><strong>Fix:</strong> Rate limit changes (once per 30 days).
          </li>
          <li>
            <strong>No profanity filter:</strong> Inappropriate names accepted.
            <br /><strong>Fix:</strong> Filter on save, warn or reject.
          </li>
          <li>
            <strong>No username availability check:</strong> Conflicts on save.
            <br /><strong>Fix:</strong> Real-time availability check on blur.
          </li>
          <li>
            <strong>Poor mobile UX:</strong> Hard to edit on mobile.
            <br /><strong>Fix:</strong> Mobile-optimized form, touch-friendly controls.
          </li>
        </ul>
      </section>

      <section>
        <h2>Advanced Topics</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Optimistic Updates</h3>
        <p>
          Update UI immediately before server confirmation for responsive UX.
        </p>
        <ul className="space-y-2">
          <li><strong>Implementation:</strong> Update local state, send request, rollback on failure.</li>
          <li><strong>Rollback:</strong> Preserve user's changes, show error, allow retry.</li>
          <li><strong>Use Case:</strong> Simple field updates (name, bio). Not for critical changes.</li>
          <li><strong>Benefits:</strong> Perceived instant response, better UX.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Avatar Processing</h3>
        <p>
          Process avatars for optimal display across devices.
        </p>
        <ul className="space-y-2">
          <li><strong>Cropping:</strong> Square crop with zoom/pan controls.</li>
          <li><strong>Compression:</strong> Optimize file size while maintaining quality.</li>
          <li><strong>Sizes:</strong> Generate thumbnail, medium, large sizes.</li>
          <li><strong>Formats:</strong> Convert to WebP for web, keep original.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Privacy Controls</h3>
        <p>
          Allow users to control profile visibility.
        </p>
        <ul className="space-y-2">
          <li><strong>Field-Level:</strong> Control visibility per field (public, followers, only me).</li>
          <li><strong>Preview:</strong> "View as public" to see public profile.</li>
          <li><strong>Search:</strong> Control search engine indexing.</li>
          <li><strong>Directory:</strong> Control visibility in user directory.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Concurrent Edits</h3>
        <p>
          Handle multiple users editing same profile.
        </p>
        <ul className="space-y-2">
          <li><strong>Version Check:</strong> Include version in update request.</li>
          <li><strong>Conflict Detection:</strong> Fail if version mismatch.</li>
          <li><strong>Resolution:</strong> Show conflict, let user choose version.</li>
          <li><strong>Auto-Merge:</strong> Merge non-conflicting changes automatically.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle optimistic updates?</p>
            <p className="mt-2 text-sm">
              A: Update UI immediately, send request to server. On success: done. On failure: rollback to previous state, show error, preserve user's changes, allow retry. Use for simple field updates, not critical changes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle avatar upload?</p>
            <p className="mt-2 text-sm">
              A: Click avatar → file picker → crop → preview → save. Support drag-and-drop. Validate file type (image), size (5MB), dimensions (min 200x200). Generate multiple sizes (thumbnail, medium, large). Compress for web. Provide default avatar fallback.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle username changes?</p>
            <p className="mt-2 text-sm">
              A: Real-time availability check on blur. Rate limit changes (once per 30 days). Warn about impact (broken links, mentions). Optionally reserve old username for 30 days (redirect to new). Update all references to username.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle privacy controls?</p>
            <p className="mt-2 text-sm">
              A: Field-level privacy (public, followers, only me). "View as public" preview. Search visibility toggle. Profile indexing control. Respect privacy preferences across platform. Allow bulk privacy settings.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle concurrent edits?</p>
            <p className="mt-2 text-sm">
              A: Optimistic locking with version field. Include version in update request. Fail if version mismatch (409 Conflict). Show conflict UI with both versions. Let user choose which version to keep. Auto-merge non-conflicting changes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you validate profile fields?</p>
            <p className="mt-2 text-sm">
              A: Real-time validation on blur. Length limits with counter. Format validation (URL, username characters). Profanity filter. Username availability check. Clear error messages. Preserve valid input on error.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle profile data export?</p>
            <p className="mt-2 text-sm">
              A: Include all profile fields, avatar images, change history. Machine-readable format (JSON) + human-readable (HTML). GDPR requirement—provide within 30 days of request. Allow downloading or emailing export.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for profile settings?</p>
            <p className="mt-2 text-sm">
              A: Profile completion rate, field edit frequency, save success/failure rate, avatar upload rate, privacy setting distribution, username change rate. Set up alerts for anomalies (spike in validation errors).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle profile deletion?</p>
            <p className="mt-2 text-sm">
              A: Confirmation dialog explaining impact. Grace period for recovery (30 days). Export data before deletion. Notify connected services. Handle orphaned content (posts, comments). Allow account reactivation during grace period.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li><a href="https://www.nngroup.com/articles/profile-pages/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">NN/g Profile Pages Best Practices</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Input Validation</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authentication Cheat Sheet</a></li>
          <li><a href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OAuth 2.1 Security Best Practices</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/Security" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">MDN - Web Security</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Security Questions</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Multifactor Authentication</a></li>
          <li><a href="https://docs.openfga.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OpenFGA - Fine-Grained Authorization</a></li>
          <li><a href="https://www.cerbos.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Cerbos - Policy as Code</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Access Control Cheat Sheet</a></li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Social Media Profile Settings</h3>
        <p>
          Social platform with 500M users managing public profiles and privacy settings.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Users need to control profile visibility. Username changes affect mentions. Avatar moderation required. Privacy settings complexity.</li>
          <li><strong>Solution:</strong> Granular privacy controls (public/friends/private). Username availability check. Avatar upload with AI moderation. Privacy preset templates.</li>
          <li><strong>Result:</strong> 80% users completed profiles. Privacy complaints reduced by 70%. Avatar approval time under 1 minute.</li>
          <li><strong>Security:</strong> Content moderation, username squatting prevention, privacy enforcement.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise Profile Settings</h3>
        <p>
          B2B SaaS with 10,000 enterprise customers, employee directory integration.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Profile data synced from HR system (Workday). Limited editable fields. Company branding per tenant. Directory visibility controls.</li>
          <li><strong>Solution:</strong> Read-only fields from HR (name, title). Editable: avatar, bio, timezone. Tenant-specific branding. Directory opt-out option.</li>
          <li><strong>Result:</strong> HR sync maintained. Employee satisfaction improved (some control). 90% directory participation.</li>
          <li><strong>Security:</strong> HR data integrity, tenant isolation, directory access controls.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform Profile</h3>
        <p>
          Online gaming platform with 100M users, gamertags, achievements display.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Unique gamertags across platform. Achievement showcase. Offensive name prevention. Cross-platform profile sync.</li>
          <li><strong>Solution:</strong> Gamertag uniqueness check. Achievement showcase builder. Profanity filter + report system. Cross-platform profile linking.</li>
          <li><strong>Result:</strong> 95% unique gamertags. Offensive names reduced by 90%. Cross-platform profiles working.</li>
          <li><strong>Security:</strong> Name moderation, impersonation prevention, report system.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Provider Profile</h3>
        <p>
          Telemedicine platform with 50,000 providers, credential verification.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Medical credentials must be verified. Specialty display. Availability settings. HIPAA-compliant photo guidelines.</li>
          <li><strong>Solution:</strong> Credential verification workflow (manual review). Specialty selection from approved list. Availability calendar. Professional photo requirements.</li>
          <li><strong>Result:</strong> 100% verified credentials. Patient trust improved. Provider satisfaction high.</li>
          <li><strong>Security:</strong> Credential verification, professional standards, HIPAA compliance.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Seller Profile</h3>
        <p>
          Multi-vendor marketplace with seller profiles and ratings.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Seller verification required. Rating display. Business info accuracy. Fraud prevention.</li>
          <li><strong>Solution:</strong> Seller verification (business license). Rating/review display. Business info validation. Fraud detection for profile changes.</li>
          <li><strong>Result:</strong> Verified seller badges increased trust. Fraud reduced by 80%. Buyer confidence improved.</li>
          <li><strong>Security:</strong> Seller verification, fraud detection, review integrity.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
