"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-profile-settings",
  title: "Profile Settings UI",
  description:
    "Comprehensive guide to implementing profile settings interfaces covering editable fields (display name, bio, avatar), validation, optimistic updates, image upload/cropping, privacy controls, concurrent modification handling, and UX patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "profile-settings-ui",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "profile",
    "settings",
    "frontend",
    "ux",
  ],
  relatedTopics: ["account-settings-ui", "security-settings-ui"],
};

export default function ProfileSettingsUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Profile Settings UI</strong> allows users to manage their public-facing profile
          information including display name, bio, avatar, and other personal details. It is one
          of the most frequently accessed settings pages and must provide a seamless editing
          experience while maintaining data integrity. Profile settings is often the first place
          users go to personalize their account.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/profile-settings-flow.svg"
          alt="Profile Settings Flow"
          caption="Profile Settings Flow — showing profile edit, validation, optimistic update, avatar upload, and privacy settings"
        />

        <p>
          For staff and principal engineers, implementing profile settings requires deep
          understanding of form design, validation, optimistic updates, image upload handling
          (cropping, CDN delivery), concurrent modification (prevent overwrites), and privacy
          controls. The implementation must balance ease of editing with data quality and abuse
          prevention.
        </p>
        <p>
          Modern profile settings has evolved from simple form submission to sophisticated editors
          with real-time validation, optimistic updates, image cropping, and privacy controls.
          Organizations like Twitter, LinkedIn, and GitHub provide comprehensive profile settings —
          users can edit display name, username, bio, avatar, cover image, and control visibility
          of each field.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Profile settings is built on fundamental concepts that determine how profile data is
          edited, validated, and saved. Understanding these concepts is essential for designing
          effective profile settings UI.
        </p>
        <p>
          <strong>Profile Fields:</strong> Display name (public name shown to other users —
          editable, validated for length/profanity), username/handle (unique identifier — @mention
          format, availability check), bio/about (short description — rich text or markdown,
          character limit 160-500), avatar/profile photo (image upload with cropping, multiple
          sizes generated), location (city, country — optional, privacy-aware), website/social
          links (personal website, Twitter, LinkedIn — URL validation).
        </p>
        <p>
          <strong>Validation:</strong> Real-time validation (on blur, not keystroke), server-side
          validation (never trust client), profanity filter (block inappropriate content),
          uniqueness check (username availability), length limits (min/max characters), format
          validation (URL format for links).
        </p>
        <p>
          <strong>Optimistic Updates:</strong> Update UI immediately (before server confirms),
          rollback on failure (show error, revert changes), queue changes (if offline, sync when
          online), conflict resolution (if concurrent edits, show merge UI).
        </p>
        <p>
          <strong>Avatar Management:</strong> Image upload (drag-drop, file picker), cropping
          (square aspect ratio for avatar), multiple sizes (thumbnail, medium, large — CDN
          delivery), compression (reduce file size), format conversion (convert to WebP for
          efficiency).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Profile settings architecture separates form handling from data persistence, enabling
          optimistic updates with reliable saves. This architecture is critical for providing
          responsive UX.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/profile-avatar-management.svg"
          alt="Profile Avatar Management"
          caption="Profile Avatar Management — showing upload flow, cropping, multiple size generation, CDN delivery, and caching"
        />

        <p>
          Profile edit flow: User navigates to profile settings. Frontend loads profile data (GET
          /profile). User edits fields (real-time validation on blur). User clicks save. Frontend
          updates UI immediately (optimistic update), sends save request (PUT /profile). Backend
          validates, saves, returns updated profile. Frontend confirms save (toast notification).
          On failure: rollback UI changes, show error message.
        </p>
        <p>
          Avatar upload flow: User clicks avatar. Frontend shows file picker (or drag-drop). User
          selects image. Frontend shows cropping UI (square aspect ratio). User crops, confirms.
          Frontend uploads to CDN (multipart upload for large files). CDN generates multiple sizes
          (thumbnail, medium, large). Frontend updates avatar with new URL. Backend updates profile
          with new avatar URL.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/profile-privacy.svg"
          alt="Profile Privacy"
          caption="Profile Privacy — showing field-level visibility controls, public/private profile, data sharing settings, and GDPR compliance"
        />

        <p>
          Privacy architecture includes: field-level visibility (each field has visibility setting
          — public, followers only, private), profile visibility (public/private profile), data
          sharing settings (allow search engines to index profile), GDPR compliance (download
          profile data, delete account). This architecture enables user control over privacy —
          users decide what to share and with whom.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing profile settings involves trade-offs between flexibility, simplicity, and data
          quality. Understanding these trade-offs is essential for making informed architecture
          decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Real-time vs Save Button</h3>
          <ul className="space-y-3">
            <li>
              <strong>Real-time (auto-save):</strong> Changes saved automatically, no explicit
              save. Seamless UX. Limitation: users may not know changes saved, accidental changes
              saved.
            </li>
            <li>
              <strong>Save Button:</strong> Explicit save, users control when changes saved. Clear
              state. Limitation: extra click, users may forget to save.
            </li>
            <li>
              <strong>Recommendation:</strong> Hybrid — auto-save with "Save" button. Auto-save
              after pause in typing, save button for explicit control. Show "Saving..." indicator.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Optimistic vs Pessimistic Updates</h3>
          <ul className="space-y-3">
            <li>
              <strong>Optimistic:</strong> Update UI immediately, rollback on failure. Fast UX.
              Limitation: complexity (rollback logic), confusing if frequent failures.
            </li>
            <li>
              <strong>Pessimistic:</strong> Wait for server confirmation before updating UI.
              Reliable. Limitation: slow UX (wait for network).
            </li>
            <li>
              <strong>Recommendation:</strong> Optimistic for profile edits (failures rare).
              Pessimistic for critical changes (username change — must confirm availability
              first).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Rich Text vs Plain Text Bio</h3>
          <ul className="space-y-3">
            <li>
              <strong>Rich Text:</strong> Formatting (bold, italic, links), expressive.
              Limitation: complexity (XSS prevention), inconsistent rendering.
            </li>
            <li>
              <strong>Plain Text:</strong> Simple, safe, consistent. Limitation: no formatting.
            </li>
            <li>
              <strong>Recommendation:</strong> Markdown — simple formatting (bold, italic, links)
              with safe rendering. Best of both — expressive but safe.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing profile settings requires following established best practices to ensure
          usability, data quality, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Form Design</h3>
        <p>
          Use clear labels — above input fields (not placeholder-only). Show character count — for
          fields with limits (bio: 0/160). Provide help text — explain requirements (username:
          "Letters, numbers, underscores only"). Show validation errors inline — below field, not
          at top of page. Preserve user input on error — don't clear fields.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Validation</h3>
        <p>
          Real-time validation on blur — not on every keystroke (annoying). Server-side validation
          — never trust client. Profanity filter — block inappropriate content. Uniqueness check —
          username availability (debounce API calls). Length limits — enforce min/max characters.
          Format validation — URL format for links.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Avatar Upload</h3>
        <p>
          Drag-drop support — in addition to file picker. Show cropping UI — square aspect ratio
          for avatar. Generate multiple sizes — thumbnail (50x50), medium (200x200), large
          (400x400). Compress images — reduce file size (WebP format). Show upload progress — for
          large files.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Privacy Controls</h3>
        <p>
          Field-level visibility — each field has visibility setting (public, followers, private).
          Profile visibility — public/private profile toggle. Data sharing settings — allow search
          engines to index. GDPR compliance — download profile data, delete account. Clear privacy
          labels — explain what each setting means.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing profile settings to ensure usable,
          maintainable, and secure profile settings.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>No character count:</strong> Users don't know limit until error.{" "}
            <strong>Fix:</strong> Show character count (0/160). Change color near limit
            (yellow/red).
          </li>
          <li>
            <strong>Validation on keystroke:</strong> Annoying, shows errors while typing.{" "}
            <strong>Fix:</strong> Validate on blur (when user leaves field). Show errors after
            typing stops.
          </li>
          <li>
            <strong>No username availability check:</strong> Users submit, then learn username
            taken. <strong>Fix:</strong> Real-time availability check (debounce API calls). Show
            available/unavailable indicator.
          </li>
          <li>
            <strong>No image cropping:</strong> Users upload rectangular images, avatar looks bad.{" "}
            <strong>Fix:</strong> Show cropping UI (square aspect ratio). Preview before upload.
          </li>
          <li>
            <strong>No upload progress:</strong> Users don't know if upload working.{" "}
            <strong>Fix:</strong> Show progress bar for large files. Show "Uploading..." indicator.
          </li>
          <li>
            <strong>No optimistic update:</strong> Users wait for save confirmation.{" "}
            <strong>Fix:</strong> Update UI immediately. Rollback on failure. Show "Saving..."
            indicator.
          </li>
          <li>
            <strong>No concurrent edit handling:</strong> Two tabs overwrite each other.{" "}
            <strong>Fix:</strong> Use versioning (ETag). Detect conflicts, show merge UI.
          </li>
          <li>
            <strong>No profanity filter:</strong> Inappropriate content in profiles.{" "}
            <strong>Fix:</strong> Server-side profanity filter. Block inappropriate content.
          </li>
          <li>
            <strong>No privacy controls:</strong> All profile data public by default.{" "}
            <strong>Fix:</strong> Field-level visibility settings. Default to private for sensitive
            fields.
          </li>
          <li>
            <strong>No avatar compression:</strong> Large images, slow loading. <strong>Fix:</strong>
            Compress images (WebP format). Generate multiple sizes for different contexts.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Profile settings is critical for user personalization. Here are real-world
          implementations from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Social Platform (Twitter)</h3>
        <p>
          <strong>Challenge:</strong> Millions of users editing profiles. Need fast, responsive
          editing. Image upload at scale.
        </p>
        <p>
          <strong>Solution:</strong> Optimistic updates (UI updates immediately). Image cropping
          for avatar/header. Multiple image sizes (CDN delivery). Real-time username availability.
          Character count for bio (160 chars).
        </p>
        <p>
          <strong>Result:</strong> Fast profile editing. High-quality avatars. Username conflicts
          prevented.
        </p>
        <p>
          <strong>UX:</strong> Optimistic updates, image cropping, character count.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Professional Network (LinkedIn)</h3>
        <p>
          <strong>Challenge:</strong> Professional profiles with many fields. Data quality
          important. Privacy controls critical.
        </p>
        <p>
          <strong>Solution:</strong> Section-by-section editing (experience, education, skills).
          Rich text for descriptions. Field-level visibility controls. Profile completeness score
          (encourage filling all fields).
        </p>
        <p>
          <strong>Result:</strong> High-quality professional profiles. Users control privacy.
          Profile completeness improved.
        </p>
        <p>
          <strong>UX:</strong> Section editing, visibility controls, completeness score.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Developer Platform (GitHub)</h3>
        <p>
          <strong>Challenge:</strong> Developer profiles with technical info. Markdown support for
          bio. Privacy for email.
        </p>
        <p>
          <strong>Solution:</strong> Markdown support for bio (rich formatting). Username
          availability check. Email privacy (hide/show public email). Contribution graph (public
          activity).
        </p>
        <p>
          <strong>Result:</strong> Expressive developer profiles. Email privacy maintained.
          Username conflicts prevented.
        </p>
        <p>
          <strong>UX:</strong> Markdown, availability check, email privacy.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Platform (Etsy)</h3>
        <p>
          <strong>Challenge:</strong> Seller profiles with shop info. Branding important. Trust
          signals needed.
        </p>
        <p>
          <strong>Solution:</strong> Shop banner upload. About section for seller story. Reviews
          displayed on profile. Verified seller badge. Social links for external presence.
        </p>
        <p>
          <strong>Result:</strong> Professional seller profiles. Trust signals for buyers. Seller
          branding enabled.
        </p>
        <p>
          <strong>UX:</strong> Banner upload, about section, trust badges.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform (Epic Games)</h3>
        <p>
          <strong>Challenge:</strong> Gamer profiles with gaming info. Avatar customization.
          Privacy for minors.
        </p>
        <p>
          <strong>Solution:</strong> Avatar customization (pre-made options). Display name (not
          username — changeable). Privacy controls for minors (limited profile visibility). Gaming
          stats display (optional).
        </p>
        <p>
          <strong>Result:</strong> Customizable gamer profiles. Minor privacy protected. Display
          name flexibility.
        </p>
        <p>
          <strong>UX:</strong> Avatar customization, display name, privacy controls.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of profile settings UI design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle real-time validation?</p>
            <p className="mt-2 text-sm">
              A: Validate on blur (when user leaves field), not on every keystroke (annoying).
              Debounce API calls (username availability — wait 300ms after typing stops). Show
              validation errors inline (below field). Server-side validation (never trust client).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement optimistic updates?</p>
            <p className="mt-2 text-sm">
              A: Update UI immediately (before server confirms). Send save request in background.
              On success: confirm save (toast notification). On failure: rollback UI changes, show
              error message ("Save failed, please try again"). Show "Saving..." indicator during
              save.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle avatar upload?</p>
            <p className="mt-2 text-sm">
              A: Drag-drop support + file picker. Show cropping UI (square aspect ratio). Generate
              multiple sizes (thumbnail, medium, large). Compress images (WebP format). Show upload
              progress. CDN delivery for images.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle concurrent edits?</p>
            <p className="mt-2 text-sm">
              A: Use versioning (ETag header). Include version in save request. Backend checks
              version — if mismatch, return conflict (409). Frontend shows merge UI ("Someone else
              edited this. Keep your changes or theirs?").
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement privacy controls?</p>
            <p className="mt-2 text-sm">
              A: Field-level visibility (each field has dropdown: public, followers, private).
              Profile visibility toggle (public/private profile). Data sharing settings (allow
              search engines). Clear labels ("Who can see this?"). Default to private for sensitive
              fields.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent profanity in profiles?</p>
            <p className="mt-2 text-sm">
              A: Server-side profanity filter (block inappropriate content). Client-side warning
              ("This may contain inappropriate content"). Allow appeals (false positives). Regular
              filter updates (new terms).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle username changes?</p>
            <p className="mt-2 text-sm">
              A: Real-time availability check (debounce API calls). Warn about impact ("Your old
              username will be released"). Rate limit changes (once per 30 days). Redirect old
              username to new profile (for a period).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize image delivery?</p>
            <p className="mt-2 text-sm">
              A: CDN for image delivery. Multiple sizes (serve appropriate size for context).
              Compression (WebP format). Lazy loading (load images when visible). Cache headers
              (long-term caching for avatars).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for profile settings?</p>
            <p className="mt-2 text-sm">
              A: Profile completion rate, avatar upload rate, save success/failure rate, validation
              error rate, time to complete profile. Set up alerts for anomalies — high failure rate
              (save issues), low completion rate (UX issues).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.nngroup.com/articles/profile-pages/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group - Profile Page Design
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Input Validation Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authentication Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OAuth 2.1 Security Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Security/Practical_security_guides/Authentication"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Authentication Security
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Multifactor Authentication
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Access Control Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authorization Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Forgot Password Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Credential Stuffing Prevention
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
